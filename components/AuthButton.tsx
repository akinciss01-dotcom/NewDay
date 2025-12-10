// app/components/AuthButton.tsx

import React from 'react';
import { useAuth } from '@/app/context/AuthContext'; // Doğru varsayılan yol

const AuthButton: React.FC = () => {
  // 🔥 Düzeltme: useAuth hook'u artık Firebase'e bağlı değildir, ancak yine de kullanılabilir.
  const { user, logout, loading } = useAuth();

  // Loading devam ediyorsa düğmeyi gösterme
  if (loading) {
    return <div>Oturum Kontrol Ediliyor...</div>;
  }

  // Google ile Giriş yapma fonksiyonu (Şimdilik sadece konsola yazar)
  const handleSignIn = async () => {
    // 🔥 Burası ileride gerçek giriş API çağrısı ile doldurulacaktır.
    console.log("Giriş Yapılmaya Çalışıldı - API Bağlantısı Bekleniyor.");
  };

  return (
    <div style={{ padding: '10px', border: '1px dashed #4285F4', borderRadius: '8px', margin: '5px', fontSize: '12px' }}>
      {user ? (
        // Kullanıcı giriş yapmışsa
        <>
          <p>Hoş Geldiniz, **{user.displayName || user.email || 'Misafir'}**!</p>
          <button 
            onClick={logout} 
            style={{ padding: '5px 10px', backgroundColor: '#f44336', color: 'white', border: 'none', cursor: 'pointer' }}
          >
            Çıkış Yap (Pasif)
          </button>
        </>
      ) : (
        // Kullanıcı giriş yapmamışsa
        <button 
          onClick={handleSignIn} 
          style={{ padding: '5px 10px', backgroundColor: '#4285F4', color: 'white', border: 'none', cursor: 'not-allowed' }}
        >
          Giriş Yap (Pasif)
        </button>
      )}
      <p style={{marginTop: '5px', color: '#999'}}>*Auth sistemi devre dışı*</p>
    </div>
  );
};

export default AuthButton;