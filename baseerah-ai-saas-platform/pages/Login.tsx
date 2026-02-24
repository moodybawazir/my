
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Cpu, Mail, Lock, Phone, ArrowLeft, Eye, 
  EyeOff, ShieldCheck, Github, Chrome, User,
  ArrowRight, CheckCircle2
} from 'lucide-react';

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(1); // 1: Login/Sign, 2: Additional Info (Phone)
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [isSocialLoading, setIsSocialLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    setIsSocialLoading(true);
    // Simulate Google OAuth
    setTimeout(() => {
      setIsSocialLoading(false);
      setStep(2); // After Google, ask for Phone Number
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1 && !isLogin) {
      setStep(2); // Go to phone collection if signing up
    } else {
      // Final submission
      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/portal');
      }
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
              <div className="w-16 h-16 bg-gradient-to-br from-[#cfd9cc] to-[#1e403a] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow">
                <Cpu size={32} className="text-[#0d2226]" />
              </div>
              <h1 className="text-4xl font-black text-white mb-3">
                {isLogin ? 'مرحباً بعودتك' : 'انضم إلى بصيرة'}
              </h1>
              <p className="text-[#cfd9cc]/40">استكمل رحلتك في عالم الأتمتة الذكية</p>
            </div>

            {/* Role Selector */}
            <div className="flex gap-2 p-1.5 bg-white/5 rounded-2xl mb-10">
              <button 
                onClick={() => setRole('user')}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${role === 'user' ? 'bg-[#cfd9cc] text-[#0d2226]' : 'text-[#cfd9cc]/40 hover:text-[#cfd9cc]'}`}
              >
                بوابة العميل
              </button>
              <button 
                onClick={() => setRole('admin')}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${role === 'admin' ? 'bg-[#cfd9cc] text-[#0d2226]' : 'text-[#cfd9cc]/40 hover:text-[#cfd9cc]'}`}
              >
                إدارة النظام
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-xs font-black text-[#cfd9cc]/30 uppercase tracking-widest mr-2">الاسم الكامل</label>
                  <div className="relative">
                    <User className="absolute right-6 top-1/2 -translate-y-1/2 text-[#cfd9cc]/20" size={18} />
                    <input 
                      type="text" 
                      required
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
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pr-14 pl-6 py-4 text-white outline-none focus:border-[#cfd9cc]/40 transition-all"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

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

              <button type="submit" className="w-full py-5 rounded-2xl bg-[#cfd9cc] text-[#0d2226] font-black text-xl hover:bg-white transition-all shadow-glow flex items-center justify-center gap-3">
                {isLogin ? 'دخول' : 'المتابعة'} <ArrowLeft size={20} />
              </button>
            </form>

            <div className="mt-12">
              <div className="relative flex items-center gap-4 mb-8">
                <div className="flex-1 h-px bg-white/5" />
                <span className="text-[10px] font-black text-[#cfd9cc]/20 uppercase tracking-[0.3em]">أو عبر منصات التواصل</span>
                <div className="flex-1 h-px bg-white/5" />
              </div>
              <div className="grid grid-cols-1 gap-4">
                <button 
                  onClick={handleGoogleLogin}
                  disabled={isSocialLoading}
                  className="flex items-center justify-center gap-3 bg-white/5 border border-white/10 py-4 rounded-2xl text-white font-bold hover:bg-white/10 transition-all text-sm relative overflow-hidden group"
                >
                  {isSocialLoading ? (
                    <div className="w-5 h-5 border-2 border-[#cfd9cc] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Chrome size={20} className="text-[#cfd9cc]" /> الاستمرار باستخدام Google
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="mt-12 text-center">
              <button 
                onClick={() => setIsLogin(!isLogin)}
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

            <form onSubmit={handleSubmit} className="space-y-8">
               <div className="space-y-2">
                  <label className="text-xs font-black text-[#cfd9cc]/30 uppercase tracking-widest mr-2">رقم الجوال</label>
                  <div className="relative">
                    <Phone className="absolute right-6 top-1/2 -translate-y-1/2 text-[#cfd9cc]/20" size={18} />
                    <input 
                      type="tel" 
                      required
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
                  <button type="submit" className="flex-1 py-5 rounded-2xl bg-[#cfd9cc] text-[#0d2226] font-black text-xl hover:bg-white transition-all shadow-glow flex items-center justify-center gap-3">
                    إكمال التسجيل <CheckCircle2 size={20} />
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
