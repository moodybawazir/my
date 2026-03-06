import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Briefcase, Users, BarChart, CheckCircle2, ShoppingBag } from 'lucide-react';
import SEO from '../src/components/SEO';
import { fetchIndustryContent, IndustrySection, IndustrySubService } from '../src/lib/industryQueries';
import { useCart } from '../src/context/CartContext';


import { IndustryAccordion } from '../src/components/industry/IndustryAccordion';
import { SubServiceRow } from '../src/components/industry/SubServiceRow';
import { RandomServices } from '../src/components/industry/RandomServices';

const ProjectAccounting: React.FC = () => {
  const { industryId } = useParams<{ industryId: string }>();
  const { addItem } = useCart();
  const [content, setContent] = useState<{ sections: IndustrySection[], services: IndustrySubService[] } | null>(null);
  const [loading, setLoading] = useState(true);

  const handleBuySubService = (subService: IndustrySubService) => {
    if (subService.has_packages) {
      window.location.hash = `#/service/${industryId || 'accounting'}/${subService.id}/packages`;
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
  const serviceSections = content.sections.filter(s => s.section_type !== 'hero' && s.section_type !== 'interactive_demo');
  const unlinkedServices = content.services.filter(s => !s.section_id);

  return (
    <div className="min-h-screen pt-48 pb-24 px-6 bg-[#0d2226]" dir="rtl">
      <SEO
        title={hero?.title || "نظام إدارة الوكالات والشركات"}
        description={hero?.description || "نظام ERP مصغر لإدارة المشاريع والعملاء والفواتير."}
      />
      <div className="max-w-7xl mx-auto">
        <header className="mb-32 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-[#1e403a]/40 border border-[#cfd9cc]/20 text-[#cfd9cc] text-xs font-black uppercase tracking-widest mb-8">
            <Briefcase size={16} /> {hero?.subtitle || "الوكالات والشركات"}
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white leading-tight mb-8">
            {hero?.title || "إدارة أعمالك بذكاء."}
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
              <h2 className="text-4xl font-black text-white">خدمات إدارية إضافية</h2>
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
          <div className="glass p-16 md:p-24 rounded-[60px] border-white/5 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-40">
            <div className="space-y-10">
              <h2 className="text-5xl font-black text-white">نظام CRM متكامل للأعمال</h2>
              <p className="text-[#cfd9cc]/60 text-xl leading-relaxed font-light">
                تتبع رحلة العميل من مرحلة الاهتمام إلى اتمام الصفقات. سجل كل التفاعلات والبيانات في لوحة تحكم واحدة متطورة.
              </p>
              <button className="bg-[#cfd9cc] text-[#0d2226] px-10 py-5 rounded-2xl font-black hover:bg-white transition-all shadow-glow">
                ابدأ التجربة المجانية الآن
              </button>
            </div>
            <div className="relative h-[400px] bg-white/5 rounded-[40px] border border-white/10 flex items-center justify-center overflow-hidden">
              <Users size={120} className="text-[#cfd9cc]/10" />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#cfd9cc]/10 via-transparent to-transparent" />
              {/* Subtle animated elements or icons could go here */}
            </div>
          </div>
        )}

        {/* Bottom Random Services */}
        <RandomServices />
      </div>
    </div>
  );
};

export default ProjectAccounting;
