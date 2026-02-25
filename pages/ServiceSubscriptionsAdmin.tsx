import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../src/lib/supabase';
import { useAuth } from '../src/context/AuthContext';
import { ArrowRight, PlusCircle, Edit3, Trash2, Save, X, Building2 } from 'lucide-react';

export default function ServiceSubscriptionsAdmin() {
    const { id: serviceId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [service, setService] = useState<any>(null);
    const [plans, setPlans] = useState<any[]>([]);
    const [packages, setPackages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
    const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState<any>(null);
    const [editingPackage, setEditingPackage] = useState<any>(null);
    const [activePlanIdForPackage, setActivePlanIdForPackage] = useState<string | null>(null);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchServiceAndPlans = async () => {
            if (!serviceId) return;

            const [{ data: serviceData }, { data: plansData }, { data: packagesData }] = await Promise.all([
                supabase.from('services').select('*').eq('id', serviceId).single(),
                supabase.from('subscription_plans').select('*').eq('service_id', serviceId).order('price_monthly', { ascending: true }),
                supabase.from('service_packages').select('*, subscription_plans!inner(service_id)').eq('subscription_plans.service_id', serviceId).order('sort_order', { ascending: true })
            ]);

            if (serviceData) setService(serviceData);
            if (plansData) setPlans(plansData);
            if (packagesData) setPackages(packagesData);
            setLoading(false);
        };

        fetchServiceAndPlans();
    }, [serviceId, user, navigate]);

    const handlePlanSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget as HTMLFormElement);
        const data = Object.fromEntries(fd.entries());

        const featuresArray = (data.features as string)?.split(',').map(f => f.trim()).filter(f => f !== '') || [];

        const planData = {
            service_id: serviceId,
            name: data.name as string,
            description: data.description as string,
            price_monthly: parseFloat(data.price_monthly as string) || 0,
            price_bimonthly: parseFloat(data.price_bimonthly as string) || 0,
            price_yearly: parseFloat(data.price_yearly as string) || 0,
            tier_level: parseInt(data.tier_level as string) || 1,
            features: featuresArray,
            is_active: data.is_active === 'on'
        };

        if (editingPlan) {
            await supabase.from('subscription_plans').update(planData).eq('id', editingPlan.id);
        } else {
            await supabase.from('subscription_plans').insert([planData]);
        }

        const { data: updatedPlans } = await supabase.from('subscription_plans').select('*').eq('service_id', serviceId).order('price_monthly', { ascending: true });
        if (updatedPlans) setPlans(updatedPlans);
        setIsPlanModalOpen(false);
    };

    const handlePackageSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget as HTMLFormElement);
        const data = Object.fromEntries(fd.entries());

        const limitsText = (data.limits as string) || '';
        const limitsObj: Record<string, string> = {};
        limitsText.split(',').forEach(item => {
            const [key, val] = item.split('=').map(s => s.trim());
            if (key && val) {
                limitsObj[key] = val;
            }
        });

        const packageData = {
            plan_id: activePlanIdForPackage,
            package_name: data.package_name as string,
            package_description: data.package_description as string,
            limits: limitsObj,
            sort_order: parseInt(data.sort_order as string) || 0
        };

        if (editingPackage) {
            await supabase.from('service_packages').update(packageData).eq('id', editingPackage.id);
        } else {
            await supabase.from('service_packages').insert([packageData]);
        }

        // Refetch packages
        const { data: updatedPackages } = await supabase.from('service_packages').select('*, subscription_plans!inner(service_id)').eq('subscription_plans.service_id', serviceId).order('sort_order', { ascending: true });
        if (updatedPackages) setPackages(updatedPackages);
        setIsPackageModalOpen(false);
    };

    const handleDeletePlan = async (id: string) => {
        if (!confirm('هل أنت متأكد من حذف هذه الباقة؟ سيتم حذف جميع الحزم التابعة لها أيضاً.')) return;
        await supabase.from('subscription_plans').delete().eq('id', id);
        setPlans(plans.filter(p => p.id !== id));
        setPackages(packages.filter(p => p.plan_id !== id));
    };

    const handleDeletePackage = async (id: string) => {
        if (!confirm('هل أنت متأكد من حذف هذه الحزمة؟')) return;
        await supabase.from('service_packages').delete().eq('id', id);
        setPackages(packages.filter(p => p.id !== id));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0d2226] flex flex-col items-center justify-center text-white font-['Tajawal']" dir="rtl">
                <div className="w-16 h-16 border-4 border-[#cfd9cc]/20 border-t-[#cfd9cc] rounded-full animate-spin mb-8"></div>
                <h2 className="text-2xl font-black animate-pulse">جاري تحميل الباقات...</h2>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0d2226] text-[#cfd9cc] font-['Tajawal']" dir="rtl">
            <header className="glass border-b border-white/5 p-8 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <button onClick={() => navigate('/admin')} className="p-4 bg-white/5 rounded-2xl text-white/40 hover:text-white hover:bg-white/10 transition-luxury">
                            <ArrowRight size={24} />
                        </button>
                        <div>
                            <h1 className="text-3xl font-black text-white mb-2">إدارة اشتراكات: {service?.title || 'جاري التحميل...'}</h1>
                            <p className="text-[#cfd9cc]/40 text-sm">أضف الباقات (Plans) والحزم (Packages) التي يمكن للعميل الاشتراك بها.</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-8 space-y-12 py-12">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-black text-white">الباقات المتاحة (Plans)</h2>
                    <button
                        onClick={() => { setEditingPlan(null); setIsPlanModalOpen(true); }}
                        className="flex items-center gap-3 px-8 py-4 bg-[#cfd9cc] text-[#0d2226] rounded-2xl font-black hover:bg-white transition-luxury shadow-glow"
                    >
                        <PlusCircle size={20} /> إضافة باقة جديدة
                    </button>
                </div>

                {plans.length === 0 ? (
                    <div className="glass p-12 rounded-[40px] border-white/5 text-center">
                        <p className="text-[#cfd9cc]/40">لم تقم بإضافة أي باقات لهذه الخدمة بعد.</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {plans.map(plan => (
                            <div key={plan.id} className="glass p-8 rounded-[40px] border-white/5 shadow-2xl space-y-8">
                                <div className="flex justify-between items-start border-b border-white/5 pb-8">
                                    <div className="flex items-center gap-6">
                                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-[#0d2226] ${plan.tier_level === 1 ? 'bg-amber-400' : plan.tier_level === 2 ? 'bg-[#cfd9cc]' : 'bg-rose-400'}`}>
                                            <Building2 size={28} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-white mb-2">{plan.name} <span className="text-sm font-bold bg-white/10 px-3 py-1 rounded-lg text-white/50 mr-4">المستوى: {plan.tier_level}</span></h3>
                                            <div className="flex gap-4 text-sm font-bold text-[#cfd9cc]/60">
                                                <span>شهري: {plan.price_monthly} ر.س</span>
                                                <span className="text-white/20">|</span>
                                                <span>نصف سنوي: {plan.price_bimonthly} ر.س</span>
                                                <span className="text-white/20">|</span>
                                                <span>سنوي: {plan.price_yearly} ر.س</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => { setEditingPlan(plan); setIsPlanModalOpen(true); }} className="p-3 bg-white/5 rounded-xl text-[#cfd9cc] hover:bg-white hover:text-[#0d2226] transition-luxury"><Edit3 size={18} /></button>
                                        <button onClick={() => handleDeletePlan(plan.id)} className="p-3 bg-red-500/10 rounded-xl text-red-400 hover:bg-red-500 hover:text-white transition-luxury"><Trash2 size={18} /></button>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-6">
                                        <h4 className="text-lg font-bold text-white">الحزم التابعة لهذه الباقة (Packages)</h4>
                                        <button
                                            onClick={() => { setEditingPackage(null); setActivePlanIdForPackage(plan.id); setIsPackageModalOpen(true); }}
                                            className="text-xs font-bold text-[#cfd9cc] border border-[#cfd9cc]/20 px-4 py-2 rounded-xl hover:bg-[#cfd9cc]/10 transition-colors"
                                        >
                                            + إضافة حزمة
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {packages.filter(pkg => pkg.plan_id === plan.id).map(pkg => (
                                            <div key={pkg.id} className="bg-white/5 border border-white/5 p-6 rounded-3xl relative group">
                                                <div className="absolute top-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => { setEditingPackage(pkg); setActivePlanIdForPackage(plan.id); setIsPackageModalOpen(true); }} className="text-[#cfd9cc]/50 hover:text-[#cfd9cc]"><Edit3 size={16} /></button>
                                                    <button onClick={() => handleDeletePackage(pkg.id)} className="text-red-400/50 hover:text-red-400"><Trash2 size={16} /></button>
                                                </div>
                                                <h5 className="font-bold text-white mb-2 pr-12">{pkg.package_name}</h5>
                                                {pkg.package_description && <p className="text-[#cfd9cc]/60 text-xs mb-3 pr-12">{pkg.package_description}</p>}
                                                {pkg.limits && Object.keys(pkg.limits as any).length > 0 && (
                                                    <ul className="text-sm font-bold text-white/50 space-y-1">
                                                        {Object.entries(pkg.limits as Record<string, string>).map(([k, v]) => (
                                                            <li key={k}>• {k}: <span className="text-[#cfd9cc]">{v}</span></li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Plan Modal */}
            {isPlanModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsPlanModalOpen(false)} />
                    <form onSubmit={handlePlanSubmit} className="relative bg-[#0d2226] border border-white/10 p-10 rounded-[40px] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-10">
                            <h2 className="text-3xl font-black text-white">{editingPlan ? 'تعديل الباقة' : 'باقة جديدة'}</h2>
                            <button type="button" onClick={() => setIsPlanModalOpen(false)} className="text-white/40 hover:text-white"><X size={28} /></button>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-white/40">اسم الباقة (مثلاً: أسياسي، متقدم)</label>
                                <input name="name" required defaultValue={editingPlan?.name} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-lg font-bold outline-none focus:border-[#cfd9cc]/40" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-white/40">وصف قصير</label>
                                <textarea name="description" defaultValue={editingPlan?.description} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-lg outline-none focus:border-[#cfd9cc]/40 h-24 resize-none" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-white/40">سعر الشهر (ر.س)</label>
                                    <input name="price_monthly" type="number" required defaultValue={editingPlan?.price_monthly} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-[#cfd9cc]/40" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-white/40">سعر النصف سنوي</label>
                                    <input name="price_bimonthly" type="number" defaultValue={editingPlan?.price_bimonthly} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-[#cfd9cc]/40" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-white/40">سعر السنة</label>
                                    <input name="price_yearly" type="number" required defaultValue={editingPlan?.price_yearly} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-[#cfd9cc]/40" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-white/40">المستوى (Tier: 1, 2, 3)</label>
                                    <select name="tier_level" defaultValue={editingPlan?.tier_level || 1} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-[#cfd9cc]/40">
                                        <option value="1">1 (الأقل / قياسي)</option>
                                        <option value="2">2 (المتوسط / الاكثر طلباً)</option>
                                        <option value="3">3 (الأعلى / الاحترافي)</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-white/40">حالة الباقة</label>
                                    <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 h-[60px]">
                                        <input type="checkbox" name="is_active" defaultChecked={editingPlan ? editingPlan.is_active : true} className="w-5 h-5 accent-[#cfd9cc] rounded" />
                                        <span className="text-white font-bold">باقة نشطة ومعروضة</span>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-white/40">مميزات أساسية للباقة (مفصولة بفاصلة)</label>
                                <input name="features" defaultValue={editingPlan?.features?.join(', ')} placeholder="دعم فني, عدد مستخدمين غیر محدود" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-lg font-bold outline-none focus:border-[#cfd9cc]/40" />
                            </div>

                            <button type="submit" className="w-full bg-[#cfd9cc] text-[#0d2226] py-5 rounded-2xl font-black text-xl mt-6 hover:bg-white transition-luxury shadow-glow">
                                حفظ الباقة
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Package Modal */}
            {isPackageModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsPackageModalOpen(false)} />
                    <form onSubmit={handlePackageSubmit} className="relative bg-[#0d2226] border border-white/10 p-10 rounded-[40px] w-full max-w-lg">
                        <div className="flex justify-between items-center mb-10">
                            <h2 className="text-2xl font-black text-white">{editingPackage ? 'تعديل الحزمة' : 'حزمة جديدة'}</h2>
                            <button type="button" onClick={() => setIsPackageModalOpen(false)} className="text-white/40 hover:text-white"><X size={24} /></button>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-white/40">عنوان الحزمة (مثلاً: الاستضافة، الدعم)</label>
                                <input name="package_name" required defaultValue={editingPackage?.package_name} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-lg font-bold outline-none focus:border-[#cfd9cc]/40" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-white/40">وصف قصير للحزمة</label>
                                <textarea name="package_description" defaultValue={editingPackage?.package_description} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-[#cfd9cc]/40 h-20 resize-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-white/40">المواصفات/الحدود (مثال: مساحة=10GB, مستخدمين=5)</label>
                                <textarea name="limits" defaultValue={editingPackage?.limits ? Object.entries(editingPackage.limits).map(([k, v]) => `${k}=${v}`).join(', ') : ''} placeholder="مساحة=10GB, دعم فني=عادي" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-[#cfd9cc]/40 h-24 resize-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-white/40">الترتيب (Sort Order)</label>
                                <input name="sort_order" type="number" defaultValue={editingPackage?.sort_order || 0} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-[#cfd9cc]/40" />
                            </div>

                            <button type="submit" className="w-full bg-[#cfd9cc] text-[#0d2226] py-5 rounded-2xl font-black text-xl mt-6 hover:bg-white transition-luxury shadow-glow">
                                حفظ الحزمة
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
