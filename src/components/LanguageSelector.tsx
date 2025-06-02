
import React from 'react';
import { Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTheme } from '@/contexts/ThemeContext';

export function LanguageSelector() {
  const { language, setLanguage, t } = useTheme();

  return (
    <div className="flex items-center gap-2">
      <Languages className="w-4 h-4 text-gray-500" />
      <Select value={language} onValueChange={(value: 'fr' | 'en') => setLanguage(value)}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder={t('language')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="fr">{t('french')}</SelectItem>
          <SelectItem value="en">{t('english')}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
