
import React from 'react';
import { CheckCircle2, ShoppingBag, ArrowRight } from 'lucide-react';
import { IndustrySubService } from '../../lib/industryQueries';

interface SubServiceRowProps {
    sub: IndustrySubService;
    industryId: string | undefined;
    onBuy: (sub: IndustrySubService) => void;
    onViewDetails?: (sub: IndustrySubService) => void;
}

export const SubServiceRow: React.FC<SubServiceRowProps> = ({ sub, industryId, onBuy, onViewDetails }) => {
    return (
        <div className="glass rounded-[40px] overflow-hidden flex flex-col md:flex-row group hover:border-[#cfd9cc]/20 transition-all border border-white/5 mb-8 animate-fade-in">
            {/* Image Section */}
            <div className="md:w-1/3 h-64 md:h-auto relative overflow-hidden shrink-0">
                <img
                    src={sub.image_url || 'https://images.unsplash.com/photo-1518770660439-4636190af475'}
                    alt={sub.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-[#0d2226] via-transparent to-transparent hidden md:block" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d2226] via-transparent to-transparent md:hidden" />
            </div>

            {/* Content Section */}
            <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <h3 className="text-3xl font-black text-white group-hover:text-[#cfd9cc] transition-colors">
                        {sub.title}
                    </h3>
                    <div className="bg-[#cfd9cc] text-[#0d2226] px-5 py-2 rounded-xl font-black text-sm shadow-xl self-start md:self-center">
                        {sub.has_packages ? 'باقات متعددة' : sub.price}
                    </div>
                </div>

                <p className="text-[#cfd9cc]/60 font-light leading-relaxed mb-8 text-lg">
                    {sub.description}
                </p>

                {/* Features Sequential */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                    {(sub.features || []).map((feature: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-3 text-[#cfd9cc]/80">
                            <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                                <CheckCircle2 size={14} className="text-emerald-400" />
                            </div>
                            <span className="text-sm font-medium">{feature}</span>
                        </div>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-4 mt-auto">
                    <button
                        onClick={() => onBuy(sub)}
                        className={`flex-1 min-w-[200px] py-5 rounded-2xl font-black transition-all shadow-glow flex items-center justify-center gap-3 active:scale-95 ${sub.has_packages
                                ? 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                                : 'bg-[#cfd9cc] text-[#0d2226] hover:bg-white shadow-[#cfd9cc]/20'
                            }`}
                    >
                        {sub.has_packages ? 'استعراض الباقات' : 'طلب الخدمة الآن'} <ShoppingBag size={20} />
                    </button>

                    <button
                        onClick={() => onViewDetails?.(sub)}
                        className="px-8 py-5 rounded-2xl font-black bg-white/5 border border-white/10 text-[#cfd9cc] hover:bg-white/10 transition-all flex items-center gap-2 group/btn"
                    >
                        تفاصيل أكثر <ArrowRight size={18} className="group-hover:translate-x-[-4px] transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
};
