import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Flame, Sparkles, GraduationCap, Crown, ArrowUpRight } from 'lucide-react';
import { ClassLevel, LeaderboardEntry, User } from '../types';
import { api } from '../lib/api';

interface ClassLeaderboardProps {
  currentUser: User | null;
  userClass?: ClassLevel;
}

const ALL_CLASSES: ClassLevel[] = [
  'Class 6',
  'Class 7',
  'Class 8',
  'Class 9',
  'Class 10',
  'Class 11',
  'Class 12',
];

export const ClassLeaderboard: React.FC<ClassLeaderboardProps> = ({
  currentUser,
  userClass = 'Class 9',
}) => {
  const [selectedClass, setSelectedClass] = useState<ClassLevel>(userClass);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Sync when userClass changes
  useEffect(() => {
    if (userClass) {
      setSelectedClass(userClass);
    }
  }, [userClass]);

  // Fetch leaderboard data for selected class
  useEffect(() => {
    let isMounted = true;
    const loadLeaderboard = async () => {
      setLoading(true);
      try {
        const res = await api.getLeaderboard(selectedClass, currentUser?.id);
        if (isMounted && res?.leaderboard) {
          setLeaderboard(res.leaderboard);
        }
      } catch (err) {
        console.warn('Leaderboard fetch warning:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadLeaderboard();
    return () => {
      isMounted = false;
    };
  }, [selectedClass, currentUser?.id, currentUser?.xp]);

  const userRankEntry = leaderboard.find((entry) => entry.isCurrentUser);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-6">
      {/* Header and Class Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 font-display flex items-center gap-2">
              <span>Class Leaderboard</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                Live NCERT Rankings
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Rankings based on XP earned through lessons & practice quizzes
            </p>
          </div>
        </div>

        {/* Class Switcher */}
        <div className="flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            id="leaderboard-class-select"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value as ClassLevel)}
            className="text-xs font-bold py-1.5 px-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
          >
            {ALL_CLASSES.map((c) => (
              <option key={c} value={c}>
                {c} {c === userClass ? '(Your Class)' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* User's position summary banner */}
      {userRankEntry && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 via-indigo-50/50 to-slate-50 border border-amber-200/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm shadow-xs">
              #{userRankEntry.rank}
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <span>Your Position in {selectedClass}</span>
                <span className="text-[10px] bg-amber-200/80 text-amber-950 font-extrabold px-1.5 py-0.2 rounded">
                  YOU
                </span>
              </div>
              <div className="text-[11px] text-slate-600">
                {userRankEntry.xp.toLocaleString()} XP • {userRankEntry.streak} day streak
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-amber-700">
              {userRankEntry.rank === 1
                ? '🏆 You are in 1st Place!'
                : `Top ${Math.max(1, Math.round((userRankEntry.rank / leaderboard.length) * 100))}%`}
            </span>
          </div>
        </div>
      )}

      {/* Leaderboard Table List */}
      <div className="space-y-2">
        {loading ? (
          <div className="py-8 text-center text-xs text-slate-400">Loading rankings...</div>
        ) : leaderboard.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">No students recorded yet.</div>
        ) : (
          leaderboard.map((entry) => {
            const isTop3 = entry.rank <= 3;
            const rankBadge =
              entry.rank === 1 ? (
                <Crown className="w-4 h-4 text-amber-500 fill-amber-400" />
              ) : entry.rank === 2 ? (
                <Medal className="w-4 h-4 text-slate-400" />
              ) : entry.rank === 3 ? (
                <Medal className="w-4 h-4 text-amber-700" />
              ) : (
                <span className="text-xs font-bold text-slate-500">#{entry.rank}</span>
              );

            return (
              <div
                key={entry.userId}
                id={`leaderboard-row-${entry.rank}`}
                className={`p-3 sm:p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  entry.isCurrentUser
                    ? 'bg-amber-50/70 border-amber-300 ring-2 ring-amber-400/30 shadow-xs'
                    : isTop3
                    ? 'bg-slate-50/80 border-slate-200'
                    : 'bg-white border-slate-100 hover:border-slate-200'
                }`}
              >
                {/* Left: Rank + Avatar + Name */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-7 text-center flex items-center justify-center shrink-0">
                    {rankBadge}
                  </div>

                  <img
                    src={entry.avatar}
                    alt={entry.name}
                    className="w-9 h-9 rounded-xl object-cover shrink-0 border border-slate-200 bg-white"
                  />

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                        {entry.name}
                      </span>
                      {entry.isCurrentUser && (
                        <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-amber-500 text-slate-950">
                          YOU
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      @{entry.username}
                    </div>
                  </div>
                </div>

                {/* Right: Streak & XP */}
                <div className="flex items-center gap-4 shrink-0 text-right">
                  <div className="hidden sm:flex items-center gap-1 text-[11px] font-semibold text-slate-600">
                    <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{entry.streak}d</span>
                  </div>

                  <div className="min-w-[70px] text-right">
                    <div className="text-xs sm:text-sm font-extrabold text-slate-900 font-display">
                      {entry.xp.toLocaleString()}
                    </div>
                    <div className="text-[10px] font-semibold text-amber-600 uppercase tracking-wider">
                      XP
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
