import { useState, useEffect } from 'react';

const LS_KEY = 'vibes-theme';

export function useTheme() {
  const [theme, setTheme] = useState(() => localStorage.getItem(LS_KEY) || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(LS_KEY, theme);
  }, [theme]);

  const toggle = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  return { theme, toggle };
}
