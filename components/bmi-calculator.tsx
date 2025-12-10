"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export function BmiCalculator() {
  const [height, setHeight] = useState("")
  const [weight, setWeight] = useState("")
  const [bmi, setBmi] = useState<number | null>(null)
  const [category, setCategory] = useState("")

  const calculateBMI = () => {
    const h = Number.parseFloat(height) / 100
    const w = Number.parseFloat(weight)
    if (h > 0 && w > 0) {
      const bmiValue = w / (h * h)
      setBmi(Number.parseFloat(bmiValue.toFixed(1)))

      if (bmiValue < 18.5) setCategory("Underweight")
      else if (bmiValue < 25) setCategory("Normal weight")
      else if (bmiValue < 30) setCategory("Overweight")
      else setCategory("Obese")
    }
  }

  const getBMIColor = () => {
    if (!bmi) return "text-muted-foreground"
    if (bmi < 18.5) return "text-blue-500"
    if (bmi < 25) return "text-green-500"
    if (bmi < 30) return "text-orange-500"
    return "text-red-500"
  }

  return (
    <Card className="border-secondary/20 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-secondary/10 to-accent/10">
        <CardTitle className="flex items-center gap-2">
          <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
          BMI Calculator
        </CardTitle>
        <CardDescription>Calculate your Body Mass Index</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="height">Height (cm)</Label>
            <Input
              id="height"
              type="number"
              placeholder="170"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="border-secondary/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              placeholder="70"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="border-secondary/20"
            />
          </div>

          <Button onClick={calculateBMI} className="w-full bg-gradient-to-r from-secondary to-accent hover:opacity-90">
            Calculate BMI
          </Button>

          {bmi !== null && (
            <div className="mt-6 p-4 rounded-lg bg-gradient-to-br from-secondary/5 to-accent/5 text-center">
              <div className={`text-4xl font-bold ${getBMIColor()} mb-2`}>{bmi}</div>
              <div className="text-sm font-medium text-foreground">{category}</div>
              <div className="text-xs text-muted-foreground mt-2">BMI Range: 18.5 - 24.9 is normal</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}