/**
 * Morphic Personalization Engine
 * Handles:
 * 1. Dynamic 20-question assessment generation across selected subjects & difficulty
 * 2. Assessment scoring & topic classification (Strong / Developing / Priority)
 * 3. Personalized multi-subject course schedule generation
 * 4. Personalized weekly timetable synthesis
 */

import {
  ClassLevel,
  Subject,
  Topic,
  Question,
  Assessment,
  AssessmentAnswer,
  SubjectScore,
  TopicScore,
  Course,
  CourseWeek,
  CourseDay,
  Lesson,
  StudyPreferences,
  TimetableBlock,
} from '../types';
import { DEMO_SUBJECTS, DEMO_TOPICS, DEMO_QUESTIONS } from '../data/demoData';
import {
  PREREQUISITE_QUESTIONS,
  getPrerequisiteQuestionsForClass,
  getPreviousClass,
} from '../data/prerequisiteQuestions';
import { getTopicsForClass, getSubjectsForClass } from '../data/classCurriculum';

export interface AllocationRatios {
  priorityPercent: number;
  developingPercent: number;
  strongPercent: number;
}

export const DEFAULT_ALLOCATION: AllocationRatios = {
  priorityPercent: 40,
  developingPercent: 35,
  strongPercent: 25,
};

/**
 * Generates a balanced 20-question assessment based on selected subjects
 * Specifically prioritizes questions checking previous class foundational knowledge!
 * (e.g. For Class 10, asks Class 9 prerequisite questions to diagnose gaps).
 */
export function generateAssessmentQuestions(
  selectedSubjectIds: string[],
  allQuestions: Question[] = DEMO_QUESTIONS,
  targetCount: number = 20,
  classLevel?: ClassLevel
): Question[] {
  const currentClass: ClassLevel = classLevel || 'Class 10';
  const prevClass = getPreviousClass(currentClass);

  // Retrieve prerequisite questions designed to check previous class knowledge
  const prereqQuestions = getPrerequisiteQuestionsForClass(currentClass, selectedSubjectIds, targetCount);

  // Combined candidate question pool
  const candidatePool: Question[] = [
    ...prereqQuestions,
    ...allQuestions.filter((q) => !prereqQuestions.some((pq) => pq.id === q.id)),
  ];

  if (selectedSubjectIds.length === 0) {
    if (currentClass === 'Class 10') {
      selectedSubjectIds = ['sub_c10_maths', 'sub_c10_science', 'sub_c10_english', 'sub_c10_social_science'];
    } else if (currentClass === 'Class 11') {
      selectedSubjectIds = ['sub_c11_maths', 'sub_c11_physics', 'sub_c11_chemistry', 'sub_c11_biology', 'sub_c11_english'];
    } else if (currentClass === 'Class 9') {
      selectedSubjectIds = DEMO_SUBJECTS.map((s) => s.id);
    } else {
      selectedSubjectIds = getSubjectsForClass(currentClass).map((s) => s.id);
    }
  }

  // Matching helper: matches subject ID or core subject domain (maths, science, etc.)
  const matchesSubject = (q: Question, sId: string) => {
    if (q.subjectId === sId) return true;
    const cleanSId = sId.replace(/^sub_c\d+_/, '').replace(/^sub_/, '');
    const cleanQId = q.subjectId.replace(/^sub_c\d+_/, '').replace(/^sub_/, '');
    return cleanSId === cleanQId;
  };

  const subjectQuestionMap: Record<string, Question[]> = {};
  selectedSubjectIds.forEach((sId) => {
    subjectQuestionMap[sId] = candidatePool.filter((q) => matchesSubject(q, sId));
  });

  const questionsPerSubject = Math.floor(targetCount / selectedSubjectIds.length);
  let remainder = targetCount % selectedSubjectIds.length;

  const selectedQuestions: Question[] = [];

  selectedSubjectIds.forEach((sId, index) => {
    const questionsForThisSubject = questionsPerSubject + (index < remainder ? 1 : 0);
    const pool = subjectQuestionMap[sId] || [];

    // Prioritize questions that test previous class knowledge
    const prereqPool = pool.filter((q) => q.prerequisiteClass || q.question.includes('Prerequisite'));
    const regularPool = pool.filter((q) => !q.prerequisiteClass && !q.question.includes('Prerequisite'));

    const picked: Question[] = [];

    // First pick from previous class prerequisite questions
    for (const q of prereqPool) {
      if (picked.length < questionsForThisSubject && !picked.some((p) => p.id === q.id)) {
        picked.push({ ...q, prerequisiteClass: q.prerequisiteClass || prevClass });
      }
    }

    // Then pick from regular pool if additional questions needed
    if (picked.length < questionsForThisSubject) {
      const easyPool = regularPool.filter((q) => q.difficulty === 'Easy');
      const medPool = regularPool.filter((q) => q.difficulty === 'Medium');
      const hardPool = regularPool.filter((q) => q.difficulty === 'Hard');

      const pickFrom = (source: Question[]) => {
        const shuffled = [...source].sort(() => 0.5 - Math.random());
        for (const q of shuffled) {
          if (picked.length < questionsForThisSubject && !picked.some((p) => p.id === q.id)) {
            picked.push({ ...q, prerequisiteClass: q.prerequisiteClass || prevClass });
          }
          if (picked.length >= questionsForThisSubject) break;
        }
      };

      pickFrom(easyPool);
      pickFrom(medPool);
      pickFrom(hardPool);
      pickFrom(regularPool);
    }

    // Tag any untagged question with the prerequisite class
    picked.forEach((q) => {
      if (!q.prerequisiteClass) {
        q.prerequisiteClass = prevClass;
      }
    });

    selectedQuestions.push(...picked);
  });

  // If still fewer than targetCount, backfill from candidatePool
  if (selectedQuestions.length < targetCount) {
    for (const q of candidatePool) {
      if (!selectedQuestions.some((p) => p.id === q.id)) {
        selectedQuestions.push({
          ...q,
          prerequisiteClass: q.prerequisiteClass || prevClass,
        });
      }
      if (selectedQuestions.length >= targetCount) break;
    }
  }

  return selectedQuestions.slice(0, targetCount);
}

/**
 * Analyzes answers from the 20-question assessment
 */
export function analyzeAssessment(
  userId: string,
  userClass: ClassLevel,
  answers: AssessmentAnswer[],
  questions: Question[] = DEMO_QUESTIONS,
  allSubjects: Subject[] = DEMO_SUBJECTS,
  allTopics: Topic[] = DEMO_TOPICS
): Assessment {
  const questionMap = new Map<string, Question>();
  questions.forEach((q) => questionMap.set(q.id, q));

  const subjectMap = new Map<string, Subject>();
  allSubjects.forEach((s) => subjectMap.set(s.id, s));

  const topicMap = new Map<string, Topic>();
  allTopics.forEach((t) => topicMap.set(t.id, t));

  // Tally subject and topic scores
  const subjectAgg: Record<
    string,
    { total: number; correct: number; subjectId: string; subjectName: string }
  > = {};
  const topicAgg: Record<
    string,
    {
      total: number;
      correct: number;
      topicId: string;
      topicName: string;
      subjectId: string;
      subjectName: string;
    }
  > = {};

  let totalCorrect = 0;

  answers.forEach((ans) => {
    const q = questionMap.get(ans.questionId);
    if (!q) return;

    if (ans.isCorrect) {
      totalCorrect++;
    }

    // Subject
    if (!subjectAgg[q.subjectId]) {
      const s = subjectMap.get(q.subjectId);
      subjectAgg[q.subjectId] = {
        total: 0,
        correct: 0,
        subjectId: q.subjectId,
        subjectName: s ? s.name : q.subjectId,
      };
    }
    subjectAgg[q.subjectId].total += 1;
    if (ans.isCorrect) subjectAgg[q.subjectId].correct += 1;

    // Topic
    if (!topicAgg[q.topicId]) {
      const t = topicMap.get(q.topicId);
      const s = subjectMap.get(q.subjectId);
      topicAgg[q.topicId] = {
        total: 0,
        correct: 0,
        topicId: q.topicId,
        topicName: t ? t.name : q.topicId,
        subjectId: q.subjectId,
        subjectName: s ? s.name : q.subjectId,
      };
    }
    topicAgg[q.topicId].total += 1;
    if (ans.isCorrect) topicAgg[q.topicId].correct += 1;
  });

  const totalAnswered = answers.length || 1;
  const overallScore = Math.round((totalCorrect / totalAnswered) * 100);

  let overallLevel: 'Beginner' | 'Intermediate' | 'Advanced' = 'Intermediate';
  if (overallScore >= 80) overallLevel = 'Advanced';
  else if (overallScore < 60) overallLevel = 'Beginner';

  // Build subject scores
  const subjectScores: SubjectScore[] = Object.values(subjectAgg).map((s) => {
    const percentage = Math.round((s.correct / (s.total || 1)) * 100);
    let status: 'Strong' | 'Developing' | 'Needs Attention' = 'Needs Attention';
    if (percentage >= 80) status = 'Strong';
    else if (percentage >= 60) status = 'Developing';

    return {
      subjectId: s.subjectId,
      subjectName: s.subjectName,
      totalQuestions: s.total,
      correctAnswers: s.correct,
      percentage,
      status,
    };
  });

  // Build topic scores
  const topicScores: TopicScore[] = Object.values(topicAgg).map((t) => {
    const percentage = Math.round((t.correct / (t.total || 1)) * 100);
    let status: 'Strong' | 'Developing' | 'Priority' = 'Priority';
    let diagnosticFeedback = `Your assessment suggests that "${t.topicName}" needs focused foundational practice.`;

    if (percentage >= 80) {
      status = 'Strong';
      diagnosticFeedback = `You demonstrated solid mastery of "${t.topicName}". Continue to reinforce through practice.`;
    } else if (percentage >= 60) {
      status = 'Developing';
      diagnosticFeedback = `You have partial conceptual understanding in "${t.topicName}". A few targeted reviews will solidify your confidence.`;
    }

    return {
      topicId: t.topicId,
      topicName: t.topicName,
      subjectId: t.subjectId,
      subjectName: t.subjectName,
      totalQuestions: t.total,
      correctAnswers: t.correct,
      percentage,
      status,
      diagnosticFeedback,
    };
  });

  return {
    id: `assess_${Date.now()}`,
    userId,
    class: userClass,
    overallScore,
    overallLevel,
    subjectScores,
    topicScores,
    createdAt: new Date().toISOString(),
    answers,
  };
}

/**
 * Generates a 4-week personalized course based on assessment analysis
 * Allocates topics according to priority (Priority ~40%, Developing ~35%, Strong ~25%)
 */
export function generatePersonalizedCourse(
  userId: string,
  userClass: ClassLevel,
  assessment: Assessment,
  preferences: StudyPreferences,
  allTopics?: Topic[],
  ratios: AllocationRatios = DEFAULT_ALLOCATION,
  allSubjects?: Subject[]
): Course {
  const activeDays = preferences.studyDays.length > 0
    ? preferences.studyDays
    : (['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const);

  // Load proper class topics and subjects if not supplied or mismatched
  const classTopics = (allTopics && allTopics.length > 0)
    ? allTopics
    : (userClass === 'Class 9' ? DEMO_TOPICS : getTopicsForClass(userClass));

  const classSubjects = (allSubjects && allSubjects.length > 0)
    ? allSubjects
    : (userClass === 'Class 9' ? DEMO_SUBJECTS : getSubjectsForClass(userClass));

  // Group topics by status
  const topicScoreMap = new Map<string, TopicScore>();
  if (assessment?.topicScores) {
    assessment.topicScores.forEach((ts) => topicScoreMap.set(ts.topicId, ts));
  }

  // Determine priority for all topics in the student's subjects
  const subjectIds = assessment?.subjectScores?.map((s) => s.subjectId) || [];
  let relevantTopics = classTopics.filter((t) => subjectIds.includes(t.subjectId));
  if (relevantTopics.length === 0) {
    relevantTopics = classTopics;
  }

  const priorityTopics: Topic[] = [];
  const developingTopics: Topic[] = [];
  const strongTopics: Topic[] = [];

  relevantTopics.forEach((t) => {
    const score = topicScoreMap.get(t.id);
    if (!score) {
      // If not directly tested, inherit from subject score
      const subj = assessment?.subjectScores?.find((s) => s.subjectId === t.subjectId);
      if (subj?.status === 'Needs Attention') priorityTopics.push(t);
      else if (subj?.status === 'Developing') developingTopics.push(t);
      else strongTopics.push(t);
    } else {
      if (score.status === 'Priority') priorityTopics.push(t);
      else if (score.status === 'Developing') developingTopics.push(t);
      else strongTopics.push(t);
    }
  });

  // Calculate lessons per day based on daily study time (e.g. 30min -> 1 lesson, 60min -> 2 lessons, etc.)
  const lessonsPerDay = Math.min(3, Math.max(1, Math.floor(preferences.dailyMinutes / 40)));

  // Total lesson slots for a 4-week course
  const totalSlots = 4 * activeDays.length * lessonsPerDay;

  // Distribute slots across tiers
  const targetPriority = Math.round((ratios.priorityPercent / 100) * totalSlots);
  const targetDeveloping = Math.round((ratios.developingPercent / 100) * totalSlots);
  const targetStrong = totalSlots - targetPriority - targetDeveloping;

  // Create weighted lesson list
  const lessonQueue: Array<{ topic: Topic; category: 'Priority' | 'Developing' | 'Strong' }> = [];

  const fillQueue = (pool: Topic[], count: number, category: 'Priority' | 'Developing' | 'Strong') => {
    if (pool.length === 0) return;
    for (let i = 0; i < count; i++) {
      const topic = pool[i % pool.length];
      lessonQueue.push({ topic, category });
    }
  };

  fillQueue(priorityTopics.length > 0 ? priorityTopics : relevantTopics, targetPriority, 'Priority');
  fillQueue(developingTopics.length > 0 ? developingTopics : relevantTopics, targetDeveloping, 'Developing');
  fillQueue(strongTopics.length > 0 ? strongTopics : relevantTopics, targetStrong, 'Strong');

  // Interleave and balance subjects across days so the student doesn't do all Maths in one day
  const weeks: CourseWeek[] = [];
  let lessonCounter = 1;

  for (let w = 1; w <= 4; w++) {
    const days: CourseDay[] = [];

    activeDays.forEach((dayName) => {
      const dayLessons: Lesson[] = [];

      for (let l = 0; l < lessonsPerDay; l++) {
        if (lessonQueue.length === 0) {
          // Re-seed from relevant topics if exhausted
          const t = relevantTopics[(lessonCounter - 1) % relevantTopics.length];
          lessonQueue.push({ topic: t, category: 'Developing' });
        }

        const nextItem = lessonQueue.shift()!;
        const subj = classSubjects.find((s) => s.id === nextItem.topic.subjectId) ||
          DEMO_SUBJECTS.find((s) => s.id === nextItem.topic.subjectId);

        let subjectName = subj ? subj.name : 'Curriculum';
        if (!subj) {
          const sIdLower = nextItem.topic.subjectId.toLowerCase();
          if (sIdLower.includes('math')) subjectName = 'Mathematics';
          else if (sIdLower.includes('phys')) subjectName = 'Physics';
          else if (sIdLower.includes('chem')) subjectName = 'Chemistry';
          else if (sIdLower.includes('bio')) subjectName = 'Biology';
          else if (sIdLower.includes('sci')) subjectName = 'Science';
          else if (sIdLower.includes('eng')) subjectName = 'English';
          else if (sIdLower.includes('soc')) subjectName = 'Social Science';
        }

        dayLessons.push({
          id: `les_${w}_${dayName.toLowerCase()}_${l + 1}_${nextItem.topic.id}`,
          subjectId: nextItem.topic.subjectId,
          subjectName,
          topicId: nextItem.topic.id,
          topicName: nextItem.topic.name,
          lessonNumber: lessonCounter++,
          title: `${nextItem.topic.name}: Comprehensive Concept Review`,
          description: `Detailed exploration of ${nextItem.topic.name} with instructional breakdown and targeted exercises.`,
          durationMinutes: nextItem.topic.durationMinutes || 35,
          youtubeUrl: `https://www.youtube.com/watch?v=${nextItem.topic.youtubeVideoId}`,
          youtubeVideoId: nextItem.topic.youtubeVideoId,
          channelName: nextItem.topic.youtubeChannel,
          thumbnailUrl: `https://img.youtube.com/vi/${nextItem.topic.youtubeVideoId}/hqdefault.jpg`,
          learningOutcomes: nextItem.topic.learningOutcomes,
          practiceQuestionIds: DEMO_QUESTIONS.filter((q) => q.topicId === nextItem.topic.id).map((q) => q.id),
          completed: false,
          priorityCategory: nextItem.category,
          educatorOptions: nextItem.topic.educatorOptions,
        });
      }

      days.push({
        dayName,
        lessons: dayLessons,
      });
    });

    weeks.push({
      id: `week_${w}`,
      weekNumber: w,
      title: `Week ${w}: ${w === 1 ? 'Foundations & Diagnostic Recovery' : w === 2 ? 'Core Concept Solidification' : w === 3 ? 'Advanced Application' : 'Mastery & Synthesis'}`,
      days,
    });
  }

  return {
    id: `course_${Date.now()}`,
    userId,
    class: userClass,
    title: `${userClass} Personalized Learning Path`,
    createdAt: new Date().toISOString(),
    weeks,
    allocationStats: ratios,
  };
}

/**
 * Builds weekly timetable blocks from generated course and study preferences
 */
export function generateTimetable(
  userId: string,
  course: Course,
  preferences: StudyPreferences
): TimetableBlock[] {
  const blocks: TimetableBlock[] = [];
  const week1 = course.weeks[0];
  if (!week1) return blocks;

  // Base start hour depending on preference
  let baseHour = 16; // 4:00 PM default (Afternoon/Evening)
  if (preferences.preferredTime === 'Morning') baseHour = 8;
  else if (preferences.preferredTime === 'Afternoon') baseHour = 14;
  else if (preferences.preferredTime === 'Evening') baseHour = 17;
  else if (preferences.preferredTime === 'Night') baseHour = 20;

  const formatTime = (hour: number, minute: number) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    const displayMin = minute === 0 ? '00' : minute < 10 ? `0${minute}` : `${minute}`;
    return `${displayHour}:${displayMin} ${period}`;
  };

  week1.days.forEach((day) => {
    let currentHour = baseHour;
    let currentMinute = 0;

    day.lessons.forEach((lesson) => {
      const startStr = formatTime(currentHour, currentMinute);
      const endTotalMin = currentMinute + lesson.durationMinutes;
      const endHour = currentHour + Math.floor(endTotalMin / 60);
      const endMin = endTotalMin % 60;
      const endStr = formatTime(endHour, endMin);

      blocks.push({
        id: `tt_${day.dayName}_${lesson.id}`,
        userId,
        lessonId: lesson.id,
        lessonTitle: lesson.title,
        subjectName: lesson.subjectName,
        topicName: lesson.topicName,
        day: day.dayName,
        startTime: startStr,
        endTime: endStr,
        durationMinutes: lesson.durationMinutes,
        type: 'lesson',
        completed: Boolean(lesson.completed),
      });

      // Update pointer with 10-min break
      const nextTotalMin = endMin + 10;
      currentHour = endHour + Math.floor(nextTotalMin / 60);
      currentMinute = nextTotalMin % 60;
    });

    // Add a dedicated practice block
    const practiceStart = formatTime(currentHour, currentMinute);
    const pTotalMin = currentMinute + 20;
    const pEndHour = currentHour + Math.floor(pTotalMin / 60);
    const pEndMin = pTotalMin % 60;
    const practiceEnd = formatTime(pEndHour, pEndMin);

    blocks.push({
      id: `tt_${day.dayName}_practice`,
      userId,
      lessonId: day.lessons[0]?.id || 'general_practice',
      lessonTitle: `${day.lessons[0]?.subjectName || 'Daily'} Concept Mastery Practice`,
      subjectName: day.lessons[0]?.subjectName || 'Practice',
      topicName: 'Active Recall & Drill',
      day: day.dayName,
      startTime: practiceStart,
      endTime: practiceEnd,
      durationMinutes: 20,
      type: 'practice',
      completed: false,
    });
  });

  return blocks;
}
