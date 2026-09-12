import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { MobileNav } from './components/MobileNav';
import { LandingPage } from './components/LandingPage';
import { OnboardingFlow } from './components/OnboardingFlow';
import { AssessmentView } from './components/AssessmentView';
import { AssessmentAnalysisView } from './components/AssessmentAnalysisView';
import { CourseView } from './components/CourseView';
import { TimetablePage } from './components/TimetablePage';
import { DashboardView } from './components/DashboardView';
import { ProgressPage } from './components/ProgressPage';
import { AdminDashboard } from './components/AdminDashboard';
import { LessonModal } from './components/LessonModal';
import { PracticeModal } from './components/PracticeModal';
import { AuthModal } from './components/AuthModal';
import { OpeningAnimation } from './components/OpeningAnimation';
import { OfficialBooksList } from './components/OfficialBooksList';
import { StudyGroupsView } from './components/study-groups/StudyGroupsView';
import { ThemePromptScreen } from './components/ThemePromptScreen';
import { ThemeModal } from './components/ThemeModal';
import { DayEndNotesModal } from './components/DayEndNotesModal';
import { BottomCornerBackButton } from './components/BottomCornerBackButton';
import { ProfileView } from './components/profile/ProfileView';
import { EditProfileModal } from './components/profile/EditProfileModal';
import { SecurityModal } from './components/profile/SecurityModal';
import { initTheme } from './lib/theme';
import { auth } from './lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

import { api } from './lib/api';
import {
  User,
  ClassLevel,
  Question,
  Assessment,
  Course,
  TimetableBlock,
  Lesson,
  StudyPreferences,
} from './types';
import { DEMO_QUESTIONS, DEMO_TOPICS, DEMO_SUBJECTS } from './data/demoData';
import { generateAssessmentQuestions } from './lib/personalization';

export default function App() {
  // Check URL params for direct routing (e.g. ?view=groups&groupId=...)
  const searchParams = new URLSearchParams(window.location.search);
  const urlView = searchParams.get('view');
  const urlGroupId = searchParams.get('groupId');

  // Navigation & View State
  const [currentView, setCurrentView] = useState<string>(urlView === 'groups' ? 'groups' : 'landing');
  const [initialGroupId, setInitialGroupId] = useState<string | null>(urlGroupId);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [showOpeningAnimation, setShowOpeningAnimation] = useState<boolean>(true);

  // Theme Selection: Shown BEFORE loading screen animation
  const [showThemePrompt, setShowThemePrompt] = useState<boolean>(() => {
    return !localStorage.getItem('your_way_theme_applied');
  });
  const [showThemeModal, setShowThemeModal] = useState<boolean>(false);

  // Whole Day Study Plan Notes Modal
  const [showDayEndNotesModal, setShowDayEndNotesModal] = useState<boolean>(false);
  const [selectedNotesChapterId, setSelectedNotesChapterId] = useState<string>('poly_class9');
  const [notesSubjectName, setNotesSubjectName] = useState<string>('Mathematics');

  // User & Curriculum State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showEditProfileModal, setShowEditProfileModal] = useState<boolean>(false);
  const [showSecurityModal, setShowSecurityModal] = useState<boolean>(false);
  const [authChecking, setAuthChecking] = useState<boolean>(true);
  const [assessmentQuestions, setAssessmentQuestions] = useState<Question[]>([]);
  const [latestAssessment, setLatestAssessment] = useState<Assessment | null>(null);
  const [assessmentDetailedResults, setAssessmentDetailedResults] = useState<any[]>([]);
  const [course, setCourse] = useState<Course | null>(null);
  const [timetable, setTimetable] = useState<TimetableBlock[]>([]);
  const [progress, setProgress] = useState<{
    overallCompletion: number;
    completedLessons: number;
    totalLessons: number;
    practiceAccuracy: number;
    studyStreak: number;
    subjects: Array<{ subjectId: string; subjectName: string; total: number; completed: number; percentage: number }>;
  }>({
    overallCompletion: 38,
    completedLessons: 15,
    totalLessons: 40,
    practiceAccuracy: 78,
    studyStreak: 5,
    subjects: [
      { subjectId: 'sub_maths', subjectName: 'Mathematics', total: 10, completed: 3, percentage: 30 },
      { subjectId: 'sub_science', subjectName: 'Science', total: 10, completed: 4, percentage: 40 },
      { subjectId: 'sub_english', subjectName: 'English', total: 10, completed: 5, percentage: 50 },
      { subjectId: 'sub_social_science', subjectName: 'Social Science', total: 10, completed: 3, percentage: 30 },
    ],
  });

  // Modal active state
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [activeLessonQuestions, setActiveLessonQuestions] = useState<Question[]>([]);
  const [practiceLesson, setPracticeLesson] = useState<Lesson | null>(null);
  const [practiceQuestions, setPracticeQuestions] = useState<Question[]>([]);

  // Helper to load user courses, timetable, and progress
  const loadUserData = async (userId: string, targetClass?: ClassLevel) => {
    try {
      const courseRes = await api.getCurrentCourse(userId, targetClass);
      if (courseRes?.course) {
        setCourse(courseRes.course);
      }
    } catch (e) {
      console.log('No active course yet');
    }

    try {
      const ttRes = await api.getTimetable(userId);
      if (ttRes?.timetable && ttRes.timetable.length > 0) {
        setTimetable(ttRes.timetable);
      }
    } catch (e) {
      console.log('No timetable yet');
    }

    try {
      const progRes = await api.getProgress(userId);
      if (progRes) {
        setProgress(progRes);
      }
    } catch (e) {
      console.log('Default progress retained');
    }

    try {
      const assessRes = await api.getLatestAssessment(userId);
      if (assessRes?.assessment) {
        setLatestAssessment(assessRes.assessment);
      }
    } catch (e) {
      console.log('No assessment yet');
    }
  };

  // Load initial user session from localStorage or server - Real Auth Only, No Demo Fallback!
  const initApp = async () => {
    try {
      const storedUserId = localStorage.getItem('your_way_user_id');
      if (storedUserId) {
        const meRes = await api.getMe(storedUserId);
        if (meRes?.user) {
          setCurrentUser(meRes.user);
          await loadUserData(meRes.user.id);
          return;
        }
      }
      setCurrentUser(null);
    } catch (err) {
      console.warn('User session check:', err);
      setCurrentUser(null);
    } finally {
      setAuthChecking(false);
    }
  };

  useEffect(() => {
    initTheme();

    // Real Firebase Auth session listener
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const syncRes = await api.syncFirebaseUser({
            uid: fbUser.uid,
            email: fbUser.email || undefined,
            name: fbUser.displayName || undefined,
            profileImageUrl: fbUser.photoURL || undefined,
            emailVerified: fbUser.emailVerified,
          });
          if (syncRes?.user) {
            setCurrentUser(syncRes.user);
            localStorage.setItem('your_way_user_id', syncRes.user.id);
            await loadUserData(syncRes.user.id);
          }
        } catch (syncErr) {
          console.warn('Firebase user sync failed, trying stored ID:', syncErr);
          await initApp();
        } finally {
          setAuthChecking(false);
        }
      } else {
        await initApp();
      }
    });

    return () => unsubscribe();
  }, []);

  // Enforce unskippable sign-in: if not logged in and animations are cleared, open unskippable AuthModal
  useEffect(() => {
    if (!authChecking && !currentUser && !showThemePrompt && !showOpeningAnimation) {
      setShowAuthModal(true);
    }
  }, [authChecking, currentUser, showThemePrompt, showOpeningAnimation]);

  // Handler: Start Diagnostic Flow
  const handleStartOnboarding = () => {
    if (!currentUser) {
      setAuthModalMode('login');
      setShowAuthModal(true);
      return;
    }
    setShowOnboarding(true);
  };

  // Handler: Completed 3-step onboarding
  const handleOnboardingComplete = async (data: {
    name: string;
    email: string;
    classLevel: ClassLevel;
    selectedSubjects: string[];
    preferences: StudyPreferences;
  }) => {
    setShowOnboarding(false);

    // Update user profile
    const updatedUser: User = {
      id: currentUser?.id || `usr_${Date.now()}`,
      name: data.name,
      email: data.email,
      class: data.classLevel,
      selectedSubjects: data.selectedSubjects,
      studyPreferences: data.preferences,
      createdAt: currentUser?.createdAt || new Date().toISOString(),
      role: 'student',
    };
    setCurrentUser(updatedUser);

    // Generate dynamic 20 questions checking previous class knowledge
    try {
      const genRes = await api.generateAssessment(data.selectedSubjects, data.classLevel);
      if (genRes?.questions && genRes.questions.length > 0) {
        setAssessmentQuestions(genRes.questions);
      } else {
        setAssessmentQuestions(generateAssessmentQuestions(data.selectedSubjects, undefined, 20, data.classLevel));
      }
    } catch (err) {
      setAssessmentQuestions(generateAssessmentQuestions(data.selectedSubjects, undefined, 20, data.classLevel));
    }

    setCurrentView('assessment');
  };

  // Handler: Submit 20-Question Assessment
  const handleAssessmentSubmit = async (
    answers: { questionId: string; selectedAnswer: 'A' | 'B' | 'C' | 'D' }[]
  ) => {
    const userId = currentUser?.id || 'usr_demo_1';
    const classLevel = currentUser?.class || 'Class 9';

    try {
      const res = await api.submitAssessment(userId, classLevel, answers);
      setLatestAssessment(res.assessment);
      setAssessmentDetailedResults(res.detailedResults || []);
      setCurrentView('analysis');
    } catch (err) {
      console.error('Submit assessment error:', err);
    }
  };

  // Handler: Generate Personalized Course from Analysis
  const handleGenerateCourse = async () => {
    const userId = currentUser?.id || 'usr_demo_1';
    const prefs: StudyPreferences = currentUser?.studyPreferences || {
      dailyMinutes: 60,
      studyDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      preferredTime: 'Evening',
    };

    try {
      const res = await api.generateCourse(userId, prefs);
      setCourse(res.course);
      setTimetable(res.timetableBlocks);

      // Refresh progress
      const progRes = await api.getProgress(userId);
      if (progRes) setProgress(progRes);

      // Navigate to Dashboard
      setCurrentView('dashboard');
    } catch (err) {
      console.error('Failed to generate course:', err);
      setCurrentView('dashboard');
    }
  };

  // Handler: Select Lesson to watch
  const handleSelectLesson = async (lesson: Lesson) => {
    const userId = currentUser?.id || 'usr_demo_1';
    try {
      const res = await api.getLesson(lesson.id, userId);
      setActiveLesson(res.lesson);
      setActiveLessonQuestions(res.practiceQuestions || []);
    } catch (err) {
      setActiveLesson(lesson);
      setActiveLessonQuestions(DEMO_QUESTIONS.filter((q) => q.topicId === lesson.topicId));
    }
  };

  // Handler: Select Lesson by ID from Timetable
  const handleSelectLessonById = async (lessonId: string) => {
    const userId = currentUser?.id || 'usr_demo_1';
    try {
      const res = await api.getLesson(lessonId, userId);
      setActiveLesson(res.lesson);
      setActiveLessonQuestions(res.practiceQuestions || []);
    } catch (err) {
      console.error('Lesson not found:', err);
    }
  };

  // Handler: Mark Lesson Complete
  const handleMarkLessonComplete = async (lessonId: string) => {
    const userId = currentUser?.id || 'usr_demo_1';
    try {
      await api.markLessonComplete(lessonId, userId);
      // Refresh user stats (XP, streak, achievements)
      try {
        const meRes = await api.getMe(userId);
        if (meRes?.user) {
          setCurrentUser(meRes.user);
        }
      } catch (e) {
        // optimistic local XP update
        setCurrentUser((prev) =>
          prev
            ? {
                ...prev,
                xp: (prev.xp || 0) + 20,
                completedClasses: (prev.completedClasses || 0) + 1,
              }
            : null
        );
      }

      // Update local state
      if (course) {
        const updatedCourse = { ...course };
        for (const week of updatedCourse.weeks) {
          for (const day of week.days) {
            for (const l of day.lessons) {
              if (l.id === lessonId) {
                l.completed = true;
              }
            }
          }
        }
        setCourse(updatedCourse);
      }
      // Refresh progress
      const prog = await api.getProgress(userId);
      if (prog) setProgress(prog);
    } catch (err) {
      console.error('Mark complete error:', err);
    }
  };

  // Handler: Launch Practice Modal
  const handleOpenPractice = (lesson: Lesson, questions: Question[]) => {
    setActiveLesson(null);
    setPracticeLesson(lesson);
    setPracticeQuestions(questions.length > 0 ? questions : DEMO_QUESTIONS.slice(0, 3));
  };

  // Handler: Submit Practice Answer
  const handleSubmitPracticeAnswer = async (
    questionId: string,
    selected: 'A' | 'B' | 'C' | 'D'
  ) => {
    const userId = currentUser?.id || 'usr_demo_1';
    const res = await api.submitPractice(userId, questionId, selected);
    if (res?.isCorrect) {
      try {
        const meRes = await api.getMe(userId);
        if (meRes?.user) setCurrentUser(meRes.user);
      } catch (e) {
        setCurrentUser((prev) => (prev ? { ...prev, xp: (prev.xp || 0) + 5 } : null));
      }
    }
    return res;
  };

  // Handler: Toggle Timetable Block
  const handleToggleBlock = async (blockId: string) => {
    const userId = currentUser?.id || 'usr_demo_1';
    try {
      await api.toggleTimetableBlock(blockId, userId);
      setTimetable((prev) =>
        prev.map((b) => (b.id === blockId ? { ...b, completed: !b.completed } : b))
      );
    } catch (err) {
      // optimistic fallback
      setTimetable((prev) =>
        prev.map((b) => (b.id === blockId ? { ...b, completed: !b.completed } : b))
      );
    }

    // Check if whole day study plan of today is now complete
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayName = dayNames[new Date().getDay()];
    setTimeout(() => {
      setTimetable((current) => {
        const todayBlocks = current.filter((b) => b.day === todayName);
        const checkBlocks = todayBlocks.length > 0 ? todayBlocks : current.slice(0, 4);
        const allCompleted = checkBlocks.length > 0 && checkBlocks.every((b) => b.completed);
        if (allCompleted) {
          const firstBlock = checkBlocks[0];
          if (firstBlock?.subjectName) {
            setNotesSubjectName(firstBlock.subjectName);
            if (firstBlock.subjectName.toLowerCase().includes('sci')) {
              setSelectedNotesChapterId('matter_class9');
            } else if (firstBlock.subjectName.toLowerCase().includes('eng')) {
              setSelectedNotesChapterId('fun_class9');
            } else {
              setSelectedNotesChapterId(currentUser?.class === 'Class 10' ? 'real_class10' : 'poly_class9');
            }
          }
          setShowDayEndNotesModal(true);
        }
        return current;
      });
    }, 250);
  };

  // Handler: Reward Notes Mastery XP
  const handleRewardNotesXP = (amount: number) => {
    setCurrentUser((prev) => (prev ? { ...prev, xp: (prev.xp || 0) + amount } : null));
  };

  // Handler: Update User Class
  const handleUpdateUserClass = async (newClass: ClassLevel) => {
    const userId = currentUser?.id || 'usr_demo_1';
    try {
      if (currentUser) {
        const res = await api.updateProfile(currentUser.id, { class: newClass });
        if (res?.user) {
          setCurrentUser(res.user);
        }
      }
      await loadUserData(userId, newClass);
    } catch (e) {
      console.error('Update class error:', e);
      setCurrentUser((prev) => (prev ? { ...prev, class: newClass } : null));
      await loadUserData(userId, newClass);
    }
  };

  // Sign out
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('Firebase signout error:', err);
    }
    localStorage.removeItem('your_way_user_id');
    setCurrentUser(null);
    setCurrentView('landing');
    setAuthModalMode('login');
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased flex flex-col">
      {/* Top Navigation Bar (Hidden during assessment for distraction-free focus) */}
      {currentView !== 'assessment' && (
        <Navbar
          currentView={currentView}
          setCurrentView={setCurrentView}
          user={currentUser}
          onOpenAssessment={handleStartOnboarding}
          onOpenAuth={(mode) => {
            setAuthModalMode(mode || 'login');
            setShowAuthModal(true);
          }}
          onLogout={handleLogout}
          onReplayIntro={() => setShowOpeningAnimation(true)}
          onOpenThemeModal={() => setShowThemeModal(true)}
          onOpenEditProfile={() => setShowEditProfileModal(true)}
          onOpenSecurity={() => setShowSecurityModal(true)}
        />
      )}

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingPage
            onStartOnboarding={handleStartOnboarding}
            onViewDashboard={() => setCurrentView('dashboard')}
            hasCourse={Boolean(course)}
            onOpenAuth={(mode) => {
              setAuthModalMode(mode || 'register');
              setShowAuthModal(true);
            }}
          />
        )}

        {currentView === 'assessment' && (
          <AssessmentView
            questions={
              assessmentQuestions.length > 0
                ? assessmentQuestions
                : DEMO_QUESTIONS.slice(0, 20)
            }
            classLevel={currentUser?.class || 'Class 9'}
            onSubmit={handleAssessmentSubmit}
            onExit={() => setCurrentView('landing')}
          />
        )}

        {currentView === 'analysis' && latestAssessment && (
          <AssessmentAnalysisView
            assessment={latestAssessment}
            onGenerateCourse={handleGenerateCourse}
            detailedResults={assessmentDetailedResults}
          />
        )}

        {currentView === 'dashboard' && (
          <DashboardView
            user={currentUser}
            course={course}
            timetable={timetable}
            progress={progress}
            onSelectLesson={handleSelectLesson}
            onToggleBlock={handleToggleBlock}
            onOpenCourse={() => setCurrentView('course')}
            onOpenTimetable={() => setCurrentView('timetable')}
            onOpenAssessment={handleStartOnboarding}
            onOpenGroups={() => setCurrentView('groups')}
            onUpdateUserClass={handleUpdateUserClass}
            onOpenNotes={(noteId) => {
              if (noteId) setSelectedNotesChapterId(noteId);
              setShowDayEndNotesModal(true);
            }}
          />
        )}

        {currentView === 'course' && (
          <CourseView
            course={
              course || {
                id: 'course_fallback',
                userId: currentUser?.id || 'usr_demo_1',
                class: currentUser?.class || 'Class 10',
                title: `${currentUser?.class || 'Class 10'} Personalized Learning Path`,
                allocationBreakdown: {
                  priorityPercentage: 40,
                  developingPercentage: 35,
                  strongPercentage: 25,
                },
                totalWeeks: 4,
                weeks: [],
                createdAt: new Date().toISOString(),
              }
            }
            userClass={currentUser?.class || 'Class 10'}
            onSelectLesson={handleSelectLesson}
            onViewTimetable={() => setCurrentView('timetable')}
            onSwitchClass={handleUpdateUserClass}
          />
        )}

        {currentView === 'timetable' && (
          <TimetablePage
            blocks={timetable}
            onToggleBlock={handleToggleBlock}
            onSelectLessonById={handleSelectLessonById}
            onOpenNotes={() => {
              setShowDayEndNotesModal(true);
            }}
          />
        )}

        {currentView === 'progress' && (
          <ProgressPage
            progress={progress}
            assessment={latestAssessment}
            onRetakeAssessment={handleStartOnboarding}
          />
        )}

        {currentView === 'books' && (
          <div className="min-h-screen bg-slate-50 py-8 sm:py-10 px-4 sm:px-6 lg:px-8 pb-24">
            <div className="max-w-5xl mx-auto">
              <OfficialBooksList userClass={currentUser?.class || 'Class 9'} />
            </div>
          </div>
        )}

        {currentView === 'groups' && (
          <StudyGroupsView
            currentUser={currentUser}
            onOpenAuth={(mode) => {
              setAuthModalMode(mode || 'register');
              setShowAuthModal(true);
            }}
            onOpenCourse={() => setCurrentView('course')}
            initialGroupId={initialGroupId}
          />
        )}

        {currentView === 'profile' && currentUser && (
          <ProfileView
            profileUser={currentUser}
            currentUser={currentUser}
            onBack={() => setCurrentView('dashboard')}
            onEditProfile={() => setShowEditProfileModal(true)}
            onOpenSecurity={() => setShowSecurityModal(true)}
            onOpenGroup={(gId) => {
              setInitialGroupId(gId);
              setCurrentView('groups');
            }}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboard onRefreshData={initApp} />
        )}
      </main>

      {/* Mobile Bottom Navigation (Hidden during assessment) */}
      {currentView !== 'assessment' && (
        <MobileNav currentView={currentView} setCurrentView={setCurrentView} hasUser={Boolean(currentUser)} />
      )}

      {/* Modals & Overlays */}
      {showOnboarding && (
        <OnboardingFlow
          onComplete={handleOnboardingComplete}
          onCancel={() => setShowOnboarding(false)}
          initialClass={currentUser?.class || 'Class 9'}
          initialSubjects={currentUser?.selectedSubjects}
          initialName={currentUser?.name}
          initialEmail={currentUser?.email}
        />
      )}

      {showAuthModal && (
        <AuthModal
          initialMode={authModalMode}
          isSkippable={Boolean(currentUser)}
          onClose={() => {
            if (currentUser) {
              setShowAuthModal(false);
            }
          }}
          onSuccess={async (user) => {
            localStorage.setItem('your_way_user_id', user.id);
            setCurrentUser(user);
            setShowAuthModal(false);
            await loadUserData(user.id);
            setCurrentView('dashboard');
          }}
        />
      )}

      {activeLesson && (
        <LessonModal
          lesson={activeLesson}
          practiceQuestions={activeLessonQuestions}
          onClose={() => setActiveLesson(null)}
          onMarkComplete={handleMarkLessonComplete}
          onOpenPractice={handleOpenPractice}
        />
      )}

      {practiceLesson && (
        <PracticeModal
          lesson={practiceLesson}
          questions={practiceQuestions}
          onClose={() => setPracticeLesson(null)}
          onSubmitAnswer={handleSubmitPracticeAnswer}
        />
      )}

      {/* 1. Theme Selection Prompt Screen — Asked BEFORE loading animation */}
      {showThemePrompt && (
        <ThemePromptScreen
          onComplete={() => {
            setShowThemePrompt(false);
          }}
        />
      )}

      {/* 2. Opening Intro Animation on launch — Runs after theme is selected */}
      <AnimatePresence>
        {!showThemePrompt && showOpeningAnimation && (
          <OpeningAnimation
            onComplete={() => {
              sessionStorage.setItem('your_way_intro_shown', 'true');
              setShowOpeningAnimation(false);
              // Make sign in step unskippable after opening animation
              if (!currentUser) {
                setAuthModalMode('login');
                setShowAuthModal(true);
              }
            }}
          />
        )}
      </AnimatePresence>

      {/* 3. Theme Settings Modal — Accessible anytime from Navbar */}
      <ThemeModal
        isOpen={showThemeModal}
        onClose={() => setShowThemeModal(false)}
      />

      {/* 4. Day-End Whole Chapter Revision Notes Modal */}
      <DayEndNotesModal
        isOpen={showDayEndNotesModal}
        onClose={() => setShowDayEndNotesModal(false)}
        initialNoteId={selectedNotesChapterId}
        daySubjectName={notesSubjectName}
        onRewardXP={handleRewardNotesXP}
      />

      {/* 5. Edit Profile Modal */}
      {currentUser && (
        <EditProfileModal
          isOpen={showEditProfileModal}
          onClose={() => setShowEditProfileModal(false)}
          currentUser={currentUser}
          onProfileUpdated={(updated) => {
            setCurrentUser(updated);
            if (updated.class !== currentUser.class) {
              loadUserData(updated.id);
            }
          }}
        />
      )}

      {/* 6. Security & Verification Modal */}
      {currentUser && (
        <SecurityModal
          isOpen={showSecurityModal}
          onClose={() => setShowSecurityModal(false)}
          currentUser={currentUser}
          onUserRefreshed={(refreshed) => {
            setCurrentUser(refreshed);
          }}
        />
      )}

      {/* 5. Universal Bottom Corner Back Button */}
      <BottomCornerBackButton
        isVisible={currentView !== 'dashboard' && currentView !== 'landing'}
        onBack={() => {
          if (activeLesson) {
            setActiveLesson(null);
            return;
          }
          if (practiceLesson) {
            setPracticeLesson(null);
            return;
          }
          if (showDayEndNotesModal) {
            setShowDayEndNotesModal(false);
            return;
          }
          setCurrentView('dashboard');
        }}
        label="Back to Dashboard"
      />
    </div>
  );
}
