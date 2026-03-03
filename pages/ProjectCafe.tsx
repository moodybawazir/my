
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Coffee, ShoppingBag, Smartphone, Star, MapPin, Phone, MessageCircle, Gift, CheckCircle2 } from 'lucide-react';
import SEO from '../src/components/SEO';
import { motion } from 'framer-motion';
import { fetchIndustryContent, IndustrySection, IndustrySubService, LoyaltyProgram } from '../src/lib/industryQueries';
import LoyaltyCard from '../src/components/LoyaltyCard';
import { useCart } from '../src/context/CartContext';

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
      price: subService.price || 0,
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

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 bg-[#0d2226]" dir="rtl">
      <SEO
        title={hero?.title || "نظام إدارة المطاعم الذكي"}
        description={hero?.description || "منظومة متكاملة تشمل تطبيقات التوصيل وبرامج الولاء."}
      />
      <div className="max-w-7xl mx-auto">

        {/* 1. SECTOR DESCRIPTION (Hero) */}
        <header className="mb-20 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-[#1e403a]/40 border border-[#cfd9cc]/20 text-[#cfd9cc] text-xs font-black uppercase tracking-widest mb-6">
            <Coffee size={14} /> {hero?.subtitle || "قطاع الضيافة والمطاعم"}
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white leading-tight mb-8">
            {hero?.title?.split('\n').map((line, i) => (
              <React.Fragment key={i}>{line}<br /></React.Fragment>
            )) || "نظام إدارة المطاعم الذكي"}
          </h1>
          <p className="text-xl text-[#cfd9cc]/60 max-w-3xl mx-auto font-light leading-relaxed">
            {hero?.description}
          </p>
        </header>

        {/* 2. INTERACTIVE DEMO (Loyalty) */}
        {demo && content.loyalty && (
          <section className="mb-32">
            <div className="glass p-12 md:p-24 rounded-[60px] relative overflow-hidden group border border-white/5">
              <div className="absolute top-0 right-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=2574')] bg-cover bg-center opacity-5 group-hover:opacity-10 transition-opacity duration-1000" />

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 mb-6 text-[#cfd9cc] font-black uppercase tracking-[0.2em] text-sm">
                    <Gift size={18} /> {demo.subtitle}
                  </div>
                  <h2 className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight">
                    {demo.title}
                  </h2>
                  <p className="text-xl md:text-2xl text-[#cfd9cc]/60 leading-relaxed font-light mb-12">
                    {demo.description}
                  </p>
                  <div className="flex gap-6">
                    <div className="flex items-center gap-3 text-white/50 font-bold">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
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
        {(() => {
          const serviceSections = content.sections.filter(s => s.section_type !== 'hero' && s.section_type !== 'interactive_demo');
          const unlinkedServices = content.services.filter(s => !s.section_id);

          return (
            <>
              {/* Filter / Nav Pills */}
              {serviceSections.length > 0 && (
                <div className="flex flex-wrap gap-4 mb-20 justify-center">
                  {serviceSections.map((sec: IndustrySection) => {
                    const hasServices = content.services.some(s => s.section_id === sec.id);
                    if (!hasServices) return null; // Hide tabs for empty sections

                    return (
                      <button
                        key={sec.id}
                        onClick={() => document.getElementById(`section-${sec.id}`)?.scrollIntoView({ behavior: 'smooth' })}
                        className="px-8 py-3 rounded-full bg-white/5 border border-white/10 text-[#cfd9cc] font-black hover:bg-[#cfd9cc] hover:text-[#0d2226] transition-all"
                      >
                        {sec.title}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Grouped Services By Section */}
              {serviceSections.map((section: IndustrySection) => {
                const linkedServices = content.services.filter(s => s.section_id === section.id);
                if (linkedServices.length === 0) return null;

                return (
                  <div key={section.id} id={`section-${section.id}`} className="mb-32 scroll-mt-32">
                    <div className="flex items-center justify-between mb-12">
                      <h2 className="text-4xl font-black text-white">{section.title}</h2>
                      <div className="h-px flex-1 mx-8 bg-gradient-to-r from-[#cfd9cc]/20 to-transparent" />
                    </div>
                    {section.description && (
                      <p className="text-xl text-[#cfd9cc]/60 mb-10 leading-relaxed font-light">{section.description}</p>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                      {linkedServices.map((sub: IndustrySubService) => (
                        <SubServiceCard key={sub.id} sub={sub} industryId={industryId} handleBuySubService={() => handleBuySubService(sub)} />
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Unlinked / General Services */}
              {unlinkedServices.length > 0 && (
                <div className="mb-32">
                  <div className="flex items-center justify-between mb-12">
                    <h2 className="text-4xl font-black text-white">خدمات إضافية متوفرة</h2>
                    <div className="h-px flex-1 mx-8 bg-gradient-to-r from-white/10 to-transparent" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {unlinkedServices.map((sub: IndustrySubService) => (
                      <SubServiceCard key={sub.id} sub={sub} industryId={industryId} handleBuySubService={() => handleBuySubService(sub)} />
                    ))}
                  </div>
                </div>
              )}
            </>
          );
        })()}
      </div>
    </div>
  );
};

// Extracted SubServiceCard Component for reuse
const SubServiceCard: React.FC<{ sub: IndustrySubService, industryId: string | undefined, handleBuySubService: () => void }> = ({ sub, industryId, handleBuySubService }) => (
  <div className="glass rounded-[50px] overflow-hidden flex flex-col group hover:border-[#cfd9cc]/20 transition-all text-right">
    <div className="h-64 relative overflow-hidden">
      <img
        src={sub.image_url || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f'}
        alt={sub.title}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0d2226] via-transparent to-transparent" />
      <div className="absolute bottom-6 right-6">
        <div className="bg-[#cfd9cc] text-[#0d2226] px-4 py-2 rounded-xl font-black text-sm shadow-xl">
          {sub.has_packages ? 'باقات متعددة' : sub.price}
        </div>
      </div>
    </div>

    <div className="p-10 flex flex-col flex-grow">
      <h3 className="text-2xl font-black text-white mb-4 group-hover:text-[#cfd9cc] transition-colors">{sub.title}</h3>
      <p className="text-[#cfd9cc]/40 font-light leading-relaxed mb-8 flex-grow">{sub.description}</p>

      <div className="space-y-3 mb-10">
        {(sub.features || []).map((feature: string, idx: number) => (
          <div key={idx} className="flex items-center gap-3 text-sm text-[#cfd9cc]/70">
            <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
              <CheckCircle2 size={12} className="text-emerald-400" />
            </div>
            {feature}
          </div>
        ))}
      </div>

      <button
        onClick={handleBuySubService}
        className={`w-full py-5 rounded-2xl font-black transition-all shadow-glow flex items-center justify-center gap-3 active:scale-95 ${sub.has_packages ? 'bg-white/10 text-white hover:bg-white/20 border border-white/10' : 'bg-[#cfd9cc] text-[#0d2226] hover:bg-white'}`}
      >
        {sub.has_packages ? 'استعراض الباقات' : 'طلب الخدمة الآن'} <ShoppingBag size={20} />
      </button>
    </div>
  </div>
);

export default ProjectCafe;
