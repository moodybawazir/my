
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Stethoscope, Calendar, Phone, Sparkles, Building2, BrainCircuit, ShoppingBag, CheckCircle2 } from 'lucide-react';
import SEO from '../src/components/SEO';
import { motion } from 'framer-motion';
import { fetchIndustryContent, IndustrySection, IndustrySubService } from '../src/lib/industryQueries';
import AppointmentCalendar from '../src/components/AppointmentCalendar';

const ProjectMedical: React.FC = () => {
  const { industryId } = useParams<{ industryId: string }>();
  const [content, setContent] = useState<{ sections: IndustrySection[], services: IndustrySubService[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const id = industryId || 'medical';
        const data = await fetchIndustryContent(id);
        setContent(data);
      } catch (error) {
        console.error('Error loading medical content:', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [industryId]);

  if (loading || !content) {
    return <div className="min-h-screen bg-[#0d2226] flex items-center justify-center text-[#cfd9cc]">جاري التحميل...</div>;
  }

  const hero = content.sections.find(s => s.section_type === 'hero');
  const demo = content.sections.find(s => s.section_type === 'interactive_demo');

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 bg-[#0d2226]" dir="rtl">
      <SEO
        title={hero?.title || "القطاع الطبي والعيادات"}
        description={hero?.description || "أنظمة إدارة عيادات طبية ذكية."}
      />
      <div className="max-w-7xl mx-auto">

        {/* 1. SECTOR DESCRIPTION (Hero) */}
        <header className="mb-20 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-[#1e403a]/40 border border-[#cfd9cc]/20 text-[#cfd9cc] text-xs font-black uppercase tracking-widest mb-6">
            <Stethoscope size={14} /> {hero?.subtitle || "القطاع الطبي"}
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white leading-tight mb-8">
            {hero?.title || "عيادات المستقبل"}
          </h1>
          <p className="text-xl text-[#cfd9cc]/60 max-w-3xl mx-auto font-light leading-relaxed">
            {hero?.description}
          </p>
        </header>

        {/* 2. INTERACTIVE DEMO (Calendar) */}
        {demo && (
          <section className="mb-32">
            <div className="flex flex-col lg:flex-row items-center gap-16 mb-16">
              <div className="flex-1 text-right">
                <div className="inline-flex items-center gap-2 mb-6 text-[#cfd9cc] font-black uppercase tracking-[0.2em] text-sm">
                  <Calendar size={18} /> {demo.subtitle}
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight">
                  {demo.title}
                </h2>
                <p className="text-xl md:text-2xl text-[#cfd9cc]/60 leading-relaxed font-light mb-12">
                  {demo.description}
                </p>
              </div>
              <div className="flex-[1.5] w-full">
                {demo.demo_type === 'calendar' && <AppointmentCalendar />}
              </div>
            </div>
          </section>
        )}

        {/* 3. SERVICE CATALOG (List) */}
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-4xl font-black text-white">الخدمات المتوفرة</h2>
          <div className="h-px flex-1 mx-8 bg-gradient-to-r from-white/10 to-transparent" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {content.services.map((sub: IndustrySubService) => (
            <div key={sub.id} className="glass rounded-[50px] overflow-hidden flex flex-col group hover:border-[#cfd9cc]/20 transition-all">
              <div className="h-64 relative overflow-hidden">
                <img
                  src={sub.image_url || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d'}
                  alt={sub.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d2226] via-transparent to-transparent" />
                <div className="absolute bottom-6 right-6">
                  <div className="bg-[#cfd9cc] text-[#0d2226] px-4 py-2 rounded-xl font-black text-sm shadow-xl">
                    {sub.price}
                  </div>
                </div>
              </div>

              <div className="p-10 flex flex-col flex-grow">
                <h3 className="text-2xl font-black text-white mb-4 group-hover:text-[#cfd9cc] transition-colors">{sub.title}</h3>
                <p className="text-[#cfd9cc]/40 font-light leading-relaxed mb-8 flex-grow">{sub.description}</p>

                <div className="space-y-3 mb-10">
                  {sub.features.map((feature: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-3 text-sm text-[#cfd9cc]/70">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                        <CheckCircle2 size={12} className="text-emerald-400" />
                      </div>
                      {feature}
                    </div>
                  ))}
                </div>

                <button className="w-full py-5 rounded-2xl bg-[#cfd9cc] text-[#0d2226] font-black hover:bg-white transition-all shadow-glow flex items-center justify-center gap-3 active:scale-95">
                  طلب الخدمة الآن <ShoppingBag size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectMedical;
