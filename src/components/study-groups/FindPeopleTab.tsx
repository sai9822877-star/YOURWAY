import React, { useState, useEffect } from 'react';
import {
  Search,
  Users,
  Copy,
  Check,
  Zap,
  Flame,
  GraduationCap,
  Send,
  ExternalLink,
  BookOpen,
  Filter,
} from 'lucide-react';
import { ClassLevel, StudyGroup, User } from '../../types';
import { ALL_CLASSES } from '../../data/classCurriculum';
import { api } from '../../lib/api';

interface FindPeopleTabProps {
  currentUser: User | null;
  myGroups: StudyGroup[];
  onOpenProfile: (userId: string) => void;
}

export const FindPeopleTab: React.FC<FindPeopleTabProps> = ({
  currentUser,
  myGroups,
  onOpenProfile,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Invite Modal state
  const [inviteTargetUser, setInviteTargetUser] = useState<any | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [sendingInvite, setSendingInvite] = useState(false);

  const fetchUsers = async (q: string) => {
    setLoading(true);
    try {
      const res = await api.searchUsers(q, currentUser?.id);
      if (res.users) {
        setResults(res.users);
      }
    } catch (err) {
      console.error('Failed to search users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers('');
  }, [currentUser?.id]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers(searchQuery);
  };

  const handleCopyId = (ywId: string) => {
    navigator.clipboard.writeText(ywId);
    setCopiedId(ywId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSendInvitation = async () => {
    if (!inviteTargetUser || !selectedGroupId || !currentUser) return;
    setSendingInvite(true);
    setInviteSuccess(null);
    setInviteError(null);

    try {
      await api.sendGroupInvitation(selectedGroupId, currentUser.id, inviteTargetUser.id);
      setInviteSuccess(`Invitation sent to ${inviteTargetUser.name}!`);
      setTimeout(() => {
        setInviteTargetUser(null);
        setInviteSuccess(null);
      }, 1500);
    } catch (err: any) {
      setInviteError(err.message || 'Failed to send invite');
    } finally {
      setSendingInvite(false);
    }
  };

  // Filter by class if selected
  const filteredUsers = results.filter((u) => {
    if (selectedClass !== 'all' && u.class !== selectedClass) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Search & Filter Header */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div>
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <span>Find Classmates & Study Buddies</span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              Roblox ID & Instagram Discovery
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Connect with students using their unique Your Way ID (e.g. YW-849201), @username, or by grade.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative grow">
            <input
              id="find-people-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by @username, Your Way ID (e.g. YW-...), or name..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
          </div>

          <div className="flex gap-2">
            <select
              id="find-people-class-filter"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Grades</option>
              {ALL_CLASSES.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>

            <button
              type="submit"
              id="find-people-search-btn"
              className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs shrink-0"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Results Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs">Finding peers...</div>
      ) : filteredUsers.length === 0 ? (
        <div className="p-12 rounded-3xl bg-slate-50 border border-slate-200 text-center">
          <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-slate-700 mb-1">No students found</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try checking the spelling, searching by exact Your Way ID (e.g. YW-849201), or clearing filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((usr) => {
            const isMe = usr.id === currentUser?.id;

            return (
              <div
                key={usr.id}
                className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-slate-300 transition-all shadow-xs flex flex-col justify-between"
              >
                <div>
                  {/* Top card banner */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={
                            usr.avatar ||
                            `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                              usr.name
                            )}&backgroundColor=4f46e5`
                          }
                          alt={usr.name}
                          className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                        />
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                      </div>

                      <div>
                        <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{usr.name}</span>
                          {isMe && (
                            <span className="text-[10px] text-indigo-600 font-extrabold">(You)</span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500">@{usr.username}</div>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200">
                      {usr.class}
                    </span>
                  </div>

                  {/* Your Way ID with copy button */}
                  <div className="mb-3">
                    <button
                      onClick={() => handleCopyId(usr.yourWayId)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-mono font-bold text-[11px] transition-colors border border-indigo-200/60"
                      title="Copy Your Way ID"
                    >
                      <span>{usr.yourWayId}</span>
                      {copiedId === usr.yourWayId ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3 text-indigo-500" />
                      )}
                    </button>
                  </div>

                  {/* Bio */}
                  {usr.bio && (
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                      {usr.bio}
                    </p>
                  )}

                  {/* Mini Stats Bar */}
                  <div className="flex items-center gap-2 mb-4 text-[11px] font-bold">
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200/50">
                      <Zap className="w-3 h-3 fill-amber-500 text-amber-500" />
                      {usr.xp || 0} XP
                    </span>
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-50 text-rose-800 border border-rose-200/50">
                      <Flame className="w-3 h-3 fill-rose-500 text-rose-500" />
                      {usr.streak || 1}d Streak
                    </span>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onOpenProfile(usr.id)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    <span>View Profile</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>

                  {!isMe && (
                    <button
                      onClick={() => {
                        setInviteTargetUser(usr);
                        setSelectedGroupId(myGroups[0]?.id || '');
                      }}
                      disabled={!usr.canInvite || myGroups.length === 0}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        usr.canInvite && myGroups.length > 0
                          ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      }`}
                      title={
                        !usr.canInvite
                          ? 'User privacy restrictions'
                          : myGroups.length === 0
                          ? 'Create a group first'
                          : 'Invite to group'
                      }
                    >
                      <Send className="w-3 h-3" />
                      <span>Invite</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Invite Modal */}
      {inviteTargetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Invite {inviteTargetUser.name} to Group
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Select which of your study groups you'd like to invite this student to join.
            </p>

            {inviteSuccess && (
              <div className="mb-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                {inviteSuccess}
              </div>
            )}
            {inviteError && (
              <div className="mb-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
                {inviteError}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Choose Study Group
                </label>
                <select
                  value={selectedGroupId}
                  onChange={(e) => setSelectedGroupId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800"
                >
                  {myGroups.map((grp) => (
                    <option key={grp.id} value={grp.id}>
                      {grp.name} ({grp.class} • {grp.members.length}/{grp.maxMembers})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setInviteTargetUser(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSendInvitation}
                  disabled={sendingInvite || !selectedGroupId}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{sendingInvite ? 'Sending...' : 'Send Invitation'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
