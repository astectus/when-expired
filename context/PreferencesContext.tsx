import React, { createContext, useState, useContext } from 'react';

export type PreferencesContextType = {
  isThemeDark: boolean;
  toggleTheme: () => void;
};

export const PreferencesContext = createContext<PreferencesContextType>({
  isThemeDark: false,
  toggleTheme: () => {},
});

export const PreferencesProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [isThemeDark, setIsThemeDark] = useState(false);

  const toggleTheme = () => {
    setIsThemeDark(!isThemeDark);
  };

  const preferences = {
    isThemeDark,
    toggleTheme,
  };

  return (
    <PreferencesContext.Provider value={preferences}>
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => useContext(PreferencesContext);
