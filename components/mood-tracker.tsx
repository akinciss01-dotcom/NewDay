"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"

interface MoodTrackerProps {
  onMoodChange?: (mood: string) => void
}

export function MoodTracker({ onMoodChange }: MoodTrackerProps) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const moods = [
    { emoji: "😄", label: "Happy", value: "happy" },
    { emoji: "😌", label: "Calm", value: "calm" },
    { emoji: "⚡", label: "Energetic", value: "energetic" },
    { emoji: "😔", label: "Sad", value: "sad" },
    { emoji: "😟", label: "Anxious", value: "anxious" },
    { emoji: "😴", label: "Tired", value: "tired" },
  ]

  const handleSaveMood = async (moodValue: string) => {
    try {
      setLoading(true)
      setSelectedMood(moodValue)

      // 🔥 ANINDA YANSITMA: Arkaplan rengini hemen değiştir
      if (onMoodChange) onMoodChange(moodValue)

      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        // alert("Lütfen önce giriş yapın!") // İsteğe bağlı: Kullanıcıyı rahatsız etmemek için alert'i kaldırabiliriz
        return
      }

      const { error } = await supabase
        .from('moods')
        .insert({
          user_id: user.id,
          mood: moodValue,
          note: "Uygulamadan eklendi"
        })

      if (error) throw error

      console.log("Mod kaydedildi") // Alert yerine console.log daha az rahatsız edici


    } catch (error) {
      console.error("Hata:", error)
      alert("Kaydedilemedi :(")
    } finally {
      setLoading(false)
    }
  }

  // BU KOD KARANLIK TEMAYA UYUM SAĞLAMAK İÇİN CARD BİLEŞENİNİ GÜNCELLİYOR
  return (
    <Card className={`
      transition-colors duration-700 ease-in-out
      ${
      // Eğer seçilen mod negatifse (karanlık tema), Mood Tracker kartı da koyu olsun
      selectedMood === 'sad' || selectedMood === 'anxious' || selectedMood === 'tired'
        ? 'bg-card/70 backdrop-blur-sm border-border' // Koyu temada koyu kart
        : 'bg-white/70 backdrop-blur-sm border-border/50' // Açık temada şeffaf açık kart
      }
    `}>
      <CardHeader>
        <CardTitle>How are you feeling?</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3"> {/* Daha fazla emoji olduğu için grid kullandık */}
          {moods.map((mood) => (
            <Button
              key={mood.value}
              variant={selectedMood === mood.value ? "default" : "outline"}
              className={`
                flex flex-col items-center justify-center h-16 w-full text-xl transition-all hover:scale-105 
                ${selectedMood === mood.value ? 'shadow-lg' : ''}
                ${
                // Butonların rengini seçili moda göre daha belirgin yapıyoruz
                selectedMood === mood.value
                  ? 'bg-primary text-white border-primary/20'
                  : 'bg-white/50 border-gray-200 hover:bg-gray-100' // Seçili değilse açık kalsın
                }
              `}
              onClick={() => handleSaveMood(mood.value)}
              disabled={loading}
            >
              {mood.emoji}
              <span className="text-xs font-medium mt-1">{mood.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}