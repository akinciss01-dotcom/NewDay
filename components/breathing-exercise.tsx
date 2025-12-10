"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function BreathingExercise() {
  const [isActive, setIsActive] = useState(false)
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale")
  const [count, setCount] = useState(4)

  useEffect(() => {
    if (!isActive) return

    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          if (phase === "inhale") {
            setPhase("hold")
            return 4
          } else if (phase === "hold") {
            setPhase("exhale")
            return 4
          } else {
            setPhase("inhale")
            return 4
          }
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isActive, phase])

  const phaseText = {
    inhale: "Breathe In",
    hold: "Hold",
    exhale: "Breathe Out",
  }

  const phaseColor = {
    inhale: "from-accent to-secondary",
    hold: "from-secondary to-accent",
    exhale: "from-primary to-secondary",
  }

  return (
    <Card className="border-2 border-accent/20 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-accent/10 to-secondary/10">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-secondary flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <CardTitle className="text-lg">Breathing Exercise</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="text-center space-y-6">
          <div className="relative w-40 h-40 mx-auto">
            <div
              className={`absolute inset-0 rounded-full bg-gradient-to-br ${phaseColor[phase]} opacity-20 transition-all duration-1000 ${
                isActive ? (phase === "inhale" ? "scale-100" : phase === "hold" ? "scale-100" : "scale-75") : "scale-75"
              }`}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-4xl font-bold text-foreground mb-2">{count}</p>
                <p className="text-sm text-muted-foreground">{phaseText[phase]}</p>
              </div>
            </div>
          </div>

          <Button
            onClick={() => setIsActive(!isActive)}
            className={`w-full bg-gradient-to-r ${phaseColor[phase]} hover:opacity-90`}
          >
            {isActive ? "Stop" : "Start Breathing"}
          </Button>

          <p className="text-xs text-muted-foreground">4-4-4 breathing pattern for relaxation</p>
        </div>
      </CardContent>
    </Card>
  )
}