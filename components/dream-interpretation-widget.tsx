"use client"

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// ----------------------------------------------------------------------
// API VERİ ÇEKME FONKSİYONU (RAPIDAPI)
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------
// RÜYA TABİRLERİ SÖZLÜĞÜ (OFFLINE ENGINE)
// ----------------------------------------------------------------------

const DREAM_DICTIONARY: Record<string, string> = {
    // DOĞA & ELEMENTLER
    "su": "Su, duygusal durumunuzu yansıtır. Berrak su huzur ve arınmayı, bulanık su ise kafa karışıklığını simgeler.",
    "deniz": "Deniz, hayatınızdaki büyük değişimleri ve potansiyeli temsil eder. Dalgalıysa içsel karmaşa, durgunsa huzur demektir.",
    "yağmur": "Yağmur, bereket ve ruhsal temizlik anlamına gelir. Zorlukların ardından gelecek rahatlamayı müjdeler.",
    "ateş": "Ateş, tutku, öfke veya dönüşümü simgeler. Kontrollü ateş güç kazanmayı, yangın ise kontrol kaybını işaret eder.",
    "rüzgar": "Rüzgar, hayatınızdaki hızlı değişimleri ve haberleri temsil eder.",
    "ağaç": "Ağaç, köklenme, büyüme ve aile bağlarını simgeler. Yemyeşil bir ağaç sağlık ve uzun ömür demektir.",
    "çiçek": "Çiçek, yeni başlangıçları, umudu ve güzelliği temsil eder.",
    "yılan": "Yılan, hem şifayı hem de gizli düşmanları simgeler. Deri değiştirmesi kişisel dönüşüm anlamına gelir.",
    "köpek": "Köpek, sadakat ve dostluğu temsil eder. Saldırgan köpek ise ihanet veya güvensizlik uyarısıdır.",
    "kedi": "Kedi, bağımsızlığı, sezgileri ve dişi enerjiyi simgeler.",
    "kuş": "Kuş, özgürlük, haber ve ruhsal yükselişi temsil eder. Uçmak, sınırlardan kurtulma isteğidir.",
    "at": "At, gücü, asaleti ve yolculuğu simgeler. Beyaz at murada ermektir.",
    "balık": "Balık, kısmet ve bolluk demektir. Büyük balık büyük fırsatları işaret eder.",
    "diş": "Diş dökülmesi genellikle güç kaybı, kaygı veya bir değişimin habercisi olarak yorumlanır.",
    "saç": "Saç, kişisel gücü ve imajı temsil eder. Saç kestirmek yüklerden kurtulmak istemektir.",
    "bebek": "Bebek, masumiyet ve yeni başlangıçları, bazen de ilgi bekleyen bir projeyi simgeler.",
    "ölüm": "Rüyada ölüm, aslında bir son değil, yeni bir başlangıç ve dönüşümdür. Eski bir durumun bitişini gösterir.",
    "düğün": "Düğün, yeni sorumluluklar veya hayatınızdaki zıt kutupların birleşmesi anlamına gelir.",
    "para": "Para, kendi öz değerinizi ve enerjinizi nasıl kullandığınızı yansıtır. Güç ve yetenek sembolüdür.",
    "ev": "Ev, sizin benliğinizi temsil eder. Odalar hayatınızın farklı alanlarını simgeler.",
    "okul": "Okul, hayat derslerini ve öğrenilmesi gereken bir durumu işaret eder. Sınav kaygısı performans endişesidir.",
    "uçmak": "Uçmak, engelleri aşma, özgürleşme ve olaylara yukarıdan bakma isteğini gösterir.",
    "düşmek": "Düşmek, kontrol kaybı korkusunu ve güvensizliği simgeler.",
    "kovalanmak": "Kovalanmak, yüzleşmekten kaçtığınız bir sorunu veya duyguyu gösterir.",
    "ağlamak": "Rüyada ağlamak, gerçek hayatta sevinmeye ve rahatlamaya işarettir.",
    "gülmek": "Gülmek, bazen bastırılmış gerginliği bazen de yaklaşan mutlu haberleri simgeler.",
    "yol": "Yol, hayat yolculuğunu simgeler. Düz yol kolaylığı, engebeli yol zorlukları anlatır.",
    "ayna": "Ayna, kendinizle yüzleşmeyi ve bilinçaltınızı temsil eder.",
    "anahtar": "Anahtar, yeni fırsatları, çözümleri ve sırları açığa çıkarmayı simgeler.",
    "kapı": "Kapı, geçiş dönemlerini ve fırsatları temsil eder. Kapalı kapı engel, açık kapı davettir.",

    // EYLEMLER & DURUMLAR
    "koşmak": "Koşmak, hedefe ulaşma arzusunu veya bir şeyden kaçışı simgeler.",
    "yemek": "Yemek yemek, ruhsal veya fiziksel açlığı, tatmini simgeler.",
    "temizlik": "Temizlik yapmak, hayatınızdaki fazlalıklardan ve negatiflikten arınma isteğidir.",
    "araba": "Araba, hayatınızın kontrolünü ve gidişatını simgeler. Kimin kullandığı önemlidir.",
    "ucak": "Uçak, hızlı yükselişi, seyahati ve geniş vizyonu temsil eder.",
    "telefon": "Telefon, iletişim ihtiyacını veya beklenen bir haberi simgeler.",
    "ayakkabı": "Ayakkabı, hayattaki duruşunuzu ve temelinizi simgeler. Yeni ayakkabı yeni adımlardır."
};

// Basit Fuzzy Search (Benzerlik Arama) Fonksiyonu
function findDescription(query: string): string | null {
    const lowerQuery = query.toLowerCase().trim();
    if (!lowerQuery) return null;

    // 1. Tam Eşleşme
    if (DREAM_DICTIONARY[lowerQuery]) {
        return DREAM_DICTIONARY[lowerQuery];
    }

    // 2. İçinde Geçenler (Örn: "beyaz kedi" ararsa "kedi"yi bulsun)
    const foundKey = Object.keys(DREAM_DICTIONARY).find(key => lowerQuery.includes(key));
    if (foundKey) {
        return DREAM_DICTIONARY[foundKey];
    }

    return null;
}

async function fetchDreamInterpretation(symbol: string) {
    // API YERİNE YEREL MOTOR KULLANILIYOR 🚀
    // Gerçekçi bir bekleme süresi ekleyelim (kullanıcı işlem yapıldığını hissetsin)
    await new Promise(resolve => setTimeout(resolve, 800));

    const result = findDescription(symbol);

    if (result) {
        return {
            interpretation: result
        };
    } else {
        // Bulunamazsa genel bir cevap döndür
        return {
            interpretation: `"${symbol}" sembolü için özel bir kayıt bulunamadı, ancak rüyalar genellikle bilinçaltınızın size bir mesajıdır. Bu sembolün sizin için kişisel anlamını düşünün. Genellikle rüyadaki hisleriniz (korku, neşe, huzur) en iyi rehberdir.`
        };
    }
}


// ----------------------------------------------------------------------
// ANA BİLEŞEN
// ----------------------------------------------------------------------

export function DreamInterpretationWidget() {
    const [symbol, setSymbol] = useState('');
    const [interpretation, setInterpretation] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (!symbol) return;

        setIsLoading(true);
        setError(null);
        setInterpretation(null);

        const result = await fetchDreamInterpretation(symbol);

        setIsLoading(false);

        // Offline motor her zaman { interpretation: string } döner
        setInterpretation(result.interpretation);
    };

    return (
        <Card className="border-2 border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <CardTitle className="text-lg">Rüya Tabirleri (Çevrimdışı)</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
                <p className="text-sm text-muted-foreground">Rüyanızdaki sembolü girin (Örn: Su, Yılan, Uçmak)</p>

                <div className="space-y-2">
                    <Label htmlFor="dream-symbol" className="text-sm font-medium">
                        Rüya Sembolü
                    </Label>
                    <Input
                        id="dream-symbol"
                        type="text"
                        value={symbol}
                        onChange={(e) => setSymbol(e.target.value)}
                        placeholder="Sembol girin..."
                        className="rounded-xl border-2 bg-background/50"
                        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    />
                </div>

                <Button
                    onClick={handleSubmit}
                    className="w-full rounded-xl bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white"
                    disabled={!symbol || isLoading}
                >
                    {isLoading ? 'Yorumlanıyor...' : 'Yorumla'}
                </Button>

                {/* Sonuç Alanı */}
                <div className="pt-4 border-t border-border/50">
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    {interpretation && (
                        <div className="bg-green-50/50 p-4 rounded-xl border border-green-200">
                            <h4 className="font-semibold text-green-700 mb-2">{symbol.toUpperCase()} Anlamı:</h4>
                            <p className="text-sm text-foreground leading-relaxed">{interpretation}</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}