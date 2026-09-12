import React, { useState } from 'react';
import {
  ArrowLeft,
  MessageSquare,
  BookOpen,
  CheckSquare,
  TrendingUp,
  Users,
  Shield,
  Lock,
  Globe,
  Flame,
  Zap,
  Share2,
  Check,
} from 'lucide-react';
import { StudyGroup, User } from '../../types';
import { GroupChatTab } from './GroupChatTab';
import { GroupResourcesTab } from './GroupResourcesTab';
import { GroupTasksTab } from './GroupTasksTab';
import { GroupProgressTab } from './GroupProgressTab';
import { GroupMembersTab } from './GroupMembersTab';

interface StudyGroupDetailViewProps {
  group: StudyGroup;
  currentUser: User;
  onBack: () => void;
  onOpenProfile: (userId: string) => void;
  onOpenCourse?: () => void;
  onGroupUpdated: (group: StudyGroup) => void;
  onGroupDeletedOrLeft: () => void;
}

type TabType = 'chat' | 'resources' | 'tasks' | 'progress' | 'members';

export const StudyGroupDetailView: React.FC<StudyGroupDetailViewProps> = ({
  group,
  currentUser,
  onBack,
  onOpenProfile,
  onOpenCourse,
  onGroupUpdated,
  onGroupDeletedOrLeft,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('chat');
  const [copiedLink, setCopiedLink] = useState(false);

  const handleShareGroup = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}?view=groups&groupId=${group.id}`
    );
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          id="back-to-groups-list-btn"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Study Groups</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            id="share-study-group-link-btn"
            onClick={handleShareGroup}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
            title="Copy link to this study group"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Share Group</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Hero Group Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-sm">
        {/* Cover Photo Backdrop */}
        <div className="h-36 sm:h-44 relative overflow-hidden bg-slate-950">
          <img
            src={group.picture}
            alt={group.name}
            className="w-full h-full object-cover opacity-50 blur-xs scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Quick Badges in Header */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md bg-white/20 text-white border border-white/20 flex items-center gap-1.5">
              {group.privacy === 'private' ? (
                <>
                  <Lock className="w-3 h-3 text-amber-300" />
                  <span>Private Group</span>
                </>
              ) : (
                <>
                  <Globe className="w-3 h-3 text-emerald-300" />
                  <span>Public Group</span>
                </>
              )}
            </span>

            <span className="px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{group.groupXP || 100} Group XP</span>
            </span>
          </div>
        </div>

        {/* Group Info Overlay */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-14 mb-4">
            <div className="flex items-end gap-4">
              <img
                src={group.picture}
                alt={group.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-white shadow-xl bg-slate-900 shrink-0"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                    {group.name}
                  </h1>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 font-bold border border-indigo-200/60">
                    {group.class}
                  </span>
                  <span>•</span>
                  <span className="text-slate-700 font-bold">{group.subject}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-slate-500">
                    <Users className="w-3.5 h-3.5" />
                    {group.members.length} / {group.maxMembers} Members
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-rose-600 font-bold">
                    <Flame className="w-3.5 h-3.5 fill-rose-500" />
                    {group.streak || 1} Day Streak
                  </span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
            {group.description}
          </p>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="px-6 border-t border-slate-100 flex gap-2 overflow-x-auto bg-slate-50/50 py-2">
          <button
            id="group-tab-chat-btn"
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'chat'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Group Chat</span>
          </button>

          <button
            id="group-tab-resources-btn"
            onClick={() => setActiveTab('resources')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'resources'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Shared Resources</span>
          </button>

          <button
            id="group-tab-tasks-btn"
            onClick={() => setActiveTab('tasks')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'tasks'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>Study Tasks & Goals</span>
          </button>

          <button
            id="group-tab-progress-btn"
            onClick={() => setActiveTab('progress')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'progress'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Progress & Challenges</span>
          </button>

          <button
            id="group-tab-members-btn"
            onClick={() => setActiveTab('members')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'members'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Members ({group.members.length})</span>
          </button>
        </div>
      </div>

      {/* Tab View Contents */}
      <div>
        {activeTab === 'chat' && (
          <GroupChatTab
            group={group}
            currentUser={currentUser}
            onOpenProfile={onOpenProfile}
            onGroupUpdated={onGroupUpdated}
          />
        )}

        {activeTab === 'resources' && (
          <GroupResourcesTab
            group={group}
            currentUser={currentUser}
            onOpenCourse={onOpenCourse}
            onGroupUpdated={onGroupUpdated}
          />
        )}

        {activeTab === 'tasks' && (
          <GroupTasksTab
            group={group}
            currentUser={currentUser}
            onGroupUpdated={onGroupUpdated}
          />
        )}

        {activeTab === 'progress' && (
          <GroupProgressTab
            group={group}
            currentUser={currentUser}
            onOpenProfile={onOpenProfile}
            onGroupUpdated={onGroupUpdated}
          />
        )}

        {activeTab === 'members' && (
          <GroupMembersTab
            group={group}
            currentUser={currentUser}
            onOpenProfile={onOpenProfile}
            onGroupUpdated={onGroupUpdated}
            onGroupDeletedOrLeft={onGroupDeletedOrLeft}
          />
        )}
      </div>
    </div>
  );
};
