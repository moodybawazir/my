
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
   ArrowLeft, Rocket, Zap, Shield, CheckCircle2,
   Package, ShoppingCart, Star, Share2, Heart,
   Cpu, Building2, BrainCircuit, Coffee, Stethoscope,
   BookOpen, Terminal, Globe, Key, FileText, Layers,
   ChevronRight
} from 'lucide-react';

const IconMap: any = {
   Building2, BrainCircuit, Coffee, Stethoscope, Cpu, Star,
   BookOpen, Terminal, Globe, Key, FileText, Layers
};

const ProjectDetail: React.FC = () => {
   const { id } = useParams();
   const [project, setProject] = useState<any>(null);
   const scrollRef = useRef<HTMLDivElement>(null);
   // Add isMobile state to fix the error on line 147
   const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

   // Add resize listener for isMobile
   useEffect(() => {
      const handleResize = () => setIsMobile(window.innerWidth < 768);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
   }, []);

   const allProducts = [
      {
         id: 'automation-ebook',
         title: 'كتاب: هندسة الأتمتة الشاملة',
         price: '٢٥٠ ريال',
         category: 'كتب رقمية',
         image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1600',
         desc: 'الدليل العملي لبناء وكلاء الذكاء الاصطناعي وربطهم بسلاسل العمليات المعقدة.',
         longDesc: 'هذا الكتاب هو حصيلة خبرات مهندسي بصيرة في بناء أنظمة الأتمتة العالمية. ستتعلم فيه كيفية بناء "عقل" ذكي لشركتك، يربط بين مختلف التطبيقات والخدمات ليقوم بالمهام الروتينية بدقة ١٠٠٪ وبلا تدخل بشري.',
         icon: 'BookOpen',
         features: ['تحميل فوري (PDF)', 'أمثلة عملية واقعية', 'تحديثات مجانية للأبد', 'فصل خاص بالذكاء الاصطناعي العربي']
      },
      {
         id: 'api-access-premium',
         title: 'اشتراك API بصيرة المتقدم',
         price: '٩٩٠ ريال / شهر',
         category: 'اشتراكات API',
         image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=1600',
         desc: 'وصول مباشر لمحركات معالجة اللغة الطبيعية والتعرف على الصور الخاصة ببصيرة.',
         longDesc: 'اربط تطبيقاتك الخاصة بقوة بصيرة. يوفر لك هذا الاشتراك وصولاً فائق السرعة لنماذج اللغة المخصصة التي تم تدريبها خصيصاً على المصطلحات والبيانات المحلية، مما يمنحك دقة لا تضاهى في معالجة طلبات عملائك.',
         icon: 'Terminal',
         features: ['معدل استجابة < ٥٠ م.ث', 'توثيق تقني شامل', 'دعم المبرمجين المباشر', 'أمن بيانات سيادي']
      },
      {
         id: 'web-suite-subscription',
         title: 'باقة اشتراك المواقع الشاملة',
         price: '٤٥٠ ريال / شهر',
         category: 'اشتراكات برمجية',
         image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1600',
         desc: 'اشتراك موحد يمنحك الوصول لأدوات تحليل المنافسين وإدارة المحتوى الذكية.',
         longDesc: 'كل ما تحتاجه لإدارة وجودك الرقمي في مكان واحد. تتضمن هذه الباقة أدوات ذكية تراقب أداء موقعك وتنافسك في السوق، وتقترح عليك تعديلات فورية لتحسين معدل التحويل والمبيعات.',
         icon: 'Globe',
         features: ['لوحة تحكم موحدة', 'تحليل منافسين لحظي', 'توليد محتوى بالذكاء الاصطناعي', 'تقارير أداء أسبوعية']
      },
      {
         id: 'real-estate-engine',
         title: 'محرك العقارات الذكي',
         price: '٥,٥٠٠ ريال',
         category: 'حلول جاهزة',
         image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1600',
         desc: 'المنظومة المتكاملة للمكاتب العقارية التي تبحث عن أتمتة شاملة لعملياتها.',
         longDesc: 'الحل النهائي للمكاتب والشركات العقارية. يجمع المحرك بين عرض العقارات بجولات ٣٦٠ ونظام أتمتة كامل لإدارة المواعيد وتوثيق العقود وتتبع المبيعات من لوحة واحدة سهلة الاستخدام.',
         icon: 'Layers',
         features: ['جولات 360 غير محدودة', 'نظام إدارة عقود ذكي', 'ربط مع الواتساب', 'تطبيق مخصص للمبيعات']
      }
   ];

   useEffect(() => {
      const found = allProducts.find((p: any) => p.id === id);
      if (found) {
         setProject(found);
         window.scrollTo({ top: 0, behavior: 'smooth' });
      }
   }, [id]);

   const similarProducts = allProducts.filter(p => p.id !== id);

   if (!project) {
      return (
         <div className="min-h-screen pt-40 text-center text-white bg-[#0d2226]" dir="rtl">
            <h1 className="text-4xl font-black mb-8">عذراً، هذا المنتج غير متاح حالياً</h1>
            <Link to="/store" className="text-[#cfd9cc] underline font-bold">العودة للمتجر الرقمي</Link>
         </div>
      );
   }

   const IconComponent = IconMap[project.icon] || Package;

   const scroll = (direction: 'right' | 'left') => {
      if (scrollRef.current) {
         const { scrollLeft, clientWidth } = scrollRef.current;
         const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
         scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
      }
   };

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
                  <div className="relative aspect-square md:aspect-video lg:aspect-square rounded-[40px] md:rounded-[60px] overflow-hidden border border-white/10 group shadow-2xl">
                     <img src={project.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt={project.title} />
                     <div className="absolute inset-0 bg-gradient-to-t from-[#0d2226]/80 via-transparent to-transparent" />
                     <div className="absolute top-8 right-8 flex gap-3 md:gap-4">
                        <button className="glass p-4 md:p-5 rounded-2xl text-white hover:bg-white hover:text-[#0d2226] transition-all"><Heart size={20} /></button>
                        <button className="glass p-4 md:p-5 rounded-2xl text-white hover:bg-white hover:text-[#0d2226] transition-all"><Share2 size={20} /></button>
                     </div>
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
