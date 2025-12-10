"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { DashboardOverview } from "@/components/dashboard-overview"
import { MoodTracker } from "@/components/mood-tracker"
import { PomodoroTimer } from "@/components/pomodoro-timer"
import { TodoList } from "@/components/todo-list"
import { DreamJournal } from "@/components/dream-journal"
import { Meditation } from "@/components/meditation"
import { BreathingExercise } from "@/components/breathing-exercise"
import { AffirmationCards } from "@/components/affirmation-cards"
import { GratitudeJar } from "@/components/gratitude-jar"
import { WeatherWidget } from "@/components/weather-widget"
import { NewsWidget } from "@/components/news-widget"
import { RecipeWidget } from "@/components/recipe-widget"
import { AstrologyWidget } from "@/components/astrology-widget"
import { LocalEvents } from "@/components/local-events"
import { HabitTracker } from "@/components/habit-tracker"
import { WeeklyAnalytics } from "@/components/weekly-analytics"
import { TodoDetailPage } from "@/components/todo-detail-page"
import { FaceYoga } from "@/components/face-yoga"
import { WorkoutExercises } from "@/components/workout-exercises"
import { StepTracker } from "@/components/step-tracker"
import { BmiCalculator } from "@/components/bmi-calculator"
import { TasksPage } from "@/components/tasks-page"
// RÜYA YORUMU WIDGET'I AYNI KLASÖR İÇİNDEN DOĞRUDAN IMPORT EDİLDİ
// ESKİ Hali (Hata Veren):
// import { DreamInterpretationWidget } from "./dream-interpretation-widget.tsx" 

// YENİ VE DOĞRU Hali: 
// Dosya, bulunduğumuz dizinin altındaki 'components' klasörünün içinde
// DreamInterpretationWidget dosyanız 'components' adında bir alt klasörde olduğu için:
// Eğer Next.js ayarlarınız `@/` takma adını kullanıyorsa:
import { DreamInterpretationWidget } from "@/components/dream-interpretation-widget"
interface DashboardProps {
  onMoodChange?: (mood: string | null) => void
}
// ... mevcut importlar


// 🔥 YENİ EKLEME
import AuthButton from "@/components/AuthButton"
// ... diğer importlar
export default function Dashboard({ onMoodChange }: DashboardProps) {
  const [currentMood, setCurrentMood] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState<"home" | "selfcare" | "content" | "analytics" | "fitness">("home")
  const [showTasksPage, setShowTasksPage] = useState(false)
  const [showTodoDetail, setShowTodoDetail] = useState(false)

  const handleMoodChange = (mood: string) => {
    setCurrentMood(mood)
    if (onMoodChange) {
      onMoodChange(mood)
    }
  }

  if (showTasksPage) {
    return <TasksPage onBack={() => setShowTasksPage(false)} />
  }
  // YENİ VE DİNAMİK TEMA FONKSİYONU 🎨 (Göz Yormayan Dark Mod)
  // YENİ VE DİNAMİK TEMA FONKSİYONU 🎨 (6 Farklı Mood İçin)
  const getThemeClasses = () => {
    switch (currentMood) {
      // 1. HAPPY (Mutlu) - Güneşli Sarı/Turuncu
      case "happy":
        return "from-yellow-200 via-orange-100 to-pink-200 text-orange-950"

      // 2. CALM (Sakin) - Huzurlu Yeşil/Turkuaz
      case "calm":
        return "from-emerald-100 via-teal-100 to-cyan-200 text-teal-950"

      // 3. ENERGETIC (Enerjik) - Güçlü Kırmızı/Mor
      case "energetic":
        return "from-orange-400 via-red-300 to-purple-400 text-white"

      // 4. SAD (Üzgün) - Koyu Mavi/Gri
      case "sad":
        return "from-slate-800 via-blue-900 to-slate-900 text-blue-100"

      // 5. ANXIOUS (Endişeli) - Yoğun Mor/Fuşya
      case "anxious":
        return "from-violet-900 via-purple-900 to-fuchsia-900 text-purple-100"

      // 6. TIRED (Yorgun) - Loş Gri/Taş Rengi
      case "tired":
        return "from-zinc-800 via-stone-900 to-neutral-900 text-stone-300"

      default:
        // Varsayılan tema
        return "from-primary/5 via-secondary/5 to-accent/5 text-black"
    }
  }
  if (showTodoDetail) {
    return <TodoDetailPage onBack={() => setShowTodoDetail(false)} />
  }

  return (
    // Tema sınıfları (background ve yazı rengi) burada uygulanır
    <div className={`min-h-screen bg-gradient-to-br transition-colors duration-700 ease-in-out ${getThemeClasses()}`}>
      <Header activeSection={activeSection} onSectionChange={setActiveSection} />
      <main className="container mx-auto px-4 py-6 max-w-md pb-24">
        {activeSection === "home" && (
          <>
            <DashboardOverview mood={currentMood} />
            <div className="space-y-6 mt-6">
              <MoodTracker onMoodChange={handleMoodChange} />
              <PomodoroTimer />
              <div onClick={() => setShowTasksPage(true)} className="cursor-pointer">
                <TodoList />
              </div>
              <HabitTracker />
            </div>
          </>
        )}

        {/* Diğer bölümler... */}
        {activeSection === "selfcare" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground mb-4">Self Care</h2>
            <BreathingExercise />
            <Meditation />
            <AffirmationCards />
            {/* RÜYA KAYIT VE YORUM WIDGET'LARI BURAYA EKLENDİ */}
            <DreamJournal />
            <DreamInterpretationWidget />
            <GratitudeJar />
          </div>
        )}

        {activeSection === "content" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground mb-4">Today's Content</h2>
            <WeatherWidget />
            <NewsWidget />
            <RecipeWidget />
            <AstrologyWidget />
            <LocalEvents />
          </div>
        )}

        {activeSection === "analytics" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground mb-4">Your Insights</h2>
            <WeeklyAnalytics />
          </div>
        )}

        {activeSection === "fitness" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground mb-4">Fitness & Health</h2>
            <StepTracker />
            <BmiCalculator />
            <WorkoutExercises />
            <FaceYoga />
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border/50 shadow-lg">
        <div className="container mx-auto px-4 max-w-md">
          <div className="flex items-center justify-around py-3">
            <button
              onClick={() => setActiveSection("home")}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${activeSection === "home" ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-xs font-medium">Home</span>
            </button>
            <button onClick={() => setActiveSection("selfcare")} className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${activeSection === "selfcare" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              <span className="text-xs font-medium">Care</span>
            </button>
            <button onClick={() => setActiveSection("fitness")} className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${activeSection === "fitness" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              <span className="text-xs font-medium">Fitness</span>
            </button>
            <button onClick={() => setActiveSection("content")} className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${activeSection === "content" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
              <span className="text-xs font-medium">Content</span>
            </button>
            <button onClick={() => setActiveSection("analytics")} className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${activeSection === "analytics" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              <span className="text-xs font-medium">Stats</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  )
}