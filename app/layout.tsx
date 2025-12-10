// app/layout.tsx

import type { Metadata } from 'next';
// Varsayılan stil dosyanızı import edin
import './globals.css';

// 🔥 EKLENMESİ GEREKEN SATIR: AuthProvider'ı doğru yoldan import ediyoruz.
// AuthContext.tsx, 'app/context/' klasöründe ise bu yol doğrudur.
import { AuthProvider } from './context/AuthContext';

export const metadata: Metadata = {
  title: 'NewDay Uygulaması',
  description: 'Firebase ve Google ile Giriş entegrasyonu',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body>
        {/* 🔥 TÜM UYGULAMAYI AuthProvider ile sarmalıyoruz */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}