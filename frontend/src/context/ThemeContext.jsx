import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Initialize theme from localStorage or system preference, default to 'dark'
  const [theme, setThemeState] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('webshield_theme') || localStorage.getItem('theme');
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
      }
      return 'dark';
    } catch {
      return 'dark';
    }
  });

  // Apply theme class and data-theme to HTML root and body
  useEffect(() => {
    try {
      const root = document.documentElement;
      const body = document.body;
      root.setAttribute('data-theme', theme);
      if (body) body.setAttribute('data-theme', theme);

      if (theme === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
        if (body) {
          body.classList.add('dark');
          body.classList.remove('light');
        }
      } else {
        root.classList.add('light');
        root.classList.remove('dark');
        if (body) {
          body.classList.add('light');
          body.classList.remove('dark');
        }
      }
      localStorage.setItem('webshield_theme', theme);
      localStorage.setItem('theme', theme);
    } catch (err) {
      console.error('Failed to update theme in document:', err);
    }
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setTheme = (newTheme) => {
    if (newTheme === 'dark' || newTheme === 'light') {
      setThemeState(newTheme);
    }
  };

  const isDark = theme === 'dark';

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
