import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CreditCard, CheckCircle, ShieldCheck, Lock, AlertCircle, ArrowRight, Wallet, Shield, MessageCircle, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../src/lib/supabase';
import SEO from '../src/components/SEO';
import { useAuth } from '../src/context/AuthContext';
import { useCart } from '../src/context/CartContext';

const Checkout: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { items, clearCart } = useCart();

    const isInstant = searchParams.get('instant') === 'true';

    // Calculate totals
    const totalBeforeTax = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const taxAmount = totalBeforeTax * 0.15;
    const finalTotal = totalBeforeTax + taxAmount;
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(isInstant ? 2 : 1); // 1: Review, 2: Payment, 3: Success
    const [error, setError] = useState<string | null>(null);

    const handleLemonSqueezyCheckout = async () => {
        setLoading(true);
        setError(null);

        try {
            if (!user) {
                navigate('/login');
                return;
            }

            // MOCK CHECKOUT FLOW (Bypass Lemon Squeezy)
            // Instead of redirecting to the payment gateway, we directly create an order in the database
            // and act as if it was successfully paid.

            const orderId = crypto.randomUUID();
            const orderRef = `BSR-${Date.now().toString().slice(-6)}`;

            const { error: orderError } = await supabase.from('orders').insert({
                id: orderId,
                user_id: user.id,
                total_amount: finalTotal,
                status: 'قيد التنفيذ',
                payment_status: 'paid',
                ls_order_id: orderRef,
            });

            if (orderError) throw orderError;

            // Insert order items
            if (items.length > 0) {
                const orderItemsToInsert = items.map(item => ({
                    order_id: orderId,
                    title: item.title,
                    price: item.price,
                    ...(item.type === 'product' ? { product_id: item.id } : { service_id: item.id }),
                }));

                const { error: itemsError } = await supabase.from('order_items').insert(orderItemsToInsert);
                if (itemsError) {
                    console.error('Error inserting order items:', itemsError);
                }
            }

            clearCart();
            setLoading(false);
            setStep(3);

            // Navigate away after showing thank you page
            setTimeout(() => {
                navigate('/portal');
            }, 10000);

        } catch (err: any) {
            setError(err.message || 'حدث خطأ أثناء إتمام الطلب');
            setLoading(false);
        }
    };

    // This handles the return from Lemon Squeezy if we use a redirect back here
    React.useEffect(() => {
        const status = searchParams.get('status');
        if (status === 'success') {
            setStep(3);
            setTimeout(() => {
                navigate('/portal');
            }, 5000);
        }
    }, [searchParams]);

    return (
        <div className="min-h-screen pt-32 pb-24 px-6 bg-[#0d2226]" dir="rtl">
            <SEO title="إتمام الشراء" description="صفحة الدفع الآمن" />
            <div className="max-w-4xl mx-auto">

                <header className="mb-12 text-center">
                    <h1 className="text-4xl font-black text-white mb-4">إتمام الطلب</h1>
                    <div className="flex items-center justify-center gap-4 text-[#cfd9cc]/50 text-sm font-bold">
                        <span className={step >= 1 ? 'text-[#cfd9cc]' : ''}>1. مراجعة الطلب</span>
                        <span className="w-8 h-px bg-white/10" />
                        <span className={step >= 2 ? 'text-[#cfd9cc]' : ''}>2. الدفع الآمن</span>
                        <span className="w-8 h-px bg-white/10" />
                        <span className={step >= 3 ? 'text-[#cfd9cc]' : ''}>3. التأكيد</span>
                    </div>
                </header>

                {error && (
                    <div className="mb-8 bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-3 text-red-400 font-bold">
                        <AlertCircle size={20} /> {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Order Summary (Always Visible) */}
                    <div className="md:col-span-1">
                        <div className="glass p-6 rounded-3xl sticky top-32">
                            <h3 className="text-xl font-black text-white mb-6 border-b border-white/5 pb-4">ملخص الطلب</h3>
                            <div className="space-y-4 mb-6">
                                {items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-start gap-4 pb-2 border-b border-white/5 last:border-0">
                                        <div className="flex flex-col">
                                            <span className="text-[#cfd9cc]/70 font-bold text-sm">{item.title}</span>
                                            <span className="text-white/30 text-xs">الكمية: {item.quantity}</span>
                                        </div>
                                        <span className="text-white font-black">{item.price * item.quantity} ر.س</span>
                                    </div>
                                ))}
                                <div className="flex justify-between items-center text-[#cfd9cc]/50 text-xs pt-2 border-t border-white/5">
                                    <span>الضريبة (15%)</span>
                                    <span>{taxAmount.toFixed(2)} ر.س</span>
                                </div>
                            </div>
                            <div className="border-t border-white/5 pt-4 flex justify-between items-center">
                                <span className="font-black text-white">الإجمالي</span>
                                <span className="font-black text-xl text-[#cfd9cc]">{finalTotal.toFixed(2)} ر.س</span>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="md:col-span-2">
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="glass p-8 rounded-[40px]"
                                >
                                    <h2 className="text-2xl font-black text-white mb-6">تأكيد التفاصيل</h2>
                                    <div className="bg-white/5 p-6 rounded-2xl mb-8 flex items-center gap-4 border border-white/5">
                                        <div className="w-16 h-16 bg-[#cfd9cc]/10 rounded-xl flex items-center justify-center">
                                            <ShieldCheck className="text-[#cfd9cc]" size={32} />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold text-lg">
                                                {items.length === 1 ? items[0].title : `${items.length} منتجات/خدمات`}
                                            </h4>
                                            <p className="text-[#cfd9cc]/50 text-sm">شامل التحديثات والدعم الفني</p>
                                        </div>
                                    </div>

                                    {!user ? (
                                        <div className="bg-amber-500/10 border border-amber-500/20 p-6 rounded-2xl text-center">
                                            <p className="text-amber-200 font-bold mb-4">يجب تسجيل الدخول للمتابعة</p>
                                            <button onClick={() => navigate('/login')} className="bg-amber-500 text-[#0d2226] px-6 py-2 rounded-xl font-bold hover:bg-white transition-colors">
                                                تسجيل الدخول
                                            </button>
                                        </div>
                                    ) : (
                                        <button onClick={() => setStep(2)} className="w-full py-4 bg-[#cfd9cc] text-[#0d2226] font-black rounded-2xl hover:bg-white transition-all shadow-glow flex items-center justify-center gap-2">
                                            المتابعة للدفع <ArrowRight size={20} />
                                        </button>
                                    )}
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="glass p-12 rounded-[40px] text-center"
                                >
                                    <div className="w-20 h-20 bg-[#cfd9cc]/10 rounded-full flex items-center justify-center mx-auto mb-8">
                                        <Wallet className="text-[#cfd9cc]" size={40} />
                                    </div>
                                    <h2 className="text-3xl font-black text-white mb-4">إنشاء الطلب والحجز</h2>
                                    <p className="text-[#cfd9cc]/60 mb-10 leading-relaxed">
                                        سيتم الآن تسجيل طلبك في النظام واعتماده مباشرة.
                                    </p>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleLemonSqueezyCheckout}
                                        disabled={loading}
                                        className="w-full py-6 bg-[#cfd9cc] text-[#0d2226] font-black rounded-2xl hover:bg-white transition-all shadow-glow flex items-center justify-center gap-3 disabled:opacity-50 text-xl"
                                    >
                                        {loading ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-5 h-5 border-4 border-[#0d2226]/20 border-t-[#0d2226] rounded-full animate-spin" />
                                                جاري الاعتماد...
                                            </div>
                                        ) : (
                                            <>إتمام الطلب <ArrowRight size={24} /></>
                                        )}
                                    </motion.button>

                                    <div className="mt-8 flex items-center justify-center gap-6 opacity-30 grayscale invert">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-6" alt="Visa" />
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-8" alt="Mastercard" />
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg" className="h-6" alt="Apple Pay" />
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="glass p-12 rounded-[50px] text-center"
                                >
                                    <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                                        <CheckCircle size={48} className="text-green-500 relative z-10" />
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1.5, opacity: 0 }}
                                            transition={{ repeat: Infinity, duration: 2 }}
                                            className="absolute inset-0 bg-green-500/20 rounded-full"
                                        />
                                    </div>
                                    <h2 className="text-4xl font-black text-white mb-4">شكراً لطلبك! 🎉</h2>
                                    <p className="text-[#cfd9cc]/80 text-lg mb-6 leading-relaxed">
                                        تم استلام طلبك بنجاح وسيتم مراجعته من قبل فريقنا.
                                    </p>

                                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-8 text-right">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                                                <MessageCircle size={20} className="text-green-400" />
                                            </div>
                                            <h4 className="text-white font-black text-lg">ماذا بعد؟</h4>
                                        </div>
                                        <p className="text-[#cfd9cc]/60 text-sm leading-relaxed mb-4">
                                            سيتواصل معك أحد ممثلينا عبر الواتساب خلال أوقات العمل في أقرب وقت ممكن لتأكيد طلبك وتزويدك بكافة التفاصيل.
                                        </p>
                                        <div className="flex items-center gap-2 text-[#cfd9cc]/40 text-xs">
                                            <Phone size={14} />
                                            <span>أوقات العمل: الأحد - الخميس، ٩ صباحاً - ٦ مساءً</span>
                                        </div>
                                    </div>

                                    <p className="text-[#cfd9cc]/30 text-sm mb-6">
                                        سيتم تحويلك إلى لوحة التحكم الخاصة بك تلقائياً...
                                    </p>
                                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: "0%" }}
                                            animate={{ width: "100%" }}
                                            transition={{ duration: 8 }}
                                            className="h-full bg-green-500"
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Checkout;
