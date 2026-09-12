import React, { useState, useEffect } from 'react';
import { Award, CheckCircle2, Lock, Sparkles, Flame, BookOpen, Trophy } from 'lucide-react';
import { Achievement, User } from '../types';
import { api } from '../lib/api';

interface AchievementsListProps {
  currentUser: User | null;
}

export const AchievementsList: React.FC<AchievementsListProps> = ({ currentUser }) => {
  const [achievements, setAchievements] = useState<Array<Achievement & { isUnlocked: boolean }>>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    const fetchAchievements = async () => {
      setLoading(true);
      try {
        const res = await api.getAchievements(currentUser?.id);
        if (isMounted && res?.achievements) {
          setAchievements(res.achievements);
        }
      } catch (e) {
        console.warn('Achievements fetch error:', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchAchievements();
    return () => {
      isMounted = false;
    };
  }, [currentUser?.id, currentUser?.achievements, currentUser?.xp]);

  const unlockedCount = achievements.filter((a) => a.isUnlocked).length;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 font-display">
              Achievements & Badges
            </h2>
            <p className="text-xs text-slate-500">
              Unlock badges and bonus XP as you advance through lessons
            </p>
          </div>
        </div>

        <div className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 self-start sm:self-center">
          {unlockedCount} of {achievements.length} Unlocked
        </div>
      </div>

      {/* Grid of Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {achievements.map((ach) => (
          <div
            key={ach.id}
            id={`badge-${ach.id}`}
            className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
              ach.isUnlocked
                ? 'bg-gradient-to-br from-amber-50/50 via-white to-slate-50 border-amber-200 shadow-xs'
                : 'bg-slate-50/60 border-slate-200 opacity-75'
            }`}
          >
            {/* Badge Icon */}
            <div
              className={`w-11 h-11 rounded-2xl text-xl flex items-center justify-center shrink-0 border ${
                ach.isUnlocked
                  ? 'bg-amber-100/80 border-amber-300 shadow-xs'
                  : 'bg-slate-200/80 border-slate-300 grayscale'
              }`}
            >
              {ach.icon}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1 mb-0.5">
                <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                  {ach.title}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-[10px] font-extrabold text-amber-700 bg-amber-100/70 px-1.5 py-0.5 rounded">
                    +{ach.xpReward} XP
                  </span>
                  {ach.isUnlocked ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  )}
                </div>
              </div>

              <p className="text-[11px] text-slate-500 leading-tight">{ach.description}</p>

              <div className="mt-2 text-[10px] font-semibold">
                {ach.isUnlocked ? (
                  <span className="text-emerald-700">✓ Unlocked</span>
                ) : (
                  <span className="text-slate-400">Locked • Complete prerequisite</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
