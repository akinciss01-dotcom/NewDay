"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

// --- Tür Tanımlamaları ---
// Context'in taşıyacağı değerlerin yapısını tanımlıyoruz
interface AuthContextType {
  user: any;        // Kullanıcı nesnesi (şimdilik any, ileride kendi tipinizle değişir)
  loading: boolean; // Yüklenme durumu
  logout: () => void; // Oturumu kapatma fonksiyonu
}

// Güvenli başlangıç değeri. Context, tanımlanan tiptedir veya tanımsızdır.
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 2. Custom Hook: Context'e kolay erişim
// Bu hook, bileşenlerinizin Context verilerine erişmesini sağlar.
export const useAuth = () => {
  const context = useContext(AuthContext); 
  if (context === undefined) {
    // Provider olmadan çağrılırsa hata verir.
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// 3. Provider Component'i: State yönetimini yapar
// Bu bileşen, uygulamanın diğer kısımlarına kullanıcı durumunu sağlar.
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // 🔥 Firebase kullanmadığımız için varsayılan değerler
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false); // Başlangıçta false yapıldı

  useEffect(() => {
    // 🔥 Bu kısım artık pasif. 
    // İleride kendi API'nizden kullanıcı kontrolü yapabilirsiniz.
    setLoading(false); 
  }, []);

  // Oturumu Kapatma Fonksiyonu (Pasif/Mock)
  const logout = () => {
    console.log("Oturum kapatma işlemi (Firebase devre dışı).");
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    loading,
    logout,
  };

  // Yükleme sırasında bir şey göstermek isterseniz (Şu an hep false)
  if (loading) return <div>Uygulama Yükleniyor...</div>;

  return (
      <AuthContext.Provider value={value}>
          {children}
      </AuthContext.Provider>
  );
};