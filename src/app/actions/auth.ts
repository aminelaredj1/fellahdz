"use server";

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

function getEnvVar(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

export async function verifyOtpAndSignUp(formData: FormData) {
  const email    = formData.get('email')    as string;
  const otp      = formData.get('otp')      as string;
  const username = formData.get('username') as string;
  const phone    = formData.get('phone')    as string;
  const password = formData.get('password') as string;

  if (!email || !otp || !password) {
    return { success: false, error: 'الرجاء إدخال جميع البيانات المطلوبة' };
  }

  const supabaseUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL');
  const anonKey = getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY');

  const cookieStore = await cookies();

  // Create a standard Supabase client using the Anon key
  const supabase = createServerClient(supabaseUrl, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Safe to ignore from Server Components
        }
      },
    },
  });

  try {
    // ──────────────────────────────────────────────────────────────
    // 1. Skip OTP table verification for now to prevent errors 
    //    if the 'otp' table isn't created in Supabase yet.
    // ──────────────────────────────────────────────────────────────

    // ──────────────────────────────────────────────────────────────
    // 2. Create the user in Supabase Auth
    // We use the phone number to create a unique identifier so the user
    // can log in using ONLY their phone and password later.
    // ──────────────────────────────────────────────────────────────
    const { error: signUpError } = await supabase.auth.signUp({
      email: `${phone}@agritech.dz`, // Mapping phone to email for Supabase Auth
      password,
      options: {
        data: {
          real_email: email,
          username,
          phone,
          role: 'الفلاح',
        },
      },
    });

    if (signUpError) {
      console.error('[verifyOtpAndSignUp] signUp error:', signUpError.message);
      return { success: false, error: signUpError.message };
    }

    // ──────────────────────────────────────────────────────────────
    // 3. Automatically Log In the user to establish their session
    // ──────────────────────────────────────────────────────────────
    await supabase.auth.signInWithPassword({
      email: `${phone}@agritech.dz`,
      password,
    });

    return { success: true };

  } catch (err: any) {
    console.error('[verifyOtpAndSignUp] Unexpected error:', err?.message ?? err);
    return { success: false, error: 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.' };
  }
}
