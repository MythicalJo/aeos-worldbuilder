import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppAccent } from '../types';

export type AppTheme = 'dark' | 'light' | 'sepia';

interface ThemeContextType {
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  accent: AppAccent;
  setAccent: (accent: AppAccent) => void;
  getAccentClasses: () => {
    text: string;
    bg: string;
    border: string;
    hoverBg: string;
    ring: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ACCENT_COLORS: Array<{ id: AppAccent; label: string; hex: string }> = [
  { id: 'indigo', label: 'Indigo', hex: '#6366f1' },
  { id: 'amber', label: 'Amber', hex: '#f59e0b' },
  { id: 'emerald', label: 'Emerald', hex: '#10b981' },
  { id: 'rose', label: 'Rose', hex: '#f43f5e' },
  { id: 'sky', label: 'Sky', hex: '#06b6d4' },
  { id: 'violet', label: 'Violet', hex: '#8b5cf6' }
];

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<AppTheme>(() => {
    const saved = localStorage.getItem('lorecraft_theme');
    return (saved as AppTheme) || 'dark';
  });

  const [accent, setAccentState] = useState<AppAccent>(() => {
    const saved = localStorage.getItem('lorecraft_accent');
    return (saved as AppAccent) || 'indigo';
  });

  useEffect(() => {
    localStorage.setItem('lorecraft_theme', theme);
    const root = document.documentElement;
    root.classList.remove('theme-dark', 'theme-light', 'theme-sepia');
    root.classList.add(`theme-${theme}`);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('lorecraft_accent', accent);
  }, [accent]);

  const setTheme = (t: AppTheme) => setThemeState(t);
  const setAccent = (a: AppAccent) => setAccentState(a);

  const getAccentClasses = () => {
    switch (accent) {
      case 'amber':
        return {
          text: 'text-amber-500',
          bg: 'bg-amber-600 text-white',
          border: 'border-amber-500',
          hoverBg: 'hover:bg-amber-600',
          ring: 'ring-amber-500'
        };
      case 'emerald':
        return {
          text: 'text-emerald-500',
          bg: 'bg-emerald-600 text-white',
          border: 'border-emerald-500',
          hoverBg: 'hover:bg-emerald-600',
          ring: 'ring-emerald-500'
        };
      case 'rose':
        return {
          text: 'text-rose-500',
          bg: 'bg-rose-600 text-white',
          border: 'border-rose-500',
          hoverBg: 'hover:bg-rose-600',
          ring: 'ring-rose-500'
        };
      case 'sky':
        return {
          text: 'text-sky-500',
          bg: 'bg-sky-600 text-white',
          border: 'border-sky-500',
          hoverBg: 'hover:bg-sky-600',
          ring: 'ring-sky-500'
        };
      case 'violet':
        return {
          text: 'text-violet-500',
          bg: 'bg-violet-600 text-white',
          border: 'border-violet-500',
          hoverBg: 'hover:bg-violet-600',
          ring: 'ring-violet-500'
        };
      case 'indigo':
      default:
        return {
          text: 'text-indigo-500',
          bg: 'bg-indigo-600 text-white',
          border: 'border-indigo-500',
          hoverBg: 'hover:bg-indigo-600',
          ring: 'ring-indigo-500'
        };
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, accent, setAccent, getAccentClasses }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
