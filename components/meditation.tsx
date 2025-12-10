"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const sessions = [
  { id: 1, name: "Morning Calm", duration: 5, description: "Start your day with peace" },
  { id: 2, name: "Deep Focus", duration: 10, description: "Enhance concentration" },
  { id: 3, name: "Evening Wind Down", duration: 15, description: "Prepare for restful sleep" },
]

export function Meditation() {
  const [activeSession, setActiveSession] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    if (!isPlaying || timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsPlaying(false)
          setActiveSession(null)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isPlaying, timeLeft])

  const startSession = (session: (typeof sessions)[0]) => {
    setActiveSession(session.id)
    setTimeLeft(session.duration * 60)
    setIsPlaying(true)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <Card className="border-2 border-secondary/20 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-secondary/10 to-accent/10">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <CardTitle className="text-lg">Meditation</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {activeSession ? (
          <div className="text-center space-y-6 animate-in fade-in">
            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-secondary/20 to-accent/20 flex items-center justify-center border-4 border-secondary/30 animate-pulse">
              <p className="text-3xl font-bold text-foreground">{formatTime(timeLeft)}</p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">
                {sessions.find((s) => s.id === activeSession)?.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {sessions.find((s) => s.id === activeSession)?.description}
              </p>
            </div>
            <Button
              onClick={() => {
                setIsPlaying(false)
                setActiveSession(null)
              }}
              variant="outline"
              className="border-secondary hover:bg-secondary/10"
            >
              End Session
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => startSession(session)}
                className="w-full p-4 rounded-xl bg-gradient-to-br from-secondary/5 to-accent/5 border border-secondary/10 hover:border-secondary/30 transition-all text-left group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-foreground group-hover:text-secondary transition-colors">
                      {session.name}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">{session.description}</p>
                  </div>
                  <div className="text-sm font-medium text-secondary">{session.duration} min</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}