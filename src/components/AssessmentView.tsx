import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  X,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Question, ClassLevel } from '../types';
import { getPreviousClass } from '../data/prerequisiteQuestions';

interface AssessmentViewProps {
  questions: Question[];
  classLevel: ClassLevel;
  onSubmit: (answers: { questionId: string; selectedAnswer: 'A' | 'B' | 'C' | 'D' }[]) => void;
  onExit: () => void;
}

export const AssessmentView: React.FC<AssessmentViewProps> = ({
  questions,
  classLevel,
  onSubmit,
  onExit,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>({});
  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);

  const currentQ = questions[currentIndex];
  const total = questions.length;
  const progressPercent = Math.round(((currentIndex + 1) / total) * 100);

  const handleSelectOption = (choice: 'A' | 'B' | 'C' | 'D') => {
    if (!currentQ) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: choice,
    }));
  };

  const handleNext = () => {
    if (currentIndex < total - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleFinalSubmit();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleFinalSubmit = () => {
    // Format answers array
    const formatted = questions.map((q) => ({
      questionId: q.id,
      selectedAnswer: answers[q.id] || 'A', // fallback default if skipped
    }));
    onSubmit(formatted);
  };

  if (!currentQ) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="text-center p-8 bg-white rounded-2xl border border-slate-200 shadow-sm max-w-md">
          <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-900 mb-2">No Questions Loaded</h2>
          <p className="text-sm text-slate-500 mb-4">
            We couldn't initialize the assessment session. Please try again.
          </p>
          <button
            onClick={onExit}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  const selectedChoice = answers[currentQ.id];
  const isFinalQuestion = currentIndex === total - 1;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Top Bar Header */}
      <div className="bg-white border-b border-slate-200/90 px-4 sm:px-8 py-3.5 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-slate-900 text-white">
              {classLevel}
            </span>
            <div className="text-sm font-bold text-slate-900 font-display tracking-tight">
              Question <span className="text-indigo-600">{currentIndex + 1}</span> of {total}
            </div>
          </div>

          {/* Quick Stats & Exit */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{answeredCount} Answered</span>
            </div>
            <button
              onClick={() => setShowExitConfirm(true)}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              title="Exit Assessment"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="max-w-4xl mx-auto mt-3 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-600 transition-all duration-300 ease-out rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Question Card Area */}
      <div className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col justify-center">
        {/* Diagnostic prerequisite callout */}
        <div className="mb-3 px-3.5 py-2 bg-indigo-50 border border-indigo-100/90 rounded-2xl text-xs text-indigo-900 flex items-center gap-2.5 shadow-2xs">
          <Layers className="w-4 h-4 text-indigo-600 shrink-0" />
          <span className="leading-snug">
            <strong>Foundational Diagnostic:</strong> Testing your <strong>{currentQ?.prerequisiteClass || getPreviousClass(classLevel)}</strong> knowledge to personalize your <strong>{classLevel}</strong> learning path.
          </span>
        </div>

        {/* Metadata Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
            {currentQ.subjectId.replace(/^sub_c\d+_/, '').replace(/^sub_/, '').replace('_', ' ')}
          </span>
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${
              currentQ.difficulty === 'Easy'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : currentQ.difficulty === 'Medium'
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-rose-50 text-rose-700 border-rose-200'
            }`}
          >
            {currentQ.difficulty} Level
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
            <Sparkles className="w-3 h-3 text-purple-600" />
            <span>Checks {currentQ.prerequisiteClass || getPreviousClass(classLevel)} Knowledge</span>
          </span>
        </div>

        {/* Question Prompt */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm mb-6">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 leading-relaxed font-display">
            {currentQ.question}
          </h2>
        </div>

        {/* Multiple Choice Options */}
        <div className="space-y-3">
          {(
            [
              { key: 'A', text: currentQ.optionA },
              { key: 'B', text: currentQ.optionB },
              { key: 'C', text: currentQ.optionC },
              { key: 'D', text: currentQ.optionD },
            ] as const
          ).map((opt) => {
            const isSelected = selectedChoice === opt.key;
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => handleSelectOption(opt.key)}
                className={`w-full p-4 sm:p-5 rounded-xl sm:rounded-2xl border text-left flex items-center justify-between transition-all duration-150 active:scale-[0.99] ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/60 shadow-sm ring-2 ring-indigo-600/20'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-3.5 sm:gap-4">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs sm:text-sm flex-shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {opt.key}
                  </div>
                  <span className={`text-sm sm:text-base ${isSelected ? 'font-semibold text-slate-950' : 'text-slate-800'}`}>
                    {opt.text}
                  </span>
                </div>

                {isSelected && (
                  <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 ml-2" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="bg-white border-t border-slate-200/90 px-4 sm:px-8 py-4 sticky bottom-0 z-20">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <button
            id="assessment-prev-btn"
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:pointer-events-none"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          {/* Jump Dots on Tablet/Desktop */}
          <div className="hidden md:flex items-center gap-1 max-w-sm overflow-x-auto py-1">
            {questions.map((q, idx) => {
              const isAnswered = Boolean(answers[q.id]);
              const isCurrent = idx === currentIndex;
              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    isCurrent
                      ? 'w-6 bg-indigo-600'
                      : isAnswered
                      ? 'bg-emerald-500'
                      : 'bg-slate-200'
                  }`}
                  title={`Question ${idx + 1}`}
                />
              );
            })}
          </div>

          <div>
            {!isFinalQuestion ? (
              <button
                id="assessment-next-btn"
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-950 text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-sm"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                id="assessment-finish-btn"
                type="button"
                onClick={handleFinalSubmit}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-600/20"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Finish Assessment</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-slate-200 shadow-xl">
            <h3 className="text-base font-bold text-slate-900 mb-2 font-display">
              Exit Assessment?
            </h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              You've answered {answeredCount} of 20 questions. Your answers will not be analyzed if you exit now.
            </p>
            <div className="flex items-center justify-end gap-2.5">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Continue Test
              </button>
              <button
                onClick={onExit}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700"
              >
                Exit Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
