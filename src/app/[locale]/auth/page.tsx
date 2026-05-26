"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Leaf, Phone, Lock, KeyRound } from 'lucide-react';

export default function AuthPage() {
  const t = useTranslations('Auth');
  const tIndex = useTranslations('Index');
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get('role') || 'buyer'; // default to buyer
  
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState<'phone' | 'otp' | 'password'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Basic formatting, assumes Algerian format +213
      const formattedPhone = phone.startsWith('0') ? `+213${phone.substring(1)}` : phone;
      
      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });

      if (error) throw error;
      setStep('otp');
    } catch (err: any) {
      // Handle missing env vars gracefully for demo
      if (err.message?.includes('URL is required')) {
        console.warn('Supabase not configured, mocking OTP step.');
        setStep('otp');
      } else {
        setError(err.message || t('error'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const formattedPhone = phone.startsWith('0') ? `+213${phone.substring(1)}` : phone;
      
      const { data, error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: otp,
        type: 'sms',
      });

      if (error) throw error;

      // If user doesn't have a password set, we can move to password step
      // For simplicity in this flow, we will always offer setting a password
      setStep('password');
      
    } catch (err: any) {
      if (err.message?.includes('URL is required')) {
        console.warn('Supabase not configured, mocking password step.');
        setStep('password');
      } else {
        setError(err.message || t('error'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Update the user's password
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      });
      
      if (updateError) throw updateError;

      // Ensure profile exists in 'profiles' table with the correct role
      const { data: userData } = await supabase.auth.getUser();
      if (userData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({ 
            id: userData.user.id, 
            role: role === 'farmer' ? 'فلاح' : 'زبون',
            phone: phone
          }, { onConflict: 'id' });
          
        if (profileError) throw profileError;
      }
      
      // Redirect to the correct dashboard
      router.push(`/${role}`);
    } catch (err: any) {
      if (err.message?.includes('URL is required')) {
        console.warn('Supabase not configured, mocking redirect.');
        router.push(`/${role}`);
      } else {
        setError(err.message || t('error'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f7f6] p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-agri-green p-8 text-center">
          <Leaf className="h-12 w-12 text-white mx-auto mb-4" />
          <h2 className="text-3xl font-extrabold text-white">{tIndex('title')}</h2>
          <p className="text-green-100 mt-2">{t('title')}</p>
        </div>

        <div className="p-8">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-semibold mb-6 border border-red-100">
              {error}
            </div>
          )}

          {step === 'phone' && (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">{t('phoneLabel')}</label>
                <div className="relative">
                  <Phone className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-agri-green focus:border-transparent outline-none transition-all" 
                    placeholder={t('phonePlaceholder')}
                    dir="ltr"
                    required 
                  />
                </div>
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-agri-green hover:bg-agri-green-dark text-white font-bold py-4 rounded-xl shadow-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? t('loading') : t('sendOtp')}
              </button>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">{t('otpLabel')}</label>
                <div className="relative">
                  <KeyRound className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input 
                    type="text" 
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-agri-green focus:border-transparent outline-none transition-all text-center tracking-widest text-lg font-bold" 
                    placeholder={t('otpPlaceholder')}
                    dir="ltr"
                    required 
                  />
                </div>
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-agri-green hover:bg-agri-green-dark text-white font-bold py-4 rounded-xl shadow-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? t('loading') : t('verifyOtp')}
              </button>
            </form>
          )}

          {step === 'password' && (
            <form onSubmit={handleSetPassword} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">{t('passwordLabel')}</label>
                <div className="relative">
                  <Lock className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-agri-green focus:border-transparent outline-none transition-all" 
                    placeholder={t('passwordPlaceholder')}
                    required 
                  />
                </div>
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-agri-green hover:bg-agri-green-dark text-white font-bold py-4 rounded-xl shadow-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? t('loading') : t('setPassword')}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
