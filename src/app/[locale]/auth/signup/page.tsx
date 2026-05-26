"use client";

import { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { Leaf, User, Mail, Phone, Lock, KeyRound } from 'lucide-react';
import { verifyOtpAndSignUp } from '@/app/actions/auth';

export default function SignupPage() {
  const router = useRouter();
  
  // Step 1 State
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  // Step 2 State
  const [otp, setOtp] = useState('');
  
  // Step 3 State
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Use environment variable. In production (Vercel), this calls our own
      // Next.js /api/n8n proxy route to avoid CORS issues.
      const rawWebhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;

      if (!rawWebhookUrl) {
        throw new Error('رابط إرسال الرمز غير مُعرَّف. يرجى التحقق من إعدادات التطبيق.');
      }

      // Extract the path from the URL to use our proxy rewrite defined in next.config.ts
      let proxyUrl = rawWebhookUrl;
      try {
        const urlObj = new URL(rawWebhookUrl);
        // This will create a path like '/api/n8n/webhook/signup-otp'
        // which Next.js rewrites to the actual n8n backend, avoiding CORS.
        proxyUrl = `/api/n8n${urlObj.pathname}${urlObj.search}`;
      } catch (e) {
        console.warn('Invalid URL format for webhook, attempting direct call.');
      }

      const res = await fetch(proxyUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email })   // ✅ Dynamic — uses state from input field
      });

      if (!res.ok) {
        const errorBody = await res.text();
        console.error('Webhook error response:', errorBody);
        throw new Error('فشل إرسال رمز التحقق. تأكد من صحة بريدك الإلكتروني وأعد المحاولة.');
      }

      // OTP sent successfully
      setStep(2);
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء إرسال رمز التحقق.');
    } finally {
      setLoading(false);
    }
  };

  const handleProceedToPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) {
      setError('يرجى إدخال رمز تحقق صالح.');
      return;
    }
    setError(null);
    setStep(3);
  };

  const handleFinalSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('الرمز السري غير متطابق. يرجى التأكد والمحاولة مرة أخرى.');
      return;
    }
    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('username', username);
      formData.append('phone', phone);
      formData.append('otp', otp);
      formData.append('password', password);

      const result = await verifyOtpAndSignUp(formData);

      if (!result.success) {
        throw new Error(result.error);
      }
      
      // Successfully registered & OTP verified
      router.push('/farmer');
      
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء إنشاء الحساب');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f7f6] p-6 font-cairo">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-agri-green p-8 text-center">
          <Leaf className="h-12 w-12 text-white mx-auto mb-4" />
          <h2 className="text-3xl font-extrabold text-white">إنشاء حساب</h2>
          <p className="text-green-100 mt-2">
            {step === 1 && 'المعلومات الأساسية'}
            {step === 2 && 'التحقق من البريد الإلكتروني'}
            {step === 3 && 'إعداد الرمز السري'}
          </p>
        </div>

        <div className="p-8">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-semibold mb-6 border border-red-100">
              {error}
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">اسم المستخدم</label>
                <div className="relative">
                  <User className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-agri-green outline-none transition-all text-gray-900" 
                    placeholder="john_doe"
                    dir="ltr"
                    required 
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">البريد الإلكتروني</label>
                <div className="relative">
                  <Mail className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-agri-green outline-none transition-all text-gray-900" 
                    placeholder="example@mail.com"
                    dir="ltr"
                    required 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">رقم الهاتف</label>
                <div className="relative">
                  <Phone className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-agri-green outline-none transition-all text-gray-900" 
                    placeholder="0555000000"
                    dir="ltr"
                    required 
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-agri-green hover:bg-agri-green-dark text-white font-bold py-4 rounded-xl shadow-md transition-colors disabled:opacity-70"
              >
                {loading ? 'جاري الإرسال...' : 'إرسال رمز التحقق (OTP)'}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleProceedToPassword} className="space-y-6">
              <p className="text-sm text-gray-600 mb-4 text-center">
                تم إرسال رمز التحقق إلى بريدك الإلكتروني.
              </p>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">رمز التحقق (OTP)</label>
                <div className="relative">
                  <KeyRound className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input 
                    type="text" 
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-agri-green text-center tracking-widest text-lg font-bold outline-none text-gray-900" 
                    placeholder="123456"
                    dir="ltr"
                    required 
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-agri-green hover:bg-agri-green-dark text-white font-bold py-4 rounded-xl shadow-md transition-colors"
              >
                متابعة
              </button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleFinalSignup} className="space-y-5">
              <p className="text-sm text-gray-600 mb-4 text-center">
                أدخل رمزاً سرياً لحسابك.
              </p>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">رمز سري</label>
                <div className="relative">
                  <Lock className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-agri-green outline-none transition-all text-gray-900" 
                    placeholder="أدخل الرمز السري"
                    required 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">تأكيد الرمز السري</label>
                <div className="relative">
                  <Lock className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-agri-green outline-none transition-all text-gray-900" 
                    placeholder="أعد إدخال الرمز السري للتأكيد"
                    required 
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-agri-green hover:bg-agri-green-dark text-white font-bold py-4 rounded-xl shadow-md transition-colors disabled:opacity-70"
              >
                {loading ? 'جاري الإنشاء...' : 'تأكيد وإنشاء حساب'}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <span className="text-gray-600">لديك حساب بالفعل؟ </span>
            <button onClick={() => router.push('/auth/login')} className="text-agri-green font-bold hover:underline">
              تسجيل الدخول
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
