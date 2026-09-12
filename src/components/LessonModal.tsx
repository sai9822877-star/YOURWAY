import React, { useState } from 'react';
import {
  X,
  PlayCircle,
  CheckCircle2,
  BookOpen,
  HelpCircle,
  Sparkles,
  ExternalLink,
  Layers,
  Search,
  Video,
  Flame,
  Zap,
  GraduationCap,
  ShieldCheck,
  Lock,
  ArrowLeft,
} from 'lucide-react';
import { Lesson, Question, EducatorVideoOption, Topic } from '../types';
import { OFFICIAL_BOOKS } from '../data/officialBooks';
import { StrictYouTubePlayer } from './StrictYouTubePlayer';
import { ChapterDoubtsModal } from './ChapterDoubtsModal';

interface LessonModalProps {
  lesson: Lesson;
  practiceQuestions: Question[];
  onClose: () => void;
  onMarkComplete: (lessonId: string) => void;
  onOpenPractice: (lesson: Lesson, questions: Question[]) => void;
}

export const LessonModal: React.FC<LessonModalProps> = ({
  lesson,
  practiceQuestions,
  onClose,
  onMarkComplete,
  onOpenPractice,
}) => {
  const [completed, setCompleted] = useState<boolean>(Boolean(lesson.completed));
  const [showDoubtsModal, setShowDoubtsModal] = useState<boolean>(false);

  // STRICT RULE: Only show teachers who ACTUALLY made a video for this exact topic!
  // If a teacher did not make a video for this topic, they are NOT in educatorOptions.
  const availableOptions: EducatorVideoOption[] =
    lesson.educatorOptions && lesson.educatorOptions.length > 0
      ? lesson.educatorOptions
      : [
          {
            educator: lesson.channelName || 'Curated Lecture',
            channelName: lesson.channelName || 'Verified Channel',
            youtubeVideoId: lesson.youtubeVideoId,
            title: lesson.title,
          },
        ];

  // Active video state - defaults to the first verified educator for this topic
  const [selectedEducator, setSelectedEducator] = useState<string>(availableOptions[0].educator);
  const [currentVideoId, setCurrentVideoId] = useState<string>(availableOptions[0].youtubeVideoId);
  const [currentChannel, setCurrentChannel] = useState<string>(availableOptions[0].channelName);
  const [currentTitle, setCurrentTitle] = useState<string>(availableOptions[0].title);

  // Custom YouTube video / URL state
  const [showCustomInput, setShowCustomInput] = useState<boolean>(false);
  const [customInputUrl, setCustomInputUrl] = useState<string>('');
  const [customError, setCustomError] = useState<string>('');

  // Reset active educator and video whenever the modal opens a different lesson
  React.useEffect(() => {
    const defaultOpt =
      lesson.educatorOptions && lesson.educatorOptions.length > 0
        ? lesson.educatorOptions[0]
        : {
            educator: lesson.channelName || 'Curated Lecture',
            channelName: lesson.channelName || 'Verified Channel',
            youtubeVideoId: lesson.youtubeVideoId,
            title: lesson.title,
          };
    setSelectedEducator(defaultOpt.educator);
    setCurrentVideoId(defaultOpt.youtubeVideoId);
    setCurrentChannel(defaultOpt.channelName);
    setCurrentTitle(defaultOpt.title);
    setCompleted(Boolean(lesson.completed));
    setShowCustomInput(false);
    setCustomError('');
  }, [lesson.id, lesson.youtubeVideoId, lesson.educatorOptions]);

  const handleSelectEducator = (option: EducatorVideoOption) => {
    setSelectedEducator(option.educator);
    setCurrentVideoId(option.youtubeVideoId);
    setCurrentChannel(option.channelName);
    setCurrentTitle(option.title);
    setShowCustomInput(false);
    setCustomError('');
  };

  const handleApplyCustomVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInputUrl.trim()) return;

    let videoId = customInputUrl.trim();

    // Parse standard YouTube URL variations
    if (videoId.includes('youtube.com/watch?v=')) {
      const match = videoId.match(/v=([^&]+)/);
      if (match && match[1]) {
        videoId = match[1];
      }
    } else if (videoId.includes('youtu.be/')) {
      const match = videoId.match(/youtu\.be\/([^?&]+)/);
      if (match && match[1]) {
        videoId = match[1];
      }
    } else if (videoId.includes('youtube.com/embed/')) {
      const match = videoId.match(/embed\/([^?&]+)/);
      if (match && match[1]) {
        videoId = match[1];
      }
    }

    if (videoId.length < 5) {
      setCustomError('Please enter a valid YouTube video URL or ID.');
      return;
    }

    setSelectedEducator('Custom Video');
    setCurrentVideoId(videoId);
    setCurrentChannel('YouTube Video');
    setCurrentTitle(`Custom Video: ${lesson.topicName}`);
    setShowCustomInput(false);
    setCustomError('');
  };

  const handleToggleComplete = () => {
    setCompleted(!completed);
    onMarkComplete(lesson.id);
  };

  const handleVideoEnd = () => {
    setCompleted(true);
    onMarkComplete(lesson.id);
    setShowDoubtsModal(true);
  };

  const topicForDoubts: Topic = {
    id: lesson.topicId || lesson.id,
    subjectId: lesson.subjectId,
    name: lesson.topicName || lesson.title,
    difficulty: 'Medium',
    order: 1,
    youtubeVideoId: currentVideoId,
    youtubeTitle: currentTitle,
    youtubeChannel: currentChannel,
    durationMinutes: 40,
    learningOutcomes: lesson.learningOutcomes,
  };

  // Find official textbook corresponding to this lesson's subject
  const matchingBook =
    OFFICIAL_BOOKS.find(
      (b) =>
        b.subject.toLowerCase() === lesson.subjectName.toLowerCase() ||
        lesson.subjectName.toLowerCase().includes(b.subject.toLowerCase())
    ) || OFFICIAL_BOOKS[0];

  const embedUrl = `https://www.youtube-nocookie.com/embed/${currentVideoId}?rel=0&modestbranding=1&autoplay=1`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-4xl my-auto overflow-hidden flex flex-col max-h-[94vh]">
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-indigo-100 text-indigo-800">
              {lesson.subjectName}
            </span>
            <div className="text-xs font-semibold text-slate-500">
              Lesson {lesson.lessonNumber} • {lesson.durationMinutes} min
            </div>
            <span className="hidden sm:inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              No API Key Required • Direct Play
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-5 sm:p-7 space-y-5">
          {/* Title & Topic Header */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
              {lesson.topicName}
            </div>
            <h2 className="text-lg sm:text-2xl font-bold text-slate-950 font-display">
              {currentTitle}
            </h2>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-500 mt-2">
              <span>
                Educator Channel:{' '}
                <strong className="text-slate-800 font-bold">{currentChannel}</strong>
              </span>
              <span>•</span>
              <span className="capitalize">{lesson.priorityCategory} Priority Focus</span>
            </div>
          </div>

          {/* Educator Switcher Selector */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span>Select Your Preferred Educator:</span>
              </span>
              <button
                onClick={() => setShowCustomInput(!showCustomInput)}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
              >
                <Search className="w-3 h-3" />
                <span>{showCustomInput ? 'Hide Custom URL' : 'Use Any YouTube URL'}</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {availableOptions.map((opt) => {
                const isSelected = selectedEducator === opt.educator;
                const isPrashant = opt.educator.toLowerCase().includes('prashant');
                const isPW =
                  opt.educator.toLowerCase().includes('physics wallah') ||
                  opt.educator.toLowerCase().includes('pw');

                return (
                  <button
                    key={opt.educator}
                    onClick={() => handleSelectEducator(opt)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isSelected
                        ? isPrashant
                          ? 'bg-amber-500 text-slate-950 shadow-sm ring-2 ring-amber-300'
                          : isPW
                          ? 'bg-slate-950 text-white shadow-sm ring-2 ring-slate-400'
                          : 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-300'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {isPrashant && <Flame className="w-3.5 h-3.5 text-amber-900" />}
                    {isPW && <Zap className="w-3.5 h-3.5 text-amber-400" />}
                    {!isPrashant && !isPW && <GraduationCap className="w-3.5 h-3.5 text-slate-500" />}
                    <span>{opt.educator}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom YouTube URL Form */}
            {showCustomInput && (
              <form onSubmit={handleApplyCustomVideo} className="mt-3 pt-3 border-t border-slate-200 flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={customInputUrl}
                    onChange={(e) => setCustomInputUrl(e.target.value)}
                    placeholder="Paste any YouTube URL (e.g., https://www.youtube.com/watch?v=...)"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  />
                  {customError && <p className="text-[11px] text-rose-600 mt-1">{customError}</p>}
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-slate-950 text-white text-xs font-bold hover:bg-slate-800 transition-colors whitespace-nowrap"
                >
                  Play Custom Video
                </button>
              </form>
            )}
          </div>

          {/* Strict Anti-Forwarding YouTube Player with Watch Percentage */}
          <div className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-slate-800">
            <StrictYouTubePlayer
              videoId={currentVideoId}
              title={currentTitle}
              onVideoEnd={handleVideoEnd}
            />
          </div>

          {/* Player Quick Controls & Direct YouTube Link */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
            <div className="flex items-center gap-2 text-slate-500">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Playing verified lecture from <strong>{currentChannel}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowDoubtsModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-[11px] border border-indigo-200 transition-colors"
              >
                <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
                <span>Chapter Doubts (MCQ)</span>
              </button>
              <a
                href={`https://www.youtube.com/watch?v=${currentVideoId}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] transition-colors"
              >
                <span>Watch on YouTube</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
            </div>
          </div>

          {/* What You'll Learn Section */}
          <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/40 border border-indigo-100 space-y-3">
            <div className="flex items-center gap-2 text-indigo-950 font-bold text-sm">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>Core Learning Outcomes for {lesson.topicName}</span>
            </div>
            <ul className="space-y-1.5">
              {lesson.learningOutcomes.map((outcome, idx) => (
                <li key={idx} className="text-xs sm:text-sm text-slate-700 flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-2 flex-shrink-0" />
                  <span>{outcome}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Official Book & Curriculum Source Reference */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-white font-bold text-xs sm:text-sm">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                <span>Official Curriculum Reading: {matchingBook.title}</span>
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Verified Legal Source</span>
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/60 p-3.5 rounded-xl border border-white/10">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-xs sm:text-sm text-white">{matchingBook.title}</span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-950 text-indigo-300 border border-indigo-500/30">
                    {matchingBook.type}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {matchingBook.authorOrPublisher} • Portal: {matchingBook.officialSourceName}
                </p>
                <p className="text-[11px] text-slate-400/90 leading-relaxed max-w-xl">
                  {matchingBook.description}
                </p>
              </div>

              <div className="flex flex-col items-start sm:items-end gap-1.5 flex-shrink-0">
                <a
                  id={`lesson-open-official-source-${matchingBook.id}`}
                  href={matchingBook.officialSourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-slate-950 hover:bg-slate-100 font-bold text-xs transition-all shadow-sm cursor-pointer group/btn"
                  title={`Open official source at ${matchingBook.officialSourceName} in a new tab`}
                >
                  <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Open Official Source</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover/btn:text-slate-900 transition-colors" />
                </a>
                <span className="text-[10px] text-slate-400">Opens legal source in new tab</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              id="lesson-modal-bottom-back-btn"
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <button
              id="toggle-lesson-complete-btn"
              onClick={handleToggleComplete}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                completed
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{completed ? 'Lesson Completed ✓' : 'Mark Lesson Complete'}</span>
            </button>

            <button
              id="open-doubts-footer-btn"
              onClick={() => setShowDoubtsModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Chapter Doubts</span>
            </button>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              id="open-practice-btn"
              onClick={() => onOpenPractice(lesson, practiceQuestions)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-slate-950 text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-sm"
            >
              <HelpCircle className="w-4 h-4 text-indigo-400" />
              <span>Practice Questions ({practiceQuestions.length})</span>
            </button>
          </div>
        </div>

        {/* Chapter Doubts Modal with Targeted Explaining Videos */}
        <ChapterDoubtsModal
          isOpen={showDoubtsModal}
          onClose={() => setShowDoubtsModal(false)}
          topic={topicForDoubts}
          onProceedToPractice={() => {
            setShowDoubtsModal(false);
            onOpenPractice(lesson, practiceQuestions);
          }}
        />
      </div>
    </div>
  );
};
