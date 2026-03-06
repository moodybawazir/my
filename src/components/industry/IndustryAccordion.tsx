
import React, { useState } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';
import { IndustrySection } from '../../lib/industryQueries';

interface IndustryAccordionProps {
    section: IndustrySection;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

export const IndustryAccordion: React.FC<IndustryAccordionProps> = ({
    section,
    children,
    defaultOpen = false
}) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="group border border-white/5 rounded-[40px] overflow-hidden bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-500 relative">

            {/* Background transparent image if exists - positioned absolutely for aesthetic layering */}
            {section.image_url && isOpen && (
                <div className="absolute top-0 left-0 w-1/3 h-full opacity-10 pointer-events-none transition-opacity duration-1000">
                    <img
                        src={section.image_url}
                        alt=""
                        className="w-full h-full object-contain object-left-top"
                    />
                </div>
            )}

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-10 flex items-center justify-between text-right transition-all relative z-10"
            >
                <div className="flex items-center gap-8">
                    <div className={`w-16 h-16 rounded-2xl bg-[#cfd9cc]/10 flex items-center justify-center text-[#cfd9cc] transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`}>
                        <ChevronDown size={32} />
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Sparkles size={16} className="text-[#cfd9cc]/40" />
                            <span className="text-[#cfd9cc]/40 text-xs font-black uppercase tracking-widest">
                                {section.subtitle || 'قسم الخدمات'}
                            </span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-white group-hover:text-[#cfd9cc] transition-colors drop-shadow-lg">
                            {section.title}
                        </h2>
                    </div>
                </div>
            </button>

            <div
                className={`transition-all duration-700 ease-in-out relative z-10 ${isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}
            >
                <div className="px-10 pb-10">
                    <div className="h-px w-full bg-gradient-to-r from-[#cfd9cc]/20 to-transparent mb-10" />

                    <div className="flex flex-col lg:flex-row gap-12">
                        <div className="flex-1">
                            {section.description && (
                                <p className="text-xl text-[#cfd9cc]/60 mb-12 font-light leading-relaxed max-w-4xl drop-shadow-md">
                                    {section.description}
                                </p>
                            )}
                            {children}
                        </div>

                        {/* Right side transparent image for Desktop view */}
                        {section.image_url && (
                            <div className="hidden lg:flex w-1/3 justify-center items-center">
                                <img
                                    src={section.image_url}
                                    alt={section.title}
                                    className="w-full h-auto object-contain max-h-[400px] drop-shadow-[0_0_30px_rgba(207,217,204,0.1)]"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
