import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, ShoppingBag, Sparkles } from 'lucide-react';
import { supabase } from '../src/lib/supabase';
import { IndustrySubService } from '../src/lib/industryQueries';
import { useCart } from '../src/context/CartContext';
import SEO from '../src/components/SEO';

const ServicePackages: React.FC = () => {
    const { industryId, serviceId } = useParams();
    const navigate = useNavigate();
    const { addItem } = useCart();
    const [service, setService] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedDuration, setSelectedDuration] = useState<string>('monthly');

    useEffect(() => {
        const load = async () => {
            if (!serviceId) return;
            try {
                const { data: serviceData, error: serviceError } = await (supabase as any)
                    .from('industry_sub_services')
                    .select('*')
                    .eq('id', serviceId)
                    .single();

                if (serviceData) {
                    if (serviceData.has_packages) {
                        const { data: packagesData, error: packagesError } = await (supabase as any)
                            .from('packages')
                            .select('*, package_durations(*), package_features(*)')
                            .eq('sub_service_id', serviceId)
                            .eq('is_active', true)
                            .order('sort_order');

                        if (!packagesError && packagesData) {
                            (serviceData as any).real_packages = packagesData;
                        }
                    }
                    setService(serviceData as any);
                } else if (serviceError) {
                    console.error('Error fetching service:', serviceError);
                }
            } catch (err) {
                console.error('Error in load:', err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [serviceId]);

    const handleSelectPackageDuration = (pkg: any, duration: any) => {
        if (!service) return;

        addItem({
            id: duration.id, // Use duration id as the cart item id to identify the specific duration
            title: `${service.title} - ${pkg.name_ar} (${duration.duration_type === 'monthly' ? 'شهر' : duration.duration_type === 'quarterly' ? '3 أشهر' : duration.duration_type === 'semi_annual' ? '6 أشهر' : duration.duration_type === 'annual' ? 'سنة' : 'تجربة 7 أيام'})`,
            price: Number(duration.price) || 0,
            type: 'service_package',
            quantity: 1,
            description: `باقة (${pkg.name_ar}) شاملة: ${(pkg.package_features || []).map((f: any) => f.feature_text).join('، ')}`,
            metadata: {
                package_id: pkg.id,
                duration_type: duration.duration_type,
                months: duration.months,
                service_id: service.id
            }
        });

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

                {/* Duration Toggle */}
                {service.has_packages && service.real_packages && service.real_packages.length > 0 && (
                    <div className="flex justify-center mb-12 flex-wrap gap-2">
                        {['trial', 'monthly', 'quarterly', 'semi_annual', 'annual'].map((duration) => {
                            const label = duration === 'trial' ? 'تجربة مجانية (7 أيام)' :
                                duration === 'monthly' ? 'شهري' :
                                    duration === 'quarterly' ? '3 أشهر' :
                                        duration === 'semi_annual' ? '6 أشهر' : 'سنوي';

                            // Check if any package has this duration
                            const hasDuration = service.real_packages.some((p: any) => p.package_durations?.some((d: any) => d.duration_type === duration));
                            if (!hasDuration) return null;

                            return (
                                <button
                                    key={duration}
                                    onClick={() => setSelectedDuration(duration)}
                                    className={`px-6 py-3 rounded-full font-bold text-sm transition-all ${selectedDuration === duration ? 'bg-[#cfd9cc] text-[#0d2226]' : 'bg-white/10 text-white hover:bg-white/20'}`}
                                >
                                    {label}
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Packages Grid */}
                {!service.has_packages || !service.real_packages || service.real_packages.length === 0 ? (
                    <div className="text-center py-20 text-[#cfd9cc]/40 text-lg">لا توجد باقات حالية لهذه الخدمة.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch pt-2">
                        {service.real_packages.map((pkg: any, index: number) => {
                            const isMiddle = index === 1; // Highlight the middle package if there are 3

                            const durationData = pkg.package_durations?.find((d: any) => d.duration_type === selectedDuration);
                            if (!durationData) return null; // Hide package if it doesn't support selected duration

                            return (
                                <div
                                    key={pkg.id}
                                    className={`relative flex flex-col rounded-[50px] p-10 transition-all duration-500 overflow-hidden ${isMiddle
                                        ? 'bg-[#1a383d] border-2 border-[#cfd9cc] shadow-2xl scale-105 z-10'
                                        : 'bg-white/5 border border-white/5 hover:border-[#cfd9cc]/30 backdrop-blur-sm'
                                        }`}
                                >
                                    {(pkg.is_popular || isMiddle) && (
                                        <div className="absolute top-0 right-1/2 translate-x-1/2 bg-[#cfd9cc] text-[#0d2226] px-6 py-1.5 rounded-b-2xl font-black text-xs uppercase tracking-widest shadow-lg">
                                            الأكثر طلباً
                                        </div>
                                    )}

                                    <h3 className="text-3xl font-black text-white mb-2 mt-4 text-center">{pkg.name_ar}</h3>

                                    <div className="text-center mb-8 border-b border-white/10 pb-8 flex flex-col items-center">
                                        {durationData.discount_percentage > 0 && selectedDuration !== 'trial' && (
                                            <span className="text-white/40 line-through text-sm mb-1">
                                                {Math.round(durationData.price / (1 - durationData.discount_percentage / 100))} ريال
                                            </span>
                                        )}
                                        <div className="text-4xl font-black text-[#cfd9cc]">
                                            {selectedDuration === 'trial' ? 'مجاناً' : durationData.price}
                                            {selectedDuration !== 'trial' && (
                                                <span className="text-sm text-white/40 mr-2 font-black italic">
                                                    / {selectedDuration === 'monthly' ? 'شهرياً' :
                                                        selectedDuration === 'quarterly' ? 'كل 3 أشهر' :
                                                            selectedDuration === 'semi_annual' ? 'كل 6 أشهر' : 'سنوياً'}
                                                </span>
                                            )}
                                        </div>
                                        {durationData.discount_percentage > 0 && selectedDuration !== 'trial' && (
                                            <span className="text-emerald-400 text-xs font-bold mt-2 bg-emerald-400/10 px-3 py-1 rounded-full">
                                                خصم {durationData.discount_percentage}%
                                            </span>
                                        )}
                                    </div>

                                    <div className="space-y-4 mb-12 flex-grow">
                                        {(pkg.package_features || []).map((feature: any) => (
                                            <div key={feature.id} className="flex items-center gap-4 text-[#cfd9cc]/80 text-sm">
                                                <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                                                    <CheckCircle2 size={14} className="text-emerald-400" />
                                                </div>
                                                <span className={`leading-snug ${feature.is_highlighted ? 'font-bold text-white' : ''}`}>
                                                    {feature.feature_text}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => handleSelectPackageDuration(pkg, durationData)}
                                        className={`w-full py-5 rounded-2xl font-black flex items-center justify-center gap-3 transition-all active:scale-95 ${isMiddle
                                            ? 'bg-[#cfd9cc] text-[#0d2226] hover:bg-white shadow-glow'
                                            : 'bg-white/10 text-white hover:bg-[#cfd9cc] hover:text-[#0d2226]'
                                            }`}
                                    >
                                        {selectedDuration === 'trial' ? 'ابدأ التجربة المجانية' : 'أضف للسلة'} <ShoppingBag size={20} />
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
