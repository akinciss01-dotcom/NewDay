"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// ----------------------------------------------------------------------
// STATİK VE YARDIMCI FONKSİYONLAR
// ----------------------------------------------------------------------

// Burç Adını (Zodiac Sign) Hesaplama Fonksiyonu
function getZodiacSign(day: number, month: number): string {
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries"
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus"
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini"
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer"
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo"
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo"
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra"
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio"
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius"
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricorn"
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius"
  return "Pisces"
}

// Burç Tarih Aralığını Gösterme Fonksiyonu (Statik)
function getZodiacDateRange(sign: string): string {
  const ranges: Record<string, string> = {
    Aries: "Mar 21 - Apr 19", Taurus: "Apr 20 - May 20", Gemini: "May 21 - Jun 20",
    Cancer: "Jun 21 - Jul 22", Leo: "Jul 23 - Aug 22", Virgo: "Aug 23 - Sep 22",
    Libra: "Sep 23 - Oct 22", Scorpio: "Oct 23 - Nov 21", Sagittarius: "Nov 22 - Dec 21",
    Capricorn: "Dec 22 - Jan 19", Aquarius: "Jan 20 - Feb 18", Pisces: "Feb 19 - Mar 20",
  }
  return ranges[sign] || ""
}


// ----------------------------------------------------------------------
// API VERİ ÇEKME FONKSİYONU (FREEASTROLOGYAPI İÇİN)
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------
// BURÇ YORUMU MOTORU (OFFLINE ENGINE)
// ----------------------------------------------------------------------

const ELEMENTS = {
  fire: ["Aries", "Leo", "Sagittarius"],
  earth: ["Taurus", "Virgo", "Capricorn"],
  air: ["Gemini", "Libra", "Aquarius"],
  water: ["Cancer", "Scorpio", "Pisces"]
};

// Genel yorum şablonları (Rastgele ama anlamlı cümleler)
const TEMPLATES = [
  "Bugün enerjiniz yüksek ve çevrenizdekileri etkiliyorsunuz. {focus} konusunda adımlar atmak için harika bir gün.",
  "Biraz içe dönmek ve {focus} üzerine düşünmek size iyi gelecek. Acele kararlar vermekten kaçının.",
  "Yıldızlar bugün size şans dağıtıyor! Özellikle {focus} alanında sürpriz gelişmeler yaşayabilirsiniz.",
  "Bugün iletişim trafiğiniz yoğun olabilir. {focus} ile ilgili konularda net olmaya özen gösterin.",
  "Duygusal olarak hassas bir gün geçirebilirsiniz. {focus} size denge getirecektir.",
  "Kariyer ve hedefleriniz ön planda. {focus} konusunda beklediğiniz fırsat kapınızı çalabilir.",
  "Sosyal çevrenizden alacağınız destekle {focus} konusundaki sorunları çözebilirsiniz.",
  "Maddi konularda tedbirli olmalısınız. Ancak {focus} size manevi zenginlik katacak.",
  "Yaratıcılığınızın zirvesindesiniz! {focus} ile ilgili projelerinizi hayata geçirin.",
  "Sağlığınıza ve dinlenmeye zaman ayırın. {focus} bugün sizin anahtar kelimeniz."
];

const FOCUS_AREAS = [
  "kişisel gelişim", "aşk hayatınız", "kariyer hedefleriniz", "aile bağlarınız",
  "yaratıcı projeler", "maddi konular", "sağlığınız", "sosyal ilişkileriniz",
  "iç huzurunuz", "eğitim hayatınız"
];

const LUCKY_NUMBERS = [3, 7, 8, 12, 21, 5, 9, 11, 44, 2];
const LUCKY_TIMES = ["09:00", "14:30", "11:11", "16:00", "20:00", "10:00", "15:45", "13:30"];
const MOODS = ["Enerjik", "Sakin", "Romantik", "Yaratıcı", "Kararlı", "Neşeli", "Odaklanmış", "Hassas"];

// Tarih ve Burca göre "rastgele" ama "sabit" bir sayı üreten fonksiyon
// (Bugün giren herkes aynı burç için aynı yorumu görsün diye)
function pseudoRandom(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // 32bit integer'a dönüştür
  }
  return Math.abs(hash);
}

async function fetchHoroscope(sign: string) {
  // API YERİNE YEREL MOTOR 🚀
  await new Promise(resolve => setTimeout(resolve, 600)); // Gerçekçilik için bekleme

  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const seed = `${today}-${sign}`;
  const rand = pseudoRandom(seed);

  // Rastgele seçimler (Seed'e bağlı olarak her gün değişir ama gün içinde sabittir)
  const templateIndex = rand % TEMPLATES.length;
  const focusIndex = (rand + 5) % FOCUS_AREAS.length;

  // Şablonu doldur
  const focus = FOCUS_AREAS[focusIndex];
  const description = TEMPLATES[templateIndex].replace("{focus}", focus);

  // Element belirle
  let element = "Bilinmiyor";
  if (ELEMENTS.fire.includes(sign)) element = "Ateş 🔥";
  else if (ELEMENTS.earth.includes(sign)) element = "Toprak 🌍";
  else if (ELEMENTS.air.includes(sign)) element = "Hava 💨";
  else if (ELEMENTS.water.includes(sign)) element = "Su 💧";

  return {
    description: description,
    mood: MOODS[rand % MOODS.length],
    lucky_number: LUCKY_NUMBERS[rand % LUCKY_NUMBERS.length].toString(),
    lucky_time: LUCKY_TIMES[rand % LUCKY_TIMES.length],
    element: element,
  };
}


// ----------------------------------------------------------------------
// ANA BİLEŞEN
// ----------------------------------------------------------------------

export function AstrologyWidget() {
  const [birthDate, setBirthDate] = useState("")
  const [userSign, setUserSign] = useState<string | null>(null)

  const [horoscopeData, setHoroscopeData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)

  // Sayfa yüklendiğinde localStorage'ı kontrol et
  useEffect(() => {
    const savedSign = localStorage.getItem("userZodiacSign")
    if (savedSign) {
      setUserSign(savedSign);
      handleDateSubmit(savedSign);
    }
  }, [])

  // API'den veri çekme ve burcu ayarlama ana fonksiyonu
  const handleDateSubmit = async (manualSign: string | null = null) => {
    let signToFetch: string;

    if (!manualSign && !birthDate) return;

    if (manualSign) {
      signToFetch = manualSign;
    } else {
      const dateParts = birthDate.split("-");
      // Tarih formatı YYYY-MM-DD olduğu için MM ve DD'yi alıyoruz
      const month = Number(dateParts[1]);
      const day = Number(dateParts[2]);
      signToFetch = getZodiacSign(day, month);
    }

    setUserSign(signToFetch);
    setIsLoading(true);
    setFetchError(null);
    setHoroscopeData(null);

    const data = await fetchHoroscope(signToFetch);

    setIsLoading(false);

    if (data) {
      setHoroscopeData(data);
      localStorage.setItem("userZodiacSign", signToFetch);
      if (!manualSign) localStorage.setItem("userBirthDate", birthDate);
    } else {
      // Hata durumunda gösterilecek mesaj
      setFetchError("Yorum alınamadı. Anahtar/Limit kontrolü veya API hatası.");
    }
  }

  const handleManualDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBirthDate(e.target.value);
    setUserSign(null);
    setHoroscopeData(null);
  }

  const resetHoroscope = () => {
    setUserSign(null);
    setHoroscopeData(null);
    setBirthDate("");
    localStorage.removeItem("userZodiacSign");
    localStorage.removeItem("userBirthDate");
  }

  const horoscope = horoscopeData;

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
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          </div>
          <CardTitle className="text-lg">Your Personal Horoscope</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {isLoading && (
          <div className="text-center py-10 text-secondary animate-pulse">
            Burç yorumu yükleniyor...
          </div>
        )}

        {fetchError && (
          <div className="text-center py-10 text-red-500">
            Hata: {fetchError}
          </div>
        )}

        {/* Giriş Ekranı */}
        {!userSign || !horoscopeData ? (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <p className="text-sm text-muted-foreground">Enter your birth date to get personalized readings</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="birthdate" className="text-sm font-medium">
                Birth Date
              </Label>
              <Input
                id="birthdate"
                type="date"
                value={birthDate}
                onChange={handleManualDateChange}
                className="rounded-xl border-2 bg-background/50"
              />
            </div>
            <Button
              onClick={() => handleDateSubmit(null)}
              className="w-full rounded-xl bg-gradient-to-r from-secondary to-accent hover:opacity-90 text-white"
              disabled={!birthDate}
            >
              Get My Horoscope
            </Button>
          </div>
        ) : (
          /* Yorum Gösterim Ekranı */
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                {userSign}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">{getZodiacDateRange(userSign)}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-primary/10 rounded-full text-xs font-medium text-primary">
                {horoscope?.element || 'Element Verisi Yok'}
              </span>
            </div>

            <p className="text-sm text-foreground text-center leading-relaxed px-2">
              {horoscope?.description || 'Yorum Metni Yüklenemedi.'}
            </p>

            <div className="bg-accent/5 rounded-xl p-4 border border-accent/20">
              <p className="text-xs text-muted-foreground mb-1 text-center">Today's Advice (Lucky Time)</p>
              <p className="text-sm font-medium text-center text-accent">
                {horoscope?.lucky_time || 'Zaman Verisi Yok'}
              </p>
            </div>

            <div className="flex justify-center gap-6 pt-4 border-t border-border/50">
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Lucky Number</p>
                <p className="text-lg font-bold text-secondary">{horoscope?.lucky_number || '-'}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Mood</p>
                <p className="text-lg font-bold text-accent">{horoscope?.mood || '-'}</p>
              </div>
            </div>

            <Button
              onClick={resetHoroscope}
              variant="ghost"
              className="w-full text-xs text-muted-foreground hover:text-foreground"
            >
              Change Birth Date
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}