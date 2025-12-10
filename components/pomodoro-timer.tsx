"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Pause, RotateCcw } from "lucide-react"

export function PomodoroTimer() {
  const [minutes, setMinutes] = useState(25)
  const [seconds, setSeconds] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [isBreak, setIsBreak] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            // Timer finished
            setIsActive(false)
            if (!isBreak) {
              setMinutes(5)
              setIsBreak(true)
            } else {
              setMinutes(25)
              setIsBreak(false)
            }
          } else {
            setMinutes(minutes - 1)
            setSeconds(59)
          }
        } else {
          setSeconds(seconds - 1)
        }
      }, 1000)
    } else if (!isActive && interval) {
      clearInterval(interval)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, minutes, seconds, isBreak])

  const toggle = () => setIsActive(!isActive)

  const reset = () => {
    setIsActive(false)
    setMinutes(25)
    setSeconds(0)
    setIsBreak(false)
  }

  const progress = isBreak ? ((5 - minutes - seconds / 60) / 5) * 100 : ((25 - minutes - seconds / 60) / 25) * 100

  return (
    <Card className="p-6 bg-gradient-to-br from-secondary/20 via-card to-accent/10 border-2 border-border/50 shadow-lg">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground mb-1">{isBreak ? "Break Time" : "Focus Time"}</h2>
          <p className="text-sm text-muted-foreground">{isBreak ? "Take a short rest" : "Stay focused on your task"}</p>
        </div>

        <div className="relative">
          <div className="w-48 h-48 mx-auto relative">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-muted/30"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                className="text-primary transition-all duration-1000"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-foreground tabular-nums">
                  {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3">
          <Button
            onClick={toggle}
            size="lg"
            className="rounded-full w-16 h-16 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
          </Button>
          <Button
            onClick={reset}
            size="lg"
            variant="outline"
            className="rounded-full w-16 h-16 border-2 hover:bg-muted/50 transition-all duration-300 bg-transparent"
          >
            <RotateCcw className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </Card>
  )
}