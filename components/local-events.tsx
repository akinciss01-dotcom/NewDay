"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Event {
  id: string
  title: string
  type: "concert" | "theater" | "cinema" | "festival" | "exhibition"
  date: string
  time: string
  venue: string
  price: string
  image: string
  city: string
}

export function LocalEvents() {
  const [selectedCity, setSelectedCity] = useState("Istanbul")

  // ETKİNLİK MOTORU (OFFLINE ENGINE)
  // Gerçek zamanlı hissi vermek için tarihleri bugüne göre hesaplayalım
  const generateEvents = () => {
    const today = new Date();
    const oneDay = 24 * 60 * 60 * 1000;

    // Yardımcı: Tarih formatla (YYYY-MM-DD)
    const getDate = (offset: number) => {
      const d = new Date(today.getTime() + (offset * oneDay));
      return d.toISOString().split('T')[0];
    };

    return [
      {
        id: "1",
        title: "Jazz Night at Blue Note",
        type: "concert",
        date: getDate(0), // Bugün
        time: "21:00",
        venue: "Blue Note Jazz Club",
        price: "₺350",
        image: "/lively-jazz-concert.jpg",
        city: "Istanbul",
      },
      {
        id: "2",
        title: "Modern Hamlet Adaptasyonu",
        type: "theater",
        date: getDate(2), // 2 gün sonra
        time: "19:30",
        venue: "Şehir Tiyatroları",
        price: "₺200",
        image: "/theater-stage.jpg",
        city: "Istanbul",
      },
      {
        id: "3",
        title: "Yaz Müzik Festivali Açılışı",
        type: "festival",
        date: getDate(5),
        time: "14:00",
        venue: "Küçükçiftlik Park",
        price: "₺500",
        image: "/vibrant-music-festival.jpg",
        city: "Istanbul",
      },
      {
        id: "4",
        title: "Vizyondakiler: The Matrix",
        type: "cinema",
        date: getDate(1),
        time: "21:00",
        venue: "Grand Pera Sineması",
        price: "₺150",
        image: "/cinema-screen.jpg",
        city: "Istanbul",
      },
      {
        id: "5",
        title: "CSO Ada Konseri",
        type: "concert",
        date: getDate(3),
        time: "20:00",
        venue: "CSO Ada",
        price: "₺450",
        image: "/lively-jazz-concert.jpg",
        city: "Ankara",
      },
      {
        id: "6",
        title: "Stand-up Gecesi",
        type: "theater",
        date: getDate(1),
        time: "20:30",
        venue: "BKM Mutfak",
        price: "₺150",
        image: "/theater-stage.jpg",
        city: "Izmir",
      },
      {
        id: "7",
        title: "Plaj Festivali",
        type: "festival",
        date: getDate(4),
        time: "15:00",
        venue: "Bodrum Sahil",
        price: "₺400",
        image: "/vibrant-music-festival.jpg",
        city: "Muğla",
      },
      {
        id: "8",
        title: "Klasik Müzik Akşamı",
        type: "concert",
        date: getDate(2),
        time: "19:00",
        venue: "Kültür Merkezi",
        price: "₺250",
        image: "/lively-jazz-concert.jpg",
        city: "Muğla",
      },
      {
        id: "9",
        title: "Açık Hava Sineması",
        type: "cinema",
        date: getDate(0),
        time: "21:00",
        venue: "Şehir Parkı",
        price: "₺120",
        image: "/cinema-screen.jpg",
        city: "Adana",
      },
      {
        id: "10",
        title: "Geleneksel Dans Gösterisi",
        type: "theater",
        date: getDate(3),
        time: "20:00",
        venue: "Devlet Tiyatrosu",
        price: "₺180",
        image: "/theater-stage.jpg",
        city: "Adana",
      },
    ] as Event[];
  };

  const [events] = useState<Event[]>(generateEvents())

  const [selectedType, setSelectedType] = useState<string>("all")
  const cities = ["Istanbul", "Ankara", "Izmir", "Antalya", "Muğla", "Adana"]

  const getTypeIcon = (type: Event["type"]) => {
    switch (type) {
      case "concert":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
        )
      case "theater":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
          </svg>
        )
      case "cinema":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
          </svg>
        )
      case "festival":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        )
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )
    }
  }

  const getTypeLabel = (type: Event["type"]) => {
    const labels = { concert: "Konser", theater: "Tiyatro", cinema: "Sinema", festival: "Festival", exhibition: "Sergi" }
    return labels[type]
  }

  const filteredEvents = events.filter((e) => {
    const matchesCity = e.city === selectedCity
    const matchesType = selectedType === "all" || e.type === selectedType
    return matchesCity && matchesType
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("tr-TR", { day: "numeric", month: "long" })
  }

  return (
    <Card className="border-none shadow-lg bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 animate-fade-in">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Yakındaki Etkinlikler
        </CardTitle>
        <p className="text-sm text-muted-foreground">Bölgenizdeki etkinlikleri kaçırmayın</p>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <label className="text-xs text-muted-foreground mb-2 block">Şehir Seçin</label>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {cities.map((city) => (
              <Button
                key={city}
                variant={selectedCity === city ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCity(city)}
                className="rounded-full text-xs whitespace-nowrap"
              >
                {city}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
          <Button variant={selectedType === "all" ? "default" : "outline"} size="sm" onClick={() => setSelectedType("all")} className="rounded-full text-xs whitespace-nowrap">Tümü</Button>
          <Button variant={selectedType === "concert" ? "default" : "outline"} size="sm" onClick={() => setSelectedType("concert")} className="rounded-full text-xs whitespace-nowrap">Konser</Button>
          <Button variant={selectedType === "theater" ? "default" : "outline"} size="sm" onClick={() => setSelectedType("theater")} className="rounded-full text-xs whitespace-nowrap">Tiyatro</Button>
          <Button variant={selectedType === "cinema" ? "default" : "outline"} size="sm" onClick={() => setSelectedType("cinema")} className="rounded-full text-xs whitespace-nowrap">Sinema</Button>
          <Button variant={selectedType === "festival" ? "default" : "outline"} size="sm" onClick={() => setSelectedType("festival")} className="rounded-full text-xs whitespace-nowrap">Festival</Button>
        </div>

        <div className="space-y-3">
          {filteredEvents.map((event, index) => (
            <div key={event.id} className="bg-card/60 backdrop-blur-sm rounded-2xl p-3 hover:shadow-md transition-all animate-slide-in" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="flex gap-3">
                <img src={event.image || "/placeholder.svg"} alt={event.title} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-sm text-foreground line-clamp-1">{event.title}</h3>
                    <span className="text-xs font-bold text-primary flex-shrink-0">{event.price}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                    {getTypeIcon(event.type)}
                    <span>{getTypeLabel(event.type)}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <span>{formatDate(event.date)} • {event.time}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground line-clamp-1">
                    <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    <span>{event.venue}</span>
                  </div>
                </div>
              </div>
              <Button size="sm" className="w-full mt-3 rounded-xl bg-gradient-to-r from-primary/80 to-secondary/80 hover:from-primary hover:to-secondary">Detayları Gör</Button>
            </div>
          ))}
        </div>
        {filteredEvents.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">Bu şehirde ve kategoride etkinlik bulunamadı</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}