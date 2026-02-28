
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../src/lib/supabase';
import {
  Cpu, Mail, Lock, Phone, ArrowLeft, Eye,
  EyeOff, ShieldCheck, Chrome, User, Github,
  ArrowRight, CheckCircle2, AlertCircle
} from 'lucide-react';

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        // --- LOGIN ---
        if (role === 'admin' && email !== 'mohmmedc@gmail.com') {
          throw new Error('دخول المسؤول عبر الرابط متاح فقط للمدير المعتمد.');
        }

        // Both User and Admin use OTP for login now
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            shouldCreateUser: false,
            emailRedirectTo: window.location.origin,
          }
        });

        if (error) {
          if (error.message.includes('Signups not allowed') || error.status === 400) {
            throw new Error('هذا البريد الإلكتروني غير مسجل، أو لا يملك صلاحية الدخول.');
          }
          throw error;
        }

        alert('تم إرسال رابط الدخول إلى بريدك الإلكتروني!');
        return;
      } else {
        // --- SIGN UP ---
        if (step === 1) {
          setStep(2);
          setLoading(false);
          return;
        }

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              phone: phone,
              role: 'user' // Any registration via this form is a customer
            },
            emailRedirectTo: 'https://www.basserahai.com/#/portal'
          }
        });
        if (error) throw error;

        // Success - Direct redirect to portal for customers
        navigate('/portal');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/#/portal`
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGitHubLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/#/portal`
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d2226] px-6 py-20 relative overflow-hidden" dir="rtl">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#cfd9cc]/5 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#1e403a]/20 blur-[120px] rounded-full translate-x-1/2 translate-y-1/2" />

      <div className="w-full max-w-xl glass p-10 md:p-16 rounded-[60px] border-white/5 relative z-10 animate-in fade-in zoom-in duration-500">

        {step === 1 ? (
          <>
            <div className="text-center mb-12">
              <div className="w-20 h-20 mx-auto mb-6 transition-luxury hover:scale-110">
                <img src="/logo.png" alt="Baseerah AI" className="w-full h-full object-contain" />
              </div>
              <h1 className="text-4xl font-black text-white mb-3">
                {isLogin ? 'مرحباً بعودتك' : 'انضم إلى Baseerah AI'}
              </h1>
              <p className="text-[#cfd9cc]/40">استكمل رحلتك في عالم الأتمتة الذكية</p>
            </div>

            {/* ERROR ALERT */}
            {error && (
              <div className="mb-8 bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-3 text-red-400 text-sm font-bold animate-in slide-in-from-top-2">
                <AlertCircle size={20} />
                {error}
              </div>
            )}

            {/* Role Selector */}
            <div className="flex gap-2 p-1.5 bg-white/5 rounded-2xl mb-10">
              <button
                type="button"
                onClick={() => setRole('user')}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${role === 'user' ? 'bg-[#cfd9cc] text-[#0d2226]' : 'text-[#cfd9cc]/40 hover:text-[#cfd9cc]'}`}
              >
                الدخول عبر اللينك
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${role === 'admin' ? 'bg-[#cfd9cc] text-[#0d2226]' : 'text-[#cfd9cc]/40 hover:text-[#cfd9cc]'}`}
              >
                دخول غرفة الإدارة
              </button>
            </div>

            <form onSubmit={handleAuth} className="space-y-6">
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-xs font-black text-[#cfd9cc]/30 uppercase tracking-widest mr-2">الاسم الكامل</label>
                  <div className="relative">
                    <User className="absolute right-6 top-1/2 -translate-y-1/2 text-[#cfd9cc]/20" size={18} />
                    <input
                      type="text"
                      required={!isLogin}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pr-14 pl-6 py-4 text-white outline-none focus:border-[#cfd9cc]/40 transition-all"
                      placeholder="الاسم الثلاثي"
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
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pr-14 pl-6 py-4 text-white outline-none focus:border-[#cfd9cc]/40 transition-all"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              {/* Only show password if it's Sign Up */}
              {!isLogin && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center mr-2">
                    <label className="text-xs font-black text-[#cfd9cc]/30 uppercase tracking-widest">كلمة المرور</label>
                    {isLogin && <button type="button" className="text-xs font-bold text-[#cfd9cc]/40 hover:text-[#cfd9cc]">نسيت كلمة المرور؟</button>}
                  </div>
                  <div className="relative">
                    <Lock className="absolute right-6 top-1/2 -translate-y-1/2 text-[#cfd9cc]/20" size={18} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pr-14 pl-14 py-4 text-white outline-none focus:border-[#cfd9cc]/40 transition-all"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-6 top-1/2 -translate-y-1/2 text-[#cfd9cc]/20 hover:text-[#cfd9cc]"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 rounded-2xl bg-[#cfd9cc] text-[#0d2226] font-black text-xl hover:bg-white transition-all shadow-glow flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'جاري المعالجة...' : isLogin ? 'إرسال رابط الدخول' : 'المتابعة'} <ArrowLeft size={20} />
              </button>
            </form>

            {/* Social Login - Hidden for now
            <div className="mt-12">
              <div className="relative flex items-center gap-4 mb-8">
                <div className="flex-1 h-px bg-white/5" />
                <span className="text-[10px] font-black text-[#cfd9cc]/20 uppercase tracking-[0.3em]">أو عبر منصات التواصل</span>
                <div className="flex-1 h-px bg-white/5" />
              </div>
              <div className="grid grid-cols-1 gap-4">
                <button
                  onClick={handleGoogleLogin}
                  type="button"
                  className="flex items-center justify-center gap-3 bg-white/5 border border-white/10 py-4 rounded-2xl text-white font-bold hover:bg-white/10 transition-all text-sm relative overflow-hidden group"
                >
                  <Chrome size={20} className="text-[#cfd9cc]" /> الاستمرار باستخدام Google
                </button>
                <button
                  onClick={handleGitHubLogin}
                  type="button"
                  className="flex items-center justify-center gap-3 bg-white/5 border border-white/10 py-4 rounded-2xl text-white font-bold hover:bg-white/10 transition-all text-sm relative overflow-hidden group"
                >
                  <Github size={20} className="text-[#cfd9cc]" /> الاستمرار باستخدام GitHub
                </button>
              </div>
            </div>
            */}

            <div className="mt-12 text-center">
              <button
                onClick={() => { setIsLogin(!isLogin); setError(null); }}
                className="text-[#cfd9cc]/40 hover:text-[#cfd9cc] text-sm font-bold"
              >
                {isLogin ? 'لا تملك حساباً؟ انضم إلينا الآن' : 'لديك حساب بالفعل؟ سجل دخولك'}
              </button>
            </div>
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
