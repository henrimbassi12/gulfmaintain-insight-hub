
import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';
type Language = 'fr' | 'en';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Dictionnaire de traductions
const translations = {
  fr: {
    dashboard: 'Tableau de bord',
    equipments: 'Équipements',
    maintenance: 'Maintenance',
    messages: 'Messages',
    supervision: 'Supervision',
    reports: 'Rapports',
    settings: 'Paramètres',
    darkMode: 'Mode sombre',
    lightMode: 'Mode clair',
    language: 'Langue',
    french: 'Français',
    english: 'Anglais',
    appearance: 'Apparence',
    theme: 'Thème',
    save: 'Sauvegarder',
    cancel: 'Annuler',
    profile: 'Profil utilisateur',
    notifications: 'Notifications',
    systemPreferences: 'Préférences système',
    security: 'Sécurité',
    settingsDescription: 'Configuration de votre compte et préférences',
    themeDescription: 'Choisir le thème de l\'interface',
    languageDescription: 'Sélectionner la langue de l\'application'
  },
  en: {
    dashboard: 'Dashboard',
    equipments: 'Equipment',
    maintenance: 'Maintenance',
    messages: 'Messages',
    supervision: 'Supervision',
    reports: 'Reports',
    settings: 'Settings',
    darkMode: 'Dark mode',
    lightMode: 'Light mode',
    language: 'Language',
    french: 'French',
    english: 'English',
    appearance: 'Appearance',
    theme: 'Theme',
    save: 'Save',
    cancel: 'Cancel',
    profile: 'User profile',
    notifications: 'Notifications',
    systemPreferences: 'System preferences',
    security: 'Security',
    settingsDescription: 'Configure your account and preferences',
    themeDescription: 'Choose interface theme',
    languageDescription: 'Select application language'
  }
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as Theme) || 'light';
  });

  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'fr';
  });

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, language, setLanguage, t }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
