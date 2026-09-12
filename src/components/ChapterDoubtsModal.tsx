import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, HelpCircle, Play, CheckCircle2, BookOpen, ArrowLeft, ArrowRight, Lightbulb, Sparkles, Check, RefreshCw } from 'lucide-react';
import { Topic } from '../types';
import { ChapterSubTopicDoubt, getDoubtsForTopic } from '../data/chapterDoubts';
import { StrictYouTubePlayer } from './StrictYouTubePlayer';

interface ChapterDoubtsModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic: Topic;
  onProceedToPractice?: () => void;
}

export const ChapterDoubtsModal: React.FC<ChapterDoubtsModalProps> = ({
  isOpen,
  onClose,
  topic,
  onProceedToPractice,
}) => {
  const catalog = getDoubtsForTopic(topic);
  const [activeSubTopic, setActiveSubTopic] = useState<ChapterSubTopicDoubt | null>(null);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [clearedDoubts, setClearedDoubts] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleSelectSubTopic = (subTopic: ChapterSubTopicDoubt) => {
    setActiveSubTopic(subTopic);
    setQuizAnswer(null);
    setQuizSubmitted(false);
  };

  const handleBackToDoubts = () => {
    setActiveSubTopic(null);
    setQuizAnswer(null);
    setQuizSubmitted(false);
  };

  const handleMarkDoubtCleared = (subTopicId: string) => {
    if (!clearedDoubts.includes(subTopicId)) {
      setClearedDoubts([...clearedDoubts, subTopicId]);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
            <div className="flex items-center gap-2.5">
              {activeSubTopic && (
                <button
                  type="button"
                  onClick={handleBackToDoubts}
                  className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 mr-1 transition-colors"
                  title="Back to doubts list"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-white flex-shrink-0"
                style={{ backgroundColor: 'var(--primary-hex, #6366f1)' }}
              >
                <HelpCircle className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
                  {activeSubTopic ? activeSubTopic.name : 'Chapter Doubt Diagnosis & Clarity Check'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {topic.name} • {catalog.subjectName}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body: VIEW 1 — MCQ Doubt Questionnaire */}
          {!activeSubTopic ? (
            <div className="p-6 md:p-8 space-y-6">
              {/* Introduction */}
              <div className="bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 rounded-2xl p-4 flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-indigo-950 dark:text-indigo-200">
                    Video lecture finished! Any conceptual doubts in this chapter?
                  </h3>
                  <p className="text-xs text-indigo-800/80 dark:text-indigo-300/80 mt-1 leading-relaxed">
                    Select any topic below where you have a doubt. Its <strong>exclusive targeted explaining video</strong> will open immediately in front of you so you can master it with precision.
                  </p>
                </div>
              </div>

              {/* MCQ Doubts List */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                  Select a topic to watch its dedicated explanation:
                </label>

                <div className="space-y-2.5">
                  {catalog.subTopics.map((subTopic, idx) => {
                    const isCleared = clearedDoubts.includes(subTopic.id);
                    const letter = String.fromCharCode(65 + idx); // A, B, C, D...

                    return (
                      <button
                        key={subTopic.id}
                        type="button"
                        onClick={() => handleSelectSubTopic(subTopic)}
                        className="w-full text-left p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 transition-all flex items-center justify-between group shadow-sm"
                      >
                        <div className="flex items-start gap-3.5 pr-2">
                          <span className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                            {letter}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                {subTopic.name}
                              </h4>
                              {isCleared && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                                  <Check className="w-3 h-3" />
                                  Cleared
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                              {subTopic.doubtPrompt}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            <Play className="w-3 h-3 text-indigo-500" />
                            {subTopic.durationMinutes}m Video
                          </span>
                          <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center transition-colors">
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* No Doubts / Practice Option */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left">
                  {clearedDoubts.length > 0 ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                      🎉 {clearedDoubts.length} doubt{clearedDoubts.length > 1 ? 's' : ''} reviewed and cleared!
                    </span>
                  ) : (
                    <span>Understood everything? You can jump straight into practicing problems.</span>
                  )}
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex items-center gap-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>

                  {onProceedToPractice && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onProceedToPractice();
                      }}
                      className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white shadow-md transition-transform active:scale-95"
                      style={{ backgroundColor: 'var(--primary-hex, #6366f1)' }}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Start Chapter Practice</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* VIEW 2 — Targeted Topic Explaining Video in front of the user */
            <div className="p-5 sm:p-6 space-y-5 max-h-[82vh] overflow-y-auto">
              {/* Back Bar */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleBackToDoubts}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Choose Another Doubt Topic</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleMarkDoubtCleared(activeSubTopic.id)}
                  className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-lg border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Mark Doubt Cleared</span>
                </button>
              </div>

              {/* TARGETED VIDEO PLAYER */}
              <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-800">
                <StrictYouTubePlayer
                  videoId={activeSubTopic.targetedVideoId}
                  title={activeSubTopic.targetedVideoTitle}
                  onVideoEnd={() => handleMarkDoubtCleared(activeSubTopic.id)}
                />
              </div>

              {/* Key Concept Notes & Formulas */}
              <div className="bg-slate-50 dark:bg-slate-950/50 rounded-2xl p-4 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 mb-2.5">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    Key Takeaways & Formulas for {activeSubTopic.name}
                  </h4>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                  {activeSubTopic.keyNotes.map((note, nIdx) => (
                    <li key={nIdx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quick Check MCQ to verify doubt is cleared */}
              <div className="bg-white dark:bg-slate-800/40 rounded-2xl p-4 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Quick Understanding Check
                  </h4>
                  <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                    Instant Concept Verification
                  </span>
                </div>

                <p className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
                  {activeSubTopic.quickCheckQuestion.question}
                </p>

                <div className="space-y-2 mb-3">
                  {activeSubTopic.quickCheckQuestion.options.map((opt, optIdx) => {
                    const isSelected = quizAnswer === optIdx;
                    const isCorrect = optIdx === activeSubTopic.quickCheckQuestion.correctIndex;
                    let styleClass = 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-100';

                    if (quizSubmitted) {
                      if (isCorrect) {
                        styleClass = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 font-bold';
                      } else if (isSelected && !isCorrect) {
                        styleClass = 'border-red-500 bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-200';
                      }
                    } else if (isSelected) {
                      styleClass = 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 font-bold';
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        disabled={quizSubmitted}
                        onClick={() => setQuizAnswer(optIdx)}
                        className={`w-full text-left p-2.5 rounded-xl border text-xs flex items-center justify-between transition-colors ${styleClass}`}
                      >
                        <span>{opt}</span>
                        {quizSubmitted && isCorrect && <Check className="w-4 h-4 text-emerald-600" />}
                      </button>
                    );
                  })}
                </div>

                {!quizSubmitted ? (
                  <button
                    type="button"
                    disabled={quizAnswer === null}
                    onClick={() => {
                      setQuizSubmitted(true);
                      if (quizAnswer === activeSubTopic.quickCheckQuestion.correctIndex) {
                        handleMarkDoubtCleared(activeSubTopic.id);
                      }
                    }}
                    className="w-full py-2 rounded-xl text-xs font-bold text-white transition-opacity disabled:opacity-40"
                    style={{ backgroundColor: 'var(--primary-hex, #6366f1)' }}
                  >
                    Check Answer
                  </button>
                ) : (
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300">
                    <p className="font-semibold mb-1">
                      {quizAnswer === activeSubTopic.quickCheckQuestion.correctIndex ? '✅ Correct! Concept verified.' : '💡 Review Explanation:'}
                    </p>
                    <p>{activeSubTopic.quickCheckQuestion.explanation}</p>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleBackToDoubts}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  ← Back to All Doubts
                </button>

                {onProceedToPractice && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onProceedToPractice();
                    }}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white shadow-md transition-transform active:scale-95"
                    style={{ backgroundColor: 'var(--primary-hex, #6366f1)' }}
                  >
                    <span>Proceed to Practice</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
