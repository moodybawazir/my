
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  BrainCircuit, Sparkles, Send, MessageSquare, Bot,
  Zap, Shield, Globe, Cpu, CheckCircle2, ArrowLeft,
  Terminal, Code2, Database
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../src/components/SEO';
import { fetchIndustryContent, IndustrySection, IndustrySubService } from '../src/lib/industryQueries';

const ProjectAI: React.FC = () => {
  const { industryId } = useParams<{ industryId: string }>();
  const [content, setContent] = useState<{ sections: IndustrySection[], services: IndustrySubService[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([
    { role: 'bot', content: 'أهلاً بك! أنا مساعد بصيرة الذكي. كيف يمكنني مساعدتك اليوم في أتمتة أعمالك؟' }
  ]);
  const [input, setInput] = useState('');

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

        {/* Services / Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          {content.services.map((sub, i) => (
            <div key={i} className="glass p-10 rounded-[40px] border-white/5 text-center group hover:border-[#cfd9cc]/20 transition-all">
              <div className="w-16 h-16 bg-[#1e403a] rounded-2xl flex items-center justify-center mb-8 mx-auto border border-white/5">
                <div className="text-[#cfd9cc] text-2xl font-bold">
                  {i + 1}
                </div>
              </div>
              <h3 className="text-2xl font-black text-white mb-4">{sub.title}</h3>
              <p className="text-[#cfd9cc]/40 leading-relaxed">{sub.description}</p>
              <div className="mt-8 pt-8 border-t border-white/5 space-y-3">
                {(sub.features || []).map((f, idx) => (
                  <div key={idx} className="flex items-center justify-center gap-2 text-xs text-[#cfd9cc]/60">
                    <CheckCircle2 size={12} className="text-emerald-400" />
                    {f}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

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

export default ProjectAI;
