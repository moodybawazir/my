
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Sparkles, CheckCircle2, ShoppingBag, ArrowLeft,
    Building2, Layout, Zap, Shield, Globe, Cpu
} from 'lucide-react';
import SEO from '../src/components/SEO';
import { fetchIndustryContent, IndustrySection, IndustrySubService } from '../src/lib/industryQueries';

const IconMap: any = {
    Building2, Layout, Zap, Shield, Globe, Cpu
};

const ProjectDynamicFallback: React.FC = () => {
    const { industryId } = useParams<{ industryId: string }>();
    const [content, setContent] = useState<{ sections: IndustrySection[], services: IndustrySubService[] } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            if (!industryId) return;
            try {
                const data = await fetchIndustryContent(industryId);
                setContent(data);
            } catch (error) {
                console.error('Error loading dynamic industry content:', error);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [industryId]);

    const handleBuySubService = (subService: IndustrySubService) => {
        sessionStorage.setItem('checkout_item', JSON.stringify({
            type: 'service',
            id: subService.id,
            title: subService.title,
            price: subService.price,
            description: subService.description
        }));
        window.location.hash = '#/checkout';
    };

    if (loading) {
        return <div className="min-h-screen bg-[#0d2226] flex items-center justify-center text-[#cfd9cc]">جاري التحميل...</div>;
    }

    if (!content || content.services.length === 0) {
        return (
            <div className="min-h-screen bg-[#0d2226] flex items-center justify-center text-[#cfd9cc] flex-col gap-6">
                <h2 className="text-2xl font-black">عذراً، لا يوجد محتوى لهذا القطاع حالياً</h2>
                <Link to="/services" className="text-[#cfd9cc] underline">العودة للخدمات</Link>
            </div>
        );
    }

    const hero = content.sections.find(s => s.section_type === 'hero');
    const demo = content.sections.find(s => s.section_type === 'interactive_demo' || s.section_type === 'feature');

    return (
        <div className="min-h-screen pt-32 pb-24 px-6 bg-[#0d2226]" dir="rtl">
            <SEO
                title={hero?.title || "حلولنا الذكية"}
                description={hero?.description || "استكشف حلول بصيرة المتقدمة لقطاعك."}
            />

            <div className="max-w-7xl mx-auto">
                {/* 1. Hero Section */}
                <header className="mb-20 text-center">
                    <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-[#1e403a]/40 border border-[#cfd9cc]/20 text-[#cfd9cc] text-xs font-black uppercase tracking-widest mb-6">
                        <Sparkles size={14} /> {hero?.subtitle || "قطاع أعمال ذكي"}
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black text-white leading-tight mb-8">
                        {hero?.title || "حلول بصيرة الرقمية"}
                    </h1>
                    <p className="text-xl text-[#cfd9cc]/60 max-w-3xl mx-auto font-light leading-relaxed">
                        {hero?.description}
                    </p>
                </header>

                {/* 2. Highlighted Section (Demo/Feature) */}
                {demo && (
                    <section className="mb-32">
                        <div className="glass p-12 md:p-24 rounded-[60px] relative overflow-hidden group border border-white/5">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#cfd9cc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                                <div className="space-y-8">
                                    <div className="inline-flex items-center gap-2 text-[#cfd9cc] font-black uppercase tracking-[0.2em] text-sm">
                                        <Zap size={18} /> {demo.subtitle}
                                    </div>
                                    <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
                                        {demo.title}
                                    </h2>
                                    <p className="text-xl md:text-2xl text-[#cfd9cc]/60 leading-relaxed font-light">
                                        {demo.description}
                                    </p>
                                    <div className="flex gap-4">
                                        <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-[#cfd9cc] text-sm font-bold">
                                            تجربة المستخدم المتكاملة
                                        </div>
                                    </div>
                                </div>

                                <div className="relative aspect-video rounded-[40px] overflow-hidden border border-white/10 shadow-3xl group-hover:border-[#cfd9cc]/40 transition-all duration-700">
                                    <img
                                        src={demo.image_url || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200"}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                        alt={demo.title}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-tr from-[#0d2226]/40 via-transparent to-transparent" />
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* 3. Sub-services Grid */}
                <div className="flex items-center justify-between mb-12">
                    <h2 className="text-4xl font-black text-white">تفاصيل الخدمات</h2>
                    <div className="h-px flex-1 mx-8 bg-gradient-to-r from-white/10 to-transparent" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {content.services.map((sub: IndustrySubService) => (
                        <div key={sub.id} className="glass rounded-[50px] overflow-hidden flex flex-col group hover:border-[#cfd9cc]/20 transition-all border border-white/5">
                            <div className="h-64 relative overflow-hidden">
                                <img
                                    src={sub.image_url || 'https://images.unsplash.com/photo-1518770660439-4636190af475'}
                                    alt={sub.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0d2226] via-transparent to-transparent" />
                                <div className="absolute bottom-6 right-6">
                                    <div className="bg-[#cfd9cc] text-[#0d2226] px-4 py-2 rounded-xl font-black text-sm shadow-xl">
                                        {sub.price}
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
                                    className="w-full py-5 rounded-2xl bg-[#cfd9cc] text-[#0d2226] font-black hover:bg-white transition-all shadow-glow flex items-center justify-center gap-3 active:scale-95"
                                >
                                    طلب الخدمة الآن <ShoppingBag size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProjectDynamicFallback;
