import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeMode = 'v1' | 'v2';

interface ThemeContextType {
  themeMode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>('v1');

  useEffect(() => {
    const saved = localStorage.getItem('themeMode') as ThemeMode;
    if (saved === 'v2') {
      setThemeMode('v2');
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setThemeMode(prev => {
      const newValue: ThemeMode = prev === 'v1' ? 'v2' : 'v1';
      if (newValue === 'v2') {
        document.documentElement.classList.add('dark');
        localStorage.setItem('themeMode', 'v2');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('themeMode', 'v1');
      }
      return newValue;
    });
  };

  return (
    <ThemeContext.Provider value={{ themeMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

