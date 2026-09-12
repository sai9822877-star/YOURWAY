import React, { useState } from 'react';
import {
  Sparkles,
  Calendar,
  Clock,
  PlayCircle,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  TrendingUp,
  HelpCircle,
  Layers,
  Award,
  Circle,
  Trophy,
  Flame,
  User as UserIcon,
  GraduationCap,
  AtSign,
  ChevronRight,
  Zap,
  Users,
} from 'lucide-react';
import { Course, TimetableBlock, User, Lesson, ClassLevel } from '../types';
import { ClassLeaderboard } from './ClassLeaderboard';
import { AchievementsList } from './AchievementsList';
import { OfficialBooksList } from './OfficialBooksList';
import { ALL_CLASSES } from '../data/classCurriculum';

interface DashboardViewProps {
  user: User | null;
  course: Course | null;
  timetable: TimetableBlock[];
  progress: {
    overallCompletion: number;
    completedLessons: number;
    totalLessons: number;
    practiceAccuracy: number;
    studyStreak: number;
    subjects: Array<{ subjectId: string; subjectName: string; total: number; completed: number; percentage: number }>;
  };
  onSelectLesson: (lesson: Lesson) => void;
  onToggleBlock: (blockId: string) => void;
  onOpenCourse: () => void;
  onOpenTimetable: () => void;
  onOpenAssessment: () => void;
  onOpenGroups?: () => void;
  onUpdateUserClass?: (newClass: ClassLevel) => void;
  onOpenNotes?: (noteId?: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  course,
  timetable,
  progress,
  onSelectLesson,
  onToggleBlock,
  onOpenCourse,
  onOpenTimetable,
  onOpenAssessment,
  onOpenGroups,
  onUpdateUserClass,
  onOpenNotes,
}) => {
  const [activeTab, setActiveTab] = useState<'schedule' | 'leaderboard' | 'achievements' | 'books'>('schedule');

  // Determine greeting based on local time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = dayNames[new Date().getDay()];

  // Today's blocks
  const todayBlocks = timetable.filter((b) => b.day === todayName);
  const displayBlocks = todayBlocks.length > 0 ? todayBlocks : timetable.slice(0, 4);
  const completedToday = displayBlocks.filter((b) => b.completed).length;

  const currentClass = user?.class || 'Class 9';
  const xp = user?.xp ?? 0;
  const rank = user?.rank ?? 5;
  const streak = user?.streak ?? progress.studyStreak ?? 1;
  const completedLessons = user?.completedClasses ?? progress.completedLessons ?? 0;
  const avatarUrl =
    user?.avatar ||
    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
      user?.name || 'Student'
    )}&backgroundColor=4f46e5`;

  // Calculate Level based on XP (every 500 XP is a level)
  const currentLevel = Math.max(1, Math.floor(xp / 500) + 1);
  const nextLevelXp = currentLevel * 500;
  const currentLevelBase = (currentLevel - 1) * 500;
  const levelProgress = Math.min(100, Math.round(((xp - currentLevelBase) / 500) * 100));

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 pb-24">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* ================= 1. PERSONAL PROFILE BANNER ================= */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          {/* Subtle decorative background accent */}
          <div className="absolute -right-16 -top-16 w-56 h-56 bg-gradient-to-br from-amber-100/30 to-indigo-100/20 rounded-full blur-2xl pointer-events-none" />

          {/* Profile Identity */}
          <div className="flex items-center gap-4 sm:gap-5 z-10">
            <div className="relative">
              <img
                src={avatarUrl}
                alt={user?.name || 'Student Avatar'}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white shadow-md bg-slate-100"
              />
              <span className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 font-black text-[10px] px-1.5 py-0.5 rounded-full shadow-xs border border-white">
                Lv.{currentLevel}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-950 font-display">
                  {user?.name || 'Sai Learner'}
                </h1>
                <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-950 text-white shadow-xs">
                  <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                  {currentClass}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1">
                  <AtSign className="w-3.5 h-3.5 text-slate-400" />
                  {user?.username || 'learner_student'}
                </span>
                <span>•</span>
                <span>{user?.email || 'student@yourway.edu'}</span>
              </div>

              {/* XP Progress to Next Level */}
              <div className="pt-1.5 flex items-center gap-2 max-w-xs">
                <div className="h-1.5 w-36 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-500"
                    style={{ width: `${levelProgress}%` }}
                  />
                </div>
                <span className="text-[10px] font-bold text-slate-500">
                  {xp}/{nextLevelXp} XP
                </span>
              </div>
            </div>
          </div>

          {/* Action CTA */}
          <div className="flex flex-wrap items-center gap-2.5 self-stretch md:self-center z-10">
            <button
              id="dash-retake-diag-btn"
              onClick={onOpenAssessment}
              className="flex-1 md:flex-none text-xs font-bold px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Diagnostic Test</span>
            </button>

            <button
              id="dash-view-course-btn"
              onClick={onOpenCourse}
              className="flex-1 md:flex-none text-xs font-bold px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>Personalized Syllabus</span>
            </button>
          </div>
        </div>

        {/* ================= CLASS QUICK-SWITCHER & READINESS ================= */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-indigo-950 text-white rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shrink-0 shadow-xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  Active Curriculum: {currentClass}
                </span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Class 10 & 11 Full Courses Ready
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 max-w-xl">
                CBSE/NCERT aligned with video lectures from top educators (Physics Wallah, Prashant Kirad, Neha Agrawal, Magnet Brains), chapter notes & quizzes.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {ALL_CLASSES.map((cls) => {
              const isSelected = cls === currentClass;
              const isFeatured = cls === 'Class 10' || cls === 'Class 11';
              return (
                <button
                  key={cls}
                  id={`dash-quick-class-${cls.replace(' ', '-').toLowerCase()}`}
                  onClick={() => onUpdateUserClass?.(cls)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1 shrink-0 ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 shadow-sm font-black'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  <span>{cls}</span>
                  {isFeatured && (
                    <span className={`text-[9px] px-1 py-0.2 rounded-full uppercase font-black ${
                      isSelected ? 'bg-slate-950 text-amber-400' : 'bg-emerald-400/20 text-emerald-300'
                    }`}>
                      Full
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ================= 2. FOUR STATS CARDS ================= */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: XP Points */}
          <div
            id="stat-card-xp"
            className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                XP Points
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-100/70 text-amber-600 flex items-center justify-center">
                <Zap className="w-4 h-4 fill-amber-500 text-amber-500" />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-slate-950 font-display">
                {xp.toLocaleString()}
              </div>
              <div className="text-[11px] font-semibold text-amber-700 mt-0.5">
                Level {currentLevel} Scholar
              </div>
            </div>
          </div>

          {/* Card 2: Class Rank */}
          <div
            id="stat-card-rank"
            onClick={() => setActiveTab('leaderboard')}
            className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col justify-between cursor-pointer hover:border-slate-300 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Class Rank
              </span>
              <div className="w-8 h-8 rounded-xl bg-indigo-100/70 text-indigo-600 flex items-center justify-center">
                <Trophy className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-slate-950 font-display flex items-baseline gap-1">
                <span>#{rank}</span>
                <span className="text-xs font-semibold text-slate-400">in {currentClass}</span>
              </div>
              <div className="text-[11px] font-semibold text-indigo-600 mt-0.5 flex items-center gap-1">
                <span>View Leaderboard</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </div>

          {/* Card 3: Daily Streak */}
          <div
            id="stat-card-streak"
            className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Daily Streak
              </span>
              <div className="w-8 h-8 rounded-xl bg-rose-100/70 text-rose-600 flex items-center justify-center">
                <Flame className="w-4 h-4 fill-rose-500 text-rose-500" />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-slate-950 font-display">
                {streak} Days 🔥
              </div>
              <div className="text-[11px] font-semibold text-rose-600 mt-0.5">
                Active study habit
              </div>
            </div>
          </div>

          {/* Card 4: Completed Classes / Lessons */}
          <div
            id="stat-card-completed"
            className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Completed
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-100/70 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-slate-950 font-display">
                {completedLessons}
              </div>
              <div className="text-[11px] font-semibold text-emerald-700 mt-0.5">
                Lessons Mastered
              </div>
            </div>
          </div>
        </div>

        {/* Study Groups Hub Banner Widget */}
        {onOpenGroups && (
          <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 rounded-3xl p-5 sm:p-6 text-white border border-indigo-900/50 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">Your Way Study Groups</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    New
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5 max-w-xl">
                  Collaborate with classmates in real-time chat, share NCERT notes, and solve doubts together.
                </p>
              </div>
            </div>

            <button
              id="dashboard-open-groups-btn"
              onClick={onOpenGroups}
              className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 shrink-0 self-start sm:self-auto"
            >
              <span>Explore Groups</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ================= 3. NAVIGATION TABS ================= */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
          <button
            id="dash-tab-schedule"
            onClick={() => setActiveTab('schedule')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'schedule'
                ? 'bg-slate-950 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Today's Schedule & Learning</span>
          </button>

          <button
            id="dash-tab-leaderboard"
            onClick={() => setActiveTab('leaderboard')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'leaderboard'
                ? 'bg-slate-950 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Class Leaderboard</span>
            <span className="text-[10px] font-black px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950">
              #{rank}
            </span>
          </button>

          <button
            id="dash-tab-achievements"
            onClick={() => setActiveTab('achievements')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'achievements'
                ? 'bg-slate-950 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>Badges & Achievements</span>
          </button>

          <button
            id="dash-tab-books"
            onClick={() => setActiveTab('books')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'books'
                ? 'bg-slate-950 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-500" />
            <span>Official Books & Textbooks</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Legal Sources
            </span>
          </button>
        </div>

        {/* ================= 4. TAB CONTENTS ================= */}
        {activeTab === 'books' ? (
          <OfficialBooksList userClass={currentClass} />
        ) : activeTab === 'leaderboard' ? (
          <ClassLeaderboard currentUser={user} userClass={currentClass} />
        ) : activeTab === 'achievements' ? (
          <AchievementsList currentUser={user} />
        ) : (
          /* SCHEDULE & LEARNING PROGRESS TAB */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Schedule Column */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 font-display">
                      {todayName}'s Study Plan
                    </h2>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {completedToday} of {displayBlocks.length} sessions completed today
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    {onOpenNotes && (
                      <button
                        id="header-chapter-notes-btn"
                        type="button"
                        onClick={() => onOpenNotes()}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 transition-colors cursor-pointer"
                        title="Access whole chapter revision notes & formula sheets"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Chapter Notes</span>
                      </button>
                    )}

                    <button
                      onClick={onOpenTimetable}
                      className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors"
                    >
                      <span>Full Week</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Celebration Banner when whole day study plan ends */}
                {completedToday > 0 && completedToday === displayBlocks.length && (
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-emerald-500/10 border-2 border-indigo-500/30 mb-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
                        <Sparkles className="w-6 h-6 text-amber-300" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                            Day Complete!
                          </span>
                          <span className="text-xs font-bold text-amber-600">+100 Daily XP</span>
                        </div>
                        <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                          Whole Study Plan Finished • Chapter Notes Unlocked
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-300">
                          Complete NCERT formulas, step-by-step solved examples, and printable revision notes are ready.
                        </p>
                      </div>
                    </div>

                    {onOpenNotes && (
                      <button
                        id="open-day-end-notes-btn"
                        type="button"
                        onClick={() => onOpenNotes()}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-all active:scale-95 shrink-0 cursor-pointer"
                      >
                        <BookOpen className="w-4 h-4 text-amber-300" />
                        <span>View Whole Chapter Notes</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}

                {/* Schedule Blocks List */}
                <div className="space-y-3.5">
                  {displayBlocks.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-400">
                      No sessions scheduled for today. You can browse topics from your syllabus.
                    </div>
                  ) : (
                    displayBlocks.map((block) => {
                      const isLesson = block.type === 'lesson';

                      let actualLesson: Lesson | undefined;
                      if (course) {
                        for (const week of course.weeks) {
                          for (const day of week.days) {
                            const found = day.lessons.find((l) => l.id === block.lessonId);
                            if (found) {
                              actualLesson = found;
                              break;
                            }
                          }
                        }
                      }

                      return (
                        <div
                          key={block.id}
                          className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                            block.completed
                              ? 'bg-slate-50 border-slate-200 opacity-80'
                              : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                          }`}
                        >
                          <div className="flex items-start gap-3.5">
                            <button
                              onClick={() => onToggleBlock(block.id)}
                              className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors shrink-0"
                              title="Toggle completion"
                            >
                              {block.completed ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                              ) : (
                                <Circle className="w-5 h-5 text-slate-300" />
                              )}
                            </button>

                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                                  {block.startTime}
                                </span>
                                <span className="text-xs font-bold text-indigo-700">
                                  {block.subjectName}
                                </span>
                                <span className="text-xs text-slate-400">•</span>
                                <span className="text-xs text-slate-500">
                                  {block.durationMinutes} min
                                </span>
                              </div>

                              <div className="text-sm font-bold text-slate-900">
                                {block.topicName}
                              </div>
                            </div>
                          </div>

                          {/* Action Button */}
                          <div className="flex items-center gap-2 self-end sm:self-center">
                            {isLesson && actualLesson ? (
                              <button
                                id={`start-lesson-${block.id}`}
                                onClick={() => onSelectLesson(actualLesson!)}
                                className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-white transition-colors"
                              >
                                <PlayCircle className="w-4 h-4 text-amber-400" />
                                <span>Watch Video (+20 XP)</span>
                              </button>
                            ) : (
                              <button
                                onClick={onOpenCourse}
                                className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors"
                              >
                                <HelpCircle className="w-4 h-4" />
                                <span>Take Quiz</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Learning Progress & Subject Bars */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-6">
                <div>
                  <h2 className="text-base font-bold text-slate-900 font-display">
                    {currentClass} Syllabus Progress
                  </h2>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {progress.completedLessons} of {progress.totalLessons} lessons finished
                  </div>
                </div>

                {/* Master Completion Meter */}
                <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80 text-center">
                  <div className="text-4xl font-extrabold text-slate-950 font-display mb-1">
                    {progress.overallCompletion}%
                  </div>
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-900">
                    Overall Curriculum Completed
                  </div>
                  <div className="mt-3 h-2 w-full bg-amber-200/80 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${progress.overallCompletion}%` }}
                    />
                  </div>
                </div>

                {/* Subject Breakdown Bars */}
                <div className="space-y-3.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Subject Progress
                  </div>
                  {progress.subjects.map((sub) => (
                    <div key={sub.subjectId} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800">{sub.subjectName}</span>
                        <span className="font-semibold text-slate-500">{sub.percentage}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-slate-900 rounded-full transition-all duration-300"
                          style={{ width: `${sub.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Syllabus CTA */}
                <div className="pt-2 border-t border-slate-100">
                  <button
                    id="dash-view-full-course-btn"
                    onClick={onOpenCourse}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold transition-colors"
                  >
                    <BookOpen className="w-4 h-4 text-amber-600" />
                    <span>Open Full Curriculum</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
