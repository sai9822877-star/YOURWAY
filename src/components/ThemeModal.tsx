import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sun, Moon, Sparkles, Check, Palette, Shuffle, ArrowRight } from 'lucide-react';
import { THEME_COLORS, ThemeColor, ThemeMode, applyTheme, getSavedTheme } from '../lib/theme';

interface ThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMode?: ThemeMode;
  currentColor?: ThemeColor;
  onThemeChange?: (mode: ThemeMode, color: ThemeColor) => void;
}

export const ThemeModal: React.FC<ThemeModalProps> = ({
  isOpen,
  onClose,
  currentMode,
  currentColor,
  onThemeChange,
}) => {
  const saved = getSavedTheme();
  const [mode, setMode] = useState<ThemeMode>(currentMode || saved.mode);
  const [selectedColor, setSelectedColor] = useState<ThemeColor>(currentColor || saved.color);
  const [activeTab, setActiveTab] = useState<string>('All');

  useEffect(() => {
    if (isOpen) {
      const current = getSavedTheme();
      setMode(currentMode || current.mode);
      setSelectedColor(currentColor || current.color);
    }
  }, [isOpen, currentMode, currentColor]);

  const categories = ['All', 'Indigos & Violets', 'Blues & Navies', 'Teals & Cyans', 'Limes & Greens', 'Golds & Yellows', 'Oranges & Ambers', 'Reds & Corals', 'Pinks & Magentas'];

  const filteredColors = activeTab === 'All'
    ? THEME_COLORS
    : THEME_COLORS.filter((c) => c.category === activeTab);

  const handlePickColor = (color: ThemeColor) => {
    setSelectedColor(color);
    applyTheme(mode, color);
    if (onThemeChange) onThemeChange(mode, color);
  };

  const handleToggleMode = (newMode: ThemeMode) => {
    setMode(newMode);
    applyTheme(newMode, selectedColor);
    if (onThemeChange) onThemeChange(newMode, selectedColor);
  };

  const handleRandomize = () => {
    const randomColor = THEME_COLORS[Math.floor(Math.random() * THEME_COLORS.length)];
    const randomMode: ThemeMode = Math.random() > 0.5 ? 'dark' : 'light';
    setMode(randomMode);
    setSelectedColor(randomColor);
    applyTheme(randomMode, randomColor);
    if (onThemeChange) onThemeChange(randomMode, randomColor);
  };

  const handleApplyAndClose = () => {
    try {
      localStorage.setItem('your_way_theme_applied', 'true');
      localStorage.setItem('your_way_theme_configured', 'true');
      applyTheme(mode, selectedColor);
    } catch (e) {
      console.warn('Error saving theme:', e);
    }
    if (onThemeChange) {
      onThemeChange(mode, selectedColor);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-7 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white"
                style={{ backgroundColor: selectedColor.hex }}
              >
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Theme & Accent Studio
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select Light/Dark mode and any of the 40 distinct study themes
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

          {/* Mode Switch */}
          <div className="my-5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Appearance Mode
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleToggleMode('light')}
                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-sm font-semibold transition-all ${
                  mode === 'light'
                    ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-300'
                }`}
              >
                <Sun className="w-4 h-4 text-amber-400" />
                <span>Light</span>
              </button>
              <button
                type="button"
                onClick={() => handleToggleMode('dark')}
                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-sm font-semibold transition-all ${
                  mode === 'dark'
                    ? 'border-white bg-white text-slate-900 shadow-sm'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-300'
                }`}
              >
                <Moon className="w-4 h-4 text-indigo-400" />
                <span>Dark</span>
              </button>
            </div>
          </div>

          {/* 40 Colors */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                40 Curated Theme Colors
              </label>
              <button
                type="button"
                onClick={handleRandomize}
                className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              >
                <Shuffle className="w-3 h-3" />
                Randomize
              </button>
            </div>

            {/* Category tabs */}
            <div className="flex gap-1.5 overflow-x-auto pb-2 mb-2 scrollbar-none text-[11px]">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveTab(cat)}
                  className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-colors ${
                    activeTab === cat
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Palette grid */}
            <div className="grid grid-cols-5 sm:grid-cols-8 gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/60 max-h-40 overflow-y-auto">
              {filteredColors.map((color) => {
                const isSelected = selectedColor.id === color.id;
                return (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => handlePickColor(color)}
                    title={`${color.name} (${color.category})`}
                    className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      isSelected ? 'ring-2 ring-offset-2 ring-slate-900 dark:ring-white scale-110' : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: color.hex }}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-white drop-shadow" strokeWidth={3} />}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-xs mt-2 px-1 text-slate-500 dark:text-slate-400">
              <span>
                Active: <strong className="text-slate-900 dark:text-white">{selectedColor.name}</strong>
              </span>
              <span className="font-mono text-[11px]">{selectedColor.hex}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>

            <button
              id="apply-theme-modal-btn"
              type="button"
              onClick={handleApplyAndClose}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-bold text-sm shadow-md transition-transform active:scale-95 cursor-pointer hover:opacity-95"
              style={{ backgroundColor: selectedColor.hex }}
            >
              <span>Apply Theme & Save</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
