import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Plus,
  Mail,
  Trophy,
  Flame,
  Zap,
  Globe,
  Lock,
  ArrowRight,
  Copy,
  Check,
  GraduationCap,
  Sparkles,
  BookOpen,
  Filter,
  Shield,
} from 'lucide-react';
import { ClassLevel, StudyGroup, User } from '../../types';
import { ALL_CLASSES } from '../../data/classCurriculum';
import { api } from '../../lib/api';
import { CreateGroupModal } from './CreateGroupModal';
import { UserProfileModal } from './UserProfileModal';
import { StudyGroupDetailView } from './StudyGroupDetailView';
import { FindPeopleTab } from './FindPeopleTab';
import { InvitationsTab } from './InvitationsTab';

interface StudyGroupsViewProps {
  currentUser: User | null;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onOpenCourse?: () => void;
  initialGroupId?: string | null;
}

type MainTab = 'my_groups' | 'explore' | 'find_people' | 'invitations' | 'leaderboard';

export const StudyGroupsView: React.FC<StudyGroupsViewProps> = ({
  currentUser,
  onOpenAuth,
  onOpenCourse,
  initialGroupId,
}) => {
  const [activeTab, setActiveTab] = useState<MainTab>('my_groups');
  const [myGroups, setMyGroups] = useState<StudyGroup[]>([]);
  const [exploreGroups, setExploreGroups] = useState<StudyGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<StudyGroup | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters for Explore tab
  const [exploreSearch, setExploreSearch] = useState('');
  const [filterClass, setFilterClass] = useState<string>('all');
  const [filterSubject, setFilterSubject] = useState<string>('all');

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [copiedMyId, setCopiedMyId] = useState(false);
  const [pendingInvitesCount, setPendingInvitesCount] = useState(0);

  // Load user groups & explore groups
  const loadData = async () => {
    setLoading(true);
    try {
      const exploreRes = await api.getGroups(exploreSearch, filterClass, filterSubject);
      if (exploreRes.groups) {
        setExploreGroups(exploreRes.groups);
      }

      if (currentUser) {
        const [myRes, notifRes] = await Promise.all([
          api.getMyGroups(currentUser.id),
          api.getNotifications(currentUser.id),
        ]);
        if (myRes.groups) {
          setMyGroups(myRes.groups);
        }
        if (notifRes.notifications) {
          const count = notifRes.notifications.filter(
            (n) => n.type === 'group_invitation' && !n.read
          ).length;
          setPendingInvitesCount(count);
        }
      }
    } catch (err) {
      console.error('Failed to load study groups:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentUser?.id, filterClass, filterSubject]);

  // If initialGroupId passed (e.g. from direct URL or navigation)
  useEffect(() => {
    if (initialGroupId) {
      api.getGroupById(initialGroupId).then((res) => {
        if (res.group) {
          setSelectedGroup(res.group);
        }
      });
    }
  }, [initialGroupId]);

  const handleCopyMyId = () => {
    if (currentUser?.yourWayId) {
      navigator.clipboard.writeText(currentUser.yourWayId);
      setCopiedMyId(true);
      setTimeout(() => setCopiedMyId(false), 2000);
    }
  };

  const handleJoinGroup = async (group: StudyGroup) => {
    if (!currentUser) {
      onOpenAuth('login');
      return;
    }

    try {
      if (group.privacy === 'public') {
        const res = await api.joinGroup(group.id, currentUser.id);
        if (res.group) {
          setSelectedGroup(res.group);
          loadData();
        }
      } else {
        await api.requestToJoinGroup(group.id, currentUser.id);
        alert('Join request sent to the group admins for approval!');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to join group');
    }
  };

  // If inside a group detail view, render it
  if (selectedGroup && currentUser) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <StudyGroupDetailView
          group={selectedGroup}
          currentUser={currentUser}
          onBack={() => {
            setSelectedGroup(null);
            loadData();
          }}
          onOpenProfile={(uid) => setSelectedUserId(uid)}
          onOpenCourse={onOpenCourse}
          onGroupUpdated={(updated) => {
            setSelectedGroup(updated);
            setMyGroups((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
          }}
          onGroupDeletedOrLeft={() => {
            setSelectedGroup(null);
            loadData();
          }}
        />

        {selectedUserId && (
          <UserProfileModal
            userId={selectedUserId}
            isOpen={Boolean(selectedUserId)}
            onClose={() => setSelectedUserId(null)}
            currentUser={currentUser}
            myGroups={myGroups}
            onOpenGroup={(gid) => {
              api.getGroupById(gid).then((res) => {
                if (res.group) setSelectedGroup(res.group);
              });
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-20">
      {/* Main Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 border border-slate-800 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                YOUR WAY STUDY GROUPS
              </span>
              <span className="text-xs text-amber-400 font-extrabold flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Collaborative Learning
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              Learn together. Grow together.
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Form small, focused study pods with peers in your class. Solve doubts together,
              track group streaks, share syllabus notes, and complete practice challenges.
            </p>

            {/* Current user's Your Way ID badge */}
            {currentUser && (
              <div className="pt-2 flex items-center gap-3 flex-wrap text-xs">
                <span className="text-slate-400">Your Identity:</span>
                <button
                  id="copy-own-yourway-id-btn"
                  onClick={handleCopyMyId}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono font-bold transition-all border border-white/10 shadow-xs"
                  title="Share your unique ID with classmates to let them find or invite you"
                >
                  <span className="text-indigo-300">ID:</span>
                  <span>{currentUser.yourWayId}</span>
                  {copiedMyId ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-slate-300" />
                  )}
                </button>
                <span className="text-slate-400">
                  Class: <strong className="text-white">{currentUser.class}</strong>
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              id="header-find-people-btn"
              onClick={() => setActiveTab('find_people')}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white text-xs sm:text-sm font-bold transition-all border border-white/15 shadow-xs flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4 text-indigo-300" />
              <span>Find People</span>
            </button>

            <button
              id="header-create-group-btn"
              onClick={() => {
                if (!currentUser) {
                  onOpenAuth('register');
                  return;
                }
                setShowCreateModal(true);
              }}
              className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create Study Group</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Sub-Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2 overflow-x-auto gap-2">
        <div className="flex items-center gap-2 shrink-0">
          <button
            id="tab-my-groups-btn"
            onClick={() => setActiveTab('my_groups')}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'my_groups'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>My Groups</span>
            {myGroups.length > 0 && (
              <span className="px-2 py-0.2 rounded-full bg-indigo-500 text-white text-[10px]">
                {myGroups.length}
              </span>
            )}
          </button>

          <button
            id="tab-explore-groups-btn"
            onClick={() => setActiveTab('explore')}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'explore'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Explore Groups</span>
          </button>

          <button
            id="tab-find-people-btn"
            onClick={() => setActiveTab('find_people')}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'find_people'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Find People</span>
          </button>

          <button
            id="tab-invitations-btn"
            onClick={() => setActiveTab('invitations')}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 relative ${
              activeTab === 'invitations'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Invitations</span>
            {pendingInvitesCount > 0 && (
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            )}
          </button>

          <button
            id="tab-leaderboard-btn"
            onClick={() => setActiveTab('leaderboard')}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'leaderboard'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Top Groups</span>
          </button>
        </div>
      </div>

      {/* TAB 1: MY GROUPS */}
      {activeTab === 'my_groups' && (
        <div className="space-y-6">
          {!currentUser ? (
            <div className="p-12 rounded-3xl bg-slate-50 border border-slate-200 text-center space-y-4">
              <Users className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="text-lg font-bold text-slate-800">Sign in to view your Study Groups</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Join or create study groups to collaborate with your classmates and earn group rewards.
              </p>
              <button
                onClick={() => onOpenAuth('login')}
                className="px-6 py-2.5 rounded-2xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 shadow-xs"
              >
                Log In / Sign Up
              </button>
            </div>
          ) : myGroups.length === 0 ? (
            <div className="p-12 rounded-3xl bg-slate-50 border border-slate-200 text-center space-y-4">
              <div className="w-14 h-14 rounded-3xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 mx-auto">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">You haven't joined any groups yet</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Study groups help you stay accountable, clear doubts fast, and conquer the NCERT curriculum together.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-5 py-2.5 rounded-2xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 shadow-xs flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create First Study Group</span>
                </button>
                <button
                  onClick={() => setActiveTab('explore')}
                  className="px-5 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100"
                >
                  Browse Public Groups
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {myGroups.map((grp) => {
                const isOwner = grp.ownerId === currentUser.id;
                const isAdmin = isOwner || grp.admins.includes(currentUser.id);

                return (
                  <div
                    key={grp.id}
                    onClick={() => setSelectedGroup(grp)}
                    className="cursor-pointer group rounded-3xl overflow-hidden bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-xl transition-all flex flex-col justify-between"
                  >
                    {/* Picture Banner */}
                    <div className="h-36 relative overflow-hidden bg-slate-900">
                      <img
                        src={grp.picture}
                        alt={grp.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                      <div className="absolute top-3 right-3 flex items-center gap-1.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold backdrop-blur-md bg-black/40 text-white border border-white/20">
                          {grp.class}
                        </span>
                        {grp.privacy === 'private' && (
                          <span className="p-1 rounded-full bg-black/40 text-amber-300">
                            <Lock className="w-3 h-3" />
                          </span>
                        )}
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                        <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                          {grp.subject}
                        </span>
                        <span className="flex items-center gap-1 text-xs font-bold text-amber-300">
                          <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          {grp.groupXP || 100} XP
                        </span>
                      </div>
                    </div>

                    {/* Body Info */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <h3 className="text-base font-black text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                            {grp.name}
                          </h3>
                        </div>

                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                          {grp.description}
                        </p>
                      </div>

                      {/* Footer Metadata */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3 text-slate-500 font-semibold text-[11px]">
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            {grp.members.length}/{grp.maxMembers}
                          </span>
                          <span className="flex items-center gap-1 text-rose-600">
                            <Flame className="w-3.5 h-3.5 fill-rose-500" />
                            {grp.streak || 1}d Streak
                          </span>
                        </div>

                        <span className="text-indigo-600 font-bold text-xs flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          <span>Enter Room</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: EXPLORE GROUPS */}
      {activeTab === 'explore' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3">
            <div className="relative grow">
              <input
                id="explore-groups-search-input"
                type="text"
                value={exploreSearch}
                onChange={(e) => setExploreSearch(e.target.value)}
                placeholder="Search groups by name, topic, or syllabus..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
            </div>

            <div className="flex gap-2">
              <select
                id="explore-class-filter-select"
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className="px-3 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700"
              >
                <option value="all">All Grades</option>
                {ALL_CLASSES.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>

              <button
                onClick={() => loadData()}
                className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs"
              >
                Filter
              </button>
            </div>
          </div>

          {/* Groups Grid */}
          {loading ? (
            <div className="p-12 text-center text-slate-400 text-xs">Loading study groups...</div>
          ) : exploreGroups.length === 0 ? (
            <div className="p-12 rounded-3xl bg-slate-50 border border-slate-200 text-center space-y-3">
              <Users className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="text-sm font-bold text-slate-700">No study groups found</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No groups match your current filter. Create your own group to lead your class!
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-5 py-2 rounded-2xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700"
              >
                Create Study Group
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {exploreGroups.map((grp) => {
                const isMember = currentUser && grp.members.includes(currentUser.id);
                const isFull = grp.members.length >= grp.maxMembers;

                return (
                  <div
                    key={grp.id}
                    className="rounded-3xl overflow-hidden bg-white border border-slate-200 hover:border-slate-300 transition-all shadow-xs flex flex-col justify-between"
                  >
                    <div className="h-36 relative overflow-hidden bg-slate-900">
                      <img src={grp.picture} alt={grp.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                      <div className="absolute top-3 right-3 flex items-center gap-1.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold backdrop-blur-md bg-black/40 text-white border border-white/20">
                          {grp.class}
                        </span>
                        {grp.privacy === 'private' ? (
                          <span className="p-1 rounded-full bg-black/40 text-amber-300">
                            <Lock className="w-3 h-3" />
                          </span>
                        ) : (
                          <span className="p-1 rounded-full bg-black/40 text-emerald-300">
                            <Globe className="w-3 h-3" />
                          </span>
                        )}
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                        <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                          {grp.subject}
                        </span>
                        <span className="flex items-center gap-1 text-xs font-bold text-amber-300">
                          <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          {grp.groupXP || 100} XP
                        </span>
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-base font-black text-slate-900 mb-1 line-clamp-1">
                          {grp.name}
                        </h3>
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                          {grp.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div className="text-[11px] text-slate-500 font-semibold flex items-center gap-2">
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            {grp.members.length}/{grp.maxMembers}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-rose-600">
                            <Flame className="w-3.5 h-3.5 fill-rose-500" />
                            {grp.streak || 1}d
                          </span>
                        </div>

                        {isMember ? (
                          <button
                            onClick={() => setSelectedGroup(grp)}
                            className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors"
                          >
                            Open Group
                          </button>
                        ) : (
                          <button
                            onClick={() => handleJoinGroup(grp)}
                            disabled={isFull}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                              isFull
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                : grp.privacy === 'public'
                                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                                : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                            }`}
                          >
                            {isFull
                              ? 'Full'
                              : grp.privacy === 'public'
                              ? 'Join Group'
                              : 'Request to Join'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: FIND PEOPLE */}
      {activeTab === 'find_people' && (
        <FindPeopleTab
          currentUser={currentUser}
          myGroups={myGroups}
          onOpenProfile={(uid) => setSelectedUserId(uid)}
        />
      )}

      {/* TAB 4: INVITATIONS */}
      {activeTab === 'invitations' && (
        <>
          {currentUser ? (
            <InvitationsTab
              currentUser={currentUser}
              onOpenGroup={(gid) => {
                api.getGroupById(gid).then((res) => {
                  if (res.group) setSelectedGroup(res.group);
                });
              }}
              onRefreshGroups={loadData}
            />
          ) : (
            <div className="p-12 text-center text-slate-500 text-xs">
              Please sign in to check your study group invitations.
            </div>
          )}
        </>
      )}

      {/* TAB 5: GLOBAL LEADERBOARD */}
      {activeTab === 'leaderboard' && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div>
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              Top Study Groups on Your Way
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Ranked by collective group study streaks, lesson completions, and total Group XP.
            </p>
          </div>

          <div className="space-y-3">
            {[...exploreGroups]
              .sort((a, b) => (b.groupXP || 0) - (a.groupXP || 0))
              .map((grp, idx) => (
                <div
                  key={grp.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100 transition-colors flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black ${
                        idx === 0
                          ? 'bg-amber-400 text-amber-950'
                          : idx === 1
                          ? 'bg-slate-300 text-slate-800'
                          : idx === 2
                          ? 'bg-amber-700/60 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      #{idx + 1}
                    </div>

                    <img src={grp.picture} alt={grp.name} className="w-11 h-11 rounded-xl object-cover" />

                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{grp.name}</h4>
                      <div className="text-[11px] text-slate-500">
                        {grp.class} • {grp.subject} • {grp.members.length} members
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-rose-600 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 fill-rose-500" />
                      {grp.streak || 1}d Streak
                    </span>

                    <span className="px-3 py-1 rounded-xl bg-amber-50 text-amber-900 font-extrabold text-xs border border-amber-200 flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      {grp.groupXP || 100} XP
                    </span>

                    <button
                      onClick={() => setSelectedGroup(grp)}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Create Group Modal */}
      {showCreateModal && currentUser && (
        <CreateGroupModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          creatorId={currentUser.id}
          defaultClass={currentUser.class}
          onGroupCreated={(newGroup) => {
            setMyGroups((prev) => [newGroup, ...prev]);
            setSelectedGroup(newGroup);
          }}
        />
      )}

      {/* User Profile Modal */}
      {selectedUserId && (
        <UserProfileModal
          userId={selectedUserId}
          isOpen={Boolean(selectedUserId)}
          onClose={() => setSelectedUserId(null)}
          currentUser={currentUser}
          myGroups={myGroups}
          onOpenGroup={(gid) => {
            api.getGroupById(gid).then((res) => {
              if (res.group) setSelectedGroup(res.group);
            });
          }}
        />
      )}
    </div>
  );
};
