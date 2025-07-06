import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  const [currentTextColors, setCurrentTextColors] = useState({
    primary: '#333333', // Default light mode primary
    secondary: '#666666', // Default light mode secondary
  });

  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark-mode' : '';
    localStorage.setItem('theme', theme);

    // Atualiza as cores de texto com base no tema ativo
    const rootStyles = getComputedStyle(document.documentElement);
    const primaryColor = rootStyles.getPropertyValue('--text-color-primary').trim();
    const secondaryColor = rootStyles.getPropertyValue('--text-color-secondary').trim();
    setCurrentTextColors({
      primary: primaryColor,
      secondary: secondaryColor,
    });
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const value = {
    theme,
    toggleTheme,
    textColorPrimary: currentTextColors.primary,
    textColorSecondary: currentTextColors.secondary,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}