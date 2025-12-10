"use client"

import { Card, CardContent } from "@/components/ui/card"

interface DashboardOverviewProps {
  mood: string | null
}

export function DashboardOverview({ mood }: DashboardOverviewProps) {
  const getMoodEmoji = (moodType: string | null) => {
    const moods: Record<string, string> = {
      happy: "😊",
      calm: "😌",
      energetic: "⚡",
      sad: "😢",
      anxious: "😰",
    }
    return moods[moodType || ""] || "✨"
  }

  return (
    <Card className="border-none shadow-lg bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 animate-fade-in">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="text-5xl animate-bounce-gentle">{getMoodEmoji(mood)}</div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">{mood ? `Feeling ${mood}` : "How are you today?"}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {mood ? "Keep track of your wellness journey" : "Start by tracking your mood below"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-6">
          <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-3 text-center">
            <div className="text-2xl font-bold text-primary">3</div>
            <div className="text-xs text-muted-foreground mt-1">Tasks</div>
          </div>
          <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-3 text-center">
            <div className="text-2xl font-bold text-secondary">2</div>
            <div className="text-xs text-muted-foreground mt-1">Habits</div>
          </div>
          <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-3 text-center">
            <div className="text-2xl font-bold text-accent">5</div>
            <div className="text-xs text-muted-foreground mt-1">Streak</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}