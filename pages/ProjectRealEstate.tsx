
import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Camera, Plus, Sparkles, Building2, ShoppingBag, CheckCircle2 } from 'lucide-react';
import SEO from '../src/components/SEO';
import ThreeDViewer from '../src/components/ThreeDViewer';
import { fetchIndustryContent, fetchIndustryDemo, IndustrySection, IndustrySubService } from '../src/lib/industryQueries';
import { useCart } from '../src/context/CartContext';


import { IndustryAccordion } from '../src/components/industry/IndustryAccordion';
import { SubServiceRow } from '../src/components/industry/SubServiceRow';
import { RandomServices } from '../src/components/industry/RandomServices';

const ProjectRealEstate: React.FC = () => {
   const { industryId } = useParams<{ industryId: string }>();
   const { addItem } = useCart();
   const [content, setContent] = useState<{ sections: IndustrySection[], services: IndustrySubService[] } | null>(null);
   const [villaData, setVillaData] = useState<any>(null);
   const [loading, setLoading] = useState(true);
   const [activeRoom, setActiveRoom] = useState(0);
   const [isZooming, setIsZooming] = useState(false);

   useEffect(() => {
      const load = async () => {
         try {
            const id = industryId || 'real-estate';
            const industryData = await fetchIndustryContent(id);
            const demoData = await fetchIndustryDemo(id, 'villa-yagout');
            setContent(industryData);
            setVillaData(demoData);
         } catch (error) {
            console.error('Error loading real estate content:', error);
         } finally {
            setLoading(false);
         }
      };
      load();
   }, []);

   const handleBuySubService = (subService: IndustrySubService) => {
      if (subService.has_packages) {
         window.location.hash = `#/service/${industryId || 'real-estate'}/${subService.id}/packages`;
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

   if (loading || !content || !villaData) {
      return <div className="min-h-screen bg-[#0d2226] flex items-center justify-center text-[#cfd9cc]">جاري التحميل...</div>;
   }

   const hero = content.sections.find(s => s.section_type === 'hero');
   const demo = content.sections.find(s => s.section_type === 'interactive_demo');
   const serviceSections = content.sections.filter(s => s.section_type === 'standard');
   const unlinkedServices = content.services.filter(s => !s.section_id);

   return (
      <div className="min-h-screen pt-48 pb-24 px-6 bg-[#0d2226]" dir="rtl">
         <SEO
            title={hero?.title || "حلول العقارات الذكية"}
            description={hero?.description || "منظومة متكاملة لعرض العقارات بتقنيات الـ 3D."}
         />

         <div className="max-w-7xl mx-auto">
            {/* 1. SECTOR DESCRIPTION (Hero) */}
            <header className="mb-24 text-center">
               <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-[#1e403a]/40 border border-[#cfd9cc]/20 text-[#cfd9cc] text-xs font-black uppercase tracking-widest mb-6">
                  <Building2 size={14} /> {hero?.subtitle || "قطاع التطوير العقاري"}
               </div>
               <h1 className="text-6xl md:text-8xl font-black text-white leading-tight mb-8">
                  {hero?.title || "عقارات بصيرة الرقمية"}
               </h1>
               <p className="text-xl md:text-2xl text-[#cfd9cc]/60 max-w-4xl mx-auto font-light leading-relaxed">
                  {hero?.description}
               </p>
            </header>

            {/* 2. INTERACTIVE DEMO (3D Viewer Banner) */}
            {demo && (
               <section className="mb-32">
                  <div className="glass p-12 md:p-16 rounded-[60px] border border-white/5 overflow-hidden text-center">
                     <div className="mb-12">
                        <div className="inline-flex items-center gap-2 mb-4 text-[#cfd9cc] font-black uppercase tracking-[0.2em] text-sm justify-center">
                           <Sparkles size={18} /> {demo.subtitle}
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                           {demo.title}
                        </h2>
                        <p className="text-xl text-[#cfd9cc]/60 max-w-2xl mx-auto font-light leading-relaxed mb-12">
                           استكشف العقار بتقنية ثلاثية الأبعاد التفاعلية وعش تفاصيل منزلك المستقبلي قبل بدء التنفيذ.
                        </p>

                        <button
                           onClick={() => window.location.hash = `#/project/${industryId || 'real-estate'}/3d`}
                           className="inline-flex items-center gap-4 px-10 py-5 rounded-full bg-gradient-to-r from-[#cfd9cc] to-white text-[#0d2226] font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-glow"
                        >
                           اضغط هنا لبدء التجربة <Camera size={24} />
                        </button>
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
                                       window.location.hash = `#/service/${industryId || 'real-estate'}/${s.id}/packages`;
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
                     <h2 className="text-4xl font-black text-white">وحدات وخدمات إضافية</h2>
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


export default ProjectRealEstate;
