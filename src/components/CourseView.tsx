import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Calendar,
  Clock,
  PlayCircle,
  CheckCircle2,
  ChevronRight,
  Sliders,
  Sparkles,
  Search,
  Check,
  GraduationCap,
  Layers,
  Filter,
  UserCheck,
  BookCheck,
} from 'lucide-react';
import { Course, Lesson, ClassLevel, Topic } from '../types';
import { OfficialBooksList } from './OfficialBooksList';
import { getTopicsForClass, getSubjectsForClass, ALL_CLASSES } from '../data/classCurriculum';

interface CourseViewProps {
  course: Course;
  userClass?: ClassLevel;
  onSelectLesson: (lesson: Lesson) => void;
  onViewTimetable: () => void;
  onSwitchClass?: (newClass: ClassLevel) => void;
}

export const CourseView: React.FC<CourseViewProps> = ({
  course,
  userClass,
  onSelectLesson,
  onViewTimetable,
  onSwitchClass,
}) => {
  const activeClass: ClassLevel = userClass || course.class || 'Class 10';
  const [viewMode, setViewMode] = useState<'schedule' | 'syllabus'>('syllabus');
  const [activeWeek, setActiveWeek] = useState<number>(1);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Fetch all curriculum topics and subjects for the active class
  const classTopics = useMemo(() => getTopicsForClass(activeClass), [activeClass]);
  const classSubjects = useMemo(() => getSubjectsForClass(activeClass), [activeClass]);

  // Selected week data for the schedule view
  const weeks = course.weeks && course.weeks.length > 0 ? course.weeks : [];
  const selectedWeekData = weeks.find((w) => w.weekNumber === activeWeek) || weeks[0];

  // Filter topics for the Full Syllabus view
  const filteredTopics = useMemo(() => {
    return classTopics.filter((t) => {
      const matchesSubject = selectedSubjectId === 'all' || t.subjectId === selectedSubjectId;
      const matchesSearch =
        searchQuery.trim() === '' ||
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.youtubeTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.youtubeChannel.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSubject && matchesSearch;
    });
  }, [classTopics, selectedSubjectId, searchQuery]);

  // Convert a topic to a full playable Lesson
  const handleLaunchTopicLesson = (topic: Topic) => {
    const subject = classSubjects.find((s) => s.id === topic.subjectId);
    let subjectName = subject?.name || 'Curriculum';
    if (!subject) {
      const sIdLower = topic.subjectId.toLowerCase();
      if (sIdLower.includes('math')) subjectName = 'Mathematics';
      else if (sIdLower.includes('phys')) subjectName = 'Physics';
      else if (sIdLower.includes('chem')) subjectName = 'Chemistry';
      else if (sIdLower.includes('bio')) subjectName = 'Biology';
      else if (sIdLower.includes('sci')) subjectName = 'Science';
      else if (sIdLower.includes('eng')) subjectName = 'English';
      else if (sIdLower.includes('soc')) subjectName = 'Social Science';
    }

    const lesson: Lesson = {
      id: `les_${topic.id}`,
      subjectId: topic.subjectId,
      subjectName,
      topicId: topic.id,
      topicName: topic.name,
      lessonNumber: topic.order,
      title: `${topic.name}: Comprehensive Concept Review`,
      description: `Detailed instructional lesson covering core theory, solved examples, and exam applications for ${topic.name}.`,
      durationMinutes: topic.durationMinutes || 45,
      youtubeUrl: `https://www.youtube.com/watch?v=${topic.youtubeVideoId}`,
      youtubeVideoId: topic.youtubeVideoId,
      channelName: topic.youtubeChannel,
      thumbnailUrl: `https://img.youtube.com/vi/${topic.youtubeVideoId}/hqdefault.jpg`,
      learningOutcomes: topic.learningOutcomes,
      practiceQuestionIds: [],
      completed: false,
      priorityCategory: topic.difficulty === 'Hard' ? 'Priority' : topic.difficulty === 'Medium' ? 'Developing' : 'Strong',
      educatorOptions: topic.educatorOptions,
    };

    onSelectLesson(lesson);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-10 px-4 sm:px-6 lg:px-8 pb-24">
      <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">

        {/* ================= Class Switcher Header ================= */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                Select Your Class & Curriculum
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-950 font-display flex items-center gap-2">
                <span>CBSE & NCERT Standardized Courses</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Check className="w-3 h-3 text-emerald-600" />
                  Class 10 & 11 Ready
                </span>
              </h2>
            </div>

            <div className="text-xs text-slate-500">
              Total <strong className="text-slate-900">{classTopics.length} chapters</strong> across <strong className="text-slate-900">{classSubjects.length} subjects</strong>
            </div>
          </div>

          {/* Class Select Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {ALL_CLASSES.map((cls) => {
              const isSelected = cls === activeClass;
              const isPopular = cls === 'Class 10' || cls === 'Class 11';
              return (
                <button
                  key={cls}
                  id={`course-select-class-${cls.replace(' ', '-').toLowerCase()}`}
                  onClick={() => onSwitchClass?.(cls)}
                  className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
                    isSelected
                      ? 'bg-slate-950 text-white shadow-md'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <GraduationCap className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`} />
                  <span>{cls}</span>
                  {isPopular && (
                    <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase ${
                      isSelected ? 'bg-amber-400 text-slate-950' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      Full Course
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ================= Course Banner ================= */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>{activeClass} Curriculum & Masterclasses</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-display">
              {activeClass} Full Real Course
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Complete NCERT syllabus with structured chapter masterclasses from India’s top educators (Physics Wallah, Prashant Kirad, Neha Agrawal, Dear Sir, Magnet Brains). Every chapter includes learning outcomes, notes, and topic quizzes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto shrink-0">
            <button
              id="course-view-timetable-btn"
              onClick={onViewTimetable}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
            >
              <Calendar className="w-4 h-4 text-indigo-600" />
              <span>Weekly Timetable</span>
            </button>
          </div>
        </div>

        {/* ================= View Mode Tabs ================= */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <button
              id="tab-syllabus-view"
              onClick={() => setViewMode('syllabus')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'syllabus'
                  ? 'bg-slate-950 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>All Subjects & Chapters ({classTopics.length})</span>
            </button>

            <button
              id="tab-schedule-view"
              onClick={() => setViewMode('schedule')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'schedule'
                  ? 'bg-slate-950 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              <span>Personalized 4-Week Schedule</span>
            </button>
          </div>

          {/* Total Chapters Badge */}
          <div className="text-xs font-semibold text-slate-500">
            Showing <span className="text-slate-900 font-bold">{filteredTopics.length}</span> of {classTopics.length} chapters
          </div>
        </div>

        {/* ================= VIEW 1: FULL SYLLABUS & CHAPTERS ================= */}
        {viewMode === 'syllabus' && (
          <div className="space-y-6">
            {/* Filter and Search Bar */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Subject Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                <button
                  onClick={() => setSelectedSubjectId('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                    selectedSubjectId === 'all'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  All Subjects
                </button>
                {classSubjects.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSubjectId(s.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                      selectedSubjectId === s.id
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>

              {/* Search input */}
              <div className="relative min-w-[220px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search chapter, topic, educator..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white"
                />
              </div>
            </div>

            {/* Chapters Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {filteredTopics.map((topic, idx) => {
                const subject = classSubjects.find((s) => s.id === topic.subjectId);
                const isHard = topic.difficulty === 'Hard';
                const isMed = topic.difficulty === 'Medium';

                return (
                  <div
                    key={topic.id}
                    className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Top badges */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                          {subject?.name || 'Subject'}
                        </span>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold">
                          <span className={`px-2 py-0.5 rounded-full ${
                            isHard
                              ? 'bg-rose-50 text-rose-700'
                              : isMed
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-emerald-50 text-emerald-700'
                          }`}>
                            {topic.difficulty}
                          </span>
                          <span className="text-slate-400">•</span>
                          <span className="text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {topic.durationMinutes || 45}m
                          </span>
                        </div>
                      </div>

                      {/* Chapter Title */}
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                        {topic.name}
                      </h3>

                      {/* Video info & Channel */}
                      <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                        Lecture: {topic.youtubeTitle}
                      </p>

                      <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                        <span className="w-2 h-2 rounded-full bg-indigo-500" />
                        <span>{topic.youtubeChannel}</span>
                        {topic.educatorOptions && topic.educatorOptions.length > 1 && (
                          <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-1.5 py-0.5 rounded">
                            +{topic.educatorOptions.length - 1} educator options
                          </span>
                        )}
                      </div>

                      {/* Learning Outcomes Preview */}
                      {topic.learningOutcomes && topic.learningOutcomes.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-100">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                            Key Concepts:
                          </span>
                          <ul className="text-xs text-slate-600 space-y-1">
                            {topic.learningOutcomes.slice(0, 2).map((out, oIdx) => (
                              <li key={oIdx} className="flex items-start gap-1.5 line-clamp-1">
                                <span className="text-emerald-500 font-bold">✓</span>
                                <span className="truncate">{out}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-400">
                        Chapter #{idx + 1}
                      </span>
                      <button
                        id={`launch-topic-${topic.id}`}
                        onClick={() => handleLaunchTopicLesson(topic)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors"
                      >
                        <PlayCircle className="w-3.5 h-3.5" />
                        <span>Start Lesson</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= VIEW 2: PERSONALIZED 4-WEEK SCHEDULE ================= */}
        {viewMode === 'schedule' && (
          <div className="space-y-6">
            {/* Allocation Hierarchy Summary Pill */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Personalized Topic Allocation
                  </div>
                  <div className="text-xs text-slate-500">
                    Priority Gaps (40%) • Developing Concepts (35%) • Strong Retention (25%)
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold">
                <span className="inline-flex items-center gap-1 text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  Priority (40%)
                </span>
                <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  Developing (35%)
                </span>
                <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Strong (25%)
                </span>
              </div>
            </div>

            {/* Week Tabs */}
            {weeks.length > 0 && (
              <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
                {weeks.map((week) => {
                  const isActive = week.weekNumber === activeWeek;
                  return (
                    <button
                      key={week.id}
                      onClick={() => setActiveWeek(week.weekNumber)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                        isActive
                          ? 'bg-slate-900 text-white shadow-sm'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      Week {week.weekNumber}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Selected Week Days */}
            {selectedWeekData ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-display">
                    {selectedWeekData.title}
                  </h2>
                  <span className="text-xs font-semibold text-slate-500">
                    {selectedWeekData.days.length} Active Study Days
                  </span>
                </div>

                <div className="space-y-6">
                  {selectedWeekData.days.map((day) => (
                    <div
                      key={day.dayName}
                      className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden"
                    >
                      <div className="px-6 py-3.5 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                          {day.dayName}
                        </span>
                        <span className="text-xs font-medium text-slate-400">
                          {day.lessons.length} Learning Session{day.lessons.length > 1 ? 's' : ''}
                        </span>
                      </div>

                      <div className="divide-y divide-slate-100">
                        {day.lessons.map((lesson) => {
                          const isPriority = lesson.priorityCategory === 'Priority';
                          const isDeveloping = lesson.priorityCategory === 'Developing';
                          return (
                            <div
                              key={lesson.id}
                              className="p-5 sm:p-6 hover:bg-slate-50/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                            >
                              <div className="flex items-start gap-4">
                                <div className="relative w-24 h-16 rounded-xl overflow-hidden bg-slate-900 flex-shrink-0 border border-slate-200">
                                  <img
                                    src={lesson.thumbnailUrl}
                                    alt={lesson.title}
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                    <PlayCircle className="w-6 h-6 text-white drop-shadow-sm" />
                                  </div>
                                </div>

                                <div>
                                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                    <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                                      {lesson.subjectName}
                                    </span>
                                    <span className="text-xs font-semibold text-slate-600">
                                      {lesson.topicName}
                                    </span>
                                    <span
                                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                        isPriority
                                          ? 'bg-rose-50 text-rose-700'
                                          : isDeveloping
                                          ? 'bg-amber-50 text-amber-700'
                                          : 'bg-emerald-50 text-emerald-700'
                                      }`}
                                    >
                                      {lesson.priorityCategory} Focus
                                    </span>
                                  </div>

                                  <h3 className="text-sm sm:text-base font-bold text-slate-900 line-clamp-1">
                                    {lesson.title}
                                  </h3>

                                  <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-3.5 h-3.5" />
                                      {lesson.durationMinutes} min
                                    </span>
                                    <span>•</span>
                                    <span>{lesson.channelName}</span>
                                    {lesson.completed && (
                                      <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        Completed
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 sm:self-center">
                                <button
                                  id={`watch-lesson-${lesson.id}`}
                                  onClick={() => onSelectLesson(lesson)}
                                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-colors"
                                >
                                  <PlayCircle className="w-4 h-4" />
                                  <span>{lesson.completed ? 'Rewatch' : 'Watch Lesson'}</span>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-8 text-center border border-slate-200">
                <BookOpen className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-600">
                  Switch to the &ldquo;All Subjects & Chapters&rdquo; view above to access all {classTopics.length} chapters immediately.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Official Curriculum Books & Textbooks */}
        <div className="pt-4">
          <OfficialBooksList userClass={activeClass} />
        </div>
      </div>
    </div>
  );
};
