
import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft, BrainCircuit, Building2, CalendarDays,
  Globe, Users, Send,
  Sparkles, Coffee, ShoppingBag, Package, Cpu,
  Headset, MapPin, Cloud, Network, Share2, ShoppingCart, Calculator
} from 'lucide-react';
import { Link } from 'react-router-dom';

const IconMap: any = {
  Building2, BrainCircuit, CalendarDays, Coffee, ShoppingBag, Package, ShoppingCart, Calculator
};

const AutomationBackground: React.FC = () => {
  const elements = useMemo(() => {
    const automationIcons = [Headset, Globe, MapPin, Cloud, Network, Share2, BrainCircuit];
    return Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      Icon: automationIcons[i % automationIcons.length],
      size: Math.random() * 30 + 15,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: Math.random() * 30 + 25,
      opacity: Math.random() * 0.08 + 0.02,
      floatOffset: Math.random() * 30 + 10
    }));
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[#0d2226]">
      <style>{`
        @keyframes subtleDrift {
          0% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(calc(var(--drift) * 1px), calc(var(--drift) * -0.5px)) rotate(5deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
        .drift-icon { animation: subtleDrift linear infinite alternate; }
      `}</style>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(30,64,58,0.1),transparent)]" />
      {elements.map((el) => (
        <div
          key={el.id}
          className="absolute drift-icon text-[#cfd9cc]"
          style={{
            left: `${el.left}%`,
            top: `${el.top}%`,
            animationDuration: `${el.duration}s`,
            opacity: el.opacity,
            '--drift': el.floatOffset
          } as any}
        >
          <el.Icon size={el.size} strokeWidth={1} />
        </div>
      ))}
    </div>
  );
};

import { fetchPageContent, fetchGeneralServices } from '../src/lib/generalQueries';

const Home: React.FC = () => {
  const [cmsData, setCmsData] = useState<any>({
    heroTitle: 'رؤية ذكية تتحرك معك.',
    heroSubtitle: 'Baseerah هي منصة الأتمتة الرائدة التي تجمع بين الذكاء الاصطناعي السيادي والحلول التقنية المتطورة لتمكين أعمالك.',
    stats: []
  });
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const homeContent = await fetchPageContent('home');
      const servicesData = await fetchGeneralServices(3);

      if (homeContent) setCmsData({
        ...cmsData,
        ...homeContent
      });

      if (servicesData && servicesData.length > 0) {
        setServices(servicesData);
      } else {
        // Fallback for demo if DB is empty
        setServices([
          { id: 'ecommerce', title: 'تجارة إلكترونية ذكية', icon: 'ShoppingCart', desc: 'بوتات متكاملة لإدارة وخدمة المتاجر الإلكترونية بذكاء.' },
          { id: 'accounting', title: 'أتمتة المحاسبة والمالية', icon: 'Calculator', desc: 'أتمتة القيود والفوترة والتحليل المالي المتقدم.' },
          { id: 'real-estate', title: 'عقارات Baseerah الرقمية', icon: 'Building2', desc: 'حلول بصرية برمجية متطورة لقطاع العقارات الفاخرة.' }
        ]);
      }
      setLoading(false);
    };

    loadData();
  }, []);

  // دالة لمعالجة العنوان وتصغير الكلمة الأولى
  const renderHeroTitle = () => {
    const words = cmsData.heroTitle.split(' ');
    if (words.length < 1) return cmsData.heroTitle;
    const firstWord = words[0];
    const restOfTitle = words.slice(1).join(' ');

    return (
      <>
        <span className="text-4xl md:text-6xl lg:text-7xl block mb-2 opacity-80">{firstWord}</span>
        <span className="text-6xl md:text-8xl lg:text-[110px] leading-[0.9]">{restOfTitle}</span>
      </>
    );
  };

  const getIcon = (iconName: string) => {
    const IconComponent = IconMap[iconName] || Package;
    return <IconComponent size={32} />;
  };

  return (
    <div className="relative overflow-hidden min-h-screen" dir="rtl">
      <AutomationBackground />

      {/* Hero Section */}
      <section className="relative pt-48 md:pt-64 pb-24 px-6 text-center z-10">
        <div className="inline-flex items-center gap-2 mb-10 glass-dark border border-white/10 px-6 py-2 rounded-full text-[#cfd9cc] text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-md animate-in fade-in slide-in-from-bottom-4">
          <Sparkles size={14} className="text-[#cfd9cc]" /> أتمتة المستقبل تبدأ هنا
        </div>

        <h1 className="font-black text-white mb-12 tracking-tighter drop-shadow-2xl animate-in fade-in duration-1000">
          {renderHeroTitle()}
        </h1>

        <p className="text-lg md:text-2xl text-[#cfd9cc]/60 mb-16 max-w-3xl mx-auto font-light leading-relaxed animate-in fade-in duration-1000 delay-300 px-4">
          {cmsData.heroSubtitle}
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-5 md:gap-8 px-4 animate-in fade-in duration-1000 delay-500">
          <Link to="/services" className="bg-[#cfd9cc] text-[#0d2226] px-12 py-5 rounded-2xl text-xl font-black hover:bg-white transition-luxury shadow-glow flex items-center justify-center gap-4 group">
            استكشف الحلول <ArrowLeft size={24} className="group-hover:-translate-x-2 transition-transform" />
          </Link>
          <Link to="/contact" className="glass border border-white/10 text-white px-12 py-5 rounded-2xl text-xl font-bold hover:bg-white/5 transition-luxury backdrop-blur-lg flex items-center justify-center gap-4 group">
            تواصل معنا <Send size={20} className="group-hover:translate-y-[-2px] transition-transform" />
          </Link>
        </div>
      </section>

      {/* Services Grid (Luxury Modern) */}
      <section className="py-24 md:py-32 px-6 z-10 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 md:mb-24 gap-6">
            <div className="text-right">
              <h2 className="text-[10px] font-black text-[#cfd9cc] uppercase tracking-[0.6em] mb-4 opacity-40 text-center md:text-right">محفظة الأتمتة</h2>
              <h3 className="text-4xl md:text-6xl font-black text-white tracking-tight text-center md:text-right">أتمتة بلا حدود.</h3>
            </div>
            <Link to="/services" className="text-[#cfd9cc] font-black border-b border-[#cfd9cc]/30 pb-1 hover:border-[#cfd9cc] transition-luxury text-sm">شاهد كافة القطاعات</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {services.map((p, i) => (
              <div key={p.id} className="glass p-10 rounded-[45px] border-white/5 card-hover transition-luxury group relative overflow-hidden backdrop-blur-md">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#cfd9cc]/5 blur-3xl -z-10 group-hover:bg-[#cfd9cc]/15 transition-luxury" />
                <div className="w-20 h-20 bg-[#1e403a] rounded-2xl flex items-center justify-center mb-10 border border-[#cfd9cc]/10 shadow-xl group-hover:scale-110 transition-luxury">
                  <div className="text-[#cfd9cc]">{getIcon(p.icon)}</div>
                </div>
                <h4 className="text-2xl font-black text-white mb-5 group-hover:text-[#cfd9cc] transition-luxury">{p.title}</h4>
                <p className="text-[#cfd9cc]/40 text-base leading-relaxed mb-10 font-light">{p.desc}</p>
                <Link to={`/service/${p.category || p.id}`} className="inline-flex items-center gap-3 text-[#cfd9cc] font-black text-sm group-hover:gap-6 transition-luxury">
                  مشاهدة الحل <ArrowLeft size={18} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section (Enhanced UX) */}
      <section className="py-24 md:py-40 px-6 z-10 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 md:gap-32 items-center">
          {(cmsData.stats && cmsData.stats.length > 0 ? cmsData.stats : [
            { label: 'دعم فني ذكي', icon: 'Headset', val: '٢٤/٧' },
            { label: 'تغطية عالمية', icon: 'Globe', val: '١٠٠٪' },
            { label: 'دقة البيانات', icon: 'Cloud', val: '٩٩.٩٪' },
            { label: 'ترابط الأنظمة', icon: 'Network', val: 'آمن' }
          ]).map((stat: any, i: number) => (
            <div key={i} className="glass p-8 md:p-12 rounded-[40px] border-white/5 flex flex-col items-center text-center group hover:bg-[#cfd9cc]/5 transition-luxury">
              <div className="text-[#cfd9cc] mb-5 group-hover:scale-125 transition-luxury">
                {getIcon(stat.icon)}
              </div>
              <div className="text-3xl md:text-5xl font-black text-white mb-2">{stat.val}</div>
              <div className="text-[9px] font-black text-[#cfd9cc]/20 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}

          <div className="space-y-10 text-right order-1 lg:order-2">
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-tight">Baseerah تعني <br /><span className="text-gradient">التحكم المطلق.</span></h2>
            <p className="text-xl md:text-2xl text-[#cfd9cc]/50 leading-relaxed font-light">
              نحن لا نكتفي بتقديم البرامج، بل نغرس "بصيرة" ذكية في صلب عملياتك لتضمن سير العمل بدقة متناهية.
            </p>
            <Link to="/contact" className="inline-flex bg-[#cfd9cc] text-[#0d2226] px-12 py-5 rounded-2xl text-xl font-black hover:bg-white shadow-glow transition-luxury">
              تحدث مع خبرائنا الآن
            </Link>
          </div>
        </div>
      </section>

      {/* Dynamic CTA Footer (Soft Modern) */}
      <section className="py-24 md:py-40 px-6 z-10 relative">
        <div className="max-w-5xl mx-auto glass p-12 md:p-24 rounded-[60px] border-white/5 relative overflow-hidden backdrop-blur-2xl text-center">
          <div className="absolute top-0 left-0 w-64 h-64 bg-[#cfd9cc]/5 blur-[120px] -z-10" />
          <h2 className="text-4xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tighter">جاهز لهندسة <br /> <span className="text-gradient">مستقبلك؟</span></h2>
          <p className="text-[#cfd9cc]/40 text-lg md:text-xl font-light mb-12 max-w-2xl mx-auto">أرسل متطلباتك وسيقوم فريقنا الاستراتيجي بالتواصل معك خلال ساعات عمل.</p>
          <Link to="/contact" className="inline-flex items-center gap-4 bg-[#cfd9cc] text-[#0d2226] px-12 py-6 rounded-3xl text-xl font-black hover:bg-white shadow-glow transition-luxury group">
            ابدأ استشارتك <Send size={24} className="group-hover:translate-y-[-2px] transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
