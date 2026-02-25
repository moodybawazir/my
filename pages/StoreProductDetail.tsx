import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ShoppingCart, Check, Star, ArrowRight, ShieldCheck, Zap, Server } from 'lucide-react';
import { fetchProductBySlug } from '../src/lib/storeQueries';
import { ProductWithCategory } from '../src/types/store.types';

export default function StoreProductDetail() {
    const { productSlug } = useParams<{ productSlug: string }>();
    const navigate = useNavigate();
    const [product, setProduct] = useState<ProductWithCategory | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    useEffect(() => {
        const loadData = async () => {
            if (!productSlug) return;
            setLoading(true);
            const data = await fetchProductBySlug(productSlug);
            setProduct(data);
            setLoading(false);
        };
        loadData();
    }, [productSlug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0d2226] flex items-center justify-center font-['Tajawal']" dir="rtl">
                <div className="w-16 h-16 border-4 border-[#cfd9cc]/20 border-t-[#cfd9cc] rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-[#0d2226] flex flex-col items-center justify-center text-white font-['Tajawal']" dir="rtl">
                <h1 className="text-4xl font-black mb-4">المنتج غير موجود</h1>
                <button onClick={() => navigate('/store')} className="text-[#cfd9cc] hover:text-white underline font-bold">العودة للمتجر</button>
            </div>
        );
    }

    const images = Array.isArray(product.images) && product.images.length > 0
        ? product.images as string[]
        : ['https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=1200&auto=format&fit=crop'];

    const displayPrice = product.sale_price ? product.sale_price : product.price;

    return (
        <div className="min-h-screen bg-[#0d2226] text-white font-['Tajawal'] pb-32" dir="rtl">
            <Helmet>
                <title>{product.name} | متجر بصيرة الرقمي</title>
                <meta name="description" content={product.description || ''} />
            </Helmet>

            {/* Breadcrumb & Navigation */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 pt-28 pb-6 flex items-center gap-4 text-sm font-bold text-[#cfd9cc]/40">
                <button onClick={() => navigate('/store')} className="hover:text-white transition-colors">المتجر</button>
                <span>/</span>
                {product.category && (
                    <>
                        <button onClick={() => navigate(`/store/category/${product.category!.slug}`)} className="hover:text-white transition-colors">{product.category.name}</button>
                        <span>/</span>
                    </>
                )}
                <span className="text-white pr-2 truncate">{product.name}</span>
            </div>

            <main className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="glass rounded-[50px] border-white/5 overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)]">
                    <div className="grid grid-cols-1 lg:grid-cols-2">

                        {/* Product Gallery */}
                        <div className="p-8 md:p-12 lg:pr-12 lg:pl-6 space-y-6">
                            {/* Main Image */}
                            <div className="relative aspect-square md:aspect-[4/3] rounded-[40px] overflow-hidden bg-black/40 border border-white/5 group">
                                <img
                                    src={images[activeImageIndex]}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                />
                                {product.is_featured && (
                                    <div className="absolute top-6 right-6 bg-amber-400 text-[#0d2226] font-black px-4 py-2 rounded-2xl tracking-widest uppercase shadow-xl">
                                        الأكثر مبيعاً
                                    </div>
                                )}
                            </div>

                            {/* Thumbnails */}
                            {images.length > 1 && (
                                <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
                                    {images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveImageIndex(idx)}
                                            className={`relative w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all ${activeImageIndex === idx ? 'border-[#cfd9cc] scale-105 shadow-glow' : 'border-white/10 opacity-60 hover:opacity-100'}`}
                                        >
                                            <img src={img} className="w-full h-full object-cover" alt="" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="p-8 md:p-12 border-t lg:border-t-0 lg:border-r border-white/5 flex flex-col justify-center">
                            <div className="mb-4">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-[#cfd9cc]/10 text-[#cfd9cc] text-xs font-black uppercase tracking-widest mb-6">
                                    <Server size={14} /> {product.category?.name || 'منتج رقمي'}
                                </div>
                                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-tight mb-4">
                                    {product.name}
                                </h1>
                                <p className="text-xl text-[#cfd9cc]/60 leading-relaxed font-medium">
                                    {product.description}
                                </p>
                            </div>

                            {/* Ratings (Mocked or DB) */}
                            <div className="flex items-center gap-2 mb-10">
                                <div className="flex text-amber-400">
                                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={20} fill="currentColor" />)}
                                </div>
                                <span className="text-[#cfd9cc]/60 font-bold ml-2">({product.reviews_count || 48} تقييم)</span>
                            </div>

                            {/* Price Configurator */}
                            <div className="glass p-8 rounded-[35px] border-white/5 bg-white/[0.02] mb-10">
                                <div className="flex flex-col items-start gap-2 mb-8">
                                    <div className="text-sm font-black text-white/40 uppercase tracking-widest">السعر النهائي</div>
                                    <div className="flex items-end gap-4">
                                        <span className="text-5xl font-black text-[#cfd9cc]">{displayPrice.toLocaleString('ar-SA')} <span className="text-2xl text-white/40">ر.س</span></span>
                                        {product.sale_price && (
                                            <span className="text-xl font-bold text-white/30 line-through mb-1.5">{product.price.toLocaleString('ar-SA')} ر.س</span>
                                        )}
                                    </div>
                                    <div className="text-xs font-bold text-emerald-400 mt-2 flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                                        <ShieldCheck size={14} /> تدفع مرة واحدة، استخدام غير محدود
                                    </div>
                                </div>

                                <button
                                    onClick={() => navigate(`/checkout?product=${product.id}`)}
                                    className="w-full py-5 rounded-2xl bg-[#cfd9cc] text-[#0d2226] font-black text-xl flex justify-center items-center gap-4 hover:bg-white shadow-glow-strong transition-luxury group"
                                >
                                    <ShoppingCart size={24} className="group-hover:scale-110 transition-transform" /> أضف إلى السلة الآن
                                </button>
                            </div>

                            {/* Features Preview */}
                            {product.features && Array.isArray(product.features) && product.features.length > 0 && (
                                <div>
                                    <h4 className="font-black text-white mb-6 text-lg">أهم مميزات المنتج:</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {product.features.map((feature: string, idx: number) => (
                                            <div key={idx} className="flex items-center gap-3 font-bold text-[#cfd9cc]/80 text-sm">
                                                <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400"><Check size={14} /></div>
                                                {feature}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>

                {/* Full Description Section */}
                {product.full_description && (
                    <div className="mt-12 glass p-10 md:p-16 rounded-[50px] border-white/5 max-w-4xl mx-auto">
                        <h3 className="text-3xl font-black text-white mb-8 flex items-center gap-4">
                            <Zap className="text-[#cfd9cc]" /> تفاصيل ومواصفات المنتج الطويلة
                        </h3>
                        <div className="prose prose-invert prose-lg max-w-none prose-p:text-[#cfd9cc]/70 prose-headings:text-white prose-a:text-[#cfd9cc]">
                            {/* In a real app, this might be rendered as Markdown or HTML. For now, we'll just pre-wrap it. */}
                            <p className="whitespace-pre-wrap leading-loose font-medium">{product.full_description}</p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
