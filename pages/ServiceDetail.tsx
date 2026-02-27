
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowRight, CheckCircle2, ShoppingBag, Sparkles,
    Building2, BrainCircuit, Coffee, Stethoscope, ShoppingCart, Calculator, Printer
} from 'lucide-react';
import { fetchIndustryContent, IndustrySection, IndustrySubService } from '../src/lib/industryQueries';
import { ServiceSubscriptions } from '../src/components/subscriptions/ServiceSubscriptions';

const IconMap: any = {
    Building2, BrainCircuit, Coffee, Stethoscope, ShoppingCart, Calculator, Printer, 'real-estate': Building2, 'medical': Stethoscope, 'restaurants': Coffee, 'ai-assistant': BrainCircuit, 'ecommerce': ShoppingCart, 'accounting': Calculator, 'printing-crestalnet': Printer
};

const ServiceDetail: React.FC = () => {
    const { serviceId } = useParams();
    const navigate = useNavigate();
    const [content, setContent] = useState<{ sections: IndustrySection[], services: IndustrySubService[] } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (serviceId) {
            const load = async () => {
                try {
                    const data = await fetchIndustryContent(serviceId);
                    setContent(data);
                } catch (error) {
                    console.error('Error loading dynamic content:', error);
                } finally {
                    setLoading(false);
                }
            };
            load();
        }
    }, [serviceId]);

    const handleBuySubService = (subService: any) => {
        if (subService.has_packages) {
            navigate(`/service/${serviceId || 'unknown'}/${subService.id}/packages`);
            return;
        }

        sessionStorage.setItem('checkout_item', JSON.stringify({
            type: 'service',
            id: subService.id,
            title: subService.title,
            price: subService.price,
            description: subService.description
        }));
        navigate('/checkout');
    };

    if (loading) {
        return <div className="min-h-screen bg-[#0d2226] flex items-center justify-center text-[#cfd9cc]">جاري التحميل...</div>;
    }

    if (!content || (!content.serviceModel && content.services.length === 0)) {
        return (
            <div className="min-h-screen pt-48 pb-24 px-6 bg-[#0d2226] flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-4xl font-black text-white mb-4">الخدمة غير موجودة في قاعدة البيانات</h2>
                    <button onClick={() => navigate('/services')} className="text-[#cfd9cc] hover:text-white">العودة للخدمات</button>
                </div>
            </div>
        );
    }

    const hero = content.sections?.find((s: any) => s.section_type === 'hero');
    const featuresSection = content.sections?.find((s: any) => s.section_type === 'features' || s.section_type === 'feature');
    const interactiveDemo = content.sections?.find((s: any) => s.section_type === 'interactive_demo');
    const IconComponent = IconMap[serviceId || ''] || Building2;

    // Determine which section to display in the feature area
    const featureToDisplay = featuresSection || interactiveDemo;

    return (
        <div className="min-h-screen pt-48 pb-24 px-6 bg-[#0d2226]" dir="rtl">
            <div className="max-w-7xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/services')}
                    className="flex items-center gap-2 text-[#cfd9cc]/60 hover:text-[#cfd9cc] mb-12 transition-colors"
                >
                    <ArrowRight size={20} /> العودة للخدمات
                </button>

                {/* Hero Section */}
                <div className="glass p-16 rounded-[60px] mb-12 border border-white/5 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none">
                        <img src={hero?.image_url} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">
                        <div className="flex-1 text-center lg:text-right">
                            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-[#1e403a]/40 border border-[#cfd9cc]/20">
                                <Sparkles size={14} className="text-[#cfd9cc]" />
                                <span className="text-xs font-black text-[#cfd9cc] uppercase tracking-widest">{hero?.subtitle || "خدمة متكاملة"}</span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">{hero?.title}</h1>
                            <p className="text-xl md:text-2xl text-[#cfd9cc]/60 leading-relaxed font-light">{hero?.description}</p>
                        </div>
                        <div className={`w-32 h-32 md:w-48 md:h-48 rounded-[50px] md:rounded-[70px] bg-[#cfd9cc] flex items-center justify-center text-[#0d2226] shadow-2xl shrink-0 group hover:scale-105 transition-transform duration-500`}>
                            <IconComponent size={window.innerWidth < 768 ? 64 : 96} />
                        </div>
                    </div>
                </div>

                {/* Dynamic Feature Section (The Visual Walk / Loyalty / Demo) */}
                {featureToDisplay && (
                    <div className="mb-20">
                        <div className="glass p-12 md:p-20 rounded-[60px] relative overflow-hidden group border border-white/5">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#cfd9cc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12 md:gap-20">
                                <div className="flex-1 text-right">
                                    <div className="inline-flex items-center gap-2 mb-6 text-[#cfd9cc] font-black uppercase tracking-[0.2em] text-sm">
                                        <Sparkles size={18} /> {featureToDisplay.subtitle}
                                    </div>
                                    <h2 className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight">
                                        {featureToDisplay.title}
                                    </h2>
                                    <p className="text-xl md:text-2xl text-[#cfd9cc]/60 leading-relaxed font-light mb-12">
                                        {featureToDisplay.description}
                                    </p>
                                    <button
                                        onClick={() => navigate(`/project/${serviceId === 'agencies' ? 'agencies' : serviceId}`)}
                                        className="bg-[#cfd9cc] text-[#0d2226] px-12 py-6 rounded-[30px] font-black text-xl hover:bg-white shadow-glow transition-all active:scale-95"
                                    >
                                        {featureToDisplay.action_text || "ابدأ التجربة الآن"}
                                    </button>
                                </div>
                                <div className="flex-1 w-full aspect-video rounded-[40px] overflow-hidden shadow-3xl border border-white/10 group-hover:border-[#cfd9cc]/30 transition-all duration-500">
                                    <img
                                        src={featureToDisplay.image_url || "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=1200"}
                                        alt={featureToDisplay.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Subscription Plans Section */}
                {content.serviceModel?.has_subscription && serviceId && <ServiceSubscriptions serviceId={serviceId} />}

                {/* Sub-services Grid */}
                <div className="flex items-center justify-between mb-12">
                    <h2 className="text-4xl font-black text-white">الخدمات الفرعية</h2>
                    <div className="h-px flex-1 mx-8 bg-gradient-to-r from-white/10 to-transparent" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {content.services.map((sub: IndustrySubService) => (
                        <div key={sub.id} className="glass rounded-[50px] overflow-hidden flex flex-col group hover:border-[#cfd9cc]/20 transition-all border border-white/5">
                            <div className="h-64 relative overflow-hidden">
                                <img
                                    src={sub.image_url}
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
                                    onClick={() => handleBuySubService(sub)}
                                    className={`w-full py-5 rounded-2xl font-black transition-all shadow-glow flex items-center justify-center gap-3 active:scale-95 ${sub.has_packages ? 'bg-white/10 text-white hover:bg-white/20 border border-white/10' : 'bg-[#cfd9cc] text-[#0d2226] hover:bg-white'}`}
                                >
                                    {sub.has_packages ? 'استعراض الباقات' : 'طلب الخدمة الآن'} <ShoppingBag size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ServiceDetail;
