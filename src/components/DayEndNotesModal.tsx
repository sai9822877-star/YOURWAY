import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  BookOpen,
  Award,
  Sparkles,
  Download,
  Copy,
  Check,
  ArrowLeft,
  Printer,
  Clock,
  Lightbulb,
  FileText,
  Share2,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';
import { CHAPTER_NOTES, ChapterNote } from '../data/chapterNotes';

interface DayEndNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialNoteId?: string;
  onRewardXP?: (amount: number) => void;
  daySubjectName?: string;
  isCompletedTrigger?: boolean;
}

export const DayEndNotesModal: React.FC<DayEndNotesModalProps> = ({
  isOpen,
  onClose,
  initialNoteId = 'poly_class9',
  onRewardXP,
  daySubjectName,
  isCompletedTrigger = true,
}) => {
  const [selectedNoteId, setSelectedNoteId] = useState<string>(initialNoteId);
  const [copied, setCopied] = useState<boolean>(false);
  const [claimedXP, setClaimedXP] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'all' | 'formulas' | 'examples' | 'tips'>('all');

  const note: ChapterNote = CHAPTER_NOTES[selectedNoteId] || CHAPTER_NOTES['poly_class9'];
  const allNotesList = Object.values(CHAPTER_NOTES);

  const handleCopyNotes = () => {
    let text = `${note.chapterTitle} (${note.classLevel} - ${note.subjectName})\n\n`;
    text += `Summary:\n${note.summary}\n\n`;
    note.sections.forEach((s) => {
      text += `=== ${s.title} ===\n${s.content}\n`;
      if (s.points) {
        s.points.forEach((p) => (text += `• ${p}\n`));
      }
      if (s.formulas) {
        s.formulas.forEach((f) => (text += `[${f.name}]: ${f.formula} - ${f.explanation}\n`));
      }
      text += '\n';
    });
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleClaimReward = () => {
    if (!claimedXP) {
      setClaimedXP(true);
      if (onRewardXP) {
        onRewardXP(50);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] print:max-h-none print:border-none print:shadow-none"
        >
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-amber-500 via-indigo-600 to-indigo-700 p-5 sm:p-6 text-white relative shrink-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>
                    {isCompletedTrigger
                      ? "Day's Study Plan Completed • Full Chapter Notes Unlocked"
                      : 'Comprehensive Revision Notes'}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                  {note.chapterTitle}
                </h2>
                <div className="flex items-center gap-3 text-xs text-white/90">
                  <span className="font-semibold">{note.subjectName}</span>
                  <span>•</span>
                  <span>{note.classLevel}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {note.readingTimeMinutes} min read
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  type="button"
                  onClick={handleCopyNotes}
                  className="px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold backdrop-blur-md transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Copy formatted text to clipboard"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Notes'}</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold backdrop-blur-md transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Print or Save as PDF"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Print / PDF</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Chapter Selector Pills */}
            <div className="flex gap-2 overflow-x-auto pt-4 mt-2 border-t border-white/20 scrollbar-none">
              {allNotesList.map((ch) => (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => setSelectedNoteId(ch.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedNoteId === ch.id
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'bg-white/15 text-white/80 hover:bg-white/25 hover:text-white'
                  }`}
                >
                  {ch.subjectName}: Ch.{ch.chapterNumber}
                </button>
              ))}
            </div>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 text-slate-800 dark:text-slate-100 bg-slate-50/50 dark:bg-slate-900/50">
            {/* Overview Box */}
            <div className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 dark:text-indigo-400 mb-1 uppercase tracking-wider">
                <Lightbulb className="w-4 h-4" />
                <span>Chapter Summary & Core Concepts</span>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {note.summary}
              </p>
            </div>

            {/* Sections */}
            <div className="space-y-6">
              {note.sections.map((section, idx) => (
                <div
                  key={idx}
                  className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-4"
                >
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    <span>{section.title}</span>
                  </h3>

                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {section.content}
                  </p>

                  {/* Bullet points */}
                  {section.points && section.points.length > 0 && (
                    <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
                      {section.points.map((pt, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-2.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                          <span className="leading-relaxed">{pt}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Formulas Grid */}
                  {section.formulas && section.formulas.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                      {section.formulas.map((form, fIdx) => (
                        <div
                          key={fIdx}
                          className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-1.5"
                        >
                          <div className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
                            {form.name}
                          </div>
                          <div className="font-mono text-sm font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200/60 dark:border-slate-700">
                            {form.formula}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {form.explanation}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Solved Examples */}
                  {section.examples && section.examples.length > 0 && (
                    <div className="space-y-4 pt-2">
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        High-Yield NCERT Exam Model Questions:
                      </div>
                      {section.examples.map((ex, eIdx) => (
                        <div
                          key={eIdx}
                          className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 space-y-2.5"
                        >
                          <div className="font-bold text-sm text-slate-900 dark:text-white">
                            Q{eIdx + 1}: {ex.question}
                          </div>
                          <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 font-mono bg-white dark:bg-slate-900 p-3 rounded-lg border border-amber-100 dark:border-slate-800">
                            {ex.stepByStepSolution.map((step, sIdx) => (
                              <div key={sIdx}>{step}</div>
                            ))}
                          </div>
                          {ex.tip && (
                            <div className="text-xs text-amber-800 dark:text-amber-300 font-semibold flex items-center gap-1.5">
                              <Lightbulb className="w-3.5 h-3.5 shrink-0" />
                              <span>Pro Tip: {ex.tip}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Key Takeaways & Exam Tips */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                  <Check className="w-4 h-4" />
                  <span>Key Takeaways for Quick Revision</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                  {note.keyTakeaways.map((k, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <span>{k}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-800 dark:text-rose-300 uppercase tracking-wider">
                  <Lightbulb className="w-4 h-4" />
                  <span>Common Exam Traps & Mistakes to Avoid</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                  {note.examTips.map((t, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Footer with Bottom Corner Back Option & Complete Action */}
          <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between gap-4 shrink-0">
            {/* Bottom Corner Back Button */}
            <button
              id="notes-bottom-corner-back-btn"
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>

            {/* Claim Reward Button */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleClaimReward}
                disabled={claimedXP}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer ${
                  claimedXP
                    ? 'bg-emerald-600 text-white cursor-default'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95'
                }`}
              >
                {claimedXP ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Mastery Recorded (+50 XP Earned!)</span>
                  </>
                ) : (
                  <>
                    <Award className="w-4 h-4 text-amber-300" />
                    <span>Mark Chapter Reviewed (+50 XP)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
