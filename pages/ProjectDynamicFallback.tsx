
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


import { IndustryAccordion } from '../src/components/industry/IndustryAccordion';
import { SubServiceRow } from '../src/components/industry/SubServiceRow';
import { RandomServices } from '../src/components/industry/RandomServices';

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
            price: Number(subService.price) || 0,
            quantity: 1
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

    const hero = content.sections.find(s => s.section_type === 'hero');
    const serviceSections = content.sections.filter(s => s.section_type === 'standard');
    const unlinkedServices = content.services.filter(s => !s.section_id);

    return (
        <div className="min-h-screen pt-48 pb-24 px-6 bg-[#0d2226]" dir="rtl">
            <SEO
                title={hero?.title || "حلولنا الذكية"}
                description={hero?.description || "استكشف حلول بصيرة المتقدمة لقطاعك."}
            />

            <div className="max-w-7xl mx-auto">
                {/* Hero Header */}
                <header className="mb-24 text-center">
                    <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-[#1e403a]/40 border border-[#cfd9cc]/20 text-[#cfd9cc] text-xs font-black uppercase tracking-widest mb-6">
                        <Sparkles size={14} /> {hero?.subtitle || "قطاع الخدمات الذكية"}
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black text-white leading-tight mb-8">
                        {hero?.title || "حلول بصيرة الرقمية"}
                    </h1>
                    <p className="text-xl md:text-2xl text-[#cfd9cc]/60 max-w-4xl mx-auto font-light leading-relaxed">
                        {hero?.description}
                    </p>
                </header>

                {/* Grouped Services By Accordion Section */}
                {serviceSections.map((section: IndustrySection, idx: number) => {
                    const linkedServices = content.services.filter(s => s.section_id === section.id);
                    if (linkedServices.length === 0 && !section.description) return null;

                    return (
                        <IndustryAccordion
                            key={section.id}
                            section={section}
                            defaultOpen={idx === 0}
                            hideDescription={section.demo_type === 'three_d'}
                        >
                            <div className="space-y-6">
                                {linkedServices.map((sub: IndustrySubService) => (
                                    <SubServiceRow
                                        key={sub.id}
                                        sub={sub}
                                        industryId={industryId}
                                        onBuy={handleBuySubService}
                                        onViewDetails={(sub) => {
                                            if (sub.has_packages) {
                                                window.location.hash = `#/service/${industryId || 'dynamic'}/${sub.id}/packages`;
                                            }
                                        }}
                                    />
                                ))}
                            </div>
                        </IndustryAccordion>
                    );
                })}

                {/* Unlinked / General Services */}
                {unlinkedServices.length > 0 && (
                    <div className="mt-24 mb-40">
                        <div className="flex items-center justify-between mb-12">
                            <h2 className="text-4xl font-black text-white">خدمات إضافية متوفرة</h2>
                            <div className="h-px flex-1 mx-8 bg-gradient-to-r from-white/10 to-transparent" />
                        </div>
                        <div className="space-y-6">
                            {unlinkedServices.map((sub: IndustrySubService) => (
                                <SubServiceRow
                                    key={sub.id}
                                    sub={sub}
                                    industryId={industryId}
                                    onBuy={handleBuySubService}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Bottom Random Services */}
                <RandomServices />
            </div>
        </div>
    );
};

export default ProjectDynamicFallback;

