/**
 * Morphic Frontend API Client
 * Interfaces with Express backend with automatic graceful local fallbacks.
 */

import {
  ClassLevel,
  Subject,
  Topic,
  Question,
  Assessment,
  Course,
  TimetableBlock,
  User,
  StudyPreferences,
  LeaderboardEntry,
  Achievement,
  StudyGroup,
  GroupMessage,
  GroupTask,
  GroupResource,
  GroupChallenge,
  GroupInvitation,
  AppNotification,
  StudyGroupMember,
} from '../types';
import { DEMO_SUBJECTS, DEMO_TOPICS, DEMO_QUESTIONS } from '../data/demoData';
import {
  getSubjectsForClass,
  getTopicsForClass,
  getLeaderboardForClass,
  APP_ACHIEVEMENTS,
} from '../data/classCurriculum';
import { getPrerequisiteQuestionsForClass } from '../data/prerequisiteQuestions';
import {
  generateAssessmentQuestions,
  analyzeAssessment,
  generatePersonalizedCourse,
  generateTimetable,
  DEFAULT_ALLOCATION,
} from './personalization';

async function safeFetch<T>(url: string, options?: RequestInit, fallback?: () => T): Promise<T> {
  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      const errBody = await res.json().catch(() => null);
      throw new Error(errBody?.error || `HTTP ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`API call failed for ${url}:`, err);
    if (fallback) return fallback();
    throw err;
  }
}

export const api = {
  // Authentication
  async register(data: {
    name: string;
    username: string;
    email: string;
    password: string;
    confirmPassword?: string;
    classLevel: ClassLevel;
    selectedSubjects?: string[];
    studyPreferences?: StudyPreferences;
  }): Promise<{ user: User }> {
    return safeFetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }, () => ({
      user: {
        id: `usr_${Date.now()}`,
        name: data.name,
        username: data.username,
        email: data.email,
        class: data.classLevel,
        selectedSubjects: data.selectedSubjects || ['sub_maths', 'sub_science', 'sub_english', 'sub_social_science'],
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.name)}&backgroundColor=4f46e5`,
        xp: 0,
        rank: 6,
        streak: 1,
        completedClasses: 0,
        completedLessons: [],
        achievements: [],
        studyTime: 0,
        studyPreferences: data.studyPreferences || {
          dailyMinutes: 60,
          studyDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          preferredTime: 'Evening',
        },
        createdAt: new Date().toISOString(),
        role: 'student',
      },
    }));
  },

  async login(data: {
    identifier?: string;
    email?: string;
    username?: string;
    password?: string;
  }): Promise<{ user: User }> {
    return safeFetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }, () => ({
      user: {
        id: 'usr_demo_1',
        name: 'Aarav Sharma',
        username: 'aarav_sharma',
        email: data.email || data.identifier || 'aarav.sharma@example.com',
        class: 'Class 9',
        selectedSubjects: ['sub_maths', 'sub_science', 'sub_english', 'sub_social_science'],
        xp: 1250,
        rank: 4,
        streak: 5,
        completedClasses: 12,
        completedLessons: ['top_math_1', 'top_math_2', 'top_sci_1', 'top_sci_2'],
        achievements: ['ach_first_class', 'ach_1000_xp'],
        studyTime: 380,
        createdAt: new Date().toISOString(),
        role: 'student',
      },
    }));
  },

  async loginWithGoogle(
    token?: string,
    profile?: { name?: string; email?: string; picture?: string }
  ): Promise<{ user: User }> {
    return safeFetch('/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, profile }),
    }, () => ({
      user: {
        id: `usr_g_${Date.now()}`,
        name: profile?.name || 'Google Learner',
        username: (profile?.name || 'learner').toLowerCase().replace(/\s+/g, '_'),
        email: profile?.email || 'learner@gmail.com',
        avatar: profile?.picture,
        class: 'Class 9',
        selectedSubjects: ['sub_maths', 'sub_science', 'sub_english', 'sub_social_science'],
        xp: 100,
        rank: 5,
        streak: 1,
        completedClasses: 1,
        completedLessons: [],
        achievements: ['ach_first_class'],
        studyTime: 30,
        createdAt: new Date().toISOString(),
        role: 'student',
      },
    }));
  },

  async syncFirebaseUser(data: {
    uid: string;
    email: string;
    name?: string;
    username?: string;
    classLevel?: ClassLevel;
    profileImageUrl?: string;
    bio?: string;
    website?: string;
    emailVerified?: boolean;
  }): Promise<{ user: User }> {
    return safeFetch('/api/user/sync-firebase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },

  async checkUsernameAvailable(username: string, uid?: string): Promise<{ available: boolean; reason?: string }> {
    return safeFetch(`/api/username/check?username=${encodeURIComponent(username)}&uid=${encodeURIComponent(uid || '')}`);
  },

  async sendGmailStudyReport(data: {
    email: string;
    userName: string;
    classLevel?: string;
    summary?: any;
  }): Promise<{ success: boolean; message: string }> {
    return safeFetch('/api/gmail/send-study-report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },

  async getMe(userId?: string): Promise<{ user: User }> {
    return safeFetch(`/api/auth/me${userId ? `?userId=${userId}` : ''}`, undefined, () => ({
      user: {
        id: 'usr_demo_1',
        name: 'Aarav Sharma',
        username: 'aarav_sharma',
        email: 'aarav.sharma@example.com',
        class: 'Class 9',
        selectedSubjects: ['sub_maths', 'sub_science', 'sub_english', 'sub_social_science'],
        xp: 1250,
        rank: 4,
        streak: 5,
        completedClasses: 12,
        completedLessons: ['top_math_1', 'top_math_2', 'top_sci_1', 'top_sci_2'],
        achievements: ['ach_first_class', 'ach_1000_xp'],
        studyTime: 380,
        studyPreferences: {
          dailyMinutes: 60,
          studyDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          preferredTime: 'Evening',
        },
        createdAt: new Date().toISOString(),
        role: 'student',
      },
    }));
  },

  async updateProfile(userId: string, updates: Partial<User>): Promise<{ user: User }> {
    return safeFetch(`/api/user/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
  },

  // Leaderboard
  async getLeaderboard(classLevel: ClassLevel = 'Class 9', userId?: string): Promise<{ leaderboard: LeaderboardEntry[]; class: ClassLevel }> {
    return safeFetch(
      `/api/leaderboard?class=${encodeURIComponent(classLevel)}${userId ? `&userId=${userId}` : ''}`,
      undefined,
      () => ({
        leaderboard: getLeaderboardForClass(classLevel),
        class: classLevel,
      })
    );
  },

  // Gamification: Award XP
  async awardXP(userId: string, amount: number, reason?: string): Promise<{ user: User; newAchievements: string[] }> {
    return safeFetch('/api/user/award-xp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, amount, reason }),
    });
  },

  // Achievements
  async getAchievements(userId?: string): Promise<{ achievements: Array<Achievement & { isUnlocked: boolean }> }> {
    return safeFetch(`/api/achievements${userId ? `?userId=${userId}` : ''}`, undefined, () => ({
      achievements: APP_ACHIEVEMENTS.map((a) => ({ ...a, isUnlocked: a.id === 'ach_first_class' })),
    }));
  },

  // Metadata
  async getClasses(): Promise<{ classes: ClassLevel[] }> {
    return safeFetch('/api/classes', undefined, () => ({
      classes: [
        'Class 6',
        'Class 7',
        'Class 8',
        'Class 9',
        'Class 10',
        'Class 11',
        'Class 12',
      ],
    }));
  },

  async getSubjects(classLevel: ClassLevel = 'Class 9'): Promise<{ subjects: Subject[] }> {
    return safeFetch(`/api/subjects?class=${encodeURIComponent(classLevel)}`, undefined, () => ({
      subjects: getSubjectsForClass(classLevel),
    }));
  },

  async getTopics(classLevel: ClassLevel = 'Class 9', subjectId?: string): Promise<{ topics: Topic[] }> {
    const params = new URLSearchParams();
    if (classLevel) params.set('class', classLevel);
    if (subjectId) params.set('subjectId', subjectId);
    return safeFetch(`/api/topics?${params.toString()}`, undefined, () => {
      const all = getTopicsForClass(classLevel);
      return {
        topics: subjectId ? all.filter((t) => t.subjectId === subjectId) : all,
      };
    });
  },

  // Assessment
  async generateAssessment(
    selectedSubjects: string[],
    classLevel: ClassLevel = 'Class 9'
  ): Promise<{ questions: Question[]; total: number }> {
    return safeFetch('/api/assessment/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ selectedSubjects, classLevel }),
    }, () => {
      const q = generateAssessmentQuestions(selectedSubjects, DEMO_QUESTIONS, 20);
      return { questions: q, total: q.length };
    });
  },

  async submitAssessment(
    userId: string,
    classLevel: ClassLevel,
    answers: { questionId: string; selectedAnswer: 'A' | 'B' | 'C' | 'D' }[]
  ): Promise<{ assessment: Assessment; detailedResults: any[] }> {
    return safeFetch('/api/assessment/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, classLevel, answers }),
    }, () => {
      const graded = answers.map((a) => {
        const q = DEMO_QUESTIONS.find((item) => item.id === a.questionId);
        return {
          questionId: a.questionId,
          selectedAnswer: a.selectedAnswer,
          isCorrect: q ? q.correctAnswer === a.selectedAnswer : false,
          questionText: q?.question,
          correctAnswer: q?.correctAnswer,
          explanation: q?.explanation,
          topicId: q?.topicId,
          subjectId: q?.subjectId,
        };
      });
      const assess = analyzeAssessment(userId, classLevel, graded, DEMO_QUESTIONS, DEMO_SUBJECTS, DEMO_TOPICS);
      return { assessment: assess, detailedResults: graded };
    });
  },

  async getLatestAssessment(userId: string): Promise<{ assessment: Assessment }> {
    return safeFetch(`/api/assessment/latest?userId=${userId}`);
  },

  // Course
  async generateCourse(
    userId: string,
    preferences: StudyPreferences,
    customRatios?: { priorityPercent: number; developingPercent: number; strongPercent: number },
    classLevel?: ClassLevel
  ): Promise<{ course: Course; timetableBlocks: TimetableBlock[] }> {
    return safeFetch('/api/course/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, preferences, customRatios, classLevel }),
    }, () => {
      const cls = classLevel || 'Class 10';
      const topics = getTopicsForClass(cls);
      const subjects = getSubjectsForClass(cls);
      const questions = getPrerequisiteQuestionsForClass(cls);
      const mockAssess = analyzeAssessment(
        userId,
        cls,
        questions.slice(0, 20).map((q, idx) => ({
          questionId: q.id,
          selectedAnswer: idx % 3 === 0 ? 'B' : q.correctAnswer,
          isCorrect: idx % 3 !== 0,
        })),
        questions,
        subjects,
        topics
      );
      const c = generatePersonalizedCourse(userId, cls, mockAssess, preferences, topics, DEFAULT_ALLOCATION, subjects);
      const tt = generateTimetable(userId, c, preferences);
      return { course: c, timetableBlocks: tt };
    });
  },

  async getCurrentCourse(userId: string, classLevel?: ClassLevel): Promise<{ course: Course }> {
    const url = `/api/course/current?userId=${userId}${classLevel ? `&class=${encodeURIComponent(classLevel)}` : ''}`;
    return safeFetch(url, undefined, () => {
      const cls = classLevel || 'Class 10';
      const topics = getTopicsForClass(cls);
      const subjects = getSubjectsForClass(cls);
      const questions = getPrerequisiteQuestionsForClass(cls);
      const defaultPrefs: StudyPreferences = {
        dailyMinutes: 60,
        studyDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        preferredTime: 'Evening',
      };
      const assess = analyzeAssessment(
        userId,
        cls,
        questions.slice(0, 20).map((q, idx) => ({
          questionId: q.id,
          selectedAnswer: idx % 3 === 0 ? 'B' : q.correctAnswer,
          isCorrect: idx % 3 !== 0,
        })),
        questions,
        subjects,
        topics
      );
      const course = generatePersonalizedCourse(userId, cls, assess, defaultPrefs, topics, DEFAULT_ALLOCATION, subjects);
      return { course };
    });
  },

  // Timetable
  async getTimetable(userId: string): Promise<{ timetable: TimetableBlock[] }> {
    return safeFetch(`/api/timetable?userId=${userId}`, undefined, () => ({
      timetable: [],
    }));
  },

  async toggleTimetableBlock(blockId: string, userId: string): Promise<{ block: TimetableBlock }> {
    return safeFetch(`/api/timetable/${blockId}/toggle?userId=${userId}`, {
      method: 'PUT',
    });
  },

  // Lesson & Practice
  async getLesson(lessonId: string, userId: string): Promise<{ lesson: any; practiceQuestions: Question[] }> {
    return safeFetch(`/api/lessons/${lessonId}?userId=${userId}`, undefined, () => {
      const topic = DEMO_TOPICS[0];
      const subject = DEMO_SUBJECTS[0];
      return {
        lesson: {
          id: lessonId,
          subjectId: topic.subjectId,
          subjectName: subject.name,
          topicId: topic.id,
          topicName: topic.name,
          lessonNumber: 1,
          title: `${topic.name}: Comprehensive Concept Review`,
          description: `Detailed instructional lesson on ${topic.name}.`,
          durationMinutes: 35,
          youtubeUrl: `https://www.youtube.com/watch?v=${topic.youtubeVideoId}`,
          youtubeVideoId: topic.youtubeVideoId,
          channelName: topic.youtubeChannel,
          thumbnailUrl: `https://img.youtube.com/vi/${topic.youtubeVideoId}/hqdefault.jpg`,
          learningOutcomes: topic.learningOutcomes,
          practiceQuestionIds: DEMO_QUESTIONS.filter((q) => q.topicId === topic.id).map((q) => q.id),
          completed: false,
          priorityCategory: 'Developing',
        },
        practiceQuestions: DEMO_QUESTIONS.filter((q) => q.topicId === topic.id),
      };
    });
  },

  async markLessonComplete(lessonId: string, userId: string): Promise<{ success: boolean; progress: any }> {
    return safeFetch(`/api/lessons/${lessonId}/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    }, () => ({ success: true, progress: {} }));
  },

  async submitPractice(
    userId: string,
    questionId: string,
    selectedAnswer: 'A' | 'B' | 'C' | 'D'
  ): Promise<{ isCorrect: boolean; correctAnswer: string; explanation: string }> {
    return safeFetch('/api/practice/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, questionId, selectedAnswer }),
    }, () => {
      const q = DEMO_QUESTIONS.find((item) => item.id === questionId);
      return {
        isCorrect: q ? q.correctAnswer === selectedAnswer : false,
        correctAnswer: q?.correctAnswer || 'A',
        explanation: q?.explanation || 'Explanation not available.',
      };
    });
  },

  // Progress
  async getProgress(userId: string): Promise<{
    overallCompletion: number;
    completedLessons: number;
    totalLessons: number;
    practiceAccuracy: number;
    studyStreak: number;
    subjects: Array<{ subjectId: string; subjectName: string; total: number; completed: number; percentage: number }>;
  }> {
    return safeFetch(`/api/progress?userId=${userId}`, undefined, () => ({
      overallCompletion: 42,
      completedLessons: 17,
      totalLessons: 40,
      practiceAccuracy: 78,
      studyStreak: 4,
      subjects: [
        { subjectId: 'sub_maths', subjectName: 'Mathematics', total: 10, completed: 3, percentage: 30 },
        { subjectId: 'sub_science', subjectName: 'Science', total: 10, completed: 5, percentage: 50 },
        { subjectId: 'sub_english', subjectName: 'English', total: 10, completed: 6, percentage: 60 },
        { subjectId: 'sub_social_science', subjectName: 'Social Science', total: 10, completed: 3, percentage: 30 },
      ],
    }));
  },

  // YouTube Proxy
  async searchYouTube(query: string, topicId?: string): Promise<{
    videoId: string;
    title: string;
    channel: string;
    thumbnail: string;
    isLiveApi: boolean;
  }> {
    return safeFetch(`/api/youtube/search?q=${encodeURIComponent(query)}&topicId=${topicId || ''}`, undefined, () => {
      const t = DEMO_TOPICS.find((item) => item.id === topicId) || DEMO_TOPICS[0];
      return {
        videoId: t.youtubeVideoId,
        title: t.youtubeTitle,
        channel: t.youtubeChannel,
        thumbnail: `https://img.youtube.com/vi/${t.youtubeVideoId}/hqdefault.jpg`,
        isLiveApi: false,
      };
    });
  },

  // Admin
  async getAdminMetrics(): Promise<any> {
    return safeFetch('/api/admin/metrics');
  },

  async addQuestion(data: Partial<Question>): Promise<{ question: Question }> {
    return safeFetch('/api/admin/questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },

  async deleteQuestion(id: string): Promise<{ success: boolean }> {
    return safeFetch(`/api/admin/questions/${id}`, { method: 'DELETE' });
  },

  async resetDatabase(): Promise<{ success: boolean }> {
    return safeFetch('/api/admin/reset', { method: 'POST' });
  },

  // ==================== USER PROFILES & SEARCH ====================
  async searchUsers(q: string, requesterId?: string): Promise<{ users: any[] }> {
    return safeFetch(`/api/users/search?q=${encodeURIComponent(q)}&requesterId=${requesterId || ''}`);
  },

  async getUserProfile(userId: string, requesterId?: string): Promise<{ profile: any }> {
    return safeFetch(`/api/users/profile/${userId}?requesterId=${requesterId || ''}`);
  },

  async updateUserProfile(userId: string, updates: any): Promise<{ user: User }> {
    return safeFetch(`/api/users/profile/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
  },

  // ==================== STUDY GROUPS ====================
  async getGroups(query?: string, classLevel?: string, subject?: string): Promise<{ groups: StudyGroup[] }> {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (classLevel && classLevel !== 'all') params.set('class', classLevel);
    if (subject && subject !== 'all') params.set('subject', subject);
    return safeFetch(`/api/groups?${params.toString()}`);
  },

  async getMyGroups(userId: string): Promise<{ groups: StudyGroup[] }> {
    return safeFetch(`/api/groups/my/${userId}`);
  },

  async getGroupById(groupId: string): Promise<{ group: StudyGroup }> {
    return safeFetch(`/api/groups/${groupId}`);
  },

  async createGroup(data: {
    name: string;
    description: string;
    class: ClassLevel;
    subject: string;
    picture?: string;
    maxMembers?: number;
    privacy?: 'public' | 'private';
    rules?: string[];
    creatorId: string;
  }): Promise<{ group: StudyGroup }> {
    return safeFetch('/api/groups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },

  async updateGroup(groupId: string, data: any): Promise<{ group: StudyGroup }> {
    return safeFetch(`/api/groups/${groupId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },

  async deleteGroup(groupId: string, userId: string): Promise<{ success: boolean }> {
    return safeFetch(`/api/groups/${groupId}?userId=${userId}`, {
      method: 'DELETE',
    });
  },

  async joinGroup(groupId: string, userId: string): Promise<{ group: StudyGroup }> {
    return safeFetch(`/api/groups/${groupId}/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
  },

  async leaveGroup(groupId: string, userId: string): Promise<{ success: boolean; groupDeleted?: boolean }> {
    return safeFetch(`/api/groups/${groupId}/leave`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
  },

  async transferOwnership(groupId: string, currentOwnerId: string, newOwnerId: string): Promise<{ group: StudyGroup }> {
    return safeFetch(`/api/groups/${groupId}/transfer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentOwnerId, newOwnerId }),
    });
  },

  async updateMemberRole(groupId: string, requesterId: string, targetUserId: string, newRole: 'admin' | 'member'): Promise<{ group: StudyGroup }> {
    return safeFetch(`/api/groups/${groupId}/role`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requesterId, targetUserId, newRole }),
    });
  },

  async removeMember(groupId: string, requesterId: string, targetUserId: string): Promise<{ group: StudyGroup }> {
    return safeFetch(`/api/groups/${groupId}/remove-member`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requesterId, targetUserId }),
    });
  },

  async getGroupMembers(groupId: string): Promise<{ members: StudyGroupMember[] }> {
    return safeFetch(`/api/groups/${groupId}/members`);
  },

  // ==================== MESSAGING & CHAT ====================
  async getGroupMessages(groupId: string): Promise<{ messages: GroupMessage[] }> {
    return safeFetch(`/api/groups/${groupId}/messages`);
  },

  async sendGroupMessage(groupId: string, data: {
    senderId: string;
    message: string;
    messageType?: 'text' | 'image' | 'question' | 'resource' | 'quiz_result';
    attachments?: any[];
    replyTo?: { id: string; senderName: string; text: string };
  }): Promise<{ message: GroupMessage }> {
    return safeFetch(`/api/groups/${groupId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },

  async deleteGroupMessage(messageId: string, userId: string): Promise<{ success: boolean }> {
    return safeFetch(`/api/groups/messages/${messageId}?userId=${userId}`, {
      method: 'DELETE',
    });
  },

  async reactToMessage(messageId: string, userId: string, emoji: string): Promise<{ message: GroupMessage }> {
    return safeFetch(`/api/groups/messages/${messageId}/react`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, emoji }),
    });
  },

  // ==================== TASKS & STUDY GOALS ====================
  async getGroupTasks(groupId: string): Promise<{ tasks: GroupTask[] }> {
    return safeFetch(`/api/groups/${groupId}/tasks`);
  },

  async createGroupTask(groupId: string, data: {
    title: string;
    description: string;
    deadline?: string;
    creatorId: string;
    xpReward?: number;
  }): Promise<{ task: GroupTask }> {
    return safeFetch(`/api/groups/${groupId}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },

  async toggleGroupTask(taskId: string, userId: string): Promise<{ task: GroupTask }> {
    return safeFetch(`/api/groups/tasks/${taskId}/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
  },

  // ==================== RESOURCES & MATERIALS ====================
  async getGroupResources(groupId: string): Promise<{ resources: GroupResource[] }> {
    return safeFetch(`/api/groups/${groupId}/resources`);
  },

  async addGroupResource(groupId: string, data: {
    title: string;
    type: 'course' | 'lesson' | 'book' | 'notes' | 'link';
    urlOrId: string;
    description?: string;
    userId: string;
  }): Promise<{ resource: GroupResource }> {
    return safeFetch(`/api/groups/${groupId}/resources`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },

  async voteResourceHelpful(resourceId: string, userId: string): Promise<{ resource: GroupResource }> {
    return safeFetch(`/api/groups/resources/${resourceId}/helpful`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
  },

  // ==================== CHALLENGES & LEADERBOARD ====================
  async getGroupChallenges(groupId: string): Promise<{ challenges: GroupChallenge[] }> {
    return safeFetch(`/api/groups/${groupId}/challenges`);
  },

  async contributeToChallenge(challengeId: string, userId: string, count: number = 1): Promise<{ challenge: GroupChallenge }> {
    return safeFetch(`/api/groups/challenges/${challengeId}/contribute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, count }),
    });
  },

  async getGroupLeaderboard(groupId: string): Promise<{ leaderboard: any[] }> {
    return safeFetch(`/api/groups/${groupId}/leaderboard`);
  },

  // ==================== INVITATIONS & NOTIFICATIONS ====================
  async sendGroupInvitation(groupId: string, senderId: string, receiverId: string): Promise<{ invitation: GroupInvitation }> {
    return safeFetch(`/api/groups/${groupId}/invite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senderId, receiverId }),
    });
  },

  async requestToJoinGroup(groupId: string, userId: string): Promise<{ request: GroupInvitation }> {
    return safeFetch(`/api/groups/${groupId}/request-join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
  },

  async respondToInvitation(invitationId: string, userId: string, accept: boolean): Promise<{ success: boolean; group?: StudyGroup }> {
    return safeFetch(`/api/invitations/${invitationId}/respond`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, accept }),
    });
  },

  async getNotifications(userId: string): Promise<{ notifications: AppNotification[] }> {
    return safeFetch(`/api/notifications/${userId}`);
  },

  async markNotificationRead(notificationId: string, userId: string): Promise<{ success: boolean }> {
    return safeFetch(`/api/notifications/${notificationId}/read`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
  },

  async markAllNotificationsRead(userId: string): Promise<{ success: boolean }> {
    return safeFetch(`/api/notifications/${userId}/read-all`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    });
  },

  // ==================== MODERATION & SAFETY ====================
  async reportItem(data: {
    type: 'message' | 'user' | 'group';
    targetId: string;
    reporterId: string;
    reason: string;
    details?: string;
  }): Promise<{ report: any }> {
    return safeFetch('/api/moderation/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },

  async blockUser(userId: string, targetUserId: string): Promise<{ success: boolean }> {
    return safeFetch('/api/moderation/block', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, targetUserId }),
    });
  },

  // ==================== GLOBAL SEARCH ====================
  async globalSearch(query: string, requesterId?: string): Promise<{ results: any }> {
    return safeFetch(`/api/search/global?q=${encodeURIComponent(query)}&requesterId=${requesterId || ''}`);
  },
};
