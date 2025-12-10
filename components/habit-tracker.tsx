"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Habit {
  id: string
  name: string
  completed: boolean
  streak: number
}

export function HabitTracker() {
  const [habits, setHabits] = useState<Habit[]>([
    { id: "1", name: "Drink 8 glasses of water", completed: false, streak: 3 },
    { id: "2", name: "Exercise for 30 minutes", completed: false, streak: 5 },
    { id: "3", name: "Read for 20 minutes", completed: false, streak: 2 },
    { id: "4", name: "Practice gratitude", completed: false, streak: 7 },
  ])

  const toggleHabit = (id: string) => {
    setHabits((prev) =>
      prev.map((habit) =>
        habit.id === id
          ? {
              ...habit,
              completed: !habit.completed,
              streak: !habit.completed ? habit.streak + 1 : habit.streak,
            }
          : habit,
      ),
    )
  }

  const completedCount = habits.filter((h) => h.completed).length

  return (
    <Card className="border-2 border-secondary/20 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-secondary/10 to-accent/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <CardTitle className="text-lg">Daily Habits</CardTitle>
          </div>
          <div className="text-sm font-semibold text-secondary">
            {completedCount}/{habits.length}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-3">
          {habits.map((habit) => (
            <button
              key={habit.id}
              onClick={() => toggleHabit(habit.id)}
              className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                habit.completed
                  ? "bg-gradient-to-br from-secondary/20 to-accent/20 border-secondary/30"
                  : "bg-card border-border hover:border-secondary/30"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    habit.completed ? "bg-secondary border-secondary" : "border-muted-foreground"
                  }`}
                >
                  {habit.completed && (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <p
                    className={`text-sm font-medium ${habit.completed ? "text-muted-foreground line-through" : "text-foreground"}`}
                  >
                    {habit.name}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-lg">🔥</span>
                  <span className="text-sm font-bold text-secondary">{habit.streak}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}