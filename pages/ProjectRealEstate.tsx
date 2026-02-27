
import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Camera, Plus, Sparkles, Building2, ShoppingBag, CheckCircle2 } from 'lucide-react';
import SEO from '../src/components/SEO';
import ThreeDViewer from '../src/components/ThreeDViewer';
import { fetchIndustryContent, fetchIndustryDemo, IndustrySection, IndustrySubService } from '../src/lib/industryQueries';

const ProjectRealEstate: React.FC = () => {
   const { industryId } = useParams<{ industryId: string }>();
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

      sessionStorage.setItem('checkout_item', JSON.stringify({
         type: 'service',
         id: subService.id,
         title: subService.title,
         price: subService.price,
         description: subService.description
      }));
      window.location.hash = '#/checkout';
   };

   if (loading || !content || !villaData) {
      return <div className="min-h-screen bg-[#0d2226] flex items-center justify-center text-[#cfd9cc]">جاري التحميل...</div>;
   }

   const hero = content.sections.find(s => s.section_type === 'hero');
   const demo = content.sections.find(s => s.section_type === 'interactive_demo' || s.section_type === 'feature');

   return (
      <div className="min-h-screen pt-32 pb-24 px-6 bg-[#0d2226]" dir="rtl">
         <SEO
            title={hero?.title || "حلول العقارات الذكية"}
            description={hero?.description || "منظومة متكاملة لعرض العقارات بتقنيات الـ 3D."}
         />

         <div className="max-w-7xl mx-auto">
            {/* 1. SECTOR DESCRIPTION (Hero) */}
            <header className="mb-20 text-center">
               <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-[#1e403a]/40 border border-[#cfd9cc]/20 text-[#cfd9cc] text-xs font-black uppercase tracking-widest mb-6">
                  <Building2 size={14} /> {hero?.subtitle || "قطاع التطوير العقاري"}
               </div>
               <h1 className="text-6xl md:text-8xl font-black text-white leading-tight mb-8">
                  {hero?.title || "عقارات بصيرة الرقمية"}
               </h1>
               <p className="text-xl text-[#cfd9cc]/60 max-w-3xl mx-auto font-light leading-relaxed">
                  {hero?.description}
               </p>
            </header>

            {/* 2. INTERACTIVE DEMO (3D Viewer) */}
            {demo && (
               <section className="mb-32">
                  <div className="mb-12">
                     <div className="inline-flex items-center gap-2 mb-4 text-[#cfd9cc] font-black uppercase tracking-[0.2em] text-sm">
                        <Sparkles size={18} /> {demo.subtitle}
                     </div>
                     <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                        {demo.title}
                     </h2>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                     <div className="lg:col-span-8 space-y-6">
                        <div className="relative rounded-[40px] overflow-hidden shadow-2xl h-[500px] md:h-[700px] border border-white/5">
                           <ThreeDViewer image={villaData.rooms[activeRoom].image} className={isZooming ? 'scale-110 blur-sm' : ''} />

                           <div className="absolute top-8 right-8 flex gap-3">
                              {villaData.rooms.map((room, i) => (
                                 <button
                                    key={i}
                                    onClick={() => {
                                       setIsZooming(true);
                                       setTimeout(() => {
                                          setActiveRoom(i);
                                          setIsZooming(false);
                                       }, 500);
                                    }}
                                    className={`px-6 py-3 rounded-xl font-black text-xs transition-all ${activeRoom === i ? 'bg-[#cfd9cc] text-[#0d2226] shadow-glow' : 'bg-black/40 text-white hover:bg-black/60 backdrop-blur-md'}`}
                                 >
                                    {room.name}
                                 </button>
                              ))}
                           </div>
                        </div>
                     </div>

                     <div className="lg:col-span-4 space-y-4">
                        <div className="text-xs font-black text-[#cfd9cc]/30 uppercase tracking-[0.2em] mb-4">وحدات التطوير المتاحة</div>
                        {content.services.map((m, i) => (
                           <div
                              key={i}
                              onClick={() => handleBuySubService(m)}
                              className="bg-[#12282c] border border-white/5 rounded-[30px] p-6 flex items-center justify-between group hover:bg-[#163035] transition-all hover:border-[#cfd9cc]/20 cursor-pointer"
                           >
                              <div className="flex items-center gap-5">
                                 <div className="w-14 h-14 bg-[#1a383d] rounded-2xl flex items-center justify-center text-[#cfd9cc] group-hover:scale-110 group-hover:bg-[#cfd9cc] group-hover:text-[#0d2226] transition-all duration-500 shadow-xl">
                                    <Camera size={24} />
                                 </div>
                                 <div>
                                    <h4 className="text-lg font-black text-white mb-1">{m.title}</h4>
                                    <div className="text-xl font-black text-[#cfd9cc] tracking-tight">{m.price}</div>
                                 </div>
                              </div>
                              <button className="w-10 h-10 bg-[#1a383d] text-white rounded-xl flex items-center justify-center hover:bg-[#cfd9cc] hover:text-[#0d2226] transition-all group-hover:shadow-glow">
                                 <Plus size={20} />
                              </button>
                           </div>
                        ))}
                     </div>
                  </div>
               </section>
            )}

            {/* 3. SERVICE GRID */}
            <div className="flex items-center justify-between mb-12">
               <h2 className="text-4xl font-black text-white">تفاصيل الخدمات</h2>
               <div className="h-px flex-1 mx-8 bg-gradient-to-r from-white/10 to-transparent" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
               {content.services.map((sub: IndustrySubService) => (
                  <div key={sub.id} className="glass rounded-[50px] overflow-hidden flex flex-col group hover:border-[#cfd9cc]/20 transition-all">
                     <div className="h-64 relative overflow-hidden">
                        <img
                           src={sub.image_url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c'}
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
                           onClick={() => handleBuySubService(sub)}
                           className={`w-full py-5 rounded-2xl font-black transition-all shadow-glow flex items-center justify-center gap-3 active:scale-95 ${sub.has_packages ? 'bg-white/10 text-white hover:bg-white/20 border border-white/10' : 'bg-[#cfd9cc] text-[#0d2226] hover:bg-white'}`}
                        >
                           {sub.has_packages ? 'استعراض الباقات' : 'طلب الخدمة الآن'} <ShoppingBag size={20} />
                        </button>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
};

export default ProjectRealEstate;
