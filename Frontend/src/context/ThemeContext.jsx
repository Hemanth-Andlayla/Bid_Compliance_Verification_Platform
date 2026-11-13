import React, {
  createContext,
  useContext,
  useEffect,
  useState
} from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'system';
  });

  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains('dark');
  });

  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = (resolvedTheme) => {
      const dark = resolvedTheme === 'dark';

      if (dark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }

      setIsDark(dark);
    };

    if (theme === 'system') {
      const mediaQuery = window.matchMedia(
        '(prefers-color-scheme: dark)'
      );

      applyTheme(
        mediaQuery.matches ? 'dark' : 'light'
      );

      const handler = (event) => {
        applyTheme(
          event.matches ? 'dark' : 'light'
        );
      };

      mediaQuery.addEventListener(
        'change',
        handler
      );

      return () => {
        mediaQuery.removeEventListener(
          'change',
          handler
        );
      };
    }

    applyTheme(theme);

    localStorage.setItem('theme', theme);
  }, [theme]);

  const value = {
    theme,
    setTheme,
    isDark
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      'useTheme must be used within a ThemeProvider'
    );
  }

  return context;
}