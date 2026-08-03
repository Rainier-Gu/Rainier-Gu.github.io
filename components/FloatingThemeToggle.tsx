"use client";

import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export default function FloatingThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="fixed bottom-6 left-4 z-[9999] flex h-12 w-12 items-center justify-center rounded-full border border-white/50 bg-white/75 text-slate-700 shadow-2xl shadow-slate-900/10 backdrop-blur-2xl transition-all duration-500 hover:-translate-y-1 hover:scale-105 hover:bg-indigo-500 hover:text-white active:scale-95 dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-100 dark:shadow-black/40 sm:left-6"
      title={isDark ? '切换到日间模式' : '切换到夜间模式'}
      aria-label={isDark ? '切换到日间模式' : '切换到夜间模式'}
    >
      <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500/15 via-transparent to-amber-300/20 opacity-80" />
      <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white/70 shadow-inner dark:bg-white/10">
        {isDark ? (
          <Moon size={18} className="transition-transform duration-500" />
        ) : (
          <Sun size={19} className="text-amber-500 transition-transform duration-500" />
        )}
      </span>
    </button>
  );
}
