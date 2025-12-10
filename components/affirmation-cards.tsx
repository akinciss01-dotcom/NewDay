"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const affirmations = [
  "I am worthy of love and respect",
  "Today is full of possibilities",
  "I trust in my ability to succeed",
  "I am growing and improving every day",
  "I choose peace and positivity",
  "My potential is limitless",
  "I am grateful for this moment",
  "I radiate confidence and joy",
]

export function AffirmationCards() {
  const [currentAffirmation, setCurrentAffirmation] = useState(affirmations[0])
  const [isFlipping, setIsFlipping] = useState(false)

  const getNewAffirmation = () => {
    setIsFlipping(true)
    setTimeout(() => {
      const newAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)]
      setCurrentAffirmation(newAffirmation)
      setIsFlipping(false)
    }, 300)
  }

  return (
    <Card className="border-2 border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              />
            </svg>
          </div>
          <CardTitle className="text-lg">Daily Affirmation</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="text-center space-y-6">
          <div
            className={`min-h-32 flex items-center justify-center p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-primary/20 transition-all duration-300 ${
              isFlipping ? "scale-95 opacity-50" : "scale-100 opacity-100"
            }`}
          >
            <p className="text-lg font-semibold text-foreground text-balance">{currentAffirmation}</p>
          </div>

          <Button
            onClick={getNewAffirmation}
            className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
            disabled={isFlipping}
          >
            New Affirmation
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}