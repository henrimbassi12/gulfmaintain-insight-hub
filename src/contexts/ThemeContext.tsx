
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

// Dictionnaire de traductions étendu
const translations = {
  fr: {
    dashboard: 'Tableau de bord',
    equipments: 'Équipements',
    maintenance: 'Maintenance',
    messages: 'Messages',
    supervision: 'Supervision',
    reports: 'Rapports',
    settings: 'Paramètres',
    geolocation: 'Géolocalisation',
    calendar: 'Planning',
    history: 'Historique',
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
    languageDescription: 'Sélectionner la langue de l\'application',
    refresh: 'Actualiser',
    search: 'Rechercher',
    filter: 'Filtrer',
    export: 'Exporter',
    import: 'Importer',
    delete: 'Supprimer',
    edit: 'Modifier',
    view: 'Voir',
    add: 'Ajouter',
    create: 'Créer',
    close: 'Fermer',
    open: 'Ouvrir',
    loading: 'Chargement...',
    error: 'Erreur',
    success: 'Succès',
    warning: 'Attention',
    info: 'Information'
  },
  en: {
    dashboard: 'Dashboard',
    equipments: 'Equipment',
    maintenance: 'Maintenance',
    messages: 'Messages',
    supervision: 'Supervision',
    reports: 'Reports',
    settings: 'Settings',
    geolocation: 'Geolocation',
    calendar: 'Calendar',
    history: 'History',
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
    languageDescription: 'Select application language',
    refresh: 'Refresh',
    search: 'Search',
    filter: 'Filter',
    export: 'Export',
    import: 'Import',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
    add: 'Add',
    create: 'Create',
    close: 'Close',
    open: 'Open',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    warning: 'Warning',
    info: 'Information'
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
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  useEffect(() => {
    localStorage.setItem('theme', theme);
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, language, setLanguage, t }}>
      <div className={`min-h-screen transition-colors duration-300 ${
        theme === 'dark' 
          ? 'dark bg-gray-900 text-gray-100' 
          : 'bg-gray-50 text-gray-900'
      }`}>
        {children}
      </div>
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
