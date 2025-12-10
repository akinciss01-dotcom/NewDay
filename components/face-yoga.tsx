"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface FaceExercise {
  id: number
  name: string
  duration: string
  description: string
  benefits: string
  videoUrl: string
  thumbnail: string
  instructions: string[]
}

export function FaceYoga() {
  const [selectedExercise, setSelectedExercise] = useState<FaceExercise | null>(null)

  // SMART FACE YOGA ENGINE (OFFLINE) ✨
  // Her gün cildin ihtiyacına göre değişen "Günlük Glow" rutini
  const generateDailyFaceRoutine = () => {
    // Örnek "Veritabanı"
    const ALL_MOVES: FaceExercise[] = [
      {
        id: 201,
        name: "Forehead Smoother",
        duration: "2 min",
        description: "Smooths brow lines",
        benefits: "Relaxation",
        videoUrl: "https://www.youtube.com/embed/9fL-j48tI8I?autoplay=1",
        thumbnail: "/face-yoga-forehead-exercise.jpg",
        instructions: [
          "Place both hands on your forehead facing inwards.",
          "Spread your fingers out between your eyebrows and hairline.",
          "Sweep your fingers outwards across your forehead, applying light pressure.",
          "Repeat 10 times to relax muscles and smooth lines."
        ]
      },
      {
        id: 202,
        name: "Cheek Lifter",
        duration: "3 min",
        description: "Lifts sagging cheeks",
        benefits: "Lifting",
        videoUrl: "https://www.youtube.com/embed/n9zCzxPUEYA?autoplay=1",
        thumbnail: "/face-yoga-cheek-exercise.jpg",
        instructions: [
          "Open your mouth to form an 'O' shape.",
          "Smile widely while keeping the 'O' shape to lift your cheek muscles.",
          "Place your index fingers lightly on your cheeks for resistance.",
          "Hold for 5 seconds, then relax. Repeat."
        ]
      },
      {
        id: 203,
        name: "Eye Brightener",
        duration: "2 min",
        description: "Reduces puffiness",
        benefits: "Brightening",
        videoUrl: "https://www.youtube.com/embed/9fL-j48tI8I?autoplay=1",
        thumbnail: "/face-yoga-eye-exercise.jpg",
        instructions: [
          "Place your index fingers at the outer corners of your eyes.",
          "Gently pull outwards while squinting your eyes.",
          "Hold for 3 seconds and relax.",
          "Repeat 10 times to tone eye muscles."
        ]
      },
      {
        id: 204,
        name: "Jawline Sculptor",
        duration: "5 min",
        description: "Defines the jawline",
        benefits: "Sculpting",
        videoUrl: "https://www.youtube.com/embed/n9zCzxPUEYA?autoplay=1",
        thumbnail: "/face-yoga-jaw-exercise.jpg",
        instructions: [
          "Tilt your head back and look at the ceiling.",
          "Push your lower jaw forward to feel a stretch under your chin.",
          "Hold for 10 seconds, then relax.",
          "Repeat 5 times for a defined jawline."
        ]
      },
      {
        id: 205,
        name: "Neck Firmer",
        duration: "3 min",
        description: "Tightens neck skin",
        benefits: "Anti-aging",
        videoUrl: "https://www.youtube.com/embed/n9zCzxPUEYA?autoplay=1",
        thumbnail: "/face-yoga-cheek-exercise.jpg",
        instructions: [
          "Look straight ahead and place your fingertips at the top of your neck.",
          "Gently stroke downwards towards your collarbone.",
          "Tilt your head slightly back to stretch the skin.",
          "Repeat on both sides of the neck."
        ]
      },
      {
        id: 206,
        name: "Smile Line Eraser",
        duration: "3 min",
        description: "Softens smile lines",
        benefits: "Smoothing",
        videoUrl: "https://www.youtube.com/embed/n9zCzxPUEYA?autoplay=1",
        thumbnail: "/face-yoga-jaw-exercise.jpg",
        instructions: [
          "Inflate your cheeks with air like a balloon.",
          "Move the air from one cheek to the other.",
          "Continue this swishing motion for 30 seconds.",
          "Release and relax your face."
        ]
      }
    ];

    const today = new Date().getDay(); // 0-6

    // Güne göre 3 hareket seç (Basit döngüsel seçim)
    // Pazartesi (1): 1, 3, 5
    // Salı (2): 2, 4, 0 ... gibi varyasyonlar
    const selection = [
      ALL_MOVES[(today) % ALL_MOVES.length],
      ALL_MOVES[(today + 2) % ALL_MOVES.length],
      ALL_MOVES[(today + 4) % ALL_MOVES.length]
    ];

    return selection;
  }

  const [exercises] = useState<FaceExercise[]>(generateDailyFaceRoutine())

  const [isPlaying, setIsPlaying] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isActive, setIsActive] = useState(false)

  // Timer mantığı
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false)
      setIsPlaying(false)
      // Burada "Bitti" sesi veya animasyonu eklenebilir
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timeLeft])

  const startExercise = () => {
    // "2 min" stringini saniyeye çevir
    const minutes = parseInt(selectedExercise?.duration.split(" ")[0] || "0");
    setTimeLeft(minutes * 60);
    setIsPlaying(true);
    setIsActive(true);
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  if (selectedExercise) {
    // AKTİF EGZERSİZ GÖRÜNÜMÜ (VIDEO veya IMAGE + TIMER)
    if (isPlaying) {
      // Video URL geçerli bir YouTube embed linki mi? (Basit kontrol)
      const isVideoAvailable = selectedExercise.videoUrl && selectedExercise.videoUrl !== "#";

      return (
        <Card className="border-primary/20 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 text-center py-4">
            <CardTitle>{selectedExercise.name}</CardTitle>
            <CardDescription>Follow the guide below</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {isVideoAvailable ? (
              // VIDEO PLAYER
              <div className="relative aspect-video w-full bg-black">
                <iframe
                  width="100%"
                  height="100%"
                  src={selectedExercise.videoUrl}
                  title={selectedExercise.name}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
                <div className="absolute bottom-4 right-4">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => { setIsPlaying(false); setIsActive(false); }}
                  >
                    End Session
                  </Button>
                </div>
              </div>
            ) : (
              // FALLBACK: IMAGE + TIMER
              <div className="relative aspect-video w-full bg-muted overflow-hidden">
                <img
                  src={selectedExercise.thumbnail || "/placeholder.svg"}
                  alt={selectedExercise.name}
                  className="w-full h-full object-cover brightness-110"
                />

                {/* TIMER OVERLAY */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-4 flex flex-col text-white">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">{selectedExercise.name}</h3>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {selectedExercise.duration}
                        </Badge>
                        {selectedExercise.videoUrl && selectedExercise.videoUrl !== "#" && (
                          <Badge variant="outline" className="text-xs border-primary/50 text-primary bg-primary/5">
                            🎥 Video
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="font-mono text-3xl font-bold animate-pulse text-primary-foreground">
                      {formatTime(timeLeft)}
                    </div>
                  </div>
                  <div className="flex gap-2 self-end">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="h-8"
                      onClick={() => setIsActive(!isActive)}
                    >
                      {isActive ? "Pause" : "Resume"}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="h-8"
                      onClick={() => { setIsPlaying(false); setIsActive(false); }}
                    >
                      Stop
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* TALİMATLAR ALANI */}
            <div className="p-6 space-y-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs">i</span>
                How to do it:
              </h3>
              <ul className="space-y-3">
                {selectedExercise.instructions?.map((step, idx) => (
                  <li key={idx} className="flex gap-3 text-sm text-muted-foreground leading-relaxed">
                    <span className="font-bold text-primary">{idx + 1}.</span>
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )
    }

    return (
      <Card className="border-primary/20 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
          <Button variant="ghost" size="sm" onClick={() => setSelectedExercise(null)} className="w-fit mb-2">
            ← Back to Exercises
          </Button>
          <CardTitle>{selectedExercise.name}</CardTitle>
          <CardDescription>{selectedExercise.description}</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="aspect-video rounded-lg overflow-hidden bg-muted">
              <img
                src={selectedExercise.thumbnail || "/placeholder.svg"}
                alt={selectedExercise.name}
                className="w-full h-full object-cover brightness-105" // Hafif aydınlatma
              />
            </div>
            <div className="p-4 rounded-lg bg-primary/5">
              <div className="font-medium text-sm text-foreground mb-1">Benefits</div>
              <div className="text-sm text-muted-foreground">{selectedExercise.benefits}</div>
            </div>

            {/* Detaylı Talimatlar (Preview) */}
            <div className="space-y-2">
              <div className="font-medium text-sm text-foreground">Overview</div>
              <ul className="pl-4 list-disc text-sm text-muted-foreground space-y-1">
                {selectedExercise.instructions?.slice(0, 2).map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
                {selectedExercise.instructions && selectedExercise.instructions.length > 2 && (
                  <li>...and more.</li>
                )}
              </ul>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {selectedExercise.duration}
            </div>
            <Button onClick={startExercise} className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90">
              Start Exercise Now
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-primary/20 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
        <CardTitle className="flex items-center gap-2">
          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Face Yoga
        </CardTitle>
        <CardDescription>Natural face exercises for youthful skin</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-3">
          {exercises.map((exercise) => (
            <div
              key={exercise.id}
              onClick={() => setSelectedExercise(exercise)}
              className="p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  <img
                    src={exercise.thumbnail || "/placeholder.svg"}
                    alt={exercise.name}
                    className="w-full h-full object-cover brightness-105"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {exercise.name}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{exercise.description}</div>
                  <div className="text-xs text-muted-foreground mt-1">{exercise.duration}</div>
                </div>
                <svg
                  className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}