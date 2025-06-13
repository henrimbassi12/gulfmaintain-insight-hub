
import React, { createContext, useContext } from 'react';

interface ThemeContextType {
  t: (key: string) => string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Dictionnaire de traductions en français uniquement
const translations = {
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
  profile: 'Profil utilisateur',
  notifications: 'Notifications',
  systemPreferences: 'Préférences système',
  security: 'Sécurité',
  settingsDescription: 'Configuration de votre compte et préférences',
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
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const t = (key: string): string => {
    return translations[key as keyof typeof translations] || key;
  };

  return (
    <ThemeContext.Provider value={{ t }}>
      <div className="min-h-screen bg-gray-50 text-gray-900">
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
