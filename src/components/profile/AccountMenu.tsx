import React, { useRef, useEffect } from 'react';
import {
  User as UserIcon,
  Edit3,
  Settings,
  ShieldCheck,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ChevronRight,
  Flame,
  Mail,
} from 'lucide-react';
import { User } from '../../types';
import { auth } from '../../lib/firebase';

interface AccountMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onViewProfile: () => void;
  onEditProfile: () => void;
  onOpenSettings: () => void;
  onOpenSecurity: () => void;
  onLogout: () => void;
}

export const AccountMenu: React.FC<AccountMenuProps> = ({
  isOpen,
  onClose,
  currentUser,
  onViewProfile,
  onEditProfile,
  onOpenSettings,
  onOpenSecurity,
  onLogout,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const fbUser = auth.currentUser;
  const isGoogleUser = fbUser?.providerData?.some((p) => p.providerId === 'google.com');
  const isVerified = fbUser?.emailVerified || isGoogleUser || false;

  return (
    <div
      ref={menuRef}
      className="absolute right-0 top-full mt-2 w-72 rounded-2xl bg-white border border-slate-200/90 shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150"
    >
      {/* User Header */}
      <div className="p-4 bg-slate-50 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl overflow-hidden bg-indigo-600 text-white flex items-center justify-center font-bold text-base shrink-0 border border-white shadow-2xs">
            {currentUser.avatar || currentUser.profilePicture ? (
              <img
                src={currentUser.avatar || currentUser.profilePicture}
                alt={currentUser.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{currentUser.name.charAt(0).toUpperCase()}</span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <span className="font-bold text-slate-900 text-sm truncate font-display">
                {currentUser.name}
              </span>
              {isVerified && (
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" title="Verified Account" />
              )}
            </div>
            <div className="text-xs text-slate-500 truncate font-mono">
              @{currentUser.username || 'student'}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-block px-1.5 py-0.5 rounded-md bg-indigo-100 text-indigo-700 text-[10px] font-bold">
                {currentUser.class || 'Class 9'}
              </span>
              <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-600">
                <Flame className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                {currentUser.streak || 1}d
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Options */}
      <div className="p-1.5 text-xs font-semibold text-slate-700 space-y-0.5">
        <button
          id="menu-view-profile-btn"
          onClick={() => {
            onClose();
            onViewProfile();
          }}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors text-left group"
        >
          <div className="flex items-center gap-2.5">
            <UserIcon className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
            <span>View Profile</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500" />
        </button>

        <button
          id="menu-edit-profile-btn"
          onClick={() => {
            onClose();
            onEditProfile();
          }}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors text-left group"
        >
          <div className="flex items-center gap-2.5">
            <Edit3 className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
            <span>Edit Profile</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500" />
        </button>

        <button
          id="menu-settings-btn"
          onClick={() => {
            onClose();
            onOpenSettings();
          }}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors text-left group"
        >
          <div className="flex items-center gap-2.5">
            <Settings className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
            <span>Study Preferences</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500" />
        </button>

        <button
          id="menu-security-btn"
          onClick={() => {
            onClose();
            onOpenSecurity();
          }}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors text-left group"
        >
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
            <span>Account & Security</span>
          </div>
          {!isVerified ? (
            <span className="w-2 h-2 rounded-full bg-amber-500" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500" />
          )}
        </button>
      </div>

      {/* Divider */}
      <div className="h-px bg-slate-100 my-1" />

      {/* Sign Out */}
      <div className="p-1.5 text-xs font-semibold">
        <button
          id="menu-logout-btn"
          onClick={() => {
            onClose();
            onLogout();
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors text-left font-bold"
        >
          <LogOut className="w-4 h-4 text-rose-500" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
};
