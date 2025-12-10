"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Exercise {
  id: number
  name: string
  duration: string
  calories: number
  difficulty: "Easy" | "Medium" | "Hard"
  videoUrl: string
  thumbnail: string
  instructions: string[]
}

export function WorkoutExercises() {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null)

  // SMART WORKOUT ENGINE (OFFLINE) 🚀
  // Haftanın gününe göre değişen akıllı antrenman programı
  const generateDailyWorkout = () => {
    const today = new Date();
    const dayIndex = today.getDay(); // 0 = Sunday, 1 = Monday...
    const THEMES = [
      "Sunday Yoga Flow",       // 0
      "Cardio Blast Monday",    // 1
      "Full Body Strength Tue", // 2
      "HIIT Wednesday",         // 3
      "Active Recovery Thu",    // 4
      "Leg Day Friday",         // 5
      "Core & Abs Saturday"     // 6
    ];

    const dailyTheme = THEMES[dayIndex];

    // Tüm Egzersiz Havuzu (Simüle edilmiş "veritabanı")
    const ALL_EXERCISES: Exercise[] = [
      {
        id: 101,
        name: "Morning Cardio Jump",
        duration: "15 min",
        calories: 150,
        difficulty: "Medium",
        videoUrl: "https://www.youtube.com/embed/8JpV1W5h0y0?autoplay=1",
        thumbnail: "/person-doing-cardio-exercise.jpg",
        instructions: [
          "Start with gentle jumping jacks for 1 minute.",
          "Transition into high knees, lifting knees to waist height.",
          "Perform mountain climbers to engage the core.",
          "Cool down with a slow march in place."
        ]
      },
      {
        id: 102,
        name: "Core Crusher",
        duration: "10 min",
        calories: 100,
        difficulty: "Hard",
        videoUrl: "https://www.youtube.com/embed/1f8yoFFdkcY?autoplay=1",
        thumbnail: "/core-exercise.jpg",
        instructions: [
          "Lie on your back, knees bent, feet flat on the floor.",
          "Engage your core and lift your upper body towards your knees.",
          "Lower back down slowly with control.",
          "Perform 3 sets of 15 repetitions."
        ]
      },
      {
        id: 103,
        name: "Leg Day Blast",
        duration: "20 min",
        calories: 200,
        difficulty: "Hard",
        videoUrl: "https://www.youtube.com/embed/R0_fI0c_M2k?autoplay=1",
        thumbnail: "/leg-exercise.jpg",
        instructions: [
          "Stand with feet shoulder-width apart.",
          "Lower your hips as if sitting in a chair (Squat).",
          "Keep your chest up and back straight.",
          "Push through heels to return to standing. Repeat 15 times."
        ]
      },
      {
        id: 104,
        name: "Arm Toning",
        duration: "10 min",
        calories: 80,
        difficulty: "Easy",
        videoUrl: "https://www.youtube.com/embed/97S4hA7HjkY?autoplay=1",
        thumbnail: "/arm-exercise.jpg",
        instructions: [
          "Stand tall, arms extended to the sides.",
          "Make small circles forward with your arms for 30 seconds.",
          "Reverse the direction and circle backwards for 30 seconds.",
          "Keep arms straight and shoulders down."
        ]
      },
      {
        id: 105,
        name: "Evening Stretching",
        duration: "15 min",
        calories: 50,
        difficulty: "Easy",
        videoUrl: "https://www.youtube.com/embed/sEKSoHrIG8I?autoplay=1",
        thumbnail: "/stretching-exercise.jpg",
        instructions: [
          "Sit comfortably on the floor or a mat.",
          "Reach your arms overhead and stretch tall.",
          "Gently fold forward to reach towards your toes.",
          "Hold each stretch for 30 seconds and breathe deeply."
        ]
      },
      {
        id: 107,
        name: "Bedtime Stretch",
        duration: "15 min",
        calories: 60,
        difficulty: "Easy",
        videoUrl: "https://www.youtube.com/embed/sEKSoHrIG8I?autoplay=1",
        thumbnail: "/yoga-flow.jpg",
        instructions: [
          "Sit comfortably and do gentle neck rolls.",
          "Seated spinal twist to release back tension.",
          "Butterfly pose to open hips.",
          "Deep breathing for 2 minutes."
        ]
      }
    ];

    // Güne özel 3'lü antrenman seti seçimi (Basit algoritma: Güne göre kaydırarak seç)
    // Bu sayede her gün liste değişir ama o gün içinde sabittir.
    const todaysExercises = [
      ALL_EXERCISES[(dayIndex) % ALL_EXERCISES.length],
      ALL_EXERCISES[(dayIndex + 2) % ALL_EXERCISES.length],
      ALL_EXERCISES[(dayIndex + 4) % ALL_EXERCISES.length],
    ];

    // Antrenman isimlerini güne özel hale getirmek için ufak bir dokunuş (Opsiyonel)
    return todaysExercises.map(ex => ({
      ...ex,
      name: `${dailyTheme}: ${ex.name.split(' ').slice(0, 2).join(' ')}`
    }));
  };

  const [exercises] = useState<Exercise[]>(generateDailyWorkout())

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-500/10 text-green-600 border-green-500/20"
      case "Medium":
        return "bg-orange-500/10 text-orange-600 border-orange-500/20"
      case "Hard":
        return "bg-red-500/10 text-red-600 border-red-500/20"
      default:
        return ""
    }
  }

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
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timeLeft])

  const startWorkout = () => {
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
    // TIMER GÖRÜNÜMÜ (VIDEO veya IMAGE + TIMER + INSTRUCTIONS)
    if (isPlaying) {
      // Video URL geçerli bir YouTube embed linki mi?
      const isVideoAvailable = selectedExercise.videoUrl && selectedExercise.videoUrl !== "#";

      return (
        <Card className="border-accent/20 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-accent/10 to-primary/10 text-center py-4">
            <CardTitle>{selectedExercise.name}</CardTitle>
            <CardDescription>Keep pushing, you got this!</CardDescription>
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
                    End Workout
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

                {/* TIMER OVERLAY (ALTTA BAR OLARAK) */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm p-4 flex items-center justify-between text-white">
                  <div className="flex flex-col">
                    <span className="text-xs uppercase text-gray-300 tracking-wider">Time Remaining</span>
                    <span className="font-mono text-3xl font-bold animate-pulse text-accent">
                      {formatTime(timeLeft)}
                    </span>
                  </div>

                  <div className="flex gap-2">
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
                      End
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* ADIM ADIM TALİMATLAR */}
            <div className="p-6 space-y-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent/20 text-accent text-xs">!</span>
                Workout Plan:
              </h3>
              <ul className="space-y-4">
                {selectedExercise.instructions?.map((step, idx) => (
                  <li key={idx} className="flex gap-3 text-sm text-muted-foreground leading-relaxed border-l-2 border-accent/20 pl-4">
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
      <Card className="border-accent/20 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-accent/10 to-primary/10">
          <Button variant="ghost" size="sm" onClick={() => setSelectedExercise(null)} className="w-fit mb-2">
            ← Back to Exercises
          </Button>
          <CardTitle>{selectedExercise.name}</CardTitle>
          <CardDescription>Follow along with the timer</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="aspect-video rounded-lg overflow-hidden bg-muted">
              <img
                src={selectedExercise.thumbnail || "/placeholder.svg"}
                alt={selectedExercise.name}
                className="w-full h-full object-cover brightness-105"
              />
            </div>
            <div className="flex items-center gap-4">
              <Badge className={getDifficultyColor(selectedExercise.difficulty)}>{selectedExercise.difficulty}</Badge>
              <div className="text-sm text-muted-foreground">{selectedExercise.duration}</div>
              <div className="text-sm text-muted-foreground">{selectedExercise.calories} cal</div>
            </div>

            {/* Instructions Preview */}
            <div className="space-y-2">
              <div className="font-medium text-sm text-foreground">Workout Preview</div>
              <ul className="pl-4 list-disc text-sm text-muted-foreground space-y-1">
                {selectedExercise.instructions?.slice(0, 2).map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
                <li>...and more.</li>
              </ul>
            </div>

            <Button onClick={startWorkout} className="w-full bg-gradient-to-r from-accent to-primary hover:opacity-90">Start Workout</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-accent/20 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-accent/10 to-primary/10">
        <CardTitle className="flex items-center gap-2">
          <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Workout Exercises
        </CardTitle>
        <CardDescription>Choose your workout for today</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-3">
          {exercises.map((exercise) => (
            <div
              key={exercise.id}
              onClick={() => setSelectedExercise(exercise)}
              className="p-4 rounded-lg border border-border hover:border-accent/50 hover:bg-accent/5 cursor-pointer transition-all group"
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
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">{exercise.name}</h3>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {exercise.duration}
                        </Badge>
                        {exercise.videoUrl && exercise.videoUrl !== "#" && (
                          <Badge variant="outline" className="text-xs border-accent/50 text-accent bg-accent/5">
                            🎥 Video
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Badge className={getDifficultyColor(exercise.difficulty)}>
                      {exercise.difficulty}
                    </Badge>
                  </div>
                </div>
                <svg
                  className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors"
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