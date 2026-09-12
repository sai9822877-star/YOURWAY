import React, { useState } from 'react';
import {
  ArrowLeft,
  Edit3,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Calendar,
  Globe,
  Award,
  Zap,
  Flame,
  Clock,
  BookOpen,
  Users,
  ExternalLink,
  Mail,
  Send,
  Sparkles,
  Share2,
  Check,
} from 'lucide-react';
import { User, StudyGroup } from '../../types';
import { auth } from '../../lib/firebase';
import { api } from '../../lib/api';

interface ProfileViewProps {
  profileUser: User;
  currentUser: User;
  onBack: () => void;
  onEditProfile: () => void;
  onOpenSecurity: () => void;
  studyGroups?: StudyGroup[];
  onOpenGroup?: (groupId: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profileUser,
  currentUser,
  onBack,
  onEditProfile,
  onOpenSecurity,
  studyGroups = [],
  onOpenGroup,
}) => {
  const [activeTab, setActiveTab] = useState<'curriculum' | 'achievements' | 'groups'>('curriculum');
  const [copiedLink, setCopiedLink] = useState(false);
  const [gmailStatus, setGmailStatus] = useState<string | null>(null);
  const [sendingGmail, setSendingGmail] = useState(false);

  const isOwner = currentUser.id === profileUser.id;
  const fbUser = auth.currentUser;
  const isGoogleUser = fbUser?.providerData?.some((p) => p.providerId === 'google.com');
  const isVerified = (isOwner && (fbUser?.emailVerified || isGoogleUser)) || true;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin + `?user=${profileUser.username || profileUser.id}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSendGmailTimetable = async () => {
    if (!currentUser.email) return;
    setSendingGmail(true);
    setGmailStatus(null);
    try {
      const res = await api.sendGmailStudyReport({
        email: currentUser.email,
        userName: currentUser.name,
        classLevel: currentUser.class,
        summary: {
          streak: currentUser.streak || 1,
          xp: currentUser.xp || 100,
          completedLessons: currentUser.completedLessons?.length || 0,
        },
      });
      setGmailStatus(res.message || 'Timetable sent to your Gmail inbox!');
      setTimeout(() => setGmailStatus(null), 4000);
    } catch (err: any) {
      setGmailStatus('Failed to send Gmail update.');
    } finally {
      setSendingGmail(false);
    }
  };

  // Format account created date
  const joinedDateFormatted = React.useMemo(() => {
    if (!profileUser.createdAt) return 'Recent Member';
    try {
      return new Date(profileUser.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return 'Recent Member';
    }
  }, [profileUser.createdAt]);

  const userGroups = studyGroups.filter(
    (g) => g.members?.some((m) => m.userId === profileUser.id) || g.createdById === profileUser.id
  );

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <button
          id="profile-back-btn"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            id="share-profile-btn"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors shadow-2xs"
            title="Copy Public Profile Link"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Link Copied' : 'Share'}</span>
          </button>

          {isOwner && (
            <button
              id="profile-edit-btn"
              onClick={onEditProfile}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-950 text-white font-bold text-xs hover:bg-indigo-600 transition-colors shadow-sm"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>
          )}
        </div>
      </div>

      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 relative overflow-hidden">
        {/* Subtle decorative gradient ribbon */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-linear-to-r from-indigo-500 via-sky-500 to-indigo-600" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-2">
          {/* Profile Picture */}
          <div className="relative shrink-0">
            <div className="w-24 h-24 sm:w-28 sm:set-28 rounded-3xl overflow-hidden bg-slate-100 border-4 border-white shadow-lg flex items-center justify-center text-slate-400">
              {profileUser.avatar || profileUser.profilePicture ? (
                <img
                  src={profileUser.avatar || profileUser.profilePicture}
                  alt={profileUser.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl font-extrabold text-indigo-600 font-display">
                  {profileUser.name ? profileUser.name.charAt(0).toUpperCase() : 'S'}
                </span>
              )}
            </div>
            {isVerified && (
              <div
                className="absolute -bottom-1.5 -right-1.5 bg-indigo-600 text-white p-1 rounded-xl shadow-xs"
                title="Verified Student Profile"
              >
                <CheckCircle2 className="w-4 h-4" />
              </div>
            )}
          </div>

          {/* User Details */}
          <div className="space-y-2 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-display truncate">
                {profileUser.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold shrink-0">
                {profileUser.class || 'Class 9'}
              </span>
            </div>

            <div className="text-sm text-slate-500 font-mono flex items-center gap-1.5">
              <span>@{profileUser.username || 'student'}</span>
              {isOwner && (
                <span className="text-slate-300">•</span>
              )}
              {isOwner && (
                <span className="text-xs text-slate-500 font-sans">{profileUser.email}</span>
              )}
            </div>

            {/* Bio */}
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl pt-1">
              {profileUser.bio || 'Continuous learner mastering syllabus concepts step-by-step with Your Way adaptive curriculum.'}
            </p>

            {/* Metadata (Joined date & Website) */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Joined {joinedDateFormatted}</span>
              </div>

              {profileUser.website && (
                <a
                  href={profileUser.website.startsWith('http') ? profileUser.website : `https://${profileUser.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 font-semibold"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span className="truncate max-w-[200px]">
                    {profileUser.website.replace(/^https?:\/\//, '')}
                  </span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Gmail Quick Action Banner (For Owner) */}
        {isOwner && (
          <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-indigo-50/40 -mx-6 sm:-mx-8 -mb-6 sm:-mb-8 p-4 sm:px-8">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <Mail className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Gmail Study Integration</p>
                <p className="text-[11px] text-slate-500">Receive weekly syllabus progress and revision blocks in Gmail.</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {gmailStatus ? (
                <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                  {gmailStatus}
                </span>
              ) : (
                <button
                  id="profile-send-gmail-btn"
                  onClick={handleSendGmailTimetable}
                  disabled={sendingGmail}
                  className="px-3 py-1.5 rounded-xl bg-white border border-indigo-200 text-indigo-700 font-bold text-xs hover:bg-indigo-50 transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <Send className="w-3 h-3" />
                  <span>{sendingGmail ? 'Dispatching...' : 'Email My Timetable'}</span>
                </button>
              )}

              <button
                id="profile-open-security-btn"
                onClick={onOpenSecurity}
                className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3 h-3" />
                <span>Security</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Relevant Educational Statistics Section */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Learning XP</span>
            <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-950 font-display">
            {(profileUser.xp || 120).toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Total points earned</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Study Streak</span>
            <Flame className="w-4 h-4 text-rose-500 fill-rose-500" />
          </div>
          <div className="text-2xl font-black text-slate-950 font-display">
            {profileUser.streak || 1} <span className="text-sm font-semibold text-slate-500">days</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Daily consistency</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Class Rank</span>
            <Award className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-slate-950 font-display">
            #{profileUser.rank || 5}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">In {profileUser.class || 'Class 9'}</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Study Time</span>
            <Clock className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-2xl font-black text-slate-950 font-display">
            {Math.floor((profileUser.studyTime || 60) / 60)}h {(profileUser.studyTime || 60) % 60}m
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Dedicated practice</p>
        </div>
      </div>

      {/* Content & Activity Tabs */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        {/* Tab Headers */}
        <div className="flex border-b border-slate-200 bg-slate-50/60 p-1.5 text-xs font-bold text-slate-600 gap-1 overflow-x-auto">
          <button
            id="tab-curriculum-btn"
            onClick={() => setActiveTab('curriculum')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'curriculum'
                ? 'bg-white text-slate-950 shadow-xs'
                : 'hover:bg-slate-200/60 text-slate-600'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Academic Curriculum</span>
          </button>

          <button
            id="tab-achievements-btn"
            onClick={() => setActiveTab('achievements')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'achievements'
                ? 'bg-white text-slate-950 shadow-xs'
                : 'hover:bg-slate-200/60 text-slate-600'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Achievements</span>
          </button>

          <button
            id="tab-groups-btn"
            onClick={() => setActiveTab('groups')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'groups'
                ? 'bg-white text-slate-950 shadow-xs'
                : 'hover:bg-slate-200/60 text-slate-600'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Study Groups ({userGroups.length})</span>
          </button>
        </div>

        {/* Tab Content Panels */}
        <div className="p-6">
          {activeTab === 'curriculum' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Enrolled Subjects</h3>
                  <p className="text-xs text-slate-500">Core NCERT subjects aligned with student level</p>
                </div>
                <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                  {profileUser.class || 'Class 9'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  { name: 'Mathematics', desc: 'Number Systems, Algebra, Geometry, Statistics', progress: 68, color: 'bg-indigo-500' },
                  { name: 'Science', desc: 'Matter, Living Organisms, Force & Motion', progress: 54, color: 'bg-emerald-500' },
                  { name: 'English Language', desc: 'Comprehension, Grammar, Literature', progress: 80, color: 'bg-sky-500' },
                  { name: 'Social Science', desc: 'History, Contemporary India, Democratic Politics', progress: 45, color: 'bg-amber-500' },
                ].map((subj) => (
                  <div key={subj.name} className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs">{subj.name}</span>
                      <span className="text-xs font-bold text-slate-700">{subj.progress}%</span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{subj.desc}</p>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div className={`${subj.color} h-1.5 rounded-full`} style={{ width: `${subj.progress}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { title: 'First Login', desc: 'Began journey on Your Way', icon: '🌟', unlocked: true },
                  { title: 'Consistent Mind', desc: 'Maintained 3-day study streak', icon: '🔥', unlocked: (profileUser.streak || 0) >= 3 },
                  { title: 'Concept Master', desc: 'Scored 90%+ in diagnostic test', icon: '🎯', unlocked: true },
                  { title: 'Knowledge Explorer', desc: 'Completed 10 interactive lessons', icon: '📚', unlocked: (profileUser.completedLessons?.length || 0) >= 10 },
                  { title: '1,000 XP Club', desc: 'Earned 1,000 learning experience', icon: '⚡', unlocked: (profileUser.xp || 0) >= 1000 },
                  { title: 'Group Collaborator', desc: 'Joined a peer study circle', icon: '🤝', unlocked: userGroups.length > 0 },
                ].map((ach) => (
                  <div
                    key={ach.title}
                    className={`p-4 rounded-2xl border transition-all ${
                      ach.unlocked
                        ? 'bg-white border-slate-200 shadow-2xs'
                        : 'bg-slate-50 border-slate-200/60 opacity-60'
                    }`}
                  >
                    <div className="text-2xl mb-2">{ach.icon}</div>
                    <div className="font-bold text-slate-900 text-xs">{ach.title}</div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{ach.desc}</p>
                    <div className="mt-2 text-[10px] font-bold">
                      {ach.unlocked ? (
                        <span className="text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Unlocked
                        </span>
                      ) : (
                        <span className="text-slate-400">In Progress</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'groups' && (
            <div className="space-y-3">
              {userGroups.length === 0 ? (
                <div className="text-center py-8 text-slate-500 space-y-2">
                  <Users className="w-8 h-8 mx-auto text-slate-400 opacity-60" />
                  <p className="text-xs font-semibold">No public study groups yet.</p>
                  <p className="text-[11px] text-slate-400">
                    {isOwner ? 'Join or create a study circle to study collaboratively.' : 'This student has not joined any public groups yet.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {userGroups.map((g) => (
                    <div
                      key={g.id}
                      className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-indigo-200 transition-colors flex items-center justify-between"
                    >
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs">{g.name}</h4>
                        <p className="text-[11px] text-slate-500 line-clamp-1">{g.description || 'Collaborative study room'}</p>
                        <span className="text-[10px] font-semibold text-indigo-600 mt-1 inline-block">
                          {g.members?.length || 1} members
                        </span>
                      </div>
                      {onOpenGroup && (
                        <button
                          type="button"
                          onClick={() => onOpenGroup(g.id)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                        >
                          View
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
