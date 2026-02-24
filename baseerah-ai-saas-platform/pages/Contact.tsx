
import React from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, ChevronRight, MessageSquare, Building2, User } from 'lucide-react';

const Contact: React.FC = () => {
  const [step, setStep] = React.useState(1);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    company: '',
    industry: 'عقارات',
    budget: '١٠,٠٠٠ - ٢٥,٠٠٠ ريال',
    message: ''
  });

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep(3);
    }, 1500);
  };

  return (
    <div className="pt-40 pb-24 px-6 min-h-screen bg-[#0d2226]" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-24">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-[#1e403a]/40 border border-[#cfd9cc]/20">
            <MessageSquare size={16} className="text-[#cfd9cc]" />
            <span className="text-[10px] font-black text-[#cfd9cc] uppercase tracking-widest">تواصل استراتيجي</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-tight">
            دعنا نؤتمت <br /><span className="text-gradient">قصة نجاحك.</span>
          </h1>
          <p className="text-[#cfd9cc]/40 max-w-2xl mx-auto text-xl font-light leading-relaxed">
            جاهز لهندسة مستقبلك؟ مستشارونا الاستراتيجيون جاهزون الآن لتصميم حلولك الرقمية القادمة في المملكة.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Contact Details */}
          <div className="lg:col-span-4 space-y-8">
            <div className="glass p-10 rounded-[50px] border-white/5 space-y-12">
              <h3 className="text-2xl font-black text-white">قنوات التواصل</h3>
              <div className="space-y-8">
                <div className="flex items-start gap-6 group">
                  <div className="w-14 h-14 rounded-2xl bg-[#1e403a]/30 flex items-center justify-center border border-white/5 group-hover:bg-[#cfd9cc] group-hover:text-[#0d2226] transition-all">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-[#cfd9cc]/40 uppercase tracking-widest mb-2">البريد الإلكتروني</h4>
                    <p className="text-white font-bold text-lg">strategic@baseerah.ai</p>
                  </div>
                </div>
                <div className="flex items-start gap-6 group">
                  <div className="w-14 h-14 rounded-2xl bg-[#1e403a]/30 flex items-center justify-center border border-white/5 group-hover:bg-[#cfd9cc] group-hover:text-[#0d2226] transition-all">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-[#cfd9cc]/40 uppercase tracking-widest mb-2">الخط المباشر</h4>
                    <p className="text-white font-bold text-lg" dir="ltr">+966 50 000 0000</p>
                  </div>
                </div>
                <div className="flex items-start gap-6 group">
                  <div className="w-14 h-14 rounded-2xl bg-[#1e403a]/30 flex items-center justify-center border border-white/5 group-hover:bg-[#cfd9cc] group-hover:text-[#0d2226] transition-all">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-[#cfd9cc]/40 uppercase tracking-widest mb-2">المقر الرئيسي</h4>
                    <p className="text-white font-bold text-lg leading-relaxed">حي التقنية، مكة المكرمة<br/>المملكة العربية السعودية</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="w-full h-72 glass rounded-[50px] border-white/5 overflow-hidden relative group">
              <img 
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800" 
                alt="Map" 
                className="w-full h-full object-cover grayscale opacity-30 group-hover:scale-110 transition-transform duration-1000"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="p-5 rounded-3xl bg-[#cfd9cc] text-[#0d2226] shadow-glow animate-bounce">
                  <MapPin size={32} />
                </div>
              </div>
            </div>
          </div>

          {/* Multi-step Form */}
          <div className="lg:col-span-8 glass p-12 md:p-20 rounded-[60px] border-white/5 relative overflow-hidden">
            <div className="flex gap-4 mb-16">
              {[1, 2, 3].map(i => (
                <div key={i} className={`h-2 flex-1 rounded-full transition-all duration-500 ${step >= i ? 'bg-[#cfd9cc]' : 'bg-white/5'}`} />
              ))}
            </div>

            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-right duration-500">
                <h3 className="text-4xl font-black text-white mb-10">البيانات الأساسية</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
                  <div className="space-y-4">
                    <label className="text-xs font-black text-[#cfd9cc]/40 uppercase tracking-widest mr-4">الاسم الكريم</label>
                    <div className="relative">
                       <User className="absolute right-6 top-1/2 -translate-y-1/2 text-[#cfd9cc]/20" size={20} />
                       <input 
                        type="text" 
                        placeholder="أدخل اسمك الكامل"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pr-16 pl-6 py-5 text-white focus:outline-none focus:border-[#cfd9cc]/40 transition-all text-xl"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-xs font-black text-[#cfd9cc]/40 uppercase tracking-widest mr-4">البريد الإلكتروني</label>
                    <div className="relative">
                       <Mail className="absolute right-6 top-1/2 -translate-y-1/2 text-[#cfd9cc]/20" size={20} />
                       <input 
                        type="email" 
                        placeholder="example@domain.com"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pr-16 pl-6 py-5 text-white focus:outline-none focus:border-[#cfd9cc]/40 transition-all text-xl text-left"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="col-span-full space-y-4">
                    <label className="text-xs font-black text-[#cfd9cc]/40 uppercase tracking-widest mr-4">اسم المنشأة / الشركة</label>
                    <div className="relative">
                       <Building2 className="absolute right-6 top-1/2 -translate-y-1/2 text-[#cfd9cc]/20" size={20} />
                       <input 
                        type="text" 
                        placeholder="أدخل اسم شركتك"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pr-16 pl-6 py-5 text-white focus:outline-none focus:border-[#cfd9cc]/40 transition-all text-xl"
                        value={formData.company}
                        onChange={e => setFormData({...formData, company: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                <button onClick={nextStep} className="bg-[#cfd9cc] text-[#0d2226] px-12 py-6 rounded-2xl font-black text-2xl hover:bg-white transition-all shadow-glow flex items-center gap-4">
                  المتابعة للمتطلبات <ChevronRight size={24} className="rotate-180" />
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-right duration-500">
                <h3 className="text-4xl font-black text-white mb-10">تفاصيل المشروع</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
                  <div className="space-y-4">
                    <label className="text-xs font-black text-[#cfd9cc]/40 uppercase tracking-widest mr-4">نوع القطاع</label>
                    <select 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-white focus:outline-none focus:border-[#cfd9cc]/40 appearance-none text-xl"
                      value={formData.industry}
                      onChange={e => setFormData({...formData, industry: e.target.value})}
                    >
                      <option>تجارة إلكترونية</option>
                      <option>عقارات</option>
                      <option>رعاية صحية</option>
                      <option>ذكاء اصطناعي مخصص</option>
                      <option>محاسبة ومالية</option>
                    </select>
                  </div>
                  <div className="space-y-4">
                    <label className="text-xs font-black text-[#cfd9cc]/40 uppercase tracking-widest mr-4">الميزانية التقديرية</label>
                    <select 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-white focus:outline-none focus:border-[#cfd9cc]/40 appearance-none text-xl"
                      value={formData.budget}
                      onChange={e => setFormData({...formData, budget: e.target.value})}
                    >
                      <option>٥,٠٠٠ - ١٠,٠٠٠ ريال</option>
                      <option>١٠,٠٠٠ - ٢٥,٠٠٠ ريال</option>
                      <option>٢٥,٠٠٠ - ١٠٠,٠٠٠ ريال</option>
                      <option>أكثر من ١٠٠,٠٠٠ ريال</option>
                    </select>
                  </div>
                  <div className="col-span-full space-y-4">
                    <label className="text-xs font-black text-[#cfd9cc]/40 uppercase tracking-widest mr-4">رسالتك / طموحاتك في الأتمتة</label>
                    <textarea 
                      placeholder="اشرح لنا عن فكرتك أو التحديات التي تواجهك..."
                      className="w-full bg-white/5 border border-white/10 rounded-[35px] px-8 py-8 text-white focus:outline-none focus:border-[#cfd9cc]/40 transition-all text-xl h-48 resize-none"
                      value={formData.message}
                      onChange={e => setFormData({...formData, message: e.target.value})}
                    />
                  </div>
                </div>
                <div className="flex gap-6">
                  <button onClick={prevStep} className="bg-white/5 text-white px-10 py-6 rounded-2xl font-black text-xl hover:bg-white/10 transition-all border border-white/10">
                    السابق
                  </button>
                  <button onClick={handleSubmit} disabled={isSubmitting} className="flex-1 bg-[#cfd9cc] text-[#0d2226] px-12 py-6 rounded-2xl font-black text-2xl hover:bg-white transition-all shadow-glow flex items-center justify-center gap-4">
                    {isSubmitting ? 'جاري الإرسال...' : 'إرسال المتطلبات'} <Send size={24} />
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="animate-in fade-in zoom-in duration-500 text-center py-20">
                <div className="w-32 h-32 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-12 border border-emerald-500/30">
                  <CheckCircle2 size={64} className="text-emerald-500" />
                </div>
                <h3 className="text-5xl font-black text-white mb-6">تم استلام طلبك بنجاح.</h3>
                <p className="text-[#cfd9cc]/40 mb-16 text-2xl font-light leading-relaxed">
                  تم إرسال متطلباتك إلى قسم الاستراتيجية الرقمية. <br /> سيقوم أحد مستشارينا بالتواصل معك خلال ٤ ساعات عمل.
                </p>
                <button onClick={() => setStep(1)} className="bg-[#cfd9cc] text-[#0d2226] px-14 py-6 rounded-2xl font-black text-2xl hover:bg-white transition-all shadow-glow">
                  إرسال طلب آخر
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
