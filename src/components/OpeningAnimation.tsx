import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, Compass } from 'lucide-react';
import gojoImg from '../assets/images/gojo_satoru.jpg';

interface OpeningAnimationProps {
  onComplete: () => void;
  isReady?: boolean;
}

export const OpeningAnimation: React.FC<OpeningAnimationProps> = ({
  onComplete,
  isReady = true,
}) => {
  // Animation sequence stages:
  // 0: Initial dark canvas
  // 1: Your Way Logo fades in
  // 2: Gojo Satoru image smooth entrance with subtle zoom & glow
  // 3: Quote Line 1: "No one is perfect."
  // 4: Quote Line 2: "Not even Gojo Satoru."
  // 5: Progress indicator active
  const [stage, setStage] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);

  const TOTAL_DURATION_SECONDS = 20;
  const TOTAL_DURATION_MS = TOTAL_DURATION_SECONDS * 1000;

  // Generate deterministic subtle background particles
  const particles = useMemo(() => {
    return Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      x: (i * 37) % 100,
      y: (i * 47) % 100,
      size: 1.5 + ((i * 13) % 3),
      duration: 3 + ((i * 7) % 4),
      delay: ((i * 11) % 20) / 10,
      color: i % 3 === 0 ? '#60a5fa' : i % 3 === 1 ? '#f87171' : '#ffffff',
    }));
  }, []);

  useEffect(() => {
    // Cinematic entrance sequencing within first 1.8 seconds
    const t1 = setTimeout(() => setStage(1), 150);
    const t2 = setTimeout(() => setStage(2), 400);
    const t3 = setTimeout(() => setStage(3), 850);
    const t4 = setTimeout(() => setStage(4), 1300);
    const t5 = setTimeout(() => setStage(5), 1600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  // 20-Second Loading Progress Bar & Timer
  useEffect(() => {
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, (elapsed / TOTAL_DURATION_MS) * 100);
      const secs = Math.min(TOTAL_DURATION_SECONDS, Math.floor(elapsed / 1000));

      setProgress(Number(pct.toFixed(1)));
      setSecondsElapsed(secs);

      if (elapsed >= TOTAL_DURATION_MS) {
        clearInterval(interval);
        setProgress(100);
        setSecondsElapsed(TOTAL_DURATION_SECONDS);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [TOTAL_DURATION_MS, TOTAL_DURATION_SECONDS]);

  // When 20 seconds are up (progress = 100%), transition into the app
  useEffect(() => {
    if (progress >= 100) {
      const exitTimer = setTimeout(() => {
        onComplete();
      }, 500);
      return () => clearTimeout(exitTimer);
    }
  }, [progress, onComplete]);

  // Dynamic status text across the 20-second progression
  const getStatusText = (pct: number) => {
    if (pct < 18) return 'Initializing adaptive learning neural matrix…';
    if (pct < 38) return 'Calibrating Class 6–12 diagnostic benchmarks…';
    if (pct < 58) return 'Indexing verified Khan Academy & CrashCourse video lessons…';
    if (pct < 78) return 'Optimizing personalized 4-week timetable allocations…';
    if (pct < 95) return 'Preparing your custom roadmap and study streak…';
    return 'Preparation complete. Entering Your Way…';
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-between bg-[#030712] text-white overflow-y-auto px-4 py-6 sm:py-8 select-none"
    >
      {/* Ambient background glows matching Gojo's Red and Blue limitless energy */}
      <div className="absolute top-1/3 -left-28 w-96 h-96 rounded-full bg-red-600/15 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 -right-28 w-96 h-96 rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-indigo-500/15 blur-[100px] pointer-events-none" />

      {/* Floating soft starlight particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 0 }}
            animate={{
              opacity: [0.1, 0.65, 0.1],
              y: [-10, 10, -10],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              position: 'absolute',
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.color,
              borderRadius: '50%',
              boxShadow: `0 0 6px ${p.color}`,
            }}
          />
        ))}
      </div>

      {/* Top Header: Logo & Skip Option */}
      <div className="w-full max-w-4xl flex items-center justify-between z-10 relative">
        {/* Your Way Brand Logo */}
        <AnimatePresence>
          {stage >= 1 && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="flex items-center gap-2.5"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-700 p-0.5 shadow-lg shadow-indigo-500/30 flex items-center justify-center border border-white/20">
                <svg
                  viewBox="0 0 100 100"
                  className="w-4 h-4 text-white"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M 28 28 L 50 50 L 50 74"
                    stroke="white"
                    strokeWidth="9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M 72 28 L 50 50"
                    stroke="white"
                    strokeWidth="9"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 36 70 L 48 56 L 60 70 L 72 56"
                    stroke="#f59e0b"
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="50" cy="22" r="5" fill="#fbbf24" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-sm sm:text-base tracking-tight font-display bg-gradient-to-r from-white via-slate-100 to-blue-200 bg-clip-text text-transparent">
                  Your Way
                </span>
                <span className="text-[9px] font-semibold uppercase tracking-widest text-indigo-400">
                  Adaptive Learning
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Skip button with smooth hover */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.4 }}
          onClick={onComplete}
          className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-300 hover:text-white transition-all flex items-center gap-1.5 backdrop-blur-md cursor-pointer group"
          title="Skip intro and enter app"
        >
          <span>Skip</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
        </motion.button>
      </div>

      {/* Main Center Content: Gojo Satoru + Motivational Quote */}
      <div className="relative z-10 flex flex-col items-center text-center my-auto max-w-xl w-full">
        {/* Character Card / Artwork Showcase */}
        <AnimatePresence>
          {stage >= 2 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              className="relative mb-5 sm:mb-6 group"
            >
              {/* Outer soft ambient glow halos */}
              <div className="absolute -inset-1 bg-gradient-to-r from-red-500/25 via-indigo-500/30 to-blue-500/35 rounded-2xl sm:rounded-3xl blur-md opacity-75 group-hover:opacity-100 transition-opacity duration-700" />

              {/* Artwork Frame */}
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/15 bg-slate-950/80 shadow-2xl shadow-indigo-950/60 max-w-[320px] sm:max-w-[400px] md:max-w-[440px] w-full">
                <img
                  src={gojoImg}
                  alt="Gojo Satoru"
                  referrerPolicy="no-referrer"
                  className="w-full h-auto max-h-[34vh] sm:max-h-[38vh] object-contain block transition-transform duration-700 group-hover:scale-[1.01]"
                />
                {/* Subtle bottom vignette to blend seamlessly */}
                <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent pointer-events-none" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Motivational Quote Container */}
        <div className="min-h-[4.5rem] sm:min-h-[5rem] flex flex-col items-center justify-center px-2">
          {/* Quote Line 1 */}
          <AnimatePresence>
            {stage >= 3 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: 'easeOut' }}
              >
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display bg-gradient-to-r from-white via-slate-100 to-slate-200 bg-clip-text text-transparent drop-shadow-sm">
                  “No one is perfect.”
                </h2>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quote Line 2 */}
          <AnimatePresence>
            {stage >= 4 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: 'easeOut' }}
                className="mt-1 sm:mt-1.5"
              >
                <p className="text-sm sm:text-base font-medium tracking-wide text-blue-300/90 drop-shadow-sm flex items-center justify-center gap-1.5">
                  <span>“Not even Gojo Satoru.”</span>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Loading Indicator */}
      <div className="w-full max-w-sm flex flex-col items-center z-10 relative">
        <AnimatePresence>
          {stage >= 5 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="w-full flex flex-col items-center gap-3"
            >
              {/* Brand tag and percentage with 20s counter */}
              <div className="w-full flex items-center justify-between text-xs font-mono px-1">
                <span className="text-slate-400 font-medium tracking-wider uppercase text-[11px] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse shadow-[0_0_8px_#60a5fa]" />
                  YOUR WAY LOADING...
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-mono text-[11px]">
                    {secondsElapsed}s / 20s
                  </span>
                  <span className="text-indigo-300 font-bold text-[12px] bg-indigo-950/60 px-2 py-0.5 rounded-md border border-indigo-500/30">
                    {Math.floor(progress)}%
                  </span>
                </div>
              </div>

              {/* Progress Bar Track (20s Progress Indicator) */}
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/15 relative shadow-inner">
                <motion.div
                  style={{ width: `${progress}%` }}
                  className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-amber-400 rounded-full shadow-lg shadow-indigo-500/50 transition-all duration-100 ease-linear"
                />
              </div>

              {/* Dynamic 20s progress stage caption */}
              <p className="text-[12px] sm:text-xs text-slate-300/90 font-medium tracking-wide flex items-center gap-1.5 transition-all duration-300 text-center">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin flex-shrink-0" style={{ animationDuration: '3s' }} />
                <span className="truncate">{getStatusText(progress)}</span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

