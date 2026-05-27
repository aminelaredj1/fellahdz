"use client";

import { useState } from 'react';
import { Link } from '@/i18n/routing';

export default function Home() {
  const [activeRole, setActiveRole] = useState<string | null>(null);

  const stats = [
    { id: 1, value: '+15,000', label: 'فلاح مسجل', color: 'text-emerald-700' },
    { id: 2, value: '58', label: 'ولاية مغطاة', color: 'text-red-600' },
    { id: 3, value: '+50k', label: 'طلبية ناجحة', color: 'text-emerald-700' },
    { id: 4, value: '100%', label: 'اتصال مباشر', color: 'text-slate-800' },
  ];

  const steps = [
    {
      id: 1,
      title: 'أضف منتجاتك',
      desc: 'الفلاح يضيف المحاصيل مع تحديد السعر والكمية.',
      icon: (
        <svg className="w-10 h-10 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
        </svg>
      ),
      borderColor: 'border-emerald-200',
      bgColor: 'bg-emerald-50',
    },
    {
      id: 2,
      title: 'الزبون يطلب',
      desc: 'المشتري يتصفح ويتواصل مباشرة بدون وسيط.',
      icon: (
        <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      borderColor: 'border-red-200',
      bgColor: 'bg-red-50',
    },
    {
      id: 3,
      title: 'النقل السريع',
      desc: 'الناقل يستلم الطلبية ويوصلها بأمان.',
      icon: (
        <svg className="w-10 h-10 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
      borderColor: 'border-slate-200',
      bgColor: 'bg-slate-50',
    },
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 font-cairo text-slate-800 selection:bg-emerald-200 selection:text-emerald-900 overflow-x-hidden">
      
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-emerald-600/10 blur-[120px]" />
        <div className="absolute top-[40%] -left-[10%] w-[40%] h-[40%] rounded-full bg-red-600/5 blur-[100px]" />
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer">
              <svg className="w-8 h-8 text-emerald-700" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <span className="text-2xl font-black tracking-tighter text-slate-900">
                فلاح <span className="text-red-600">DZ</span>
              </span>
            </div>

            {/* Quick Links & Lang */}
            <div className="hidden md:flex items-center gap-8 font-semibold">
              <a href="#how-it-works" className="text-slate-600 hover:text-emerald-700 transition-colors">كيف تعمل المنصة؟</a>
              <div className="h-6 w-px bg-gray-200" />
              <div className="flex items-center gap-3 text-sm">
                <span className="cursor-pointer text-slate-400 hover:text-slate-600 transition-colors">Français</span>
                <span className="cursor-pointer text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">عربي</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 w-full">
        
        {/* Hero Section */}
        <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-tight mb-6">
            أفضل منصة زراعية <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-emerald-700 to-emerald-500">
              في الجزائر
            </span>
          </h1>
          <p className="text-lg md:text-2xl text-slate-600 max-w-3xl mx-auto mb-14 font-medium leading-relaxed">
            اربط بين الفلاحين والزبائن مباشرة وبدون وسطاء. منصة متكاملة لدعم الاقتصاد الزراعي الوطني.
          </p>

          {/* Role Selection Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            
            {/* Farmer Button */}
            <Link href="/auth/login" passHref>
              <button
                onClick={() => setActiveRole('farmer')}
                className={`w-full h-full relative group flex flex-col items-center justify-center gap-4 p-10 rounded-[2.5rem] transition-all duration-500 border-2 ${
                  activeRole === 'farmer' 
                  ? 'border-emerald-500 bg-gradient-to-b from-white to-emerald-50 shadow-emerald-600/20 shadow-2xl scale-[1.02]' 
                  : 'border-white bg-white shadow-xl hover:shadow-2xl hover:-translate-y-2 hover:border-emerald-100'
                }`}
              >
                <div className="text-7xl drop-shadow-xl group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 mb-2">
                  🧑‍🌾
                </div>
                <span className={`text-3xl font-black tracking-tight transition-colors duration-300 ${activeRole === 'farmer' ? 'text-emerald-800' : 'text-slate-800'}`}>
                  أنا فلاح
                </span>
                <p className="text-sm text-slate-500 font-medium px-4">بيع محاصيلك مباشرة للزبائن</p>
                {activeRole === 'farmer' && (
                  <div className="absolute inset-0 rounded-[2.5rem] ring-4 ring-emerald-500/30 animate-pulse pointer-events-none" />
                )}
              </button>
            </Link>

            {/* Buyer Button */}
            <Link href="/buyer" passHref>
              <button
                onClick={() => setActiveRole('buyer')}
                className={`w-full h-full relative group flex flex-col items-center justify-center gap-4 p-10 rounded-[2.5rem] transition-all duration-500 border-2 ${
                  activeRole === 'buyer' 
                  ? 'border-red-500 bg-gradient-to-b from-white to-red-50 shadow-red-600/20 shadow-2xl scale-[1.02]' 
                  : 'border-white bg-white shadow-xl hover:shadow-2xl hover:-translate-y-2 hover:border-red-100'
                }`}
              >
                <div className="text-7xl drop-shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 mb-2">
                  🛒
                </div>
                <span className={`text-3xl font-black tracking-tight transition-colors duration-300 ${activeRole === 'buyer' ? 'text-red-800' : 'text-slate-800'}`}>
                  أنا زبون
                </span>
                <p className="text-sm text-slate-500 font-medium px-4">اطلب منتجات طازجة بأفضل سعر</p>
                {activeRole === 'buyer' && (
                  <div className="absolute inset-0 rounded-[2.5rem] ring-4 ring-red-500/30 animate-pulse pointer-events-none" />
                )}
              </button>
            </Link>

            {/* Transporter Button */}
            <Link href="/transport" passHref>
              <button
                onClick={() => setActiveRole('transporter')}
                className={`w-full h-full relative group flex flex-col items-center justify-center gap-4 p-10 rounded-[2.5rem] transition-all duration-500 border-2 ${
                  activeRole === 'transporter' 
                  ? 'border-slate-800 bg-gradient-to-b from-white to-slate-50 shadow-slate-800/20 shadow-2xl scale-[1.02]' 
                  : 'border-white bg-white shadow-xl hover:shadow-2xl hover:-translate-y-2 hover:border-slate-200'
                }`}
              >
                <div className="text-7xl drop-shadow-xl group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 mb-2">
                  🚚
                </div>
                <span className={`text-3xl font-black tracking-tight transition-colors duration-300 ${activeRole === 'transporter' ? 'text-slate-900' : 'text-slate-800'}`}>
                  ناقل السلع
                </span>
                <p className="text-sm text-slate-500 font-medium px-4">انقل السلع واربح من التوصيل</p>
                {activeRole === 'transporter' && (
                  <div className="absolute inset-0 rounded-[2.5rem] ring-4 ring-slate-800/30 animate-pulse pointer-events-none" />
                )}
              </button>
            </Link>
          </div>
        </section>

        {/* Live Statistics Section */}
        <section className="py-16 bg-white border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-x-reverse divide-gray-100">
              {stats.map((stat) => (
                <div key={stat.id} className="text-center">
                  <div className={`text-4xl md:text-5xl font-black mb-2 ${stat.color} tracking-tight`}>
                    {stat.value}
                  </div>
                  <div className="text-slate-500 font-semibold text-sm md:text-base">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* "How it Works" Section */}
        <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">آلية عمل المنصة</h2>
            <div className="w-24 h-1 bg-red-600 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div 
                key={step.id} 
                className={`bg-white rounded-3xl p-8 border ${step.borderColor} shadow-sm hover:shadow-lg transition-shadow relative overflow-hidden`}
              >
                <div className={`w-20 h-20 rounded-2xl ${step.bgColor} flex items-center justify-center mb-6`}>
                  {step.icon}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed font-medium">
                  {step.desc}
                </p>
                <div className="absolute -bottom-6 -left-6 text-9xl font-black text-gray-50/50 pointer-events-none select-none z-0">
                  {step.id}
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-slate-900 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-6 opacity-80">
             <svg className="w-6 h-6 text-emerald-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
             </svg>
             <span className="text-xl font-black tracking-tighter text-white">
                فلاح <span className="text-red-500">DZ</span>
             </span>
          </div>
          <p className="text-slate-400 text-sm font-medium">
            &copy; {new Date().getFullYear()} أفضل منصة زراعية في الجزائر. جميع الحقوق محفوظة.
          </p>
        </div>
      </footer>

    </div>
  );
}
