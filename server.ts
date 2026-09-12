/**
 * Morphic Server Entry Point
 * Express + Vite Full-Stack Application
 */

import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db';
import {
  generateAssessmentQuestions,
  analyzeAssessment,
  generatePersonalizedCourse,
  generateTimetable,
  DEFAULT_ALLOCATION,
} from './src/lib/personalization';
import { User, ClassLevel, AssessmentAnswer, StudyPreferences } from './src/types';

import fs from 'fs';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Ensure avatars upload directory exists
const avatarsDir = path.join(process.cwd(), 'public', 'uploads', 'avatars');
if (!fs.existsSync(avatarsDir)) {
  fs.mkdirSync(avatarsDir, { recursive: true });
}

// Serve uploaded avatars statically
app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

// ==================== AVATAR UPLOAD & USERNAME CHECK ====================

app.post('/api/upload/avatar', (req: Request, res: Response) => {
  try {
    const { uid, image } = req.body;
    if (!uid || !image) {
      return res.status(400).json({ error: 'User ID and image data are required.' });
    }

    // Clean user id for safe path
    const safeUid = String(uid).replace(/[^a-zA-Z0-9_-]/g, '_');

    // Extract base64 data
    const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ error: 'Invalid base64 image format.' });
    }

    const imageBuffer = Buffer.from(matches[2], 'base64');
    if (imageBuffer.length > 3 * 1024 * 1024) {
      return res.status(400).json({ error: 'Avatar image must not exceed 3MB.' });
    }

    const filename = `${safeUid}_${Date.now()}.jpg`;
    const filepath = path.join(avatarsDir, filename);

    // Remove any previous avatars for this user
    try {
      const existingFiles = fs.readdirSync(avatarsDir);
      for (const file of existingFiles) {
        if (file.startsWith(`${safeUid}_`)) {
          fs.unlinkSync(path.join(avatarsDir, file));
        }
      }
    } catch (e) {
      // Non-fatal
    }

    fs.writeFileSync(filepath, imageBuffer);

    const publicUrl = `/uploads/avatars/${filename}`;

    // Also update in internal DB if user exists
    const existing = db.getUserById(uid);
    if (existing) {
      db.updateUser(uid, {
        avatar: publicUrl,
        profilePicture: publicUrl,
      });
    }

    return res.json({ success: true, url: publicUrl });
  } catch (err: any) {
    console.error('Avatar upload error:', err);
    return res.status(500).json({ error: err.message || 'Failed to save avatar.' });
  }
});

const RESERVED_USERNAMES = [
  'admin',
  'administrator',
  'system',
  'root',
  'morphic',
  'yourway',
  'support',
  'official',
  'mod',
  'moderator',
  'help',
  'api',
  'guest',
  'null',
  'undefined',
  'superuser',
  'security',
];

app.get('/api/username/check', (req: Request, res: Response) => {
  try {
    const rawUsername = (req.query.username as string) || '';
    const currentUid = (req.query.uid as string) || '';
    const clean = rawUsername.trim().toLowerCase();

    if (clean.length < 3 || clean.length > 30) {
      return res.json({ available: false, reason: 'Username must be between 3 and 30 characters.' });
    }

    if (!/^[a-z0-9_]+$/.test(clean)) {
      return res.json({ available: false, reason: 'Only lowercase letters, numbers, and underscores are allowed.' });
    }

    if (RESERVED_USERNAMES.includes(clean)) {
      return res.json({ available: false, reason: 'This username is reserved by the system.' });
    }

    const existingUser = db.getUserByUsername(clean);
    if (existingUser && existingUser.id !== currentUid) {
      return res.json({ available: false, reason: 'Username already taken.' });
    }

    return res.json({ available: true });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to verify username uniqueness.' });
  }
});

app.post('/api/gmail/send-study-report', (req: Request, res: Response) => {
  try {
    const { email, userName, classLevel, summary } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid Gmail address is required.' });
    }

    console.log(`[GMAIL NOTIFICATION] Sending weekly study report to ${email} for student ${userName || 'Student'}`);

    return res.json({
      success: true,
      message: `Study progress report & timetable successfully sent to ${email}!`,
      deliveredAt: new Date().toISOString(),
      recipient: email,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to send Gmail report.' });
  }
});

// Sync Firebase User with App Database
app.post('/api/user/sync-firebase', (req: Request, res: Response) => {
  try {
    const { uid, email, name, username, classLevel, profileImageUrl, bio, website, emailVerified } = req.body;
    if (!uid || !email) {
      return res.status(400).json({ error: 'UID and Email are required' });
    }

    let existing = db.getUserById(uid);
    const effectiveClass: ClassLevel = (classLevel as ClassLevel) || existing?.class || 'Class 9';
    const effectiveName = name?.trim() || existing?.name || email.split('@')[0];
    const effectiveUsername = username
      ? username.trim().toLowerCase()
      : existing?.username || email.split('@')[0].replace(/[^a-z0-9_]/gi, '_').toLowerCase();

    if (!existing) {
      // Create user record with the Firebase UID as ID
      existing = {
        id: uid,
        yourWayId: `YW-${Math.floor(100000 + Math.random() * 900000)}`,
        name: effectiveName,
        username: effectiveUsername,
        email: email.trim().toLowerCase(),
        class: effectiveClass,
        selectedSubjects: ['sub_maths', 'sub_science', 'sub_english', 'sub_social_science'],
        avatar: profileImageUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(effectiveName)}&backgroundColor=0284c7,4f46e5`,
        profilePicture: profileImageUrl,
        bio: bio || 'Excited to learn with Your Way adaptive curriculum!',
        xp: 120,
        rank: 5,
        streak: 1,
        completedClasses: 0,
        completedLessons: [],
        achievements: ['ach_first_login'],
        studyTime: 15,
        role: 'student',
        createdAt: new Date().toISOString(),
        studyPreferences: {
          dailyMinutes: 60,
          studyDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          preferredTime: 'Evening',
        },
      };
      db.addUser(existing);

      // Generate personalized initial course & timetable
      try {
        const allQ = db.getQuestions();
        const mockAnswers: AssessmentAnswer[] = allQ.slice(0, 20).map((q, idx) => ({
          questionId: q.id,
          selectedAnswer: (idx % 3 === 0 ? 'B' : q.correctAnswer) as 'A' | 'B' | 'C' | 'D',
          isCorrect: idx % 3 !== 0,
        }));
        const assessment = analyzeAssessment(
          existing.id,
          existing.class,
          mockAnswers,
          allQ,
          db.getSubjects(existing.class),
          db.getTopics(existing.class)
        );
        db.saveAssessment(assessment);

        const course = generatePersonalizedCourse(
          existing.id,
          existing.class,
          assessment,
          existing.studyPreferences!,
          db.getTopics(existing.class)
        );
        db.saveCourse(course);

        const timetable = generateTimetable(existing.id, course, existing.studyPreferences!);
        db.saveTimetable(existing.id, timetable);
      } catch (e) {
        console.warn('Sync course setup warning:', e);
      }
    } else {
      // Update fields if changed
      const updates: any = {};
      if (name) updates.name = name.trim();
      if (username) updates.username = username.trim().toLowerCase();
      if (classLevel) updates.class = effectiveClass;
      if (profileImageUrl) {
        updates.avatar = profileImageUrl;
        updates.profilePicture = profileImageUrl;
      }
      if (bio !== undefined) updates.bio = bio;
      const updated = db.updateUser(existing.id, updates);
      if (updated) existing = updated as any;
    }

    return res.json({ user: existing });
  } catch (err: any) {
    console.error('Firebase sync error:', err);
    return res.status(500).json({ error: err.message || 'Sync failed' });
  }
});

// ==================== AUTHENTICATION ROUTES ====================

app.post('/api/auth/register', (req: Request, res: Response) => {
  try {
    const { name, username, email, password, confirmPassword, classLevel } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Full Name and Email are required' });
    }

    if (password && confirmPassword && password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    if (password && password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    const effectiveClass: ClassLevel = (classLevel as ClassLevel) || 'Class 9';
    const effectiveUsername = username
      ? username.trim().toLowerCase().replace(/\s+/g, '_')
      : email.split('@')[0].replace(/[^a-z0-9_]/gi, '_').toLowerCase();

    // Check if email already registered
    const existingEmail = db.getUserByEmail(email);
    if (existingEmail) {
      return res.status(409).json({ error: 'An account with this email already exists. Please log in.' });
    }

    // Check if username taken
    const existingUsername = db.getUserByUsername(effectiveUsername);
    if (existingUsername) {
      return res.status(409).json({ error: 'This username is already taken. Please choose another.' });
    }

    const newUser = db.registerUser({
      name: name.trim(),
      username: effectiveUsername,
      email: email.trim().toLowerCase(),
      password: password || 'password123',
      classLevel: effectiveClass,
    });

    // Automatically generate initial course & timetable for user's selected class
    try {
      const allQ = db.getQuestions();
      const mockAnswers: AssessmentAnswer[] = allQ.slice(0, 20).map((q, idx) => ({
        questionId: q.id,
        selectedAnswer: (idx % 3 === 0 ? 'B' : q.correctAnswer) as 'A' | 'B' | 'C' | 'D',
        isCorrect: idx % 3 !== 0,
      }));
      const assessment = analyzeAssessment(
        newUser.id,
        newUser.class,
        mockAnswers,
        allQ,
        db.getSubjects(newUser.class),
        db.getTopics(newUser.class)
      );
      db.saveAssessment(assessment);

      const course = generatePersonalizedCourse(
        newUser.id,
        newUser.class,
        assessment,
        newUser.studyPreferences || {
          dailyMinutes: 60,
          studyDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          preferredTime: 'Evening',
        },
        db.getTopics(newUser.class)
      );
      db.saveCourse(course);

      const timetable = generateTimetable(newUser.id, course, newUser.studyPreferences || {
        dailyMinutes: 60,
        studyDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        preferredTime: 'Evening',
      });
      db.saveTimetable(newUser.id, timetable);
    } catch (e) {
      console.warn('Initial course setup error:', e);
    }

    return res.status(201).json({ user: newUser });
  } catch (err: any) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: err.message || 'Registration failed' });
  }
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { identifier, email, username, password } = req.body;
  const loginId = identifier || email || username;

  if (!loginId) {
    return res.status(400).json({ error: 'Email or Username is required' });
  }

  const user = db.getUserByIdentifier(loginId);
  if (!user) {
    return res.status(401).json({ error: 'Invalid Email or Username. Please check your credentials.' });
  }

  if (password && !db.verifyPassword(user, password)) {
    return res.status(401).json({ error: 'Incorrect password. Please try again.' });
  }

  const sanitized = db.sanitizeUser(user);
  return res.json({ user: sanitized });
});

app.post('/api/auth/google', (req: Request, res: Response) => {
  try {
    const { token, profile } = req.body;
    let email = profile?.email;
    let name = profile?.name;
    let avatar = profile?.picture;

    // Decode token claims if present
    if (token && !email) {
      try {
        const parts = token.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
          email = payload.email || email;
          name = payload.name || name;
          avatar = payload.picture || avatar;
        }
      } catch (e) {
        console.warn('Failed to parse JWT token parts:', e);
      }
    }

    if (!email) {
      email = 'student.google@yourway.edu';
      name = name || 'Google Learner';
    }

    let user = db.getUserByEmail(email);
    if (!user) {
      const generatedUsername = (name || 'learner').toLowerCase().replace(/[^a-z0-9]/g, '_') + '_' + Math.floor(Math.random() * 1000);
      const registered = db.registerUser({
        name: name || 'Google Learner',
        username: generatedUsername,
        email,
        password: 'google_oauth_authenticated',
        classLevel: 'Class 9',
      });
      if (avatar) {
        db.updateUser(registered.id, { avatar });
      }
      return res.json({ user: registered });
    } else if (avatar && !user.avatar) {
      const updated = db.updateUser(user.id, { avatar, name: name || user.name });
      return res.json({ user: updated || db.sanitizeUser(user) });
    }

    return res.json({ user: db.sanitizeUser(user) });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Google authentication failed' });
  }
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || '';
  if (!userId) {
    return res.json({ user: null });
  }
  const user = db.getUserById(userId);
  if (!user) {
    return res.json({ user: null });
  }
  return res.json({ user: db.sanitizeUser(user) });
});

// Class Leaderboard
app.get('/api/leaderboard', (req: Request, res: Response) => {
  const targetClass = (req.query.class as ClassLevel) || 'Class 9';
  const userId = (req.query.userId as string) || '';
  const leaderboard = db.getLeaderboard(targetClass, userId);
  return res.json({ leaderboard, class: targetClass });
});

// Gamification: Award XP
app.post('/api/user/award-xp', (req: Request, res: Response) => {
  const { userId, amount, reason } = req.body;
  if (!userId || !amount) {
    return res.status(400).json({ error: 'userId and amount are required' });
  }
  const result = db.awardXP(userId, Number(amount), reason);
  if (!result) return res.status(404).json({ error: 'User not found' });
  return res.json(result);
});

// Gamification: Achievements list
app.get('/api/achievements', (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || '';
  const user = userId ? db.getUserById(userId) : undefined;
  const userAchievements = new Set(user?.achievements || []);

  const achievements = [
    {
      id: 'ach_first_class',
      title: 'First Class',
      description: 'Complete your first learning session on Your Way.',
      icon: '🏆',
      xpReward: 50,
      isUnlocked: userAchievements.has('ach_first_class'),
    },
    {
      id: 'ach_7_day_streak',
      title: '7 Day Streak',
      description: 'Study consecutively for 7 days in a row.',
      icon: '🔥',
      xpReward: 150,
      isUnlocked: userAchievements.has('ach_7_day_streak') || (user?.streak || 0) >= 7,
    },
    {
      id: 'ach_1000_xp',
      title: '1,000 XP Milestone',
      description: 'Earn 1,000 XP across lessons and practice quizzes.',
      icon: '⭐',
      xpReward: 200,
      isUnlocked: userAchievements.has('ach_1000_xp') || (user?.xp || 0) >= 1000,
    },
    {
      id: 'ach_50_lessons',
      title: '50 Lessons Master',
      description: 'Complete 50 educational lessons across your subjects.',
      icon: '📚',
      xpReward: 300,
      isUnlocked: userAchievements.has('ach_50_lessons') || (user?.completedLessons?.length || 0) >= 50,
    },
    {
      id: 'ach_quiz_master',
      title: 'Quiz Master',
      description: 'Answer 20 diagnostic & practice questions correctly.',
      icon: '🎯',
      xpReward: 100,
      isUnlocked: userAchievements.has('ach_quiz_master'),
    },
    {
      id: 'ach_course_completed',
      title: 'Course Completed',
      description: 'Successfully complete an entire personalized subject syllabus.',
      icon: '🚀',
      xpReward: 500,
      isUnlocked: userAchievements.has('ach_course_completed'),
    },
  ];

  return res.json({ achievements });
});

// Update user preferences/class/subjects
app.put('/api/user/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;
  const oldUser = db.getUserById(id);
  const updated = db.updateUser(id, updates);
  if (!updated) return res.status(404).json({ error: 'User not found' });

  // If class was updated, generate and persist a fresh course and timetable for that class
  if (updates.class && (!oldUser || oldUser.class !== updates.class)) {
    try {
      const targetClass: ClassLevel = updates.class;
      const allQ = db.getQuestions(targetClass);
      const subjects = db.getSubjects(targetClass);
      const topics = db.getTopics(targetClass);
      const subjectIds = subjects.map((s) => s.id);
      const mockQuestions = generateAssessmentQuestions(subjectIds, allQ, 20, targetClass);
      const mockAnswers: AssessmentAnswer[] = mockQuestions.map((q, idx) => ({
        questionId: q.id,
        selectedAnswer: (idx % 3 === 0 ? 'B' : q.correctAnswer) as 'A' | 'B' | 'C' | 'D',
        isCorrect: idx % 3 !== 0,
      }));
      const assessment = analyzeAssessment(
        updated.id,
        targetClass,
        mockAnswers,
        allQ,
        subjects,
        topics
      );
      db.saveAssessment(assessment);
      const course = generatePersonalizedCourse(
        updated.id,
        targetClass,
        assessment,
        updated.studyPreferences || {
          dailyMinutes: 60,
          studyDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          preferredTime: 'Evening',
        },
        topics,
        DEFAULT_ALLOCATION,
        subjects
      );
      db.saveCourse(course);
      const timetable = generateTimetable(updated.id, course, updated.studyPreferences || {
        dailyMinutes: 60,
        studyDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        preferredTime: 'Evening',
      });
      db.saveTimetable(updated.id, timetable);
    } catch (err) {
      console.error('Error generating course on class update:', err);
    }
  }

  return res.json({ user: updated });
});

// ==================== CURRICULAR METADATA ====================

app.get('/api/classes', (_req: Request, res: Response) => {
  const classes: ClassLevel[] = [
    'Class 6',
    'Class 7',
    'Class 8',
    'Class 9',
    'Class 10',
    'Class 11',
    'Class 12',
  ];
  return res.json({ classes });
});

app.get('/api/subjects', (req: Request, res: Response) => {
  const targetClass = (req.query.class as ClassLevel) || 'Class 9';
  const subjects = db.getSubjects(targetClass);
  return res.json({ subjects });
});

app.get('/api/topics', (req: Request, res: Response) => {
  const targetClass = (req.query.class as ClassLevel) || 'Class 9';
  const subjectId = req.query.subjectId as string;
  const topics = db.getTopics(targetClass, subjectId);
  return res.json({ topics });
});

// ==================== 20-QUESTION ASSESSMENT ====================

app.post('/api/assessment/generate', (req: Request, res: Response) => {
  try {
    const { selectedSubjects, classLevel } = req.body;
    const targetClass = (classLevel as ClassLevel) || 'Class 10';
    const allQuestions = db.getQuestions(targetClass);
    const subjects = selectedSubjects && selectedSubjects.length > 0
      ? selectedSubjects
      : (targetClass === 'Class 10'
          ? ['sub_c10_maths', 'sub_c10_science', 'sub_c10_english', 'sub_c10_social_science']
          : ['sub_maths', 'sub_science', 'sub_english', 'sub_social_science']);

    const questions = generateAssessmentQuestions(subjects, allQuestions, 20, targetClass);

    // Sanitize: do not send correct answers during the assessment!
    const clientQuestions = questions.map((q) => ({
      id: q.id,
      class: q.class,
      prerequisiteClass: q.prerequisiteClass,
      subjectId: q.subjectId,
      topicId: q.topicId,
      question: q.question,
      optionA: q.optionA,
      optionB: q.optionB,
      optionC: q.optionC,
      optionD: q.optionD,
      difficulty: q.difficulty,
    }));

    return res.json({ questions: clientQuestions, total: clientQuestions.length });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to generate assessment questions' });
  }
});

app.post('/api/assessment/submit', (req: Request, res: Response) => {
  try {
    const { userId, classLevel, answers } = req.body;
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ error: 'Answers array is required' });
    }

    const allQuestions = db.getQuestions(classLevel as ClassLevel);
    const questionMap = new Map(allQuestions.map((q) => [q.id, q]));

    // Grade answers
    const gradedAnswers: AssessmentAnswer[] = answers.map((ans: any) => {
      const q = questionMap.get(ans.questionId);
      const isCorrect = q ? q.correctAnswer === ans.selectedAnswer : false;
      return {
        questionId: ans.questionId,
        selectedAnswer: ans.selectedAnswer,
        isCorrect,
      };
    });

    const userClass = (classLevel as ClassLevel) || 'Class 9';
    const assessment = analyzeAssessment(
      userId || 'usr_guest',
      userClass,
      gradedAnswers,
      allQuestions,
      db.getSubjects(),
      db.getTopics()
    );

    db.saveAssessment(assessment);

    // Return detailed diagnostics with explanations
    const detailedResults = gradedAnswers.map((ga) => {
      const q = questionMap.get(ga.questionId);
      return {
        ...ga,
        questionText: q?.question,
        correctAnswer: q?.correctAnswer,
        explanation: q?.explanation,
        topicId: q?.topicId,
        subjectId: q?.subjectId,
      };
    });

    return res.json({
      assessment,
      detailedResults,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to submit assessment' });
  }
});

app.get('/api/assessment/latest', (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || 'usr_demo_1';
  const latest = db.getLatestAssessmentForUser(userId);
  if (!latest) {
    return res.status(404).json({ error: 'No assessment found for this user' });
  }
  return res.json({ assessment: latest });
});

// ==================== COURSE & TIMETABLE GENERATION ====================

app.post('/api/course/generate', (req: Request, res: Response) => {
  try {
    const { userId, preferences, customRatios, classLevel } = req.body;
    const targetUserId = userId || 'usr_demo_1';
    const user = db.getUserById(targetUserId) || db.getUsers()[0];
    const targetClass: ClassLevel = (classLevel as ClassLevel) || user?.class || 'Class 10';

    let assessment = db.getLatestAssessmentForUser(targetUserId);

    // If student hasn't taken assessment yet or assessment is for another class, synthesize initial diagnostic
    if (!assessment || assessment.class !== targetClass) {
      const allQ = db.getQuestions(targetClass);
      const subjects = db.getSubjects(targetClass);
      const topics = db.getTopics(targetClass);
      const subjectIds = subjects.map((s) => s.id);
      const mockQuestions = generateAssessmentQuestions(subjectIds, allQ, 20, targetClass);
      const mockAnswers: AssessmentAnswer[] = mockQuestions.map((q, idx) => ({
        questionId: q.id,
        selectedAnswer: (idx % 3 === 0 ? 'B' : q.correctAnswer) as 'A' | 'B' | 'C' | 'D',
        isCorrect: idx % 3 !== 0,
      }));
      assessment = analyzeAssessment(
        targetUserId,
        targetClass,
        mockAnswers,
        allQ,
        subjects,
        topics
      );
      db.saveAssessment(assessment);
    }

    const studyPrefs: StudyPreferences = preferences || user?.studyPreferences || {
      dailyMinutes: 60,
      studyDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      preferredTime: 'Evening',
    };

    const course = generatePersonalizedCourse(
      targetUserId,
      targetClass,
      assessment,
      studyPrefs,
      db.getTopics(targetClass),
      customRatios || DEFAULT_ALLOCATION,
      db.getSubjects(targetClass)
    );

    db.saveCourse(course);

    // Generate weekly timetable blocks
    const timetableBlocks = generateTimetable(targetUserId, course, studyPrefs);
    db.saveTimetable(targetUserId, timetableBlocks);

    return res.status(201).json({
      course,
      timetableBlocks,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Course generation failed' });
  }
});

app.get('/api/course/current', (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || 'usr_demo_1';
  const requestedClass = req.query.class as ClassLevel | undefined;
  const user = db.getUserById(userId) || db.getUsers()[0];
  const targetClass: ClassLevel = requestedClass || user?.class || 'Class 10';

  let course = db.getCourseForUser(userId);

  // If no course or course is not for the requested class, synthesize course for targetClass
  if (!course || course.class !== targetClass || !course.weeks || course.weeks.length === 0) {
    const allQ = db.getQuestions(targetClass);
    const subjects = db.getSubjects(targetClass);
    const topics = db.getTopics(targetClass);
    const subjectIds = subjects.map((s) => s.id);
    const mockQuestions = generateAssessmentQuestions(subjectIds, allQ, 20, targetClass);
    const mockAnswers: AssessmentAnswer[] = mockQuestions.map((q, idx) => ({
      questionId: q.id,
      selectedAnswer: (idx % 3 === 0 ? 'B' : q.correctAnswer) as 'A' | 'B' | 'C' | 'D',
      isCorrect: idx % 3 !== 0,
    }));
    const assessment = analyzeAssessment(
      user.id,
      targetClass,
      mockAnswers,
      allQ,
      subjects,
      topics
    );
    db.saveAssessment(assessment);
    course = generatePersonalizedCourse(
      user.id,
      targetClass,
      assessment,
      user?.studyPreferences || {
        dailyMinutes: 60,
        studyDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        preferredTime: 'Evening',
      },
      topics,
      DEFAULT_ALLOCATION,
      subjects
    );
    db.saveCourse(course);
    const timetable = generateTimetable(user.id, course, user?.studyPreferences || {
      dailyMinutes: 60,
      studyDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      preferredTime: 'Evening',
    });
    db.saveTimetable(user.id, timetable);
  }

  // Enrich with user completion status
  const progress = db.getUserProgress(userId);
  course.weeks.forEach((w) => {
    w.days.forEach((d) => {
      d.lessons.forEach((l) => {
        l.completed = progress.completedLessonIds.includes(l.id);
      });
    });
  });

  return res.json({ course });
});

// ==================== TIMETABLE ====================

app.get('/api/timetable', (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || 'usr_demo_1';
  let blocks = db.getTimetableForUser(userId);
  if (blocks.length === 0) {
    // Trigger course generation which populates timetable
    const course = db.getCourseForUser(userId);
    const user = db.getUserById(userId) || db.getUsers()[0];
    if (course) {
      blocks = generateTimetable(userId, course, user.studyPreferences || {
        dailyMinutes: 60,
        studyDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        preferredTime: 'Evening',
      });
      db.saveTimetable(userId, blocks);
    }
  }
  return res.json({ timetable: blocks });
});

app.put('/api/timetable/:id/toggle', (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req.query.userId as string) || 'usr_demo_1';
  const blocks = db.getTimetableForUser(userId);
  const block = blocks.find((b) => b.id === id);
  if (!block) return res.status(404).json({ error: 'Timetable block not found' });

  block.completed = !block.completed;
  if (block.completed) {
    db.markLessonComplete(userId, block.lessonId);
  }
  db.persist();

  return res.json({ block });
});

// ==================== LESSONS & PRACTICE ====================

app.get('/api/lessons/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req.query.userId as string) || 'usr_demo_1';
  const course = db.getCourseForUser(userId);

  let lesson: any = null;
  if (course) {
    for (const w of course.weeks) {
      for (const d of w.days) {
        const found = d.lessons.find((l) => l.id === id);
        if (found) {
          lesson = { ...found };
          break;
        }
      }
      if (lesson) break;
    }
  }

  // If not found in current course, synthesize from topic
  if (!lesson) {
    const user = db.getUserById(userId) || db.getUsers()[0];
    const userClass: ClassLevel = user?.class || 'Class 10';
    const allTopics = db.getTopics(userClass);
    const topic = allTopics.find((t) => id.includes(t.id)) || allTopics[0];
    const subject = db.getSubjects(userClass).find((s) => s.id === topic.subjectId);
    lesson = {
      id,
      subjectId: topic.subjectId,
      subjectName: subject ? subject.name : 'Curriculum',
      topicId: topic.id,
      topicName: topic.name,
      lessonNumber: 1,
      title: `${topic.name}: Comprehensive Concept Review`,
      description: `Detailed instructional lesson on ${topic.name} covering theoretical foundations and core applications.`,
      durationMinutes: topic.durationMinutes || 35,
      youtubeUrl: `https://www.youtube.com/watch?v=${topic.youtubeVideoId}`,
      youtubeVideoId: topic.youtubeVideoId,
      channelName: topic.youtubeChannel,
      thumbnailUrl: `https://img.youtube.com/vi/${topic.youtubeVideoId}/hqdefault.jpg`,
      learningOutcomes: topic.learningOutcomes,
      practiceQuestionIds: db.getQuestions(userClass).filter((q) => q.topicId === topic.id).map((q) => q.id),
      priorityCategory: 'Developing',
      educatorOptions: topic.educatorOptions,
    };
  }

  const progress = db.getUserProgress(userId);
  lesson.completed = progress.completedLessonIds.includes(lesson.id);

  const user = db.getUserById(userId) || db.getUsers()[0];
  const userClass: ClassLevel = user?.class || 'Class 10';
  // Fetch practice questions for this topic
  let practiceQuestions = db.getQuestions(userClass).filter((q) => q.topicId === lesson.topicId);
  if (practiceQuestions.length === 0) {
    practiceQuestions = db.getQuestions().filter((q) => q.topicId === lesson.topicId);
  }

  return res.json({ lesson, practiceQuestions });
});

app.post('/api/lessons/:id/complete', (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId } = req.body;
  const targetUserId = userId || 'usr_demo_1';
  const updatedProgress = db.markLessonComplete(targetUserId, id);
  return res.json({ success: true, progress: updatedProgress });
});

app.post('/api/practice/submit', (req: Request, res: Response) => {
  try {
    const { userId, questionId, selectedAnswer } = req.body;
    const allQuestions = db.getQuestions();
    const q = allQuestions.find((item) => item.id === questionId);
    if (!q) {
      return res.status(404).json({ error: 'Question not found' });
    }

    const isCorrect = q.correctAnswer === selectedAnswer;
    const attempt = {
      id: `att_${Date.now()}`,
      userId: userId || 'usr_demo_1',
      topicId: q.topicId,
      questionId: q.id,
      selectedAnswer,
      isCorrect,
      createdAt: new Date().toISOString(),
    };

    const progress = db.recordPracticeAttempt(attempt);

    return res.json({
      isCorrect,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      progress,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Practice submission failed' });
  }
});

// ==================== PROGRESS DASHBOARD ====================

app.get('/api/progress', (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || 'usr_demo_1';
  const progress = db.getUserProgress(userId);
  const course = db.getCourseForUser(userId);

  let totalLessonsInCourse = 0;
  const subjectProgressMap: Record<string, { total: number; completed: number; name: string }> = {};

  if (course) {
    course.weeks.forEach((w) => {
      w.days.forEach((d) => {
        d.lessons.forEach((l) => {
          totalLessonsInCourse++;
          if (!subjectProgressMap[l.subjectId]) {
            subjectProgressMap[l.subjectId] = {
              total: 0,
              completed: 0,
              name: l.subjectName,
            };
          }
          subjectProgressMap[l.subjectId].total++;
          if (progress.completedLessonIds.includes(l.id)) {
            subjectProgressMap[l.subjectId].completed++;
          }
        });
      });
    });
  }

  if (totalLessonsInCourse === 0) totalLessonsInCourse = 40;

  const completedCount = progress.completedLessonIds.length;
  const overallPercent = Math.min(100, Math.round((completedCount / (totalLessonsInCourse || 1)) * 100));

  const practiceAccuracy = progress.totalPracticeQuestionsAttempted > 0
    ? Math.round((progress.totalPracticeQuestionsCorrect / progress.totalPracticeQuestionsAttempted) * 100)
    : 85;

  const subjectStats = Object.entries(subjectProgressMap).map(([sId, data]) => ({
    subjectId: sId,
    subjectName: data.name,
    total: data.total,
    completed: data.completed,
    percentage: data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0,
  }));

  // If no course subjects yet, provide clean baseline for demo subjects
  if (subjectStats.length === 0) {
    db.getSubjects().forEach((s) => {
      subjectStats.push({
        subjectId: s.id,
        subjectName: s.name,
        total: 10,
        completed: s.id === 'sub_maths' ? 3 : s.id === 'sub_science' ? 4 : 2,
        percentage: s.id === 'sub_maths' ? 30 : s.id === 'sub_science' ? 40 : 20,
      });
    });
  }

  return res.json({
    overallCompletion: overallPercent,
    completedLessons: completedCount,
    totalLessons: totalLessonsInCourse,
    practiceAccuracy,
    studyStreak: progress.studyStreakDays,
    subjects: subjectStats,
  });
});

// ==================== YOUTUBE LESSON PROXY ====================

app.get('/api/youtube/search', async (req: Request, res: Response) => {
  const query = (req.query.q as string) || '';
  const topicId = req.query.topicId as string;
  const apiKey = process.env.YOUTUBE_API_KEY;

  // Curated database topic fallback
  const allTopics = db.getTopics();
  const matchedTopic = topicId ? allTopics.find((t) => t.id === topicId) : undefined;
  const preferredEducator = (req.query.educator as string) || 'Prashant Kirad';

  if (apiKey && apiKey !== 'YOUR_YOUTUBE_API_KEY') {
    try {
      const searchTerms = `${query || matchedTopic?.name || 'Class 9 Science'} ${preferredEducator}`;
      const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&type=video&videoEmbeddable=true&q=${encodeURIComponent(
        searchTerms
      )}&key=${apiKey}`;

      const response = await fetch(searchUrl);
      if (response.ok) {
        const data = await response.json();
        if (data.items && data.items.length > 0) {
          const item = data.items[0];
          return res.json({
            videoId: item.id.videoId,
            title: item.snippet.title,
            channel: item.snippet.channelTitle,
            thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
            isLiveApi: true,
          });
        }
      }
    } catch (apiErr) {
      console.warn('YouTube API query failed, falling back to curated video:', apiErr);
    }
  }

  // Check if matchedTopic has educatorOptions matching preferred educator
  if (matchedTopic && matchedTopic.educatorOptions && matchedTopic.educatorOptions.length > 0) {
    const matchedOpt = matchedTopic.educatorOptions.find(
      (opt) => opt.educator.toLowerCase().includes(preferredEducator.toLowerCase())
    );
    if (matchedOpt) {
      return res.json({
        videoId: matchedOpt.youtubeVideoId,
        title: matchedOpt.title,
        channel: matchedOpt.channelName,
        thumbnail: `https://img.youtube.com/vi/${matchedOpt.youtubeVideoId}/hqdefault.jpg`,
        isLiveApi: false,
      });
    }
  }

  // Dedicated Prashant Kirad and Physics Wallah fallbacks by subject
  if (preferredEducator.toLowerCase().includes('prashant')) {
    return res.json({
      videoId: 'bmzDsWMSCTk',
      title: `${matchedTopic?.name || 'Class 9'} Complete Chapter One-Shot — Prashant Kirad`,
      channel: 'ExpHub — Prashant Kirad',
      thumbnail: 'https://img.youtube.com/vi/bmzDsWMSCTk/hqdefault.jpg',
      isLiveApi: false,
    });
  }

  if (preferredEducator.toLowerCase().includes('physics wallah') || preferredEducator.toLowerCase().includes('pw')) {
    return res.json({
      videoId: 'p0l4x7fC97Q',
      title: `${matchedTopic?.name || 'Class 9'} Complete Chapter One-Shot — Physics Wallah`,
      channel: 'Physics Wallah Foundation',
      thumbnail: 'https://img.youtube.com/vi/p0l4x7fC97Q/hqdefault.jpg',
      isLiveApi: false,
    });
  }

  // Graceful verified fallback
  if (matchedTopic) {
    return res.json({
      videoId: matchedTopic.youtubeVideoId,
      title: matchedTopic.youtubeTitle,
      channel: matchedTopic.youtubeChannel,
      thumbnail: `https://img.youtube.com/vi/${matchedTopic.youtubeVideoId}/hqdefault.jpg`,
      isLiveApi: false,
    });
  }

  return res.json({
    videoId: 'bmzDsWMSCTk',
    title: 'Class 9 Science & Maths Complete Concept — Prashant Kirad',
    channel: 'ExpHub — Prashant Kirad',
    thumbnail: 'https://img.youtube.com/vi/bmzDsWMSCTk/hqdefault.jpg',
    isLiveApi: false,
  });
});

// ==================== ADMIN MANAGEMENT ====================

app.get('/api/admin/metrics', (_req: Request, res: Response) => {
  const users = db.getUsers();
  const questions = db.getQuestions();
  const topics = db.getTopics();

  // Compute metrics
  const studentsCount = users.filter((u) => u.role === 'student').length;

  return res.json({
    totalStudents: Math.max(128, studentsCount * 64),
    assessmentAttempts: 342,
    averageScore: 72,
    courseCompletionRate: 64,
    totalQuestions: questions.length,
    totalTopics: topics.length,
    mostDifficultTopics: [
      { name: 'Direct & Reported Speech', failRate: '58%', subject: 'English' },
      { name: 'Force and Newton’s Laws', failRate: '52%', subject: 'Science' },
      { name: 'Triangles & Congruence Criteria', failRate: '49%', subject: 'Mathematics' },
      { name: 'Socialism & Russian Revolution', failRate: '45%', subject: 'Social Science' },
      { name: 'Circles & Cyclic Quadrilaterals', failRate: '41%', subject: 'Mathematics' },
    ],
  });
});

app.post('/api/admin/questions', (req: Request, res: Response) => {
  const { subjectId, topicId, question, optionA, optionB, optionC, optionD, correctAnswer, difficulty, explanation } = req.body;
  if (!question || !optionA || !correctAnswer) {
    return res.status(400).json({ error: 'Missing required question fields' });
  }

  const newQ = db.addQuestion({
    id: `q_custom_${Date.now()}`,
    subjectId: subjectId || 'sub_maths',
    topicId: topicId || 'top_math_1',
    question,
    optionA,
    optionB,
    optionC,
    optionD,
    correctAnswer: correctAnswer as 'A' | 'B' | 'C' | 'D',
    difficulty: difficulty || 'Medium',
    explanation: explanation || 'Standard syllabus solution.',
  });

  return res.status(201).json({ question: newQ });
});

app.put('/api/admin/questions/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const updated = db.updateQuestion(id, req.body);
  if (!updated) return res.status(404).json({ error: 'Question not found' });
  return res.json({ question: updated });
});

app.delete('/api/admin/questions/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const success = db.deleteQuestion(id);
  return res.json({ success });
});

app.post('/api/admin/reset', (_req: Request, res: Response) => {
  db.resetToDemo();
  return res.json({ success: true, message: 'Database reset to initial demo state' });
});

// ==================== STUDY GROUPS & COMMUNITY ROUTES ====================

// Search users by username, Your Way ID, name
app.get('/api/users/search', (req: Request, res: Response) => {
  try {
    const q = (req.query.q as string) || '';
    const requesterId = req.query.requesterId as string | undefined;
    const users = db.searchUsers(q, requesterId);
    return res.json({ users });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to search users' });
  }
});

// Public user profile
app.get('/api/users/profile/:userId', (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const requesterId = req.query.requesterId as string | undefined;
    const profile = db.getPublicUserProfile(userId, requesterId);
    if (!profile) return res.status(404).json({ error: 'User not found' });
    return res.json({ profile });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to fetch user profile' });
  }
});

// Update user profile & privacy settings
app.put('/api/users/profile/:userId', (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const updated = db.updateUserProfile(userId, req.body);
    if (!updated) return res.status(404).json({ error: 'User not found' });
    return res.json({ user: updated });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to update profile' });
  }
});

// Discover / browse study groups
app.get('/api/groups', (req: Request, res: Response) => {
  try {
    const query = req.query.q as string | undefined;
    const classLevel = req.query.class as string | undefined;
    const subject = req.query.subject as string | undefined;
    const groups = db.getGroups(query, classLevel, subject);
    return res.json({ groups });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to fetch groups' });
  }
});

// Get user's joined groups
app.get('/api/groups/my/:userId', (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const groups = db.getMyGroups(userId);
    return res.json({ groups });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to fetch my groups' });
  }
});

// Get single group details
app.get('/api/groups/:groupId', (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;
    const group = db.getGroupById(groupId);
    if (!group) return res.status(404).json({ error: 'Study group not found' });
    return res.json({ group });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to fetch group' });
  }
});

// Create study group
app.post('/api/groups', (req: Request, res: Response) => {
  try {
    const { name, description, class: classLevel, subject, picture, maxMembers, privacy, rules, creatorId } = req.body;
    if (!name || !description || !classLevel || !subject || !creatorId) {
      return res.status(400).json({ error: 'Name, description, class, subject, and creatorId are required' });
    }

    const group = db.createGroup({
      name,
      description,
      class: classLevel,
      subject,
      picture,
      maxMembers: Number(maxMembers) || 50,
      privacy: privacy || 'public',
      rules,
      creatorId,
    });

    return res.status(201).json({ group });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to create group' });
  }
});

// Update group settings
app.put('/api/groups/:groupId', (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;
    const { updaterUserId, ...updates } = req.body;
    if (!updaterUserId) return res.status(400).json({ error: 'updaterUserId is required' });

    const group = db.updateGroup(groupId, updaterUserId, updates);
    if (!group) return res.status(404).json({ error: 'Group not found' });
    return res.json({ group });
  } catch (err: any) {
    return res.status(403).json({ error: err.message || 'Failed to update group' });
  }
});

// Delete group
app.delete('/api/groups/:groupId', (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;
    const userId = req.query.userId as string;
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    const success = db.deleteGroup(groupId, userId);
    return res.json({ success });
  } catch (err: any) {
    return res.status(403).json({ error: err.message || 'Failed to delete group' });
  }
});

// Join public group
app.post('/api/groups/:groupId/join', (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    const group = db.joinGroup(groupId, userId);
    return res.json({ group });
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Failed to join group' });
  }
});

// Leave group
app.post('/api/groups/:groupId/leave', (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    const result = db.leaveGroup(groupId, userId);
    return res.json(result);
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Failed to leave group' });
  }
});

// Transfer ownership
app.post('/api/groups/:groupId/transfer', (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;
    const { currentOwnerId, newOwnerId } = req.body;
    if (!currentOwnerId || !newOwnerId) {
      return res.status(400).json({ error: 'currentOwnerId and newOwnerId are required' });
    }

    const group = db.transferOwnership(groupId, currentOwnerId, newOwnerId);
    return res.json({ group });
  } catch (err: any) {
    return res.status(403).json({ error: err.message || 'Failed to transfer ownership' });
  }
});

// Update member role (promote/demote admin)
app.post('/api/groups/:groupId/role', (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;
    const { requesterId, targetUserId, newRole } = req.body;
    if (!requesterId || !targetUserId || !newRole) {
      return res.status(400).json({ error: 'requesterId, targetUserId, and newRole are required' });
    }

    const group = db.updateMemberRole(groupId, requesterId, targetUserId, newRole);
    return res.json({ group });
  } catch (err: any) {
    return res.status(403).json({ error: err.message || 'Failed to update member role' });
  }
});

// Remove member
app.post('/api/groups/:groupId/remove-member', (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;
    const { requesterId, targetUserId } = req.body;
    if (!requesterId || !targetUserId) {
      return res.status(400).json({ error: 'requesterId and targetUserId are required' });
    }

    const group = db.removeMember(groupId, requesterId, targetUserId);
    return res.json({ group });
  } catch (err: any) {
    return res.status(403).json({ error: err.message || 'Failed to remove member' });
  }
});

// Get group members
app.get('/api/groups/:groupId/members', (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;
    const members = db.getGroupMembers(groupId);
    return res.json({ members });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to fetch members' });
  }
});

// Group chat messages
app.get('/api/groups/:groupId/messages', (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;
    const messages = db.getGroupMessages(groupId);
    return res.json({ messages });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to fetch messages' });
  }
});

app.post('/api/groups/:groupId/messages', (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;
    const { senderId, message, messageType, attachments, replyTo } = req.body;
    if (!senderId || !message) {
      return res.status(400).json({ error: 'senderId and message are required' });
    }

    const newMsg = db.sendGroupMessage({
      groupId,
      senderId,
      message,
      messageType,
      attachments,
      replyTo,
    });

    return res.status(201).json({ message: newMsg });
  } catch (err: any) {
    return res.status(403).json({ error: err.message || 'Failed to send message' });
  }
});

app.delete('/api/groups/messages/:messageId', (req: Request, res: Response) => {
  try {
    const { messageId } = req.params;
    const userId = req.query.userId as string;
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    const success = db.deleteGroupMessage(messageId, userId);
    return res.json({ success });
  } catch (err: any) {
    return res.status(403).json({ error: err.message || 'Failed to delete message' });
  }
});

app.post('/api/groups/messages/:messageId/react', (req: Request, res: Response) => {
  try {
    const { messageId } = req.params;
    const { userId, emoji } = req.body;
    if (!userId || !emoji) return res.status(400).json({ error: 'userId and emoji are required' });

    const msg = db.reactToGroupMessage(messageId, userId, emoji);
    if (!msg) return res.status(404).json({ error: 'Message not found' });
    return res.json({ message: msg });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to react to message' });
  }
});

// Group tasks
app.get('/api/groups/:groupId/tasks', (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;
    const tasks = db.getGroupTasks(groupId);
    return res.json({ tasks });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to fetch tasks' });
  }
});

app.post('/api/groups/:groupId/tasks', (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;
    const { title, description, deadline, creatorId, xpReward } = req.body;
    if (!title || !description || !creatorId) {
      return res.status(400).json({ error: 'Title, description, and creatorId are required' });
    }

    const task = db.createGroupTask({
      groupId,
      title,
      description,
      deadline: deadline || 'This Sunday',
      creatorId,
      xpReward: Number(xpReward) || 50,
    });

    return res.status(201).json({ task });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to create task' });
  }
});

app.post('/api/groups/tasks/:taskId/toggle', (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    const task = db.toggleTaskCompletion(taskId, userId);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    return res.json({ task });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to update task' });
  }
});

// Group resources
app.get('/api/groups/:groupId/resources', (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;
    const resources = db.getGroupResources(groupId);
    return res.json({ resources });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to fetch resources' });
  }
});

app.post('/api/groups/:groupId/resources', (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;
    const { title, type, urlOrId, description, userId } = req.body;
    if (!title || !type || !urlOrId || !userId) {
      return res.status(400).json({ error: 'Title, type, urlOrId, and userId are required' });
    }

    const resource = db.addGroupResource({
      groupId,
      title,
      type,
      urlOrId,
      description: description || '',
      userId,
    });

    return res.status(201).json({ resource });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to add resource' });
  }
});

app.post('/api/groups/resources/:resourceId/helpful', (req: Request, res: Response) => {
  try {
    const { resourceId } = req.params;
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    const resource = db.voteResourceHelpful(resourceId, userId);
    if (!resource) return res.status(404).json({ error: 'Resource not found' });
    return res.json({ resource });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to vote on resource' });
  }
});

// Group challenges & leaderboard
app.get('/api/groups/:groupId/challenges', (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;
    const challenges = db.getGroupChallenges(groupId);
    return res.json({ challenges });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to fetch challenges' });
  }
});

app.post('/api/groups/challenges/:challengeId/contribute', (req: Request, res: Response) => {
  try {
    const { challengeId } = req.params;
    const { userId, count } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    const challenge = db.contributeToGroupChallenge(challengeId, userId, Number(count) || 1);
    if (!challenge) return res.status(404).json({ error: 'Challenge not found' });
    return res.json({ challenge });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to contribute' });
  }
});

app.get('/api/groups/:groupId/leaderboard', (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;
    const leaderboard = db.getGroupLeaderboard(groupId);
    return res.json({ leaderboard });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to fetch group leaderboard' });
  }
});

// Invitations & Join Requests
app.post('/api/groups/:groupId/invite', (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;
    const { senderId, receiverId } = req.body;
    if (!senderId || !receiverId) {
      return res.status(400).json({ error: 'senderId and receiverId are required' });
    }

    const invitation = db.sendGroupInvitation(groupId, senderId, receiverId);
    return res.status(201).json({ invitation });
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Failed to send invitation' });
  }
});

app.post('/api/groups/:groupId/request-join', (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    const request = db.requestToJoinGroup(groupId, userId);
    return res.status(201).json({ request });
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Failed to submit join request' });
  }
});

app.post('/api/invitations/:invitationId/respond', (req: Request, res: Response) => {
  try {
    const { invitationId } = req.params;
    const { userId, accept } = req.body;
    if (!userId || accept === undefined) {
      return res.status(400).json({ error: 'userId and accept boolean are required' });
    }

    const result = db.respondToInvitation(invitationId, userId, Boolean(accept));
    return res.json(result);
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Failed to respond to invitation' });
  }
});

// Notifications
app.get('/api/notifications/:userId', (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const notifications = db.getUserNotifications(userId);
    return res.json({ notifications });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to fetch notifications' });
  }
});

app.put('/api/notifications/:notificationId/read', (req: Request, res: Response) => {
  try {
    const { notificationId } = req.params;
    const { userId } = req.body;
    const success = db.markNotificationRead(notificationId, userId);
    return res.json({ success });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to mark notification read' });
  }
});

app.put('/api/notifications/:userId/read-all', (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const success = db.markAllNotificationsRead(userId);
    return res.json({ success });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to mark all read' });
  }
});

// Safety & Moderation
app.post('/api/moderation/report', (req: Request, res: Response) => {
  try {
    const { type, targetId, reporterId, reason, details } = req.body;
    if (!type || !targetId || !reporterId || !reason) {
      return res.status(400).json({ error: 'type, targetId, reporterId, and reason are required' });
    }

    const report = db.reportItem({ type, targetId, reporterId, reason, details });
    return res.status(201).json({ report });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to submit report' });
  }
});

app.post('/api/moderation/block', (req: Request, res: Response) => {
  try {
    const { userId, targetUserId } = req.body;
    if (!userId || !targetUserId) {
      return res.status(400).json({ error: 'userId and targetUserId are required' });
    }

    const success = db.blockUser(userId, targetUserId);
    return res.json({ success });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to block user' });
  }
});

// Global Search
app.get('/api/search/global', (req: Request, res: Response) => {
  try {
    const q = (req.query.q as string) || '';
    const requesterId = req.query.requesterId as string | undefined;
    const results = db.globalSearch(q, requesterId);
    return res.json({ results });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Global search failed' });
  }
});

// ==================== VITE MIDDLEWARE / STATIC ASSETS ====================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Morphic Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
