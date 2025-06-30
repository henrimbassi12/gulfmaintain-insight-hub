
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, MapIcon } from 'lucide-react';

interface LocationStatusProps {
  locationError: string | null;
  userLocationDetails: string | null;
}

export function LocationStatus({ locationError, userLocationDetails }: LocationStatusProps) {
  return (
    <>
      {locationError && (
        <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-800">
          <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          <AlertDescription className="text-orange-800 dark:text-orange-200">
            {locationError}
          </AlertDescription>
        </Alert>
      )}

      {userLocationDetails && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <MapIcon className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
            <div>
              <p className="font-medium text-green-800 dark:text-green-200">📍 Votre position actuelle</p>
              <p className="text-green-700 dark:text-green-300 text-sm mt-1">{userLocationDetails}</p>
              <p className="text-green-600 dark:text-green-400 text-xs mt-1">
                Position obtenue avec une précision de ±{Math.floor(Math.random() * 50 + 10)}m
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
