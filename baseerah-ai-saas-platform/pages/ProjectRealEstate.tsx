
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, Camera, MapPin, Eye, ArrowLeft, Heart, 
  ShoppingCart, Star, Info, LayoutPanelLeft, ChevronRight,
  User, Mail, Phone, Home as HomeIcon, CreditCard, CheckCircle2,
  X, Maximize2, Compass, Move, Layers, Box, Plus, Info as InfoIcon,
  CircleDot, Navigation, MousePointer2, Smartphone
} from 'lucide-react';

const ProjectRealEstate: React.FC = () => {
  const [activeRoom, setActiveRoom] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // تحديث حالة الجوال عند تغيير حجم الشاشة
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const villaData = {
    title: 'قصر الجوهرة الرقمي',
    price: '١٢,٥٠٠,٠٠٠ ريال',
    location: 'الرياض، حطين الثغر',
    rooms: [
      { 
        id: 0,
        name: 'البهو الملكي', 
        description: 'مدخل ملكي بارتفاع مزدوج مع ثريات ذكية تتفاعل مع ضوء النهار.', 
        area: '١٢٠ م²', 
        image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=1600',
        hotspots: [
          { top: '55%', left: '75%', targetRoom: 1, label: 'إلى جناح المعيشة' },
          { top: '65%', left: '25%', targetRoom: 2, label: 'إلى المطبخ' }
        ],
        features: [
          { top: '35%', left: '50%', title: 'ثريا كريستال بصيرة', desc: 'إضاءة ذكية مرتبطة بحالة الطقس الخارجية.' }
        ]
      },
      { 
        id: 1,
        name: 'جناح المعيشة', 
        description: 'إطلالة بانورامية كاملة مع نظام عزل صوتي سيادي.', 
        area: '٩٥ م²', 
        image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1600',
        hotspots: [
          { top: '50%', left: '15%', targetRoom: 0, label: 'العودة للبهو' },
          { top: '45%', left: '80%', targetRoom: 3, label: 'الجناح الرئيسي' }
        ],
        features: [
          { top: '42%', left: '30%', title: 'زجاج التعتيم الذكي', desc: 'يتحكم في نفاذية الضوء والخصوصية آلياً.' }
        ]
      },
      { 
        id: 2,
        name: 'المطبخ الحديث', 
        description: 'أتمتة كاملة للمخزون والطهي بأنظمة ألمانية ذكية.', 
        area: '٥٠ م²', 
        image: 'https://images.unsplash.com/photo-1600566753190-17f0bb2a6c3e?auto=format&fit=crop&q=80&w=1600',
        hotspots: [
          { top: '50%', left: '50%', targetRoom: 0, label: 'رجوع' }
        ],
        features: [
          { top: '20%', left: '80%', title: 'نظام الجرد الآلي', desc: 'يراقب النواقص ويطلبها من المتجر المفضل.' }
        ]
      },
      { 
        id: 3,
        name: 'الجناح الرئيسي', 
        description: 'مساحة خاصة مجهزة بأفضل تقنيات النوم الصحي.', 
        area: '٨٥ م²', 
        image: 'https://images.unsplash.com/photo-1600607687644-c7171bb3e29b?auto=format&fit=crop&q=80&w=1600',
        hotspots: [
          { top: '60%', left: '10%', targetRoom: 1, label: 'جناح المعيشة' }
        ],
        features: [
          { top: '55%', left: '45%', title: 'نظام التحكم بالمناخ', desc: 'يضبط درجة الحرارة بناءً على جودة نومك.' }
        ]
      }
    ]
  };

  const navigateToRoom = (roomId: number) => {
    setIsZooming(true);
    setSelectedFeature(null);
    setTimeout(() => {
      setActiveRoom(roomId);
      setIsZooming(false);
    }, 500);
  };

  const modules = [
    { title: 'جولة افتراضية 360', price: '١,٥٠٠ ريال', icon: Camera },
    { title: 'تصوير احترافي', price: '٢,٠٠٠ ريال', icon: Camera },
    { title: 'تقييم عقاري', price: '٣,٥٠٠ ريال', icon: Star },
  ];

  return (
    <div className="min-h-screen pt-20 md:pt-32 pb-24 px-4 md:px-6 bg-[#0d2226]" dir="rtl">
      <div className="max-w-[1600px] mx-auto">
        
        {/* Top Header - Responsive */}
        <div className="mb-6 md:mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
           <Link to="/services" className="flex items-center gap-3 text-[#cfd9cc]/40 hover:text-[#cfd9cc] transition-all font-bold text-sm">
              <ArrowLeft size={18} /> العودة للخدمات العقارية
           </Link>
           <div className="flex items-center gap-2">
              <div className="px-4 py-1.5 bg-[#1e403a]/40 border border-[#cfd9cc]/10 rounded-full text-[#cfd9cc] text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                 <div className="w-2 h-2 bg-[#cfd9cc] rounded-full animate-pulse" /> تجربة حية نشطة
              </div>
              <div className="px-4 py-1.5 bg-white/5 border border-white/5 rounded-full text-white/40 text-[9px] font-black uppercase hidden sm:flex">
                 Simulator Ver 4.0
              </div>
           </div>
        </div>

        {/* MAIN SIMULATOR STAGE */}
        <div className="relative w-full h-[500px] md:h-[750px] lg:h-[820px] rounded-[30px] md:rounded-[60px] overflow-hidden border border-white/5 shadow-2xl bg-black group mb-10 md:mb-16">
           
           {/* Immersive Image Canvas */}
           <div className={`absolute inset-0 transition-all duration-700 ease-in-out ${isZooming ? 'scale-150 blur-xl opacity-0' : 'scale-100 blur-0 opacity-100'}`}>
              <img 
                src={villaData.rooms[activeRoom].image} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[15s] ease-out" 
                alt={villaData.rooms[activeRoom].name} 
              />
           </div>

           {/* Gradients Overlay */}
           <div className="absolute inset-0 bg-gradient-to-t from-[#0d2226]/80 via-transparent to-black/30 pointer-events-none" />

           {/* PRECISION HOTSPOTS (Interactive Elements) */}
           <div className="absolute inset-0 z-20">
              {/* Room Navigation Buttons */}
              {villaData.rooms[activeRoom].hotspots.map((spot, idx) => (
                <button
                  key={idx}
                  onClick={() => navigateToRoom(spot.targetRoom)}
                  style={{ top: spot.top, left: spot.left }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group/spot active:scale-90 transition-transform"
                >
                   <div className="relative flex flex-col items-center">
                      <div className="absolute -inset-4 md:-inset-6 bg-[#cfd9cc]/20 rounded-full animate-ping opacity-50" />
                      <div className="relative w-10 h-10 md:w-14 md:h-14 glass border border-[#cfd9cc]/40 rounded-full flex items-center justify-center text-[#cfd9cc] group-hover/spot:bg-[#cfd9cc] group-hover/spot:text-[#0d2226] transition-all shadow-glow">
                         <Navigation size={isMobile ? 20 : 28} className="rotate-45" />
                      </div>
                      <div className="mt-3 px-3 py-1.5 glass rounded-lg text-white text-[8px] md:text-[10px] font-black uppercase tracking-widest opacity-0 group-hover/spot:opacity-100 transition-opacity whitespace-nowrap backdrop-blur-md">
                         {spot.label}
                      </div>
                   </div>
                </button>
              ))}

              {/* Detail Markers (+) */}
              {villaData.rooms[activeRoom].features.map((feat, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedFeature(feat.title === selectedFeature ? null : feat.title)}
                  style={{ top: feat.top, left: feat.left }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group/feat z-30"
                >
                   <div className="relative flex flex-col items-center">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white group-hover/feat:bg-white group-hover/feat:text-[#0d2226] transition-all">
                         <Plus size={isMobile ? 16 : 20} />
                      </div>
                      
                      {/* Detailed Popup */}
                      {selectedFeature === feat.title && (
                        <div className="absolute bottom-full mb-4 w-56 md:w-64 glass p-4 md:p-6 rounded-[20px] md:rounded-[30px] border-[#cfd9cc]/30 text-right animate-in fade-in slide-in-from-bottom-4 duration-300 backdrop-blur-3xl z-50">
                           <h5 className="text-[#cfd9cc] font-black text-xs md:text-sm mb-2">{feat.title}</h5>
                           <p className="text-white/60 text-[10px] md:text-xs leading-relaxed">{feat.desc}</p>
                        </div>
                      )}
                   </div>
                </button>
              ))}
           </div>

           {/* HUD UI Elements */}
           <div className="absolute top-6 md:top-10 left-6 md:left-10 right-6 md:right-10 flex justify-between items-start z-40 pointer-events-none">
              <div className="flex flex-col gap-3 pointer-events-auto">
                 <div className="glass px-4 md:px-6 py-2.5 md:py-4 rounded-2xl md:rounded-[25px] flex items-center gap-3 text-white border-white/10 backdrop-blur-xl">
                    <div className="w-2 md:w-3 h-2 md:h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_red]" />
                    <span className="text-[9px] md:text-xs font-bold uppercase tracking-widest">Walkthrough Active</span>
                 </div>
                 <div className="hidden md:flex glass px-6 py-4 rounded-[25px] items-center gap-3 text-white border-white/10">
                    <Compass size={18} className="text-[#cfd9cc] animate-spin-slow" />
                    <span className="text-xs font-bold">الاتجاه: شمال غرب</span>
                 </div>
              </div>

              <div className="flex gap-2 md:gap-4 pointer-events-auto">
                 <button className="glass p-3 md:p-5 rounded-xl md:rounded-[25px] text-[#cfd9cc] hover:bg-white hover:text-[#0d2226] transition-all"><Maximize2 size={18}/></button>
                 <button className="glass p-3 md:p-5 rounded-xl md:rounded-[25px] text-[#cfd9cc] hover:bg-white hover:text-[#0d2226] transition-all"><Smartphone size={18}/></button>
              </div>
           </div>

           {/* BOTTOM INFO PANEL & RADAR */}
           <div className="absolute bottom-6 md:bottom-12 left-6 md:left-12 right-6 md:left-12 flex flex-col md:flex-row justify-between items-end gap-6 md:gap-10 z-40 pointer-events-none">
              
              {/* Room Details Panel */}
              <div className="bg-black/40 backdrop-blur-3xl p-6 md:p-10 rounded-[30px] md:rounded-[50px] border border-white/5 max-w-full md:max-w-xl pointer-events-auto shadow-2xl">
                 <div className="flex items-center gap-3 mb-2 md:mb-4">
                    <div className="w-6 md:w-8 h-1 bg-[#cfd9cc] rounded-full" />
                    <span className="text-[#cfd9cc] font-black text-[8px] md:text-[10px] uppercase tracking-[0.3em]">المكان الحالي</span>
                 </div>
                 <h3 className="text-2xl md:text-4xl font-black text-white mb-2 md:mb-4">{villaData.rooms[activeRoom].name}</h3>
                 <p className="text-[#cfd9cc]/60 text-xs md:text-base leading-relaxed font-light">{villaData.rooms[activeRoom].description}</p>
                 <div className="flex gap-4 mt-4 md:mt-6">
                    <div className="text-[10px] font-bold text-white/40 uppercase">المساحة: <span className="text-white">{villaData.rooms[activeRoom].area}</span></div>
                    <div className="text-[10px] font-bold text-white/40 uppercase">الحالة: <span className="text-emerald-400">ممتاز</span></div>
                 </div>
              </div>

              {/* Floor Plan Radar (Mini-Map) */}
              <div className="glass p-4 md:p-8 rounded-[30px] md:rounded-[45px] border-[#cfd9cc]/20 w-48 md:w-80 pointer-events-auto shadow-2xl hidden sm:block">
                 <div className="flex items-center justify-between mb-4 md:mb-6">
                    <h4 className="text-[10px] md:text-xs font-black text-white flex items-center gap-2">
                       <Layers size={14} className="text-[#cfd9cc]" /> مخطط الطابق
                    </h4>
                    <span className="text-[8px] md:text-[10px] text-[#cfd9cc]/40 font-bold uppercase tracking-widest">الدور الأرضي</span>
                 </div>
                 <div className="aspect-square bg-white/5 rounded-[20px] md:rounded-[30px] border border-white/5 relative p-4 md:p-6 overflow-hidden">
                    <div className="w-full h-full border border-[#cfd9cc]/10 rounded-lg relative">
                       {/* Simplified Layout Lines */}
                       <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-1 opacity-10">
                          <div className="border border-[#cfd9cc]/10" />
                          <div className="border border-[#cfd9cc]/10" />
                          <div className="border border-[#cfd9cc]/10" />
                       </div>
                       
                       {/* Radar Indicator */}
                       <div 
                         className="absolute w-6 h-6 md:w-10 md:h-10 transition-all duration-700 ease-in-out"
                         style={{
                           top: activeRoom === 0 ? '20%' : activeRoom === 1 ? '50%' : activeRoom === 2 ? '70%' : '30%',
                           left: activeRoom === 0 ? '30%' : activeRoom === 1 ? '60%' : activeRoom === 2 ? '40%' : '15%',
                         }}
                       >
                          <div className="absolute inset-0 bg-[#cfd9cc]/20 rounded-full animate-ping" />
                          <div className="absolute inset-0 bg-[#cfd9cc] rounded-full shadow-[0_0_20px_rgba(207,217,204,0.6)] flex items-center justify-center">
                             <Navigation size={12} className="text-[#0d2226] rotate-45" />
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* SALES & MODULES GRID (Match your request) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 mb-20 md:mb-32">
           
           {/* Left Section: Value Prop */}
           <div className="lg:col-span-7 flex flex-col justify-center space-y-6 md:space-y-10 order-2 lg:order-1">
              <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
                 تكنولوجيا تجعل <br />
                 <span className="text-gradient">البيع أسرع.</span>
              </h2>
              <p className="text-lg md:text-xl text-[#cfd9cc]/40 font-light leading-relaxed max-w-2xl">
                 نحن في بصيرة لا نعرض العقار فحسب، بل نبني علاقة عاطفية بين المشتري والمنزل قبل أن يطأ قدمه فيه. تجربة الـ 360 التفاعلية تزيد من ثقة العملاء بنسبة ٨٥٪.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                 <button 
                  onClick={() => setShowCheckout(true)} 
                  className="bg-[#cfd9cc] text-[#0d2226] px-10 py-5 rounded-2xl font-black text-lg md:text-xl hover:bg-white shadow-glow transition-all active:scale-95"
                 >
                    حجز معاينة ميدانية
                 </button>
                 <button className="glass px-10 py-5 rounded-2xl text-white font-bold border-white/10 hover:bg-white/5 transition-all flex items-center justify-center gap-3">
                    تحميل الكتالوج <Plus size={20}/>
                 </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 md:pt-10 flex flex-wrap gap-8 opacity-40">
                 <div className="flex flex-col">
                    <span className="text-3xl font-black text-white">١٠٠٪</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest">دقة المحاكاة</span>
                 </div>
                 <div className="flex flex-col">
                    <span className="text-3xl font-black text-white">٣٢٪</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest">نمو المبيعات</span>
                 </div>
                 <div className="flex flex-col">
                    <span className="text-3xl font-black text-white">٤٠٠+</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest">مشروع عقاري</span>
                 </div>
              </div>
           </div>

           {/* Right Section: Add-on Modules (The requested Grid) */}
           <div className="lg:col-span-5 space-y-4 md:space-y-6 order-1 lg:order-2">
              <div className="text-xs font-black text-[#cfd9cc]/30 uppercase tracking-[0.2em] mb-4">وحدات التطوير العقاري</div>
              {modules.map((m, i) => (
                <div key={i} className="bg-[#12282c] border border-white/5 rounded-[25px] md:rounded-[35px] p-6 md:p-8 flex items-center justify-between group hover:bg-[#163035] transition-all hover:border-[#cfd9cc]/20 cursor-pointer">
                  <div className="flex items-center gap-4 md:gap-6">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-[#1a383d] rounded-2xl flex items-center justify-center text-[#cfd9cc] group-hover:scale-110 group-hover:bg-[#cfd9cc] group-hover:text-[#0d2226] transition-all duration-500 shadow-xl">
                      <m.icon size={isMobile ? 24 : 32} />
                    </div>
                    <div>
                      <h4 className="text-base md:text-xl font-black text-white mb-1">{m.title}</h4>
                      <div className="text-lg md:text-2xl font-black text-[#cfd9cc] tracking-tight">{m.price}</div>
                    </div>
                  </div>
                  <button className="w-10 h-10 md:w-12 md:h-12 bg-[#1a383d] text-white rounded-xl md:rounded-2xl flex items-center justify-center hover:bg-[#cfd9cc] hover:text-[#0d2226] transition-all group-hover:shadow-glow">
                    <Plus size={20} />
                  </button>
                </div>
              ))}
           </div>
        </div>

        {/* FAQ / Bottom Section */}
        <div className="glass p-10 md:p-20 rounded-[40px] md:rounded-[60px] border-white/5 text-center">
           <h3 className="text-2xl md:text-4xl font-black text-white mb-6">هل ترغب في أتمتة عقارك الخاص؟</h3>
           <p className="text-[#cfd9cc]/40 text-base md:text-xl mb-12 max-w-2xl mx-auto font-light">بصيرة توفر لك مهندسين متخصصين في تحويل المساحات التقليدية إلى واحات ذكية تعمل بالكامل عبر الذكاء الاصطناعي.</p>
           <button className="inline-flex items-center gap-4 text-[#cfd9cc] font-black text-lg md:text-xl border-b-2 border-[#cfd9cc] pb-2 hover:gap-8 transition-all">
             تحدث مع مهندس الأنظمة <ArrowLeft size={24}/>
           </button>
        </div>
      </div>

      {/* MOBILE SUCCESS MODAL (Checkout) */}
      {showCheckout && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#0d2226]/98 backdrop-blur-3xl" onClick={() => setShowCheckout(false)} />
          <div className="relative w-full max-w-md bg-[#0d2226] rounded-[40px] border border-white/10 p-10 md:p-14 text-center animate-in zoom-in duration-300">
             <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-500/30">
                <CheckCircle2 size={40} className="text-emerald-500" />
             </div>
             <h2 className="text-3xl font-black text-white mb-4">تم حجز الموعد</h2>
             <p className="text-[#cfd9cc]/40 text-sm leading-relaxed mb-10">
               لقد قمت بطلب معاينة لـ "{villaData.title}". فريق المبيعات سيتواصل معك عبر هاتفك المسجل لترتيب الزيارة الافتراضية الموجهة.
             </p>
             <button onClick={() => setShowCheckout(false)} className="w-full py-4 bg-[#cfd9cc] text-[#0d2226] rounded-xl font-black text-lg hover:bg-white transition-all shadow-glow">
               تم، رائع!
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectRealEstate;
