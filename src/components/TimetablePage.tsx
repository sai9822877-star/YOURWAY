import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  Circle,
  PlayCircle,
  Sparkles,
  BookOpen,
  Filter,
} from 'lucide-react';
import { TimetableBlock } from '../types';

interface TimetablePageProps {
  blocks: TimetableBlock[];
  onToggleBlock: (blockId: string) => void;
  onSelectLessonById: (lessonId: string) => void;
  onOpenNotes?: () => void;
}

const ALL_DAYS: ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday')[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export const TimetablePage: React.FC<TimetablePageProps> = ({
  blocks,
  onToggleBlock,
  onSelectLessonById,
  onOpenNotes,
}) => {
  const [selectedDayFilter, setSelectedDayFilter] = useState<string>('All');

  const activeBlocks = blocks.filter((b) => {
    if (selectedDayFilter === 'All') return true;
    return b.day === selectedDayFilter;
  });

  const totalCompleted = blocks.filter((b) => b.completed).length;
  const totalBlocks = blocks.length;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 pb-24">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md mb-2">
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Weekly Adaptive Schedule</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-display">
              My Week
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Personalized timetable synchronized with your daily study preferences and diagnostic priorities.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {onOpenNotes && (
              <button
                id="timetable-open-notes-btn"
                type="button"
                onClick={onOpenNotes}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors cursor-pointer"
                title="View chapter revision notes"
              >
                <BookOpen className="w-4 h-4" />
                <span>Chapter Notes</span>
              </button>
            )}

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left sm:text-right">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Completion
              </div>
              <div className="text-xl font-bold text-slate-900">
                {totalCompleted} / {totalBlocks} Blocks
              </div>
              <div className="text-xs font-bold text-indigo-600">
                {totalBlocks > 0 ? Math.round((totalCompleted / totalBlocks) * 100) : 0}% Done
              </div>
            </div>
          </div>
        </div>

        {/* Day Filter Pills (Scrollable on Mobile) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedDayFilter('All')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedDayFilter === 'All'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            All Days
          </button>
          {ALL_DAYS.map((day) => {
            const hasBlocks = blocks.some((b) => b.day === day);
            const isSelected = selectedDayFilter === day;
            return (
              <button
                key={day}
                onClick={() => setSelectedDayFilter(day)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>{day}</span>
                {hasBlocks && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isSelected ? 'bg-indigo-400' : 'bg-indigo-600'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Calendar / Timetable Blocks */}
        <div className="space-y-6">
          {ALL_DAYS.filter((d) => selectedDayFilter === 'All' || selectedDayFilter === d).map((day) => {
            const dayBlocks = blocks.filter((b) => b.day === day);
            if (dayBlocks.length === 0 && selectedDayFilter === 'All') return null;

            return (
              <div
                key={day}
                className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden"
              >
                {/* Day Header */}
                <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                    <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
                      {day}
                    </h2>
                  </div>
                  <span className="text-xs font-semibold text-slate-500">
                    {dayBlocks.length} Learning Session{dayBlocks.length === 1 ? '' : 's'}
                  </span>
                </div>

                {/* Blocks Container: Desktop grid or mobile stack */}
                <div className="p-5 sm:p-6 divide-y divide-slate-100">
                  {dayBlocks.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400">
                      Rest & Recovery Day. No sessions scheduled.
                    </div>
                  ) : (
                    dayBlocks.map((block) => {
                      const isLesson = block.type === 'lesson';
                      return (
                        <div
                          key={block.id}
                          className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div className="flex items-start gap-4">
                            {/* Checkbox toggle */}
                            <button
                              id={`toggle-${block.id}`}
                              onClick={() => onToggleBlock(block.id)}
                              className="mt-0.5 text-slate-400 hover:text-indigo-600 transition-colors flex-shrink-0"
                              title="Mark session completed"
                            >
                              {block.completed ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                              ) : (
                                <Circle className="w-5 h-5 text-slate-300" />
                              )}
                            </button>

                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700">
                                  {block.startTime} – {block.endTime}
                                </span>
                                <span className="text-xs font-semibold text-slate-500">
                                  ({block.durationMinutes} min)
                                </span>
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    isLesson
                                      ? 'bg-slate-100 text-slate-700'
                                      : 'bg-emerald-50 text-emerald-700'
                                  }`}
                                >
                                  {isLesson ? 'Instructional Lesson' : 'Practice Drill'}
                                </span>
                              </div>

                              <div
                                className={`text-base font-bold text-slate-900 ${
                                  block.completed ? 'line-through text-slate-400' : ''
                                }`}
                              >
                                {block.subjectName} — {block.topicName}
                              </div>
                            </div>
                          </div>

                          {/* Action Button */}
                          <div className="flex items-center gap-2 pl-9 sm:pl-0">
                            {isLesson && (
                              <button
                                onClick={() => onSelectLessonById(block.lessonId)}
                                className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
                              >
                                <PlayCircle className="w-4 h-4" />
                                <span>Open Lesson</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
