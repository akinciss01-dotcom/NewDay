"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Sun, Cloud, CloudRain, Zap, Wind, AlertTriangle, MapPin } from "lucide-react" // MapPin eklendi

// API Anahtarı ve Base URL'i .env dosyasından alıyoruz
const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather"

interface WeatherData {
  city: string;
  temp: number;
  description: string;
  icon: string;
  windSpeed: number;
}

const getWeatherIcon = (iconCode: string) => {
  if (iconCode.startsWith("01")) return <Sun className="w-8 h-8 text-yellow-500" />; // Clear Sky
  if (iconCode.startsWith("09") || iconCode.startsWith("10")) return <CloudRain className="w-8 h-8 text-blue-500" />; // Rain
  if (iconCode.startsWith("11")) return <Zap className="w-8 h-8 text-yellow-600" />; // Thunderstorm
  if (iconCode.startsWith("13")) return <Cloud className="w-8 h-8 text-gray-400" />; // Snow
  return <Cloud className="w-8 h-8 text-gray-400" />; // Default Cloud
};

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!API_KEY) {
        setError("API Anahtarı eksik! .env.local dosyasını kontrol et.");
        setLoading(false);
        return;
    }

    // 1. API'dan veriyi çeken fonksiyon (Koordinatları kullanır)
    const fetchWeather = async (lat: number, lon: number) => {
      try {
        // API çağrısı, şehir adı yerine enlem (lat) ve boylam (lon) kullanıyor
        const response = await fetch(`${BASE_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}&lang=tr`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`API Hatası: ${errorData.message || response.statusText}`);
        }

        const data = await response.json();

        setWeather({
          city: data.name,
          temp: Math.round(data.main.temp),
          description: data.weather[0].description,
          icon: data.weather[0].icon,
          windSpeed: Math.round(data.wind.speed * 3.6),
        });

      } catch (err) {
        // @ts-ignore
        setError(err.message || "Hava durumu verisi çekilemedi.");
      } finally {
        setLoading(false);
      }
    };

    // 2. Browser'dan konumu alan fonksiyon
    const getCoordinates = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    // Konum başarılıysa, çekme fonksiyonunu çağır
                    fetchWeather(position.coords.latitude, position.coords.longitude);
                },
                (err) => {
                    // Kullanıcı izni reddetti veya hata oluştu
                    if (err.code === err.PERMISSION_DENIED) {
                        setError("Konum izni reddedildi. Lütfen tarayıcı ayarlarından izin verin.");
                    } else {
                        setError(`Konum Hatası: ${err.message}`);
                    }
                    setLoading(false);
                }
            );
        } else {
            setError("Tarayıcınız Konum Servisini desteklemiyor.");
            setLoading(false);
        }
    };

    getCoordinates();
  }, []);

  if (loading) {
    return <Card className="p-4 text-center">Konum Alınıyor...</Card>;
  }

  if (error || !weather) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Hata!</AlertTitle>
        <AlertDescription>{error || "Veri yüklenemedi."}</AlertDescription>
        <AlertDescription className="text-xs mt-1">
            Not: OpenWeatherMap anahtarı etkinleşmiş olmalı.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-1">
           <MapPin className="h-4 w-4 text-red-500" /> {weather.city}
        </CardTitle>
        <Wind className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="pt-2">
        <div className="flex items-center justify-between">
          <div className="text-4xl font-bold">{weather.temp}°C</div>
          {getWeatherIcon(weather.icon)}
        </div>
        <p className="text-xs text-muted-foreground mt-1 capitalize">{weather.description}</p>
        <p className="text-xs text-muted-foreground mt-3">Rüzgar: {weather.windSpeed} km/h</p>
      </CardContent>
    </Card>
  );
}