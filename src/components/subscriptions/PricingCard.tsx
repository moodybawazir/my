import React from 'react';
import { Check } from 'lucide-react';
import { PlanWithPackages } from '../../types/subscription.types';

interface PricingCardProps {
    plan: PlanWithPackages;
    cycle: 'monthly' | 'bimonthly' | 'yearly';
    onSubscribe: (planId: string) => void;
}

export const PricingCard: React.FC<PricingCardProps> = ({ plan, cycle, onSubscribe }) => {
    const price = cycle === 'monthly' ? plan.price_monthly : cycle === 'bimonthly' ? plan.price_bimonthly : plan.price_yearly;
    const isFeatured = plan.tier_level === 2; // Usually the middle tier is featured

    return (
        <div className={`relative flex flex-col p-8 rounded-3xl ${isFeatured ? 'bg-gradient-to-b from-[#1a383d] to-[#0a1b1e] border-2 border-[#cfd9cc]' : 'bg-[#0d2226] border border-white/10'} shadow-2xl transition-transform hover:-translate-y-2`}>
            {isFeatured && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#cfd9cc] text-[#0d2226] px-4 py-1 rounded-full text-xs font-black tracking-widest uppercase">
                    الأكثر شعبية
                </div>
            )}
            <div className="mb-8 text-center">
                <h3 className="text-2xl font-black text-white tracking-tight mb-2">{plan.name}</h3>
                <p className="text-[#cfd9cc]/60 text-sm h-10">{plan.description}</p>
            </div>
            <div className="flex justify-center items-end gap-1 mb-8">
                <span className="text-4xl font-extrabold text-white">{price}</span>
                <span className="text-[#cfd9cc]/50 font-medium pb-1">/ {cycle === 'monthly' ? 'شهر' : cycle === 'bimonthly' ? '٦ أشهر' : 'سنة'}</span>
            </div>

            <div className="flex-grow space-y-6 mb-8">
                {plan.packages.map(pkg => (
                    <div key={pkg.id} className="bg-white/5 p-4 rounded-xl border border-white/5">
                        <h4 className="font-bold text-[#cfd9cc] mb-1">{pkg.package_name}</h4>
                        <p className="text-xs text-white/50 mb-3">{pkg.package_description}</p>
                        <ul className="space-y-2">
                            {Object.entries(pkg.limits as Record<string, any> || {}).map(([key, value]) => (
                                <li key={key} className="flex items-center gap-2 text-sm text-[#cfd9cc]/80">
                                    <Check size={16} className="text-[#cfd9cc]" />
                                    <span>{key}: <strong className="text-white">{value as string}</strong></span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}

                {((plan.features as string[]) || []).map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-sm text-[#cfd9cc]/80">
                        <div className="bg-[#cfd9cc]/10 p-1 rounded-full line-clamp-1"><Check size={14} className="text-[#cfd9cc] flex-shrink-0" /></div>
                        <span>{feature}</span>
                    </div>
                ))}
            </div>

            <button
                onClick={() => onSubscribe(plan.id)}
                className={`w-full py-4 rounded-xl font-bold transition-all ${isFeatured ? 'bg-[#cfd9cc] text-[#0d2226] hover:bg-white shadow-glow' : 'bg-white/10 text-white hover:bg-white/20'}`}
            >
                اشترك الآن
            </button>
        </div>
    );
};
