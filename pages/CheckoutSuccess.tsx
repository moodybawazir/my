import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, MessageCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import SEO from '../src/components/SEO';

const CheckoutSuccess: React.FC = () => {
    const navigate = useNavigate();

    // Redirect if they somehow land here without a successful checkout (optional layer of security)
    useEffect(() => {
        // In a real app, check for order confirmation in state or URL
    }, []);

    return (
        <div className="min-h-screen pt-40 pb-24 px-6 bg-[#0d2226]" dir="rtl">
            <SEO title="تمت عملية الدفع بنجاح" description="تأكيد الدفع" />
            <div className="max-w-2xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="glass p-12 text-center rounded-[40px] border border-white/5 relative overflow-hidden"
                >
                    {/* Decorative Background */}
                    <div className="absolute top-0 right-0 w-full h-full bg-emerald-500/5 blur-3xl rounded-full" />

                    <div className="relative z-10 space-y-8">
                        <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-emerald-500/30">
                            <CheckCircle2 size={48} className="text-emerald-400" />
                        </div>

                        <h1 className="text-4xl font-black text-white">شكراً لطلبك!</h1>
                        <p className="text-[#cfd9cc] text-lg font-light">
                            تم استلام طلبك بنجاح وجارٍ العمل عليه.
                        </p>

                        <div className="p-6 bg-white/5 rounded-2xl border border-white/5 my-8 flex items-center gap-4 text-right">
                            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center shrink-0">
                                <MessageCircle size={24} className="text-green-400" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold mb-1">الخطوة القادمة:</h3>
                                <p className="text-[#cfd9cc]/70 text-sm leading-relaxed">
                                    سيقوم موظفونا بالتواصل معك عبر الواتساب عما قريب خلال أوقات العمل الرسمية لإتمام كافة الإجراءات والبدء بالتنفيذ.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                            <button
                                onClick={() => navigate('/portal')}
                                className="px-8 py-4 bg-[#cfd9cc] text-[#0d2226] font-black rounded-2xl hover:bg-white transition-all shadow-glow flex items-center justify-center gap-2"
                            >
                                الذهاب للوحة التحكم <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default CheckoutSuccess;
