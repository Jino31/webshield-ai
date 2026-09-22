import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle({ showLabel = false, className = '' }) {
  const { theme, isDark, toggleTheme } = useTheme();

  const tooltipText = isDark ? 'Turn on the lights' : 'Turn off the lights';
  const ariaLabel = isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`gfg-theme-btn group flex items-center justify-center gap-2 p-2 rounded-xl transition-all duration-300 cursor-pointer border ${isDark
          ? 'bg-[#13111C] hover:bg-[#1A1528] border-[#231E33] hover:border-amber-400/50 text-amber-400 shadow-sm hover:shadow-amber-500/10'
          : 'bg-white hover:bg-slate-100 border-slate-200 hover:border-purple-400 text-slate-700 shadow-sm hover:shadow-purple-500/10'
        } ${className}`}
      title={tooltipText}
      aria-label={ariaLabel}
    >
      {/* GeeksforGeeks standard icon structure matching <i class="gfg-icon gfg-icon_dark-mode"></i> */}
      <i
        className={`gfg-icon gfg-icon_dark-mode ${isDark ? 'gfg-icon_light-mode' : ''} inline-flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-active:rotate-45`}
        aria-hidden="true"
      >
        {isDark ? (
          /* Radiant Sun Icon (shown in Dark Mode to switch to Light Mode) */
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5 text-amber-400"
          >
            <circle cx="12" cy="12" r="4" fill="currentColor" fillOpacity="0.25" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="m4.93 4.93 1.41 1.41" />
            <path d="m17.66 17.66 1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="m6.34 17.66-1.41 1.41" />
            <path d="m19.07 4.93-1.41 1.41" />
          </svg>
        ) : (
          /* Crescent Moon with Celestial Spark Icon (shown in Light Mode to switch to Dark Mode) */
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5 text-slate-700"
          >
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" fill="currentColor" fillOpacity="0.15" />
            <path d="M19 3v4" stroke="#8B5CF6" strokeWidth="1.5" />
            <path d="M21 5h-4" stroke="#8B5CF6" strokeWidth="1.5" />
          </svg>
        )}
      </i>

      {showLabel && (
        <span className="text-xs font-semibold tracking-wide select-none">
          {isDark ? 'Dark Mode' : 'Light Mode'}
        </span>
      )}
    </button>
  );
}
