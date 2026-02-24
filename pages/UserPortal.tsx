
import React, { useState, useEffect } from 'react';
import {
  Clock, CreditCard, Cpu, Settings, Activity,
  ExternalLink, ChevronLeft, Plus, Award, Package,
  CheckCircle2, AlertCircle, ShoppingBag
} from 'lucide-react';
import { useAuth } from '../src/context/AuthContext';
import { supabase } from '../src/lib/supabase';

const UserPortal: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [activeSubscriptions, setActiveSubscriptions] = useState<any[]>([]);
  const [purchasedProducts, setPurchasedProducts] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchUserData = async () => {
      setLoading(true);

      // Fetch Profile
      const { data: prof } = await supabase.from('users').select('*').eq('id', user.id).single();
      if (prof) setProfile(prof);

      // Fetch Subscriptions
      const { data: subs } = await supabase.from('subscriptions').select('*').eq('user_id', user.id);
      if (subs) setActiveSubscriptions(subs);

      // Fetch Orders/Products
      const { data: ords } = await supabase.from('orders').select('*, order_items(*, products(*))').eq('user_id', user.id);
      if (ords) {
        // Flatten products from orders for the UI
        const flattened = ords.reduce((acc: any[], order: any) => {
          const items = order.order_items?.map((item: any) => ({
            id: item.id,
            name: item.products?.name || 'منتج غير معروف',
            price: item.price,
            status: order.status === 'paid' ? 'completed' : 'pending',
            date: new Date(order.created_at).toLocaleDateString('ar-SA')
          })) || [];
          return [...acc, ...items];
        }, []);
        setPurchasedProducts(flattened);
      }

      // Fetch Invoices
      const { data: invs } = await (supabase.from('invoices') as any).select('*').eq('user_id', user.id).order('date', { ascending: false });
      if (invs) setInvoices(invs);

      setLoading(false);
    };

    fetchUserData();
  }, [user]);

  const totalPayments = purchasedProducts.reduce((sum, p) => sum + (parseFloat(p.price) || 0), 0);
  const daysRemaining = activeSubscriptions.length > 0
    ? Math.max(0, Math.ceil((new Date(activeSubscriptions[0].end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  const points = profile?.balance || 0;

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 bg-[#0d2226]" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
          <div>
            <h1 className="text-4xl font-black text-white mb-3 tracking-tight">
              أهلاً بك مجدداً، {profile?.full_name || user?.email?.split('@')[0]}.
            </h1>
            <p className="text-[#cfd9cc]/40 text-lg">نظرة عامة على نشاطك في منصة <span className="text-[#cfd9cc] font-bold">بصيرة</span></p>
          </div>
          <div className="flex gap-4">
            <div className="glass px-8 py-4 rounded-2xl border-[#cfd9cc]/20 flex items-center gap-4">
              <div className="w-12 h-12 bg-[#cfd9cc] rounded-xl flex items-center justify-center text-[#0d2226] shadow-lg">
                <Award size={28} />
              </div>
              <div>
                <div className="text-xs font-black text-[#cfd9cc]/40 uppercase tracking-widest">النقاط المكتسبة</div>
                <div className="text-2xl font-black text-white">{points.toLocaleString()} نقطة</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          {[
            { label: 'الاشتراكات النشطة', val: activeSubscriptions.length, icon: Activity, color: 'text-emerald-400' },
            { label: 'المنتجات المشتراة', val: purchasedProducts.length, icon: ShoppingBag, color: 'text-[#cfd9cc]' },
            { label: 'إجمالي المدفوعات', val: `${totalPayments.toLocaleString()} ريال`, icon: CreditCard, color: 'text-white' },
            { label: 'الأيام المتبقية', val: `${daysRemaining} يوم`, icon: Clock, color: 'text-amber-400' },
          ].map((stat, i) => (
            <div key={i} className="glass p-8 rounded-[40px] border-white/5 relative overflow-hidden group">
              <div className="flex items-center justify-between mb-4">
                <stat.icon className={`${stat.color}`} size={24} />
                <span className="text-[10px] font-black text-[#cfd9cc]/20 uppercase tracking-widest">تحديث مباشر</span>
              </div>
              <div className={`text-4xl font-black ${stat.color}`}>{stat.val}</div>
              <div className="text-[10px] text-[#cfd9cc]/40 font-bold uppercase tracking-widest mt-2">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Subscriptions Table */}
          <div className="lg:col-span-8 space-y-10">
            <div className="glass p-10 rounded-[45px] border-white/5">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-2xl font-black text-white flex items-center gap-3">
                  <Cpu size={24} className="text-[#cfd9cc]" /> اشتراكاتي الحالية
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-right">
                  <thead>
                    <tr className="text-xs text-[#cfd9cc]/30 uppercase tracking-widest border-b border-white/5 font-black">
                      <th className="pb-6">اسم الاشتراك</th>
                      <th className="pb-6">الحالة</th>
                      <th className="pb-6">الأيام المتبقية</th>
                      <th className="pb-6">تاريخ الانتهاء</th>
                      <th className="pb-6"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {activeSubscriptions.map((sub) => (
                      <tr key={sub.id} className="group hover:bg-white/5 transition-colors">
                        <td className="py-6">
                          <div className="font-black text-white">{sub.plan_name}</div>
                          <div className="text-[10px] text-[#cfd9cc]/30">{sub.price} ريال / شهري</div>
                        </td>
                        <td className="py-6">
                          <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase ${sub.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                            }`}>
                            {sub.status === 'active' ? 'نشط' : (sub.status === 'trial' ? 'تجريبي' : 'منتهي')}
                          </span>
                        </td>
                        <td className="py-6 font-bold text-white">
                          {Math.max(0, Math.ceil((new Date(sub.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))} يوم
                        </td>
                        <td className="py-6 text-[#cfd9cc]/40 text-sm">{new Date(sub.end_date).toLocaleDateString('ar-SA')}</td>
                        <td className="py-6">
                          <button className="bg-[#cfd9cc] text-[#0d2226] px-4 py-2 rounded-xl text-xs font-black hover:bg-white transition-all shadow-glow">تجديد</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Products Table */}
            <div className="glass p-10 rounded-[45px] border-white/5">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-2xl font-black text-white flex items-center gap-3">
                  <Package size={24} className="text-[#cfd9cc]" /> المنتجات والطلبات
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-right">
                  <thead>
                    <tr className="text-xs text-[#cfd9cc]/30 uppercase tracking-widest border-b border-white/5 font-black">
                      <th className="pb-6">اسم المنتج</th>
                      <th className="pb-6">السعر</th>
                      <th className="pb-6">الحالة</th>
                      <th className="pb-6">التاريخ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {purchasedProducts.map((p) => (
                      <tr key={p.id} className="group hover:bg-white/5 transition-colors">
                        <td className="py-6 text-white font-bold">{p.name}</td>
                        <td className="py-6 text-white">{p.price} ريال</td>
                        <td className="py-6">
                          <div className={`flex items-center gap-2 ${p.status === 'completed' ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {p.status === 'completed' ? <CheckCircle2 size={16} /> : <Clock size={16} />}
                            <span className="text-xs font-black">{p.status === 'completed' ? 'مكتمل' : 'قيد التنفيذ'}</span>
                          </div>
                        </td>
                        <td className="py-6 text-[#cfd9cc]/40 text-sm">{p.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-10">
            <div className="glass p-10 rounded-[45px] border-white/5 bg-gradient-to-br from-[#1e403a]/20 to-transparent">
              <h3 className="text-xl font-black text-white mb-6">الدعم المباشر</h3>
              <p className="text-[#cfd9cc]/60 text-sm leading-relaxed mb-8">لديك استفسار؟ مدير حسابك المخصص متاح للرد على أي طلبات تقنية فوراً.</p>
              <button className="w-full py-4 rounded-2xl bg-[#cfd9cc] text-[#0d2226] font-black hover:bg-white transition-all">تحدث معنا الآن</button>
            </div>

            <div className="glass p-10 rounded-[45px] border-white/5">
              <h3 className="text-xl font-black text-white mb-6">سجل المدفوعات</h3>
              <div className="space-y-6">
                {invoices.length === 0 ? (
                  <div className="text-center text-[#cfd9cc]/20 py-4">لا توجد فواتير سابقة</div>
                ) : (
                  invoices.map((inv: any) => (
                    <div key={inv.id} className="flex justify-between items-center border-b border-white/5 pb-4 last:border-0 last:pb-0">
                      <div>
                        <div className="text-white font-bold text-sm">فاتورة #{inv.id}</div>
                        <div className="text-[10px] text-[#cfd9cc]/30 uppercase font-black tracking-widest">{new Date(inv.date).toLocaleDateString('ar-SA')}</div>
                      </div>
                      <div className="text-left">
                        <div className="text-white font-black text-sm">{inv.amount} ريال</div>
                        <button className="text-[10px] text-[#cfd9cc] font-bold underline flex items-center gap-1">تحميل PDF <ExternalLink size={10} /></button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPortal;
