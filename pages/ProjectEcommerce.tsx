import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShoppingCart, TrendingUp, Globe, CreditCard, CheckCircle2, ShoppingBag } from 'lucide-react';
import SEO from '../src/components/SEO';
import { fetchIndustryContent, IndustrySection, IndustrySubService } from '../src/lib/industryQueries';
import { useCart } from '../src/context/CartContext';


import { IndustryAccordion } from '../src/components/industry/IndustryAccordion';
import { SubServiceRow } from '../src/components/industry/SubServiceRow';
import { RandomServices } from '../src/components/industry/RandomServices';

const ProjectEcommerce: React.FC = () => {
  const { industryId } = useParams<{ industryId: string }>();
  const { addItem } = useCart();
  const [content, setContent] = useState<{ sections: IndustrySection[], services: IndustrySubService[] } | null>(null);
  const [loading, setLoading] = useState(true);

  const handleBuySubService = (subService: IndustrySubService) => {
    if (subService.has_packages) {
      window.location.hash = `#/service/${industryId || 'ecommerce'}/${subService.id}/packages`;
      return;
    }

    addItem({
      id: subService.id,
      type: 'service',
      title: subService.title,
      price: Number(subService.price) || 0,
      quantity: 1
    });
    window.location.hash = '#/checkout';
  };

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
  const serviceSections = content.sections.filter(s => s.section_type !== 'hero' && s.section_type !== 'interactive_demo');
  const unlinkedServices = content.services.filter(s => !s.section_id);

  return (
    <div className="min-h-screen pt-48 pb-24 px-6 bg-[#0d2226]" dir="rtl">
      <SEO
        title={hero?.title || "منصة التجارة الإلكترونية الذكية"}
        description={hero?.description || "منصة متكاملة تدعم التوسع العالمي والذكاء الاصطناعي."}
      />
      <div className="max-w-7xl mx-auto">
        <header className="mb-32 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-[#1e403a]/40 border border-[#cfd9cc]/20 text-[#cfd9cc] text-xs font-black uppercase tracking-widest mb-8">
            <ShoppingCart size={16} /> {hero?.subtitle || "التجارة الإلكترونية"}
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white leading-tight mb-8">
            {hero?.title || "متاجرك حول العالم."}
          </h1>
          <p className="text-xl md:text-2xl text-[#cfd9cc]/60 max-w-4xl mx-auto font-light leading-relaxed">
            {hero?.description}
          </p>
        </header>

        {/* 3. SECTIONS NAVIGATION & SERVICES */}
        <div className="space-y-8 mb-40">
          {serviceSections.map((section: IndustrySection, idx: number) => {
            const linkedServices = content.services.filter(s => s.section_id === section.id);
            if (linkedServices.length === 0 && !section.description) return null;

            return (
              <IndustryAccordion
                key={section.id}
                section={section}
                defaultOpen={idx === 0}
              >
                <div className="space-y-6">
                  {linkedServices.map((sub: IndustrySubService) => (
                    <SubServiceRow
                      key={sub.id}
                      sub={sub}
                      industryId={industryId}
                      onBuy={handleBuySubService}
                    />
                  ))}
                </div>
              </IndustryAccordion>
            );
          })}
        </div>

        {/* Unlinked / General Services */}
        {unlinkedServices.length > 0 && (
          <div className="mt-24 mb-40">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-4xl font-black text-white">إمكانيات تجارية متطورة</h2>
              <div className="h-px flex-1 mx-8 bg-gradient-to-r from-white/10 to-transparent" />
            </div>
            <div className="space-y-8">
              {unlinkedServices.map((sub: IndustrySubService) => (
                <SubServiceRow
                  key={sub.id}
                  sub={sub}
                  industryId={industryId}
                  onBuy={handleBuySubService}
                />
              ))}
            </div>
          </div>
        )}

        {/* Fallback Features if no services at all */}
        {content.services.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-40">
            <div className="glass p-12 rounded-[40px] border-white/5 text-center group hover:border-[#cfd9cc]/20 transition-all">
              <Globe size={64} className="mx-auto mb-8 text-[#cfd9cc] group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-black text-white mb-4">توسع عالمي</h3>
              <p className="text-[#cfd9cc]/60 leading-relaxed font-light">تعدد اللغات والعملات تلقائياً حسب موقع عملائك في أي مكان.</p>
            </div>
            <div className="glass p-12 rounded-[40px] border-white/5 text-center group hover:border-[#cfd9cc]/20 transition-all">
              <CreditCard size={64} className="mx-auto mb-8 text-[#cfd9cc] group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-black text-white mb-4">بوابات دفع آمنة</h3>
              <p className="text-[#cfd9cc]/60 leading-relaxed font-light">ربط مباشر مع أكثر من ٥٠ بوابة دفع عالمية ومحلية بكل سهولة.</p>
            </div>
            <div className="glass p-12 rounded-[40px] border-white/5 text-center group hover:border-[#cfd9cc]/20 transition-all">
              <TrendingUp size={64} className="mx-auto mb-8 text-[#cfd9cc] group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-black text-white mb-4">نمو التسويق</h3>
              <p className="text-[#cfd9cc]/60 leading-relaxed font-light">أدوات تحصين SEO و Pixel مدمجة لضمان نجاح حملاتك الإعلانية.</p>
            </div>
          </div>
        )}

        {/* Bottom Random Services */}
        <RandomServices />
      </div>
    </div>
  );
};

export default ProjectEcommerce;
