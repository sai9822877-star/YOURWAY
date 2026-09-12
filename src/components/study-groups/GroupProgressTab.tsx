import React, { useState, useEffect } from 'react';
import {
  Flame,
  Trophy,
  Award,
  Zap,
  Target,
  Sparkles,
  CheckCircle2,
  Users,
  TrendingUp,
  Plus,
} from 'lucide-react';
import { GroupChallenge, StudyGroup, User } from '../../types';
import { api } from '../../lib/api';

interface GroupProgressTabProps {
  group: StudyGroup;
  currentUser: User;
  onOpenProfile: (userId: string) => void;
  onGroupUpdated: (group: StudyGroup) => void;
}

export const GroupProgressTab: React.FC<GroupProgressTabProps> = ({
  group,
  currentUser,
  onOpenProfile,
  onGroupUpdated,
}) => {
  const [challenges, setChallenges] = useState<GroupChallenge[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [contributing, setContributing] = useState(false);

  const loadData = async () => {
    try {
      const [chalRes, leadRes] = await Promise.all([
        api.getGroupChallenges(group.id),
        api.getGroupLeaderboard(group.id),
      ]);
      if (chalRes.challenges) setChallenges(chalRes.challenges);
      if (leadRes.leaderboard) setLeaderboard(leadRes.leaderboard);
    } catch (err) {
      console.error('Failed to load group progress data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [group.id]);

  const handleContribute = async (challengeId: string) => {
    setContributing(true);
    try {
      const res = await api.contributeToChallenge(challengeId, currentUser.id, 1);
      if (res.challenge) {
        setChallenges((prev) => prev.map((c) => (c.id === challengeId ? res.challenge : c)));

        // update group XP
        onGroupUpdated({
          ...group,
          groupXP: (group.groupXP || 0) + 15,
        });

        // reload leaderboard
        const leadRes = await api.getGroupLeaderboard(group.id);
        if (leadRes.leaderboard) setLeaderboard(leadRes.leaderboard);
      }
    } catch (err) {
      console.error('Failed to contribute:', err);
    } finally {
      setContributing(false);
    }
  };

  // Group Level calculation: every 200 XP is 1 level
  const groupLevel = Math.max(1, Math.floor((group.groupXP || 100) / 200) + 1);
  const nextLevelXP = groupLevel * 200;
  const currentLevelBaseXP = (groupLevel - 1) * 200;
  const levelProgress = Math.min(
    100,
    Math.round((((group.groupXP || 100) - currentLevelBaseXP) / (nextLevelXP - currentLevelBaseXP)) * 100)
  );

  return (
    <div className="space-y-6">
      {/* Top Banner: Group Level & Streak Stats */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-slate-800 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Group Level & XP */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30 flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                Group Level {groupLevel}
              </span>
              <span className="text-xs text-slate-400">
                {group.groupXP || 100} Total Group XP
              </span>
            </div>

            <h3 className="text-xl font-black text-white">
              {group.name} Progress Engine
            </h3>

            {/* Level Bar */}
            <div className="space-y-1 max-w-md">
              <div className="flex justify-between text-[11px] font-semibold text-slate-300">
                <span>Level {groupLevel}</span>
                <span>
                  {group.groupXP || 100} / {nextLevelXP} XP for Level {groupLevel + 1}
                </span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${levelProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Group Streak Metric */}
          <div className="flex items-center justify-start md:justify-end gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Flame className="w-7 h-7 fill-rose-500" />
            </div>
            <div>
              <div className="text-2xl font-black text-white">
                {group.streak || 1} Days
              </div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-rose-300">
                Active Study Streak
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Weekly Challenges Section */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-600" />
              Active Weekly Group Challenge
            </h3>
            <p className="text-xs text-slate-500">
              Work together with your group members to unlock collective XP and badges.
            </p>
          </div>
        </div>

        {challenges.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl">
            No active challenges for this week.
          </div>
        ) : (
          <div className="space-y-4">
            {challenges.map((chal) => {
              const percent = Math.min(100, Math.round((chal.progress / chal.target) * 100));
              const myContribution = chal.contributors?.[currentUser.id] || 0;

              return (
                <div
                  key={chal.id}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">{chal.title}</h4>
                        {chal.isCompleted && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Completed!
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">{chal.description}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-xl bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200 flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        +{chal.xpReward} Group XP
                      </span>

                      {!chal.isCompleted && (
                        <button
                          id={`contribute-challenge-${chal.id}-btn`}
                          onClick={() => handleContribute(chal.id)}
                          disabled={contributing}
                          className="px-3 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors shadow-xs flex items-center gap-1"
                          title="Log study progress towards challenge"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Log Practice (+1)</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-600">Progress</span>
                      <span className="text-indigo-600">
                        {chal.progress} / {chal.target} ({percent}%)
                      </span>
                    </div>
                    <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      Your contribution: <strong>{myContribution}</strong> units
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Group Member Contribution Leaderboard */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Member Contribution Leaderboard
            </h3>
            <p className="text-xs text-slate-500">
              Ranked by XP, lessons, and peer assistance inside this study group.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="p-6 text-center text-xs text-slate-400">Loading leaderboard...</div>
        ) : leaderboard.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400">No member rankings yet.</div>
        ) : (
          <div className="space-y-2">
            {leaderboard.map((entry, idx) => {
              const isMe = entry.userId === currentUser.id;
              const rankColor =
                idx === 0
                  ? 'bg-amber-400 text-amber-950 font-black'
                  : idx === 1
                  ? 'bg-slate-300 text-slate-800 font-bold'
                  : idx === 2
                  ? 'bg-amber-700/60 text-white font-bold'
                  : 'bg-slate-100 text-slate-600 font-semibold';

              return (
                <div
                  key={entry.userId}
                  className={`p-3.5 rounded-2xl flex items-center justify-between transition-colors ${
                    isMe
                      ? 'bg-indigo-50/70 border-2 border-indigo-300'
                      : 'bg-slate-50 border border-slate-200/70 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Rank Badge */}
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs ${rankColor}`}
                    >
                      {idx + 1}
                    </div>

                    {/* Member Info */}
                    <button
                      onClick={() => onOpenProfile(entry.userId)}
                      className="flex items-center gap-2.5 text-left focus:outline-none"
                    >
                      <img
                        src={
                          entry.avatar ||
                          `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                            entry.name
                          )}&backgroundColor=4f46e5`
                        }
                        alt={entry.name}
                        className="w-9 h-9 rounded-xl object-cover border border-slate-200"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{entry.name}</span>
                          {isMe && (
                            <span className="text-[10px] text-indigo-600 font-extrabold">(You)</span>
                          )}
                          <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded-md bg-slate-200 text-slate-700">
                            {entry.role}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {entry.lessonsCompleted || 0} lessons • {entry.doubtsSolved || 0} doubts
                          answered
                        </div>
                      </div>
                    </button>
                  </div>

                  {/* XP */}
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 text-amber-900 text-xs font-black border border-amber-200/60">
                      <Zap className="w-3 h-3 fill-amber-500 text-amber-500" />
                      {entry.xp} XP
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Group Badges */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Award className="w-4 h-4 text-purple-600" />
          Group Honors & Badges
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200/60 flex items-center gap-3">
            <span className="text-2xl">⚡</span>
            <div>
              <div className="text-xs font-bold text-purple-950">Active Learners</div>
              <div className="text-[10px] text-purple-700">Group formed & active discussions</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/60 flex items-center gap-3">
            <span className="text-2xl">🔥</span>
            <div>
              <div className="text-xs font-bold text-amber-950">Streak Keepers</div>
              <div className="text-[10px] text-amber-700">Maintained regular study sessions</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200/60 flex items-center gap-3">
            <span className="text-2xl">📚</span>
            <div>
              <div className="text-xs font-bold text-indigo-950">Syllabus Crushers</div>
              <div className="text-[10px] text-indigo-700">Shared NCERT notes and guides</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
