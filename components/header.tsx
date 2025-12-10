"use client"

import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { LogOut, User } from "lucide-react"
import { useState } from "react"

interface HeaderProps {
  activeSection: string
  onSectionChange: (section: "home" | "selfcare" | "content" | "analytics" | "fitness") => void
}

export function Header({ activeSection, onSectionChange }: HeaderProps) {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })

  // ÇIKIŞ YAPMA FONKSİYONU
  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login") // Giriş sayfasına yönlendir
  }

  const sectionTitles = {
    home: "NewDay",
    selfcare: "Self Care",
    content: "Today's Content",
    analytics: "Your Insights",
    fitness: "Fitness & Health",
  }

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-card/80 border-b border-border/50 shadow-sm relative">
      <div className="container mx-auto px-4 py-4 max-w-md">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              {sectionTitles[activeSection as keyof typeof sectionTitles]}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">{today}</p>
          </div>

          <div className="relative">
            {/* Profil Butonu */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary/10 to-secondary/10 flex items-center justify-center border border-primary/20 hover:border-primary/50 transition-all shadow-sm"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary/20 to-secondary/20 flex items-center justify-center">
                <span className="text-xs font-bold text-primary">S</span>
              </div>
            </button>

            {/* Arka plan tıklama yakalayıcı (Menüyü kapatmak için) */}
            {isMenuOpen && (
              <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)} />
            )}

            {/* Şık Menü */}
            {isMenuOpen && (
              <div className="absolute top-12 right-0 w-48 bg-card/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-xl z-50 animate-in fade-in zoom-in-95 duration-200 p-2">
                <div className="px-3 py-2 border-b border-border/50 mb-1">
                  <p className="text-sm font-semibold text-foreground">Hesabım</p>
                  <p className="text-xs text-muted-foreground">Simge Akıncı</p>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-lg transition-colors text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Çıkış Yap
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  )
}