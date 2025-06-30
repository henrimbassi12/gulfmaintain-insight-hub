
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Bell } from 'lucide-react';
import { NotificationSettings } from '@/components/NotificationSettings';

interface NotificationSectionProps {
  emailNotifications: boolean;
  setEmailNotifications: (value: boolean) => void;
}

export function NotificationSection({
  emailNotifications,
  setEmailNotifications
}: NotificationSectionProps) {
  return (
    <Card className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700">
        <CardTitle className="flex items-center gap-3 text-lg text-gray-900 dark:text-white">
          <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
            <Bell className="w-5 h-5 text-white" />
          </div>
          Paramètres de notification
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <NotificationSettings onTogglePush={(enabled) => {
            console.log('Notifications push:', enabled ? 'activées' : 'désactivées');
          }} />
          
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100">Alertes par email</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Notifications importantes par email</p>
              </div>
              <Switch 
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
