
import React, { useState } from 'react';
import { Gift, Coffee } from 'lucide-react';
import { motion } from 'framer-motion';
import { LoyaltyProgram } from '../lib/industryQueries';

interface LoyaltyCardProps {
    config: LoyaltyProgram;
}

const LoyaltyCard: React.FC<LoyaltyCardProps> = ({ config }) => {
    const [stamps, setStamps] = useState(2);
    const totalStamps = config.total_stamps || 8;

    const addStamp = () => {
        if (stamps < totalStamps) setStamps(prev => prev + 1);
    };

    return (
        <div className="bg-[#0d2226] p-8 md:p-12 rounded-[40px] border border-white/10 shadow-2xl max-w-lg mx-auto transform rotate-[-1deg] hover:rotate-0 transition-all duration-500">
            <div className="flex justify-between items-start mb-10">
                <div>
                    <h3 className="text-2xl font-black text-white mb-2">{config.title}</h3>
                    <p className="text-[#cfd9cc]/50 text-sm tracking-wide">{config.description}</p>
                </div>
                <div className="p-4 bg-[#cfd9cc]/10 rounded-2xl text-[#cfd9cc]">
                    <Gift size={28} />
                </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-10">
                {[...Array(totalStamps)].map((_, i) => (
                    <div
                        key={i}
                        onClick={i === stamps ? addStamp : undefined}
                        className={`aspect-square rounded-2xl flex items-center justify-center border-2 transition-all duration-500 cursor-pointer ${i < stamps ? 'bg-[#cfd9cc] border-[#cfd9cc] shadow-glow scale-105' : 'border-white/10 bg-white/5 hover:border-white/20'}`}
                    >
                        {i < stamps ? (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12 }}>
                                <Coffee size={24} className="text-[#0d2226]" />
                            </motion.div>
                        ) : (
                            <span className="text-white/10 font-black text-lg">{i + 1}</span>
                        )}
                    </div>
                ))}
            </div>

            {stamps === totalStamps ? (
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-[#cfd9cc] p-6 rounded-2xl text-center shadow-glow-strong"
                >
                    <p className="text-[#0d2226] font-black text-lg">{config.reward_text}</p>
                </motion.div>
            ) : (
                <button
                    onClick={addStamp}
                    className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-black hover:bg-white hover:text-[#0d2226] transition-all"
                >
                    إضافة ختم محاكاة +
                </button>
            )}
        </div>
    );
};

export default LoyaltyCard;
