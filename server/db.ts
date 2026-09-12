/**
 * Your Way Server Database Layer
 * Implements in-memory and disk-cached relational stores matching:
 * USERS, SUBJECTS, TOPICS, QUESTIONS, ASSESSMENTS, COURSES, TIMETABLE,
 * PRACTICE_ATTEMPTS, USER_PROGRESS, ACHIEVEMENTS, and CLASS LEADERBOARDS.
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {
  User,
  Subject,
  Topic,
  Question,
  Assessment,
  Course,
  TimetableBlock,
  PracticeAttempt,
  UserProgress,
  ClassLevel,
  LeaderboardEntry,
  StudyGroup,
  GroupMessage,
  GroupTask,
  GroupResource,
  GroupChallenge,
  GroupInvitation,
  AppNotification,
  StudyGroupRole,
  StudyGroupMember,
} from '../src/types';
import { DEMO_SUBJECTS, DEMO_TOPICS, DEMO_QUESTIONS } from '../src/data/demoData';
import {
  getSubjectsForClass,
  getTopicsForClass,
  getLeaderboardForClass,
  APP_ACHIEVEMENTS,
} from '../src/data/classCurriculum';
import {
  PREREQUISITE_QUESTIONS,
  getPrerequisiteQuestionsForClass,
} from '../src/data/prerequisiteQuestions';

export interface StoredUser extends User {
  passwordHash?: string;
  salt?: string;
}

export interface StoredReport {
  id: string;
  type: 'message' | 'user' | 'group';
  targetId: string;
  reporterId: string;
  reporterName?: string;
  reason: string;
  details?: string;
  createdAt: string;
  status: 'open' | 'reviewed' | 'dismissed';
}

interface DatabaseSchema {
  users: StoredUser[];
  subjects: Subject[];
  topics: Topic[];
  questions: Question[];
  assessments: Assessment[];
  courses: Course[];
  timetableBlocks: TimetableBlock[];
  practiceAttempts: PracticeAttempt[];
  userProgress: Record<string, UserProgress>;
  groups: StudyGroup[];
  groupMessages: GroupMessage[];
  groupTasks: GroupTask[];
  groupResources: GroupResource[];
  groupChallenges: GroupChallenge[];
  groupInvitations: GroupInvitation[];
  notifications: AppNotification[];
  reports: StoredReport[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

// Helper to hash password with salt
function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

// Generate unique salt
function generateSalt(): string {
  return crypto.randomBytes(16).toString('hex');
}

// Helper to generate a unique permanent Your Way ID (e.g. YW-482917)
export function generateYourWayId(): string {
  const digits = Math.floor(100000 + Math.random() * 900000);
  return `YW-${digits}`;
}

// Default initial state
function createInitialDatabase(): DatabaseSchema {
  const salt = generateSalt();
  const defaultPasswordHash = hashPassword('password123', salt);

  const defaultUser: StoredUser = {
    id: 'usr_demo_1',
    yourWayId: 'YW-849201',
    name: 'Aarav Sharma',
    username: 'aarav_sharma',
    email: 'aarav.sharma@example.com',
    passwordHash: defaultPasswordHash,
    salt,
    class: 'Class 9',
    selectedSubjects: ['sub_maths', 'sub_science', 'sub_english', 'sub_social_science'],
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Aarav%20Sharma&backgroundColor=4f46e5',
    bio: 'CBSE Class 9 scholar. Focused on Science & Mathematics. Aiming for 95%+ in term finals!',
    privacySettings: {
      whoCanInvite: 'anyone',
      whoCanFindMe: 'everyone',
      whoCanSeeGroups: 'everyone',
    },
    xp: 1250,
    rank: 4,
    streak: 5,
    completedClasses: 12,
    completedLessons: ['top_math_1', 'top_math_2', 'top_sci_1', 'top_sci_2'],
    achievements: ['ach_first_class', 'ach_1000_xp'],
    studyTime: 380, // minutes
    lastActive: new Date().toISOString(),
    studyPreferences: {
      dailyMinutes: 90,
      studyDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      preferredTime: 'Evening',
    },
    createdAt: new Date().toISOString(),
    role: 'student',
  };

  const priyaUser: StoredUser = {
    id: 'usr_priya_2',
    yourWayId: 'YW-391048',
    name: 'Priya Patel',
    username: 'priya_patel',
    email: 'priya.patel@example.com',
    passwordHash: defaultPasswordHash,
    salt,
    class: 'Class 9',
    selectedSubjects: ['sub_maths', 'sub_science', 'sub_english', 'sub_social_science'],
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Priya%20Patel&backgroundColor=059669',
    bio: 'Consistent learner. Let us solve difficult equations together!',
    privacySettings: {
      whoCanInvite: 'anyone',
      whoCanFindMe: 'everyone',
      whoCanSeeGroups: 'everyone',
    },
    xp: 1420,
    rank: 2,
    streak: 8,
    completedClasses: 16,
    completedLessons: ['top_math_1', 'top_math_2', 'top_math_3'],
    achievements: ['ach_first_class', 'ach_7_day_streak', 'ach_1000_xp'],
    studyTime: 420,
    lastActive: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    role: 'student',
  };

  const rohanUser: StoredUser = {
    id: 'usr_rohan_3',
    yourWayId: 'YW-720194',
    name: 'Rohan Gupta',
    username: 'rohan_g',
    email: 'rohan.gupta@example.com',
    passwordHash: defaultPasswordHash,
    salt,
    class: 'Class 9',
    selectedSubjects: ['sub_maths', 'sub_science', 'sub_english', 'sub_social_science'],
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Rohan%20Gupta&backgroundColor=d97706',
    bio: 'Physics & Chemistry lover. Prashant Kirad video one-shot fan.',
    privacySettings: {
      whoCanInvite: 'anyone',
      whoCanFindMe: 'everyone',
      whoCanSeeGroups: 'everyone',
    },
    xp: 980,
    rank: 6,
    streak: 4,
    completedClasses: 9,
    completedLessons: ['top_sci_1', 'top_sci_2'],
    achievements: ['ach_first_class'],
    studyTime: 290,
    lastActive: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    role: 'student',
  };

  const ananyaUser: StoredUser = {
    id: 'usr_ananya_4',
    yourWayId: 'YW-482917',
    name: 'Ananya Verma',
    username: 'ananya_v',
    email: 'ananya.verma@example.com',
    passwordHash: defaultPasswordHash,
    salt,
    class: 'Class 8',
    selectedSubjects: ['sub_maths', 'sub_science', 'sub_english', 'sub_social_science'],
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Ananya%20Verma&backgroundColor=db2777',
    bio: 'Class 8 Maths enthusiast. Practice makes perfect!',
    privacySettings: {
      whoCanInvite: 'anyone',
      whoCanFindMe: 'everyone',
      whoCanSeeGroups: 'everyone',
    },
    xp: 1650,
    rank: 1,
    streak: 12,
    completedClasses: 19,
    completedLessons: [],
    achievements: ['ach_first_class', 'ach_7_day_streak', 'ach_1000_xp'],
    studyTime: 510,
    lastActive: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    role: 'student',
  };

  const kabirUser: StoredUser = {
    id: 'usr_kabir_5',
    yourWayId: 'YW-519283',
    name: 'Kabir Mehra',
    username: 'kabir_m',
    email: 'kabir.mehra@example.com',
    passwordHash: defaultPasswordHash,
    salt,
    class: 'Class 10',
    selectedSubjects: ['sub_maths', 'sub_science', 'sub_english', 'sub_social_science'],
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Kabir%20Mehra&backgroundColor=2563eb',
    bio: 'Board Exam champion. Daily revision and PYQ warrior.',
    privacySettings: {
      whoCanInvite: 'classmates',
      whoCanFindMe: 'everyone',
      whoCanSeeGroups: 'everyone',
    },
    xp: 2100,
    rank: 1,
    streak: 15,
    completedClasses: 24,
    completedLessons: [],
    achievements: ['ach_first_class', 'ach_7_day_streak', 'ach_1000_xp'],
    studyTime: 720,
    lastActive: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    role: 'student',
  };

  const adminUser: StoredUser = {
    id: 'usr_admin',
    yourWayId: 'YW-100001',
    name: 'Your Way Admin',
    username: 'admin',
    email: 'admin@yourway.edu',
    passwordHash: defaultPasswordHash,
    salt,
    class: 'Class 9',
    selectedSubjects: ['sub_maths', 'sub_science', 'sub_english', 'sub_social_science'],
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Admin&backgroundColor=0f172a',
    bio: 'Official Your Way Academic Mentor & Community Administrator.',
    privacySettings: {
      whoCanInvite: 'anyone',
      whoCanFindMe: 'everyone',
      whoCanSeeGroups: 'everyone',
    },
    xp: 3500,
    rank: 1,
    streak: 20,
    completedClasses: 35,
    completedLessons: [],
    achievements: ['ach_first_class', 'ach_7_day_streak', 'ach_1000_xp'],
    studyTime: 920,
    lastActive: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    role: 'admin',
  };

  // Initial Study Groups
  const initialGroups: StudyGroup[] = [
    {
      id: 'grp_c9_maths',
      name: 'Class 9 Maths Masters',
      description: 'NCERT problem walkthroughs, polynomial simplifications, and weekly geometry challenge discussions.',
      class: 'Class 9',
      subject: 'Mathematics',
      picture: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=200&auto=format&fit=crop&q=80',
      maxMembers: 50,
      privacy: 'public',
      rules: [
        'Keep discussion strictly related to learning and syllabus questions.',
        'Respect every student’s questions and pace.',
        'No spam, promotions, or off-topic links.',
        'Show all working steps when sharing math answers.',
      ],
      ownerId: 'usr_demo_1',
      ownerName: 'Aarav Sharma',
      admins: ['usr_demo_1', 'usr_priya_2'],
      members: ['usr_demo_1', 'usr_priya_2', 'usr_rohan_3'],
      groupXP: 2450,
      weeklyTargetLessons: 10,
      weeklyCompletedLessons: 8,
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      lastActiveAt: new Date().toISOString(),
    },
    {
      id: 'grp_c9_science',
      name: 'Science Squad & PW Achievers',
      description: 'Force, Laws of Motion, Atoms, and Matter in Our Surroundings. Active study group with video one-shot reviews.',
      class: 'Class 9',
      subject: 'Science',
      picture: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=200&auto=format&fit=crop&q=80',
      maxMembers: 40,
      privacy: 'public',
      rules: [
        'Focus on Science syllabus and numericals.',
        'No bullying, harassment, or inappropriate conduct.',
        'Verify facts and textbook sources before answering.',
      ],
      ownerId: 'usr_priya_2',
      ownerName: 'Priya Patel',
      admins: ['usr_priya_2'],
      members: ['usr_priya_2', 'usr_demo_1', 'usr_rohan_3'],
      groupXP: 1850,
      weeklyTargetLessons: 8,
      weeklyCompletedLessons: 6,
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      lastActiveAt: new Date().toISOString(),
    },
    {
      id: 'grp_c8_maths',
      name: 'Class 8 Maths Masters',
      description: 'Master Linear Equations, Geometry, and Mensuration. We learn together and grow together!',
      class: 'Class 8',
      subject: 'Mathematics',
      picture: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=200&auto=format&fit=crop&q=80',
      maxMembers: 30,
      privacy: 'public',
      rules: [
        'Encourage every peer.',
        'Complete assigned weekly tasks before Sunday.',
      ],
      ownerId: 'usr_ananya_4',
      ownerName: 'Ananya Verma',
      admins: ['usr_ananya_4'],
      members: ['usr_ananya_4'],
      groupXP: 1200,
      weeklyTargetLessons: 6,
      weeklyCompletedLessons: 4,
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
      lastActiveAt: new Date().toISOString(),
    },
    {
      id: 'grp_c10_board',
      name: 'Class 10 Board Prep Team',
      description: 'Intensive revision for Class 10 Board examinations. PYQs, sample test papers, and daily formula drills.',
      class: 'Class 10',
      subject: 'Science',
      picture: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&auto=format&fit=crop&q=80',
      maxMembers: 60,
      privacy: 'public',
      rules: [
        'Strictly educational discussion.',
        'Share previous year questions with verified solutions.',
      ],
      ownerId: 'usr_kabir_5',
      ownerName: 'Kabir Mehra',
      admins: ['usr_kabir_5'],
      members: ['usr_kabir_5'],
      groupXP: 3200,
      weeklyTargetLessons: 12,
      weeklyCompletedLessons: 9,
      createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
      lastActiveAt: new Date().toISOString(),
    },
  ];

  // Initial Group Messages for grp_c9_maths
  const initialMessages: GroupMessage[] = [
    {
      id: 'msg_1',
      groupId: 'grp_c9_maths',
      senderId: 'usr_demo_1',
      senderName: 'Aarav Sharma',
      senderUsername: 'aarav_sharma',
      senderAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Aarav%20Sharma&backgroundColor=4f46e5',
      senderRole: 'owner',
      message: 'Welcome everyone to Class 9 Maths Masters! Let us collaborate on Chapter 2 Polynomials and NCERT exercises.',
      messageType: 'text',
      reactions: { '👍': ['usr_priya_2', 'usr_rohan_3'], '🔥': ['usr_priya_2'] },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    },
    {
      id: 'msg_2',
      groupId: 'grp_c9_maths',
      senderId: 'usr_priya_2',
      senderName: 'Priya Patel',
      senderUsername: 'priya_patel',
      senderAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Priya%20Patel&backgroundColor=059669',
      senderRole: 'admin',
      message: 'Hi Aarav! I completed Exercise 2.4 factor theorem. Anyone stuck on Question 5 factorising cubic polynomials?',
      messageType: 'text',
      reactions: { '💡': ['usr_demo_1'] },
      createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    },
    {
      id: 'msg_3',
      groupId: 'grp_c9_maths',
      senderId: 'usr_rohan_3',
      senderName: 'Rohan Gupta',
      senderUsername: 'rohan_g',
      senderAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Rohan%20Gupta&backgroundColor=d97706',
      senderRole: 'member',
      message: 'Yes! What is the fastest method to find the first root before using synthetic division?',
      messageType: 'question',
      replyTo: {
        id: 'msg_2',
        senderName: 'Priya Patel',
        text: 'Anyone stuck on Question 5 factorising cubic polynomials?',
      },
      reactions: { '🎯': ['usr_demo_1'] },
      createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    },
    {
      id: 'msg_4',
      groupId: 'grp_c9_maths',
      senderId: 'usr_demo_1',
      senderName: 'Aarav Sharma',
      senderUsername: 'aarav_sharma',
      senderAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Aarav%20Sharma&backgroundColor=4f46e5',
      senderRole: 'owner',
      message: 'Look at the factors of the constant term (e.g. ±1, ±2) and test with P(x). When P(a)=0, then (x-a) is your factor!',
      messageType: 'text',
      reactions: { '👏': ['usr_rohan_3', 'usr_priya_2'], '❤️': ['usr_rohan_3'] },
      createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    },
  ];

  // Initial Group Tasks
  const initialTasks: GroupTask[] = [
    {
      id: 'task_1',
      groupId: 'grp_c9_maths',
      title: 'Complete Chapter 2 Polynomials NCERT Ex 2.4',
      description: 'Solve all questions on factor theorem and cubic polynomial splitting.',
      deadline: 'Tomorrow, 6:00 PM',
      createdBy: 'usr_demo_1',
      creatorName: 'Aarav Sharma',
      completedBy: ['usr_priya_2'],
      xpReward: 50,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'task_2',
      groupId: 'grp_c9_maths',
      title: 'Watch Prashant Kirad Coordinate Geometry One-Shot',
      description: 'Cover quadrants, signs of coordinates, and plotting points for the upcoming school unit test.',
      deadline: 'Friday, 8:00 PM',
      createdBy: 'usr_priya_2',
      creatorName: 'Priya Patel',
      completedBy: ['usr_demo_1', 'usr_priya_2'],
      xpReward: 50,
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
  ];

  // Initial Group Resources
  const initialResources: GroupResource[] = [
    {
      id: 'res_1',
      groupId: 'grp_c9_maths',
      title: 'NCERT Class 9 Mathematics Official Textbook PDF',
      type: 'book',
      urlOrId: 'https://ncert.nic.in/textbook.php?iemh1=0-15',
      description: 'Official NCERT Textbook chapters covering Number Systems, Polynomials, and Coordinate Geometry.',
      sharedBy: 'usr_demo_1',
      sharedByName: 'Aarav Sharma',
      helpfulCount: 8,
      helpfulUserIds: ['usr_priya_2', 'usr_rohan_3'],
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    {
      id: 'res_2',
      groupId: 'grp_c9_maths',
      title: 'Algebra Formula Sheet & Factorization Identities',
      type: 'notes',
      urlOrId: 'https://yourway.edu/resources/class9-maths-identities',
      description: 'Curated list of all 8 algebraic identities (a+b+c)², (x+a)(x+b), and a³+b³+c³-3abc.',
      sharedBy: 'usr_priya_2',
      sharedByName: 'Priya Patel',
      helpfulCount: 12,
      helpfulUserIds: ['usr_demo_1', 'usr_rohan_3'],
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
  ];

  // Initial Group Challenges
  const initialChallenges: GroupChallenge[] = [
    {
      id: 'chal_1',
      groupId: 'grp_c9_maths',
      title: 'Complete 10 Mathematics Lessons This Week',
      description: 'Members study together to reach 10 syllabus lessons completed before Sunday night.',
      targetCount: 10,
      currentCount: 8,
      xpReward: 250,
      badgeName: 'Maths Vanguard Badge',
      badgeIcon: '📐',
      deadline: 'Sunday, 11:59 PM',
      isCompleted: false,
      contributors: [
        { userId: 'usr_demo_1', name: 'Aarav Sharma', count: 4 },
        { userId: 'usr_priya_2', name: 'Priya Patel', count: 3 },
        { userId: 'usr_rohan_3', name: 'Rohan Gupta', count: 1 },
      ],
    },
  ];

  // Initial Notifications
  const initialNotifications: AppNotification[] = [
    {
      id: 'notif_invite_1',
      userId: 'usr_demo_1',
      type: 'group_invitation',
      title: 'Study Group Invitation',
      message: 'Ananya Verma (@ananya_v) invited you to join Class 8 Maths Masters as a peer mentor.',
      relatedGroupId: 'grp_c8_maths',
      invitationId: 'inv_1',
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
      id: 'notif_task_2',
      userId: 'usr_demo_1',
      type: 'study_task',
      title: 'New Study Task in Class 9 Maths',
      message: 'Priya Patel added task: "Watch Prashant Kirad Coordinate Geometry One-Shot"',
      relatedGroupId: 'grp_c9_maths',
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    },
    {
      id: 'notif_achieve_3',
      userId: 'usr_demo_1',
      type: 'achievement',
      title: 'Milestone Unlocked!',
      message: 'You unlocked "1,000 XP Milestone" on Your Way! Keep it up!',
      read: true,
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
  ];

  // Initial Invitations
  const initialInvitations: GroupInvitation[] = [
    {
      id: 'inv_1',
      groupId: 'grp_c8_maths',
      groupName: 'Class 8 Maths Masters',
      groupPicture: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=200&auto=format&fit=crop&q=80',
      groupSubject: 'Mathematics',
      groupClass: 'Class 8',
      senderId: 'usr_ananya_4',
      senderName: 'Ananya Verma',
      receiverId: 'usr_demo_1',
      type: 'invite',
      status: 'pending',
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
  ];

  return {
    users: [defaultUser, priyaUser, rohanUser, ananyaUser, kabirUser, adminUser],
    subjects: [...DEMO_SUBJECTS],
    topics: [...DEMO_TOPICS],
    questions: [...DEMO_QUESTIONS],
    assessments: [],
    courses: [],
    timetableBlocks: [],
    practiceAttempts: [],
    userProgress: {
      [defaultUser.id]: {
        userId: defaultUser.id,
        completedLessonIds: ['top_math_1', 'top_math_2', 'top_sci_1', 'top_sci_2'],
        completedTimetableIds: [],
        studyStreakDays: 5,
        lastStudiedDate: new Date().toISOString().split('T')[0],
        totalPracticeQuestionsAttempted: 15,
        totalPracticeQuestionsCorrect: 12,
      },
    },
    groups: initialGroups,
    groupMessages: initialMessages,
    groupTasks: initialTasks,
    groupResources: initialResources,
    groupChallenges: initialChallenges,
    groupInvitations: initialInvitations,
    notifications: initialNotifications,
    reports: [],
  };
}

class DatabaseService {
  private db: DatabaseSchema;

  constructor() {
    this.db = this.load();
  }

  private load(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        const syncedTopics = DEMO_TOPICS.map((demoTopic) => {
          const existing = parsed.topics?.find((t: any) => t.id === demoTopic.id);
          return {
            ...demoTopic,
            ...(existing || {}),
            educatorOptions: demoTopic.educatorOptions || existing?.educatorOptions,
            youtubeVideoId: demoTopic.youtubeVideoId,
            youtubeChannel: demoTopic.youtubeChannel,
            youtubeTitle: demoTopic.youtubeTitle,
          };
        });

        const initial = createInitialDatabase();
        const loadedUsers = (parsed.users?.length ? parsed.users : initial.users).map((u: any, idx: number) => {
          if (!u.yourWayId) {
            u.yourWayId = initial.users.find((iu) => iu.id === u.id)?.yourWayId || `YW-${100000 + idx * 1111}`;
          }
          if (!u.privacySettings) {
            u.privacySettings = {
              whoCanInvite: 'anyone',
              whoCanFindMe: 'everyone',
              whoCanSeeGroups: 'everyone',
            };
          }
          return u;
        });

        return {
          ...initial,
          ...parsed,
          users: loadedUsers,
          subjects: parsed.subjects?.length ? parsed.subjects : DEMO_SUBJECTS,
          topics: syncedTopics,
          questions: parsed.questions?.length ? parsed.questions : DEMO_QUESTIONS,
          groups: parsed.groups?.length ? parsed.groups : initial.groups,
          groupMessages: parsed.groupMessages?.length ? parsed.groupMessages : initial.groupMessages,
          groupTasks: parsed.groupTasks?.length ? parsed.groupTasks : initial.groupTasks,
          groupResources: parsed.groupResources?.length ? parsed.groupResources : initial.groupResources,
          groupChallenges: parsed.groupChallenges?.length ? parsed.groupChallenges : initial.groupChallenges,
          groupInvitations: parsed.groupInvitations?.length ? parsed.groupInvitations : initial.groupInvitations,
          notifications: parsed.notifications?.length ? parsed.notifications : initial.notifications,
          reports: parsed.reports || [],
        };
      }
    } catch (err) {
      console.warn('Could not read persistent DB file, initializing fresh store:', err);
    }
    const initial = createInitialDatabase();
    this.save(initial);
    return initial;
  }

  private save(data: DatabaseSchema) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error writing to DB file:', err);
    }
  }

  public persist() {
    this.save(this.db);
  }

  // Strip sensitive password details before sending to client
  public sanitizeUser(user: StoredUser): User {
    const { passwordHash, salt, ...sanitized } = user;
    return sanitized;
  }

  // Users
  public getUsers(): User[] {
    return this.db.users.map((u) => this.sanitizeUser(u));
  }

  public getUserById(id: string): User | undefined {
    const user = this.db.users.find((u) => u.id === id);
    return user ? this.sanitizeUser(user) : undefined;
  }

  public getUserByEmail(email: string): StoredUser | undefined {
    return this.db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public getUserByUsername(username: string): StoredUser | undefined {
    return this.db.users.find(
      (u) => u.username && u.username.toLowerCase() === username.toLowerCase()
    );
  }

  public getUserByIdentifier(identifier: string): StoredUser | undefined {
    const clean = identifier.trim().toLowerCase();
    return this.db.users.find(
      (u) =>
        u.email.toLowerCase() === clean ||
        (u.username && u.username.toLowerCase() === clean)
    );
  }

  public registerUser(data: {
    name: string;
    username: string;
    email: string;
    password: string;
    classLevel: ClassLevel;
  }): User {
    const salt = generateSalt();
    const hash = hashPassword(data.password, salt);

    // Compute initial rank in this class
    const initialLeaderboard = getLeaderboardForClass(data.classLevel);
    const initialRank = initialLeaderboard.length + 1;

    const subjects = getSubjectsForClass(data.classLevel);
    const selectedSubjectIds = subjects.map((s) => s.id);

    const newUser: StoredUser = {
      id: `usr_${Date.now()}`,
      yourWayId: generateYourWayId(),
      name: data.name.trim(),
      username: data.username.trim().toLowerCase(),
      email: data.email.trim().toLowerCase(),
      passwordHash: hash,
      salt,
      class: data.classLevel,
      selectedSubjects: selectedSubjectIds,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.name)}&backgroundColor=4f46e5`,
      bio: 'Lifelong learner on Your Way.',
      privacySettings: {
        whoCanInvite: 'anyone',
        whoCanFindMe: 'everyone',
        whoCanSeeGroups: 'everyone',
      },
      xp: 0,
      rank: initialRank,
      streak: 1,
      completedClasses: 0,
      completedLessons: [],
      achievements: [],
      studyTime: 0,
      lastActive: new Date().toISOString(),
      studyPreferences: {
        dailyMinutes: 60,
        studyDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        preferredTime: 'Evening',
      },
      createdAt: new Date().toISOString(),
      role: 'student',
    };

    this.db.users.push(newUser);

    if (!this.db.userProgress[newUser.id]) {
      this.db.userProgress[newUser.id] = {
        userId: newUser.id,
        completedLessonIds: [],
        completedTimetableIds: [],
        studyStreakDays: 1,
        lastStudiedDate: new Date().toISOString().split('T')[0],
        totalPracticeQuestionsAttempted: 0,
        totalPracticeQuestionsCorrect: 0,
      };
    }

    this.persist();
    return this.sanitizeUser(newUser);
  }

  public verifyPassword(user: StoredUser, plainPassword: string): boolean {
    if (!user.passwordHash || !user.salt) {
      // Legacy demo user without password set
      return true;
    }
    const checkHash = hashPassword(plainPassword, user.salt);
    return checkHash === user.passwordHash;
  }

  public addUser(user: User): User {
    const stored: StoredUser = {
      ...user,
      xp: user.xp || 0,
      rank: user.rank || 5,
      streak: user.streak || 1,
      completedClasses: user.completedClasses || 0,
      completedLessons: user.completedLessons || [],
      achievements: user.achievements || [],
      studyTime: user.studyTime || 0,
    };
    this.db.users.push(stored);
    if (!this.db.userProgress[user.id]) {
      this.db.userProgress[user.id] = {
        userId: user.id,
        completedLessonIds: [],
        completedTimetableIds: [],
        studyStreakDays: 1,
        lastStudiedDate: new Date().toISOString().split('T')[0],
        totalPracticeQuestionsAttempted: 0,
        totalPracticeQuestionsCorrect: 0,
      };
    }
    this.persist();
    return this.sanitizeUser(stored);
  }

  public updateUser(id: string, updates: Partial<StoredUser>): User | undefined {
    const idx = this.db.users.findIndex((u) => u.id === id);
    if (idx === -1) return undefined;
    this.db.users[idx] = {
      ...this.db.users[idx],
      ...updates,
      lastActive: new Date().toISOString(),
    };
    this.persist();
    return this.sanitizeUser(this.db.users[idx]);
  }

  // Gamification: XP & Achievements
  public awardXP(userId: string, amount: number, reason?: string): { user: User; newAchievements: string[] } | undefined {
    const user = this.db.users.find((u) => u.id === userId);
    if (!user) return undefined;

    const oldXp = user.xp || 0;
    const newXp = oldXp + amount;
    user.xp = newXp;

    // Check achievement triggers
    const newAchievements: string[] = [];
    const currentAchievements = new Set(user.achievements || []);

    if (!currentAchievements.has('ach_first_class') && (user.completedLessons?.length || 0) >= 1) {
      currentAchievements.add('ach_first_class');
      newAchievements.push('ach_first_class');
    }
    if (!currentAchievements.has('ach_1000_xp') && newXp >= 1000) {
      currentAchievements.add('ach_1000_xp');
      newAchievements.push('ach_1000_xp');
    }
    if (!currentAchievements.has('ach_50_lessons') && (user.completedLessons?.length || 0) >= 50) {
      currentAchievements.add('ach_50_lessons');
      newAchievements.push('ach_50_lessons');
    }
    if (!currentAchievements.has('ach_7_day_streak') && (user.streak || 0) >= 7) {
      currentAchievements.add('ach_7_day_streak');
      newAchievements.push('ach_7_day_streak');
    }

    user.achievements = Array.from(currentAchievements);

    // Update rank based on class leaderboard
    const lb = this.getLeaderboard(user.class, userId);
    const selfInLb = lb.find((l) => l.userId === userId);
    if (selfInLb) {
      user.rank = selfInLb.rank;
    }

    this.persist();
    return {
      user: this.sanitizeUser(user),
      newAchievements,
    };
  }

  // Class Leaderboards
  public getLeaderboard(classLevel: ClassLevel, currentUserId?: string): LeaderboardEntry[] {
    const currentStudent = currentUserId
      ? this.db.users.find((u) => u.id === currentUserId)
      : undefined;

    return getLeaderboardForClass(classLevel, currentStudent ? {
      id: currentStudent.id,
      name: currentStudent.name,
      username: currentStudent.username,
      xp: currentStudent.xp || 0,
      streak: currentStudent.streak || 1,
    } : undefined);
  }

  // Subjects & Topics & Questions
  public getSubjects(classLevel?: ClassLevel): Subject[] {
    if (classLevel && classLevel !== 'Class 9') {
      return getSubjectsForClass(classLevel);
    }
    return this.db.subjects;
  }

  public getTopics(classLevel?: ClassLevel, subjectId?: string): Topic[] {
    if (classLevel && classLevel !== 'Class 9') {
      const allClassTopics = getTopicsForClass(classLevel);
      if (subjectId) {
        return allClassTopics.filter((t) => t.subjectId === subjectId);
      }
      return allClassTopics;
    }
    if (subjectId) {
      return this.db.topics.filter((t) => t.subjectId === subjectId);
    }
    return this.db.topics;
  }

  public getQuestions(classLevel?: ClassLevel): Question[] {
    if (classLevel) {
      const prereq = getPrerequisiteQuestionsForClass(classLevel);
      if (prereq.length > 0) {
        return [...prereq, ...this.db.questions.filter((q) => !prereq.some((pq) => pq.id === q.id))];
      }
    }
    return [...PREREQUISITE_QUESTIONS, ...this.db.questions.filter((q) => !PREREQUISITE_QUESTIONS.some((pq) => pq.id === q.id))];
  }

  public addQuestion(q: Question): Question {
    this.db.questions.push(q);
    this.persist();
    return q;
  }

  public updateQuestion(id: string, updates: Partial<Question>): Question | undefined {
    const idx = this.db.questions.findIndex((q) => q.id === id);
    if (idx === -1) return undefined;
    this.db.questions[idx] = { ...this.db.questions[idx], ...updates };
    this.persist();
    return this.db.questions[idx];
  }

  public deleteQuestion(id: string): boolean {
    const prevLen = this.db.questions.length;
    this.db.questions = this.db.questions.filter((q) => q.id !== id);
    const deleted = this.db.questions.length < prevLen;
    if (deleted) this.persist();
    return deleted;
  }

  // Assessments
  public saveAssessment(assessment: Assessment): Assessment {
    this.db.assessments.push(assessment);
    this.persist();
    return assessment;
  }

  public getLatestAssessmentForUser(userId: string): Assessment | undefined {
    const userAssessments = this.db.assessments.filter((a) => a.userId === userId);
    return userAssessments[userAssessments.length - 1];
  }

  // Courses
  public saveCourse(course: Course): Course {
    const idx = this.db.courses.findIndex((c) => c.userId === course.userId);
    if (idx >= 0) {
      this.db.courses[idx] = course;
    } else {
      this.db.courses.push(course);
    }
    this.persist();
    return course;
  }

  public getCourseForUser(userId: string): Course | undefined {
    return this.db.courses.find((c) => c.userId === userId);
  }

  // Timetable
  public saveTimetable(userId: string, blocks: TimetableBlock[]): TimetableBlock[] {
    this.db.timetableBlocks = this.db.timetableBlocks.filter((b) => b.userId !== userId);
    this.db.timetableBlocks.push(...blocks);
    this.persist();
    return blocks;
  }

  public getTimetableForUser(userId: string): TimetableBlock[] {
    return this.db.timetableBlocks.filter((b) => b.userId === userId);
  }

  // Progress
  public getUserProgress(userId: string): UserProgress {
    if (!this.db.userProgress[userId]) {
      this.db.userProgress[userId] = {
        userId,
        completedLessonIds: [],
        completedTimetableIds: [],
        studyStreakDays: 1,
        lastStudiedDate: new Date().toISOString().split('T')[0],
        totalPracticeQuestionsAttempted: 0,
        totalPracticeQuestionsCorrect: 0,
      };
      this.persist();
    }
    return this.db.userProgress[userId];
  }

  public markLessonComplete(userId: string, lessonId: string): UserProgress {
    const progress = this.getUserProgress(userId);
    const user = this.db.users.find((u) => u.id === userId);

    if (!progress.completedLessonIds.includes(lessonId)) {
      progress.completedLessonIds.push(lessonId);

      // Award XP for lesson completion (+20 XP)
      if (user) {
        if (!user.completedLessons) user.completedLessons = [];
        if (!user.completedLessons.includes(lessonId)) {
          user.completedLessons.push(lessonId);
        }
        user.completedClasses = (user.completedClasses || 0) + 1;
        user.studyTime = (user.studyTime || 0) + 30; // +30 minutes
        this.awardXP(userId, 20, 'Lesson completed');
      }

      // Also update timetable blocks matching this lesson
      this.db.timetableBlocks.forEach((tb) => {
        if (tb.userId === userId && tb.lessonId === lessonId) {
          tb.completed = true;
          if (!progress.completedTimetableIds.includes(tb.id)) {
            progress.completedTimetableIds.push(tb.id);
          }
        }
      });

      // Update streak
      const today = new Date().toISOString().split('T')[0];
      if (progress.lastStudiedDate !== today) {
        progress.studyStreakDays += 1;
        progress.lastStudiedDate = today;
        if (user) {
          user.streak = progress.studyStreakDays;
        }
      }
      this.persist();
    }
    return progress;
  }

  public recordPracticeAttempt(attempt: PracticeAttempt): UserProgress {
    this.db.practiceAttempts.push(attempt);
    const progress = this.getUserProgress(attempt.userId);
    progress.totalPracticeQuestionsAttempted += 1;
    if (attempt.isCorrect) {
      progress.totalPracticeQuestionsCorrect += 1;
      // Award +5 XP for correct quiz question
      this.awardXP(attempt.userId, 5, 'Quiz question correct');
    }
    this.persist();
    return progress;
  }

  // =========================================================================
  // USER PROFILE & SEARCH METHODS
  // =========================================================================

  public updateUserProfile(
    userId: string,
    updates: {
      name?: string;
      username?: string;
      class?: ClassLevel;
      bio?: string;
      avatar?: string;
      profilePicture?: string;
      privacySettings?: {
        whoCanInvite: 'anyone' | 'classmates' | 'nobody';
        whoCanFindMe: 'everyone' | 'classmates' | 'nobody';
        whoCanSeeGroups: 'everyone' | 'classmates' | 'only_me';
      };
    }
  ): User | null {
    const user = this.db.users.find((u) => u.id === userId);
    if (!user) return null;

    if (updates.name) user.name = updates.name.trim();
    if (updates.username) {
      const cleanUsername = updates.username.trim().toLowerCase().replace(/^@/, '');
      // Check if username taken by another user
      const existing = this.db.users.find((u) => u.username === cleanUsername && u.id !== userId);
      if (!existing && cleanUsername.length > 2) {
        user.username = cleanUsername;
      }
    }
    if (updates.class) user.class = updates.class;
    if (updates.bio !== undefined) user.bio = updates.bio.trim();
    if (updates.avatar) user.avatar = updates.avatar;
    if (updates.profilePicture) user.profilePicture = updates.profilePicture;
    if (updates.privacySettings) {
      user.privacySettings = { ...user.privacySettings, ...updates.privacySettings };
    }

    this.persist();
    return this.sanitizeUser(user);
  }

  public searchUsers(query: string, requesterUserId?: string): Array<{
    id: string;
    yourWayId: string;
    name: string;
    username: string;
    class: ClassLevel;
    avatar?: string;
    bio?: string;
    xp: number;
    streak: number;
    canInvite: boolean;
  }> {
    const clean = query.trim().toLowerCase().replace(/^@/, '');
    const requester = requesterUserId ? this.db.users.find((u) => u.id === requesterUserId) : null;
    const blockedList = requester?.blockedUsers || [];

    return this.db.users
      .filter((u) => {
        if (requesterUserId && u.id === requesterUserId) return false;
        if (blockedList.includes(u.id)) return false;
        if (u.blockedUsers?.includes(requesterUserId || '')) return false;

        // Privacy check
        const findPref = u.privacySettings?.whoCanFindMe || 'everyone';
        if (findPref === 'nobody') return false;
        if (findPref === 'classmates' && requester && requester.class !== u.class) return false;

        if (!clean) return true;

        const matchName = u.name.toLowerCase().includes(clean);
        const matchUsername = u.username?.toLowerCase().includes(clean);
        const matchId = u.yourWayId?.toLowerCase().includes(clean);
        const matchClass = u.class.toLowerCase().includes(clean);

        return matchName || matchUsername || matchId || matchClass;
      })
      .slice(0, 20)
      .map((u) => {
        const invitePref = u.privacySettings?.whoCanInvite || 'anyone';
        let canInvite = true;
        if (invitePref === 'nobody') canInvite = false;
        if (invitePref === 'classmates' && requester && requester.class !== u.class) canInvite = false;

        return {
          id: u.id,
          yourWayId: u.yourWayId || 'YW-000000',
          name: u.name,
          username: u.username || u.name.toLowerCase().replace(/\s+/g, '_'),
          class: u.class,
          avatar: u.avatar || u.profilePicture,
          bio: u.bio,
          xp: u.xp || 0,
          streak: u.streak || 1,
          canInvite,
        };
      });
  }

  public getPublicUserProfile(targetUserId: string, requesterUserId?: string) {
    const target = this.db.users.find((u) => u.id === targetUserId);
    if (!target) return null;

    const requester = requesterUserId ? this.db.users.find((u) => u.id === requesterUserId) : null;

    // Check blocked
    if (requester?.blockedUsers?.includes(target.id) || target.blockedUsers?.includes(requesterUserId || '')) {
      return { blocked: true };
    }

    // Public study groups
    const seeGroupsPref = target.privacySettings?.whoCanSeeGroups || 'everyone';
    let allowedToSeeGroups = true;
    if (seeGroupsPref === 'only_me') allowedToSeeGroups = false;
    if (seeGroupsPref === 'classmates' && requester && requester.class !== target.class) {
      allowedToSeeGroups = false;
    }

    const publicGroups = allowedToSeeGroups
      ? this.db.groups
          .filter((g) => g.members.includes(target.id) && g.privacy === 'public')
          .map((g) => ({
            id: g.id,
            name: g.name,
            class: g.class,
            subject: g.subject,
            picture: g.picture,
            membersCount: g.members.length,
          }))
      : [];

    const invitePref = target.privacySettings?.whoCanInvite || 'anyone';
    let canInvite = true;
    if (invitePref === 'nobody') canInvite = false;
    if (invitePref === 'classmates' && requester && requester.class !== target.class) canInvite = false;

    return {
      id: target.id,
      yourWayId: target.yourWayId || 'YW-000000',
      name: target.name,
      username: target.username || target.name.toLowerCase().replace(/\s+/g, '_'),
      class: target.class,
      avatar: target.avatar || target.profilePicture,
      bio: target.bio || 'Lifelong learner on Your Way.',
      xp: target.xp || 0,
      streak: target.streak || 1,
      completedClasses: target.completedClasses || 0,
      achievements: target.achievements || [],
      publicGroups,
      canInvite,
      isSelf: requesterUserId === target.id,
    };
  }

  // =========================================================================
  // STUDY GROUPS CORE METHODS
  // =========================================================================

  public getGroups(query?: string, classLevel?: string, subject?: string): StudyGroup[] {
    let result = [...this.db.groups];

    if (classLevel && classLevel !== 'all') {
      result = result.filter((g) => g.class === classLevel);
    }
    if (subject && subject !== 'all') {
      result = result.filter((g) => g.subject.toLowerCase() === subject.toLowerCase());
    }
    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      result = result.filter(
        (g) =>
          g.name.toLowerCase().includes(q) ||
          g.description.toLowerCase().includes(q) ||
          g.subject.toLowerCase().includes(q) ||
          g.class.toLowerCase().includes(q)
      );
    }

    return result.sort((a, b) => new Date(b.lastActiveAt).getTime() - new Date(a.lastActiveAt).getTime());
  }

  public getMyGroups(userId: string): StudyGroup[] {
    return this.db.groups
      .filter((g) => g.members.includes(userId))
      .sort((a, b) => new Date(b.lastActiveAt).getTime() - new Date(a.lastActiveAt).getTime());
  }

  public getGroupById(groupId: string): StudyGroup | null {
    const group = this.db.groups.find((g) => g.id === groupId);
    if (!group) return null;

    if (!group.ownerName) {
      const owner = this.db.users.find((u) => u.id === group.ownerId);
      group.ownerName = owner?.name || 'Group Creator';
    }
    return group;
  }

  public getGroupMembers(groupId: string): StudyGroupMember[] {
    const group = this.getGroupById(groupId);
    if (!group) return [];

    return group.members
      .map((memberId) => {
        const u = this.db.users.find((usr) => usr.id === memberId);
        if (!u) return null;

        let role: StudyGroupRole = 'member';
        if (u.id === group.ownerId) role = 'owner';
        else if (group.admins.includes(u.id)) role = 'admin';

        return {
          userId: u.id,
          name: u.name,
          username: u.username || u.name.toLowerCase().replace(/\s+/g, '_'),
          yourWayId: u.yourWayId,
          avatar: u.avatar || u.profilePicture,
          role,
          class: u.class,
          groupXpEarned: 150,
          joinedAt: group.createdAt,
        };
      })
      .filter(Boolean) as StudyGroupMember[];
  }

  public createGroup(data: {
    name: string;
    description: string;
    class: ClassLevel;
    subject: string;
    picture?: string;
    maxMembers?: number;
    privacy?: 'public' | 'private';
    rules?: string[];
    creatorId: string;
  }): StudyGroup {
    const creator = this.db.users.find((u) => u.id === data.creatorId);
    const creatorName = creator?.name || 'Creator';

    const defaultPicture =
      data.picture && data.picture.trim().length > 0
        ? data.picture
        : 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=200&auto=format&fit=crop&q=80';

    const defaultRules = data.rules && data.rules.length > 0
      ? data.rules
      : [
          'Keep discussions strictly focused on learning and curriculum topics.',
          'Respect peer doubts, questions, and different learning paces.',
          'No spam, advertising, or inappropriate content.',
          'Share step-by-step working notes when assisting with problems.',
        ];

    const newGroup: StudyGroup = {
      id: `grp_${Date.now()}`,
      name: data.name.trim(),
      description: data.description.trim(),
      class: data.class,
      subject: data.subject.trim(),
      picture: defaultPicture,
      maxMembers: data.maxMembers || 50,
      privacy: data.privacy || 'public',
      rules: defaultRules,
      ownerId: data.creatorId,
      ownerName: creatorName,
      admins: [data.creatorId],
      members: [data.creatorId],
      groupXP: 100, // Initial founding bonus
      weeklyTargetLessons: 10,
      weeklyCompletedLessons: 0,
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
    };

    this.db.groups.unshift(newGroup);

    // Initial system welcome message
    const welcomeMsg: GroupMessage = {
      id: `msg_sys_${Date.now()}`,
      groupId: newGroup.id,
      senderId: data.creatorId,
      senderName: creatorName,
      senderUsername: creator?.username || 'creator',
      senderAvatar: creator?.avatar || creator?.profilePicture,
      senderRole: 'owner',
      message: `Welcome to ${newGroup.name}! Let's learn together and grow together on Your Way.`,
      messageType: 'text',
      reactions: { '👏': [data.creatorId] },
      createdAt: new Date().toISOString(),
    };
    this.db.groupMessages.push(welcomeMsg);

    // Initial task
    const initTask: GroupTask = {
      id: `task_${Date.now()}`,
      groupId: newGroup.id,
      title: `Welcome Session: Introduce yourself and share your goals for ${newGroup.subject}`,
      description: 'Say hello in the group chat and tell your peers what chapter you are currently studying.',
      deadline: 'This Sunday',
      createdBy: data.creatorId,
      creatorName,
      completedBy: [data.creatorId],
      xpReward: 50,
      createdAt: new Date().toISOString(),
    };
    this.db.groupTasks.push(initTask);

    // Initial challenge
    const initChallenge: GroupChallenge = {
      id: `chal_${Date.now()}`,
      groupId: newGroup.id,
      title: `Founder Challenge: Complete 5 ${newGroup.subject} Lessons`,
      description: 'Collaborate as a group to study 5 lessons on Your Way and level up the group!',
      targetCount: 5,
      currentCount: 1,
      xpReward: 150,
      badgeName: 'Group Pioneer',
      badgeIcon: '🚀',
      deadline: 'Next Week',
      isCompleted: false,
      contributors: [{ userId: data.creatorId, name: creatorName, count: 1 }],
    };
    this.db.groupChallenges.push(initChallenge);

    // Award creator +50 XP
    this.awardXP(data.creatorId, 50, 'Created a Study Group');

    this.persist();
    return newGroup;
  }

  public updateGroup(
    groupId: string,
    updaterUserId: string,
    updates: {
      name?: string;
      description?: string;
      picture?: string;
      privacy?: 'public' | 'private';
      rules?: string[];
      maxMembers?: number;
    }
  ): StudyGroup | null {
    const group = this.getGroupById(groupId);
    if (!group) return null;

    // Check permission: must be owner or admin
    if (group.ownerId !== updaterUserId && !group.admins.includes(updaterUserId)) {
      throw new Error('Only the group owner or admins can modify group settings');
    }

    if (updates.name) group.name = updates.name.trim();
    if (updates.description) group.description = updates.description.trim();
    if (updates.picture) group.picture = updates.picture.trim();
    if (updates.privacy) group.privacy = updates.privacy;
    if (updates.rules) group.rules = updates.rules;
    if (updates.maxMembers) group.maxMembers = updates.maxMembers;

    group.lastActiveAt = new Date().toISOString();
    this.persist();
    return group;
  }

  public deleteGroup(groupId: string, userId: string): boolean {
    const index = this.db.groups.findIndex((g) => g.id === groupId);
    if (index === -1) return false;

    const group = this.db.groups[index];
    if (group.ownerId !== userId) {
      throw new Error('Only the group owner can delete this study group');
    }

    this.db.groups.splice(index, 1);
    this.db.groupMessages = this.db.groupMessages.filter((m) => m.groupId !== groupId);
    this.db.groupTasks = this.db.groupTasks.filter((t) => t.groupId !== groupId);
    this.db.groupResources = this.db.groupResources.filter((r) => r.groupId !== groupId);
    this.db.groupChallenges = this.db.groupChallenges.filter((c) => c.groupId !== groupId);

    this.persist();
    return true;
  }

  public joinGroup(groupId: string, userId: string): StudyGroup {
    const group = this.getGroupById(groupId);
    if (!group) throw new Error('Group not found');

    if (group.members.includes(userId)) return group;

    if (group.members.length >= group.maxMembers) {
      throw new Error('This study group has reached its maximum member capacity');
    }

    if (group.privacy === 'private') {
      throw new Error('This is a private group. Please request an invitation or join request.');
    }

    group.members.push(userId);
    group.groupXP += 20; // XP bonus for growing
    group.lastActiveAt = new Date().toISOString();

    const user = this.db.users.find((u) => u.id === userId);
    const joinMsg: GroupMessage = {
      id: `msg_sys_${Date.now()}`,
      groupId: group.id,
      senderId: userId,
      senderName: user?.name || 'Student',
      senderUsername: user?.username || 'student',
      senderAvatar: user?.avatar || user?.profilePicture,
      senderRole: 'member',
      message: `${user?.name || 'A new member'} joined the group. Welcome!`,
      messageType: 'text',
      reactions: { '👋': [group.ownerId] },
      createdAt: new Date().toISOString(),
    };
    this.db.groupMessages.push(joinMsg);

    this.persist();
    return group;
  }

  public leaveGroup(groupId: string, userId: string): { success: boolean; groupDeleted?: boolean } {
    const group = this.getGroupById(groupId);
    if (!group) throw new Error('Group not found');

    if (!group.members.includes(userId)) return { success: true };

    // If owner
    if (group.ownerId === userId) {
      if (group.members.length > 1) {
        throw new Error('As the group owner, you must transfer ownership to another member before leaving.');
      } else {
        // Sole member leaving -> delete group
        this.deleteGroup(groupId, userId);
        return { success: true, groupDeleted: true };
      }
    }

    group.members = group.members.filter((id) => id !== userId);
    group.admins = group.admins.filter((id) => id !== userId);
    group.lastActiveAt = new Date().toISOString();

    this.persist();
    return { success: true };
  }

  public transferOwnership(groupId: string, currentOwnerId: string, newOwnerId: string): StudyGroup {
    const group = this.getGroupById(groupId);
    if (!group) throw new Error('Group not found');

    if (group.ownerId !== currentOwnerId) {
      throw new Error('Only the current owner can transfer ownership');
    }

    if (!group.members.includes(newOwnerId)) {
      throw new Error('The new owner must already be a member of this group');
    }

    const newOwner = this.db.users.find((u) => u.id === newOwnerId);
    group.ownerId = newOwnerId;
    group.ownerName = newOwner?.name || 'New Owner';

    if (!group.admins.includes(newOwnerId)) {
      group.admins.push(newOwnerId);
    }

    // Keep old owner as admin
    if (!group.admins.includes(currentOwnerId)) {
      group.admins.push(currentOwnerId);
    }

    this.persist();
    return group;
  }

  public updateMemberRole(groupId: string, requesterId: string, targetUserId: string, newRole: 'admin' | 'member'): StudyGroup {
    const group = this.getGroupById(groupId);
    if (!group) throw new Error('Group not found');

    if (group.ownerId !== requesterId) {
      throw new Error('Only the group owner can promote or demote admins');
    }

    if (targetUserId === group.ownerId) {
      throw new Error('Cannot change the role of the group owner');
    }

    if (newRole === 'admin') {
      if (!group.admins.includes(targetUserId)) {
        group.admins.push(targetUserId);
      }
    } else {
      group.admins = group.admins.filter((id) => id !== targetUserId);
    }

    this.persist();
    return group;
  }

  public removeMember(groupId: string, requesterId: string, targetUserId: string): StudyGroup {
    const group = this.getGroupById(groupId);
    if (!group) throw new Error('Group not found');

    const isOwner = group.ownerId === requesterId;
    const isAdmin = group.admins.includes(requesterId);

    if (!isOwner && !isAdmin) {
      throw new Error('Only owners or admins can remove members');
    }

    if (targetUserId === group.ownerId) {
      throw new Error('Cannot remove the group owner');
    }

    // Admins cannot remove other admins or owner
    if (!isOwner && group.admins.includes(targetUserId)) {
      throw new Error('Admins cannot remove other admins');
    }

    group.members = group.members.filter((id) => id !== targetUserId);
    group.admins = group.admins.filter((id) => id !== targetUserId);

    this.persist();
    return group;
  }

  // =========================================================================
  // GROUP CHAT / MESSAGING METHODS
  // =========================================================================

  public getGroupMessages(groupId: string): GroupMessage[] {
    return this.db.groupMessages
      .filter((m) => m.groupId === groupId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  public sendGroupMessage(data: {
    groupId: string;
    senderId: string;
    message: string;
    messageType?: 'text' | 'image' | 'question' | 'resource' | 'quiz_result';
    attachments?: any[];
    replyTo?: { id: string; senderName: string; text: string };
  }): GroupMessage {
    const group = this.getGroupById(data.groupId);
    if (!group) throw new Error('Group not found');

    if (!group.members.includes(data.senderId)) {
      throw new Error('You must be a member of this group to send messages');
    }

    const sender = this.db.users.find((u) => u.id === data.senderId);
    let senderRole: StudyGroupRole = 'member';
    if (data.senderId === group.ownerId) senderRole = 'owner';
    else if (group.admins.includes(data.senderId)) senderRole = 'admin';

    const newMsg: GroupMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      groupId: data.groupId,
      senderId: data.senderId,
      senderName: sender?.name || 'Student',
      senderUsername: sender?.username || 'student',
      senderAvatar: sender?.avatar || sender?.profilePicture,
      senderRole,
      message: data.message.trim(),
      messageType: data.messageType || 'text',
      attachments: data.attachments || [],
      replyTo: data.replyTo,
      reactions: {},
      createdAt: new Date().toISOString(),
    };

    this.db.groupMessages.push(newMsg);

    // Update group activity and +5 Group XP
    group.lastActiveAt = new Date().toISOString();
    group.groupXP = (group.groupXP || 0) + 5;

    this.persist();
    return newMsg;
  }

  public deleteGroupMessage(messageId: string, userId: string): boolean {
    const msgIndex = this.db.groupMessages.findIndex((m) => m.id === messageId);
    if (msgIndex === -1) return false;

    const msg = this.db.groupMessages[msgIndex];
    const group = this.getGroupById(msg.groupId);

    const isSender = msg.senderId === userId;
    const isGroupOwner = group?.ownerId === userId;
    const isGroupAdmin = group?.admins.includes(userId);

    if (!isSender && !isGroupOwner && !isGroupAdmin) {
      throw new Error('Not authorized to delete this message');
    }

    this.db.groupMessages.splice(msgIndex, 1);
    this.persist();
    return true;
  }

  public reactToGroupMessage(messageId: string, userId: string, emoji: string): GroupMessage | null {
    const msg = this.db.groupMessages.find((m) => m.id === messageId);
    if (!msg) return null;

    if (!msg.reactions) msg.reactions = {};
    if (!msg.reactions[emoji]) msg.reactions[emoji] = [];

    const existingIndex = msg.reactions[emoji].indexOf(userId);
    if (existingIndex >= 0) {
      // Toggle off
      msg.reactions[emoji].splice(existingIndex, 1);
      if (msg.reactions[emoji].length === 0) {
        delete msg.reactions[emoji];
      }
    } else {
      // Toggle on
      msg.reactions[emoji].push(userId);
    }

    this.persist();
    return msg;
  }

  // =========================================================================
  // GROUP TASKS METHODS
  // =========================================================================

  public getGroupTasks(groupId: string): GroupTask[] {
    return this.db.groupTasks
      .filter((t) => t.groupId === groupId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public createGroupTask(data: {
    groupId: string;
    title: string;
    description: string;
    deadline: string;
    creatorId: string;
    xpReward?: number;
  }): GroupTask {
    const group = this.getGroupById(data.groupId);
    if (!group) throw new Error('Group not found');

    const creator = this.db.users.find((u) => u.id === data.creatorId);

    const newTask: GroupTask = {
      id: `task_${Date.now()}`,
      groupId: data.groupId,
      title: data.title.trim(),
      description: data.description.trim(),
      deadline: data.deadline.trim(),
      createdBy: data.creatorId,
      creatorName: creator?.name || 'Member',
      completedBy: [],
      xpReward: data.xpReward || 50,
      createdAt: new Date().toISOString(),
    };

    this.db.groupTasks.unshift(newTask);

    // Notify other group members
    group.members.forEach((memberId) => {
      if (memberId !== data.creatorId) {
        this.addNotification({
          userId: memberId,
          type: 'study_task',
          title: `New Study Task in ${group.name}`,
          message: `${creator?.name || 'A peer'} posted task: "${newTask.title}"`,
          relatedGroupId: group.id,
        });
      }
    });

    this.persist();
    return newTask;
  }

  public toggleTaskCompletion(taskId: string, userId: string): GroupTask | null {
    const task = this.db.groupTasks.find((t) => t.id === taskId);
    if (!task) return null;

    if (!task.completedBy) task.completedBy = [];

    const index = task.completedBy.indexOf(userId);
    if (index >= 0) {
      task.completedBy.splice(index, 1);
    } else {
      task.completedBy.push(userId);

      // Award individual XP and group XP
      this.awardXP(userId, 20, `Completed study task: ${task.title}`);
      const group = this.getGroupById(task.groupId);
      if (group) {
        group.groupXP = (group.groupXP || 0) + (task.xpReward || 50);
      }
    }

    this.persist();
    return task;
  }

  // =========================================================================
  // GROUP RESOURCES METHODS
  // =========================================================================

  public getGroupResources(groupId: string): GroupResource[] {
    return this.db.groupResources
      .filter((r) => r.groupId === groupId)
      .sort((a, b) => b.helpfulCount - a.helpfulCount);
  }

  public addGroupResource(data: {
    groupId: string;
    title: string;
    type: 'course' | 'lesson' | 'book' | 'notes' | 'link';
    urlOrId: string;
    description: string;
    userId: string;
  }): GroupResource {
    const group = this.getGroupById(data.groupId);
    if (!group) throw new Error('Group not found');

    const user = this.db.users.find((u) => u.id === data.userId);

    const newRes: GroupResource = {
      id: `res_${Date.now()}`,
      groupId: data.groupId,
      title: data.title.trim(),
      type: data.type,
      urlOrId: data.urlOrId.trim(),
      description: data.description.trim(),
      sharedBy: data.userId,
      sharedByName: user?.name || 'Member',
      helpfulCount: 1,
      helpfulUserIds: [data.userId],
      createdAt: new Date().toISOString(),
    };

    this.db.groupResources.unshift(newRes);
    group.groupXP = (group.groupXP || 0) + 20;

    this.persist();
    return newRes;
  }

  public voteResourceHelpful(resourceId: string, userId: string): GroupResource | null {
    const res = this.db.groupResources.find((r) => r.id === resourceId);
    if (!res) return null;

    if (!res.helpfulUserIds) res.helpfulUserIds = [];

    const index = res.helpfulUserIds.indexOf(userId);
    if (index >= 0) {
      res.helpfulUserIds.splice(index, 1);
      res.helpfulCount = Math.max(0, res.helpfulCount - 1);
    } else {
      res.helpfulUserIds.push(userId);
      res.helpfulCount += 1;
      this.awardXP(res.sharedBy, 5, 'Resource marked helpful');
    }

    this.persist();
    return res;
  }

  // =========================================================================
  // GROUP CHALLENGES & PROGRESS
  // =========================================================================

  public getGroupChallenges(groupId: string): GroupChallenge[] {
    return this.db.groupChallenges
      .filter((c) => c.groupId === groupId)
      .sort((a, b) => (a.isCompleted === b.isCompleted ? 0 : a.isCompleted ? 1 : -1));
  }

  public contributeToGroupChallenge(challengeId: string, userId: string, count: number = 1): GroupChallenge | null {
    const challenge = this.db.groupChallenges.find((c) => c.id === challengeId);
    if (!challenge) return null;

    const user = this.db.users.find((u) => u.id === userId);
    const userName = user?.name || 'Contributor';

    if (!challenge.contributors) challenge.contributors = [];
    let cont = challenge.contributors.find((c) => c.userId === userId);
    if (cont) {
      cont.count += count;
    } else {
      challenge.contributors.push({ userId, name: userName, count });
    }

    challenge.currentCount += count;
    if (challenge.currentCount >= challenge.targetCount && !challenge.isCompleted) {
      challenge.isCompleted = true;
      const group = this.getGroupById(challenge.groupId);
      if (group) {
        group.groupXP = (group.groupXP || 0) + challenge.xpReward;
        group.weeklyCompletedLessons = (group.weeklyCompletedLessons || 0) + 1;
      }
    }

    this.persist();
    return challenge;
  }

  public getGroupLeaderboard(groupId: string): Array<{
    userId: string;
    name: string;
    username: string;
    avatar?: string;
    class: ClassLevel;
    groupXp: number;
    tasksCompleted: number;
    resourcesShared: number;
  }> {
    const group = this.getGroupById(groupId);
    if (!group) return [];

    return group.members.map((memberId) => {
      const u = this.db.users.find((usr) => usr.id === memberId);
      const tasksCompleted = this.db.groupTasks.filter((t) => t.groupId === groupId && t.completedBy?.includes(memberId)).length;
      const resourcesShared = this.db.groupResources.filter((r) => r.groupId === groupId && r.sharedBy === memberId).length;
      const messagesCount = this.db.groupMessages.filter((m) => m.groupId === groupId && m.senderId === memberId).length;

      const groupXp = (tasksCompleted * 50) + (resourcesShared * 20) + (messagesCount * 5) + 50;

      return {
        userId: memberId,
        name: u?.name || 'Member',
        username: u?.username || 'member',
        avatar: u?.avatar || u?.profilePicture,
        class: u?.class || group.class,
        groupXp,
        tasksCompleted,
        resourcesShared,
      };
    }).sort((a, b) => b.groupXp - a.groupXp);
  }

  // =========================================================================
  // INVITATIONS & JOIN REQUESTS
  // =========================================================================

  public sendGroupInvitation(groupId: string, senderId: string, receiverId: string): GroupInvitation {
    const group = this.getGroupById(groupId);
    if (!group) throw new Error('Group not found');

    const sender = this.db.users.find((u) => u.id === senderId);
    const receiver = this.db.users.find((u) => u.id === receiverId);
    if (!receiver) throw new Error('Student not found');

    if (group.members.includes(receiverId)) {
      throw new Error('Student is already a member of this group');
    }

    // Check privacy
    const invitePref = receiver.privacySettings?.whoCanInvite || 'anyone';
    if (invitePref === 'nobody') {
      throw new Error(`${receiver.name} has disabled group invitations in their privacy settings.`);
    }
    if (invitePref === 'classmates' && sender && sender.class !== receiver.class) {
      throw new Error(`${receiver.name} only accepts invitations from peers in ${receiver.class}.`);
    }

    // Check duplicate pending invite
    const existing = this.db.groupInvitations.find(
      (inv) => inv.groupId === groupId && inv.receiverId === receiverId && inv.status === 'pending'
    );
    if (existing) return existing;

    const newInv: GroupInvitation = {
      id: `inv_${Date.now()}`,
      groupId: group.id,
      groupName: group.name,
      groupPicture: group.picture,
      groupSubject: group.subject,
      groupClass: group.class,
      senderId,
      senderName: sender?.name || 'Study Group Member',
      receiverId,
      type: 'invite',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    this.db.groupInvitations.unshift(newInv);

    // Send notification
    this.addNotification({
      userId: receiverId,
      type: 'group_invitation',
      title: 'Study Group Invitation',
      message: `${newInv.senderName} invited you to join "${group.name}".`,
      relatedGroupId: group.id,
      invitationId: newInv.id,
    });

    this.persist();
    return newInv;
  }

  public requestToJoinGroup(groupId: string, userId: string): GroupInvitation {
    const group = this.getGroupById(groupId);
    if (!group) throw new Error('Group not found');

    if (group.members.includes(userId)) {
      throw new Error('You are already a member of this group');
    }

    const sender = this.db.users.find((u) => u.id === userId);

    const newReq: GroupInvitation = {
      id: `req_${Date.now()}`,
      groupId: group.id,
      groupName: group.name,
      groupPicture: group.picture,
      groupSubject: group.subject,
      groupClass: group.class,
      senderId: userId,
      senderName: sender?.name || 'Student',
      receiverId: group.ownerId,
      type: 'join_request',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    this.db.groupInvitations.unshift(newReq);

    // Notify owner
    this.addNotification({
      userId: group.ownerId,
      type: 'group_activity',
      title: 'Join Request',
      message: `${sender?.name || 'A student'} requested to join "${group.name}".`,
      relatedGroupId: group.id,
      invitationId: newReq.id,
    });

    this.persist();
    return newReq;
  }

  public respondToInvitation(invitationId: string, userId: string, accept: boolean): { success: boolean; group?: StudyGroup } {
    const inv = this.db.groupInvitations.find((i) => i.id === invitationId);
    if (!inv) throw new Error('Invitation not found');

    if (inv.receiverId !== userId && inv.senderId !== userId) {
      throw new Error('Not authorized to respond to this invitation');
    }

    inv.status = accept ? 'accepted' : 'declined';

    // Update corresponding notification
    const notif = this.db.notifications.find((n) => n.invitationId === invitationId);
    if (notif) {
      notif.read = true;
      notif.actionTaken = accept ? 'accepted' : 'declined';
    }

    let joinedGroup: StudyGroup | undefined;
    if (accept) {
      const group = this.getGroupById(inv.groupId);
      if (group) {
        const joinerId = inv.type === 'invite' ? inv.receiverId : inv.senderId;
        if (!group.members.includes(joinerId)) {
          group.members.push(joinerId);
          group.groupXP += 25;
          group.lastActiveAt = new Date().toISOString();
        }
        joinedGroup = group;
      }
    }

    this.persist();
    return { success: true, group: joinedGroup };
  }

  // =========================================================================
  // NOTIFICATIONS SYSTEM
  // =========================================================================

  public addNotification(data: {
    userId: string;
    type: 'group_invitation' | 'group_activity' | 'study_task' | 'achievement' | 'learning' | 'system';
    title: string;
    message: string;
    relatedGroupId?: string;
    invitationId?: string;
  }): AppNotification {
    const notif: AppNotification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: data.userId,
      type: data.type,
      title: data.title,
      message: data.message,
      relatedGroupId: data.relatedGroupId,
      invitationId: data.invitationId,
      read: false,
      createdAt: new Date().toISOString(),
    };

    if (!this.db.notifications) this.db.notifications = [];
    this.db.notifications.unshift(notif);
    this.persist();
    return notif;
  }

  public getUserNotifications(userId: string): AppNotification[] {
    if (!this.db.notifications) return [];
    return this.db.notifications
      .filter((n) => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public markNotificationRead(notificationId: string, userId: string): boolean {
    const notif = this.db.notifications?.find((n) => n.id === notificationId && n.userId === userId);
    if (!notif) return false;
    notif.read = true;
    this.persist();
    return true;
  }

  public markAllNotificationsRead(userId: string): boolean {
    if (!this.db.notifications) return true;
    this.db.notifications.forEach((n) => {
      if (n.userId === userId) n.read = true;
    });
    this.persist();
    return true;
  }

  // =========================================================================
  // MODERATION, REPORTING & BLOCKING
  // =========================================================================

  public reportItem(data: {
    type: 'message' | 'user' | 'group';
    targetId: string;
    reporterId: string;
    reason: string;
    details?: string;
  }): StoredReport {
    const reporter = this.db.users.find((u) => u.id === data.reporterId);

    const report: StoredReport = {
      id: `rep_${Date.now()}`,
      type: data.type,
      targetId: data.targetId,
      reporterId: data.reporterId,
      reporterName: reporter?.name || 'Student',
      reason: data.reason,
      details: data.details,
      createdAt: new Date().toISOString(),
      status: 'open',
    };

    if (!this.db.reports) this.db.reports = [];
    this.db.reports.unshift(report);

    // If message, also append to message reports
    if (data.type === 'message') {
      const msg = this.db.groupMessages.find((m) => m.id === data.targetId);
      if (msg) {
        if (!msg.reports) msg.reports = [];
        msg.reports.push({
          reporterId: data.reporterId,
          reason: data.reason,
          createdAt: report.createdAt,
        });
      }
    }

    this.persist();
    return report;
  }

  public blockUser(userId: string, targetUserId: string): boolean {
    const user = this.db.users.find((u) => u.id === userId);
    if (!user) return false;

    if (!user.blockedUsers) user.blockedUsers = [];
    if (!user.blockedUsers.includes(targetUserId)) {
      user.blockedUsers.push(targetUserId);
    }

    this.persist();
    return true;
  }

  // =========================================================================
  // GLOBAL SEARCH (People, Groups, Books, Topics)
  // =========================================================================

  public globalSearch(query: string, requesterUserId?: string) {
    const q = query.trim().toLowerCase();
    if (!q) {
      return { people: [], groups: [], books: [], topics: [] };
    }

    // 1. People
    const people = this.searchUsers(q, requesterUserId).slice(0, 5);

    // 2. Groups
    const groups = this.getGroups(q).slice(0, 5).map((g) => ({
      id: g.id,
      name: g.name,
      class: g.class,
      subject: g.subject,
      picture: g.picture,
      membersCount: g.members.length,
      groupXP: g.groupXP,
    }));

    // 3. Topics / Courses
    const topics = this.db.topics
      .filter((t) => t.name.toLowerCase().includes(q) || t.subjectId.toLowerCase().includes(q))
      .slice(0, 5)
      .map((t) => ({
        id: t.id,
        name: t.name,
        subjectId: t.subjectId,
        difficulty: t.difficulty,
        durationMinutes: t.durationMinutes,
      }));

    return { people, groups, books: [], topics };
  }

  // Reset to seed
  public resetToDemo(): void {
    this.db = createInitialDatabase();
    this.persist();
  }
}

export const db = new DatabaseService();
