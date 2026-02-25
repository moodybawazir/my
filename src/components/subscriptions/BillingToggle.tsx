import React from 'react';

interface BillingToggleProps {
    cycle: 'monthly' | 'bimonthly' | 'yearly';
    onChange: (cycle: 'monthly' | 'bimonthly' | 'yearly') => void;
}

export const BillingToggle: React.FC<BillingToggleProps> = ({ cycle, onChange }) => {
    return (
        <div className="flex justify-center mb-12">
            <div className="bg-[#0a1b1e] p-1 rounded-full inline-flex relative shadow-inner">
                <button
                    onClick={() => onChange('monthly')}
                    className={`relative z-10 px-6 py-2 rounded-full text-sm font-bold transition-all ${cycle === 'monthly' ? 'text-[#0d2226] bg-[#cfd9cc] shadow-md' : 'text-[#cfd9cc]/60 hover:text-white'}`}
                >
                    شهري
                </button>
                <button
                    onClick={() => onChange('bimonthly')}
                    className={`relative z-10 px-6 py-2 rounded-full text-sm font-bold transition-all ${cycle === 'bimonthly' ? 'text-[#0d2226] bg-[#cfd9cc] shadow-md' : 'text-[#cfd9cc]/60 hover:text-white'}`}
                >
                    نصف سنوي
                </button>
                <button
                    onClick={() => onChange('yearly')}
                    className={`relative z-10 px-6 py-2 rounded-full text-sm font-bold transition-all ${cycle === 'yearly' ? 'text-[#0d2226] bg-[#cfd9cc] shadow-md' : 'text-[#cfd9cc]/60 hover:text-white'}`}
                >
                    سنوي
                    <span className="absolute -top-3 -right-3 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full animate-pulse">وفر</span>
                </button>
            </div>
        </div>
    );
};
