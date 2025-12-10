"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Newspaper, Loader2, AlertTriangle } from "lucide-react"

// YENİ API ANAHTARI VE BASE URL'i KULLANILIYOR
// YENİ API ANAHTARI VE BASE URL'i KULLANILIYOR
const API_KEY = process.env.NEXT_PUBLIC_GNEWS_API_KEY
const BASE_URL = "https://gnews.io/api/v4/top-headlines"

// Sağlık ve yaşam tarzı haberlerini Türkçe çekiyoruz
const QUERY_PARAMS = "category=health&lang=tr&country=tr"

interface NewsItem {
  title: string;
  url: string;
  source: { name: string };
  publishedAt: string;
  description: string;
  isFallback?: boolean;
}

// YEDEK/FALLBACK HABERLER (API Limiti dolarsa veya hata verirse bunlar görünür)
const FALLBACK_NEWS: NewsItem[] = [
  {
    title: "Güne Zinde Başlamanın 5 Altın Kuralı: Su ve Esneme Hareketleri",
    url: "#",
    source: { name: "NewDay Sağlık Editörü" },
    publishedAt: new Date().toISOString(),
    description: "Sabahları daha enerjik uyanmak için basit ama etkili yöntemler.",
    isFallback: true
  },
  {
    title: "Masa Başı Çalışanlar İçin 3 Dakikalık Boyun Egzersizleri",
    url: "#",
    source: { name: "Uzman Fizyoterapist" },
    publishedAt: new Date().toISOString(),
    description: "Boyun ağrılarını hafifletmek için ofiste yapabileceğiniz pratik hareketler.",
    isFallback: true
  },
  {
    title: "Daha İyi Bir Uyku İçin Yatmadan Önce Tüketmeniz Gerekenler",
    url: "#",
    source: { name: "Beslenme Rehberi" },
    publishedAt: new Date().toISOString(),
    description: "Melatonin salgısını artıran ve uyku kalitesini iyileştiren doğal besinler.",
    isFallback: true
  }
];

export function NewsWidget() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Hata durumunu artık kullanıcıya yansıtmıyoruz, sessizce fallback'e geçiyoruz.
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      // Eğer API Key yoksa direkt fallback
      if (!API_KEY) {
        console.warn("GNews API Key eksik, yedek haberler gösteriliyor.");
        setNews(FALLBACK_NEWS);
        setUsingFallback(true);
        setLoading(false);
        return;
      }

      try {
        // GNews API çağrısı
        const response = await fetch(`${BASE_URL}?token=${API_KEY}&${QUERY_PARAMS}`);

        if (!response.ok) {
          throw new Error(`API Hatası: ${response.status}`);
        }

        const data = await response.json();

        if (data.articles && data.articles.length > 0) {
          setNews(data.articles.map((item: any) => ({
            title: item.title,
            url: item.url,
            source: { name: item.source.name },
            publishedAt: item.publishedAt,
            description: item.description
          })));
        } else {
          // Haber gelmezse fallback
          setNews(FALLBACK_NEWS);
          setUsingFallback(true);
        }

      } catch (err) {
        console.error("Haber yükleme hatası:", err);
        // Hata durumunda FALLBACK kullan
        setNews(FALLBACK_NEWS);
        setUsingFallback(true);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return <Card className="p-4 text-center"><Loader2 className="h-4 w-4 animate-spin inline mr-2" /> Haberler Yükleniyor...</Card>;
  }

  // Error state'i kaldırdık, her türlü içerik gösteriyoruz.

  return (
    <Card className="shadow-lg border-primary/20">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Newspaper className="h-5 w-5 text-primary" /> Günün Haberleri
        </CardTitle>
        {usingFallback && (
          <span className="text-[10px] bg-muted text-muted-foreground px-2 py-1 rounded-full">
            Önerilen İçerik
          </span>
        )}
      </CardHeader>
      <CardContent className="space-y-4 max-h-80 overflow-y-auto pr-2">
        {news.map((item, idx) => (
          <div key={idx} className="group border-b pb-3 last:border-b-0 last:pb-0">
            <a
              href={item.url}
              target={item.isFallback ? "_self" : "_blank"}
              rel="noopener noreferrer"
              className={`block transition-colors ${item.isFallback ? 'cursor-default' : 'hover:text-primary cursor-pointer'}`}
            >
              <h4 className="text-sm font-semibold leading-snug mb-1 group-hover:text-primary transition-colors">
                {item.title}
              </h4>
            </a>
            <p className="text-xs text-muted-foreground flex justify-between items-center">
              <span>{item.source.name}</span>
              <span>{new Date(item.publishedAt).toLocaleDateString("tr-TR")}</span>
            </p>
            {/* Fallback olmayan haberlerde açıklama da gösterebiliriz opsiyonel */}
            {item.isFallback && (
              <p className="text-xs text-muted-foreground mt-1 italic">
                {item.description}
              </p>
            )}
          </div>
        ))}
        {usingFallback && (
          <div className="text-xs text-center text-muted-foreground pt-2 border-t mt-2">
            * Canlı haber akışına şu an ulaşılamıyor.
          </div>
        )}
      </CardContent>
    </Card>
  );
}