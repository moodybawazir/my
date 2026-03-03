import React, { useState, useEffect } from 'react';
import { supabase } from '../src/lib/supabase';
import { Helmet } from 'react-helmet-async';
import { Plus, Edit2, Trash2, Tag, Activity, ArrowRight, Save, X, Search, Calendar, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminSubscriptions() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'subscriptions' | 'coupons'>('subscriptions');

    // Subscriptions State
    const [subscriptions, setSubscriptions] = useState<any[]>([]);
    const [isSubModalOpen, setIsSubModalOpen] = useState(false);

    // Form selections for cascading dropdowns
    const [industries, setIndustries] = useState<any[]>([]);
    const [subServices, setSubServices] = useState<any[]>([]);
    const [packages, setPackages] = useState<any[]>([]);
    const [durations, setDurations] = useState<any[]>([]);
    const [customers, setCustomers] = useState<any[]>([]);

    // Coupons State
    const [coupons, setCoupons] = useState<any[]>([]);
    const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState<any | null>(null);

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const [subsRes, couponsRes, indRes, custRes] = await Promise.all([
            // In Supabase, joining across foreign keys:
            (supabase as any).from('subscriptions').select('*, users:client_id(name, email), packages:package_id(name_ar)').order('created_at', { ascending: false }),
            (supabase as any).from('coupons').select('*').order('created_at', { ascending: false }),
            supabase.from('industry_sections').select('id, title'),
            supabase.from('users').select('id, name, email').eq('role', 'user')
        ]);

        if (subsRes.data) setSubscriptions(subsRes.data);
        if (couponsRes.data) setCoupons(couponsRes.data);
        if (indRes.data) setIndustries(indRes.data);
        if (custRes.data) setCustomers(custRes.data);

        setLoading(false);
    };

    // --- Subscriptions Functions ---
    const handleAddSubscription = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const fd = new FormData(e.currentTarget);
            const data = Object.fromEntries(fd.entries());

            // Invoke the RPC create_subscription function
            const { data: result, error } = await (supabase as any).rpc('create_subscription', {
                p_client_id: data.client_id,
                p_package_id: data.package_id,
                p_duration_type: data.duration_type,
                p_start_date: data.start_date || new Date().toISOString().split('T')[0],
                p_auto_renew: data.auto_renew === 'on',
                p_notes: data.notes || '',
                p_coupon_code: data.coupon_code || null
            });

            if (error) throw error;

            setIsSubModalOpen(false);
            await loadData();
            alert('تم إنشاء الاشتراك وإصدار الفاتورة بنجاح!');
        } catch (err: any) {
            console.error(err);
            alert('فشل إنشاء الاشتراك: ' + (err.message || 'خطأ غير معروف'));
        } finally {
            setSubmitting(false);
        }
    };

    // Load sub-services when industry is selected
    const onIndustryChange = async (indId: string) => {
        setSubServices([]); setPackages([]); setDurations([]);
        if (!indId) return;
        const { data } = await (supabase as any).from('industry_sub_services').select('id, title').eq('industry_id', indId).eq('has_packages', true);
        if (data) setSubServices(data);
    };

    // Load packages when sub-service is selected
    const onSubServiceChange = async (subId: string) => {
        setPackages([]); setDurations([]);
        if (!subId) return;
        const { data } = await (supabase as any).from('packages').select('id, name_ar').eq('sub_service_id', subId).eq('is_active', true);
        if (data) setPackages(data);
    };

    // Load durations when package is selected
    const onPackageChange = async (pkgId: string) => {
        setDurations([]);
        if (!pkgId) return;
        const { data } = await (supabase as any).from('package_durations').select('id, duration_type, price, months').eq('package_id', pkgId).eq('is_active', true);
        if (data) setDurations(data);
    };

    // --- Coupons Functions ---
    const handleCouponSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const fd = new FormData(e.currentTarget);
            const data = Object.fromEntries(fd.entries());

            const payload = {
                code: (data.code as string).toUpperCase(),
                discount_type: data.discount_type,
                discount_value: parseFloat(data.discount_value as string) || 0,
                max_uses: data.max_uses ? parseInt(data.max_uses as string) : null,
                valid_until: data.valid_until ? new Date(data.valid_until as string).toISOString() : null,
                is_active: data.is_active === 'on'
            };

            let error;
            if (editingCoupon) {
                const res = await (supabase as any).from('coupons').update(payload).eq('id', editingCoupon.id);
                error = res.error;
            } else {
                const res = await (supabase as any).from('coupons').insert([payload]);
                error = res.error;
            }

            if (error) throw error;

            setIsCouponModalOpen(false);
            setEditingCoupon(null);
            await loadData();
            alert('تم حفظ الكوبون بنجاح');
        } catch (err: any) {
            console.error('Error saving coupon:', err);
            alert('فشل حفظ الكوبون: ' + (err.message || 'تأكد من عدم تكرار كود الخصم'));
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteCoupon = async (id: string) => {
        if (!window.confirm('هل أنت متأكد من حذف هذا الكوبون؟')) return;
        const { error } = await (supabase as any).from('coupons').delete().eq('id', id);
        if (error) {
            alert('فشل الحذف: ' + error.message);
        } else {
            setCoupons(coupons.filter(c => c.id !== id));
        }
    };

    if (loading) {
        return (
            <div className="flex bg-[#0d2226] justify-center items-center min-h-screen">
                <div className="w-12 h-12 border-4 border-[#cfd9cc]/20 border-t-[#cfd9cc] rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0d2226] p-8 pb-32 font-['Tajawal']" dir="rtl">
            <Helmet>
                <title>الاشتراكات والكوبونات | بصيرة AI</title>
            </Helmet>

            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[#cfd9cc]/60 hover:text-white transition-colors mb-8 font-bold">
                <ArrowRight size={20} /> العودة للوحة التحكم
            </button>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
                <div>
                    <h1 className="text-4xl font-black text-white mb-2 tracking-tight">إدارة الاشتراكات</h1>
                    <p className="text-[#cfd9cc]/60">إدارة اشتراكات العملاء في باقات الخدمات والخصومات</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-8">
                <button
                    onClick={() => setActiveTab('subscriptions')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'subscriptions' ? 'bg-[#cfd9cc] text-[#0d2226]' : 'bg-white/5 text-white hover:bg-white/10'}`}
                >
                    <Activity size={18} /> الاشتراكات النشطة
                </button>
                <button
                    onClick={() => setActiveTab('coupons')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'coupons' ? 'bg-[#cfd9cc] text-[#0d2226]' : 'bg-white/5 text-white hover:bg-white/10'}`}
                >
                    <Tag size={18} /> كوبونات الخصم
                </button>
            </div>

            {/* Subscriptions Tab */}
            {activeTab === 'subscriptions' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/10">
                        <div className="relative w-full max-w-md">
                            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                            <input
                                placeholder="بحث برقم الاشتراك أو العميل..."
                                className="w-full bg-black/40 border border-white/10 rounded-xl pr-12 pl-4 py-3 text-white outline-none focus:border-[#cfd9cc]/40"
                            />
                        </div>
                        <button
                            onClick={() => setIsSubModalOpen(true)}
                            className="flex items-center gap-2 bg-[#cfd9cc] hover:bg-white text-[#0d2226] px-6 py-3 rounded-xl font-bold transition-all shadow-lg whitespace-nowrap"
                        >
                            <Plus size={20} /> إضافة اشتراك جديد
                        </button>
                    </div>

                    <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                        <table className="w-full text-right">
                            <thead className="bg-white/5 border-b border-white/10">
                                <tr>
                                    <th className="px-6 py-4 text-sm font-bold text-white/60">العميل</th>
                                    <th className="px-6 py-4 text-sm font-bold text-white/60">الباقة</th>
                                    <th className="px-6 py-4 text-sm font-bold text-white/60">المدة</th>
                                    <th className="px-6 py-4 text-sm font-bold text-white/60">المبلغ</th>
                                    <th className="px-6 py-4 text-sm font-bold text-white/60">تاريخ الانتهاء</th>
                                    <th className="px-6 py-4 text-sm font-bold text-white/60">الحالة</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {subscriptions.map(sub => (
                                    <tr key={sub.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-white">{sub.users?.name || 'عميل محذوف'}</div>
                                            <div className="text-xs text-[#cfd9cc]/60">{sub.users?.email}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-[#cfd9cc]/80 font-bold">
                                            {sub.packages?.name_ar || 'باقة محذوفة'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-[#cfd9cc]/80">
                                            {sub.start_date} <ArrowRight size={12} className="inline mx-1" /> {sub.end_date}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-mono text-white">
                                            {sub.total_price} ر.س
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs rounded-md font-bold ${new Date(sub.end_date) < new Date() ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
                                                }`}>
                                                {sub.end_date}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 text-xs rounded-full font-bold ${sub.status === 'active' ? 'bg-[#cfd9cc] text-[#0d2226]' :
                                                sub.status === 'expired' ? 'bg-red-500/20 text-red-500' :
                                                    'bg-white/10 text-white/40'
                                                }`}>
                                                {sub.status === 'active' ? 'نشط' : sub.status === 'expired' ? 'منتهي' : sub.status === 'pending' ? 'بانتظار الدفع' : 'ملغي'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {subscriptions.length === 0 && <div className="text-center py-12 text-white/40 font-bold">لا توجد اشتراكات مسجلة.</div>}
                    </div>
                </div>
            )}

            {/* Coupons Tab */}
            {activeTab === 'coupons' && (
                <div className="space-y-6">
                    <div className="flex justify-end">
                        <button
                            onClick={() => { setEditingCoupon(null); setIsCouponModalOpen(true); }}
                            className="flex items-center gap-2 bg-[#cfd9cc] hover:bg-white text-[#0d2226] px-6 py-3 rounded-xl font-bold transition-all shadow-lg"
                        >
                            <Plus size={20} /> إنشاء كوبون جديد
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {coupons.map(coupon => (
                            <div key={coupon.id} className="glass p-6 rounded-2xl border-white/10 relative group bg-gradient-to-br from-white/5 to-transparent">
                                <div className="absolute top-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => { setEditingCoupon(coupon); setIsCouponModalOpen(true); }} className="p-2 bg-white/10 hover:bg-[#cfd9cc] text-white hover:text-[#0d2226] rounded-lg transition-colors"><Edit2 size={16} /></button>
                                    <button onClick={() => handleDeleteCoupon(coupon.id)} className="p-2 bg-white/10 hover:bg-red-500 text-white rounded-lg transition-colors"><Trash2 size={16} /></button>
                                </div>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-3xl font-black text-white font-mono tracking-wider">{coupon.code}</h3>
                                        <p className="text-[#cfd9cc] font-bold mt-1">
                                            خصم {coupon.discount_value} {coupon.discount_type === 'percentage' ? '%' : 'ر.س'}
                                        </p>
                                    </div>
                                    <span className={`px-2 py-1 text-[10px] rounded-md font-bold ${coupon.is_active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                                        {coupon.is_active ? 'نشط' : 'معطل'}
                                    </span>
                                </div>
                                <div className="space-y-2 text-xs text-white/60 mb-4 border-t border-white/5 pt-4">
                                    <div className="flex justify-between">
                                        <span>حد الاستخدام:</span>
                                        <span className="text-white font-mono">{coupon.max_uses ? `${coupon.used_count} / ${coupon.max_uses}` : `${coupon.used_count} / غير محدود`}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>صالح حتى:</span>
                                        <span className={`font-mono ${coupon.valid_until && new Date(coupon.valid_until) < new Date() ? 'text-red-400' : 'text-white'}`}>
                                            {coupon.valid_until ? new Date(coupon.valid_until).toLocaleDateString('ar-SA') : 'مدى الحياة'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {coupons.length === 0 && <div className="col-span-full text-center py-12 text-white/40 font-bold">لا توجد كوبونات مسجلة.</div>}
                    </div>
                </div>
            )}

            {/* Modals */}

            {/* Subscription Modal */}
            {isSubModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#0b1b1e] rounded-3xl p-8 max-w-2xl w-full border border-white/10 shadow-2xl relative max-h-[90vh] overflow-y-auto hide-scrollbar">
                        <button onClick={() => setIsSubModalOpen(false)} className="absolute top-6 left-6 text-white/40 hover:text-white"><X size={24} /></button>
                        <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                            <Activity className="text-[#cfd9cc]" /> إضافة اشتراك للعميل
                        </h3>

                        <div className="bg-[#cfd9cc]/10 text-[#cfd9cc] p-4 rounded-xl text-xs leading-relaxed mb-6 font-bold flex gap-3">
                            <CheckCircle className="shrink-0" size={16} />
                            إنشاء الاشتراك هنا سيقوم بإنشاء الاشتراكات وإضافة فاتورة مستحقة الدفع تلقائياً لتظهر في حساب العميل.
                        </div>

                        <form onSubmit={handleAddSubscription} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-white/60 mb-2">العميل</label>
                                <select name="client_id" required className="w-full bg-[#112a2f] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#cfd9cc]/40">
                                    <option value="">-- اختر عميلاً --</option>
                                    {customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.email})</option>)}
                                </select>
                            </div>

                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-4">
                                <h4 className="text-white font-bold mb-4">خيارات الخدمة</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-white/60 mb-2">القطاع</label>
                                        <select
                                            onChange={(e) => onIndustryChange(e.target.value)}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-[#cfd9cc]/40 text-sm"
                                        >
                                            <option value="">-- اختر --</option>
                                            {industries.map(i => <option key={i.id} value={i.id}>{i.title}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-white/60 mb-2">الخدمة الفرعية</label>
                                        <select
                                            onChange={(e) => onSubServiceChange(e.target.value)}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-[#cfd9cc]/40 text-sm"
                                            disabled={subServices.length === 0}
                                        >
                                            <option value="">-- اختر --</option>
                                            {subServices.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-white/60 mb-2">الباقة</label>
                                        <select
                                            name="package_id"
                                            required
                                            onChange={(e) => onPackageChange(e.target.value)}
                                            className="w-full bg-[#112a2f] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-[#cfd9cc]/40 text-sm"
                                            disabled={packages.length === 0}
                                        >
                                            <option value="">-- اختر الباقة --</option>
                                            {packages.map(p => <option key={p.id} value={p.id}>{p.name_ar}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-white/60 mb-2">مدة التجديد</label>
                                        <select
                                            name="duration_type"
                                            required
                                            className="w-full bg-[#112a2f] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-[#cfd9cc]/40 text-sm"
                                            disabled={durations.length === 0}
                                        >
                                            <option value="">-- اختر المدة --</option>
                                            {durations.map(d => (
                                                <option key={d.id} value={d.duration_type}>
                                                    {d.duration_type === 'monthly' ? 'شهر واحد' : d.duration_type === 'quarterly' ? '٣ أشهر' : d.duration_type === 'semi_annual' ? '٦ أشهر' : 'سنة كاملة'} - {d.price} ر.س
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-white/60 mb-2">تاريخ البداية (اختياري)</label>
                                    <input type="date" name="start_date" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#cfd9cc]/40" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-white/60 mb-2">كود خصم (اختياري)</label>
                                    <input name="coupon_code" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#cfd9cc]/40 font-mono text-left" dir="ltr" placeholder="TARGET20" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-white/60 mb-2">ملاحظات إضافية عن الاشتراك</label>
                                <textarea name="notes" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#cfd9cc]/40 h-20 resize-none" />
                            </div>

                            <button disabled={submitting} type="submit" className="w-full bg-[#cfd9cc] text-[#0d2226] font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-white transition-colors disabled:opacity-50">
                                <Save size={20} /> اعتماد الاشتراك وإنشاء الفاتورة
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Coupon Modal */}
            {isCouponModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#0b1b1e] rounded-3xl p-8 max-w-lg w-full border border-white/10 shadow-2xl relative max-h-[90vh] overflow-y-auto hide-scrollbar">
                        <button onClick={() => setIsCouponModalOpen(false)} className="absolute top-6 left-6 text-white/40 hover:text-white"><X size={24} /></button>
                        <h3 className="text-2xl font-black text-white mb-6">
                            {editingCoupon ? 'تعديل كوبون الخصم' : 'إضافة كوبون خصم'}
                        </h3>
                        <form onSubmit={handleCouponSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-white/60 mb-2">رمز الكوبون (انجليزي)</label>
                                <input name="code" required defaultValue={editingCoupon?.code} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#cfd9cc]/40 font-mono text-left text-2xl uppercase tracking-widest" dir="ltr" placeholder="KSA2030" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-white/60 mb-2">نوع الخصم</label>
                                    <select name="discount_type" required defaultValue={editingCoupon?.discount_type || 'percentage'} className="w-full bg-[#112a2f] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#cfd9cc]/40">
                                        <option value="percentage">نسبة مئوية (%)</option>
                                        <option value="fixed_amount">مبلغ ثابت (ر.س)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-white/60 mb-2">قيمة الخصم</label>
                                    <input name="discount_value" type="number" required defaultValue={editingCoupon?.discount_value || ''} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#cfd9cc]/40" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-white/60 mb-2">صالح حتى تاريخ (اختياري)</label>
                                    <input name="valid_until" type="date" defaultValue={editingCoupon?.valid_until ? editingCoupon.valid_until.split('T')[0] : ''} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#cfd9cc]/40 font-mono text-left" dir="ltr" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-white/60 mb-2">الحد الأقصى للمستخدمين (اختياري)</label>
                                    <input name="max_uses" type="number" defaultValue={editingCoupon?.max_uses || ''} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#cfd9cc]/40" placeholder="غير محدود" />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 mt-4">
                                <input type="checkbox" name="is_active" id="coupon_active" defaultChecked={editingCoupon ? editingCoupon.is_active : true} className="w-5 h-5 accent-[#cfd9cc]" />
                                <label htmlFor="coupon_active" className="text-sm font-bold text-white cursor-pointer">الكوبون فعال ويمكن استخدامه</label>
                            </div>

                            <button disabled={submitting} type="submit" className="w-full bg-[#cfd9cc] text-[#0d2226] font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-white transition-colors disabled:opacity-50 mt-4">
                                <Save size={20} /> حفظ متغيّرات الكوبون
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
