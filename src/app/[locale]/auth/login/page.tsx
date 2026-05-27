"use client";

import { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { Leaf, User, Lock } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: `${phone}@agritech.dz`,
        password: password,
      });

      if (error) throw error;
      
      // Successfully logged in — redirect to farmer dashboard
      router.push('/farmer');
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f7f6] p-6 font-cairo">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-agri-green p-8 text-center">
          <Leaf className="h-12 w-12 text-white mx-auto mb-4" />
          <h2 className="text-3xl font-extrabold text-white">تسجيل الدخول</h2>
        </div>

        <div className="p-8">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-semibold mb-6 border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">رقم الهاتف</label>
              <div className="relative">
                <User className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-agri-green focus:border-transparent outline-none transition-all text-gray-900" 
                  placeholder="0798555558"
                  dir="ltr"
                  required 
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">الرمز السري</label>
              <div className="relative">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-agri-green focus:border-transparent outline-none transition-all text-gray-900" 
                  placeholder="أدخل الرمز السري"
                  required 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-agri-green hover:bg-agri-green-dark text-white font-bold py-4 rounded-xl shadow-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'جاري التحميل...' : 'دخول'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <span className="text-gray-600">ليس لديك حساب؟ </span>
            <button 
              onClick={() => router.push('/auth/signup')} 
              className="text-agri-green font-bold underline hover:text-agri-green-dark transition-colors"
            >
              افتح حساب جديد هنا
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
