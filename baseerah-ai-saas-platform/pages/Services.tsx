
import React, { useEffect, useState } from 'react';
import { 
  Sparkles, Building2, BrainCircuit, CalendarDays, 
  Coffee, ArrowLeft, CheckCircle2,
  ShoppingCart, Calculator, Package
} from 'lucide-react';
import { Link } from 'react-router-dom';

const IconMap: any = {
  Building2, BrainCircuit, CalendarDays, Coffee, ShoppingCart, Calculator, Package
};

const Services: React.FC = () => {
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('baseerah_services_data');
    if (saved) {
      setServices(JSON.parse(saved));
    } else {
      // Fallback Static Data
      setServices([
        { id: 'real-estate', title: 'حلول العقارات الذكية', icon: 'Building2', desc: 'نحول تجربة شراء العقار إلى رحلة بصرية غامرة.', path: '/project/real-estate', color: 'bg-[#cfd9cc]' },
        { id: 'ai-assistant', title: 'وكلاء الذكاء الاصطناعي', icon: 'BrainCircuit', desc: 'أتمتة كاملة لخدمة العملاء والعمليات الإدارية.', path: '/project/ai-assistant', color: 'bg-emerald-500' },
        { id: 'ecommerce', title: 'بوت المتاجر الإلكترونية', icon: 'ShoppingCart', desc: 'ارفع مبيعات متجرك عبر بوت ذكي يقترح المنتجات.', path: '/project/ecommerce', color: 'bg-blue-400' },
        { id: 'accounting', title: 'بوت المحاسبة والتحليل', icon: 'Calculator', desc: 'أتمتة كاملة للعمليات المحاسبية وإصدار الفواتير.', path: '/project/accounting', color: 'bg-amber-500' }
      ]);
    }
  }, []);

  return (
    <div className="pt-40 pb-32 px-6 bg-[#0d2226]" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-24">
          <div className="inline-flex items-center gap-2 mb-6 px-6 py-2 rounded-full bg-[#1e403a]/40 border border-[#cfd9cc]/20">
            <Sparkles size={18} className="text-[#cfd9cc] animate-pulse" />
            <span className="text-xs font-black text-[#cfd9cc] uppercase tracking-widest">منظومة بصيرة للحلول الذكية</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-tight">حلولنا <br/><span className="text-gradient">تصنع الفارق.</span></h1>
          <p className="text-[#cfd9cc]/60 max-w-3xl mx-auto text-2xl font-light leading-relaxed">
            اختر القطاع الذي ترغب في أتمتته، واستكشف الوحدات البرمجية المخصصة لكل مجال.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {services.map((cat) => {
            const IconComponent = IconMap[cat.icon] || Package;
            return (
              <Link 
                key={cat.id} 
                to={cat.path || `/project/${cat.id}`}
                className="glass p-12 rounded-[50px] border-white/5 hover:border-[#cfd9cc]/30 transition-all group relative overflow-hidden flex flex-col h-full"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#cfd9cc]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex justify-between items-start mb-10">
                  <div className={`w-20 h-20 rounded-[30px] ${cat.color || 'bg-[#1e403a]'} flex items-center justify-center text-[#0d2226] shadow-2xl group-hover:scale-110 transition-transform duration-500`}>
                    <IconComponent size={40} />
                  </div>
                  <div className="bg-white/5 px-4 py-2 rounded-xl text-[10px] font-black text-[#cfd9cc] uppercase tracking-widest">استكشف القطاع</div>
                </div>

                <h2 className="text-3xl font-black text-white mb-6 group-hover:text-[#cfd9cc] transition-colors">{cat.title}</h2>
                <p className="text-xl text-[#cfd9cc]/40 font-light leading-relaxed mb-10 flex-grow">{cat.desc}</p>
                
                <div className="pt-8 border-t border-white/5 flex items-center gap-3 text-[#cfd9cc] font-black text-lg group-hover:gap-6 transition-all">
                  مشاهدة الوحدات <ArrowLeft size={24} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Services;
