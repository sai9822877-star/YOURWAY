import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  Calendar,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Assessment, SubjectScore, TopicScore } from '../types';
import { getPreviousClass } from '../data/prerequisiteQuestions';

interface AssessmentAnalysisViewProps {
  assessment: Assessment;
  onGenerateCourse: () => void;
  detailedResults?: any[];
}

export const AssessmentAnalysisView: React.FC<AssessmentAnalysisViewProps> = ({
  assessment,
  onGenerateCourse,
  detailedResults,
}) => {
  const [analyzing, setAnalyzing] = useState<boolean>(true);
  const [showDetailedAnswers, setShowDetailedAnswers] = useState<boolean>(false);

  useEffect(() => {
    // 1.5 second animated analysis sequence as requested by prompt
    const timer = setTimeout(() => {
      setAnalyzing(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (analyzing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white p-6">
        <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mb-6 relative">
          <Sparkles className="w-8 h-8 text-indigo-400 animate-pulse" />
          <div className="absolute inset-0 rounded-2xl border-2 border-indigo-400 border-t-transparent animate-spin" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-center">
          Analyzing your learning level…
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-sm text-center">
          Evaluating 20 diagnostic responses, calculating topic mastery, and identifying high-priority curriculum gaps.
        </p>
      </div>
    );
  }

  // Filter topics
  const priorityTopics = assessment.topicScores.filter((t) => t.status === 'Priority');
  const developingTopics = assessment.topicScores.filter((t) => t.status === 'Developing');
  const strongTopics = assessment.topicScores.filter((t) => t.status === 'Strong');

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Profile Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Diagnostic Assessment Complete</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-display">
                Your Learning Profile
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Diagnostic baseline evaluated for {assessment.class} (testing prerequisite {getPreviousClass(assessment.class)} concepts to target foundational gaps).
              </p>
            </div>

            {/* Overall Level Badge */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center sm:text-right min-w-[150px]">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Overall Level
              </div>
              <div className="text-2xl font-black text-slate-900 font-display">
                {assessment.overallLevel}
              </div>
              <div className="text-xs font-bold text-indigo-600">
                {assessment.overallScore}% Overall Accuracy
              </div>
            </div>
          </div>

          {/* Subject Performance Cards */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Subject Mastery Breakdown
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {assessment.subjectScores.map((subj) => {
                const isStrong = subj.status === 'Strong';
                const isDev = subj.status === 'Developing';
                return (
                  <div
                    key={subj.subjectId}
                    className="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/50 flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="text-sm font-bold text-slate-900">{subj.subjectName}</div>
                        <div className="text-xs text-slate-500">
                          {subj.correctAnswers} of {subj.totalQuestions} questions correct
                        </div>
                      </div>
                      <div
                        className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                          isStrong
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : isDev
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        {subj.status}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                        <span>Score</span>
                        <span>{subj.percentage}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isStrong ? 'bg-emerald-500' : isDev ? 'bg-amber-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${subj.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 6: Topic Analysis (Deep Diagnostic) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Deep Diagnostic Breakdown
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-950 font-display mt-1">
              Topic-Level Mastery & Needs
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Morphic uses this granular breakdown to prioritize lesson volume and practice drills in your custom course.
            </p>
          </div>

          {/* PRIORITY TOPICS */}
          {priorityTopics.length > 0 && (
            <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-200/80">
              <div className="flex items-center gap-2 text-rose-800 text-xs font-bold uppercase tracking-wider mb-3">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Priority Topics (Needs Immediate Focus)</span>
              </div>
              <div className="space-y-2.5">
                {priorityTopics.map((topic) => (
                  <div
                    key={topic.topicId}
                    className="p-3.5 rounded-xl bg-white border border-rose-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                          {topic.subjectName}
                        </span>
                        <span className="text-sm font-bold text-slate-900">{topic.topicName}</span>
                      </div>
                      <p className="text-xs text-rose-700 font-medium mt-1">
                        {topic.diagnosticFeedback}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="text-xs font-extrabold text-rose-600 bg-rose-100 px-2 py-0.5 rounded">
                        {topic.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DEVELOPING TOPICS */}
          {developingTopics.length > 0 && (
            <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/80">
              <div className="flex items-center gap-2 text-amber-800 text-xs font-bold uppercase tracking-wider mb-3">
                <TrendingUp className="w-4 h-4 text-amber-600" />
                <span>Developing Topics (Partial Conceptual Grasp)</span>
              </div>
              <div className="space-y-2.5">
                {developingTopics.map((topic) => (
                  <div
                    key={topic.topicId}
                    className="p-3.5 rounded-xl bg-white border border-amber-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                          {topic.subjectName}
                        </span>
                        <span className="text-sm font-bold text-slate-900">{topic.topicName}</span>
                      </div>
                      <p className="text-xs text-amber-800 font-medium mt-1">
                        {topic.diagnosticFeedback}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="text-xs font-extrabold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                        {topic.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STRONG TOPICS */}
          {strongTopics.length > 0 && (
            <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200/80">
              <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Strong Topics (Solid Foundation)</span>
              </div>
              <div className="space-y-2.5">
                {strongTopics.map((topic) => (
                  <div
                    key={topic.topicId}
                    className="p-3.5 rounded-xl bg-white border border-emerald-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                          {topic.subjectName}
                        </span>
                        <span className="text-sm font-bold text-slate-900">{topic.topicName}</span>
                      </div>
                      <p className="text-xs text-emerald-700 font-medium mt-1">
                        {topic.diagnosticFeedback}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        {topic.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Optional Question Review Accordion */}
          {detailedResults && detailedResults.length > 0 && (
            <div className="border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => setShowDetailedAnswers(!showDetailedAnswers)}
                className="w-full flex items-center justify-between text-xs font-bold text-slate-600 hover:text-slate-900 py-2"
              >
                <span>Review All 20 Questions & Explanations</span>
                {showDetailedAnswers ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showDetailedAnswers && (
                <div className="mt-4 space-y-3 max-h-96 overflow-y-auto pr-2">
                  {detailedResults.map((dr, idx) => (
                    <div
                      key={dr.questionId || idx}
                      className={`p-3.5 rounded-xl border text-xs ${
                        dr.isCorrect
                          ? 'bg-emerald-50/40 border-emerald-200'
                          : 'bg-rose-50/40 border-rose-200'
                      }`}
                    >
                      <div className="font-bold text-slate-900 mb-1">
                        Q{idx + 1}. {dr.questionText}
                      </div>
                      <div className="flex items-center gap-4 text-[11px] mb-1.5">
                        <span className={dr.isCorrect ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}>
                          Your Answer: Option {dr.selectedAnswer} ({dr.isCorrect ? 'Correct' : 'Incorrect'})
                        </span>
                        {!dr.isCorrect && (
                          <span className="text-slate-700 font-bold">
                            Correct: Option {dr.correctAnswer}
                          </span>
                        )}
                      </div>
                      <div className="text-slate-600 leading-relaxed bg-white/70 p-2 rounded border border-slate-200/50">
                        {dr.explanation}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Primary CTA: Generate Course */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold font-display">
              Ready to generate your personalized course?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md">
              We will structure your 4-week timetable, prioritize your weak topics (40% allocation), and link verified YouTube video lessons.
            </p>
          </div>

          <button
            id="analysis-generate-course-btn"
            type="button"
            onClick={onGenerateCourse}
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all flex-shrink-0"
          >
            <span>Generate Personalized Course</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
