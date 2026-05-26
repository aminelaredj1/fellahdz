import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Leaf, Tractor, Store } from 'lucide-react';

export default function Home() {
  const t = useTranslations('Index');

  return (
    <div className="flex flex-col min-h-screen bg-[#f4f7f6]">
      {/* Navbar placeholder */}
      <header className="w-full p-6 flex justify-between items-center bg-white shadow-sm">
        <div className="flex items-center gap-2 text-green-700 font-bold text-2xl">
          <Leaf className="h-8 w-8" />
          <span>{t('title')}</span>
        </div>
        <div className="flex gap-4">
          <Link href="/" locale="ar" className="text-gray-600 hover:text-green-700 font-semibold">عربي</Link>
          <Link href="/" locale="fr" className="text-gray-600 hover:text-green-700 font-semibold">Français</Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-3xl space-y-8">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
            {t('heroTitle')}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
            {t('heroSubtitle')}
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              href="/auth/signup" 
              className="group relative flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 bg-green-700 hover:bg-green-800 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
              <Tractor className="h-6 w-6 z-10" />
              <span className="text-lg font-bold z-10">{t('iAmFarmer')}</span>
            </Link>

            <Link 
              href="/buyer" 
              className="group relative flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
              <Store className="h-6 w-6 z-10" />
              <span className="text-lg font-bold z-10">{t('iAmBuyer')}</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="py-8 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} {t('title')}. All rights reserved.
      </footer>
    </div>
  );
}
