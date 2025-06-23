
import { useState, useEffect } from 'react';

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  forecast: Array<{
    day: string;
    temp: string;
    condition: string;
    icon: string;
  }>;
}

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Variations réalistes selon l'heure et la saison (Douala = climat équatorial)
      const now = new Date();
      const hour = now.getHours();
      
      // Température plus réaliste avec variations
      const baseTemp = 26 + Math.sin((hour - 6) * Math.PI / 12) * 4 + (Math.random() - 0.5) * 2;
      const humidity = 75 + Math.random() * 20; // Humidité élevée typique
      const wind = 5 + Math.random() * 8; // Vent modéré
      
      const conditions = ['Ensoleillé', 'Partiellement nuageux', 'Nuageux', 'Pluvieux'];
      const conditionIndex = hour < 8 || hour > 18 ? 
        (Math.random() > 0.7 ? 3 : 1) : // Plus de chances de pluie la nuit
        Math.floor(Math.random() * 3); // Moins de pluie en journée
      
      const mockWeatherData: WeatherData = {
        temperature: Math.round(baseTemp),
        condition: conditions[conditionIndex],
        humidity: Math.round(humidity),
        windSpeed: Math.round(wind),
        forecast: generateRealisticForecast()
      };

      // Simulation d'un délai réseau réaliste
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setWeather(mockWeatherData);
      console.log(`🌤️ Météo mise à jour : ${mockWeatherData.temperature}°C, ${mockWeatherData.condition}`);
    } catch (err) {
      console.error('❌ Erreur météo:', err);
      setError('Erreur lors de la récupération des données météo');
    } finally {
      setLoading(false);
    }
  };

  const generateRealisticForecast = () => {
    const today = new Date();
    const daysOfWeek = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const conditions = ['sunny', 'cloudy', 'rainy', 'windy'];
    
    // Températures réalistes pour Douala (25-32°C) avec variations
    const baseTemps = [29, 28, 26, 30].map(temp => temp + Math.floor((Math.random() - 0.5) * 4));
    
    return Array.from({ length: 4 }, (_, index) => {
      const forecastDate = new Date(today);
      forecastDate.setDate(today.getDate() + index);
      const dayName = daysOfWeek[forecastDate.getDay()];
      
      return {
        day: dayName,
        temp: `${baseTemps[index]}°`,
        condition: conditions[index % conditions.length],
        icon: conditions[index % conditions.length]
      };
    });
  };

  useEffect(() => {
    fetchWeather();
    
    // Actualisation toutes les 30 minutes (plus réaliste)
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    weather,
    loading,
    error,
    refresh: fetchWeather
  };
}
