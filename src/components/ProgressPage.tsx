import React from 'react';
import {
  LineChart,
  CheckCircle2,
  AlertCircle,
  Flame,
  Clock,
  BookOpen,
  Award,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { Assessment, Course } from '../types';

interface ProgressPageProps {
  progress: {
    overallCompletion: number;
    completedLessons: number;
    totalLessons: number;
    practiceAccuracy: number;
    studyStreak: number;
    subjects: Array<{ subjectId: string; subjectName: string; total: number; completed: number; percentage: number }>;
  };
  assessment: Assessment | null;
  onRetakeAssessment: () => void;
}

export const ProgressPage: React.FC<ProgressPageProps> = ({
  progress,
  assessment,
  onRetakeAssessment,
}) => {
  const strongTopics = assessment?.topicScores.filter((t) => t.status === 'Strong') || [];
  const priorityTopics = assessment?.topicScores.filter((t) => t.status === 'Priority') || [];
  const developingTopics = assessment?.topicScores.filter((t) => t.status === 'Developing') || [];

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 pb-24">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md mb-2">
              <LineChart className="w-3.5 h-3.5" />
              <span>Learning Analytics</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-display">
              Progress & Mastery
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Live tracking of your syllabus completion, practice problem accuracy, and concept mastery.
            </p>
          </div>

          <button
            onClick={onRetakeAssessment}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-xs"
          >
            <span>Retake Diagnostic Test</span>
          </button>
        </div>

        {/* 4 Key Stat Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Stat 1: Overall Completion */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Course Completion
            </div>
            <div className="text-3xl font-black text-slate-900 font-display">
              {progress.overallCompletion}%
            </div>
            <div className="mt-2 text-xs text-slate-500">
              {progress.completedLessons} of {progress.totalLessons} lessons done
            </div>
          </div>

          {/* Stat 2: Practice Accuracy */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Practice Accuracy
            </div>
            <div className="text-3xl font-black text-emerald-600 font-display">
              {progress.practiceAccuracy}%
            </div>
            <div className="mt-2 text-xs text-slate-500">
              Across verified topic drills
            </div>
          </div>

          {/* Stat 3: Study Streak */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Study Streak
            </div>
            <div className="text-3xl font-black text-indigo-600 font-display flex items-center gap-1.5">
              <span>{progress.studyStreak}</span>
              <span className="text-2xl">🔥</span>
            </div>
            <div className="mt-2 text-xs text-slate-500">
              Consistent daily study habit
            </div>
          </div>

          {/* Stat 4: Diagnostic Level */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Baseline Level
            </div>
            <div className="text-2xl font-black text-slate-900 font-display">
              {assessment?.overallLevel || 'Intermediate'}
            </div>
            <div className="mt-2 text-xs text-indigo-600 font-bold">
              {assessment?.overallScore || 72}% Diagnostic Score
            </div>
          </div>
        </div>

        {/* Subject-Wise Progress Cards */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-display">
              Subject-Wise Curriculum Completion
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Individual lesson completion percentages per subject.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {progress.subjects.map((sub) => (
              <div
                key={sub.subjectId}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{sub.subjectName}</h3>
                    <div className="text-xs text-slate-500">
                      {sub.completed} of {sub.total} lessons finished
                    </div>
                  </div>
                  <span className="text-sm font-extrabold text-slate-900">
                    {sub.percentage}%
                  </span>
                </div>

                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-slate-900 rounded-full transition-all duration-500"
                    style={{ width: `${sub.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Diagnostic Topic Retention Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Strong Topics Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Demonstrated Strong Topics (80%+)</span>
            </div>
            <div className="space-y-2">
              {strongTopics.length === 0 ? (
                <div className="text-xs text-slate-400 py-4 text-center">
                  Take the diagnostic assessment to populate strong topics.
                </div>
              ) : (
                strongTopics.map((topic) => (
                  <div
                    key={topic.topicId}
                    className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-emerald-950">{topic.topicName}</span>
                      <span className="text-emerald-700 block text-[11px]">{topic.subjectName}</span>
                    </div>
                    <span className="font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      {topic.percentage}%
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Topics Still Needing Practice */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>Topics Still Needing Practice (&lt;60%)</span>
            </div>
            <div className="space-y-2">
              {priorityTopics.length === 0 ? (
                <div className="text-xs text-slate-400 py-4 text-center">
                  No priority gaps found! Keep up the consistent study routine.
                </div>
              ) : (
                priorityTopics.map((topic) => (
                  <div
                    key={topic.topicId}
                    className="p-3 rounded-xl bg-rose-50/50 border border-rose-100 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-rose-950">{topic.topicName}</span>
                      <span className="text-rose-700 block text-[11px]">{topic.subjectName}</span>
                    </div>
                    <span className="font-extrabold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                      {topic.percentage}%
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
