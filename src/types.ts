/**
 * Morphic EdTech Platform — Core TypeScript Definitions
 * Strictly defines database schemas and application states.
 */

export type ClassLevel =
  | 'Class 1'
  | 'Class 2'
  | 'Class 3'
  | 'Class 4'
  | 'Class 5'
  | 'Class 6'
  | 'Class 7'
  | 'Class 8'
  | 'Class 9'
  | 'Class 10'
  | 'Class 11'
  | 'Class 12';

export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

export type MasteryLevel = 'Strong' | 'Developing' | 'Needs Attention';

export type TopicStatus = 'Strong' | 'Developing' | 'Priority';

export type TimeOfDay = 'Morning' | 'Afternoon' | 'Evening' | 'Night';

export type SubscriptionTier = 'free' | 'pro' | 'elite';

export interface UserPrivacySettings {
  whoCanInvite: 'anyone' | 'classmates' | 'nobody';
  whoCanFindMe: 'everyone' | 'classmates' | 'nobody';
  whoCanSeeGroups: 'everyone' | 'classmates' | 'only_me';
}

export interface UserSubscription {
  tier: SubscriptionTier;
  price: number; // 0, 99, 199
  billingCycle: 'monthly' | 'yearly';
  status: 'active' | 'trial' | 'expired' | 'cancelled';
  subscribedAt: string;
  renewsAt?: string;
  features?: string[];
}

export interface User {
  id: string;
  yourWayId?: string; // Permanent unique ID e.g. YW-482917
  name: string;
  username?: string;
  email: string;
  class: ClassLevel;
  selectedSubjects: string[]; // Subject IDs or names
  avatar?: string;
  profilePicture?: string;
  bio?: string;
  privacySettings?: UserPrivacySettings;
  blockedUsers?: string[];
  xp?: number;
  rank?: number;
  streak?: number;
  completedClasses?: number;
  completedLessons?: string[];
  achievements?: string[];
  studyTime?: number; // total study time in minutes
  lastActive?: string;
  studyPreferences?: StudyPreferences;
  subscription?: UserSubscription;
  createdAt: string;
  role: 'student' | 'admin';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  unlockedAt?: string;
}

export interface LeaderboardEntry {
  userId: string;
  name: string;
  username: string;
  class: ClassLevel;
  xp: number;
  rank: number;
  avatar?: string;
  isCurrentUser?: boolean;
  streak?: number;
}

export interface StudyPreferences {
  dailyMinutes: number; // e.g. 30, 60, 90, 120, 180
  studyDays: ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday')[];
  preferredTime: TimeOfDay;
}

export interface Subject {
  id: string;
  name: string;
  class: ClassLevel;
  description: string;
  iconName: string;
  color: string;
}

export interface EducatorVideoOption {
  educator: string; // e.g. 'Prashant Kirad', 'Physics Wallah (PW)', 'Dear Sir', 'Digraj Sir', 'Magnet Brains'
  channelName: string;
  youtubeVideoId: string;
  title: string;
}

export interface Topic {
  id: string;
  subjectId: string;
  name: string;
  difficulty: DifficultyLevel;
  order: number;
  description?: string;
  youtubeVideoId: string;
  youtubeTitle: string;
  youtubeChannel: string;
  durationMinutes: number;
  learningOutcomes: string[];
  educatorOptions?: EducatorVideoOption[];
}

export interface Question {
  id: string;
  class?: ClassLevel;
  prerequisiteClass?: ClassLevel;
  subjectId: string;
  topicId: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  difficulty: DifficultyLevel;
  explanation: string;
}

export interface AssessmentAnswer {
  questionId: string;
  selectedAnswer: 'A' | 'B' | 'C' | 'D';
  isCorrect: boolean;
}

export interface Assessment {
  id: string;
  userId: string;
  class: ClassLevel;
  overallScore: number; // 0 - 100
  overallLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  subjectScores: SubjectScore[];
  topicScores: TopicScore[];
  createdAt: string;
  answers: AssessmentAnswer[];
}

export interface SubjectScore {
  subjectId: string;
  subjectName: string;
  totalQuestions: number;
  correctAnswers: number;
  percentage: number;
  status: MasteryLevel; // 80-100: Strong, 60-79: Developing, 0-59: Needs Attention
}

export interface TopicScore {
  topicId: string;
  topicName: string;
  subjectId: string;
  subjectName: string;
  totalQuestions: number;
  correctAnswers: number;
  percentage: number;
  status: TopicStatus; // 80-100: Strong, 60-79: Developing, 0-59: Priority
  diagnosticFeedback: string;
}

export interface Course {
  id: string;
  userId: string;
  class: ClassLevel;
  title: string;
  createdAt: string;
  weeks: CourseWeek[];
  allocationStats: {
    priorityPercent: number;
    developingPercent: number;
    strongPercent: number;
  };
}

export interface CourseWeek {
  id: string;
  weekNumber: number;
  title: string;
  days: CourseDay[];
}

export interface CourseDay {
  dayName: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  courseWeekId?: string;
  subjectId: string;
  subjectName: string;
  topicId: string;
  topicName: string;
  lessonNumber: number;
  title: string;
  description: string;
  durationMinutes: number;
  youtubeUrl: string;
  youtubeVideoId: string;
  channelName: string;
  thumbnailUrl: string;
  learningOutcomes: string[];
  practiceQuestionIds: string[];
  completed?: boolean;
  priorityCategory: 'Priority' | 'Developing' | 'Strong';
  educatorOptions?: EducatorVideoOption[];
}

export interface TimetableBlock {
  id: string;
  userId: string;
  lessonId: string;
  lessonTitle: string;
  subjectName: string;
  topicName: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  startTime: string; // e.g., "4:00 PM"
  endTime: string;   // e.g., "4:40 PM"
  durationMinutes: number;
  type: 'lesson' | 'practice';
  completed: boolean;
}

export interface PracticeAttempt {
  id: string;
  userId: string;
  topicId: string;
  questionId: string;
  selectedAnswer: 'A' | 'B' | 'C' | 'D';
  isCorrect: boolean;
  createdAt: string;
}

export interface UserProgress {
  userId: string;
  completedLessonIds: string[];
  completedTimetableIds: string[];
  studyStreakDays: number;
  lastStudiedDate: string;
  totalPracticeQuestionsAttempted: number;
  totalPracticeQuestionsCorrect: number;
}

export interface OfficialBook {
  id: string;
  title: string;
  authorOrPublisher: string;
  subject: string;
  class: ClassLevel;
  type: 'Free Official eBook / PDF' | 'Official Online Reader' | 'Authorized Publisher';
  officialSourceUrl: string;
  officialSourceName: string;
  description: string;
  coverImage?: string;
  isbnOrCode?: string;
  verifiedOfficial: boolean;
}

// ==================== STUDY GROUPS DEFINITIONS ====================

export type StudyGroupRole = 'owner' | 'admin' | 'member';
export type StudyGroupPrivacy = 'public' | 'private';

export interface StudyGroupMember {
  userId: string;
  name: string;
  username: string;
  yourWayId?: string;
  avatar?: string;
  role: StudyGroupRole;
  class: ClassLevel;
  groupXpEarned?: number;
  joinedAt: string;
}

export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  class: ClassLevel;
  subject: string;
  picture: string;
  maxMembers: number;
  privacy: StudyGroupPrivacy;
  rules: string[];
  ownerId: string;
  ownerName?: string;
  admins: string[]; // user IDs
  members: string[]; // user IDs
  groupXP: number;
  weeklyTargetLessons: number;
  weeklyCompletedLessons: number;
  createdAt: string;
  lastActiveAt: string;
}

export interface GroupMessageAttachment {
  type: 'image' | 'question' | 'resource' | 'quiz_result';
  title?: string;
  url?: string;
  details?: string;
  score?: string;
  subject?: string;
}

export interface GroupMessage {
  id: string;
  groupId: string;
  senderId: string;
  senderName: string;
  senderUsername: string;
  senderAvatar?: string;
  senderRole?: StudyGroupRole;
  message: string;
  messageType: 'text' | 'image' | 'question' | 'resource' | 'quiz_result';
  attachments?: GroupMessageAttachment[];
  replyTo?: {
    id: string;
    senderName: string;
    text: string;
  };
  reactions: Record<string, string[]>; // emoji -> [userIds]
  createdAt: string;
  reports?: { reporterId: string; reason: string; createdAt: string }[];
}

export interface GroupTask {
  id: string;
  groupId: string;
  title: string;
  description: string;
  deadline: string;
  createdBy: string;
  creatorName: string;
  completedBy: string[]; // userIds who finished it
  xpReward: number;
  createdAt: string;
}

export interface GroupResource {
  id: string;
  groupId: string;
  title: string;
  type: 'course' | 'lesson' | 'book' | 'notes' | 'link';
  urlOrId: string;
  description: string;
  sharedBy: string;
  sharedByName: string;
  helpfulCount: number;
  helpfulUserIds: string[];
  createdAt: string;
}

export interface GroupChallenge {
  id: string;
  groupId: string;
  title: string;
  description: string;
  targetCount: number;
  currentCount: number;
  xpReward: number;
  badgeName: string;
  badgeIcon: string;
  deadline: string;
  isCompleted: boolean;
  contributors: { userId: string; name: string; count: number }[];
}

export interface GroupInvitation {
  id: string;
  groupId: string;
  groupName: string;
  groupPicture: string;
  groupSubject: string;
  groupClass: ClassLevel;
  senderId: string;
  senderName: string;
  receiverId: string;
  type: 'invite' | 'join_request';
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

export type NotificationCategory =
  | 'group_invitation'
  | 'group_activity'
  | 'study_task'
  | 'achievement'
  | 'learning'
  | 'system';

export interface AppNotification {
  id: string;
  userId: string;
  type: NotificationCategory;
  title: string;
  message: string;
  relatedGroupId?: string;
  invitationId?: string;
  read: boolean;
  actionTaken?: 'accepted' | 'declined';
  createdAt: string;
}


