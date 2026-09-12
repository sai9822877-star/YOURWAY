import React, { useState, useEffect } from 'react';
import {
  Users,
  Shield,
  ShieldAlert,
  UserPlus,
  MoreVertical,
  Crown,
  Trash2,
  LogOut,
  ExternalLink,
  Search,
  Check,
  X,
  Sparkles,
} from 'lucide-react';
import { StudyGroup, StudyGroupMember, User } from '../../types';
import { api } from '../../lib/api';

interface GroupMembersTabProps {
  group: StudyGroup;
  currentUser: User;
  onOpenProfile: (userId: string) => void;
  onGroupUpdated: (group: StudyGroup) => void;
  onGroupDeletedOrLeft?: () => void;
}

export const GroupMembersTab: React.FC<GroupMembersTabProps> = ({
  group,
  currentUser,
  onOpenProfile,
  onGroupUpdated,
  onGroupDeletedOrLeft,
}) => {
  const [members, setMembers] = useState<StudyGroupMember[]>([]);
  const [loading, setLoading] = useState(true);

  // Invite modal state
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [invitedMap, setInvitedMap] = useState<{ [userId: string]: boolean }>({});
  const [inviteError, setInviteError] = useState<string | null>(null);

  // Transfer Ownership state
  const [transferTargetId, setTransferTargetId] = useState<string | null>(null);

  const isOwner = group.ownerId === currentUser.id;
  const isAdmin = isOwner || group.admins.includes(currentUser.id);

  const loadMembers = async () => {
    try {
      const res = await api.getGroupMembers(group.id);
      if (res.members) setMembers(res.members);
    } catch (err) {
      console.error('Failed to load members:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, [group.id]);

  const handleRoleChange = async (targetUserId: string, newRole: 'admin' | 'member') => {
    try {
      const res = await api.updateMemberRole(group.id, currentUser.id, targetUserId, newRole);
      if (res.group) {
        onGroupUpdated(res.group);
        loadMembers();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update member role');
    }
  };

  const handleRemoveMember = async (targetUserId: string) => {
    if (!confirm('Are you sure you want to remove this member from the study group?')) return;
    try {
      const res = await api.removeMember(group.id, currentUser.id, targetUserId);
      if (res.group) {
        onGroupUpdated(res.group);
        loadMembers();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to remove member');
    }
  };

  const handleTransferOwnership = async () => {
    if (!transferTargetId) return;
    if (!confirm('Are you sure you want to transfer group ownership? You will remain an admin.')) return;
    try {
      const res = await api.transferOwnership(group.id, currentUser.id, transferTargetId);
      if (res.group) {
        onGroupUpdated(res.group);
        setTransferTargetId(null);
        loadMembers();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to transfer ownership');
    }
  };

  const handleLeaveGroup = async () => {
    const isLast = group.members.length === 1;
    const confirmMsg = isLast
      ? 'You are the only member. Leaving will delete this group. Continue?'
      : 'Are you sure you want to leave this study group?';

    if (!confirm(confirmMsg)) return;

    try {
      const res = await api.leaveGroup(group.id, currentUser.id);
      if (res.success && onGroupDeletedOrLeft) {
        onGroupDeletedOrLeft();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to leave group');
    }
  };

  // Search people to invite
  const handleSearchPeople = async (q: string) => {
    setSearchQuery(q);
    setInviteError(null);
    if (!q.trim()) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const res = await api.searchUsers(q, currentUser.id);
      if (res.users) {
        // filter out users already in group
        const notInGroup = res.users.filter((u) => !group.members.includes(u.id));
        setSearchResults(notInGroup);
      }
    } catch (err) {
      console.error('Failed to search users:', err);
    } finally {
      setSearching(false);
    }
  };

  const handleSendInvite = async (receiverId: string) => {
    setInviteError(null);
    try {
      await api.sendGroupInvitation(group.id, currentUser.id, receiverId);
      setInvitedMap((prev) => ({ ...prev, [receiverId]: true }));
    } catch (err: any) {
      setInviteError(err.message || 'Failed to send invite');
    }
  };

  return (
    <div className="space-y-6">
      {/* Subheader with Capacity and Invite action */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
            Study Group Members
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              {group.members.length} / {group.maxMembers} Capacity
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Peer collaboration roster. Group creators and admins moderate discussions and maintain safety.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {group.members.length < group.maxMembers && (
            <button
              id="open-invite-member-modal-btn"
              onClick={() => {
                setShowInviteModal(true);
                handleSearchPeople('');
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs"
            >
              <UserPlus className="w-4 h-4" />
              <span>Invite Peers</span>
            </button>
          )}

          <button
            id="leave-group-btn"
            onClick={handleLeaveGroup}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-slate-500 hover:text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors"
            title="Leave this study group"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Leave</span>
          </button>
        </div>
      </div>

      {/* Members List */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs">Loading member roster...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {members.map((member) => {
            const isTargetMe = member.id === currentUser.id;
            const isTargetOwner = member.id === group.ownerId;
            const isTargetAdmin = group.admins.includes(member.id);

            return (
              <div
                key={member.id}
                className="p-4 rounded-3xl bg-white border border-slate-200 hover:border-slate-300 transition-all shadow-xs flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={
                        member.avatar ||
                        `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                          member.name
                        )}&backgroundColor=4f46e5`
                      }
                      alt={member.name}
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                    />
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
                        member.status === 'online'
                          ? 'bg-emerald-500'
                          : member.status === 'studying'
                          ? 'bg-amber-500'
                          : 'bg-slate-400'
                      }`}
                      title={`Status: ${member.status}`}
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="text-xs font-bold text-slate-900">{member.name}</h4>
                      {isTargetMe && (
                        <span className="text-[10px] text-indigo-600 font-extrabold">(You)</span>
                      )}

                      {/* Role Pill */}
                      {isTargetOwner ? (
                        <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.2 rounded-md bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                          <Crown className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                          Owner
                        </span>
                      ) : isTargetAdmin ? (
                        <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.2 rounded-md bg-indigo-50 text-indigo-800 border border-indigo-200 flex items-center gap-1">
                          <Shield className="w-2.5 h-2.5 text-indigo-600" />
                          Admin
                        </span>
                      ) : (
                        <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.2 rounded-md bg-slate-100 text-slate-600">
                          Member
                        </span>
                      )}
                    </div>

                    <div className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-2">
                      <span>@{member.username}</span>
                      <span>•</span>
                      <span className="font-mono text-indigo-600 font-bold">{member.yourWayId}</span>
                      <span>•</span>
                      <span>{member.xp || 0} XP</span>
                    </div>
                  </div>
                </div>

                {/* Member Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => onOpenProfile(member.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                    title="View educational profile"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>

                  {/* Owner & Admin Controls */}
                  {isAdmin && !isTargetMe && !isTargetOwner && (
                    <div className="flex items-center gap-1">
                      {isOwner && (
                        <button
                          onClick={() => handleRoleChange(member.id, isTargetAdmin ? 'member' : 'admin')}
                          className="px-2.5 py-1 rounded-xl text-[10px] font-bold border border-slate-200 hover:bg-slate-50 text-slate-700"
                          title={isTargetAdmin ? 'Demote to Member' : 'Promote to Admin'}
                        >
                          {isTargetAdmin ? 'Demote' : 'Make Admin'}
                        </button>
                      )}

                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Remove member"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Owner Transfer Section (Shown to Owner Only) */}
      {isOwner && group.members.length > 1 && (
        <div className="p-5 rounded-3xl bg-amber-50/50 border border-amber-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
              <Crown className="w-4 h-4 text-amber-600" />
              Transfer Group Ownership
            </h4>
            <p className="text-[11px] text-amber-800 mt-0.5">
              Assign group ownership to another peer. You will remain an admin.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={transferTargetId || ''}
              onChange={(e) => setTransferTargetId(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-amber-300 bg-white text-xs font-semibold text-slate-800"
            >
              <option value="">Select a member...</option>
              {members
                .filter((m) => m.id !== currentUser.id)
                .map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} (@{m.username})
                  </option>
                ))}
            </select>
            <button
              onClick={handleTransferOwnership}
              disabled={!transferTargetId}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                transferTargetId
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              Transfer
            </button>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-indigo-600" />
                  Invite Students to {group.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Search by @username, Your Way ID (e.g. YW-...), or name.
                </p>
              </div>
              <button
                onClick={() => setShowInviteModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {inviteError && (
              <div className="mb-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                {inviteError}
              </div>
            )}

            {/* Search Input */}
            <div className="relative mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchPeople(e.target.value)}
                placeholder="Type username, Your Way ID, or student name..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            </div>

            {/* Search Results List */}
            <div className="max-h-64 overflow-y-auto space-y-2">
              {searching ? (
                <div className="p-8 text-center text-slate-400 text-xs">Searching peers...</div>
              ) : searchResults.length === 0 && searchQuery.trim() ? (
                <div className="p-8 text-center text-slate-500 text-xs">
                  No matching students found or their privacy settings hide them.
                </div>
              ) : (
                searchResults.map((usr) => {
                  const isInvited = invitedMap[usr.id];

                  return (
                    <div
                      key={usr.id}
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            usr.avatar ||
                            `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                              usr.name
                            )}&backgroundColor=4f46e5`
                          }
                          alt={usr.name}
                          className="w-10 h-10 rounded-xl object-cover"
                        />
                        <div>
                          <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{usr.name}</span>
                            <span className="text-[10px] text-slate-500">@{usr.username}</span>
                          </div>
                          <div className="text-[10px] text-indigo-600 font-mono font-semibold">
                            {usr.yourWayId} • {usr.class}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleSendInvite(usr.id)}
                        disabled={isInvited}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                          isInvited
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                        }`}
                      >
                        {isInvited ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Invited</span>
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-3.5 h-3.5" />
                            <span>Send Invite</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowInviteModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
