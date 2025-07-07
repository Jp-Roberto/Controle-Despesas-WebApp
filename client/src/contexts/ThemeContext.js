import React, { createContext, useContext } from 'react';

const ThemeContext = createContext();

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }) {
  const value = {
    theme: 'light',
    textColorPrimary: '#333333',
    textColorSecondary: '#666666',
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}