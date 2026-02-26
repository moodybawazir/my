
import React, { useEffect, useState } from 'react';
import { Shield, Sparkles, Rocket, Eye, Cpu, Code, Video, Target, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

import { fetchPageContent } from '../src/lib/generalQueries';

const IconMap: any = {
  Cpu, Shield, Video, Rocket, Eye
};

const About: React.FC = () => {
  const [data, setData] = useState<any>({
    mission: 'تمكين القادة والشركات عبر أتمتة فائقة الذكاء ترفع الكفاءة التشغيلية لأقصى حدودها.',
    vision: 'أن نكون المحرك العالمي الأول لحلول الذكاء الاصطناعي الاستراتيجية في منطقة الشرق الأوسط.',
    accuracy: '١٠٠٪',
    whyChooseUs: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const aboutContent = await fetchPageContent('about');
      if (aboutContent) setData(aboutContent);
      setLoading(false);
    };

    loadData();
  }, []);

  return (
    <div className="pt-48 pb-32 px-6 bg-[#0d2226]" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mb-48">
          <div className="animate-in fade-in slide-in-from-right duration-1000">
            <div className="inline-flex items-center gap-2 mb-8 px-6 py-2 rounded-full bg-[#1e403a]/40 border border-[#cfd9cc]/20">
              <Sparkles size={18} className="text-[#cfd9cc] animate-pulse" />
              <span className="text-xs font-black text-[#cfd9cc] uppercase tracking-widest">قصة الابتكار والتحول</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white mb-10 leading-[1.1] tracking-tighter">بصيرة.. هندسة <br /><span className="text-gradient">الذكاء السيادي.</span></h1>
            <p className="text-2xl text-[#cfd9cc]/50 leading-relaxed font-light mb-12">
              بصيرة هي أكثر من مجرد شركة تقنية، هي رؤية طموحة انطلقت من قلب المملكة العربية السعودية لتعيد تعريف كيف تعمل المؤسسات في عصر الذكاء الاصطناعي.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-10 glass rounded-[45px] border-white/5 hover:border-[#cfd9cc]/20 transition-all group">
                <div className="w-16 h-16 bg-[#cfd9cc] rounded-2xl flex items-center justify-center mb-8 shadow-glow group-hover:scale-110 transition-transform">
                  <Rocket className="text-[#0d2226]" size={32} />
                </div>
                <h4 className="text-white font-black text-2xl mb-4">مهمتنا</h4>
                <p className="text-base text-[#cfd9cc]/40 leading-relaxed font-light">{data.mission}</p>
              </div>
              <div className="p-10 glass rounded-[45px] border-white/5 hover:border-[#cfd9cc]/20 transition-all group">
                <div className="w-16 h-16 bg-[#1e403a] rounded-2xl flex items-center justify-center mb-8 border border-[#cfd9cc]/20 group-hover:scale-110 transition-transform shadow-2xl">
                  <Eye className="text-[#cfd9cc]" size={32} />
                </div>
                <h4 className="text-white font-black text-2xl mb-4">رؤيتنا</h4>
                <p className="text-base text-[#cfd9cc]/40 leading-relaxed font-light">{data.vision}</p>
              </div>
            </div>
          </div>
          <div className="relative animate-in fade-in slide-in-from-left duration-1000 delay-300">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#cfd9cc]/20 to-transparent blur-[120px] rounded-full" />
            <img
              src={data.mainImage || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200"}
              className="relative rounded-[60px] border border-white/10 shadow-2xl grayscale hover:grayscale-0 transition-all duration-1000 object-cover aspect-[4/5]"
              alt="AI Innovation"
            />
            <div className="absolute -bottom-12 -right-12 glass p-12 rounded-[50px] border-[#cfd9cc]/20 hidden lg:block shadow-2xl animate-float backdrop-blur-3xl">
              <div className="text-7xl font-black text-white mb-2">{data.accuracy}</div>
              <div className="text-xs font-black text-[#cfd9cc]/30 uppercase tracking-[0.5em]">دقة الأتمتة الموثقة</div>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="text-center mb-48">
          <h2 className="text-xs font-black text-[#cfd9cc] uppercase tracking-[0.8em] mb-8 opacity-40">لماذا يختارنا القادة؟</h2>
          <h3 className="text-5xl md:text-7xl font-black text-white mb-24 tracking-tighter">التميز في هندسة التفاصيل.</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {(data.whyChooseUs && data.whyChooseUs.length > 0 ? data.whyChooseUs : [
              {
                title: 'هندسة الأتمتة السيادية',
                subtitle: 'نصمم حلولاً تضمن بقاء بياناتك وذكاء منشأتك تحت سيطرتك الكاملة وبأعلى معايير الأمن.',
                icon: 'Cpu'
              },
              {
                title: 'أمان عسكري المستوى',
                subtitle: 'بروتوكولات التشفير لدينا متوافقة مع أرقى المعايير العالمية لحماية المعلومات الحساسة.',
                icon: 'Shield'
              },
              {
                title: 'تجربة مستخدم غامرة',
                subtitle: 'لا نقدم مجرد أدوات، بل نصمم تجارب بصرية وتقنية تذهل عملاءك وتسهل عملياتك.',
                icon: 'Video'
              },
            ]).map((item: any, i: number) => {
              const IconComp = IconMap[item.icon] || Cpu;
              return (
                <div key={i} className="group relative">
                  <div className="w-28 h-28 bg-[#1e403a]/40 rounded-[40px] flex items-center justify-center mx-auto mb-10 border border-[#cfd9cc]/10 group-hover:scale-110 group-hover:bg-[#cfd9cc] transition-all duration-700 shadow-xl">
                    <IconComp className="text-[#cfd9cc] group-hover:text-[#0d2226]" size={48} />
                  </div>
                  <h3 className="text-3xl font-black text-white mb-6 tracking-tight">{item.title || item.t}</h3>
                  <p className="text-[#cfd9cc]/40 leading-relaxed text-xl font-light">{item.subtitle || item.d}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic CTA */}
        <div className="glass p-16 md:p-24 rounded-[80px] border-white/5 flex flex-col md:flex-row items-center justify-between gap-16 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[#cfd9cc]/5 to-transparent -z-10" />
          <div className="max-w-2xl text-right">
            <h4 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter leading-tight">جاهز لهندسة <br /> <span className="text-gradient">مستقبلك الرقمي؟</span></h4>
            <p className="text-[#cfd9cc]/40 text-2xl font-light leading-relaxed">انضم لنخبة الشركات التي اختارت بصيرة لتكون شريكها الاستراتيجي في رحلة الذكاء الاصطناعي.</p>
          </div>
          <Link to="/contact" className="bg-[#cfd9cc] text-[#0d2226] px-16 py-7 rounded-full text-2xl font-black hover:bg-white transition-all shadow-glow flex items-center gap-4">
            ابدأ استشارتك <ArrowLeft size={32} className="rotate-180" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
