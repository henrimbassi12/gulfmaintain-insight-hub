
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

export function ThemeToggle() {
  const { theme, setTheme, t } = useTheme();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="flex items-center gap-2"
    >
      {theme === 'light' ? (
        <>
          <Moon className="w-4 h-4" />
          {t('darkMode')}
        </>
      ) : (
        <>
          <Sun className="w-4 h-4" />
          {t('lightMode')}
        </>
      )}
    </Button>
  );
}
