import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sun, Moon, Sparkles, Check, ArrowRight, Shuffle } from 'lucide-react';
import { THEME_COLORS, ThemeColor, ThemeMode, applyTheme } from '../lib/theme';
import { YourWayLogo } from './YourWayLogo';

interface ThemePromptScreenProps {
  onConfirm?: (mode: ThemeMode, color: ThemeColor) => void;
  onComplete?: () => void;
  initialMode?: ThemeMode;
  initialColor?: ThemeColor;
}

export const ThemePromptScreen: React.FC<ThemePromptScreenProps> = ({
  onConfirm,
  onComplete,
  initialMode = 'light',
  initialColor = THEME_COLORS[0],
}) => {
  const [mode, setMode] = useState<ThemeMode>(initialMode);
  const [selectedColor, setSelectedColor] = useState<ThemeColor>(initialColor);
  const [activeTab, setActiveTab] = useState<string>('All');

  const categories = ['All', 'Indigos & Violets', 'Blues & Navies', 'Teals & Cyans', 'Limes & Greens', 'Golds & Yellows', 'Oranges & Ambers', 'Reds & Corals', 'Pinks & Magentas'];

  const filteredColors = activeTab === 'All'
    ? THEME_COLORS
    : THEME_COLORS.filter((c) => c.category === activeTab);

  const handlePickColor = (color: ThemeColor) => {
    setSelectedColor(color);
    applyTheme(mode, color);
  };

  const handleToggleMode = (newMode: ThemeMode) => {
    setMode(newMode);
    applyTheme(newMode, selectedColor);
  };

  const handleRandomize = () => {
    const randomColor = THEME_COLORS[Math.floor(Math.random() * THEME_COLORS.length)];
    const randomMode: ThemeMode = Math.random() > 0.5 ? 'dark' : 'light';
    setMode(randomMode);
    setSelectedColor(randomColor);
    applyTheme(randomMode, randomColor);
  };

  const handleProceed = () => {
    try {
      localStorage.setItem('your_way_theme_applied', 'true');
      localStorage.setItem('your_way_theme_configured', 'true');
      applyTheme(mode, selectedColor);
    } catch (e) {
      console.warn('Error saving theme:', e);
    }

    if (typeof onConfirm === 'function') {
      onConfirm(mode, selectedColor);
    }
    if (typeof onComplete === 'function') {
      onComplete();
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center p-4 overflow-y-auto transition-colors duration-500 ${
        mode === 'dark' ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'
      }`}
    >
      <div className="w-full max-w-2xl my-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={`rounded-3xl p-6 md:p-8 border shadow-2xl backdrop-blur-xl ${
            mode === 'dark'
              ? 'bg-slate-900/90 border-slate-800 shadow-black/40'
              : 'bg-white/95 border-slate-200/80 shadow-slate-200/60'
          }`}
        >
          {/* Header with Logo */}
          <div className="flex flex-col items-center text-center mb-6">
            <YourWayLogo size="lg" className="mb-4" />
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-2"
              style={{ backgroundColor: selectedColor.lightBg, color: selectedColor.darkText }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Step 1 of 2 • Appearance Setup
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Personalize Your Learning Environment
            </h1>
            <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 mt-1 max-w-md">
              Choose your interface mode and favorite study accent from 40 hand-tuned colors.
            </p>
          </div>

          {/* Mode Switch: Light vs Dark */}
          <div className="mb-6">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
              1. Choose Appearance Mode
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleToggleMode('light')}
                className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl border font-semibold text-sm transition-all ${
                  mode === 'light'
                    ? 'border-slate-900 bg-slate-900 text-white shadow-md'
                    : 'border-slate-200 bg-slate-100/70 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-300'
                }`}
              >
                <Sun className="w-4 h-4 text-amber-400" />
                <span>Light Mode</span>
                {mode === 'light' && <Check className="w-4 h-4 ml-1" />}
              </button>
              <button
                type="button"
                onClick={() => handleToggleMode('dark')}
                className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl border font-semibold text-sm transition-all ${
                  mode === 'dark'
                    ? 'border-white bg-white text-slate-950 shadow-md'
                    : 'border-slate-200 bg-slate-100/70 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-300'
                }`}
              >
                <Moon className="w-4 h-4 text-indigo-400" />
                <span>Dark Mode</span>
                {mode === 'dark' && <Check className="w-4 h-4 ml-1 text-slate-950" />}
              </button>
            </div>
          </div>

          {/* 40 Colors Selector */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                2. Choose Accent Color ({THEME_COLORS.length} Available)
              </label>
              <button
                type="button"
                onClick={handleRandomize}
                className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                title="Pick random style"
              >
                <Shuffle className="w-3.5 h-3.5" />
                Surprise Me
              </button>
            </div>

            {/* Category Filter Pills */}
            <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-none text-xs">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveTab(cat)}
                  className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
                    activeTab === cat
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* 40 Swatches Grid */}
            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 p-3 rounded-2xl bg-slate-100/60 dark:bg-slate-950/40 border border-slate-200/60 dark:border-slate-800/60 max-h-48 overflow-y-auto">
              {filteredColors.map((color) => {
                const isSelected = selectedColor.id === color.id;
                return (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => handlePickColor(color)}
                    title={`${color.name} (${color.category})`}
                    className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 focus:outline-none ${
                      isSelected ? 'ring-2 ring-offset-2 ring-slate-900 dark:ring-white scale-110' : ''
                    }`}
                    style={{ backgroundColor: color.hex }}
                  >
                    {isSelected && (
                      <Check className="w-4 h-4 text-white drop-shadow" strokeWidth={3} />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-xs mt-2 px-1 text-slate-500 dark:text-slate-400">
              <span>
                Selected: <strong className="text-slate-900 dark:text-white">{selectedColor.name}</strong> ({selectedColor.category})
              </span>
              <span className="font-mono">{selectedColor.hex}</span>
            </div>
          </div>

          {/* Live Preview Card */}
          <div
            className="rounded-2xl p-4 mb-6 border transition-all"
            style={{
              borderColor: selectedColor.hex,
              backgroundColor: mode === 'dark' ? '#0f172a' : '#f8fafc',
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: selectedColor.hex }}
                />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  Live Preview: Mathematics Class 9
                </span>
              </div>
              <span
                className="text-[11px] font-bold px-2 py-0.5 rounded-md"
                style={{ backgroundColor: selectedColor.lightBg, color: selectedColor.darkText }}
              >
                +150 XP Available
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden mb-2">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: '70%', backgroundColor: selectedColor.hex }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Chapter 2: Polynomials & Factorization</span>
              <span style={{ color: selectedColor.hex }} className="font-bold">
                70% Completed
              </span>
            </div>
          </div>

          {/* Confirm & Launch Action */}
          <div className="space-y-2">
            <button
              id="apply-theme-prompt-btn"
              type="button"
              onClick={handleProceed}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl text-white font-bold shadow-lg transition-transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              style={{ backgroundColor: selectedColor.hex }}
            >
              <span>Apply Theme & Launch Your Way</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={handleProceed}
              className="w-full text-center py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Continue with default theme
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
