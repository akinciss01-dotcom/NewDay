"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function StepTracker() {
  const [steps, setSteps] = useState(0);
  const [calories, setCalories] = useState(0);
  const [distance, setDistance] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const [isSensorAvailable, setIsSensorAvailable] = useState(true); // Sensör var mı?
  const goalSteps = 10000;

  // Hassayiyet ayarı (Ne kadar sarsıntı 1 adım sayılır?)
  const THRESHOLD = 10;
  let lastX = 0, lastY = 0, lastZ = 0;
  let eventCount = 0;

  // 1. Verileri LocalStorage'dan Oku ve Kaydet
  useEffect(() => {
    const savedSteps = localStorage.getItem("dailySteps");
    const savedDate = localStorage.getItem("stepDate");
    const today = new Date().toDateString();

    if (savedDate === today && savedSteps) {
      setSteps(parseInt(savedSteps));
    } else {
      // Yeni gün, sıfırla
      setSteps(0);
      localStorage.setItem("stepDate", today);
    }
  }, []);

  // Adım sayısı değiştikçe kalori/mesafe hesapla ve kaydet
  useEffect(() => {
    setCalories(Math.floor(steps * 0.04));
    setDistance(Number.parseFloat((steps * 0.0008).toFixed(2)));
    localStorage.setItem("dailySteps", steps.toString());
  }, [steps]);

  // 2. Hareket Sensörü Mantığı (Pedometer)
  const handleMotion = (event: DeviceMotionEvent) => {
    eventCount++;
    const { accelerationIncludingGravity } = event;
    if (!accelerationIncludingGravity) return;

    const x = accelerationIncludingGravity.x || 0;
    const y = accelerationIncludingGravity.y || 0;
    const z = accelerationIncludingGravity.z || 0;

    // Basit ivme değişimi algılama (Adım atınca telefon sarsılır)
    const delta = Math.abs(x + y + z - lastX - lastY - lastZ);

    if (delta > THRESHOLD) {
      // Çok hızlı artışları engellemek için debounce eklenebilir ama şimdilik basit tutuyoruz.
      setSteps(prev => prev + 1);
    }

    lastX = x;
    lastY = y;
    lastZ = z;
  };

  // Simülasyon (Masaüstü için)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTracking && !isSensorAvailable) {
      // Sensör yoksa her saniye rastgele adım ekle (Test için)
      interval = setInterval(() => {
        setSteps(prev => prev + Math.floor(Math.random() * 2) + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTracking, isSensorAvailable]);

  const startTracking = () => {
    // Sensör kontrolü (1 saniye dinle, veri gelmezse simülasyona geç)
    setIsTracking(true);

    // Masaüstü tarayıcılarda DeviceMotionEvent genelde boştur veya tetiklenmez
    if (typeof window !== 'undefined' && 'DeviceMotionEvent' in window) {
      window.addEventListener('devicemotion', handleMotion);

      // 1.5 saniye sonra hiç event gelmediyse sensör yok say
      setTimeout(() => {
        if (eventCount === 0) {
          setIsSensorAvailable(false);
        }
      }, 1500);
    } else {
      setIsSensorAvailable(false);
    }

    // iOS İzin İsteme (Varsa)
    if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      (DeviceMotionEvent as any).requestPermission()
        .then((response: string) => {
          if (response !== 'granted') {
            alert("İzin verilmedi!");
            setIsTracking(false);
          }
        })
        .catch(() => setIsSensorAvailable(false));
    }
  };

  const stopTracking = () => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('devicemotion', handleMotion);
    }
    setIsTracking(false);
    eventCount = 0;
  };

  useEffect(() => {
    // Component destroy olursa dinlemeyi durdur
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('devicemotion', handleMotion);
      }
    };
  }, []);

  const progress = (steps / goalSteps) * 100;

  return (
    <Card className="overflow-hidden border-primary/20 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
        <CardTitle className="flex items-center gap-2">
          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Step Tracker
        </CardTitle>
        <CardDescription>Real-time Activity Sensor</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2 transition-all">{steps.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground animate-pulse font-medium">
              {isTracking
                ? (isSensorAvailable ? "Tracking Active (Walk Now)..." : "Simulation Mode (Desktop)")
                : "Paused"}
            </div>
            {!isSensorAvailable && isTracking && (
              <div className="text-[10px] text-orange-500 mt-1">
                ⚠️ Bilgisayarda sensör yok, simülasyon çalışıyor.
              </div>
            )}
          </div>

          <div className="relative w-full h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 rounded-lg bg-primary/5">
              <div className="text-xl font-bold text-primary">{calories}</div>
              <div className="text-xs text-muted-foreground">Calories</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-secondary/5">
              <div className="text-xl font-bold text-secondary">{distance} km</div>
              <div className="text-xs text-muted-foreground">Distance</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-accent/5">
              <div className="text-xl font-bold text-accent">{goalSteps.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Goal</div>
            </div>
          </div>

          <Button
            className={`w-full hover:opacity-90 ${isTracking ? "bg-red-500 hover:bg-red-600" : "bg-gradient-to-r from-primary to-secondary"}`}
            onClick={isTracking ? stopTracking : startTracking}
          >
            {isTracking ? "Stop Tracking" : "Start Live Tracking"}
          </Button>

          <div className="text-[10px] text-center text-muted-foreground">
            * Uses your device motion sensor. Walk to count steps.
          </div>
        </div>
      </CardContent>
    </Card>
  )
}