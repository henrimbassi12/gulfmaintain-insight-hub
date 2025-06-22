
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
      
      // Simulation de données météo réelles pour Douala
      // Dans un vrai projet, vous utiliseriez une API comme OpenWeatherMap
      const mockWeatherData: WeatherData = {
        temperature: Math.round(25 + Math.random() * 8), // 25-33°C
        condition: ['Ensoleillé', 'Partiellement nuageux', 'Nuageux', 'Pluvieux'][Math.floor(Math.random() * 4)],
        humidity: Math.round(70 + Math.random() * 20), // 70-90%
        windSpeed: Math.round(5 + Math.random() * 10), // 5-15 km/h
        forecast: generateForecast()
      };

      // Simulation d'un délai réseau
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setWeather(mockWeatherData);
    } catch (err) {
      setError('Erreur lors de la récupération des données météo');
      console.error('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateForecast = () => {
    const days = ['Aujourd\'hui', 'Demain', 'Après-demain', 'Dimanche'];
    const conditions = ['sunny', 'cloudy', 'rainy', 'windy'];
    const temps = [28, 27, 25, 29];
    
    return days.map((day, index) => ({
      day,
      temp: `${temps[index]}°`,
      condition: conditions[index],
      icon: conditions[index]
    }));
  };

  useEffect(() => {
    fetchWeather();
    
    // Actualisation automatique toutes les 10 minutes
    const interval = setInterval(fetchWeather, 10 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    weather,
    loading,
    error,
    refresh: fetchWeather
  };
}
