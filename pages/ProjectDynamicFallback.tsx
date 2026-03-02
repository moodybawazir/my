
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Sparkles, CheckCircle2, ShoppingBag, ArrowLeft,
    Building2, Layout, Zap, Shield, Globe, Cpu
} from 'lucide-react';
import SEO from '../src/components/SEO';
import { fetchIndustryContent, IndustrySection, IndustrySubService } from '../src/lib/industryQueries';
import { useCart } from '../src/context/CartContext';

const IconMap: any = {
    Building2, Layout, Zap, Shield, Globe, Cpu
};

const ProjectDynamicFallback: React.FC = () => {
    const { industryId } = useParams<{ industryId: string }>();
    const { addItem } = useCart();
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
        if (subService.has_packages) {
            window.location.hash = `#/service/${industryId || 'dynamic'}/${subService.id}/packages`;
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

    return (
        <div className="min-h-screen pt-32 pb-24 px-6 bg-[#0d2226]" dir="rtl">
            <SEO
                title={content.sections.find(s => s.section_type === 'hero')?.title || "حلولنا الذكية"}
                description={content.sections.find(s => s.section_type === 'hero')?.description || "استكشف حلول بصيرة المتقدمة لقطاعك."}
            />

            <div className="max-w-7xl mx-auto">
                {/* Dynamic Sections and Their Linked Services */}
                {content.sections.map((section) => {
                    const linkedServices = content.services.filter(s => s.section_id === section.id);

                    return (
                        <div key={section.id} className="mb-32">
                            {/* Section Content */}
                            <section className="mb-12">
                                <div className="glass p-12 md:p-24 rounded-[60px] relative overflow-hidden group border border-white/5">
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#cfd9cc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                                        <div className="space-y-8">
                                            <div className="inline-flex items-center gap-2 text-[#cfd9cc] font-black uppercase tracking-[0.2em] text-sm">
                                                {section.section_type === 'hero' ? <Sparkles size={18} /> :
                                                    section.section_type === 'interactive_demo' ? <Zap size={18} /> : <Layout size={18} />}
                                                {section.subtitle}
                                            </div>
                                            <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
                                                {section.title}
                                            </h2>
                                            <p className="text-xl md:text-2xl text-[#cfd9cc]/60 leading-relaxed font-light">
                                                {section.description}
                                            </p>
                                        </div>

                                        <div className="relative aspect-video rounded-[40px] overflow-hidden border border-white/10 shadow-3xl group-hover:border-[#cfd9cc]/40 transition-all duration-700">
                                            {section.image_url && (
                                                <img
                                                    src={section.image_url}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                                    alt={section.title}
                                                />
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-tr from-[#0d2226]/40 via-transparent to-transparent" />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Linked Sub-services Grid */}
                            {linkedServices.length > 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-12">
                                    {linkedServices.map((sub) => (
                                        <SubServiceCard
                                            key={sub.id}
                                            sub={sub}
                                            industryId={industryId}
                                            handleBuySubService={() => handleBuySubService(sub)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* 4. Unlinked Sub-services Grid */}
                {content.services.filter(s => !s.section_id).length > 0 && (
                    <div className="mt-32">
                        <div className="flex items-center justify-between mb-12">
                            <h2 className="text-4xl font-black text-white">خدمات إضافية</h2>
                            <div className="h-px flex-1 mx-8 bg-gradient-to-r from-white/10 to-transparent" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {content.services.filter(s => !s.section_id).map((sub: IndustrySubService) => (
                                <SubServiceCard
                                    key={sub.id}
                                    sub={sub}
                                    industryId={industryId}
                                    handleBuySubService={() => handleBuySubService(sub)}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Extracted SubServiceCard Component for reuse
const SubServiceCard = ({ sub, industryId, handleBuySubService }: { sub: IndustrySubService, industryId: string | undefined, handleBuySubService: () => void }) => (
    <div className="glass rounded-[50px] overflow-hidden flex flex-col group hover:border-[#cfd9cc]/20 transition-all border border-white/5">
        <div className="h-64 relative overflow-hidden">
            <img
                src={sub.image_url || 'https://images.unsplash.com/photo-1518770660439-4636190af475'}
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

export default ProjectDynamicFallback;
