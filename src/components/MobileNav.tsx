import React from 'react';
import {
  LayoutDashboard,
  BookMarked,
  LineChart,
  Users,
  User as UserIcon,
} from 'lucide-react';

interface MobileNavProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  hasUser?: boolean;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentView, setCurrentView, hasUser }) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-t border-slate-200 px-3 py-2 flex items-center justify-around shadow-lg">
      <button
        id="mobile-nav-dashboard"
        onClick={() => setCurrentView('dashboard')}
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[11px] font-bold transition-all ${
          currentView === 'dashboard'
            ? 'text-indigo-600 bg-indigo-50/80'
            : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <LayoutDashboard className="w-5 h-5" />
        <span>Dashboard</span>
      </button>

      <button
        id="mobile-nav-course"
        onClick={() => setCurrentView('course')}
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[11px] font-bold transition-all ${
          currentView === 'course'
            ? 'text-indigo-600 bg-indigo-50/80'
            : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <BookMarked className="w-5 h-5" />
        <span>Course</span>
      </button>

      <button
        id="mobile-nav-groups"
        onClick={() => setCurrentView('groups')}
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[11px] font-bold transition-all ${
          currentView === 'groups'
            ? 'text-indigo-600 bg-indigo-50/80'
            : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <Users className="w-5 h-5" />
        <span>Groups</span>
      </button>

      <button
        id="mobile-nav-progress"
        onClick={() => setCurrentView('progress')}
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[11px] font-bold transition-all ${
          currentView === 'progress'
            ? 'text-indigo-600 bg-indigo-50/80'
            : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <LineChart className="w-5 h-5" />
        <span>Progress</span>
      </button>

      <button
        id="mobile-nav-profile"
        onClick={() => setCurrentView(hasUser ? 'profile' : 'dashboard')}
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[11px] font-bold transition-all ${
          currentView === 'profile'
            ? 'text-indigo-600 bg-indigo-50/80'
            : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <UserIcon className="w-5 h-5" />
        <span>Profile</span>
      </button>
    </nav>
  );
};
