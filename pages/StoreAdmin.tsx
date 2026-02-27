import React, { useState, useEffect } from 'react';
import { supabase } from '../src/lib/supabase';
import { Helmet } from 'react-helmet-async';
import { StoreCategory, StoreProduct } from '../src/types/store.types';
import { Plus, Edit2, Trash2, Tag, ShoppingBag, ArrowRight, Save, X, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStorage } from '../src/hooks/useStorage';

export default function StoreAdmin() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'categories' | 'products'>('categories');

    // Categories State
    const [categories, setCategories] = useState<StoreCategory[]>([]);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<StoreCategory | null>(null);

    // Products State
    const [products, setProducts] = useState<StoreProduct[]>([]);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<StoreProduct | null>(null);

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const { uploadImage, uploading: isUploading } = useStorage();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const [catsRes, prodsRes] = await Promise.all([
            supabase.from('store_categories').select('*').order('sort_order', { ascending: true }),
            supabase.from('store_products').select('*, store_categories(name)').order('created_at', { ascending: false })
        ]);

        if (catsRes.data) setCategories(catsRes.data);
        if (prodsRes.data) setProducts(prodsRes.data);

        setLoading(false);
    };

    // --- Category Handlers ---
    const handleCategorySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const fd = new FormData(e.currentTarget);
            const data = Object.fromEntries(fd.entries());

            // Handle image upload if a file was selected
            const fileInput = e.currentTarget.querySelector('input[type="file"]') as HTMLInputElement;
            let imageUrl = editingCategory?.image || null;

            if (fileInput?.files?.length) {
                const uploadedUrl = await uploadImage(fileInput.files[0], 'products', 'store_categories');
                if (uploadedUrl) imageUrl = uploadedUrl;
            }

            const payload = {
                name: data.name as string,
                slug: data.slug as string,
                description: (data.description as string) || null,
                icon: (data.icon as string) || null,
                sort_order: parseInt(data.sort_order as string) || 0,
                image: imageUrl,
                is_active: data.is_active === 'on'
            };

            let error;
            if (editingCategory) {
                const res = await supabase.from('store_categories').update(payload).eq('id', editingCategory.id);
                error = res.error;
            } else {
                const res = await supabase.from('store_categories').insert([payload]);
                error = res.error;
            }

            if (error) throw error;

            setIsCategoryModalOpen(false);
            setEditingCategory(null);
            await loadData();
            alert('تم حفظ القسم بنجاح');
        } catch (err: any) {
            console.error('Error saving category:', err);
            alert('فشل حفظ القسم: ' + (err.message || 'خطأ غير معروف'));
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteCategory = async (id: string) => {
        if (!window.confirm('هل أنت متأكد من حذف هذا القسم؟')) return;
        const { error } = await supabase.from('store_categories').delete().eq('id', id);
        if (error) {
            alert('فشل حذف القسم: ' + error.message);
        } else {
            await loadData();
        }
    };

    // --- Product Handlers ---
    const handleProductSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const fd = new FormData(e.currentTarget);
            const data = Object.fromEntries(fd.entries());

            const featuresArray = (data.features as string)?.split(',').map(s => s.trim()).filter(Boolean) || [];

            // Handle image upload if a file was selected
            const fileInput = e.currentTarget.querySelector('input[type="file"]') as HTMLInputElement;
            let imageUrl = data.existing_image_url as string || null;

            if (fileInput?.files?.length) {
                const uploadedUrl = await uploadImage(fileInput.files[0], 'products', 'store_products');
                if (uploadedUrl) imageUrl = uploadedUrl;
            }

            const imagesArray = imageUrl ? [imageUrl] : [];

            const payload = {
                name: data.name as string,
                slug: data.slug as string,
                description: (data.description as string) || null,
                full_description: (data.full_description as string) || null,
                price: parseFloat(data.price as string) || 0,
                sale_price: data.sale_price ? parseFloat(data.sale_price as string) : null,
                category_id: (data.category_id as string) || null,
                stock: parseInt(data.stock as string) || 0,
                features: featuresArray,
                images: imagesArray,
                is_active: data.is_active === 'on',
                is_featured: data.is_featured === 'on',
            };

            let error;
            if (editingProduct) {
                const res = await supabase.from('store_products').update(payload).eq('id', editingProduct.id);
                error = res.error;
            } else {
                const res = await supabase.from('store_products').insert([payload]);
                error = res.error;
            }

            if (error) throw error;

            setIsProductModalOpen(false);
            setEditingProduct(null);
            await loadData();
            alert('تم حفظ المنتج بنجاح');
        } catch (err: any) {
            console.error('Error saving product:', err);
            alert('فشل حفظ المنتج: ' + (err.message || 'خطأ غير معروف'));
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteProduct = async (id: string) => {
        if (!window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;
        const { error } = await supabase.from('store_products').delete().eq('id', id);
        if (error) {
            alert('فشل حذف المنتج: ' + error.message);
        } else {
            await loadData();
        }
    };


    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="w-12 h-12 border-4 border-[#cfd9cc]/20 border-t-[#cfd9cc] rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="p-8 pb-32 font-['Tajawal']" dir="rtl">
            <Helmet>
                <title>إدارة المتجر | بصيرة AI</title>
            </Helmet>

            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[#cfd9cc]/60 hover:text-white transition-colors mb-8 font-bold">
                <ArrowRight size={20} /> العودة للإدارة
            </button>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
                <div>
                    <h1 className="text-4xl font-black text-white mb-2 tracking-tight">إدارة المتجر</h1>
                    <p className="text-[#cfd9cc]/60">إدارة أقسام المتجر ومنتجاته</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-8">
                <button
                    onClick={() => setActiveTab('categories')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'categories' ? 'bg-[#cfd9cc] text-[#0d2226]' : 'bg-white/5 text-white hover:bg-white/10'}`}
                >
                    <Tag size={18} /> الأقسام
                </button>
                <button
                    onClick={() => setActiveTab('products')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'products' ? 'bg-[#cfd9cc] text-[#0d2226]' : 'bg-white/5 text-white hover:bg-white/10'}`}
                >
                    <ShoppingBag size={18} /> المنتجات
                </button>
            </div>

            {/* Categories Tab */}
            {activeTab === 'categories' && (
                <div className="space-y-6">
                    <div className="flex justify-end">
                        <button
                            onClick={() => { setEditingCategory(null); setIsCategoryModalOpen(true); }}
                            className="flex items-center gap-2 bg-[#cfd9cc] hover:bg-white text-[#0d2226] px-6 py-3 rounded-xl font-bold transition-all shadow-lg"
                        >
                            <Plus size={20} /> إضافة قسم جديد
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.map(cat => (
                            <div key={cat.id} className="glass p-6 rounded-2xl border-white/10 relative group">
                                <div className="absolute top-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => { setEditingCategory(cat); setIsCategoryModalOpen(true); }} className="p-2 bg-white/10 hover:bg-[#cfd9cc] text-white hover:text-[#0d2226] rounded-lg transition-colors"><Edit2 size={16} /></button>
                                    <button onClick={() => handleDeleteCategory(cat.id)} className="p-2 bg-white/10 hover:bg-red-500 text-white rounded-lg transition-colors"><Trash2 size={16} /></button>
                                </div>
                                <h3 className="text-xl font-black text-white mb-2">{cat.name}</h3>
                                <p className="text-sm text-[#cfd9cc]/60 mb-4">{cat.slug}</p>
                                <div className="flex justify-between items-center text-xs">
                                    <span className={`px-2 py-1 rounded-md font-bold ${cat.is_active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                                        {cat.is_active ? 'نشط' : 'غير نشط'}
                                    </span>
                                    <span className="text-white/40">ترتيب: {cat.sort_order}</span>
                                </div>
                            </div>
                        ))}
                        {categories.length === 0 && <div className="col-span-full text-center py-12 text-white/40 font-bold">لا توجد أقسام مطابقة.</div>}
                    </div>
                </div>
            )}

            {/* Products Tab */}
            {activeTab === 'products' && (
                <div className="space-y-6">
                    <div className="flex justify-end">
                        <button
                            onClick={() => { setEditingProduct(null); setIsProductModalOpen(true); }}
                            className="flex items-center gap-2 bg-[#cfd9cc] hover:bg-white text-[#0d2226] px-6 py-3 rounded-xl font-bold transition-all shadow-lg"
                        >
                            <Plus size={20} /> إضافة منتج جديد
                        </button>
                    </div>

                    <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                        <table className="w-full text-right">
                            <thead className="bg-white/5 border-b border-white/10">
                                <tr>
                                    <th className="px-6 py-4 text-sm font-bold text-white/60">المنتج</th>
                                    <th className="px-6 py-4 text-sm font-bold text-white/60">القسم</th>
                                    <th className="px-6 py-4 text-sm font-bold text-white/60">السعر</th>
                                    <th className="px-6 py-4 text-sm font-bold text-white/60">المخزون</th>
                                    <th className="px-6 py-4 text-sm font-bold text-white/60">الحالة</th>
                                    <th className="px-6 py-4 text-sm font-bold text-white/60">إجراءات</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {products.map(prod => (
                                    <tr key={prod.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-white">{prod.name}</div>
                                            <div className="text-xs text-[#cfd9cc]/60">{prod.slug}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-[#cfd9cc]/80">
                                            {(prod as any).store_categories?.name || '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-white">{prod.price} ر.س</div>
                                            {prod.sale_price && <div className="text-xs text-rose-400 line-through">{prod.sale_price} ر.س</div>}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-[#cfd9cc]/80">{prod.stock}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1 items-start">
                                                <span className={`px-2 py-1 text-xs rounded-md font-bold ${prod.is_active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                                                    {prod.is_active ? 'نشط' : 'غير نشط'}
                                                </span>
                                                {prod.is_featured && <span className="px-2 py-1 text-[10px] rounded-md font-bold bg-amber-500/20 text-amber-400">مميز</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => { setEditingProduct(prod); setIsProductModalOpen(true); }} className="p-2 bg-white/10 hover:bg-[#cfd9cc] text-white hover:text-[#0d2226] rounded-lg transition-colors"><Edit2 size={16} /></button>
                                                <button onClick={() => handleDeleteProduct(prod.id)} className="p-2 bg-white/10 hover:bg-red-500 text-white rounded-lg transition-colors"><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {products.length === 0 && <div className="text-center py-12 text-white/40 font-bold">لا توجد منتجات.</div>}
                    </div>
                </div>
            )}


            {/* Modals */}
            {/* Category Modal */}
            {isCategoryModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#0b1b1e] rounded-3xl p-8 max-w-lg w-full border border-white/10 shadow-2xl relative max-h-[90vh] overflow-y-auto hide-scrollbar">
                        <button onClick={() => setIsCategoryModalOpen(false)} className="absolute top-6 left-6 text-white/40 hover:text-white"><X size={24} /></button>
                        <h3 className="text-2xl font-black text-white mb-6">
                            {editingCategory ? 'تعديل القسم' : 'إضافة قسم جديد'}
                        </h3>
                        <form onSubmit={handleCategorySubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-white/60 mb-2">اسم القسم</label>
                                <input name="name" required defaultValue={editingCategory?.name} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#cfd9cc]/40" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-white/60 mb-2">الرابط الدائم (Slug)</label>
                                <input name="slug" required defaultValue={editingCategory?.slug} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#cfd9cc]/40 font-mono text-left" dir="ltr" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-white/60 mb-2">وصف القسم</label>
                                <textarea name="description" defaultValue={editingCategory?.description || ''} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#cfd9cc]/40 h-24 resize-none" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-white/60 mb-2">الترتيب</label>
                                    <input name="sort_order" type="number" defaultValue={editingCategory?.sort_order || 0} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#cfd9cc]/40" />
                                </div>
                                <div className="flex items-center gap-3 mt-8">
                                    <input type="checkbox" name="is_active" id="cat_active" defaultChecked={editingCategory ? editingCategory.is_active! : true} className="w-5 h-5 accent-[#cfd9cc]" />
                                    <label htmlFor="cat_active" className="text-sm font-bold text-white cursor-pointer">قسم نشط</label>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-white/60 mb-2">صورة القسم (الخلفية)</label>
                                <div className="relative group/img h-[100px] bg-white/5 border border-white/10 rounded-xl overflow-hidden flex items-center justify-center cursor-pointer hover:border-[#cfd9cc]/40 transition-all">
                                    <input
                                        type="file"
                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onload = (ev) => {
                                                    const img = e.target.parentElement?.querySelector('img');
                                                    if (img) img.src = ev.target?.result as string;
                                                    const placeholder = e.target.parentElement?.querySelector('.placeholder-icon');
                                                    if (placeholder) placeholder.classList.add('hidden');
                                                    if (img) img.classList.remove('hidden');
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                    {editingCategory?.image ? (
                                        <img src={editingCategory.image} className="w-full h-full object-cover" alt="" />
                                    ) : (
                                        <>
                                            <div className="placeholder-icon flex flex-col items-center gap-2">
                                                <ImageIcon size={24} className="text-white/20" />
                                                <span className="text-[10px] text-white/20 font-bold uppercase">رفع صورة</span>
                                            </div>
                                            <img src="" className="w-full h-full object-cover hidden" alt="" />
                                        </>
                                    )}
                                    {isUploading && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                            <div className="w-6 h-6 border-2 border-[#cfd9cc] border-t-transparent rounded-full animate-spin" />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <button disabled={submitting} type="submit" className="w-full bg-[#cfd9cc] text-[#0d2226] font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-white transition-colors disabled:opacity-50 mt-4">
                                <Save size={20} /> حفظ القسم
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Product Modal */}
            {isProductModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#0b1b1e] rounded-3xl p-8 max-w-2xl w-full border border-white/10 shadow-2xl relative max-h-[90vh] overflow-y-auto hide-scrollbar">
                        <button onClick={() => setIsProductModalOpen(false)} className="absolute top-6 left-6 text-white/40 hover:text-white"><X size={24} /></button>
                        <h3 className="text-2xl font-black text-white mb-6">
                            {editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}
                        </h3>
                        <form onSubmit={handleProductSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-white/60 mb-2">اسم المنتج</label>
                                    <input name="name" required defaultValue={editingProduct?.name} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#cfd9cc]/40" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-white/60 mb-2">الرابط الدائم (Slug)</label>
                                    <input name="slug" required defaultValue={editingProduct?.slug} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#cfd9cc]/40 font-mono text-left" dir="ltr" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-white/60 mb-2">القسم</label>
                                    <select name="category_id" defaultValue={editingProduct?.category_id || ''} className="w-full bg-[#112a2f] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#cfd9cc]/40">
                                        <option value="">بدون قسم</option>
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-white/60 mb-2">صورة المنتج</label>
                                    <div className="relative group/img h-[120px] bg-white/5 border border-white/10 rounded-xl overflow-hidden flex items-center justify-center cursor-pointer hover:border-[#cfd9cc]/40 transition-all">
                                        <input type="hidden" name="existing_image_url" defaultValue={editingProduct?.images?.[0] || ''} />
                                        <input
                                            type="file"
                                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onload = (ev) => {
                                                        const img = e.target.parentElement?.querySelector('img');
                                                        if (img) img.src = ev.target?.result as string;
                                                        const placeholder = e.target.parentElement?.querySelector('.placeholder-icon');
                                                        if (placeholder) placeholder.classList.add('hidden');
                                                        if (img) img.classList.remove('hidden');
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                        />
                                        {editingProduct?.images?.[0] ? (
                                            <img src={editingProduct.images[0]} className="w-full h-full object-cover" alt="" />
                                        ) : (
                                            <>
                                                <div className="placeholder-icon flex flex-col items-center gap-2">
                                                    <ImageIcon size={32} className="text-white/20" />
                                                    <span className="text-[10px] text-white/20 font-bold uppercase">رفع صورة</span>
                                                </div>
                                                <img src="" className="w-full h-full object-cover hidden" alt="" />
                                            </>
                                        )}
                                        {isUploading && (
                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                <div className="w-6 h-6 border-2 border-[#cfd9cc] border-t-transparent rounded-full animate-spin" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-white/60 mb-2">السعر (ر.س)</label>
                                    <input name="price" type="number" required defaultValue={editingProduct?.price || 0} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#cfd9cc]/40" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-white/60 mb-2">سعر التخفيض الاختياري (ر.س)</label>
                                    <input name="sale_price" type="number" defaultValue={editingProduct?.sale_price || ''} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#cfd9cc]/40" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-white/60 mb-2">المخزون (9999 لغير محدود)</label>
                                    <input name="stock" type="number" required defaultValue={editingProduct?.stock || 9999} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#cfd9cc]/40" />
                                </div>
                                <div className="flex flex-col justify-center gap-3">
                                    <div className="flex items-center gap-3 mt-4">
                                        <input type="checkbox" name="is_active" id="prod_active" defaultChecked={editingProduct ? editingProduct.is_active! : true} className="w-5 h-5 accent-[#cfd9cc]" />
                                        <label htmlFor="prod_active" className="text-sm font-bold text-white cursor-pointer">منتج نشط</label>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <input type="checkbox" name="is_featured" id="prod_feat" defaultChecked={editingProduct ? editingProduct.is_featured! : false} className="w-5 h-5 accent-[#cfd9cc]" />
                                        <label htmlFor="prod_feat" className="text-sm font-bold text-white cursor-pointer">منتج مميز</label>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-white/60 mb-2">وصف قصير</label>
                                <textarea name="description" defaultValue={editingProduct?.description || ''} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#cfd9cc]/40 h-20 resize-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-white/60 mb-2">المميزات (مفصولة بفاصلة)</label>
                                <textarea name="features" defaultValue={editingProduct?.features?.join(', ') || ''} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#cfd9cc]/40 h-20 resize-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-white/60 mb-2">وصف تفصيلي كامل</label>
                                <textarea name="full_description" defaultValue={editingProduct?.full_description || ''} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#cfd9cc]/40 h-32 resize-none" />
                            </div>

                            <button disabled={submitting} type="submit" className="w-full bg-[#cfd9cc] text-[#0d2226] font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-white transition-colors disabled:opacity-50 mt-4">
                                <Save size={20} /> حفظ المنتج
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
