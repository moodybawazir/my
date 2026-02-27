import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, ShoppingBag, Sparkles } from 'lucide-react';
import { supabase } from '../src/lib/supabase';
import { IndustrySubService } from '../src/lib/industryQueries';
import SEO from '../src/components/SEO';

const ServicePackages: React.FC = () => {
    const { industryId, serviceId } = useParams();
    const navigate = useNavigate();
    const [service, setService] = useState<IndustrySubService | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            if (!serviceId) return;
            try {
                const { data, error } = await supabase
                    .from('industry_sub_services')
                    .select('*')
                    .eq('id', serviceId)
                    .single();

                if (data) {
                    setService(data as IndustrySubService);
                } else if (error) {
                    console.error('Error fetching service:', error);
                }
            } catch (err) {
                console.error('Error in load:', err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [serviceId]);

    const handleSelectPackage = (pkg: any) => {
        if (!service) return;

        // Add to session storage for checkout
        sessionStorage.setItem('checkout_item', JSON.stringify({
            type: 'service_package',
            id: pkg.id,
            parent_id: service.id,
            title: `${service.title} - ${pkg.name}`,
            price: pkg.price,
            description: `باقة (${pkg.name}) شاملة: ${(pkg.features || []).join('، ')}`
        }));

        navigate('/checkout');
    };

    if (loading) {
        return <div className="min-h-screen bg-[#0d2226] flex items-center justify-center text-[#cfd9cc]">جاري التحميل...</div>;
    }

    if (!service) {
        return (
            <div className="min-h-screen bg-[#0d2226] flex flex-col gap-4 items-center justify-center text-[#cfd9cc]">
                <h1 className="text-2xl font-black">الخدمة غير موجودة</h1>
                <button onClick={() => navigate(-1)} className="underline text-sm">عودة</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-24 px-6 bg-[#0d2226]" dir="rtl">
            <SEO
                title={`${service.title} - الباقات المتاحة`}
                description={service.description}
            />

            <div className="max-w-7xl mx-auto">
                {/* Header section */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-[#cfd9cc]/60 hover:text-[#cfd9cc] mb-12 transition-colors"
                >
                    <ArrowLeft size={20} className="rotate-180" /> العودة للتفاصيل
                </button>

                <div className="text-center mb-20 max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-[#1e403a]/40 border border-[#cfd9cc]/20 text-[#cfd9cc] text-xs font-black uppercase tracking-widest mb-6">
                        <Sparkles size={14} /> تفاصيل الباقات للاشتراكات
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-8">
                        {service.title}
                    </h1>
                    <p className="text-xl text-[#cfd9cc]/60 font-light leading-relaxed">
                        {service.description}
                    </p>
                </div>

                {/* Packages Grid */}
                {!service.has_packages || !service.packages || service.packages.length === 0 ? (
                    <div className="text-center py-20 text-[#cfd9cc]/40 text-lg">لا توجد باقات حالية لهذه الخدمة.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch pt-12">
                        {service.packages.map((pkg: any, index: number) => {
                            const isMiddle = index === 1; // Highlight the middle package if there are 3
                            return (
                                <div
                                    key={pkg.id}
                                    className={`relative flex flex-col rounded-[50px] p-10 transition-all duration-500 overflow-hidden ${isMiddle
                                            ? 'bg-[#1a383d] border-2 border-[#cfd9cc] shadow-2xl scale-105 z-10'
                                            : 'bg-white/5 border border-white/5 hover:border-[#cfd9cc]/30 backdrop-blur-sm'
                                        }`}
                                >
                                    {isMiddle && (
                                        <div className="absolute top-0 right-1/2 translate-x-1/2 bg-[#cfd9cc] text-[#0d2226] px-6 py-1.5 rounded-b-2xl font-black text-xs uppercase tracking-widest shadow-lg">
                                            الأكثر طلباً
                                        </div>
                                    )}

                                    <h3 className="text-3xl font-black text-white mb-2 mt-4 text-center">{pkg.name}</h3>
                                    <div className="text-center mb-8 border-b border-white/10 pb-8">
                                        <div className="text-4xl font-black text-[#cfd9cc]">{pkg.price}</div>
                                    </div>

                                    <div className="space-y-4 mb-12 flex-grow">
                                        {(pkg.features || []).map((feature: string, idx: number) => (
                                            <div key={idx} className="flex items-center gap-4 text-[#cfd9cc]/80 text-sm">
                                                <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                                                    <CheckCircle2 size={14} className="text-emerald-400" />
                                                </div>
                                                <span className="leading-snug">{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => handleSelectPackage(pkg)}
                                        className={`w-full py-5 rounded-2xl font-black flex items-center justify-center gap-3 transition-all active:scale-95 ${isMiddle
                                                ? 'bg-[#cfd9cc] text-[#0d2226] hover:bg-white shadow-glow'
                                                : 'bg-white/10 text-white hover:bg-[#cfd9cc] hover:text-[#0d2226]'
                                            }`}
                                    >
                                        اختيار الباقة <ShoppingBag size={20} />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ServicePackages;
