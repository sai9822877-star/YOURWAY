import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Home } from 'lucide-react';

interface BottomCornerBackButtonProps {
  isVisible: boolean;
  onBack: () => void;
  label?: string;
  className?: string;
}

export const BottomCornerBackButton: React.FC<BottomCornerBackButtonProps> = ({
  isVisible,
  onBack,
  label = 'Back to Dashboard',
  className = '',
}) => {
  // Support Escape key to navigate back
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVisible) {
        // Only trigger if no active input or textarea
        const active = document.activeElement;
        const isInput = active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement;
        if (!isInput) {
          onBack();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, onBack]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 15 }}
          transition={{ duration: 0.2 }}
          className={`fixed bottom-20 sm:bottom-6 left-4 sm:left-6 z-40 print:hidden ${className}`}
        >
          <button
            id="global-bottom-corner-back-btn"
            type="button"
            onClick={onBack}
            className="group flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-100 border border-slate-200/90 dark:border-slate-800 shadow-xl backdrop-blur-md hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title="Return to previous screen (or press Esc)"
          >
            <div className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors">
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-black tracking-tight">{label}</span>
              <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">Press Esc</span>
            </div>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
