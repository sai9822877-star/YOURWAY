import React, { useState, useEffect } from 'react';
import {
  X,
  Copy,
  Check,
  Zap,
  Flame,
  Trophy,
  Users,
  Shield,
  Send,
  Flag,
  Settings,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { User, StudyGroup } from '../../types';
import { api } from '../../lib/api';

interface UserProfileModalProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  myGroups?: StudyGroup[];
  onOpenGroup?: (groupId: string) => void;
  onUserUpdated?: (updatedUser: User) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  userId,
  isOpen,
  onClose,
  currentUser,
  myGroups = [],
  onOpenGroup,
  onUserUpdated,
}) => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(false);
  const [showInviteDropdown, setShowInviteDropdown] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null);
  const [inviteError, setInviteError] = useState<string | null>(null);

  // Edit Mode state (if viewing self)
  const [isEditing, setIsEditing] = useState(false);
  const [editBio, setEditBio] = useState('');
  const [editWhoCanInvite, setEditWhoCanInvite] = useState<'anyone' | 'classmates' | 'nobody'>('anyone');
  const [editWhoCanFindMe, setEditWhoCanFindMe] = useState<'everyone' | 'classmates' | 'nobody'>('everyone');
  const [editWhoCanSeeGroups, setEditWhoCanSeeGroups] = useState<'everyone' | 'classmates' | 'only_me'>('everyone');
  const [saveLoading, setSaveLoading] = useState(false);

  // Report state
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState('Inappropriate username or bio');
  const [reportDetails, setReportDetails] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  const isSelf = currentUser?.id === userId;

  useEffect(() => {
    if (!isOpen || !userId) return;

    let mounted = true;
    setLoading(true);
    setInviteSuccess(null);
    setInviteError(null);
    setShowInviteDropdown(false);
    setShowReport(false);
    setReportSubmitted(false);

    api
      .getUserProfile(userId, currentUser?.id)
      .then((res) => {
        if (mounted && res.profile) {
          setProfile(res.profile);
          setEditBio(res.profile.bio || '');
          if (currentUser?.privacySettings) {
            setEditWhoCanInvite(currentUser.privacySettings.whoCanInvite || 'anyone');
            setEditWhoCanFindMe(currentUser.privacySettings.whoCanFindMe || 'everyone');
            setEditWhoCanSeeGroups(currentUser.privacySettings.whoCanSeeGroups || 'everyone');
          }
        }
      })
      .catch((err) => console.error('Failed to load profile:', err))
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [isOpen, userId, currentUser?.id]);

  if (!isOpen) return null;

  const handleCopyId = () => {
    if (profile?.yourWayId) {
      navigator.clipboard.writeText(profile.yourWayId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const handleInviteToGroup = async (groupId: string) => {
    if (!currentUser) return;
    setInviteSuccess(null);
    setInviteError(null);

    try {
      await api.sendGroupInvitation(groupId, currentUser.id, userId);
      const targetGroup = myGroups.find((g) => g.id === groupId);
      setInviteSuccess(`Invitation sent for ${targetGroup?.name || 'group'}!`);
      setShowInviteDropdown(false);
    } catch (err: any) {
      setInviteError(err.message || 'Failed to send invitation.');
    }
  };

  const handleSaveProfile = async () => {
    if (!currentUser) return;
    setSaveLoading(true);
    try {
      const res = await api.updateUserProfile(currentUser.id, {
        bio: editBio,
        privacySettings: {
          whoCanInvite: editWhoCanInvite,
          whoCanFindMe: editWhoCanFindMe,
          whoCanSeeGroups: editWhoCanSeeGroups,
        },
      });

      if (res.user) {
        setProfile((prev: any) => ({
          ...prev,
          bio: res.user.bio,
        }));
        if (onUserUpdated) onUserUpdated(res.user);
        setIsEditing(false);
      }
    } catch (err) {
      console.error('Failed to save profile:', err);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    try {
      await api.reportItem({
        type: 'user',
        targetId: userId,
        reporterId: currentUser.id,
        reason: reportReason,
        details: reportDetails,
      });
      setReportSubmitted(true);
      setTimeout(() => {
        setShowReport(false);
        setReportSubmitted(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to report user:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Top Cover Banner */}
        <div className="h-28 bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 relative">
          <button
            id="close-user-profile-modal-btn"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Loading student profile...
          </div>
        ) : profile?.blocked ? (
          <div className="p-8 text-center text-slate-600">
            <Shield className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <p className="font-bold">This profile is not accessible.</p>
          </div>
        ) : profile ? (
          <div className="px-6 pb-6 pt-0 relative">
            {/* Avatar & Action Button Header */}
            <div className="flex items-end justify-between -mt-14 mb-4">
              <div className="relative">
                <img
                  src={
                    profile.avatar ||
                    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                      profile.name
                    )}&backgroundColor=4f46e5`
                  }
                  alt={profile.name}
                  className="w-24 h-24 rounded-3xl object-cover border-4 border-white shadow-lg bg-slate-100"
                />
                <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />
              </div>

              <div className="flex items-center gap-2">
                {isSelf ? (
                  <button
                    id="edit-profile-toggle-btn"
                    onClick={() => setIsEditing(!isEditing)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>{isEditing ? 'Cancel' : 'Edit Profile & Privacy'}</span>
                  </button>
                ) : (
                  <>
                    <div className="relative">
                      <button
                        id="invite-to-group-dropdown-btn"
                        onClick={() => setShowInviteDropdown(!showInviteDropdown)}
                        disabled={!profile.canInvite || myGroups.length === 0}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors shadow-xs ${
                          profile.canInvite && myGroups.length > 0
                            ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        }`}
                        title={
                          !profile.canInvite
                            ? 'Student only accepts invitations from specific peers'
                            : myGroups.length === 0
                            ? 'Create or join a study group first'
                            : 'Invite to group'
                        }
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Invite to Group</span>
                      </button>

                      {/* Dropdown for groups */}
                      {showInviteDropdown && myGroups.length > 0 && (
                        <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-20">
                          <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                            Select Group to Invite
                          </div>
                          <div className="max-h-48 overflow-y-auto">
                            {myGroups.map((grp) => (
                              <button
                                key={grp.id}
                                onClick={() => handleInviteToGroup(grp.id)}
                                className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors flex items-center justify-between"
                              >
                                <span className="truncate">{grp.name}</span>
                                <span className="text-[10px] text-slate-400 shrink-0 ml-1">
                                  {grp.members.length}/{grp.maxMembers}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      id="report-profile-btn"
                      onClick={() => setShowReport(true)}
                      className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Report this student profile"
                    >
                      <Flag className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Invite Status Alert */}
            {inviteSuccess && (
              <div className="mb-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{inviteSuccess}</span>
              </div>
            )}
            {inviteError && (
              <div className="mb-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
                {inviteError}
              </div>
            )}

            {/* Name, Username & Your Way ID Badge */}
            <div className="mb-4">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl font-black text-slate-900">{profile.name}</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 flex items-center gap-1">
                  <GraduationCap className="w-3 h-3 text-slate-500" />
                  {profile.class}
                </span>
              </div>

              <div className="flex items-center gap-3 mt-1 text-xs">
                <span className="text-slate-500 font-semibold">@{profile.username}</span>
                <span className="text-slate-300">•</span>
                {/* Your Way ID with copy */}
                <button
                  id="copy-yourway-id-btn"
                  onClick={handleCopyId}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-mono font-bold text-xs transition-colors border border-indigo-200/60"
                  title="Click to copy unique Your Way ID"
                >
                  <span>{profile.yourWayId}</span>
                  {copiedId ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-indigo-500" />}
                </button>
              </div>

              {/* Bio */}
              {!isEditing ? (
                <p className="mt-3 text-xs text-slate-600 leading-relaxed font-normal bg-slate-50/80 p-3 rounded-2xl border border-slate-100">
                  {profile.bio || 'Lifelong learner on Your Way.'}
                </p>
              ) : (
                <div className="mt-3 space-y-3 p-3.5 rounded-2xl bg-indigo-50/40 border border-indigo-100">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Bio / Learning Goal
                    </label>
                    <textarea
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                      rows={2}
                      maxLength={160}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    />
                  </div>

                  {/* Privacy Controls */}
                  <div className="space-y-2 pt-2 border-t border-indigo-100">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Privacy & Visibility</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="block text-[10px] font-semibold text-slate-500 mb-0.5">Who can invite me:</span>
                        <select
                          value={editWhoCanInvite}
                          onChange={(e: any) => setEditWhoCanInvite(e.target.value)}
                          className="w-full px-2 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold"
                        >
                          <option value="anyone">Anyone on Your Way</option>
                          <option value="classmates">Classmates only ({profile.class})</option>
                          <option value="nobody">Nobody (Private)</option>
                        </select>
                      </div>

                      <div>
                        <span className="block text-[10px] font-semibold text-slate-500 mb-0.5">Who can find me:</span>
                        <select
                          value={editWhoCanFindMe}
                          onChange={(e: any) => setEditWhoCanFindMe(e.target.value)}
                          className="w-full px-2 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold"
                        >
                          <option value="everyone">Everyone</option>
                          <option value="classmates">Classmates only</option>
                          <option value="nobody">Hidden from search</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      id="save-profile-settings-btn"
                      onClick={handleSaveProfile}
                      disabled={saveLoading}
                      className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 shadow-xs"
                    >
                      {saveLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-2.5 mb-4">
              <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-center">
                <div className="flex items-center justify-center gap-1 text-amber-600 text-[10px] font-bold uppercase tracking-wider mb-0.5">
                  <Zap className="w-3 h-3 fill-amber-500" />
                  XP
                </div>
                <div className="text-base font-black text-amber-900">{profile.xp || 0}</div>
              </div>

              <div className="p-3 rounded-2xl bg-rose-50/70 border border-rose-200/60 text-center">
                <div className="flex items-center justify-center gap-1 text-rose-600 text-[10px] font-bold uppercase tracking-wider mb-0.5">
                  <Flame className="w-3 h-3 fill-rose-500" />
                  Streak
                </div>
                <div className="text-base font-black text-rose-900">{profile.streak || 1} Days</div>
              </div>

              <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-200/60 text-center">
                <div className="flex items-center justify-center gap-1 text-indigo-600 text-[10px] font-bold uppercase tracking-wider mb-0.5">
                  <Users className="w-3 h-3" />
                  Groups
                </div>
                <div className="text-base font-black text-indigo-900">{profile.publicGroups?.length || 0}</div>
              </div>
            </div>

            {/* Achievements / Badges */}
            {profile.achievements && profile.achievements.length > 0 && (
              <div className="mb-4">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-amber-500" />
                  <span>Badges & Achievements</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {profile.achievements.slice(0, 4).map((ach: any) => (
                    <div
                      key={ach.id}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 flex items-center gap-1.5"
                    >
                      <span className="text-sm">{ach.icon || '🏅'}</span>
                      <span>{ach.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Public Study Groups */}
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-indigo-500" />
                <span>Study Groups</span>
              </h4>

              {profile.publicGroups && profile.publicGroups.length > 0 ? (
                <div className="space-y-2">
                  {profile.publicGroups.map((grp: any) => (
                    <div
                      key={grp.id}
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100 transition-colors flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <img src={grp.picture} alt={grp.name} className="w-10 h-10 rounded-xl object-cover" />
                        <div>
                          <div className="text-xs font-bold text-slate-900 truncate max-w-[200px]">{grp.name}</div>
                          <div className="text-[10px] text-slate-500">
                            {grp.class} • {grp.subject} • {grp.membersCount} members
                          </div>
                        </div>
                      </div>

                      {onOpenGroup && (
                        <button
                          onClick={() => {
                            onClose();
                            onOpenGroup(grp.id);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-bold transition-colors"
                        >
                          View
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-slate-400 p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
                  No public study groups visible.
                </div>
              )}
            </div>

            {/* Report Modal overlay */}
            {showReport && (
              <div className="absolute inset-0 bg-white/95 backdrop-blur-sm p-6 flex flex-col justify-center rounded-3xl z-30">
                <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
                  <Flag className="w-4 h-4 text-rose-600" />
                  Report Student Profile
                </h3>
                <p className="text-xs text-slate-500 mb-3">
                  Help keep Your Way a safe educational space for everyone.
                </p>

                {reportSubmitted ? (
                  <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-semibold text-center">
                    Thank you. Your report has been submitted to moderators.
                  </div>
                ) : (
                  <form onSubmit={handleSubmitReport} className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">Reason</label>
                      <select
                        value={reportReason}
                        onChange={(e) => setReportReason(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                      >
                        <option value="Inappropriate username or bio">Inappropriate username or bio</option>
                        <option value="Spam or advertising">Spam or advertising</option>
                        <option value="Harassment or bullying">Harassment or bullying</option>
                        <option value="Sharing personal contact details">Sharing personal contact details</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">Details (Optional)</label>
                      <textarea
                        value={reportDetails}
                        onChange={(e) => setReportDetails(e.target.value)}
                        rows={2}
                        placeholder="Provide details..."
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs resize-none"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowReport(false)}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs"
                      >
                        Submit Report
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};
