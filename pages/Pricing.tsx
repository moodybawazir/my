
import React, { useState } from 'react';
import { Check, Info, Shield, Zap, Building, ChevronLeft, X } from 'lucide-react';

const Pricing: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState<null | any>(null);

  const tiers = [
    {
      name: 'تجربة مجانية',
      price: '$0',
      billing: 'وصول لمدة ١٤ يوم',
      description: 'اختبر قوة الأتمتة دون أي تكلفة مسبقة. مثالي للمشاريع الفردية الصغيرة.',
      icon: Info,
      features: [
        '١ وكيل ذكاء اصطناعي نشط',
        'وصول أساسي للوحة التحكم',
        'دعم عبر البريد الإلكتروني',
        'تكاملات CRM الأساسية',
        'حتى ١٠٠ عملية أتمتة شهرياً'
      ],
      details: 'هذه الباقة مصممة لتمكين القادة من اختبار كفاءة بصيرة في أتمتة المهام اليومية البسيطة. تشمل الوصول لمركز المحاكاة وواجهات البرمجة المحدودة.',
      buttonText: 'ابدأ التجربة',
      highlight: false
    },
    {
      name: 'محرك برو',
      price: '$499',
      billing: 'لكل شهر',
      description: 'خطتنا الأكثر شعبية للشركات المتنامية والشركات العقارية المتطورة.',
      icon: Zap,
      features: [
        '٥ وكلاء ذكاء اصطناعي نشطين',
        'مجموعة تحليلات متقدمة',
        'دعم ذو أولوية على مدار الساعة',
        'تكاملات Webhook مخصصة',
        'وصول تجريبي للذكاء الصوتي',
        'حتى ١٠ آلاف عملية أتمتة شهرياً'
      ],
      details: 'باقة المحترفين توفر لك التكامل الكامل مع أنظمة العقارات الذكية، الجولات الافتراضية، ونظام المواعيد الطبية الآلي. ستحصل على مدير حساب مخصص وفترة استجابة لا تتعدى ساعتين.',
      buttonText: 'اشترك في برو',
      highlight: true
    },
    {
      name: 'المؤسسات',
      price: 'مخصص',
      billing: 'حلول مفصلة',
      description: 'أتمتة كاملة النطاق للشركات العالمية والمؤسسات الحكومية.',
      icon: Building,
      features: [
        'وكلاء غير محدودين',
        'مهندس حلول مخصص',
        'نشر داخلي (On-premise)',
        'تدريب نماذج LLM خاصة',
        'لوحات تحكم بشعارك الخاص',
        'ضمان وقت التشغيل (SLA)'
      ],
      details: 'الحل الشامل للمؤسسات الكبيرة. نوفر لك مهندسي بصيرة المقيمين لتطوير حلول ذكاء اصطناعي سيادية داخل منشأتك، مع ضمان أعلى معايير أمن المعلومات العالمية.',
      buttonText: 'تواصل مع المبيعات',
      highlight: false
    }
  ];

  return (
    <div className="pt-40 pb-32 px-6 relative overflow-hidden" dir="rtl">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[500px] bg-[#cfd9cc]/5 blur-[160px] rounded-full -z-10" />
      
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-24">
          <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter">باقات بصيرة الذكية.</h1>
          <p className="text-[#cfd9cc]/60 max-w-3xl mx-auto text-xl font-light leading-relaxed">
            اختر الباقة التي تناسب حجم طموحاتك. تسعير شفاف مصمم ليتوسع مع نمو أعمالك في مكة المكرمة وكافة أنحاء المملكة.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-32">
          {tiers.map((tier, idx) => (
            <div 
              key={idx} 
              className={`relative glass rounded-[50px] p-12 flex flex-col border transition-all hover:scale-[1.03] cursor-pointer ${
                tier.highlight 
                  ? 'border-[#cfd9cc]/30 bg-white/[0.04] shadow-[0_40px_100px_rgba(30,64,58,0.4)]' 
                  : 'border-white/5'
              }`}
              onClick={() => setSelectedTier(tier)}
            >
              {tier.highlight && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#cfd9cc] text-[#0d2226] px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-lg">
                  الأكثر طلباً
                </div>
              )}
              
              <div className="flex items-center gap-5 mb-10">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${tier.highlight ? 'bg-[#cfd9cc] text-[#0d2226]' : 'bg-white/5 text-[#cfd9cc]'}`}>
                  <tier.icon size={28} />
                </div>
                <h3 className="text-3xl font-black text-white">{tier.name}</h3>
              </div>

              <div className="mb-12">
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-black text-white">{tier.price}</span>
                  <span className="text-[#cfd9cc]/40 text-lg">{tier.billing}</span>
                </div>
                <p className="mt-5 text-[#cfd9cc]/50 text-lg leading-relaxed font-light line-clamp-2">{tier.description}</p>
                <button className="text-[#cfd9cc] text-xs font-bold mt-4 underline">عرض التفاصيل الكاملة</button>
              </div>

              <div className="flex-grow space-y-6 mb-12">
                {tier.features.slice(0, 4).map((feature, fIdx) => (
                  <div key={fIdx} className="flex items-start gap-4">
                    <div className="mt-1.5 w-5 h-5 rounded-full bg-[#1e403a]/40 flex items-center justify-center flex-shrink-0">
                      <Check size={12} className="text-[#cfd9cc]" />
                    </div>
                    <span className="text-lg text-white/70 font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              <button className={`w-full py-5 rounded-2xl text-lg font-black transition-all ${
                tier.highlight 
                  ? 'bg-[#cfd9cc] text-[#0d2226] hover:bg-white shadow-glow' 
                  : 'bg-white/5 text-white hover:bg-white/10'
              }`}>
                {tier.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Package Detail Modal */}
      {selectedTier && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-10">
           <div className="absolute inset-0 bg-[#0d2226]/90 backdrop-blur-xl" onClick={() => setSelectedTier(null)} />
           <div className="relative w-full max-w-2xl bg-[#0d2226] rounded-[50px] border border-white/10 overflow-hidden animate-in zoom-in duration-300">
              <div className="p-10 border-b border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#cfd9cc] rounded-xl flex items-center justify-center text-[#0d2226]">
                    <selectedTier.icon size={24} />
                  </div>
                  <h2 className="text-3xl font-black text-white">{selectedTier.name}</h2>
                </div>
                <button onClick={() => setSelectedTier(null)} className="p-3 bg-white/5 rounded-2xl text-[#cfd9cc] hover:bg-white/10 transition-colors"><X /></button>
              </div>
              <div className="p-12 space-y-8">
                <div>
                  <h4 className="text-xs font-black text-[#cfd9cc]/40 uppercase tracking-widest mb-3">وصف الباقة</h4>
                  <p className="text-[#cfd9cc]/60 leading-relaxed text-lg">{selectedTier.details}</p>
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#cfd9cc]/40 uppercase tracking-widest mb-6">المميزات التقنية المشمولة</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedTier.features.map((f: string, i: number) => (
                      <div key={i} className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl">
                        <Check size={16} className="text-emerald-400" />
                        <span className="text-white font-medium text-sm">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pt-6 flex gap-4">
                  <button className="flex-1 py-5 rounded-2xl bg-[#cfd9cc] text-[#0d2226] font-black text-xl hover:bg-white transition-all shadow-glow">اشتراك الآن</button>
                  <button onClick={() => setSelectedTier(null)} className="flex-1 py-5 rounded-2xl bg-white/5 text-white font-bold border border-white/10 hover:bg-white/10 transition-all">إغلاق</button>
                </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Pricing;
