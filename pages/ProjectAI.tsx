
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  BrainCircuit, Sparkles, Send, MessageSquare, Bot,
  Zap, Shield, Globe, Cpu, CheckCircle2, ArrowLeft,
  Terminal, Code2, Database, ShoppingBag
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../src/components/SEO';
import { fetchIndustryContent, IndustrySection, IndustrySubService } from '../src/lib/industryQueries';
import { useCart } from '../src/context/CartContext';

const ProjectAI: React.FC = () => {
  const { industryId } = useParams<{ industryId: string }>();
  const { addItem } = useCart();
  const [content, setContent] = useState<{ sections: IndustrySection[], services: IndustrySubService[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([
    { role: 'bot', content: 'أهلاً بك! أنا مساعد بصيرة الذكي. كيف يمكنني مساعدتك اليوم في أتمتة أعمالك؟' }
  ]);
  const [input, setInput] = useState('');

  const handleBuySubService = (subService: IndustrySubService) => {
    if (subService.has_packages) {
      window.location.hash = `#/service/${industryId || 'ai-assistant'}/${subService.id}/packages`;
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
        const id = industryId || 'ai-assistant';
        const data = await fetchIndustryContent(id);
        setContent(data);
      } catch (error) {
        console.error('Error loading AI content:', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [industryId]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');

    // Simulate bot response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'bot',
        content: `لقد حللت طلبك: "${input}". يمكنني البدء في تنفيذ هذه المهمة فوراً باستخدام خوارزميات التعلم الآلي المتقدمة لدينا.`
      }]);
    }, 1000);
  };

  if (loading || !content) {
    return <div className="min-h-screen bg-[#0d2226] flex items-center justify-center text-[#cfd9cc]">جاري التحميل...</div>;
  }

  const hero = content.sections.find(s => s.section_type === 'hero');
  const demo = content.sections.find(s => s.section_type === 'interactive_demo');

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 bg-[#0d2226]" dir="rtl">
      <SEO
        title={hero?.title || "مساعدك الشخصي بقدرات خارقة"}
        description={hero?.description || "نظام معالجة لغة طبيعية مخصص للمؤسسات."}
      />
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row items-center gap-16 mb-32">
          <div className="flex-1 space-y-8">
            <div className="inline-flex items-center gap-2 bg-[#1e403a]/30 border border-[#cfd9cc]/20 px-4 py-1.5 rounded-full text-[#cfd9cc] text-xs font-bold uppercase tracking-widest">
              <Bot size={16} /> {hero?.subtitle || "ذكاء اصطناعي سيادي"}
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-tight">
              {hero?.title || "مساعدك الشخصي بقدرات خارقة."}
            </h1>
            <p className="text-xl text-[#cfd9cc]/60 leading-relaxed font-light">
              {hero?.description}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/pricing" className="bg-[#cfd9cc] text-[#0d2226] px-8 py-4 rounded-2xl font-black hover:bg-white transition-all shadow-glow">
                عرض باقات AI
              </Link>
              <button className="glass border-white/10 text-white px-8 py-4 rounded-2xl font-bold hover:bg-white/5 transition-all">
                التحدث مع خبير
              </button>
            </div>
          </div>

          <div className="flex-1 w-full max-w-2xl">
            <div className="glass rounded-[40px] border-white/10 overflow-hidden shadow-2xl flex flex-col h-[500px]">
              <div className="bg-white/5 p-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                </div>
                <div className="text-[10px] font-black text-[#cfd9cc]/30 uppercase tracking-[0.3em]">
                  {demo?.subtitle || "BASEERAH CORE v2.5"}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[80%] p-5 rounded-3xl text-sm leading-relaxed ${msg.role === 'user'
                      ? 'bg-white/5 text-[#cfd9cc] rounded-tr-none'
                      : 'bg-[#1e403a] text-white rounded-tl-none border border-[#cfd9cc]/10'
                      }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSend} className="p-6 bg-white/5 border-t border-white/5 flex gap-4">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="كيف يمكنني مساعدتك اليوم؟..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-[#cfd9cc]/30"
                />
                <button type="submit" className="bg-[#cfd9cc] text-[#0d2226] p-4 rounded-2xl hover:bg-white transition-all">
                  <Send size={20} />
                </button>
              </form>
            </div>
          </div>
        </div>

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

        {/* Technical Specs */}
        <div className="glass p-12 md:p-20 rounded-[60px] border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-[#cfd9cc]/5 blur-[100px] -z-10" />
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-6">المواصفات التقنية</h2>
            <p className="text-[#cfd9cc]/60 max-w-2xl mx-auto">نستخدم أحدث ما توصل إليه العلم في بناء وكلاء الذكاء الاصطناعي.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {[
              { l: 'زمن الاستجابة', v: '< ٥٠ms', i: Zap },
              { l: 'دقة الموديل', v: '٩٨.٥٪', i: CheckCircle2 },
              { l: 'قاعدة المعرفة', v: '١٠٠+ TB', i: Database },
              { l: 'تكاملات API', v: '٥٠٠+', i: Code2 }
            ].map((spec, i) => (
              <div key={i}>
                <div className="text-[#cfd9cc] mb-4 flex justify-center"><spec.i size={32} /></div>
                <div className="text-3xl font-black text-white mb-1">{spec.v}</div>
                <div className="text-xs font-bold text-[#cfd9cc]/30 uppercase tracking-widest">{spec.l}</div>
              </div>
            ))}
          </div>
        </div>
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

export default ProjectAI;
