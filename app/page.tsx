import Link from "next/link";
import { Button } from "@/components/ui/button";

// Bu fonksiyon, uygulamanın ana giriş sayfasını (/) temsil eder
export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white gap-4">
      <h1 className="text-4xl font-bold">NewDay'e Hoşgeldin</h1>
      <p className="text-gray-400">Güne harika bir başlangıç yap.</p>
      
      {/* Bu Link, butonu sarmalar ve tıklandığında /login sayfasına götürür */}
      <Link href="/login">
        <Button size="lg" className="bg-white text-black hover:bg-gray-200">
          Uygulamaya Gir
        </Button>
      </Link>
    </div>
  );
}