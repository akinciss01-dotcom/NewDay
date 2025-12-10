"use client";

import { useRouter } from "next/navigation"; // Yönlendirme aracı
import LoginPage from "@/components/login-page";

export default function Page() {
  const router = useRouter(); // Aracımızı hazırlıyoruz

  const handleLogin = () => {
    // Giriş butonuna basınca burası çalışır
    console.log("Giriş başarılı, yönlendiriliyor...");
    router.push("/dashboard"); // --> İŞTE SİHİRLİ KOD (Dashboard'a git)
  };

  const handleShowSignUp = () => {
    console.log("Kayıt ol ekranına gidilecek");
    // İleride buraya kayıt sayfasına gitme kodu ekleriz
  };

  return (
    <LoginPage 
      onLogin={handleLogin} 
      onShowSignUp={handleShowSignUp} 
    />
  );
}