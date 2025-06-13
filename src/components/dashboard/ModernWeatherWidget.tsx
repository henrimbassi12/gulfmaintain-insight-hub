
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Sun, Cloud, CloudRain, Wind } from "lucide-react";

export function ModernWeatherWidget() {
  return (
    <Card className="bg-gradient-to-br from-blue-400 to-blue-600 border-0 text-white shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold mb-1">Météo</h3>
            <p className="text-blue-100 text-sm">Casablanca</p>
          </div>
          <Sun className="h-8 w-8 text-yellow-300" />
        </div>
        
        <div className="mb-4">
          <span className="text-4xl font-bold">22°</span>
          <span className="text-blue-100 ml-2">Ensoleillé</span>
        </div>
        
        <div className="grid grid-cols-4 gap-3 text-xs">
          <div className="text-center">
            <Sun className="h-4 w-4 mx-auto mb-1 text-yellow-300" />
            <p className="text-blue-100">Lun</p>
            <p className="font-medium">24°</p>
          </div>
          <div className="text-center">
            <Cloud className="h-4 w-4 mx-auto mb-1 text-blue-200" />
            <p className="text-blue-100">Mar</p>
            <p className="font-medium">21°</p>
          </div>
          <div className="text-center">
            <CloudRain className="h-4 w-4 mx-auto mb-1 text-blue-200" />
            <p className="text-blue-100">Mer</p>
            <p className="font-medium">19°</p>
          </div>
          <div className="text-center">
            <Wind className="h-4 w-4 mx-auto mb-1 text-blue-200" />
            <p className="text-blue-100">Jeu</p>
            <p className="font-medium">23°</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
