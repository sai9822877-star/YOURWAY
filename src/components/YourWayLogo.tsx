import React from 'react';

interface YourWayLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showText?: boolean;
  className?: string;
  themeAdaptive?: boolean;
  monochrome?: boolean;
}

export const YourWayLogo: React.FC<YourWayLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  themeAdaptive = true,
  monochrome = false,
}) => {
  const sizeMap = {
    sm: { box: 'w-7 h-7', svg: 'w-4 h-4', text: 'text-base', sub: 'text-[9px]' },
    md: { box: 'w-9 h-9', svg: 'w-5 h-5', text: 'text-lg', sub: 'text-[10px]' },
    lg: { box: 'w-12 h-12', svg: 'w-7 h-7', text: 'text-2xl', sub: 'text-xs' },
    xl: { box: 'w-16 h-16', svg: 'w-9 h-9', text: 'text-3xl', sub: 'text-sm' },
    '2xl': { box: 'w-24 h-24', svg: 'w-16 h-16', text: 'text-4xl', sub: 'text-base' },
  };

  const current = sizeMap[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Pedestrian Crossing Emblem matching Your Way logo specifications */}
      <div
        className={`${current.box} rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center relative overflow-hidden flex-shrink-0 group hover:shadow-md transition-all duration-300 dark:bg-slate-900 dark:border-slate-800`}
        title="Your Way — Learn at your own pace"
      >
        <svg
          viewBox="0 0 100 100"
          className={`${current.svg} ${monochrome ? 'text-slate-900 dark:text-white' : themeAdaptive ? 'text-slate-900 dark:text-white' : 'text-slate-900'}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Head */}
          <circle cx="52" cy="27" r="5" fill="currentColor" />

          {/* Pedestrian Torso & Limbs in forward walking motion */}
          {/* Rear arm */}
          <path
            d="M 50 35 L 41 42 L 38 48"
            stroke="currentColor"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Torso */}
          <path
            d="M 51 34 L 48 49"
            stroke="currentColor"
            strokeWidth="5.5"
            strokeLinecap="round"
          />

          {/* Forward swinging arm */}
          <path
            d="M 51 35 L 59 42 L 56 49"
            stroke="currentColor"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Back trailing leg */}
          <path
            d="M 48 49 L 40 60 L 37 66"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Front stepping leg bent at knee landing forward */}
          <path
            d="M 48 49 L 57 59 L 53 69"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 5 Zebra Crossing Perspective Stripes across the ground */}
          <path d="M 23 72 L 31 72 L 23 83 L 14 83 Z" fill="currentColor" />
          <path d="M 35 72 L 43 72 L 37 83 L 28 83 Z" fill="currentColor" />
          <path d="M 47 72 L 55 72 L 51 83 L 42 83 Z" fill="currentColor" />
          <path d="M 59 72 L 67 72 L 65 83 L 56 83 Z" fill="currentColor" />
          <path d="M 71 72 L 79 72 L 79 83 L 70 83 Z" fill="currentColor" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5">
            <span className={`font-black tracking-tight text-slate-900 dark:text-white font-display ${current.text}`}>
              Your Way
            </span>
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: 'var(--primary-hex, #6366f1)' }}
            />
          </div>
          <span
            className={`font-semibold uppercase tracking-wider font-sans ${current.sub}`}
            style={{ color: 'var(--primary-hex, #6366f1)' }}
          >
            Learn your way
          </span>
        </div>
      )}
    </div>
  );
};
