import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Trash2, Save, X, Star } from 'lucide-react';

interface SubServicePackagesManagerProps {
    subServiceId: string;
}

const SubServicePackagesManager: React.FC<SubServicePackagesManagerProps> = ({ subServiceId }) => {
    const [packages, setPackages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchPackages();
    }, [subServiceId]);

    const fetchPackages = async () => {
        setLoading(true);
        const { data: pkgs, error } = await (supabase as any)
            .from('packages')
            .select('*, durations:package_durations(*), features:package_features(*)')
            .eq('sub_service_id', subServiceId)
            .order('sort_order');

        if (!error && pkgs) {
            setPackages(pkgs.map(p => ({
                ...p,
                durations: p.durations || [],
                features: p.features?.sort((a: any, b: any) => a.sort_order - b.sort_order) || []
            })));
        }
        setLoading(false);
    };

    const handleAddPackage = async () => {
        const newPkg = {
            sub_service_id: subServiceId,
            name_ar: 'الباقة الجديدة',
            description_ar: '',
            is_popular: false,
            is_active: true,
            sort_order: packages.length
        };

        const { data, error } = await (supabase as any).from().insert([newPkg]).select().single();
        if (!error && data) {
            setPackages([...packages, { ...data, durations: [], features: [] }]);
        }
    };

    const updatePackageState = (id: string, updates: any) => {
        setPackages(packages.map(p => p.id === id ? { ...p, ...updates } : p));
    };

    const handleDeletePackage = async (id: string) => {
        if (confirm('هل أنت متأكد من حذف هذه الباقة وكل أسعارها ومميزاتها؟')) {
            await (supabase as any).from().delete().eq('id', id);
            setPackages(packages.filter(p => p.id !== id));
        }
    };

    const handleSavePackage = async (pkg: any) => {
        setSaving(true);
        // update base package
        await (supabase as any).from().update({
            name_ar: pkg.name_ar,
            is_popular: pkg.is_popular,
            is_active: pkg.is_active
        }).eq('id', pkg.id);

        // Update/Insert/Delete Durations
        // Ensure any previously existing durations not in pkg.durations are removed, or just handled.
        // For simplicity, we only Update/Insert handled durations. If they disabled trial, we should probably delete it.
        // Let's delete removed durations:
        const { data: existingDurations } = await (supabase as any).from().select('id').eq('package_id', pkg.id);
        const currentDurationIds = pkg.durations.filter((d: any) => !d.id.startsWith('temp_')).map((d: any) => d.id);
        if (existingDurations) {
            const toDelete = existingDurations.filter((ed: any) => !currentDurationIds.includes(ed.id));
            for (const d of toDelete) {
                await (supabase as any).from().delete().eq('id', d.id);
            }
        }

        for (const duration of pkg.durations) {
            if (duration.id.startsWith('temp_')) {
                const { id, ...rest } = duration;
                await (supabase as any).from().insert([{ ...rest, package_id: pkg.id }]);
            } else {
                await (supabase as any).from().update({
                    price: duration.price,
                    discount_percentage: duration.discount_percentage
                }).eq('id', duration.id);
            }
        }

        // Update/Insert Features
        for (let i = 0; i < pkg.features.length; i++) {
            const feat = pkg.features[i];
            if (feat.id.startsWith('temp_')) {
                const { id, ...rest } = feat;
                await (supabase as any).from().insert([{ ...rest, package_id: pkg.id, sort_order: i }]);
            } else {
                await (supabase as any).from().update({
                    feature_text: feat.feature_text,
                    is_highlighted: feat.is_highlighted,
                    sort_order: i
                }).eq('id', feat.id);
            }
        }

        // Refresh fully to get valid UUIDs instead of temp_ ids
        await fetchPackages();
        setSaving(false);
    };

    const addFeature = (pkgId: string) => {
        updatePackageState(pkgId, {
            features: [...packages.find(p => p.id === pkgId).features, { id: 'temp_' + Date.now(), feature_text: 'ميزة جديدة', is_highlighted: false }]
        });
    };

    const removeFeature = async (pkgId: string, featId: string) => {
        if (!featId.startsWith('temp_')) {
            await (supabase as any).from().delete().eq('id', featId);
        }
        const pkg = packages.find(p => p.id === pkgId);
        updatePackageState(pkgId, {
            features: pkg.features.filter((f: any) => f.id !== featId)
        });
    };

    const updateFeature = (pkgId: string, featId: string, updates: any) => {
        const pkg = packages.find(p => p.id === pkgId);
        updatePackageState(pkgId, {
            features: pkg.features.map((f: any) => f.id === featId ? { ...f, ...updates } : f)
        });
    };

    const generateDurations = (pkgId: string, monthlyPriceStr: string) => {
        const monthly = parseFloat(monthlyPriceStr);
        if (isNaN(monthly)) return;

        const durationsToGenerate = [
            { type: 'monthly', months: 1, price: monthly, discount: 0 },
            { type: 'quarterly', months: 3, price: Math.round(monthly * 3 * 0.90), discount: 10 },
            { type: 'semi_annual', months: 6, price: Math.round(monthly * 6 * 0.80), discount: 20 },
            { type: 'annual', months: 12, price: Math.round(monthly * 12 * 0.70), discount: 30 }
        ];

        const pkg = packages.find(p => p.id === pkgId);
        let newDurations = [...(pkg.durations || [])];

        durationsToGenerate.forEach(d => {
            const existing = newDurations.find((ex: any) => ex.duration_type === d.type);
            if (existing) {
                existing.price = d.price;
                existing.discount_percentage = d.discount;
            } else {
                newDurations.push({
                    id: 'temp_' + d.type + '_' + Date.now(),
                    duration_type: d.type,
                    months: d.months,
                    price: d.price,
                    discount_percentage: d.discount,
                    is_active: true
                });
            }
        });

        updatePackageState(pkgId, { durations: newDurations });
    };

    const updateDuration = (pkgId: string, type: string, updates: any) => {
        const pkg = packages.find(p => p.id === pkgId);
        let newDurations = [...(pkg.durations || [])];
        const existing = newDurations.find((ex: any) => ex.duration_type === type);
        if (existing) {
            Object.assign(existing, updates);
        } else {
            newDurations.push({
                id: 'temp_' + type + '_' + Date.now(),
                duration_type: type,
                months: type === 'monthly' ? 1 : type === 'quarterly' ? 3 : type === 'semi_annual' ? 6 : type === 'annual' ? 12 : 0,
                is_active: true,
                ...updates
            });
        }
        updatePackageState(pkgId, { durations: newDurations });
    };

    if (loading) return <div className="text-white/50 text-sm py-4">جاري التحميل...</div>;

    return (
        <div className="space-y-6 pt-6 border-t border-white/5">
            <div className="flex justify-between items-center">
                <h5 className="font-black text-[#cfd9cc] text-lg">الباقات</h5>
                <button
                    onClick={handleAddPackage}
                    className="text-sm font-bold text-[#0d2226] bg-[#cfd9cc] px-4 py-2 rounded-lg hover:bg-white transition-colors flex items-center gap-2"
                >
                    <Plus size={16} /> إضافة باقة
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {packages.map(pkg => (
                    <div key={pkg.id} className="bg-white/5 rounded-3xl p-6 border border-white/10 space-y-6">

                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <div className="flex-1 space-y-2">
                                    <label className="text-[10px] font-bold text-white/50 block">اسم الباقة</label>
                                    <input
                                        value={pkg.name_ar}
                                        onChange={(e) => updatePackageState(pkg.id, { name_ar: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-md outline-none focus:border-[#cfd9cc]/40 font-bold"
                                    />
                                </div>
                                <div className="flex items-center gap-2 pt-6">
                                    <button
                                        onClick={() => updatePackageState(pkg.id, { is_popular: !pkg.is_popular })}
                                        className={`p-3 rounded-xl transition-all ${pkg.is_popular ? 'bg-amber-400/20 text-amber-400 border border-amber-400/30' : 'bg-black/40 text-white/30 border border-white/10'}`}
                                        title="تحديد كالأكثر طلباً"
                                    >
                                        <Star size={20} className={pkg.is_popular ? "fill-amber-400" : ""} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <label className="text-xs font-bold text-[#cfd9cc]">الأسعار حسب المدة</label>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div className="space-y-1">
                                    <span className="text-[10px] text-white/40">تجربة مجانية (7 أيام)</span>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const hasTrial = pkg.durations?.some((d: any) => d.duration_type === 'trial');
                                            if (hasTrial) {
                                                // If it has temp_, just filter it out. If it's saved, we might want to delete it or set is_active false. 
                                                // Simple filter for now, updatePackageState will handle updates
                                                updatePackageState(pkg.id, { durations: pkg.durations.filter((d: any) => d.duration_type !== 'trial') });
                                            } else {
                                                updateDuration(pkg.id, 'trial', { price: 0, discount_percentage: 0 });
                                            }
                                        }}
                                        className={`w-full text-xs py-2 rounded-lg border transition-all ${pkg.durations?.some((d: any) => d.duration_type === 'trial') ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 font-bold' : 'bg-black/40 text-white/50 border-white/10'}`}
                                    >
                                        {pkg.durations?.some((d: any) => d.duration_type === 'trial') ? 'مفعلة' : 'تفعيل التجربة'}
                                    </button>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] text-white/40">شهري</span>
                                    <input
                                        type="number"
                                        placeholder="السعر (ريال)"
                                        value={pkg.durations?.find((d: any) => d.duration_type === 'monthly')?.price || ''}
                                        onChange={(e) => updateDuration(pkg.id, 'monthly', { price: e.target.value })}
                                        onBlur={(e) => generateDurations(pkg.id, e.target.value)}
                                        className="w-full bg-black/40 border border-[#cfd9cc]/20 rounded-lg px-3 py-2 text-white outline-none focus:border-[#cfd9cc]"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] text-white/40">ربع سنوي (ش)</span>
                                    <div className="flex gap-1">
                                        <input
                                            type="number"
                                            placeholder="السعر"
                                            value={pkg.durations?.find((d: any) => d.duration_type === 'quarterly')?.price || ''}
                                            onChange={(e) => updateDuration(pkg.id, 'quarterly', { price: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-2 text-white outline-none"
                                        />
                                        <input
                                            type="number"
                                            placeholder="خصم%"
                                            value={pkg.durations?.find((d: any) => d.duration_type === 'quarterly')?.discount_percentage || '0'}
                                            onChange={(e) => updateDuration(pkg.id, 'quarterly', { discount_percentage: e.target.value })}
                                            className="w-16 bg-black/40 border border-white/10 rounded-lg px-1 py-2 text-white outline-none min-w-[50px] text-center"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] text-white/40">نصف سنوي (ش)</span>
                                    <div className="flex gap-1">
                                        <input
                                            type="number"
                                            placeholder="السعر"
                                            value={pkg.durations?.find((d: any) => d.duration_type === 'semi_annual')?.price || ''}
                                            onChange={(e) => updateDuration(pkg.id, 'semi_annual', { price: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-2 text-white outline-none"
                                        />
                                        <input
                                            type="number"
                                            placeholder="خصم%"
                                            value={pkg.durations?.find((d: any) => d.duration_type === 'semi_annual')?.discount_percentage || '0'}
                                            onChange={(e) => updateDuration(pkg.id, 'semi_annual', { discount_percentage: e.target.value })}
                                            className="w-16 bg-black/40 border border-white/10 rounded-lg px-1 py-2 text-white outline-none min-w-[50px] text-center"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] text-white/40">سنوي (ش)</span>
                                    <div className="flex gap-1">
                                        <input
                                            type="number"
                                            placeholder="السعر"
                                            value={pkg.durations?.find((d: any) => d.duration_type === 'annual')?.price || ''}
                                            onChange={(e) => updateDuration(pkg.id, 'annual', { price: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-2 text-white outline-none"
                                        />
                                        <input
                                            type="number"
                                            placeholder="خصم%"
                                            value={pkg.durations?.find((d: any) => d.duration_type === 'annual')?.discount_percentage || '0'}
                                            onChange={(e) => updateDuration(pkg.id, 'annual', { discount_percentage: e.target.value })}
                                            className="w-16 bg-black/40 border border-white/10 rounded-lg px-1 py-2 text-white outline-none min-w-[50px] text-center"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 pt-4 border-t border-white/5">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-bold text-[#cfd9cc]">المميزات</label>
                                <button
                                    onClick={() => addFeature(pkg.id)}
                                    className="text-[10px] px-2 py-1 bg-white/5 rounded text-white/50 hover:text-white"
                                >
                                    + ميزة
                                </button>
                            </div>
                            <div className="space-y-2">
                                {pkg.features?.map((feat: any) => (
                                    <div key={feat.id} className="flex items-center gap-2">
                                        <input
                                            value={feat.feature_text}
                                            onChange={(e) => updateFeature(pkg.id, feat.id, { feature_text: e.target.value })}
                                            className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none"
                                        />
                                        <button
                                            onClick={() => updateFeature(pkg.id, feat.id, { is_highlighted: !feat.is_highlighted })}
                                            className={`text-[10px] px-2 py-2 rounded-lg transition-colors min-w-[60px] ${feat.is_highlighted ? 'bg-[#cfd9cc] text-[#0d2226]' : 'bg-white/5 text-white/50'}`}
                                        >
                                            مميزة
                                        </button>
                                        <button onClick={() => removeFeature(pkg.id, feat.id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-white/5">
                            <button
                                onClick={() => handleDeletePackage(pkg.id)}
                                className="text-sm font-bold text-red-400 hover:text-red-300 flex items-center gap-2"
                            >
                                <Trash2 size={16} /> حذف الباقة
                            </button>
                            <button
                                onClick={() => handleSavePackage(pkg)}
                                disabled={saving}
                                className="text-sm font-bold text-[#cfd9cc] bg-[#cfd9cc]/10 px-6 py-2 rounded-xl hover:bg-[#cfd9cc] hover:text-[#0d2226] transition-colors flex items-center gap-2"
                            >
                                <Save size={16} /> {saving ? 'جاري الحفظ...' : 'حفظ الباقة'}
                            </button>
                        </div>

                    </div>
                ))}
                {packages.length === 0 && (
                    <div className="col-span-1 lg:col-span-2 text-center py-10 bg-white/5 rounded-3xl border border-white/10 border-dashed">
                        <span className="text-white/40">لا توجد باقات حالياً. استخدم رز (إضافة باقة) للبدء.</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubServicePackagesManager;
