"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface Dream {
  id: string
  date: string
  content: string
  mood: string
}

export function DreamJournal() {
  const [dreams, setDreams] = useState<Dream[]>([])
  const [newDream, setNewDream] = useState("")
  const [isWriting, setIsWriting] = useState(false)

  const addDream = () => {
    if (!newDream.trim()) return

    const dream: Dream = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      content: newDream,
      mood: "peaceful",
    }

    setDreams([dream, ...dreams])
    setNewDream("")
    setIsWriting(false)
  }

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
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            </div>
            <CardTitle className="text-lg">Dream Journal</CardTitle>
          </div>
          <Button
            size="sm"
            onClick={() => setIsWriting(!isWriting)}
            className="bg-gradient-to-r from-secondary to-accent hover:opacity-90"
          >
            {isWriting ? "Cancel" : "Write"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {isWriting ? (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-4">
            <Textarea
              placeholder="Describe your dream..."
              value={newDream}
              onChange={(e) => setNewDream(e.target.value)}
              className="min-h-32 border-secondary/20 focus:border-secondary resize-none"
            />
            <Button onClick={addDream} className="w-full bg-gradient-to-r from-secondary to-accent">
              Save Dream
            </Button>
          </div>
        ) : dreams.length > 0 ? (
          <div className="space-y-3">
            {dreams.slice(0, 3).map((dream) => (
              <div
                key={dream.id}
                className="p-4 rounded-xl bg-gradient-to-br from-secondary/5 to-accent/5 border border-secondary/10 animate-in fade-in slide-in-from-bottom-4"
              >
                <p className="text-xs text-muted-foreground mb-2">{dream.date}</p>
                <p className="text-sm text-foreground line-clamp-3">{dream.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">
            No dreams recorded yet. Start writing to remember your dreams.
          </p>
        )}
      </CardContent>
    </Card>
  )
}