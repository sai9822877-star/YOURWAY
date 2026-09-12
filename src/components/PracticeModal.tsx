import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { Lesson, Question } from '../types';

interface PracticeModalProps {
  lesson: Lesson;
  questions: Question[];
  onClose: () => void;
  onSubmitAnswer: (
    questionId: string,
    selected: 'A' | 'B' | 'C' | 'D'
  ) => Promise<{ isCorrect: boolean; correctAnswer: string; explanation: string }>;
}

export const PracticeModal: React.FC<PracticeModalProps> = ({
  lesson,
  questions,
  onClose,
  onSubmitAnswer,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedChoice, setSelectedChoice] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [feedback, setFeedback] = useState<{
    isCorrect: boolean;
    correctAnswer: string;
    explanation: string;
  } | null>(null);
  const [scoreCount, setScoreCount] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const currentQ = questions[currentIndex];

  const handleSelect = (opt: 'A' | 'B' | 'C' | 'D') => {
    if (feedback) return; // cannot change after submitted
    setSelectedChoice(opt);
  };

  const handleSubmit = async () => {
    if (!selectedChoice || !currentQ) return;
    const result = await onSubmitAnswer(currentQ.id, selectedChoice);
    setFeedback(result);
    if (result.isCorrect) {
      setScoreCount((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    setSelectedChoice(null);
    setFeedback(null);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-xl my-auto overflow-hidden">
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {lesson.topicName} Drill
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8">
          {!isFinished && currentQ ? (
            <div>
              {/* Question progress */}
              <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                <span className="font-semibold text-slate-700">
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                  {currentQ.difficulty}
                </span>
              </div>

              {/* Question Text */}
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug font-display mb-6">
                {currentQ.question}
              </h3>

              {/* Options */}
              <div className="space-y-2.5 mb-6">
                {(
                  [
                    { key: 'A', text: currentQ.optionA },
                    { key: 'B', text: currentQ.optionB },
                    { key: 'C', text: currentQ.optionC },
                    { key: 'D', text: currentQ.optionD },
                  ] as const
                ).map((opt) => {
                  const isSelected = selectedChoice === opt.key;
                  let optStyle = 'border-slate-200 bg-white hover:border-slate-300';
                  if (feedback) {
                    if (opt.key === feedback.correctAnswer) {
                      optStyle = 'border-emerald-500 bg-emerald-50/80 text-emerald-950 font-semibold';
                    } else if (isSelected && !feedback.isCorrect) {
                      optStyle = 'border-rose-500 bg-rose-50 text-rose-950';
                    } else {
                      optStyle = 'border-slate-200 opacity-50';
                    }
                  } else if (isSelected) {
                    optStyle = 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20';
                  }

                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => handleSelect(opt.key)}
                      disabled={Boolean(feedback)}
                      className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm flex items-center justify-between transition-all ${optStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-md bg-slate-100 font-bold text-xs flex items-center justify-center flex-shrink-0 text-slate-700">
                          {opt.key}
                        </span>
                        <span>{opt.text}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Immediate Feedback Explanation Box */}
              {feedback && (
                <div
                  className={`p-4 rounded-xl border text-xs leading-relaxed mb-6 ${
                    feedback.isCorrect
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                      : 'bg-rose-50 border-rose-200 text-rose-950'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    {feedback.isCorrect ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Correct! Well done.</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-rose-600" />
                        <span>Incorrect. Correct answer is Option {feedback.correctAnswer}.</span>
                      </>
                    )}
                  </div>
                  <p className="text-slate-700 mt-1">{feedback.explanation}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Exit Practice</span>
                </button>

                {!feedback ? (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!selectedChoice}
                    className="px-6 py-2.5 rounded-xl bg-slate-950 text-white text-xs font-bold hover:bg-slate-800 disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    Submit Answer
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors shadow-sm cursor-pointer"
                  >
                    <span>{currentIndex < questions.length - 1 ? 'Next Question' : 'Complete Drill'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Finished Summary Card */
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-display">
                Practice Drill Completed!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto">
                You scored <strong className="text-slate-950">{scoreCount}</strong> out of{' '}
                <strong className="text-slate-950">{questions.length}</strong> questions on{' '}
                {lesson.topicName}.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-slate-950 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
                >
                  Return to Course
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
