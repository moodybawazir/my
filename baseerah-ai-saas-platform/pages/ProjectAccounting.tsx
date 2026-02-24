
import React from 'react';
import { 
  Calculator, FileText, BarChart3, TrendingUp, 
  ShieldCheck, ArrowLeft, Sparkles, CheckCircle2, 
  PieChart, Activity, Database, Zap, Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ProjectAccounting: React.FC = () => {
  const modules = [
    {
      title: 'الأتمتة المحاسبية والقيود',
      desc: 'تسجيل تلقائي لكافة الحركات المالية والقيود المحاسبية، ومطابقة الكشوفات البنكية بذكاء اصطناعي فائق الدقة.',
      icon: Calculator,
      price: '١,١٠٠ ريال/شهرياً'
    },
    {
      title: 'نظام الفوترة والزكاة (ZATCA)',
      desc: 'إصدار فواتير ضريبية إلكترونية متوافقة مع متطلبات هيئة الزكاة والضريبة والجمارك (المرحلة الثانية) بشكل آلي.',
      icon: FileText,
      price: '٨٥٠ ريال/شهرياً'
    },
    {
      title: 'تحليل التدفقات والتقارير',
      desc: 'لوحات تحكم تفاعلية توضح التدفقات النقدية (Cash Flow)، الأرباح والخسائر، وتوقعات النمو بلمسة زر.',
      icon: BarChart3,
      price: '١,٤٠٠ ريال/شهرياً'
    },
    {
      title: 'بوت التنبؤ المالي والمخاطر',
      desc: 'استخدام خوارزميات التنبؤ لتحليل مخاطر السيولة المستقبلية واقتراح أفضل سيناريوهات خفض المصاريف.',
      icon: TrendingUp,
      price: '١,٨٠٠ ريال/شهرياً'
    }
  ];

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 bg-[#0d2226]" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="mb-20 space-y-8 text-right">
           <Link to="/services" className="inline-flex items-center gap-2 text-[#cfd9cc]/40 hover:text-[#cfd9cc] font-bold transition-all">
              <ArrowLeft size={18} /> العودة للخدمات
           </Link>
           <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-black uppercase tracking-widest">
                 <Calculator size={14} /> حلول المحاسبة والتحليل
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white leading-tight tracking-tighter">
                 المحاسب الآلي <br /> <span className="text-gradient">السيادي والمستقل.</span>
              </h1>
              <p className="text-xl text-[#cfd9cc]/50 max-w-3xl font-light leading-relaxed">
                 لا مزيد من الأخطاء البشرية في القيود والضرائب. منظومة بصيرة المحاسبية تضمن لك دقة مالية مطلقة وتقارير لحظية تدعم اتخاذ القرار.
              </p>
           </div>
        </header>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-32">
           {modules.map((m, i) => (
             <div key={i} className="glass p-12 rounded-[50px] border-white/5 hover:border-amber-500/20 transition-all group relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/5 blur-3xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-start justify-between mb-10">
                   <div className="w-20 h-20 bg-[#1e403a] rounded-3xl flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform duration-500 shadow-2xl">
                      <m.icon size={40} />
                   </div>
                   <div className="text-2xl font-black text-white">{m.price}</div>
                </div>
                <h3 className="text-3xl font-black text-white mb-6 group-hover:text-amber-500 transition-colors">{m.title}</h3>
                <p className="text-[#cfd9cc]/40 text-lg leading-relaxed mb-12">{m.desc}</p>
                <button className="flex items-center gap-3 text-amber-500 font-black text-lg group-hover:gap-6 transition-all">
                   اطلب ديمو للنظام <ArrowLeft size={24} />
                </button>
             </div>
           ))}
        </div>

        {/* Stats & Trust */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {[
             { label: 'دقة المحاسبة', val: '٩٩.٩٩٪', i: ShieldCheck },
             { label: 'توفير الوقت', val: '٧٥٪', i: Clock },
             { label: 'تقارير فورية', val: '١٠٠٪', i: Activity }
           ].map((stat, i) => (
             <div key={i} className="glass p-10 rounded-[40px] border-white/5 flex flex-col items-center text-center">
                <stat.i size={32} className="text-amber-500 mb-6" />
                <div className="text-4xl font-black text-white mb-2">{stat.val}</div>
                <div className="text-xs font-bold text-[#cfd9cc]/30 uppercase tracking-widest">{stat.label}</div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectAccounting;
