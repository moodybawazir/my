import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Briefcase, Users, BarChart, CheckCircle2 } from 'lucide-react';
import SEO from '../src/components/SEO';
import { fetchIndustryContent, IndustrySection, IndustrySubService } from '../src/lib/industryQueries';

const ProjectAccounting: React.FC = () => {
  const { industryId } = useParams<{ industryId: string }>();
  const [content, setContent] = useState<{ sections: IndustrySection[], services: IndustrySubService[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const id = industryId || 'accounting';
        const data = await fetchIndustryContent(id);
        setContent(data);
      } catch (error) {
        console.error('Error loading Accounting content:', error);
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

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 bg-[#0d2226]" dir="rtl">
      <SEO
        title={hero?.title || "نظام إدارة الوكالات والشركات"}
        description={hero?.description || "نظام ERP مصغر لإدارة المشاريع والعملاء والفواتير."}
      />
      <div className="max-w-7xl mx-auto">
        <header className="mb-20 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-[#1e403a]/40 border border-[#cfd9cc]/20 text-[#cfd9cc] text-xs font-black uppercase tracking-widest mb-6">
            <Briefcase size={14} /> {hero?.subtitle || "الوكالات والشركات"}
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white leading-tight mb-8">
            {hero?.title || "إدارة أعمالك بذكاء."}
          </h1>
          <p className="text-xl text-[#cfd9cc]/60 max-w-3xl mx-auto font-light leading-relaxed">
            {hero?.description}
          </p>
        </header>

        <div className="space-y-12">
          {content.services.map((sub, i) => (
            <div key={i} className={`glass p-12 rounded-[50px] border-white/5 flex flex-col md:flex-row items-center gap-12 ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
              <div className="flex-1">
                <h2 className="text-4xl font-black text-white mb-6">{sub.title}</h2>
                <p className="text-[#cfd9cc]/60 text-lg mb-8 leading-relaxed">
                  {sub.description}
                </p>
                <div className="flex flex-wrap gap-4 mb-8">
                  {sub.features.map((f, idx) => (
                    <div key={idx} className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl text-sm text-[#cfd9cc]">
                      <CheckCircle2 size={16} className="text-emerald-500" />
                      {f}
                    </div>
                  ))}
                </div>
                <div className="text-3xl font-black text-[#cfd9cc] mb-8">{sub.price}</div>
                <button className="bg-[#cfd9cc] text-[#0d2226] px-10 py-5 rounded-2xl font-black hover:bg-white transition-all shadow-glow active:scale-95">
                  ابدأ التجربة المجانية
                </button>
              </div>
              <div className="flex-1 w-full aspect-video bg-black/40 rounded-[40px] border border-white/10 flex items-center justify-center overflow-hidden group">
                {sub.image_url ? (
                  <img src={sub.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                ) : (
                  <BarChart size={80} className="text-white/10" />
                )}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#cfd9cc]/5 to-transparent" />
              </div>
            </div>
          ))}

          {/* Fallback if no services */}
          {content.services.length === 0 && (
            <div className="glass p-12 rounded-[50px] border-white/5 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-black text-white mb-6">CRM متكامل</h2>
                <p className="text-[#cfd9cc]/60 text-lg mb-8">
                  تتبع رحلة العميل من Lead إلى Deal. سجل كل المكالمات والاجتماعات في مكان واحد.
                </p>
                <button className="bg-[#cfd9cc] text-[#0d2226] px-8 py-4 rounded-xl font-bold hover:bg-white transition-all">
                  ابدأ التجربة المجانية
                </button>
              </div>
              <div className="relative h-64 bg-black/20 rounded-3xl border border-white/10 flex items-center justify-center">
                <Users size={64} className="text-white/20" />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#cfd9cc]/5 to-transparent rounded-3xl" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectAccounting;
