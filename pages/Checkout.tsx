import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CreditCard, CheckCircle, ShieldCheck, Lock, AlertCircle, ArrowRight, Wallet, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../src/lib/supabase';
import SEO from '../src/components/SEO';
import { useAuth } from '../src/context/AuthContext';

const Checkout: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    // Try to load from sessionStorage first, then fall back to URL params
    const storedItem = sessionStorage.getItem('checkout_item');
    let itemData = null;

    if (storedItem) {
        itemData = JSON.parse(storedItem);
        // Clear after reading
        sessionStorage.removeItem('checkout_item');
    }

    const itemId = itemData?.id || searchParams.get('id');
    const itemType = itemData?.type || searchParams.get('type') || 'service';
    const convertArabicNumerals = (str: string) => {
        return str.replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString());
    };

    const itemName = itemData?.title || searchParams.get('title') || 'خدمة غير محددة';
    const rawPrice = itemData?.price || searchParams.get('price') || '0';
    const itemPrice = parseFloat(convertArabicNumerals(rawPrice).replace(/[^\d.]/g, ''));

    const isInstant = itemData?.instant || searchParams.get('instant') === 'true';
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

            const { error: orderError } = await supabase.from('orders').insert({
                id: orderId,
                user_id: user.id,
                total_amount: itemPrice,
                status: 'قيد الإنشاء', // Initial status
                payment_status: 'paid', // Mock paid status
                ls_order_id: `MOCK-${Date.now().toString().slice(-6)}`,
            });

            if (orderError) throw orderError;

            // Optionally insert into order_items if you want to track line items
            if (itemId) {
                await supabase.from('order_items').insert({
                    order_id: orderId,
                    [itemType === 'service' ? 'service_id' : 'product_id']: itemId,
                    title: itemName,
                    price: itemPrice
                });
            }

            // Simulate network delay for realistic experience
            setTimeout(() => {
                setLoading(false);
                setStep(3); // Go directly to success screen

                // Navigate away after success
                setTimeout(() => {
                    navigate('/portal');
                }, 5000);
            }, 1500);

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
                                <div className="flex justify-between items-start gap-4">
                                    <span className="text-[#cfd9cc]/70 font-bold text-sm">{itemName}</span>
                                    <span className="text-white font-black">{itemPrice} ر.س</span>
                                </div>
                                <div className="flex justify-between items-center text-[#cfd9cc]/50 text-xs">
                                    <span>الضريبة (15%)</span>
                                    <span>{(itemPrice * 0.15).toFixed(2)} ر.س</span>
                                </div>
                            </div>
                            <div className="border-t border-white/5 pt-4 flex justify-between items-center">
                                <span className="font-black text-white">الإجمالي</span>
                                <span className="font-black text-xl text-[#cfd9cc]">{(itemPrice * 1.15).toFixed(2)} ر.س</span>
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
                                            <h4 className="text-white font-bold text-lg">{itemName}</h4>
                                            <p className="text-[#cfd9cc]/50 text-sm">ترخيص لمدة سنة • شامل الدعم الفني</p>
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
                                    <h2 className="text-4xl font-black text-white mb-4">تم الدفع بنجاح!</h2>
                                    <p className="text-[#cfd9cc]/60 text-lg mb-8">
                                        شكراً لك. تم تأكيد طلبك وإضافته إلى حسابك. جاري تحويلك إلى لوحة التحكم...
                                    </p>
                                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: "0%" }}
                                            animate={{ width: "100%" }}
                                            transition={{ duration: 3 }}
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
