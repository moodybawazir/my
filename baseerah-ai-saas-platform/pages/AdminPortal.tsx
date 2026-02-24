
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, DollarSign, Search, Plus, Edit3, Trash2, 
  PlusCircle, CheckCircle2, Settings, BarChart3, 
  Activity, Package, FileText, Layout as LayoutIcon, 
  Save, X, Download, Filter, TrendingUp, AlertCircle,
  ShoppingCart, Layers, Globe, Image as ImageIcon, Power, ChevronRight, LayoutDashboard,
  Cpu
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { Link } from 'react-router-dom';

const STORAGE_KEYS = {
  HOME: 'baseerah_home_content',
  ABOUT: 'baseerah_about_content',
  PRODUCTS: 'baseerah_products_data',
  SERVICES: 'baseerah_services_data',
  CUSTOMERS: 'baseerah_customers',
  INVOICES: 'baseerah_invoices',
  SETTINGS: 'baseerah_settings'
};

const AdminPortal: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<'dashboard' | 'content' | 'customers' | 'invoices' | 'settings'>('dashboard');
  const [contentTab, setContentTab] = useState<'home' | 'about' | 'services' | 'products'>('home');
  const [isSaved, setIsSaved] = useState(false);
  
  // -- Data States --
  const [customers, setCustomers] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [homeData, setHomeData] = useState<any>({});
  const [aboutData, setAboutData] = useState<any>({});
  const [settings, setSettings] = useState<any>({});
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'customer' | 'product' | 'service'>('customer');
  const [editingItem, setEditingItem] = useState<any>(null);

  const openModal = (type: 'customer' | 'product' | 'service', item: any = null) => {
    setModalType(type);
    setEditingItem(item);
    setIsModalOpen(true);
  };

  // -- Load Data --
  useEffect(() => {
    const load = (key: string, def: any) => {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : def;
    };

    setCustomers(load(STORAGE_KEYS.CUSTOMERS, [
      { id: '1', name: 'أحمد القحطاني', email: 'ahmed@saudi.com', phone: '0501112233', status: 'active', balance: 450, usedFreeService: true, subscriptionCompleted: true, registrationDate: '2024-01-10' },
      { id: '2', name: 'نورة السبيعي', email: 'noura@saudi.com', phone: '0554445566', status: 'active', balance: 0, usedFreeService: true, subscriptionCompleted: false, registrationDate: '2024-02-05' },
      { id: '3', name: 'شركة أفق للتقنية', email: 'ceo@ofuq.sa', phone: '0112223334', status: 'disabled', balance: 12500, usedFreeService: false, subscriptionCompleted: true, registrationDate: '2023-12-15' },
    ]));

    setInvoices(load(STORAGE_KEYS.INVOICES, [
      { id: 'INV-7701', userName: 'أحمد القحطاني', amount: 1500, status: 'paid', date: '2024-02-01', dueDate: '2024-02-15' },
      { id: 'INV-7702', userName: 'شركة أفق للتقنية', amount: 12500, status: 'pending', date: '2024-02-10', dueDate: '2024-02-24' },
      { id: 'INV-7703', userName: 'نورة السبيعي', amount: 850, status: 'overdue', date: '2024-01-20', dueDate: '2024-02-03' },
    ]));

    setProducts(load(STORAGE_KEYS.PRODUCTS, [
      { id: 'p1', title: 'كتاب أتمتة العقار', price: '٣٥٠ ريال', category: 'كتب رقمية', desc: 'الدليل السعودي لأتمتة المكاتب العقارية.', image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=400', icon: 'BookOpen' }
    ]));

    setServices(load(STORAGE_KEYS.SERVICES, [
      { id: 'ecommerce', title: 'تجارة إلكترونية ذكية', icon: 'ShoppingCart', desc: 'بوتات متكاملة لإدارة وخدمة المتاجر الإلكترونية بذكاء.', price: '٩٠٠ ريال', category: 'تجارة' },
      { id: 'accounting', title: 'أتمتة المحاسبة والمالية', icon: 'Calculator', desc: 'أتمتة القيود والفوترة والتحليل المالي المتقدم.', price: '١,٥٠٠ ريال', category: 'مالية' },
      { id: 'real-estate', title: 'عقارات بصيرة الرقمية', icon: 'Building2', desc: 'حلول بصرية وبرمجية متطورة لقطاع العقارات الفاخرة.', price: '٢,٠٠٠ ريال', category: 'عقارات' }
    ]));

    setHomeData(load(STORAGE_KEYS.HOME, {
      heroTitle: 'رؤية ذكية تتحرك معك.',
      heroSubtitle: 'بصيرة هي منصة الأتمتة الرائدة التي تجمع بين الذكاء الاصطناعي السيادي والحلول التقنية المتطورة لتمكين أعمالك.',
    }));

    setSettings(load(STORAGE_KEYS.SETTINGS, {
      siteName: 'بصيرة AI',
      contactEmail: 'mohammad@baseerah.ai',
      contactPhone: '0500000000',
      address: 'مكة المكرمة، المملكة العربية السعودية'
    }));
  }, []);

  const handleSaveData = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const chartData = [
    { name: 'يناير', sales: 4200, users: 45 },
    { name: 'فبراير', sales: 5800, users: 52 },
    { name: 'مارس', sales: 8900, users: 78 },
    { name: 'أبريل', sales: 7400, users: 65 },
  ];

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget as HTMLFormElement);
    const data = Object.fromEntries(fd.entries());
    
    if (modalType === 'customer') {
      const updated = editingItem 
        ? customers.map(c => c.id === editingItem.id ? { ...c, ...data } : c)
        : [...customers, { ...data, id: Date.now().toString(), registrationDate: new Date().toISOString().split('T')[0], balance: 0 }];
      setCustomers(updated);
      handleSaveData(STORAGE_KEYS.CUSTOMERS, updated);
    } else if (modalType === 'product') {
      const updated = editingItem 
        ? products.map(p => p.id === editingItem.id ? { ...p, ...data } : p)
        : [...products, { ...data, id: Date.now().toString() }];
      setProducts(updated);
      handleSaveData(STORAGE_KEYS.PRODUCTS, updated);
    } else if (modalType === 'service') {
      const updated = editingItem 
        ? services.map(s => s.id === editingItem.id ? { ...s, ...data } : s)
        : [...services, { ...data, id: Date.now().toString() }];
      setServices(updated);
      handleSaveData(STORAGE_KEYS.SERVICES, updated);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="flex h-screen bg-[#0d2226] text-[#cfd9cc] overflow-hidden font-['Tajawal']" dir="rtl">
      
      {/* --- SIDEBAR (Fixed & Fluid) --- */}
      <aside className="w-20 md:w-80 glass border-l border-white/5 flex flex-col p-4 md:p-10 z-50 transition-all">
        <div className="flex items-center gap-4 mb-16 group cursor-pointer">
          <div className="p-3 bg-[#cfd9cc] rounded-2xl text-[#0d2226] shadow-glow group-hover:rotate-12 transition-luxury">
            <Cpu size={24} />
          </div>
          <span className="hidden md:block text-2xl font-black tracking-tighter text-white">بصيرة أدمن</span>
        </div>

        <nav className="space-y-4 flex-grow">
          {[
            { id: 'dashboard', label: 'مركز القيادة', icon: LayoutDashboard },
            { id: 'customers', label: 'إدارة العملاء', icon: Users },
            { id: 'invoices', label: 'الفواتير', icon: FileText },
            { id: 'content', label: 'إدارة المحتوى', icon: Layers },
            { id: 'settings', label: 'الإعدادات', icon: Settings },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id as any)}
              className={`w-full flex items-center gap-5 px-5 py-4 rounded-2xl transition-luxury ${
                activeMenu === item.id 
                  ? 'bg-[#cfd9cc] text-[#0d2226] shadow-glow font-black' 
                  : 'text-white/40 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon size={22} />
              <span className="hidden md:block text-sm font-bold">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="pt-8 border-t border-white/5 space-y-8">
          <div className="flex items-center gap-4 px-2">
            <div className="w-12 h-12 bg-gradient-to-br from-[#cfd9cc] to-[#1e403a] rounded-2xl flex items-center justify-center text-[#0d2226] font-black border border-white/10 shadow-xl">م</div>
            <div className="hidden md:block">
              <div className="text-sm font-black text-white leading-none">محمد المدير</div>
              <div className="text-[9px] text-[#cfd9cc]/40 font-bold mt-2 flex items-center gap-1.5 uppercase tracking-widest">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> متصل الآن
              </div>
            </div>
          </div>
          <Link to="/" className="w-full flex items-center gap-5 px-5 py-4 rounded-2xl text-red-400/60 hover:text-red-400 hover:bg-red-400/10 transition-luxury">
            <Power size={22} />
            <span className="hidden md:block text-sm font-bold">تسجيل خروج</span>
          </Link>
        </div>
      </aside>

      {/* --- MAIN STAGE --- */}
      <main className="flex-1 overflow-y-auto p-6 md:p-16 bg-gradient-to-br from-[#0d2226] to-[#081618]">
        
        {isSaved && (
          <div className="fixed top-12 left-1/2 -translate-x-1/2 md:left-16 md:translate-x-0 bg-emerald-500 text-[#0d2226] px-10 py-5 rounded-2xl font-black shadow-glow-strong z-[100] animate-in slide-in-from-top-10">
            تم تحديث النظام يا محمد!
          </div>
        )}

        {/* --- 1. DASHBOARD --- */}
        {activeMenu === 'dashboard' && (
          <div className="space-y-16 animate-in fade-in duration-700">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div>
                <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter">مركز القيادة</h2>
                <p className="text-[#cfd9cc]/40 mt-4 font-medium text-lg">تحليلات المنصة وحالة النمو اللحظية.</p>
              </div>
              <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl text-[10px] font-black text-[#cfd9cc] uppercase tracking-widest">
                Last Refresh: {new Date().toLocaleTimeString()}
              </div>
            </header>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              {[
                { label: 'المبيعات', val: '٨٤.٢ ألف', icon: DollarSign, color: 'text-emerald-400' },
                { label: 'العملاء', val: customers.length, icon: Users, color: 'text-blue-400' },
                { label: 'فواتير', val: invoices.filter(i => i.status !== 'paid').length, icon: AlertCircle, color: 'text-amber-400' },
                { label: 'النمو', val: '+١٥٪', icon: TrendingUp, color: 'text-[#cfd9cc]' },
              ].map((stat, i) => (
                <div key={i} className="glass p-8 md:p-12 rounded-[40px] border-white/5 relative overflow-hidden group card-hover transition-luxury">
                  <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8 ${stat.color} shadow-2xl`}>
                    <stat.icon size={28} />
                  </div>
                  <div className="text-2xl md:text-5xl font-black text-white mb-2">{stat.val}</div>
                  <div className="text-[9px] font-bold text-[#cfd9cc]/20 uppercase tracking-[0.3em]">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
              <div className="lg:col-span-8 glass p-10 md:p-16 rounded-[60px] border-white/5">
                 <h3 className="text-2xl font-black text-white mb-12 flex items-center gap-4">
                   <Activity className="text-[#cfd9cc]" /> إحصائيات المبيعات السنوية
                 </h3>
                 <div className="h-[350px] w-full">
                   <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                         <defs>
                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                               <stop offset="5%" stopColor="#cfd9cc" stopOpacity={0.2}/>
                               <stop offset="95%" stopColor="#cfd9cc" stopOpacity={0}/>
                            </linearGradient>
                         </defs>
                         <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                         <XAxis dataKey="name" stroke="#cfd9cc22" fontSize={12} tickLine={false} axisLine={false} />
                         <YAxis stroke="#cfd9cc22" fontSize={12} tickLine={false} axisLine={false} />
                         <Tooltip contentStyle={{ background: '#0d2226', border: '1px solid #ffffff08', borderRadius: '25px', boxShadow: '0 30px 60px rgba(0,0,0,0.6)' }} />
                         <Area type="monotone" dataKey="sales" stroke="#cfd9cc" fillOpacity={1} fill="url(#colorSales)" strokeWidth={4} />
                      </AreaChart>
                   </ResponsiveContainer>
                 </div>
              </div>
              <div className="lg:col-span-4 glass p-10 md:p-16 rounded-[60px] border-white/5">
                 <h3 className="text-2xl font-black text-white mb-12">توزيع النشاط</h3>
                 <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                       <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                          <XAxis dataKey="name" stroke="#cfd9cc22" fontSize={10} axisLine={false} />
                          <Tooltip cursor={{fill: '#ffffff05'}} contentStyle={{ background: '#0d2226', border: '1px solid #ffffff08', borderRadius: '20px' }} />
                          <Bar dataKey="users" fill="#1e403a" radius={[15, 15, 0, 0]} barSize={40} />
                       </BarChart>
                    </ResponsiveContainer>
                 </div>
              </div>
            </div>
          </div>
        )}

        {/* --- 2. CUSTOMERS --- */}
        {activeMenu === 'customers' && (
          <div className="space-y-12 animate-in fade-in duration-700">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">إدارة العملاء</h2>
                <p className="text-[#cfd9cc]/40 mt-4 font-medium text-lg">سجل العملاء السيادي للشركة.</p>
              </div>
              <div className="flex gap-4 w-full md:w-auto">
                 <button className="flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-5 rounded-2xl glass border-white/5 text-white font-bold hover:bg-white/5 transition-luxury group">
                    <Download size={18} className="group-hover:translate-y-1 transition-transform" /> تصدير Excel
                 </button>
                 <button onClick={() => openModal('customer')} className="flex-1 md:flex-none flex items-center justify-center gap-3 px-10 py-5 rounded-2xl bg-[#cfd9cc] text-[#0d2226] font-black shadow-glow-strong hover:bg-white transition-luxury scale-105 active:scale-95">
                    <PlusCircle size={22} /> إضافة عميل
                 </button>
              </div>
            </header>

            <div className="glass rounded-[55px] border-white/5 overflow-x-auto shadow-2xl">
              <table className="w-full text-right border-collapse min-w-[1000px]">
                <thead>
                  <tr className="bg-white/5 text-[10px] font-black text-[#cfd9cc]/30 uppercase tracking-[0.3em] border-b border-white/5">
                    <th className="p-10">العميل</th>
                    <th className="p-10">الحالة</th>
                    <th className="p-10">المستحقات</th>
                    <th className="p-10">الخدمة المجانية</th>
                    <th className="p-10">تاريخ التسجيل</th>
                    <th className="p-10 text-left">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {customers.map(c => (
                    <tr key={c.id} className="group hover:bg-white/[0.02] transition-luxury">
                      <td className="p-10">
                         <div className="font-black text-white text-xl">{c.name}</div>
                         <div className="text-sm text-[#cfd9cc]/30 mt-1">{c.email}</div>
                      </td>
                      <td className="p-10">
                         <span className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase ${c.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10' : 'bg-red-500/10 text-red-400 border border-red-500/10'}`}>
                           {c.status === 'active' ? 'نشط' : 'معطل'}
                         </span>
                      </td>
                      <td className="p-10">
                         <div className="text-2xl font-black text-white">{c.balance} <span className="text-xs text-[#cfd9cc]/40">ر.س</span></div>
                      </td>
                      <td className="p-10">
                         <div className={`flex items-center gap-3 font-bold text-sm ${c.usedFreeService ? 'text-[#cfd9cc]' : 'text-white/20'}`}>
                            {c.usedFreeService ? <CheckCircle2 size={18} className="text-emerald-500" /> : <AlertCircle size={18} />}
                            {c.usedFreeService ? 'مكتملة' : 'متاحة'}
                         </div>
                      </td>
                      <td className="p-10 text-sm font-medium text-[#cfd9cc]/40">{c.registrationDate}</td>
                      <td className="p-10 text-left">
                         <div className="flex justify-end gap-4 opacity-0 group-hover:opacity-100 transition-luxury">
                            <button onClick={() => openModal('customer', c)} className="p-4 glass rounded-2xl text-[#cfd9cc] hover:bg-white hover:text-[#0d2226] transition-luxury"><Edit3 size={18}/></button>
                            <button className="p-4 bg-red-500/10 rounded-2xl text-red-400 hover:bg-red-500 hover:text-white transition-luxury"><Trash2 size={18}/></button>
                         </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- 4. CMS CONTENT --- */}
        {activeMenu === 'content' && (
          <div className="space-y-16 animate-in fade-in duration-700">
             <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                <div>
                   <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">إدارة المحتوى</h2>
                   <p className="text-[#cfd9cc]/40 mt-4 font-medium text-lg">تعديل نصوص وصور الواجهة الأمامية.</p>
                </div>
                <div className="flex flex-wrap gap-2 bg-white/5 p-2 rounded-[35px] border border-white/10 shadow-2xl w-full md:w-auto">
                   {[
                     { id: 'home', label: 'الرئيسية', icon: LayoutDashboard },
                     { id: 'about', label: 'من نحن', icon: Globe },
                     { id: 'services', label: 'الخدمات', icon: Layers },
                     { id: 'products', label: 'المتجر', icon: ShoppingCart },
                   ].map(tab => (
                     <button
                       key={tab.id}
                       onClick={() => setContentTab(tab.id as any)}
                       className={`flex-1 md:flex-none px-8 py-4 rounded-[25px] text-xs font-black flex items-center justify-center gap-3 transition-luxury ${
                         contentTab === tab.id ? 'bg-[#cfd9cc] text-[#0d2226] shadow-glow' : 'text-white/30 hover:bg-white/5'
                       }`}
                     >
                       <tab.icon size={16} /> {tab.label}
                     </button>
                   ))}
                </div>
             </header>

             <div className="glass p-10 md:p-20 rounded-[70px] border-white/5 shadow-inner">
                {contentTab === 'home' && (
                  <div className="space-y-12 animate-in slide-in-from-right duration-700">
                     <div className="space-y-10">
                        <div className="space-y-4">
                           <label className="text-[10px] font-black text-[#cfd9cc]/20 uppercase tracking-[0.5em] mr-8">عنوان الواجهة (Hero Title)</label>
                           <textarea 
                             className="w-full bg-white/5 border border-white/10 rounded-[45px] p-10 text-white text-3xl md:text-5xl font-black outline-none focus:border-[#cfd9cc]/40 h-64 resize-none leading-tight transition-luxury"
                             value={homeData.heroTitle}
                             onChange={e => setHomeData({...homeData, heroTitle: e.target.value})}
                           />
                        </div>
                        <div className="space-y-4">
                           <label className="text-[10px] font-black text-[#cfd9cc]/20 uppercase tracking-[0.5em] mr-8">الوصف الفرعي</label>
                           <textarea 
                             className="w-full bg-white/5 border border-white/10 rounded-[35px] p-8 text-white text-lg md:text-xl font-light outline-none focus:border-[#cfd9cc]/40 h-40 resize-none leading-relaxed transition-luxury"
                             value={homeData.heroSubtitle}
                             onChange={e => setHomeData({...homeData, heroSubtitle: e.target.value})}
                           />
                        </div>
                     </div>
                     <div className="flex justify-end">
                        <button onClick={() => handleSaveData(STORAGE_KEYS.HOME, homeData)} className="w-full md:w-auto bg-[#cfd9cc] text-[#0d2226] px-16 py-6 rounded-[30px] font-black text-2xl flex items-center justify-center gap-4 hover:bg-white transition-luxury shadow-glow-strong active:scale-95">
                           <Save size={28} /> حفظ التعديلات فوراً
                        </button>
                     </div>
                  </div>
                )}

                {contentTab === 'products' && (
                  <div className="space-y-16 animate-in slide-in-from-right duration-700">
                     <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <h3 className="text-3xl font-black text-white">منتجات المتجر الرقمي</h3>
                        <button onClick={() => openModal('product')} className="w-full md:w-auto bg-[#cfd9cc] text-[#0d2226] px-10 py-5 rounded-2xl font-black flex items-center justify-center gap-3 shadow-glow hover:bg-white transition-luxury">
                           <PlusCircle size={24} /> إضافة منتج جديد
                        </button>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {products.map(p => (
                          <div key={p.id} className="glass rounded-[50px] overflow-hidden border-white/5 group relative transition-luxury hover:scale-[1.02]">
                             <div className="h-64 relative">
                                <img src={p.image} className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-luxury duration-[2s]" alt="" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0d2226] via-transparent to-transparent opacity-60" />
                                <div className="absolute top-6 left-6 flex gap-2">
                                   <button onClick={() => openModal('product', p)} className="p-3 glass-dark rounded-xl text-[#cfd9cc] hover:bg-[#cfd9cc] hover:text-[#0d2226] transition-luxury"><Edit3 size={18}/></button>
                                   <button className="p-3 bg-red-500/20 rounded-xl text-red-400 hover:bg-red-500 hover:text-white transition-luxury"><Trash2 size={18}/></button>
                                </div>
                             </div>
                             <div className="p-10">
                                <div className="px-4 py-1.5 bg-[#1e403a] text-[#cfd9cc] rounded-lg text-[10px] font-black uppercase inline-block mb-6">{p.category}</div>
                                <h4 className="text-2xl font-black text-white mb-3">{p.title}</h4>
                                <div className="text-2xl font-black text-[#cfd9cc]">{p.price}</div>
                             </div>
                          </div>
                        ))}
                     </div>
                  </div>
                )}
             </div>
          </div>
        )}

      </main>

      {/* --- CRUD MODAL (Enhanced Design) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8">
           <div className="absolute inset-0 bg-[#0d2226]/98 backdrop-blur-3xl" onClick={() => setIsModalOpen(false)} />
           <form 
            onSubmit={handleModalSubmit}
            className="relative w-full max-w-3xl bg-[#0d2226] rounded-[60px] border border-white/10 p-10 md:p-20 overflow-y-auto max-h-[90vh] glass shadow-[0_50px_100px_rgba(0,0,0,0.8)] animate-in zoom-in duration-500"
           >
              <div className="flex justify-between items-center mb-16">
                 <h2 className="text-4xl font-black text-white flex items-center gap-5 tracking-tighter">
                   {editingItem ? <Edit3 size={36} className="text-[#cfd9cc]" /> : <PlusCircle size={36} className="text-[#cfd9cc]" />} 
                   {modalType === 'customer' ? 'بيانات العميل' : 'بيانات العنصر'}
                 </h2>
                 <button type="button" onClick={() => setIsModalOpen(false)} className="p-4 bg-white/5 rounded-2xl text-white/20 hover:text-white transition-luxury"><X size={28}/></button>
              </div>
              
              <div className="space-y-12">
                 {modalType === 'customer' ? (
                   <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-white/20 uppercase tracking-widest mr-6">الاسم الكامل</label>
                        <input name="name" required defaultValue={editingItem?.name} className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-white text-xl font-bold outline-none focus:border-[#cfd9cc]/40 transition-luxury" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-white/20 uppercase tracking-widest mr-6">البريد الإلكتروني</label>
                        <input name="email" type="email" required defaultValue={editingItem?.email} className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-white text-xl font-bold outline-none focus:border-[#cfd9cc]/40 transition-luxury" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-white/20 uppercase tracking-widest mr-6">رقم الجوال</label>
                        <input name="phone" required defaultValue={editingItem?.phone} className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-white text-xl font-bold outline-none focus:border-[#cfd9cc]/40 transition-luxury text-left" dir="ltr" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-white/20 uppercase tracking-widest mr-6">الرصيد (ريال)</label>
                        <input name="balance" type="number" defaultValue={editingItem?.balance || 0} className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-white text-xl font-bold outline-none focus:border-[#cfd9cc]/40 transition-luxury" />
                      </div>
                    </div>
                   </>
                 ) : (
                   <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-white/20 uppercase tracking-widest mr-6">العنوان</label>
                        <input name="title" required defaultValue={editingItem?.title} className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-white text-xl font-bold outline-none focus:border-[#cfd9cc]/40 transition-luxury" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-white/20 uppercase tracking-widest mr-6">السعر</label>
                        <input name="price" required defaultValue={editingItem?.price} className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-white text-xl font-bold outline-none focus:border-[#cfd9cc]/40 transition-luxury" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-white/20 uppercase tracking-widest mr-6">وصف مختصر</label>
                      <textarea name="desc" defaultValue={editingItem?.desc} className="w-full bg-white/5 border border-white/10 rounded-[35px] px-8 py-6 text-white text-lg outline-none focus:border-[#cfd9cc]/40 h-40 resize-none transition-luxury" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-[#cfd9cc] uppercase tracking-widest mr-6">رابط الصورة (URL)</label>
                      <div className="relative group">
                        <ImageIcon size={22} className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#cfd9cc] transition-luxury" />
                        <input name="image" defaultValue={editingItem?.image} className="w-full bg-white/5 border border-white/10 rounded-2xl pr-16 pl-8 py-5 text-white text-sm outline-none focus:border-[#cfd9cc]/40 transition-luxury" />
                      </div>
                    </div>
                   </>
                 )}

                 <div className="pt-12 flex flex-col md:flex-row gap-6">
                    <button type="submit" className="flex-1 bg-[#cfd9cc] text-[#0d2226] py-6 rounded-[30px] font-black text-2xl hover:bg-white transition-luxury shadow-glow-strong active:scale-95">حفظ وتأكيد البيانات</button>
                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-white/5 text-white py-6 rounded-[30px] font-black text-xl border border-white/10 hover:bg-white/10 transition-luxury active:scale-95">إلغاء</button>
                 </div>
              </div>
           </form>
        </div>
      )}
    </div>
  );
};

export default AdminPortal;
