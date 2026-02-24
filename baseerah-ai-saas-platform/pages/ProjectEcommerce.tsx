
import React, { useState } from 'react';
import { 
  ShoppingCart, MessageSquare, BarChart3, ListChecks, 
  Share2, Megaphone, Search, ArrowLeft, Sparkles, 
  CheckCircle2, Zap, Globe, Cpu, Users, Headphones
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ProjectEcommerce: React.FC = () => {
  const modules = [
    {
      title: 'بوت خدمة العملاء (24/7)',
      desc: 'ردود فورية وذكية على استفسارات العملاء حول المنتجات والأسعار، مع قدرة على إتمام عمليات البيع داخل الشات.',
      icon: Headphones,
      price: '٧٥٠ ريال/شهرياً'
    },
    {
      title: 'بوت تحليل البيانات والسلوك',
      desc: 'تحليل عميق لمسار العميل (User Journey)، تحديد نقاط التسرب، واقتراح تحسينات لرفع معدل التحويل (CR).',
      icon: BarChart3,
      price: '١,٢٠٠ ريال/شهرياً'
    },
    {
      title: 'بوت إدارة المهام والطلبات',
      desc: 'متابعة آلية لحالة الطلبات من "قيد التنفيذ" إلى "تم الشحن"، مع تحديثات فورية للعميل عبر الواتساب.',
      icon: ListChecks,
      price: '٦٠٠ ريال/شهرياً'
    },
    {
      title: 'بوت الشكاوى والسوشيال ميديا',
      desc: 'إدارة الردود على التعليقات والرسائل الخاصة، وتحليل مشاعر الجمهور لمعالجة الشكاوى قبل تفاقمها.',
      icon: Share2,
      price: '٩٠٠ ريال/شهرياً'
    },
    {
      title: 'بوت الحملات الإعلانية',
      desc: 'تحسين تلقائي لميزانيات الإعلانات على Meta و Google بناءً على الأداء اللحظي لضمان أعلى ROI.',
      icon: Megaphone,
      price: '١,٥٠٠ ريال/شهرياً'
    },
    {
      title: 'أدوات الدراسات والتسويق',
      desc: 'أدوات بحث ذكية لتحليل المنافسين، واقتراح كلمات مفتاحية، وتوليد محتوى تسويقي إبداعي.',
      icon: Search,
      price: '٤٥٠ ريال/شهرياً'
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
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-widest">
                 <ShoppingCart size={14} /> حلول التجارة الإلكترونية
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white leading-tight tracking-tighter">
                 منظومة المتجر <br /> <span className="text-gradient">الذكي المتكامل.</span>
              </h1>
              <p className="text-xl text-[#cfd9cc]/50 max-w-3xl font-light leading-relaxed">
                 وداعاً للعمليات اليدوية. بصيرة تقدم لك طاقماً من الوكلاء الأذكياء الذين يديرون متجرك، يسوقون لمنتجاتك، ويحللون بياناتك بينما تركز أنت على النمو.
              </p>
           </div>
        </header>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
           {modules.map((m, i) => (
             <div key={i} className="glass p-10 rounded-[45px] border-white/5 hover:border-[#cfd9cc]/20 transition-all group flex flex-col h-full">
                <div className="w-16 h-16 bg-[#1e403a] rounded-2xl flex items-center justify-center mb-8 text-[#cfd9cc] group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-xl">
                   <m.icon size={32} />
                </div>
                <h3 className="text-2xl font-black text-white mb-4 group-hover:text-[#cfd9cc] transition-colors">{m.title}</h3>
                <p className="text-[#cfd9cc]/40 text-sm leading-relaxed mb-10 flex-grow">{m.desc}</p>
                <div className="pt-8 border-t border-white/5 flex justify-between items-center">
                   <span className="text-white font-black">{m.price}</span>
                   <button className="text-[#cfd9cc] font-bold text-xs hover:underline">طلب الوحدة</button>
                </div>
             </div>
           ))}
        </div>

        {/* Unified Interface Preview */}
        <div className="glass p-12 md:p-20 rounded-[60px] border-white/5 relative overflow-hidden text-center">
           <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/5 to-transparent -z-10" />
           <h2 className="text-4xl font-black text-white mb-6">لوحة تحكم موحدة لكافة البوتات</h2>
           <p className="text-[#cfd9cc]/40 max-w-2xl mx-auto mb-12 font-light">تكامل تام مع منصات "سلة" و "زد" و "Shopify". راقب أداء كافة البوتات والعمليات من مكان واحد.</p>
           <div className="flex flex-wrap justify-center gap-6">
              <div className="flex items-center gap-2 text-white/60 font-bold"><CheckCircle2 size={18} className="text-blue-400"/> ربط مع واتساب بزنس</div>
              <div className="flex items-center gap-2 text-white/60 font-bold"><CheckCircle2 size={18} className="text-blue-400"/> تحليل حملات سناب وتيك توك</div>
              <div className="flex items-center gap-2 text-white/60 font-bold"><CheckCircle2 size={18} className="text-blue-400"/> دعم تعدد اللغات</div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectEcommerce;
