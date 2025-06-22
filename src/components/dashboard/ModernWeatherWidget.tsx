
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sun, Cloud, CloudRain, Wind, RefreshCw, Thermometer, Droplets } from "lucide-react";
import { useWeather } from "@/hooks/useWeather";
import { toast } from "sonner";

export function ModernWeatherWidget() {
  const { weather, loading, error, refresh } = useWeather();

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
      case 'ensoleillé':
        return Sun;
      case 'cloudy':
      case 'nuageux':
      case 'partiellement nuageux':
        return Cloud;
      case 'rainy':
      case 'pluvieux':
        return CloudRain;
      case 'windy':
      case 'venteux':
        return Wind;
      default:
        return Sun;
    }
  };

  const getIconColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
      case 'ensoleillé':
        return 'text-yellow-500';
      case 'cloudy':
      case 'nuageux':
      case 'partiellement nuageux':
        return 'text-gray-400';
      case 'rainy':
      case 'pluvieux':
        return 'text-blue-400';
      case 'windy':
      case 'venteux':
        return 'text-gray-500';
      default:
        return 'text-yellow-500';
    }
  };

  const handleRefresh = async () => {
    toast.loading('Actualisation de la météo...');
    await refresh();
    toast.dismiss();
    toast.success('Météo actualisée');
  };

  if (loading) {
    return (
      <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="h-6 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="h-8 bg-gray-200 rounded w-24 mb-4"></div>
            <div className="grid grid-cols-4 gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !weather) {
    return (
      <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-red-500 mb-3">{error || 'Erreur de chargement'}</p>
            <Button onClick={handleRefresh} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Réessayer
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const MainIcon = getWeatherIcon(weather.condition);

  return (
    <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Météo</h3>
            <p className="text-gray-500 text-sm">Douala</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleRefresh}
              variant="ghost"
              size="sm"
              className="p-2 h-8 w-8"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <div className="p-2 bg-blue-50 rounded-lg">
              <MainIcon className={`h-6 w-6 ${getIconColor(weather.condition)}`} />
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <span className="text-3xl font-bold text-gray-900">{weather.temperature}°</span>
          <span className="text-gray-600 ml-2">{weather.condition}</span>
        </div>

        <div className="flex gap-4 mb-4 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <Droplets className="h-3 w-3" />
            <span>{weather.humidity}%</span>
          </div>
          <div className="flex items-center gap-1">
            <Wind className="h-3 w-3" />
            <span>{weather.windSpeed} km/h</span>
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-3 text-xs">
          {weather.forecast.map((day, index) => {
            const DayIcon = getWeatherIcon(day.condition);
            return (
              <div key={day.day + index} className="text-center p-2 bg-gray-50 rounded-lg">
                <DayIcon className={`h-4 w-4 mx-auto mb-1 ${getIconColor(day.condition)}`} />
                <p className="text-gray-500 mb-1 truncate">{day.day}</p>
                <p className="font-medium text-gray-900">{day.temp}</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
