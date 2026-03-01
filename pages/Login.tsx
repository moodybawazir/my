import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../src/lib/supabase';
import {
  Mail, Lock, Phone, ArrowLeft,
  ShieldCheck, User, ArrowRight, CheckCircle2, AlertCircle
} from 'lucide-react';

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(1);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Form States
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!showOtpInput) {
        // --- SEND CUSTOM OTP via Resend ---
        // For both Login and Signup phase 1
        if (!isLogin && step === 1) {
          setStep(2);
          setLoading(false);
          return;
        }

        console.log('Sending OTP to:', email);
        const { data, error } = await supabase.functions.invoke('send-otp', {
          body: { email }
        });
        console.log('Send OTP Response:', { data, error });

        if (error) {
          console.error(error);
          throw new Error('حدث خطأ أثناء الاتصال بالخادم. يرجى المحاولة لاحقاً.');
        }

        if (data?.error) {
          throw new Error(data.error);
        }

        setShowOtpInput(true);
      } else {
        // --- VERIFY CUSTOM OTP & CREATE SILENT API SESSION ---
        const verifyBody = isLogin
          ? { email, code: otpCode }
          : { email, code: otpCode, fullName, phone };

        console.log('Verifying OTP for:', email);
        const { data, error } = await supabase.functions.invoke('verify-otp', {
          body: verifyBody
        });
        console.log('Verify OTP Response:', { data, error });

        if (error) {
          console.error(error);
          throw new Error('حدث خطأ أثناء التحقق من الرمز.');
        }

        if (data?.error) {
          throw new Error(data.error);
        }

        if (data?.api_session_key) {
          // This silently logs the user in creating the Supabase Auth Session
          // strictly for Data Store (RLS) usage, without triggering ANY emails whatsoever.
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email: email,
            password: data.api_session_key
          });

          if (signInError) {
            console.error(signInError);
            throw new Error('فشل إنشاء جلسة البيانات. يرجى المحاولة مجدداً.');
          }

          const emailClean = email.trim().toLowerCase();

          if (emailClean === 'odood48@gmail.com' || emailClean === 'mohmmedc@gmail.com' || data.role === 'admin') {
            window.location.replace('/#/admin');
          } else {
            window.location.replace('/#/portal');
          }
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d2226] px-6 py-20 relative overflow-hidden" dir="rtl">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#cfd9cc]/5 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#1e403a]/20 blur-[120px] rounded-full translate-x-1/2 translate-y-1/2" />

      <div className="w-full max-w-xl glass p-10 md:p-16 rounded-[60px] border-white/5 relative z-10 animate-in fade-in zoom-in duration-500">

        {step === 1 || showOtpInput ? (
          <>
            <div className="text-center mb-12">
              <div className="w-20 h-20 mx-auto mb-6 transition-luxury hover:scale-110">
                <img src="/logo.png" alt="Baseerah AI" className="w-full h-full object-contain" />
              </div>
              <h1 className="text-4xl font-black text-white mb-3">
                {isLogin ? 'مرحباً بعودتك' : 'انضم إلى Baseerah AI'}
              </h1>
              <p className="text-[#cfd9cc]/40">برمجيات ذكية لأعمال أذكى</p>
            </div>

            {/* ERROR ALERT */}
            {error && (
              <div className="mb-8 bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-3 text-red-400 text-sm font-bold animate-in slide-in-from-top-2">
                <AlertCircle size={20} />
                {error}
              </div>
            )}

            {showOtpInput ? (
              <form onSubmit={handleAuth} className="space-y-6">
                <div className="text-center mb-6">
                  <p className="text-[#cfd9cc] text-sm">أدخل رمز التحقق (OTP) المرسل إلى بريدك الإلكتروني</p>
                  <p className="text-white font-bold mt-2">{email}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-[#cfd9cc]/30 uppercase tracking-widest mr-2">رمز التحقق</label>
                  <div className="relative">
                    <Lock className="absolute right-6 top-1/2 -translate-y-1/2 text-[#cfd9cc]/20" size={18} />
                    <input
                      type="text"
                      required
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pr-14 pl-6 py-4 text-white outline-none focus:border-[#cfd9cc]/40 transition-all text-center tracking-[0.5em] font-bold text-xl"
                      placeholder="123456"
                      maxLength={6}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 rounded-2xl bg-[#cfd9cc] text-[#0d2226] font-black text-xl hover:bg-white transition-all shadow-glow flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'جاري التحقق...' : 'تأكيد الدخول'} <CheckCircle2 size={20} />
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setShowOtpInput(false)}
                  className="w-full py-3 rounded-2xl bg-transparent text-[#cfd9cc]/60 font-bold hover:text-white transition-all text-sm"
                >
                  العودة لتعديل البريد
                </button>
              </form>
            ) : (
              <>
                <form onSubmit={handleAuth} className="space-y-6">
                  {!isLogin && (
                    <div className="space-y-2">
                      <label className="text-xs font-black text-[#cfd9cc]/30 uppercase tracking-widest mr-2">الاسم</label>
                      <div className="relative">
                        <User className="absolute right-6 top-1/2 -translate-y-1/2 text-[#cfd9cc]/20" size={18} />
                        <input
                          type="text"
                          required={!isLogin}
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl pr-14 pl-6 py-4 text-white outline-none focus:border-[#cfd9cc]/40 transition-all"
                          placeholder="اسمك بالكامل"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-xs font-black text-[#cfd9cc]/30 uppercase tracking-widest mr-2">البريد الإلكتروني</label>
                    <div className="relative">
                      <Mail className="absolute right-6 top-1/2 -translate-y-1/2 text-[#cfd9cc]/20" size={18} />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pr-14 pl-6 py-4 text-white outline-none focus:border-[#cfd9cc]/40 transition-all text-left"
                        dir="ltr"
                        placeholder="name@company.com"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-5 rounded-2xl bg-[#cfd9cc] text-[#0d2226] font-black text-xl hover:bg-white transition-all shadow-glow flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'جاري المعالجة...' : isLogin ? 'إرسال رمز التحقق' : 'المتابعة'} <ArrowLeft size={20} />
                  </button>
                </form>

                <div className="mt-12 text-center">
                  <button
                    onClick={() => { setIsLogin(!isLogin); setError(null); setShowOtpInput(false); }}
                    className="text-[#cfd9cc]/40 hover:text-[#cfd9cc] text-sm font-bold transition-colors"
                  >
                    {isLogin ? 'لا تملك حساباً؟ انضم إلينا الآن' : 'لديك حساب بالفعل؟ سجل دخولك'}
                  </button>
                </div>
              </>
            )}
          </>
        ) : (
          <div className="animate-in fade-in slide-in-from-left duration-500">
            <div className="text-center mb-12">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ShieldCheck size={32} className="text-emerald-500" />
              </div>
              <h2 className="text-3xl font-black text-white mb-3">خطوة أخيرة</h2>
              <p className="text-[#cfd9cc]/40">نحتاج رقم جوالك لتوثيق الحساب وإرسال الإشعارات</p>
            </div>

            <form onSubmit={handleAuth} className="space-y-8">
              <div className="space-y-2">
                <label className="text-xs font-black text-[#cfd9cc]/30 uppercase tracking-widest mr-2">رقم الجوال</label>
                <div className="relative">
                  <Phone className="absolute right-6 top-1/2 -translate-y-1/2 text-[#cfd9cc]/20" size={18} />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    dir="ltr"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pr-14 pl-6 py-4 text-white outline-none focus:border-[#cfd9cc]/40 transition-all text-right font-bold"
                    placeholder="+966 5x xxx xxxx"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button type="button" onClick={() => setStep(1)} className="p-5 rounded-2xl bg-white/5 text-[#cfd9cc] border border-white/10 hover:bg-white/10 transition-all">
                  <ArrowRight size={20} />
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-5 rounded-2xl bg-[#cfd9cc] text-[#0d2226] font-black text-xl hover:bg-white transition-all shadow-glow flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {loading ? 'جاري التسجيل...' : 'إكمال التسجيل'} <CheckCircle2 size={20} />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
