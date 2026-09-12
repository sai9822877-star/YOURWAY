import React, { useEffect, useRef, useState } from 'react';
import { ShieldAlert, RotateCcw, Award, CheckCircle2, Lock, Play, Pause, AlertCircle, HelpCircle } from 'lucide-react';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface StrictYouTubePlayerProps {
  videoId: string;
  title: string;
  onVideoEnd?: () => void;
  onProgressUpdate?: (percent: number, seconds: number) => void;
}

export const StrictYouTubePlayer: React.FC<StrictYouTubePlayerProps> = ({
  videoId,
  title,
  onVideoEnd,
  onProgressUpdate,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const intervalRef = useRef<any>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [maxWatchedTime, setMaxWatchedTime] = useState<number>(0);
  const [watchPercentage, setWatchPercentage] = useState<number>(0);
  const [forwardAlert, setForwardAlert] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [playerReady, setPlayerReady] = useState<boolean>(false);

  // Unique element ID for YouTube iframe mounting
  const playerId = useRef(`yt_player_${Math.random().toString(36).substring(2, 9)}`).current;

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Load YouTube IFrame API script once if not present
  useEffect(() => {
    if (!window.YT || !window.YT.Player) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    }

    let isMounted = true;

    const initPlayer = () => {
      if (!isMounted || !document.getElementById(playerId)) return;

      try {
        if (playerRef.current) {
          playerRef.current.destroy?.();
        }

        playerRef.current = new window.YT.Player(playerId, {
          videoId,
          playerVars: {
            rel: 0,
            modestbranding: 1,
            controls: 1,
            disablekb: 0,
            fs: 1,
            iv_load_policy: 3,
            origin: window.location.origin,
          },
          events: {
            onReady: (event: any) => {
              if (!isMounted) return;
              setPlayerReady(true);
              const dur = event.target.getDuration();
              if (dur && dur > 0) {
                setDuration(dur);
              }
            },
            onStateChange: (event: any) => {
              if (!isMounted) return;
              if (event.data === window.YT.PlayerState.PLAYING) {
                setIsPlaying(true);
                const dur = playerRef.current?.getDuration?.();
                if (dur && dur > 0) setDuration(dur);
              } else if (event.data === window.YT.PlayerState.PAUSED) {
                setIsPlaying(false);
              } else if (event.data === window.YT.PlayerState.ENDED) {
                setIsPlaying(false);
                setIsCompleted(true);
                setWatchPercentage(100);
                if (onVideoEnd) onVideoEnd();
              }
            },
          },
        });
      } catch (err) {
        console.warn('Error initializing YouTube Player API:', err);
      }
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prevCallback) prevCallback();
        initPlayer();
      };
    }

    return () => {
      isMounted = false;
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (playerRef.current?.destroy) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          // ignore cleanup error
        }
      }
    };
  }, [videoId, playerId]);

  // Enforce Anti-Forwarding & update progress every 400ms
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (!playerRef.current || !playerRef.current.getCurrentTime) return;

      try {
        const time = playerRef.current.getCurrentTime();
        const dur = playerRef.current.getDuration() || duration;
        if (dur > 0 && dur !== duration) {
          setDuration(dur);
        }

        if (typeof time === 'number' && time >= 0) {
          setCurrentTime(time);

          // 1. Anti-Forwarding Check:
          // If student jumped ahead by more than 2.5 seconds past their maximum legitimate watch mark:
          if (time > maxWatchedTime + 2.5) {
            // Intercept and snap back to the allowed watched timestamp!
            playerRef.current.seekTo(maxWatchedTime, true);
            setForwardAlert('🔒 Fast-forwarding is locked for focused learning! Watch sequentially to unlock the video.');
            setTimeout(() => setForwardAlert(null), 4000);
          } else {
            // Valid forward progress made by watching naturally
            const newMax = Math.max(maxWatchedTime, time);
            setMaxWatchedTime(newMax);

            if (dur > 0) {
              const pct = Math.min(100, Math.round((newMax / dur) * 100));
              setWatchPercentage(pct);
              if (onProgressUpdate) onProgressUpdate(pct, newMax);

              // Auto-trigger completion if reached 98%+
              if (pct >= 98 && !isCompleted) {
                setIsCompleted(true);
                if (onVideoEnd) onVideoEnd();
              }
            }
          }
        }
      } catch (e) {
        // Player might be re-buffering
      }
    }, 400);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [maxWatchedTime, duration, isCompleted, onProgressUpdate, onVideoEnd]);

  // Rewind helper (Rewinding is always permitted!)
  const handleRewind = (seconds: number) => {
    if (playerRef.current?.seekTo && currentTime > 0) {
      const target = Math.max(0, currentTime - seconds);
      playerRef.current.seekTo(target, true);
    }
  };

  return (
    <div className="flex flex-col w-full bg-slate-950 text-white rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
      {/* Top Status Bar: Sequential Watching Notice */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            <Lock className="w-3 h-3" />
            Anti-Skip Protection Active
          </span>
          <span className="hidden sm:inline text-slate-400">
            Forwarding disabled • Rewind permitted
          </span>
        </div>

        {/* Watch Percentage Badge */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-mono text-[11px]">
            {formatTime(currentTime)} / {formatTime(duration || 0)}
          </span>
          <span
            className="font-bold px-2.5 py-1 rounded-md text-xs transition-colors"
            style={{
              backgroundColor: watchPercentage >= 98 ? '#10b981' : 'var(--primary-hex, #6366f1)',
              color: '#ffffff',
            }}
          >
            {watchPercentage}% Watched
          </span>
        </div>
      </div>

      {/* Video Frame Mount */}
      <div className="relative w-full aspect-video bg-black flex items-center justify-center">
        <div id={playerId} className="w-full h-full" />

        {/* Alert Banner when student tries to scrub forward */}
        {forwardAlert && (
          <div className="absolute top-4 left-4 right-4 z-30 p-3 bg-red-600/95 text-white rounded-xl shadow-xl flex items-center gap-3 backdrop-blur-md animate-bounce">
            <ShieldAlert className="w-5 h-5 flex-shrink-0 text-white" />
            <div className="text-xs sm:text-sm font-medium leading-tight">
              {forwardAlert}
            </div>
          </div>
        )}

        {/* Video End Completion Overlay Banner */}
        {isCompleted && (
          <div className="absolute inset-0 z-20 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-400 mb-3 shadow-lg">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-1">
              Lecture Completed! (100% Watched)
            </h3>
            <p className="text-xs text-slate-300 max-w-sm mb-4">
              Great focus! Now check your understanding of this chapter's key topics to clear any doubts.
            </p>
            {onVideoEnd && (
              <button
                type="button"
                onClick={onVideoEnd}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white shadow-lg transition-transform active:scale-95"
                style={{ backgroundColor: 'var(--primary-hex, #6366f1)' }}
              >
                <HelpCircle className="w-4 h-4" />
                Diagnose Chapter Doubts (MCQ)
              </button>
            )}
          </div>
        )}
      </div>

      {/* Custom Progress Bar & Rewind Controls */}
      <div className="p-3.5 bg-slate-900/90 border-t border-slate-800 flex flex-col gap-2.5">
        {/* Visual Progress Track */}
        <div className="relative w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
          {/* Watched progress fill */}
          <div
            className="h-full rounded-full transition-all duration-300 relative"
            style={{
              width: `${watchPercentage}%`,
              backgroundColor: 'var(--primary-hex, #6366f1)',
            }}
          >
            <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/40 rounded-full animate-pulse" />
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleRewind(10)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors font-medium"
              title="Rewind 10 seconds to review previous concept"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Rewind 10s</span>
            </button>

            <button
              type="button"
              onClick={() => handleRewind(30)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors font-medium"
              title="Rewind 30 seconds"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Rewind 30s</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick trigger for doubt diagnosis if student has watched most of the video */}
            {onVideoEnd && (
              <button
                type="button"
                onClick={onVideoEnd}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-xs border border-indigo-500/40 text-indigo-300 hover:bg-indigo-900/30 transition-colors"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Chapter Doubts</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
