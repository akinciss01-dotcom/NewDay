"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface GratitudeNote {
  id: string
  text: string
  date: string
}

export function GratitudeJar() {
  const [notes, setNotes] = useState<GratitudeNote[]>([])
  const [newNote, setNewNote] = useState("")
  const [isAdding, setIsAdding] = useState(false)

  const addNote = () => {
    if (!newNote.trim()) return

    const note: GratitudeNote = {
      id: Date.now().toString(),
      text: newNote,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    }

    setNotes([note, ...notes])
    setNewNote("")
    setIsAdding(false)
  }

  return (
    <Card className="border-2 border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                />
              </svg>
            </div>
            <CardTitle className="text-lg">Gratitude Jar</CardTitle>
          </div>
          <div className="text-sm font-semibold text-primary">{notes.length} notes</div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {isAdding ? (
          <div className="space-y-3 animate-in fade-in slide-in-from-top-4">
            <Input
              placeholder="What are you grateful for today?"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addNote()}
              className="border-primary/20 focus:border-primary"
            />
            <div className="flex gap-2">
              <Button onClick={addNote} className="flex-1 bg-gradient-to-r from-primary to-secondary">
                Add Note
              </Button>
              <Button onClick={() => setIsAdding(false)} variant="outline">
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            <Button
              onClick={() => setIsAdding(true)}
              className="w-full mb-4 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
            >
              Add Gratitude
            </Button>

            {notes.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className="p-3 rounded-lg bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10 animate-in fade-in slide-in-from-bottom-2"
                  >
                    <p className="text-sm text-foreground">{note.text}</p>
                    <p className="text-xs text-muted-foreground mt-1">{note.date}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-6">
                Start filling your gratitude jar with things you're thankful for
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
