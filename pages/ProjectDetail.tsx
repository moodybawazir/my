import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
   ArrowLeft, Rocket, Zap, Shield, CheckCircle2,
   Package, ShoppingCart, Star, Share2, Heart,
   Cpu, Building2, BrainCircuit, Coffee, Stethoscope,
   BookOpen, Terminal, Globe, Key, FileText, Layers,
   ChevronRight
} from 'lucide-react';
import { supabase } from '../src/lib/supabase';

import ThreeDViewer from '../src/components/ThreeDViewer';

const IconMap: any = {
   Building2, BrainCircuit, Coffee, Stethoscope, Cpu, Star,
   BookOpen, Terminal, Globe, Key, FileText, Layers
};

const ProjectDetail: React.FC = () => {
   const { id } = useParams();
   const [project, setProject] = useState<any>(null);
   const [similarProducts, setSimilarProducts] = useState<any[]>([]);
   const [loading, setLoading] = useState(true);
   const scrollRef = useRef<HTMLDivElement>(null);
   const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

   useEffect(() => {
      const handleResize = () => setIsMobile(window.innerWidth < 768);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
   }, []);

   useEffect(() => {
      const fetchProject = async () => {
         if (!id) return;
         setLoading(true);

         const { data, error } = await (supabase.from('products') as any).select('*').eq('id', id).single();
         if (!error && data) {
            const mapped = {
               ...data,
               title: data.name,
               price: `${data.price?.toLocaleString('ar-SA')} ريال`,
               category: data.category || 'منتج بصيرة',
               longDesc: data.full_description || data.description,
               images: data.images || [],
               features: data.features || []
            };
            setProject(mapped);

            const { data: similar } = await (supabase.from('products') as any).select('*').neq('id', id).limit(4);
            if (similar) {
               setSimilarProducts(similar.map((p: any) => ({
                  ...p,
                  title: p.name,
                  image: p.images?.[0],
                  price: `${p.price?.toLocaleString('ar-SA')} ريال`
               })));
            }
         }
         setLoading(false);
      };
      fetchProject();
   }, [id]);

   if (loading) {
      return (
         <div className="min-h-screen pt-40 text-center text-white bg-[#0d2226]" dir="rtl">
            <h1 className="text-4xl font-black mb-8 animate-pulse">جاري التحميل...</h1>
         </div>
      );
   }

   if (!project) {
      return (
         <div className="min-h-screen pt-40 text-center text-white bg-[#0d2226]" dir="rtl">
            <h1 className="text-4xl font-black mb-8">عذراً، هذا المنتج غير متاح حالياً</h1>
            <Link to="/store" className="text-[#cfd9cc] underline font-bold">العودة للمتجر الرقمي</Link>
         </div>
      );
   }


   const scroll = (direction: 'right' | 'left') => {
      if (scrollRef.current) {
         const { scrollLeft, clientWidth } = scrollRef.current;
         const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
         scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
      }
   };

   const IconComponent = IconMap[project?.icon] || Package;

   return (
      <div className="min-h-screen pt-32 pb-24 px-4 md:px-6 bg-[#0d2226]" dir="rtl">
         <div className="max-w-7xl mx-auto">

            {/* Navigation */}
            <Link to="/store" className="inline-flex items-center gap-2 text-[#cfd9cc]/40 hover:text-[#cfd9cc] mb-12 transition-colors font-bold group">
               <ArrowLeft size={20} className="group-hover:-translate-x-2 transition-transform" /> العودة للمتجر الرقمي
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 mb-32">

               {/* Visual Area */}
               <div className="space-y-8 animate-in fade-in slide-in-from-right duration-700">
                  {/* 3D Walkthrough Container */}
                  <ThreeDViewer image={project.images?.[0] || "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=1600"} />

                  <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                     {project.images?.map((img: string, i: number) => (
                        <img key={i} src={img} className="w-24 h-24 rounded-2xl object-cover cursor-pointer border border-white/10 hover:border-[#cfd9cc] transition-all" />
                     ))}
                  </div>
               </div>

               {/* Info Area */}
               <div className="flex flex-col justify-center space-y-8 md:space-y-10 animate-in fade-in slide-in-from-left duration-700">
                  <div className="space-y-6 text-right">
                     <div className="inline-flex items-center gap-3 px-5 py-2 bg-[#1e403a] border border-[#cfd9cc]/20 rounded-full text-[#cfd9cc] text-xs font-black uppercase tracking-widest">
                        <IconComponent size={16} /> {project.category}
                     </div>
                     <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tighter">{project.title}</h1>
                     <div className="text-3xl md:text-5xl font-black text-[#cfd9cc] tracking-tight">{project.price}</div>
                     <p className="text-lg md:text-xl text-[#cfd9cc]/50 font-light leading-relaxed">
                        {project.longDesc}
                     </p>
                  </div>

                  {/* Features List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     {project.features.map((f: string, i: number) => (
                        <div key={i} className="flex items-center gap-3 p-4 md:p-5 bg-white/5 rounded-3xl border border-white/5 text-white/70 font-bold group hover:bg-white/10 transition-all text-sm md:text-base">
                           <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                              <CheckCircle2 size={18} />
                           </div>
                           {f}
                        </div>
                     ))}
                  </div>

                  <div className="pt-10 flex flex-col sm:flex-row gap-6">
                     <button className="flex-1 bg-[#cfd9cc] text-[#0d2226] py-5 md:py-6 rounded-[25px] md:rounded-3xl font-black text-xl md:text-2xl hover:bg-white shadow-glow transition-all flex items-center justify-center gap-4 active:scale-95">
                        اقتناء الآن <ShoppingCart size={isMobile ? 22 : 28} />
                     </button>
                     <button className="glass border-white/10 text-white px-10 md:px-12 py-5 md:py-6 rounded-[25px] md:rounded-3xl font-bold text-lg md:text-xl hover:bg-white/5 transition-all active:scale-95">
                        تواصل مع مهندس
                     </button>
                  </div>
               </div>
            </div>

            {/* Similar Products Carousel */}
            <section className="pt-24 border-t border-white/5 relative">
               <div className="flex justify-between items-end mb-16">
                  <div className="space-y-4 text-right">
                     <h2 className="text-sm font-black text-[#cfd9cc] uppercase tracking-[0.4em] opacity-40">قد يهمك أيضاً</h2>
                     <h3 className="text-3xl md:text-5xl font-black text-white">منتجات مشابهة.</h3>
                  </div>
                  <div className="hidden md:flex gap-4">
                     <button
                        onClick={() => scroll('right')}
                        className="w-14 h-14 rounded-2xl glass border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-[#0d2226] transition-all"
                     >
                        <ChevronRight size={24} />
                     </button>
                     <button
                        onClick={() => scroll('left')}
                        className="w-14 h-14 rounded-2xl glass border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-[#0d2226] transition-all"
                     >
                        <ArrowLeft size={24} />
                     </button>
                  </div>
               </div>

               {/* Horizontal Scroll Area */}
               <div
                  ref={scrollRef}
                  className="flex gap-8 md:gap-10 overflow-x-auto pb-12 scrollbar-hide snap-x snap-mandatory"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
               >
                  {similarProducts.map((p) => (
                     <Link
                        key={p.id}
                        to={`/project/${p.id}`}
                        className="min-w-[300px] md:min-w-[420px] snap-center glass rounded-[45px] overflow-hidden border-white/5 hover:border-[#cfd9cc]/30 transition-all group flex flex-col shadow-xl"
                     >
                        <div className="h-56 relative overflow-hidden">
                           <img src={p.image} className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700" alt={p.title} />
                           <div className="absolute inset-0 bg-gradient-to-t from-[#0d2226] via-transparent to-transparent opacity-60" />
                           <div className="absolute bottom-6 right-6 px-3 py-1 bg-white/5 backdrop-blur-md rounded-lg text-[9px] font-black text-[#cfd9cc] uppercase tracking-widest border border-white/10">
                              {p.category}
                           </div>
                        </div>
                        <div className="p-8 md:p-10 flex flex-col flex-grow">
                           <div className="flex justify-between items-center mb-6">
                              <div className="text-lg md:text-xl font-black text-white">{p.price}</div>
                           </div>
                           <h4 className="text-xl md:text-2xl font-black text-white mb-6 group-hover:text-[#cfd9cc] transition-colors">{p.title}</h4>
                           <div className="flex items-center gap-3 text-[#cfd9cc] font-black text-sm group-hover:gap-6 transition-all mt-auto">
                              تفاصيل المنتج <ArrowLeft size={18} />
                           </div>
                        </div>
                     </Link>
                  ))}
               </div>

               {/* Mobile Swipe Indicator */}
               <div className="md:hidden flex justify-center gap-2 mt-4">
                  <div className="w-8 h-1 bg-[#cfd9cc] rounded-full" />
                  <div className="w-2 h-1 bg-white/10 rounded-full" />
                  <div className="w-2 h-1 bg-white/10 rounded-full" />
               </div>
            </section>

         </div>
      </div>
   );
};

export default ProjectDetail;
