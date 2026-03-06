
import React, { useEffect, useState } from 'react';
import { ShoppingBag, ArrowLeft, Star } from 'lucide-react';
import { fetchRandomSubServices } from '../../lib/industryQueries';

export const RandomServices: React.FC = () => {
    const [randomServices, setRandomServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const data = await fetchRandomSubServices(4);
            setRandomServices(data);
            setLoading(false);
        };
        load();
    }, []);

    if (loading || randomServices.length === 0) return null;

    return (
        <section className="mt-32 pt-24 border-t border-white/5 animate-fade-in" dir="rtl">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                <div>
                    <div className="inline-flex items-center gap-2 text-amber-400 font-black uppercase tracking-[0.2em] text-sm mb-4">
                        <Star size={18} fill="currentColor" /> خدمات مختارة
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-white">الأكثر طلباً واستخداماً</h2>
                    <p className="text-xl text-[#cfd9cc]/40 mt-4 font-light">اكتشف حلولاً أخرى قد تهمك في رحلتك الرقمية</p>
                </div>
                <button
                    onClick={() => window.location.hash = '#/services'}
                    className="flex items-center gap-3 text-[#cfd9cc] font-black hover:gap-5 transition-all group"
                >
                    عرض كافة الخدمات <ArrowLeft size={20} className="group-hover:translate-x-[-5px] transition-transform" />
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {randomServices.map((service) => (
                    <div
                        key={service.id}
                        className="glass rounded-[40px] p-8 border border-white/5 hover:border-[#cfd9cc]/20 transition-all group cursor-pointer"
                        onClick={() => window.location.hash = `#/project/${service.industry_id}`}
                    >
                        <div className="h-48 rounded-3xl overflow-hidden mb-6">
                            <img
                                src={service.image_url || 'https://images.unsplash.com/photo-1518770660439-4636190af475'}
                                alt={service.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                        </div>

                        <div className="text-xs font-black text-[#cfd9cc]/30 uppercase mb-2">
                            {service.industry?.title || 'خدمة بصيرة'}
                        </div>
                        <h3 className="text-xl font-black text-white mb-4 line-clamp-1 group-hover:text-[#cfd9cc] transition-colors">
                            {service.title}
                        </h3>

                        <div className="flex items-center justify-between mt-auto">
                            <div className="text-[#cfd9cc] font-black">{service.has_packages ? 'باقات' : service.price}</div>
                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:bg-[#cfd9cc] group-hover:text-[#0d2226] transition-all">
                                <ShoppingBag size={18} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
