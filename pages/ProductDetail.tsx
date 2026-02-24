import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowRight, ShoppingBag, Sparkles, Star,
    CheckCircle2, Package, ChevronLeft, ChevronRight,
    Zap, Clock, FileText, Globe, Key, Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../src/lib/supabase';

const ProductDetail: React.FC = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState<any>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [similarProducts, setSimilarProducts] = useState<any[]>([]);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!productId) return;

            const { data, error } = await (supabase
                .from('products') as any)
                .select('*')
                .eq('id', productId)
                .single();

            if (!error && data) {
                const mappedProduct = {
                    ...data,
                    title: data.name,
                    price: `${data.price?.toLocaleString('ar-SA')} ر.س`,
                    image: data.images?.[0],
                    desc: data.description,
                    reviews: data.reviews_count || 0,
                    images: data.images?.length > 0 ? data.images : ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800'],
                    fullDescription: data.full_description,
                    features: data.features || []
                };
                setProduct(mappedProduct);

                // Fetch similar products
                const { data: similar } = await (supabase
                    .from('products') as any)
                    .select('*')
                    .neq('id', productId)
                    .limit(3);

                if (similar) {
                    setSimilarProducts(similar.map((p: any) => ({
                        ...p,
                        title: p.name,
                        image: p.images?.[0]
                    })));
                }
            }
        };
        fetchProduct();
    }, [productId]);

    const handleBuyNow = () => {
        if (!product) return;
        sessionStorage.setItem('checkout_item', JSON.stringify({
            type: 'product',
            id: product.id,
            title: product.title,
            price: product.price,
            description: product.desc,
            instant: true // Direct to payment
        }));
        navigate('/checkout');
    };

    const handleNextImage = () => {
        if (product && product.images) {
            setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
        }
    };

    const handlePrevImage = () => {
        if (product && product.images) {
            setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
        }
    };

    if (!product) {
        return (
            <div className="min-h-screen pt-48 pb-24 px-6 bg-[#0d2226] flex items-center justify-center font-['Inter']">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center"
                >
                    <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                        <Package size={48} className="text-[#cfd9cc]/20" />
                    </div>
                    <h2 className="text-4xl font-black text-white mb-4">جاري تحميل المنتج...</h2>
                    <button onClick={() => navigate('/products')} className="text-[#cfd9cc] hover:text-white transition-colors">العودة للمنتجات</button>
                </motion.div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen pt-48 pb-24 px-6 bg-[#0d2226] font-['Inter']"
            dir="rtl"
        >
            <div className="max-w-7xl mx-auto">
                {/* Back Button */}
                <motion.button
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    onClick={() => navigate('/products')}
                    className="flex items-center gap-2 text-[#cfd9cc]/60 hover:text-[#cfd9cc] mb-12 transition-all hover:gap-4 font-bold"
                >
                    <ArrowRight size={20} /> العودة للمتجر الذكي
                </motion.button>

                {/* Main Product Header */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24 items-start">

                    {/* Immersive Gallery */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="space-y-8"
                    >
                        <div className="glass rounded-[60px] overflow-hidden relative group shadow-2xl aspect-[4/5] lg:aspect-auto lg:h-[700px]">
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={currentImageIndex}
                                    initial={{ opacity: 0, scale: 1.1 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.6 }}
                                    src={product.images[currentImageIndex]}
                                    alt={product.title}
                                    className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                                />
                            </AnimatePresence>

                            {/* Overlays */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0d2226] via-transparent to-black/20 pointer-events-none" />

                            {/* Navigation */}
                            {product.images.length > 1 && (
                                <div className="absolute inset-0 flex items-center justify-between px-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={handlePrevImage} className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center text-white hover:bg-[#cfd9cc] hover:text-[#0d2226] transition-all focus:outline-none">
                                        <ChevronRight size={32} />
                                    </button>
                                    <button onClick={handleNextImage} className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center text-white hover:bg-[#cfd9cc] hover:text-[#0d2226] transition-all focus:outline-none">
                                        <ChevronLeft size={32} />
                                    </button>
                                </div>
                            )}

                            {/* Breadcrumb Label */}
                            <div className="absolute top-8 right-8 px-6 py-2 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 text-[#cfd9cc] font-black text-xs uppercase tracking-[0.2em]">
                                {product.category}
                            </div>
                        </div>

                        {/* High-End Thumbnails */}
                        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                            {product.images.map((img: string, idx: number) => (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    key={idx}
                                    onClick={() => setCurrentImageIndex(idx)}
                                    className={`relative flex-shrink-0 w-24 h-24 rounded-3xl overflow-hidden border-2 transition-all ${idx === currentImageIndex ? 'border-[#cfd9cc]' : 'border-transparent opacity-40 hover:opacity-100'
                                        }`}
                                >
                                    <img src={img} className="w-full h-full object-cover" />
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Product Summary & Action */}
                    <div className="flex flex-col h-full py-6">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="flex items-center gap-3 mb-8">
                                <span className="w-12 h-px bg-[#cfd9cc]/30" />
                                <span className="text-[#cfd9cc] font-black tracking-widest text-xs uppercase">منتج متميز بصيرة</span>
                            </div>

                            <h1 className="text-6xl md:text-7xl font-black text-white mb-8 leading-[1.1] tracking-tighter">
                                {product.title}
                            </h1>

                            <div className="flex items-center gap-6 mb-12">
                                <div className="flex items-center gap-2 bg-amber-500/10 px-4 py-2 rounded-2xl border border-amber-500/20">
                                    <Star className="fill-amber-500 text-amber-500" size={18} />
                                    <span className="text-amber-500 font-black">{product.rating}</span>
                                </div>
                                <span className="text-[#cfd9cc]/40 font-bold">{product.reviews} تقييم حقيقي</span>
                            </div>

                            <p className="text-2xl text-[#cfd9cc]/60 leading-relaxed font-light mb-12 max-w-xl">
                                {product.desc}
                            </p>

                            <div className="bg-[#1e403a]/20 border border-white/5 rounded-[40px] p-10 mb-12 relative overflow-hidden group">
                                <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#cfd9cc]/5 rounded-full blur-[80px] group-hover:bg-[#cfd9cc]/10 transition-all duration-700" />

                                <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end gap-8 relative z-10">
                                    <div>
                                        <div className="text-[#cfd9cc]/40 text-sm font-bold mb-2 uppercase tracking-widest text-center sm:text-right">السعر النهائي للترخيص</div>
                                        <div className="text-7xl font-black text-white tracking-tighter text-center sm:text-right">{product.price}</div>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(207, 217, 204, 0.3)" }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleBuyNow}
                                        className="h-24 px-12 bg-[#cfd9cc] text-[#0d2226] rounded-[30px] font-black text-2xl flex items-center gap-4 shadow-xl transition-all w-full sm:w-auto justify-center"
                                    >
                                        اقتنِ الآن <ShoppingBag size={32} />
                                    </motion.button>
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="glass p-6 rounded-3xl border-white/5 flex items-center gap-4">
                                    <Zap className="text-amber-400" size={24} />
                                    <div>
                                        <div className="text-white font-black">تسليم فوري</div>
                                        <div className="text-[#cfd9cc]/40 text-xs">مباشرة بعد الدفع</div>
                                    </div>
                                </div>
                                <div className="glass p-6 rounded-3xl border-white/5 flex items-center gap-4">
                                    <Shield className="text-emerald-400" size={24} />
                                    <div>
                                        <div className="text-white font-black">دفع آمن</div>
                                        <div className="text-[#cfd9cc]/40 text-xs">تشفير سيادي كامل</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Elaborate Details Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 mb-24">
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ y: 30, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            className="glass p-16 rounded-[60px] border-white/5 h-full"
                        >
                            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-[#cfd9cc] text-xs font-black mb-8 uppercase tracking-widest">
                                <FileText size={14} /> تفاصيل المنظومة
                            </div>
                            <h2 className="text-5xl font-black text-white mb-10 tracking-tight">نظرة عميقة على الحل</h2>
                            <div className="text-2xl text-[#cfd9cc]/50 leading-[1.8] font-light whitespace-pre-line">
                                {product.fullDescription}
                            </div>
                        </motion.div>
                    </div>

                    <div className="space-y-8 h-full">
                        <motion.div
                            initial={{ y: 30, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            className="bg-[#cfd9cc] rounded-[60px] p-12 text-[#0d2226]"
                        >
                            <h3 className="text-3xl font-black mb-8 leading-tight">ماذا يتضمن <br /> هذا الترخيص؟</h3>
                            <div className="space-y-6">
                                {product.features.map((feature: string, idx: number) => (
                                    <div key={idx} className="flex items-start gap-4 group">
                                        <div className="w-8 h-8 rounded-full bg-[#0d2226]/5 flex items-center justify-center flex-shrink-0 mt-1">
                                            <CheckCircle2 size={20} className="text-[#0d2226]" />
                                        </div>
                                        <span className="text-lg font-bold opacity-70 group-hover:opacity-100 transition-opacity">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <div className="glass p-10 rounded-[50px] border-white/5 flex flex-col gap-6">
                            <div className="flex items-center gap-4 text-white">
                                <Globe size={24} className="text-[#cfd9cc]" />
                                <span className="font-bold text-lg">متاح بجميع لغات المنطق</span>
                            </div>
                            <div className="flex items-center gap-4 text-white">
                                <Key size={24} className="text-[#cfd9cc]" />
                                <span className="font-bold text-lg">كود المصدر (اختياري)</span>
                            </div>
                            <div className="flex items-center gap-4 text-white">
                                <Clock size={24} className="text-[#cfd9cc]" />
                                <span className="font-bold text-lg">تحديثات مدى الحياة</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cross-Sell */}
                {similarProducts.length > 0 && (
                    <div className="pt-24 border-t border-white/5">
                        <div className="flex items-center justify-between mb-16">
                            <h2 className="text-5xl font-black text-white tracking-tight">قد يلهمك أيضاً</h2>
                            <button onClick={() => navigate('/products')} className="text-[#cfd9cc] font-black border-b border-[#cfd9cc]/30 hover:border-[#cfd9cc] transition-all">كل المنتجات</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {similarProducts.map((simProduct, idx) => (
                                <motion.button
                                    initial={{ y: 20, opacity: 0 }}
                                    whileInView={{ y: 0, opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    key={simProduct.id}
                                    onClick={() => navigate(`/product/${simProduct.id}`)}
                                    className="group glass rounded-[50px] overflow-hidden border-white/5 hover:border-[#cfd9cc]/30 transition-all text-right"
                                >
                                    <div className="h-72 overflow-hidden relative">
                                        <img
                                            src={simProduct.image}
                                            alt={simProduct.title}
                                            className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0d2226] via-transparent to-transparent opacity-80" />
                                    </div>
                                    <div className="p-10">
                                        <h3 className="text-2xl font-black text-white mb-4 group-hover:text-[#cfd9cc] transition-colors tracking-tight line-clamp-1">{simProduct.title}</h3>
                                        <div className="text-3xl font-black text-[#cfd9cc]/60 group-hover:text-[#cfd9cc] transition-colors">{simProduct.price}</div>
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default ProductDetail;
