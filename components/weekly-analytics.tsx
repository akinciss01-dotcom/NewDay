"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function WeeklyAnalytics() {
  const stats = {
    moodScore: 7.8,
    tasksCompleted: 24,
    totalTasks: 30,
    pomodoroSessions: 15,
    meditationMinutes: 45,
    habitStreak: 5,
    topMood: "Happy",
    productiveDay: "Wednesday",
  }

  const moodData = [
    { day: "Mon", score: 7 },
    { day: "Tue", score: 8 },
    { day: "Wed", score: 9 },
    { day: "Thu", score: 7 },
    { day: "Fri", score: 8 },
    { day: "Sat", score: 8 },
    { day: "Sun", score: 7 },
  ]

  const maxScore = Math.max(...moodData.map((d) => d.score))

  return (
    <div className="space-y-6">
      <Card className="border-2 border-primary/20 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
          <CardTitle className="text-lg">Weekly Overview</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
              <p className="text-xs text-muted-foreground mb-1">Avg Mood</p>
              <p className="text-2xl font-bold text-foreground">{stats.moodScore}/10</p>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-secondary/10 to-accent/10 border border-secondary/20">
              <p className="text-xs text-muted-foreground mb-1">Tasks Done</p>
              <p className="text-2xl font-bold text-foreground">
                {stats.tasksCompleted}/{stats.totalTasks}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-accent/10 to-primary/10 border border-accent/20">
              <p className="text-xs text-muted-foreground mb-1">Pomodoros</p>
              <p className="text-2xl font-bold text-foreground">{stats.pomodoroSessions}</p>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-secondary/10 to-primary/10 border border-secondary/20">
              <p className="text-xs text-muted-foreground mb-1">Meditation</p>
              <p className="text-2xl font-bold text-foreground">{stats.meditationMinutes}m</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-secondary/20 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-secondary/10 to-accent/10">
          <CardTitle className="text-lg">Mood Tracking</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex items-end justify-between gap-2 h-40">
            {moodData.map((data) => (
              <div key={data.day} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-secondary to-accent transition-all duration-500"
                  style={{ height: `${(data.score / maxScore) * 100}%` }}
                />
                <p className="text-xs text-muted-foreground">{data.day}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-accent/20 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-accent/10 to-primary/10">
          <CardTitle className="text-lg">Insights</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-br from-accent/5 to-primary/5">
              <span className="text-2xl">😊</span>
              <div>
                <p className="text-sm font-medium text-foreground">Most Common Mood</p>
                <p className="text-xs text-muted-foreground">{stats.topMood}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-br from-secondary/5 to-accent/5">
              <span className="text-2xl">🚀</span>
              <div>
                <p className="text-sm font-medium text-foreground">Most Productive Day</p>
                <p className="text-xs text-muted-foreground">{stats.productiveDay}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-br from-primary/5 to-secondary/5">
              <span className="text-2xl">🔥</span>
              <div>
                <p className="text-sm font-medium text-foreground">Habit Streak</p>
                <p className="text-xs text-muted-foreground">{stats.habitStreak} days strong</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}