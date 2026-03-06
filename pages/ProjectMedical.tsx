
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Stethoscope, Calendar, Phone, Sparkles, Building2, BrainCircuit, ShoppingBag, CheckCircle2 } from 'lucide-react';
import SEO from '../src/components/SEO';
import { motion } from 'framer-motion';
import { fetchIndustryContent, IndustrySection, IndustrySubService } from '../src/lib/industryQueries';
import AppointmentCalendar from '../src/components/AppointmentCalendar';
import { useCart } from '../src/context/CartContext';


import { IndustryAccordion } from '../src/components/industry/IndustryAccordion';
import { SubServiceRow } from '../src/components/industry/SubServiceRow';
import { RandomServices } from '../src/components/industry/RandomServices';

const ProjectMedical: React.FC = () => {
  const { industryId } = useParams<{ industryId: string }>();
  const { addItem } = useCart();
  const [content, setContent] = useState<{ sections: IndustrySection[], services: IndustrySubService[] } | null>(null);
  const [loading, setLoading] = useState(true);

  const handleBuySubService = (subService: IndustrySubService) => {
    if (subService.has_packages) {
      window.location.hash = `#/service/${industryId || 'medical'}/${subService.id}/packages`;
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
  const serviceSections = content.sections.filter(s => s.section_type !== 'hero' && s.section_type !== 'interactive_demo');
  const unlinkedServices = content.services.filter(s => !s.section_id);

  return (
    <div className="min-h-screen pt-48 pb-24 px-6 bg-[#0d2226]" dir="rtl">
      <SEO
        title={hero?.title || "القطاع الطبي والعيادات"}
        description={hero?.description || "أنظمة إدارة عيادات طبية ذكية."}
      />
      <div className="max-w-7xl mx-auto">

        {/* 1. SECTOR DESCRIPTION (Hero) */}
        <header className="mb-24 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-[#1e403a]/40 border border-[#cfd9cc]/20 text-[#cfd9cc] text-xs font-black uppercase tracking-widest mb-6">
            <Stethoscope size={14} /> {hero?.subtitle || "القطاع الطبي"}
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white leading-tight mb-8">
            {hero?.title || "عيادات المستقبل"}
          </h1>
          <p className="text-xl md:text-2xl text-[#cfd9cc]/60 max-w-4xl mx-auto font-light leading-relaxed">
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
              <div className="flex-[1.5] w-full bg-white/5 rounded-[40px] p-8 border border-white/10 shadow-3xl">
                {demo.demo_type === 'calendar' && <AppointmentCalendar />}
              </div>
            </div>
          </section>
        )}

        {/* 3. SECTIONS NAVIGATION & SERVICES */}
        <div className="space-y-6">
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
                      onViewDetails={(s) => {
                        if (s.has_packages) {
                          window.location.hash = `#/service/${industryId || 'medical'}/${s.id}/packages`;
                        }
                      }}
                    />
                  ))}
                </div>
              </IndustryAccordion>
            );
          })}
        </div>

        {/* Unlinked / General Services */}
        {unlinkedServices.length > 0 && (
          <div className="mt-24">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-4xl font-black text-white">خدمات طبية إضافية</h2>
              <div className="h-px flex-1 mx-8 bg-gradient-to-r from-white/10 to-transparent" />
            </div>
            <div className="space-y-6">
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

        {/* Bottom Random Services */}
        <RandomServices />
      </div>
    </div>
  );
};

export default ProjectMedical;
