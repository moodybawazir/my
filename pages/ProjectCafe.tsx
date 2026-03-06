
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Coffee, ShoppingBag, Smartphone, Star, MapPin, Phone, MessageCircle, Gift, CheckCircle2 } from 'lucide-react';
import SEO from '../src/components/SEO';
import { motion } from 'framer-motion';
import { fetchIndustryContent, IndustrySection, IndustrySubService, LoyaltyProgram } from '../src/lib/industryQueries';
import LoyaltyCard from '../src/components/LoyaltyCard';
import { useCart } from '../src/context/CartContext';


import { IndustryAccordion } from '../src/components/industry/IndustryAccordion';
import { SubServiceRow } from '../src/components/industry/SubServiceRow';
import { RandomServices } from '../src/components/industry/RandomServices';

const ProjectCafe: React.FC = () => {
  const { industryId } = useParams<{ industryId: string }>();
  const { addItem } = useCart();
  const [content, setContent] = useState<{ sections: IndustrySection[], services: IndustrySubService[], loyalty: LoyaltyProgram | null } | null>(null);
  const [loading, setLoading] = useState(true);

  const handleBuySubService = (subService: IndustrySubService) => {
    if (subService.has_packages) {
      window.location.hash = `#/service/${industryId || 'restaurants'}/${subService.id}/packages`;
      return;
    }

    addItem({
      id: subService.id,
      type: 'service',
      title: subService.title,
      price: Number(subService.price) || 0,
    });
    window.location.hash = '#/checkout';
  };

  useEffect(() => {
    const load = async () => {
      try {
        const id = industryId || 'restaurants';
        const data = await fetchIndustryContent(id);
        setContent(data);
      } catch (error) {
        console.error('Error loading restaurant content:', error);
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
        title={hero?.title || "نظام إدارة المطاعم الذكي"}
        description={hero?.description || "منظومة متكاملة تشمل تطبيقات التوصيل وبرامج الولاء."}
      />
      <div className="max-w-7xl mx-auto">

        {/* 1. SECTOR DESCRIPTION (Hero) */}
        <header className="mb-32 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-[#1e403a]/40 border border-[#cfd9cc]/20 text-[#cfd9cc] text-xs font-black uppercase tracking-widest mb-8">
            <Coffee size={16} /> {hero?.subtitle || "قطاع الضيافة والمطاعم"}
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white leading-tight mb-8">
            {hero?.title || "نظام إدارة المطاعم الذكي"}
          </h1>
          <p className="text-xl md:text-2xl text-[#cfd9cc]/60 max-w-4xl mx-auto font-light leading-relaxed">
            {hero?.description}
          </p>
        </header>

        {/* 2. INTERACTIVE DEMO (Loyalty) */}
        {demo && content.loyalty && (
          <section className="mb-40">
            <div className="glass p-12 md:p-24 rounded-[60px] relative overflow-hidden group border-2 border-white/5">
              <div className="absolute top-0 right-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=2574')] bg-cover bg-center opacity-5 group-hover:opacity-10 transition-opacity duration-1000" />

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <div className="space-y-8">
                  <div className="inline-flex items-center gap-2 text-[#cfd9cc] font-black uppercase tracking-[0.2em] text-sm">
                    <Gift size={20} /> {demo.subtitle}
                  </div>
                  <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
                    {demo.title}
                  </h2>
                  <p className="text-xl md:text-2xl text-[#cfd9cc]/60 leading-relaxed font-light">
                    {demo.description}
                  </p>
                  <div className="flex gap-6">
                    <div className="flex items-center gap-3 text-white/50 font-bold">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      <span>نظام تفاعلي حي</span>
                    </div>
                  </div>
                </div>

                <div className="w-full">
                  <LoyaltyCard config={content.loyalty} />
                </div>
              </div>
            </div>
          </section>
        )}

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
              <h2 className="text-4xl font-black text-white">خدمات ضيافة إضافية</h2>
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

        {/* Bottom Random Services */}
        <RandomServices />
      </div>
    </div>
  );
};

export default ProjectCafe;
