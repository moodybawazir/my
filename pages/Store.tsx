import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ShoppingBag, Search, Filter } from 'lucide-react';
import { fetchStoreCategories, fetchStoreProducts, fetchCategoryBySlug } from '../src/lib/storeQueries';
import { StoreCategory, ProductWithCategory } from '../src/types/store.types';
import { CategoryTree } from '../src/components/store/CategoryTree';
import { CategoryChips } from '../src/components/store/CategoryChips';
import { ProductCard } from '../src/components/store/ProductCard';

export default function Store() {
    const { categorySlug } = useParams<{ categorySlug?: string }>();
    const navigate = useNavigate();

    const [categories, setCategories] = useState<StoreCategory[]>([]);
    const [products, setProducts] = useState<ProductWithCategory[]>([]);
    const [activeCategory, setActiveCategory] = useState<StoreCategory | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);

            // 1. Fetch Categories
            const cats = await fetchStoreCategories();
            setCategories(cats);

            // 2. Resolve Active Category if slug is present
            let currentCategoryId: string | undefined = undefined;
            if (categorySlug) {
                const found = await fetchCategoryBySlug(categorySlug);
                if (found) {
                    setActiveCategory(found);
                    currentCategoryId = found.id;
                } else {
                    // Category not found, redirect to main store
                    navigate('/store', { replace: true });
                    return;
                }
            } else {
                setActiveCategory(null);
            }

            // 3. Fetch Products
            const prods = await fetchStoreProducts(currentCategoryId);
            setProducts(prods);

            setLoading(false);
        };

        loadData();
    }, [categorySlug, navigate]);

    // Filter products locally by search query
    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const pageTitle = activeCategory ? `${activeCategory.name} | متجر بصيرة الرقمي` : 'المتجر الرقمي | بصيرة AI';

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0d2226] flex items-center justify-center font-['Tajawal']" dir="rtl">
                <div className="w-16 h-16 border-4 border-[#cfd9cc]/20 border-t-[#cfd9cc] rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0d2226] text-white font-['Tajawal']" dir="rtl">
            <Helmet>
                <title>{pageTitle}</title>
                <meta name="description" content="تصفح أحدث المنتجات الرقمية والخدمات التقنية من بصيرة AI" />
            </Helmet>

            {/* Store Hero */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a383d]/40 to-transparent pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#cfd9cc]/5 rounded-full blur-[100px] pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 text-center">
                    <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full glass border-white/10 text-[#cfd9cc] text-sm font-black mb-8 animate-in slide-in-from-bottom-4 duration-700">
                        <ShoppingBag size={18} /> المتجر الرقمي
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 animate-in slide-in-from-bottom-8 duration-700 delay-100">
                        {activeCategory ? activeCategory.name : 'منتجات بصيرة الرقمية'}
                    </h1>
                    <p className="text-xl text-[#cfd9cc]/60 max-w-2xl mx-auto leading-relaxed animate-in slide-in-from-bottom-8 duration-700 delay-200">
                        {activeCategory?.description || 'استكشف أحدث الحلول الرقمية، قوالب الأعمال، وأنظمة الذكاء الاصطناعي الجاهزة للاندماج في مؤسستك.'}
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-xl mx-auto mt-12 relative animate-in zoom-in-95 duration-700 delay-300">
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-white/40">
                            <Search size={24} />
                        </div>
                        <input
                            type="text"
                            placeholder="ابحث عن المنتجات، القوالب، والتطبيقات..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-full py-5 pr-16 pl-6 text-white text-lg font-bold outline-none focus:border-[#cfd9cc]/40 focus:bg-white/10 transition-all shadow-[0_20px_40px_rgba(0,0,0,0.3)] placeholder:text-white/20"
                        />
                    </div>
                </div>
            </section>

            {/* Main Content Area */}
            <section className="max-w-7xl mx-auto px-4 md:px-8 pb-32">
                <div className="flex flex-col md:flex-row gap-8 items-start">

                    {/* Sidebar / Tree (Desktop) */}
                    <CategoryTree categories={categories} activeCategorySlug={categorySlug} />

                    {/* Products Area */}
                    <div className="flex-1 w-full min-w-0">

                        {/* Mobile Category Chips */}
                        <div className="md:hidden mb-8">
                            <CategoryChips categories={categories} activeCategorySlug={categorySlug} />
                        </div>

                        {/* Top Bar filtering / sorting (Optional) */}
                        <div className="flex justify-between items-center mb-10 pb-6 border-b border-white/5">
                            <p className="font-bold text-[#cfd9cc]/60">
                                عرض <span className="text-white mx-1">{filteredProducts.length}</span> منتج
                            </p>
                            <button className="flex items-center gap-2 text-sm font-bold text-white/50 hover:text-white transition-colors">
                                <Filter size={18} /> ترتيب حسب
                            </button>
                        </div>

                        {/* Results Grid */}
                        {filteredProducts.length === 0 ? (
                            <div className="text-center py-24 glass rounded-[40px] border-white/5">
                                <ShoppingBag size={64} className="mx-auto text-white/10 mb-6" />
                                <h3 className="text-2xl font-black text-white mb-3">لا توجد منتجات</h3>
                                <p className="text-[#cfd9cc]/40">لم يتم العثور على أي منتجات تطابق بحثك حالياً.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredProducts.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        )}

                    </div>
                </div>
            </section>
        </div>
    );
}
