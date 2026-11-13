import React from 'react';
import { Sun, Moon, Laptop } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export function ThemeToggle({ size = 'md', className = '' }) {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  return (
    <button
      onClick={cycleTheme}
      type="button"
      className={`p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:outline-orange-600 ${className}`}
      title={`Current theme: ${theme}. Click to switch.`}
      aria-label="Toggle theme mode"
    >
      {theme === 'light' && <Sun className={size === 'sm' ? 'w-4 h-4' : 'w-4.5 h-4.5'} />}
      {theme === 'dark' && <Moon className={size === 'sm' ? 'w-4 h-4' : 'w-4.5 h-4.5'} />}
      {theme === 'system' && <Laptop className={size === 'sm' ? 'w-4 h-4' : 'w-4.5 h-4.5'} />}
    </button>
  );
}

export default ThemeToggle;
