
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Sun, Cloud, CloudRain, Wind } from "lucide-react";

export function ModernWeatherWidget() {
  // Fonction pour obtenir les 4 prochains jours à partir d'aujourd'hui
  const getNextDays = () => {
    const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    const today = new Date();
    const nextDays = [];
    
    for (let i = 1; i <= 4; i++) {
      const nextDay = new Date(today);
      nextDay.setDate(today.getDate() + i);
      nextDays.push(days[nextDay.getDay()]);
    }
    
    return nextDays;
  };

  const nextDays = getNextDays();
  // Rotation des icônes pour correspondre aux jours réels
  const icons = [Cloud, Sun, CloudRain, Wind];
  const temps = ['21°', '24°', '19°', '23°'];

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
          {nextDays.map((day, index) => {
            const IconComponent = icons[index];
            return (
              <div key={day} className="text-center p-2 bg-gray-50 rounded-lg">
                <IconComponent className={`h-4 w-4 mx-auto mb-1 ${
                  IconComponent === Sun ? 'text-yellow-500' :
                  IconComponent === Cloud ? 'text-gray-400' :
                  IconComponent === CloudRain ? 'text-blue-400' :
                  'text-gray-500'
                }`} />
                <p className="text-gray-500 mb-1">{day}</p>
                <p className="font-medium text-gray-900">{temps[index]}</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
