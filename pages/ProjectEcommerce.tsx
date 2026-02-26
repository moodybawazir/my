import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShoppingCart, TrendingUp, Globe, CreditCard, CheckCircle2 } from 'lucide-react';
import SEO from '../src/components/SEO';
import { fetchIndustryContent, IndustrySection, IndustrySubService } from '../src/lib/industryQueries';

const ProjectEcommerce: React.FC = () => {
  const { industryId } = useParams<{ industryId: string }>();
  const [content, setContent] = useState<{ sections: IndustrySection[], services: IndustrySubService[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const id = industryId || 'ecommerce';
        const data = await fetchIndustryContent(id);
        setContent(data);
      } catch (error) {
        console.error('Error loading Ecommerce content:', error);
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
        title={hero?.title || "منصة التجارة الإلكترونية الذكية"}
        description={hero?.description || "منصة متكاملة تدعم التوسع العالمي والذكاء الاصطناعي."}
      />
      <div className="max-w-7xl mx-auto">
        <header className="mb-20 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-[#1e403a]/40 border border-[#cfd9cc]/20 text-[#cfd9cc] text-xs font-black uppercase tracking-widest mb-6">
            <ShoppingCart size={14} /> {hero?.subtitle || "التجارة الإلكترونية"}
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white leading-tight mb-8">
            {hero?.title || "متاجرك حول العالم."}
          </h1>
          <p className="text-xl text-[#cfd9cc]/60 max-w-3xl mx-auto font-light leading-relaxed">
            {hero?.description}
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-white">
          {content.services.map((sub, i) => (
            <div key={i} className="glass p-10 rounded-[40px] border-white/5 group hover:border-[#cfd9cc]/20 transition-all flex flex-col items-center">
              <div className="w-16 h-16 bg-[#1e403a] rounded-[22px] flex items-center justify-center mb-8 border border-white/5 overflow-hidden">
                {sub.image_url ? (
                  <img src={sub.image_url} className="w-full h-full object-cover" alt="" />
                ) : (
                  <span className="text-[#cfd9cc] text-2xl font-black">{i + 1}</span>
                )}
              </div>
              <h3 className="text-2xl font-bold mb-4">{sub.title}</h3>
              <p className="text-white/60 mb-6 font-light">{sub.description}</p>
              <div className="text-xl font-black text-[#cfd9cc] mb-8">{sub.price}</div>
              <div className="w-full space-y-3 mt-auto">
                {(sub.features || []).map((f: string, idx: number) => (
                  <div key={idx} className="flex items-center justify-center gap-2 text-xs text-white/40">
                    <CheckCircle2 size={12} className="text-emerald-500" />
                    {f}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Fallback Features if no services */}
          {content.services.length === 0 && (
            <>
              <div className="glass p-8 rounded-3xl">
                <Globe size={48} className="mx-auto mb-6 text-blue-400" />
                <h3 className="text-2xl font-bold mb-4">دعم عالمي</h3>
                <p className="text-white/60">تعدد اللغات والعملات تلقائياً حسب موقع العميل.</p>
              </div>
              <div className="glass p-8 rounded-3xl">
                <CreditCard size={48} className="mx-auto mb-6 text-emerald-400" />
                <h3 className="text-2xl font-bold mb-4">بوابات دفع</h3>
                <p className="text-white/60">ربط مباشر مع Stripe, PayPal, Mada, و Apple Pay.</p>
              </div>
              <div className="glass p-8 rounded-3xl">
                <TrendingUp size={48} className="mx-auto mb-6 text-purple-400" />
                <h3 className="text-2xl font-bold mb-4">نمو التسويق</h3>
                <p className="text-white/60">أدوات SEO و Pixel مدمجة لحملات إعلانية ناجحة.</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectEcommerce;
