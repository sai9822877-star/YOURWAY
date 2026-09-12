import React, { useState } from 'react';
import {
  Calendar,
  LayoutDashboard,
  BookMarked,
  BookOpen,
  LineChart,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  LogIn,
  UserPlus,
  Users,
  Palette,
  MoreHorizontal,
  User as UserIcon,
  ChevronDown,
} from 'lucide-react';
import { User } from '../types';
import { YourWayLogo } from './YourWayLogo';
import { AccountMenu } from './profile/AccountMenu';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  user: User | null;
  onOpenAssessment: () => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onLogout: () => void;
  onReplayIntro?: () => void;
  onOpenThemeModal?: () => void;
  onOpenEditProfile?: () => void;
  onOpenSecurity?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  user,
  onOpenAssessment,
  onOpenAuth,
  onLogout,
  onReplayIntro,
  onOpenThemeModal,
  onOpenEditProfile,
  onOpenSecurity,
}) => {
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const avatarUrl =
    user?.avatar ||
    user?.profilePicture ||
    (user?.name
      ? `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
          user.name
        )}&backgroundColor=4f46e5`
      : undefined);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            id="brand-logo-btn"
            onClick={() => setCurrentView(user ? 'dashboard' : 'landing')}
            className="flex items-center gap-2.5 text-left focus:outline-none group shrink-0"
          >
            <YourWayLogo size="md" showText={true} />
            {user?.class && (
              <span className="hidden xl:inline-block text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                {user.class}
              </span>
            )}
          </button>
        </div>

        {/* Center: Responsive Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-semibold text-slate-600 flex-1 justify-center max-w-2xl px-2">
          {/* Primary Tabs: Always shown on desktop */}
          <button
            id="nav-dashboard-btn"
            onClick={() => setCurrentView('dashboard')}
            className={`px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 shrink-0 ${
              currentView === 'dashboard'
                ? 'bg-slate-900 text-white font-bold'
                : 'hover:text-slate-950 hover:bg-slate-100'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

          <button
            id="nav-course-btn"
            onClick={() => setCurrentView('course')}
            className={`px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 shrink-0 ${
              currentView === 'course'
                ? 'bg-slate-900 text-white font-bold'
                : 'hover:text-slate-950 hover:bg-slate-100'
            }`}
          >
            <BookMarked className="w-3.5 h-3.5" />
            <span>Course</span>
          </button>

          <button
            id="nav-groups-btn"
            onClick={() => setCurrentView('groups')}
            className={`px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 shrink-0 ${
              currentView === 'groups'
                ? 'bg-slate-900 text-white font-bold'
                : 'hover:text-slate-950 hover:bg-slate-100'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-indigo-500" />
            <span>Study Groups</span>
          </button>

          <button
            id="nav-progress-btn"
            onClick={() => setCurrentView('progress')}
            className={`px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 shrink-0 ${
              currentView === 'progress'
                ? 'bg-slate-900 text-white font-bold'
                : 'hover:text-slate-950 hover:bg-slate-100'
            }`}
          >
            <LineChart className="w-3.5 h-3.5" />
            <span>Progress</span>
          </button>

          {/* Secondary Tabs: Shown on wide screens (>= 1280px) */}
          <button
            id="nav-timetable-btn"
            onClick={() => setCurrentView('timetable')}
            className={`hidden xl:flex px-3 py-2 rounded-xl transition-colors items-center gap-1.5 shrink-0 ${
              currentView === 'timetable'
                ? 'bg-slate-900 text-white font-bold'
                : 'hover:text-slate-950 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>My Week</span>
          </button>

          <button
            id="nav-books-btn"
            onClick={() => setCurrentView('books')}
            className={`hidden xl:flex px-3 py-2 rounded-xl transition-colors items-center gap-1.5 shrink-0 ${
              currentView === 'books'
                ? 'bg-slate-900 text-white font-bold'
                : 'hover:text-slate-950 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Books</span>
          </button>

          {/* More Menu on medium screens to prevent any overflow */}
          <div className="relative xl:hidden">
            <button
              id="nav-more-btn"
              onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
              className={`px-2.5 py-2 rounded-xl transition-colors flex items-center gap-1 shrink-0 ${
                ['timetable', 'books', 'admin'].includes(currentView)
                  ? 'bg-slate-100 text-slate-950 font-bold'
                  : 'hover:bg-slate-100 text-slate-600'
              }`}
              title="More learning views"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {isMoreMenuOpen && (
              <div
                className="absolute left-0 mt-2 w-44 rounded-2xl bg-white border border-slate-200 shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 text-xs font-semibold"
                onMouseLeave={() => setIsMoreMenuOpen(false)}
              >
                <button
                  onClick={() => {
                    setCurrentView('timetable');
                    setIsMoreMenuOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>My Week</span>
                </button>
                <button
                  onClick={() => {
                    setCurrentView('books');
                    setIsMoreMenuOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>NCERT Books</span>
                </button>
                <button
                  onClick={() => {
                    setCurrentView('admin');
                    setIsMoreMenuOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-amber-700"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                  <span>Admin Panel</span>
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Right: Actions & Account Menu */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {onReplayIntro && (
            <button
              id="replay-intro-btn"
              onClick={onReplayIntro}
              className="hidden lg:inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors shrink-0"
              title="Watch Intro Presentation"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Intro</span>
            </button>
          )}

          {onOpenThemeModal && (
            <button
              id="open-theme-modal-btn"
              onClick={onOpenThemeModal}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors shrink-0"
              title="Customize App Theme & Colors"
            >
              <Palette className="w-4 h-4 text-indigo-600" />
            </button>
          )}

          <button
            id="retake-assessment-btn"
            onClick={onOpenAssessment}
            className="hidden lg:inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 hover:bg-amber-100 transition-colors border border-amber-200/60 shrink-0 whitespace-nowrap"
            title="Take diagnostic 20-question assessment"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
            <span>Diagnostic</span>
          </button>

          {user ? (
            /* Logged in: Interactive Profile Pill with Dropdown Menu */
            <div className="relative pl-1 shrink-0">
              <button
                id="user-account-menu-btn"
                onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                className="flex items-center gap-2 p-1 pl-1.5 sm:pr-2.5 rounded-2xl hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all text-left group shrink-0"
                title="Account Menu"
              >
                <div className="w-8 h-8 rounded-xl overflow-hidden bg-slate-950 text-white flex items-center justify-center font-bold text-xs uppercase shrink-0 border border-slate-200 shadow-2xs">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{user.name.charAt(0)}</span>
                  )}
                </div>

                <div className="hidden sm:block text-left leading-tight">
                  <div className="font-bold text-slate-900 truncate max-w-[100px] text-xs">
                    {user.name}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium truncate max-w-[100px]">
                    @{user.username || 'student'}
                  </div>
                </div>

                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform ${isAccountMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Account Dropdown Menu */}
              <AccountMenu
                isOpen={isAccountMenuOpen}
                onClose={() => setIsAccountMenuOpen(false)}
                currentUser={user}
                onViewProfile={() => setCurrentView('profile')}
                onEditProfile={() => {
                  if (onOpenEditProfile) onOpenEditProfile();
                }}
                onOpenSettings={() => setCurrentView('dashboard')}
                onOpenSecurity={() => {
                  if (onOpenSecurity) onOpenSecurity();
                }}
                onLogout={onLogout}
              />
            </div>
          ) : (
            /* Not logged in: Log In & Create Account buttons */
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                id="nav-login-btn"
                onClick={() => onOpenAuth('login')}
                className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-colors shrink-0"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Log In</span>
              </button>

              <button
                id="nav-create-account-btn"
                onClick={() => onOpenAuth('register')}
                className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl bg-slate-950 text-white hover:bg-slate-800 transition-colors shadow-2xs shrink-0 whitespace-nowrap"
              >
                <UserPlus className="w-3.5 h-3.5 text-amber-400" />
                <span>Sign Up</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
