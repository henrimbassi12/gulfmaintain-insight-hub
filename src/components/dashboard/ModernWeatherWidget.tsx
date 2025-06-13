
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Sun, Cloud, CloudRain, Wind } from "lucide-react";

export function ModernWeatherWidget() {
  return (
    <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Météo</h3>
            <p className="text-gray-500 text-sm">Casablanca</p>
          </div>
          <div className="p-2 bg-blue-50 rounded-lg">
            <Sun className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        
        <div className="mb-4">
          <span className="text-3xl font-bold text-gray-900">22°</span>
          <span className="text-gray-600 ml-2">Ensoleillé</span>
        </div>
        
        <div className="grid grid-cols-4 gap-3 text-xs">
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <Sun className="h-4 w-4 mx-auto mb-1 text-blue-500" />
            <p className="text-gray-500 mb-1">Lun</p>
            <p className="font-medium text-gray-900">24°</p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <Cloud className="h-4 w-4 mx-auto mb-1 text-gray-400" />
            <p className="text-gray-500 mb-1">Mar</p>
            <p className="font-medium text-gray-900">21°</p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <CloudRain className="h-4 w-4 mx-auto mb-1 text-gray-400" />
            <p className="text-gray-500 mb-1">Mer</p>
            <p className="font-medium text-gray-900">19°</p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <Wind className="h-4 w-4 mx-auto mb-1 text-gray-400" />
            <p className="text-gray-500 mb-1">Jeu</p>
            <p className="font-medium text-gray-900">23°</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
