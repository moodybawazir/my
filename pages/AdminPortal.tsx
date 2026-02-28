
import React, { useState, useEffect, useMemo } from 'react';
import {
  Users, DollarSign, Search, Plus, Edit3, Trash2,
  PlusCircle, CheckCircle2, Settings, BarChart3,
  Activity, Package, FileText, Layout as LayoutIcon,
  Save, X, Download, Filter, TrendingUp, AlertCircle,
  ShoppingCart, Layers, Globe, Image as ImageIcon, Power, ChevronRight, LayoutDashboard,
  Cpu, Building2, Gift, ShoppingBag, LogOut, MessageSquare, Tag, User
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../src/lib/supabase';
import { useAuth } from '../src/context/AuthContext';
import { useStorage } from '../src/hooks/useStorage';

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
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [activeMenu, setActiveMenu] = useState<'dashboard' | 'content' | 'customers' | 'invoices' | 'settings' | 'orders' | 'messages'>('dashboard');
  const [contentTab, setContentTab] = useState<'home' | 'about' | 'services' | 'products' | 'industries'>('home');
  const [selectedIndustry, setSelectedIndustry] = useState<'real-estate' | 'restaurants' | 'medical' | 'ai-assistant' | 'ecommerce' | 'accounting'>('real-estate');
  const [industrySections, setIndustrySections] = useState<any[]>([]);
  const [industrySubServices, setIndustrySubServices] = useState<any[]>([]);
  const [loyaltyConfig, setLoyaltyConfig] = useState<any>(null);
  const [isSaved, setIsSaved] = useState(false);

  // -- Data States --
  const [customers, setCustomers] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [homeData, setHomeData] = useState<any>({});
  const [aboutData, setAboutData] = useState<any>({});
  const [settings, setSettings] = useState<any>({});
  const [orders, setOrders] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'customer' | 'product' | 'service'>('customer');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { uploadImage } = useStorage();

  useEffect(() => {
    const checkAuth = async () => {
      if (!user) {
        if (!authLoading) {
          window.location.href = window.location.origin + '/#/login';
        }
        return;
      }
      const { data, error } = await supabase.from('users').select('role').eq('id', user.id).single();
      if (error || !data || (data as any).role !== 'admin') {
        navigate('/');
      } else {
        setIsAuthorized(true);
      }
    };
    checkAuth();
  }, [user, authLoading, navigate]);

  const openModal = (type: 'customer' | 'product' | 'service', item: any = null) => {
    setModalType(type);
    setEditingItem(item);
    setIsModalOpen(true);
  };

  // -- Load Data --
  useEffect(() => {
    if (isAuthorized !== true) return;
    const fetchData = async () => {
      // Fetch Customers and exclude admins
      const { data: customersData } = await supabase.from('users').select('*').eq('role', 'user').order('created_at', { ascending: false });
      if (customersData) setCustomers(customersData);

      // Fetch Invoices
      const { data: invoicesData } = await (supabase.from('invoices') as any).select('*').order('date', { ascending: false });
      if (invoicesData) setInvoices(invoicesData);

      // Fetch Products
      const { data: productsData } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (productsData) setProducts(productsData);

      // Fetch General Services
      const { data: servicesData } = await supabase.from('services').select('*').order('created_at', { ascending: false });
      if (servicesData) setServices(servicesData);

      // Fetch Home Content
      const { data: homeContent } = await (supabase.from('content_pages') as any).select('content').eq('section_key', 'home').single();
      if (homeContent) setHomeData(homeContent.content);

      // Fetch About Content
      const { data: aboutContent } = await (supabase.from('content_pages') as any).select('content').eq('section_key', 'about').single();
      if (aboutContent) setAboutData(aboutContent.content);

      // Fetch Settings
      const { data: settingsContent } = await (supabase.from('content_pages') as any).select('content').eq('section_key', 'settings').single();
      if (settingsContent) setSettings(settingsContent.content);

      // Fetch Real Orders
      const { data: ordersData } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (ordersData) setOrders(ordersData);

      // Fetch Messages
      const { data: messagesData } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
      if (messagesData) setMessages(messagesData || []);
    };

    fetchData();
  }, []);

  // Fetch industry data when industry content tab or selected industry changes
  useEffect(() => {
    if (activeMenu === 'content' && contentTab === 'industries') {
      const fetchIndustryData = async () => {
        const { data: sections } = await (supabase.from('industry_sections') as any).select('*').eq('industry_id', selectedIndustry).order('sort_order');
        const { data: services } = await (supabase.from('industry_sub_services') as any).select('*').eq('industry_id', selectedIndustry).order('sort_order');
        const { data: loyalty } = await (supabase.from('loyalty_programs') as any).select('*').eq('industry_id', selectedIndustry).maybeSingle();

        setIndustrySections(sections || []);
        setIndustrySubServices(services || []);
        setLoyaltyConfig(loyalty || null);
      };
      fetchIndustryData();
    }
  }, [activeMenu, contentTab, selectedIndustry]);

  const handleUpdateIndustrySection = async (id: string, updates: any) => {
    const { error } = await (supabase.from('industry_sections') as any).update(updates).eq('id', id);
    if (!error) {
      setIndustrySections(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  const handleUpdateIndustryService = async (id: string, updates: any) => {
    const { error } = await (supabase.from('industry_sub_services') as any).update(updates).eq('id', id);
    if (!error) {
      setIndustrySubServices(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  const handleUpdateLoyalty = async (id: string, updates: any) => {
    const { error } = await (supabase.from('loyalty_programs') as any).update(updates).eq('id', id);
    if (!error) {
      setLoyaltyConfig((prev: any) => ({ ...prev, ...updates }));
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  const handleAddIndustrySection = async () => {
    const newSection = {
      industry_id: selectedIndustry,
      title: 'قسم جديد',
      subtitle: 'عنوان فرعي جديد',
      description: 'وصف القسم الجديد هنا...',
      section_type: 'standard',
      sort_order: industrySections.length
    };
    const { data, error } = await (supabase.from('industry_sections') as any).insert([newSection]).select();
    if (!error && data) {
      setIndustrySections(prev => [...prev, data[0]]);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  const handleDeleteIndustrySection = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا القسم؟')) return;
    const { error } = await (supabase.from('industry_sections') as any).delete().eq('id', id);
    if (!error) {
      setIndustrySections(prev => prev.filter(s => s.id !== id));
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  const handleAddIndustryService = async () => {
    const newService = {
      industry_id: selectedIndustry,
      title: 'خدمة جديدة',
      price: '٠ ر.س',
      description: 'وصف الخدمة الجديدة الأساسي...',
      image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
      sort_order: industrySubServices.length,
      is_active: true,
      has_packages: false,
      packages: []
    };
    const { data, error } = await (supabase.from('industry_sub_services') as any).insert([newService]).select();
    if (!error && data) {
      setIndustrySubServices(prev => [...prev, data[0]]);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  const handleAddSubServicePackage = async (serviceId: string, currentPackages: any[]) => {
    const newPackage = { id: crypto.randomUUID(), name: 'باقة جديدة', price: '0', features: ['ميزة 1'] };
    const updatedPackages = [...(currentPackages || []), newPackage];
    await handleUpdateIndustryService(serviceId, { packages: updatedPackages });
  };

  const handleUpdateSubServicePackage = async (serviceId: string, currentPackages: any[], packageId: string, updates: any) => {
    const updatedPackages = currentPackages.map(p => p.id === packageId ? { ...p, ...updates } : p);
    await handleUpdateIndustryService(serviceId, { packages: updatedPackages });
  };

  const handleRemoveSubServicePackage = async (serviceId: string, currentPackages: any[], packageId: string) => {
    const updatedPackages = currentPackages.filter(p => p.id !== packageId);
    await handleUpdateIndustryService(serviceId, { packages: updatedPackages });
  };

  const handleGeneralImageUpload = async (id: string | null, table: 'industry_sections' | 'industry_sub_services' | 'services' | 'home' | 'about', e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const file = files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${table}/${id ? id : 'general'}-${Math.random()}.${fileExt}`;

    // Using 'products' bucket as it's the one currently configured in Supabase based on previous tool calls
    const uploadedUrl = await uploadImage(file, 'products', table);

    if (uploadedUrl) {
      if (table === 'industry_sections' && id) {
        await handleUpdateIndustrySection(id, { image_url: uploadedUrl });
      } else if (table === 'industry_sub_services' && id) {
        await handleUpdateIndustryService(id, { image_url: uploadedUrl });
      } else if (table === 'services' && id) {
        const { error } = await supabase.from('services').update({ image_url: uploadedUrl } as any).eq('id', id);
        if (!error) {
          setServices(prev => prev.map(s => s.id === id ? { ...s, image_url: uploadedUrl } : s));
        }
      } else if (table === 'home') {
        const updated = { ...homeData, heroImage: uploadedUrl };
        setHomeData(updated);
        await handleSaveData(STORAGE_KEYS.HOME, updated);
      } else if (table === 'about') {
        const updated = { ...aboutData, mainImage: uploadedUrl };
        setAboutData(updated);
        await handleSaveData(STORAGE_KEYS.ABOUT, updated);
      }
    } else {
      alert('خطأ في تحميل الصورة!');
    }
    setIsUploading(false);
  };

  const handleDeleteGeneralService = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الخدمة المتكاملة؟')) return;
    const { error } = await (supabase.from('services') as any).delete().eq('id', id);
    if (!error) {
      setServices(prev => prev.filter(s => s.id !== id));
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  const handleDeleteIndustryService = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الخدمة؟')) return;
    const { error } = await (supabase.from('industry_sub_services') as any).delete().eq('id', id);
    if (!error) {
      setIndustrySubServices(prev => prev.filter(s => s.id !== id));
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  const handleSaveData = async (key: string, data: any) => {
    let error;
    if (key === STORAGE_KEYS.HOME || key === STORAGE_KEYS.ABOUT || key === STORAGE_KEYS.SETTINGS) {
      const sectionKey = key === STORAGE_KEYS.HOME ? 'home' : (key === STORAGE_KEYS.ABOUT ? 'about' : 'settings');
      const { error: err } = await (supabase.from('content_pages') as any).upsert({
        section_key: sectionKey,
        content: data,
        updated_at: new Date().toISOString()
      }, { onConflict: 'section_key' });
      error = err;
    } else {
      // For other keys that might still use localStorage for now, but we've migrated most
      localStorage.setItem(key, JSON.stringify(data));
    }

    if (!error) {
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    } else {
      console.error('Error saving to Supabase:', error);
      alert('خطأ في حفظ البيانات!');
    }
  };

  const chartData = useMemo(() => {
    const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    const data = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = months[d.getMonth()];

      const monthOrders = orders.filter(o => {
        const orderDate = new Date(o.created_at);
        return orderDate.getMonth() === d.getMonth() && orderDate.getFullYear() === d.getFullYear();
      });
      const sales = monthOrders.reduce((acc, curr) => acc + parseFloat(curr.total_amount || 0), 0);

      const monthUsers = customers.filter(c => {
        const userDate = new Date(c.created_at);
        return userDate.getMonth() === d.getMonth() && userDate.getFullYear() === d.getFullYear();
      });
      const users = monthUsers.length;

      data.push({ name: monthName, sales, users });
    }
    return data;
  }, [orders, customers]);

  const growth = useMemo(() => {
    if (customers.length === 0) return '+٠٪';
    const currentMonth = new Date().getMonth();
    const newThisMonth = customers.filter(c => new Date(c.created_at).getMonth() === currentMonth).length;
    const percentage = customers.length > 0 ? Math.round((newThisMonth / customers.length) * 100) : 0;
    return `+${percentage}٪`;
  }, [customers]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return null;

    setIsUploading(true);
    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file);

      if (!uploadError) {
        const { data } = supabase.storage.from('products').getPublicUrl(filePath);
        uploadedUrls.push(data.publicUrl);
      }
    }

    setIsUploading(false);
    return uploadedUrls;
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget as HTMLFormElement);
    const data = Object.fromEntries(fd.entries());

    // Convert comma-separated features to array
    const featuresArray = (data.features as string)?.split(',').map(f => f.trim()).filter(f => f !== '') || [];

    if (modalType === 'customer') {
      if (!editingItem) {
        alert("إضافة عميل من لوحة التحكم تتطلب تسجيله أولاً. الإضافة المباشرة هنا غير مدعومة بسبب متطلبات المصادقة.");
        return;
      }

      const { error } = await (supabase.from('users') as any).update({
        name: data.name,
        email: data.email,
        phone: data.phone,
        balance: parseFloat(data.balance as string) || 0,
        status: editingItem?.status || 'active'
      }).eq('id', editingItem.id);

      if (!error) {
        const { data: updated } = await supabase.from('users').select('*').eq('role', 'user').order('created_at', { ascending: false });
        if (updated) setCustomers(updated);
        setIsModalOpen(false);
      } else {
        alert('حدث خطأ أثناء تعديل بيانات العميل');
      }
    } else if (modalType === 'product') {
      const productData: any = {
        name: data.title,
        price: data.price,
        description: data.desc,
        category: data.category,
        full_description: data.full_description,
        features: featuresArray,
        ls_variant_id: data.ls_variant_id,
      };

      // Handle Image Uploads if any
      const fileInput = (e.currentTarget as HTMLFormElement).querySelector('input[type="file"]') as HTMLInputElement;
      const uploadedUrls = await handleFileUpload({ target: { files: fileInput.files } } as any);

      if (uploadedUrls && uploadedUrls.length > 0) {
        productData.images = uploadedUrls;
      } else if (editingItem) {
        productData.images = editingItem.images;
      }

      let error;
      if (editingItem) {
        const { error: err } = await (supabase.from('products') as any).update(productData).eq('id', editingItem.id);
        error = err;
      } else {
        const { error: err } = await (supabase.from('products') as any).insert([productData]);
        error = err;
      }

      if (!error) {
        // Refresh products
        const { data: updatedProducts } = await supabase.from('products').select('*').order('created_at', { ascending: false });
        if (updatedProducts) setProducts(updatedProducts);
        setIsModalOpen(false);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
      }
    } else if (modalType === 'service') {
      // Handle Image Upload if any
      const fileInput = (e.currentTarget as HTMLFormElement).querySelector('input[type="file"]') as HTMLInputElement;
      let imgUrl = editingItem?.image_url;

      if (fileInput?.files?.length) {
        const uploadedUrls = await handleFileUpload({ target: { files: fileInput.files } } as any);
        if (uploadedUrls && uploadedUrls.length > 0) {
          imgUrl = uploadedUrls[0];
        }
      }

      const { error } = await (supabase.from('services') as any).upsert({
        id: editingItem?.id || undefined,
        title: data.title,
        price: data.price,
        desc: data.desc,
        category: data.category,
        ls_variant_id: data.ls_variant_id,
        has_subscription: data.has_subscription === 'on',
        subscription_type: data.subscription_type || 'none',
        image_url: imgUrl
      });

      if (!error) {
        const { data: updated } = await supabase.from('services').select('*').order('created_at', { ascending: false });
        if (updated) setServices(updated);
        setIsModalOpen(false);
      }
    }
  };

  const totalSales = orders.reduce((acc, o) => acc + parseFloat(o.total_amount || 0), 0);
  const pendingInvoices = invoices.filter(i => i.status !== 'paid').length;

  if (authLoading || isAuthorized === null) {
    return (
      <div className="min-h-screen bg-[#0d2226] flex flex-col items-center justify-center text-white font-['Tajawal']" dir="rtl">
        <div className="w-16 h-16 border-4 border-[#cfd9cc]/20 border-t-[#cfd9cc] rounded-full animate-spin mb-8"></div>
        <h2 className="text-2xl font-black animate-pulse">جاري التحقق من الصلاحيات...</h2>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#0d2226] text-[#cfd9cc] overflow-hidden font-['Tajawal']" dir="rtl">

      {/* --- SIDEBAR --- */}
      <aside className="w-20 md:w-80 glass border-l border-white/5 flex flex-col p-4 md:p-10 z-50 transition-all">
        <div className="flex items-center gap-4 mb-16 group cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-12 h-12 flex items-center justify-center transition-luxury group-hover:rotate-6 text-[#cfd9cc]">
            <Building2 size={32} />
          </div>
          <span className="hidden md:block text-2xl font-black tracking-tighter text-white">Baseerah Admin</span>
        </div>

        <nav className="space-y-4 flex-grow">
          {[
            { id: 'dashboard', label: 'مركز القيادة', icon: LayoutDashboard },
            { id: 'orders', label: 'الطلبات (Live)', icon: ShoppingBag },
            { id: 'customers', label: 'إدارة العملاء', icon: Users },
            { id: 'invoices', label: 'الفواتير', icon: FileText },
            { id: 'content', label: 'إدارة المحتوى', icon: Layers },
            { id: 'store', label: 'إدارة المتجر', icon: Tag, path: '/admin/store' },
            { id: 'messages', label: 'رسائل التواصل', icon: MessageSquare },
            { id: 'settings', label: 'الإعدادات', icon: Settings },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => item.path ? navigate(item.path) : setActiveMenu(item.id as any)}
              className={`w-full flex items-center gap-5 px-5 py-4 rounded-2xl transition-luxury ${activeMenu === item.id
                ? 'bg-[#cfd9cc] text-[#0d2226] shadow-glow font-black'
                : 'text-white/40 hover:bg-white/5 hover:text-white'
                }`}
            >
              <item.icon size={22} />
              <span className="hidden md:block text-sm font-bold">{item.label}</span>
            </button>
          ))}
        </nav>

        <button onClick={() => navigate('/login')} className="flex items-center gap-4 px-6 py-5 text-red-400 hover:bg-red-400/10 rounded-2xl transition-all font-black text-lg mt-auto">
          <LogOut size={24} />
          تسجيل الخروج
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-12">
        {activeMenu === 'dashboard' && (
          <div className="space-y-12">
            <header className="flex justify-between items-end">
              <div>
                <h2 className="text-6xl font-black text-white mb-4">نظرة عامة</h2>
                <p className="text-2xl text-[#cfd9cc]/40 font-light">أهلاً بك محمد، إليك ملخص العمليات اليومية.</p>
              </div>
              <div className="bg-white/5 px-8 py-4 rounded-3xl border border-white/10 text-white font-black">
                {new Date().toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </header>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { label: 'المبيعات', val: `${(totalSales / 1000).toFixed(1)} ألف`, icon: DollarSign, color: 'text-emerald-400' },
                { label: 'العملاء', val: customers.length, icon: Users, color: 'text-blue-400' },
                { label: 'فواتير', val: pendingInvoices, icon: AlertCircle, color: 'text-amber-400' },
                { label: 'النمو', val: growth, icon: TrendingUp, color: 'text-[#cfd9cc]' },
              ].map((stat, i) => (
                <div key={i} className="glass p-10 rounded-[45px] border-white/5 hover:border-[#cfd9cc]/20 transition-all group">
                  <div className="flex items-center justify-between mb-8">
                    <div className={`p-4 rounded-2xl bg-white/5 ${stat.color} group-hover:scale-110 transition-transform`}>
                      <stat.icon size={28} />
                    </div>
                  </div>
                  <div className="text-4xl font-black text-white mb-2 tracking-tighter">{stat.val}</div>
                  <div className="text-xs font-black text-[#cfd9cc]/30 uppercase tracking-[0.4em]">{stat.label}</div>
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
                          <stop offset="5%" stopColor="#cfd9cc" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#cfd9cc" stopOpacity={0} />
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
                      <Tooltip cursor={{ fill: '#ffffff05' }} contentStyle={{ background: '#0d2226', border: '1px solid #ffffff08', borderRadius: '20px' }} />
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
                        <div className="font-black text-white text-xl">{c.name || c.full_name}</div>
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
                        <div className={`flex items-center gap-3 font-bold text-sm ${c.used_free_service ? 'text-[#cfd9cc]' : 'text-white/20'}`}>
                          {c.used_free_service ? <CheckCircle2 size={18} className="text-emerald-500" /> : <AlertCircle size={18} />}
                          {c.used_free_service ? 'مكتملة' : 'متاحة'}
                        </div>
                      </td>
                      <td className="p-10 text-sm font-medium text-[#cfd9cc]/40">{new Date(c.created_at).toLocaleDateString('ar-SA')}</td>
                      <td className="p-10 text-left">
                        <div className="flex justify-end gap-4 opacity-0 group-hover:opacity-100 transition-luxury">
                          <button onClick={() => openModal('customer', c)} className="p-4 glass rounded-2xl text-[#cfd9cc] hover:bg-white hover:text-[#0d2226] transition-luxury"><Edit3 size={18} /></button>
                          <button className="p-4 bg-red-500/10 rounded-2xl text-red-400 hover:bg-red-500 hover:text-white transition-luxury"><Trash2 size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- 3. MESSAGES --- */}
        {activeMenu === 'messages' && (
          <div className="space-y-12 animate-in fade-in duration-700">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">رسائل التواصل</h2>
                <p className="text-[#cfd9cc]/40 mt-4 font-medium text-lg">طلبات واستفسارات العملاء من صفحة التواصل.</p>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {messages.length === 0 ? (
                <div className="col-span-full py-24 text-center glass rounded-[55px] border-white/5 opacity-50">
                  <MessageSquare size={48} className="mx-auto text-[#cfd9cc]/30 mb-6" />
                  <h3 className="text-2xl font-black text-white">لا توجد رسائل جديدة</h3>
                </div>
              ) : (
                messages.map(msg => (
                  <div key={msg.id} className="glass p-10 rounded-[45px] border-white/5 hover:border-[#cfd9cc]/20 transition-all flex flex-col h-full shadow-2xl relative">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4 text-[#cfd9cc]">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                          <User size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-lg">{msg.sender_name}</h4>
                          <span className="text-sm opacity-60 font-light">{msg.email}</span>
                        </div>
                      </div>
                      <span className="text-xs font-black text-[#cfd9cc]/40 bg-white/5 px-4 py-2 rounded-xl">
                        {new Date(msg.created_at).toLocaleDateString('ar-SA')}
                      </span>
                    </div>
                    <div className="flex-grow">
                      <p className="text-[#cfd9cc]/70 text-base leading-relaxed whitespace-pre-wrap bg-black/20 p-6 rounded-3xl border border-white/5 flex-grow font-light">
                        {msg.message}
                      </p>
                    </div>
                  </div>
                ))
              )}
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
                  { id: 'services', label: 'الخدمات العامة', icon: Layers },
                  { id: 'industries', label: 'إدارة القطاعات (متقدم)', icon: Building2 },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setContentTab(tab.id as any)}
                    className={`flex-1 md:flex-none px-8 py-4 rounded-[25px] text-xs font-black flex items-center justify-center gap-3 transition-luxury ${contentTab === tab.id ? 'bg-[#cfd9cc] text-[#0d2226] shadow-glow' : 'text-white/30 hover:bg-white/5'
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
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-[#cfd9cc]/20 uppercase tracking-[0.5em] mr-8">عنوان الواجهة (Hero Title)</label>
                        <textarea
                          className="w-full bg-white/5 border border-white/10 rounded-[45px] p-10 text-white text-3xl md:text-5xl font-black outline-none focus:border-[#cfd9cc]/40 h-64 resize-none leading-tight transition-luxury"
                          value={homeData.heroTitle}
                          onChange={e => setHomeData({ ...homeData, heroTitle: e.target.value })}
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-[#cfd9cc]/20 uppercase tracking-[0.5em] mr-8">صورة الواجهة (Hero Image)</label>
                        <div className="relative h-64 glass rounded-[45px] border-white/5 overflow-hidden group/img">
                          {homeData.heroImage ? (
                            <img src={homeData.heroImage} className="w-full h-full object-cover transition-all group-hover/img:scale-110" alt="" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white/20 font-black">لا توجد صورة واجهة</div>
                          )}
                          <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/img:opacity-100 cursor-pointer transition-all">
                            <Plus className="text-[#cfd9cc]" size={48} />
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleGeneralImageUpload(null, 'home', e)} />
                          </label>
                          {isUploading && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                              <div className="w-12 h-12 border-4 border-[#cfd9cc] border-t-transparent rounded-full animate-spin" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-[#cfd9cc]/20 uppercase tracking-[0.5em] mr-8">وصف الأقسام الإحصائية (Stats)</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {(homeData.stats || [
                          { label: 'دعم فني ذكي', icon: 'Headset', val: '٢٤/٧' },
                          { label: 'تغطية عالمية', icon: 'Globe', val: '١٠٠٪' },
                          { label: 'دقة البيانات', icon: 'Cloud', val: '٩٩.٩٪' },
                          { label: 'ترابط الأنظمة', icon: 'Network', val: 'آمن' }
                        ]).map((stat: any, idx: number) => (
                          <div key={idx} className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                            <input
                              className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-2 text-white font-bold"
                              value={stat.label}
                              onChange={e => {
                                const newStats = [...(homeData.stats || [])];
                                newStats[idx] = { ...stat, label: e.target.value };
                                setHomeData({ ...homeData, stats: newStats });
                              }}
                              placeholder="العنوان (مثلاً: دعم فني)"
                            />
                            <div className="flex gap-4">
                              <input
                                className="flex-1 bg-black/20 border border-white/5 rounded-xl px-4 py-2 text-[#cfd9cc]"
                                value={stat.val}
                                onChange={e => {
                                  const newStats = [...(homeData.stats || [])];
                                  newStats[idx] = { ...stat, val: e.target.value };
                                  setHomeData({ ...homeData, stats: newStats });
                                }}
                                placeholder="القيمة"
                              />
                              <input
                                className="flex-1 bg-black/20 border border-white/5 rounded-xl px-4 py-2 text-[#cfd9cc]/40 text-xs font-mono"
                                value={stat.icon}
                                onChange={e => {
                                  const newStats = [...(homeData.stats || [])];
                                  newStats[idx] = { ...stat, icon: e.target.value };
                                  setHomeData({ ...homeData, stats: newStats });
                                }}
                                placeholder="Icon Name"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button onClick={() => handleSaveData(STORAGE_KEYS.HOME, homeData)} className="w-full md:w-auto bg-[#cfd9cc] text-[#0d2226] px-16 py-6 rounded-[30px] font-black text-2xl flex items-center justify-center gap-4 hover:bg-white transition-luxury shadow-glow-strong active:scale-95">
                      <Save size={28} /> حفظ بيانات الرئيسية
                    </button>
                  </div>
                </div>
              )}

              {contentTab === 'about' && (
                <div className="space-y-12 animate-in slide-in-from-right duration-700">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="space-y-8">
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-[#cfd9cc]/20 uppercase tracking-[0.5em] mr-8">المهمة (Mission)</label>
                        <textarea
                          className="w-full bg-white/5 border border-white/10 rounded-[35px] p-8 text-white text-lg outline-none focus:border-[#cfd9cc]/40 h-32 resize-none transition-luxury"
                          value={aboutData.mission}
                          onChange={e => setAboutData({ ...aboutData, mission: e.target.value })}
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-[#cfd9cc]/20 uppercase tracking-[0.5em] mr-8">الرؤية (Vision)</label>
                        <textarea
                          className="w-full bg-white/5 border border-white/10 rounded-[35px] p-8 text-white text-lg outline-none focus:border-[#cfd9cc]/40 h-32 resize-none transition-luxury"
                          value={aboutData.vision}
                          onChange={e => setAboutData({ ...aboutData, vision: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-[#cfd9cc]/20 uppercase tracking-[0.5em] mr-8">الصورة التعريفية (Main Image)</label>
                      <div className="relative h-full min-h-[300px] glass rounded-[50px] border-white/5 overflow-hidden group/img">
                        {aboutData.mainImage ? (
                          <img src={aboutData.mainImage} className="w-full h-full object-cover transition-all group-hover/img:scale-105" alt="" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/20 font-black">لا توجد صورة تعريفية</div>
                        )}
                        <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/img:opacity-100 cursor-pointer transition-all">
                          <Plus className="text-[#cfd9cc]" size={48} />
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleGeneralImageUpload(null, 'about', e)} />
                        </label>
                        {isUploading && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <div className="w-12 h-12 border-4 border-[#cfd9cc] border-t-transparent rounded-full animate-spin" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-[#cfd9cc]/20 uppercase tracking-[0.5em] mr-8">دقة الأتمتة (مثلاً: ١٠٠٪)</label>
                    <input
                      className="w-full md:w-64 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-3xl font-black outline-none focus:border-[#cfd9cc]/40 transition-luxury"
                      value={aboutData.accuracy}
                      onChange={e => setAboutData({ ...aboutData, accuracy: e.target.value })}
                    />
                  </div>

                  <div className="space-y-6 pt-10 border-t border-white/5">
                    <label className="text-[10px] font-black text-[#cfd9cc]/20 uppercase tracking-[0.5em] mr-8">لماذا يختارنا القادة (Why Choose Us)</label>
                    <div className="grid grid-cols-1 gap-6">
                      {(aboutData.whyChooseUs || []).map((item: any, idx: number) => (
                        <div key={idx} className="p-8 bg-white/5 rounded-[40px] border border-white/10 space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                              <label className="text-xs font-bold text-white/30">العنوان</label>
                              <input
                                className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-white font-bold"
                                value={item.title}
                                onChange={e => {
                                  const newList = [...aboutData.whyChooseUs];
                                  newList[idx] = { ...item, title: e.target.value };
                                  setAboutData({ ...aboutData, whyChooseUs: newList });
                                }}
                              />
                            </div>
                            <div className="space-y-3">
                              <label className="text-xs font-bold text-white/30">Icon Name</label>
                              <input
                                className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-[#cfd9cc] font-mono"
                                value={item.icon}
                                onChange={e => {
                                  const newList = [...aboutData.whyChooseUs];
                                  newList[idx] = { ...item, icon: e.target.value };
                                  setAboutData({ ...aboutData, whyChooseUs: newList });
                                }}
                              />
                            </div>
                          </div>
                          <div className="space-y-3">
                            <label className="text-xs font-bold text-white/30">الوصف</label>
                            <textarea
                              className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-white/60 h-24 resize-none"
                              value={item.subtitle}
                              onChange={e => {
                                const newList = [...aboutData.whyChooseUs];
                                newList[idx] = { ...item, subtitle: e.target.value };
                                setAboutData({ ...aboutData, whyChooseUs: newList });
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button onClick={() => handleSaveData(STORAGE_KEYS.ABOUT, aboutData)} className="w-full md:w-auto bg-[#cfd9cc] text-[#0d2226] px-16 py-6 rounded-[30px] font-black text-2xl flex items-center justify-center gap-4 hover:bg-white transition-luxury shadow-glow-strong active:scale-95">
                      <Save size={28} /> حفظ بيانات "من نحن"
                    </button>
                  </div>
                </div>
              )}
              {contentTab === 'services' && (
                <div className="space-y-16 animate-in slide-in-from-right duration-700">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <h3 className="text-3xl font-black text-white">الخدمات والقطاعات العامة</h3>
                    <button onClick={() => openModal('service')} className="w-full md:w-auto bg-[#cfd9cc] text-[#0d2226] px-10 py-5 rounded-2xl font-black flex items-center justify-center gap-3 shadow-glow hover:bg-white transition-luxury">
                      <PlusCircle size={24} /> إضافة قطاع جديد
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {services.map(s => (
                      <div key={s.id} className="glass rounded-[50px] p-10 border-white/5 relative group transition-luxury hover:scale-[1.02]">
                        <div className="flex justify-between items-start mb-8">
                          <div className={`w-16 h-16 rounded-2xl ${s.color || 'bg-[#1e403a]'} flex items-center justify-center text-[#0d2226]`}>
                            <Layers size={28} />
                          </div>
                          <div className="flex gap-2">
                            {s.has_subscription && (
                              <button onClick={() => navigate(`/admin/services/${s.id}/subscriptions`)} className="p-3 bg-[#cfd9cc]/20 rounded-xl text-[#cfd9cc] hover:bg-[#cfd9cc] hover:text-[#0d2226] transition-luxury" title="إدارة الاشتراكات"><Settings size={18} /></button>
                            )}
                            <button onClick={() => openModal('service', s)} className="p-3 glass-dark rounded-xl text-[#cfd9cc] hover:bg-[#cfd9cc] hover:text-[#0d2226] transition-luxury"><Edit3 size={18} /></button>
                            <button onClick={() => handleDeleteGeneralService(s.id)} className="p-3 bg-red-500/20 rounded-xl text-red-400 hover:bg-red-500 hover:text-white transition-luxury"><Trash2 size={18} /></button>
                          </div>
                        </div>
                        <div className="px-4 py-1 bg-white/5 rounded-lg text-[10px] font-black uppercase text-[#cfd9cc]/40 inline-block mb-4">Slug: {s.category}</div>
                        <h4 className="text-2xl font-black text-white mb-4">{s.title}</h4>
                        <p className="text-[#cfd9cc]/40 text-sm leading-relaxed mb-6">{s.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {contentTab === 'industries' && (
                <div className="space-y-16 animate-in slide-in-from-right duration-700">
                  <div className="flex flex-wrap gap-4 p-2 bg-black/20 rounded-3xl border border-white/5">
                    {[
                      { id: 'real-estate', label: 'العقارات' },
                      { id: 'restaurants', label: 'المطاعم والكافيهات' },
                      { id: 'medical', label: 'المنظومة الطبية' },
                      { id: 'ai-assistant', label: 'الذكاء الاصطناعي' },
                      { id: 'ecommerce', label: 'التجارة الإلكترونية' },
                      { id: 'accounting', label: 'أتمتة الأعمال' }
                    ].map(ind => (
                      <button
                        key={ind.id}
                        onClick={() => setSelectedIndustry(ind.id as any)}
                        className={`px-8 py-3 rounded-2xl text-sm font-black transition-all ${selectedIndustry === ind.id ? 'bg-[#cfd9cc] text-[#0d2226] shadow-glow' : 'text-white/40 hover:bg-white/5'}`}
                      >
                        {ind.label}
                      </button>
                    ))}
                  </div>

                  {/* Section Management */}
                  <div className="space-y-10">
                    <div className="flex justify-between items-center">
                      <h4 className="text-2xl font-black text-white flex items-center gap-3">
                        <Layers size={22} className="text-[#cfd9cc]" /> أقسام الصفحة (Hero/Demo)
                      </h4>
                      <button
                        onClick={handleAddIndustrySection}
                        className="px-6 py-2 bg-[#cfd9cc]/10 text-[#cfd9cc] rounded-xl text-xs font-black hover:bg-[#cfd9cc] hover:text-[#0d2226] transition-all"
                      >
                        إضافة قسم +
                      </button>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                      {industrySections.map(sec => (
                        <div key={sec.id} className="bg-white/5 p-8 rounded-[40px] border border-white/5 space-y-6">
                          <div className="flex justify-between items-center text-[10px] font-black uppercase text-[#cfd9cc]/20 tracking-widest leading-none">
                            <span>Type: {sec.section_type} {sec.demo_type && `(${sec.demo_type})`}</span>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500" /> Live
                              </div>
                              <button
                                onClick={() => handleDeleteIndustrySection(sec.id)}
                                className="text-red-400 hover:text-red-300 transition-colors"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                              <div className="space-y-3">
                                <label className="text-xs font-bold text-white/30">العنوان</label>
                                <input
                                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#cfd9cc]/40 transition-all focus:bg-white/5"
                                  defaultValue={sec.title}
                                  onBlur={(e) => handleUpdateIndustrySection(sec.id, { title: e.target.value })}
                                />
                              </div>
                              <div className="space-y-3">
                                <label className="text-xs font-bold text-white/30">العنوان الفرعي</label>
                                <input
                                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#cfd9cc]/40 transition-all focus:bg-white/5"
                                  defaultValue={sec.subtitle}
                                  onBlur={(e) => handleUpdateIndustrySection(sec.id, { subtitle: e.target.value })}
                                />
                              </div>
                            </div>
                            <div className="space-y-3">
                              <label className="text-xs font-bold text-white/30">صورة القسم (رفع من جهازك)</label>
                              <div className="relative h-[155px] bg-black/40 rounded-2xl overflow-hidden border border-white/5 group/img">
                                {sec.image_url ? (
                                  <img src={sec.image_url} className="w-full h-full object-cover transition-all group-hover/img:scale-110 group-hover/img:blur-[2px]" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-white/10 italic text-sm">لا توجد صورة بعد</div>
                                )}
                                <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover/img:opacity-100 cursor-pointer transition-all">
                                  <Plus size={32} className="text-white" />
                                  <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => handleGeneralImageUpload(sec.id, 'industry_sections', e)}
                                  />
                                </label>
                                {isUploading && (
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                                    <div className="w-8 h-8 border-2 border-[#cfd9cc] border-t-transparent rounded-full animate-spin" />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <label className="text-xs font-bold text-white/30">الوصف</label>
                            <textarea
                              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#cfd9cc]/40 h-24 resize-none transition-all focus:bg-white/5"
                              defaultValue={sec.description}
                              onBlur={(e) => handleUpdateIndustrySection(sec.id, { description: e.target.value })}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Loyalty Program Config for Restaurants */}
                  {selectedIndustry === 'restaurants' && loyaltyConfig && (
                    <div className="space-y-10 p-10 bg-emerald-500/5 rounded-[50px] border border-emerald-500/10">
                      <h4 className="text-2xl font-black text-[#cfd9cc] flex items-center gap-3">
                        <Gift size={22} /> إعدادات نظام الولاء
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <label className="text-xs font-bold text-white/30">عدد الختم المطلوبة</label>
                          <input
                            type="number"
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#cfd9cc]/40"
                            defaultValue={loyaltyConfig.total_stamps}
                            onBlur={(e) => handleUpdateLoyalty(loyaltyConfig.id, { total_stamps: parseInt(e.target.value) })}
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="text-xs font-bold text-white/30">نص المكافأة</label>
                          <input
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#cfd9cc]/40"
                            defaultValue={loyaltyConfig.reward_text}
                            onBlur={(e) => handleUpdateLoyalty(loyaltyConfig.id, { reward_text: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Service Management */}
                  <div className="space-y-10">
                    <div className="flex justify-between items-center">
                      <h4 className="text-2xl font-black text-white flex items-center gap-3">
                        <Package size={22} className="text-[#cfd9cc]" /> الخدمات الفرعية
                      </h4>
                      <button
                        onClick={handleAddIndustryService}
                        className="px-6 py-2 bg-[#cfd9cc]/10 text-[#cfd9cc] rounded-xl text-xs font-black hover:bg-[#cfd9cc] hover:text-[#0d2226] transition-all"
                      >
                        إضافة خدمة +
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {industrySubServices.map(sub => (
                        <div key={sub.id} className="bg-white/5 p-8 rounded-[40px] border border-white/5 space-y-6 group">
                          <div className="flex items-center gap-6 mb-4">
                            <div className="relative w-24 h-24 bg-black/40 rounded-2xl overflow-hidden flex-shrink-0 group/img">
                              <img src={sub.image_url} className="w-full h-full object-cover transition-all group-hover/img:scale-110 group-hover/img:blur-[2px]" alt="" />
                              <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover/img:opacity-100 cursor-pointer transition-all">
                                <Plus size={24} className="text-white" />
                                <input
                                  type="file"
                                  className="hidden"
                                  accept="image/*"
                                  onChange={(e) => handleGeneralImageUpload(sub.id, 'industry_sub_services', e)}
                                />
                              </label>
                              {isUploading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                                  <div className="w-6 h-6 border-2 border-[#cfd9cc] border-t-transparent rounded-full animate-spin" />
                                </div>
                              )}
                            </div>
                            <div className="flex-grow space-y-2">
                              <div className="flex justify-between items-start">
                                <input
                                  className="bg-white/10 border-none rounded-lg px-3 py-1 text-xl font-black text-white outline-none w-full focus:bg-white/20 transition-all"
                                  placeholder="اسم الخدمة"
                                  defaultValue={sub.title}
                                  onBlur={(e) => handleUpdateIndustryService(sub.id, { title: e.target.value })}
                                />
                                <button
                                  onClick={() => handleDeleteIndustryService(sub.id)}
                                  className="text-red-400/30 hover:text-red-400 transition-colors p-2"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                              <div className="flex items-center gap-2">
                                <input
                                  className="bg-white/10 border-none rounded-lg px-3 py-1 text-[#cfd9cc] font-black outline-none w-32 focus:bg-white/20 transition-all"
                                  placeholder="السعر"
                                  defaultValue={sub.price}
                                  onBlur={(e) => handleUpdateIndustryService(sub.id, { price: e.target.value })}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <label className="text-[10px] font-black text-white/20 uppercase tracking-widest leading-none">رابط الصورة (يدوي أو تلقائي بعد الرفع)</label>
                            <input
                              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-[10px] text-white/50 outline-none focus:border-[#cfd9cc]/40 font-mono"
                              value={sub.image_url}
                              onChange={(e) => setIndustrySubServices(prev => prev.map(s => s.id === sub.id ? { ...s, image_url: e.target.value } : s))}
                              onBlur={(e) => handleUpdateIndustryService(sub.id, { image_url: e.target.value })}
                            />
                          </div>

                          {/* Packages Toggle & UI */}
                          <div className="pt-6 border-t border-white/5 space-y-6">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-black text-white">هل لها باقات؟</span>
                              <button
                                onClick={() => handleUpdateIndustryService(sub.id, { has_packages: !sub.has_packages })}
                                className={`w-14 h-7 rounded-full transition-all relative ${sub.has_packages ? 'bg-[#cfd9cc]' : 'bg-white/10 border border-white/20'}`}
                              >
                                <div className={`w-5 h-5 rounded-full transition-all absolute top-1 ${sub.has_packages ? 'left-1 bg-[#0d2226]' : 'right-1 bg-white/50'}`} />
                              </button>
                            </div>

                            {sub.has_packages && (
                              <div className="space-y-4 bg-black/20 p-6 rounded-[30px] border border-white/5">
                                <div className="flex justify-between items-center mb-4">
                                  <h5 className="font-black text-[#cfd9cc] text-sm">الباقات المتاحة</h5>
                                  <button
                                    onClick={() => handleAddSubServicePackage(sub.id, sub.packages)}
                                    className="text-xs font-bold text-[#cfd9cc] bg-[#cfd9cc]/10 px-3 py-1.5 rounded-lg hover:bg-[#cfd9cc] hover:text-[#0d2226] transition-colors flex items-center gap-1"
                                  >
                                    <Plus size={14} /> إضافة باقة
                                  </button>
                                </div>

                                <div className="space-y-4">
                                  {sub.packages && sub.packages.map((pkg: any) => (
                                    <div key={pkg.id} className="bg-white/5 p-5 rounded-2xl border border-white/5 space-y-4 relative group/pkg">
                                      <button
                                        onClick={() => handleRemoveSubServicePackage(sub.id, sub.packages, pkg.id)}
                                        className="absolute left-4 top-4 text-red-400/50 hover:text-red-400 transition-colors"
                                      >
                                        <Trash2 size={16} />
                                      </button>

                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <label className="text-[10px] font-bold text-white/30 block mb-2">اسم الباقة</label>
                                          <input
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-[#cfd9cc]/40"
                                            defaultValue={pkg.name}
                                            onBlur={(e) => handleUpdateSubServicePackage(sub.id, sub.packages, pkg.id, { name: e.target.value })}
                                          />
                                        </div>
                                        <div>
                                          <label className="text-[10px] font-bold text-white/30 block mb-2">السعر</label>
                                          <input
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-[#cfd9cc]/40 font-mono"
                                            defaultValue={pkg.price}
                                            onBlur={(e) => handleUpdateSubServicePackage(sub.id, sub.packages, pkg.id, { price: e.target.value })}
                                          />
                                        </div>
                                      </div>

                                      <div>
                                        <label className="text-[10px] font-bold text-white/30 flex justify-between items-center mb-2">
                                          <span>المميزات (نقاط تشملها)</span>
                                          <button
                                            onClick={() => handleUpdateSubServicePackage(sub.id, sub.packages, pkg.id, { features: [...(pkg.features || []), 'ميزة جديدة'] })}
                                            className="text-[#cfd9cc]/70 hover:text-[#cfd9cc] text-[10px] underline"
                                          >إضافة ميزة</button>
                                        </label>
                                        <div className="space-y-2">
                                          {(pkg.features || []).map((feat: string, idx: number) => (
                                            <div key={idx} className="flex gap-2">
                                              <input
                                                className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white/80 text-xs outline-none focus:border-[#cfd9cc]/40"
                                                defaultValue={feat}
                                                onBlur={(e) => {
                                                  const newFeats = [...pkg.features];
                                                  newFeats[idx] = e.target.value;
                                                  handleUpdateSubServicePackage(sub.id, sub.packages, pkg.id, { features: newFeats });
                                                }}
                                              />
                                              <button
                                                onClick={() => {
                                                  const newFeats = [...pkg.features];
                                                  newFeats.splice(idx, 1);
                                                  handleUpdateSubServicePackage(sub.id, sub.packages, pkg.id, { features: newFeats });
                                                }}
                                                className="p-1.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                                              ><X size={14} /></button>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                  {(!sub.packages || sub.packages.length === 0) && (
                                    <div className="text-center text-[#cfd9cc]/30 text-xs py-4">لا توجد باقات مضافة. أضف باقتك الأولى.</div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- 3. INVOICES --- */}
        {activeMenu === 'invoices' && (
          <div className="space-y-12 animate-in fade-in duration-700">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">الفواتير</h2>
                <p className="text-[#cfd9cc]/40 mt-4 font-medium text-lg">سجل المبيعات والتحصيل المالي.</p>
              </div>
            </header>

            <div className="glass rounded-[55px] border-white/5 overflow-x-auto shadow-2xl">
              <table className="w-full text-right border-collapse min-w-[1000px]">
                <thead>
                  <tr className="bg-white/5 text-[10px] font-black text-[#cfd9cc]/30 uppercase tracking-[0.3em] border-b border-white/5">
                    <th className="p-10">العميل</th>
                    <th className="p-10">المبلغ</th>
                    <th className="p-10">الحالة</th>
                    <th className="p-10">تاريخ الاستحقاق</th>
                    <th className="p-10 text-left">التفاصيل</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {invoices.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-10 text-center text-white/20 font-bold">لا توجد فواتير مسجلة</td>
                    </tr>
                  ) : (
                    invoices.map(inv => (
                      <tr key={inv.id} className="group hover:bg-white/[0.02] transition-luxury">
                        <td className="p-10">
                          <div className="font-bold text-white">{inv.user_name}</div>
                          <div className="text-xs text-[#cfd9cc]/30 mt-1">{inv.id.slice(0, 8)}...</div>
                        </td>
                        <td className="p-10">
                          <div className="text-2xl font-black text-white">{inv.amount} <span className="text-xs text-[#cfd9cc]/40">ر.س</span></div>
                        </td>
                        <td className="p-10">
                          <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase ${inv.status === 'paid' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                            {inv.status === 'paid' ? 'مدفوعة' : 'معلقة'}
                          </span>
                        </td>
                        <td className="p-10 text-sm text-[#cfd9cc]/40">{new Date(inv.due_date).toLocaleDateString('ar-SA')}</td>
                        <td className="p-10 text-left">
                          <button className="p-4 glass rounded-2xl text-[#cfd9cc] hover:bg-white hover:text-[#0d2226] transition-luxury">
                            <FileText size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- 6. SETTINGS --- */}
        {activeMenu === 'settings' && (
          <div className="space-y-12 animate-in fade-in duration-700 max-w-4xl">
            <header>
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">إعدادات المنصة</h2>
              <p className="text-[#cfd9cc]/40 mt-4 font-medium text-lg">التحكم في الهوية البصرية وإعدادات النظام.</p>
            </header>

            <div className="glass p-12 rounded-[50px] border-white/5 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-[#cfd9cc]/20 uppercase tracking-widest mr-6">اسم المنصة</label>
                  <input
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-[#cfd9cc]/40"
                    value={settings.siteName || 'بصيرة AI'}
                    onChange={e => setSettings({ ...settings, siteName: e.target.value })}
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-[#cfd9cc]/20 uppercase tracking-widest mr-6">البريد الرسمي</label>
                  <input
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-[#cfd9cc]/40"
                    value={settings.officialEmail || 'info@baseerah.ai'}
                    onChange={e => setSettings({ ...settings, officialEmail: e.target.value })}
                  />
                </div>
              </div>

              <div className="pt-8 border-t border-white/5">
                <button onClick={() => handleSaveData(STORAGE_KEYS.SETTINGS, settings)} className="w-full md:w-auto bg-[#cfd9cc] text-[#0d2226] px-12 py-5 rounded-2xl font-black text-xl hover:bg-white transition-luxury shadow-glow">
                  حفظ الإعدادات الفنية
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- 5. ORDERS (REAL DATA) --- */}
        {activeMenu === 'orders' && (
          <div className="space-y-12 animate-in fade-in duration-700">
            <header>
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">إدارة الطلبات</h2>
              <p className="text-[#cfd9cc]/40 mt-4 font-medium text-lg">الطلبات الحقيقية المسجلة في قاعدة البيانات.</p>
            </header>

            <div className="glass rounded-[55px] border-white/5 overflow-x-auto shadow-2xl">
              <table className="w-full text-right border-collapse min-w-[1000px]">
                <thead>
                  <tr className="bg-white/5 text-[10px] font-black text-[#cfd9cc]/30 uppercase tracking-[0.3em] border-b border-white/5">
                    <th className="p-10">رقم الطلب</th>
                    <th className="p-10">العميل</th>
                    <th className="p-10">المبلغ</th>
                    <th className="p-10">الحالة</th>
                    <th className="p-10">التاريخ</th>
                    <th className="p-10 text-left">التفاصيل</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-10 text-center text-white/20 font-bold">لا توجد طلبات حتى الآن</td>
                    </tr>
                  ) : (
                    orders.map((order: any) => (
                      <tr key={order.id} className="group hover:bg-white/[0.02] transition-luxury text-right">
                        <td className="p-10">
                          <div className="font-mono text-xs text-[#cfd9cc]/40 mb-1">ID: {order.id.slice(0, 8)}</div>
                          <div className="text-white font-bold text-sm">LS-#{order.ls_order_id || 'N/A'}</div>
                        </td>
                        <td className="p-10">
                          <div className="text-white font-bold">{order.user_id?.slice(0, 8)}...</div>
                        </td>
                        <td className="p-10 text-xl font-black text-white">{order.total_amount} ر.س</td>
                        <td className="p-10">
                          <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase ${order.payment_status === 'paid' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                            {order.payment_status || order.status}
                          </span>
                        </td>
                        <td className="p-10 text-sm text-[#cfd9cc]/40">{new Date(order.created_at).toLocaleDateString('ar-SA')}</td>
                        <td className="p-10 text-left">
                          <a
                            href={`https://app.lemonsqueezy.com/orders/${order.ls_order_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#cfd9cc] hover:text-white transition-colors text-xs font-bold underline"
                          >
                            عرض في LS
                          </a>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeMenu === 'messages' && (
          <div className="space-y-12 animate-in fade-in duration-700">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">رسائل التواصل</h2>
                <p className="text-[#cfd9cc]/40 mt-4 font-medium text-lg">طلبات الاستشارة والاستفسارات الواردة من الموقع.</p>
              </div>
            </header>

            <div className="glass rounded-[55px] border-white/5 overflow-x-auto shadow-2xl">
              <table className="w-full text-right border-collapse min-w-[1000px]">
                <thead>
                  <tr className="bg-white/5 text-[10px] font-black text-[#cfd9cc]/30 uppercase tracking-[0.3em] border-b border-white/5">
                    <th className="p-10">المرسل</th>
                    <th className="p-10">الرسالة</th>
                    <th className="p-10">البيانات الإضافية</th>
                    <th className="p-10">التاريخ</th>
                    <th className="p-10 text-left">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {messages.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-10 text-center text-white/20 font-bold">لا توجد رسائل حتى الآن</td>
                    </tr>
                  ) : (
                    messages.map((msg: any) => (
                      <tr key={msg.id} className="group hover:bg-white/[0.02] transition-luxury text-right">
                        <td className="p-10">
                          <div className="font-black text-white text-xl">{msg.sender_name}</div>
                          <div className="text-sm text-[#cfd9cc]/30 mt-1">{msg.email}</div>
                        </td>
                        <td className="p-10">
                          <p className="text-[#cfd9cc] text-sm leading-relaxed max-w-md line-clamp-3">{msg.message}</p>
                        </td>
                        <td className="p-10">
                          <div className="space-y-1 text-xs">
                            {msg.payload?.phone && <div className="text-emerald-400 font-bold" dir="ltr">{msg.payload.phone}</div>}
                            {msg.payload?.company && <div className="text-[#cfd9cc]/40">{msg.payload.company}</div>}
                            {msg.payload?.industry && <div className="text-[#cfd9cc]/40">{msg.payload.industry} | {msg.payload.budget}</div>}
                          </div>
                        </td>
                        <td className="p-10 text-sm text-[#cfd9cc]/40">{new Date(msg.created_at).toLocaleDateString('ar-SA')}</td>
                        <td className="p-10 text-left">
                          <div className="flex justify-end gap-4 opacity-0 group-hover:opacity-100 transition-luxury">
                            <button
                              onClick={async () => {
                                if (confirm('هل تريد حذف هذه الرسالة؟')) {
                                  const { error } = await supabase.from('messages').delete().eq('id', msg.id);
                                  if (!error) setMessages(prev => prev.filter(m => m.id !== msg.id));
                                }
                              }}
                              className="p-4 bg-red-500/10 rounded-2xl text-red-400 hover:bg-red-500 hover:text-white transition-luxury"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {/* --- CRUD MODAL (Enhanced Design) --- */}
      {
        isModalOpen && (
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
                <button type="button" onClick={() => setIsModalOpen(false)} className="p-4 bg-white/5 rounded-2xl text-white/20 hover:text-white transition-luxury"><X size={28} /></button>
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
                        <input name="title" required defaultValue={editingItem?.name || editingItem?.title} className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-white text-xl font-bold outline-none focus:border-[#cfd9cc]/40 transition-luxury" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-white/20 uppercase tracking-widest mr-6">صورة القسم/الخدمة (رفع)</label>
                        <div className="relative h-[68px] glass rounded-2xl border-white/5 overflow-hidden flex items-center px-6">
                          <input type="file" name="image_file" className="absolute inset-0 opacity-0 cursor-pointer z-10" accept="image/*" />
                          <div className="flex items-center gap-4 text-[#cfd9cc]">
                            <ImageIcon size={20} />
                            <span className="text-sm font-bold truncate">
                              {editingItem?.image_url ? 'تغيير الصورة القائمة' : 'اختر صورة للرفع'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-white/20 uppercase tracking-widest mr-6">السعر</label>
                        <input name="price" required defaultValue={editingItem?.price} className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-white text-xl font-bold outline-none focus:border-[#cfd9cc]/40 transition-luxury" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-white/20 uppercase tracking-widest mr-6">التصنيف</label>
                        <select name="category" defaultValue={editingItem?.category || 'كتب رقمية'} className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-white text-xl font-bold outline-none focus:border-[#cfd9cc]/40 transition-luxury">
                          <option value="كتب رقمية">كتب رقمية</option>
                          <option value="اشتراكات API">اشتراكات API</option>
                          <option value="حلول جاهزة">حلول جاهزة</option>
                          <option value="خدمات أخرى">خدمات أخرى</option>
                        </select>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-[#cfd9cc] uppercase tracking-widest mr-6">Lemon Squeezy Variant ID</label>
                        <input name="ls_variant_id" defaultValue={editingItem?.ls_variant_id} placeholder="e.g. 12345" className="w-full bg-white/5 border border-[#cfd9cc]/20 rounded-2xl px-8 py-5 text-white text-xl font-bold outline-none focus:border-[#cfd9cc] transition-luxury" />
                      </div>
                    </div>

                    {modalType === 'service' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-white/20 uppercase tracking-widest mr-6">تفعيل الاشتراكات؟</label>
                          <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-8 py-5 h-[68px]">
                            <input type="checkbox" name="has_subscription" defaultChecked={editingItem?.has_subscription} className="w-6 h-6 accent-[#cfd9cc] rounded" />
                            <span className="text-white text-lg font-bold">مفعل</span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-white/20 uppercase tracking-widest mr-6">نظام الاشتراك</label>
                          <select name="subscription_type" defaultValue={editingItem?.subscription_type || 'none'} className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-white text-lg font-bold outline-none focus:border-[#cfd9cc]/40 transition-luxury h-[68px]">
                            <option value="none">بدون (قياسي)</option>
                            <option value="tiered">باقات متدرجة (Tiered)</option>
                            <option value="monthly">اشتراك شهري (Monthly)</option>
                          </select>
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-white/20 uppercase tracking-widest mr-6">الخصائص (مفصولة بفاصلة)</label>
                      <input name="features" defaultValue={editingItem?.features?.join(', ')} placeholder="ميزه ١, ميزه ٢, ميزه ٣" className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-white text-xl font-bold outline-none focus:border-[#cfd9cc]/40 transition-luxury" />
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-white/20 uppercase tracking-widest mr-6">وصف مختصر</label>
                      <textarea name="desc" defaultValue={editingItem?.description || editingItem?.desc} className="w-full bg-white/5 border border-white/10 rounded-[35px] px-8 py-6 text-white text-lg outline-none focus:border-[#cfd9cc]/40 h-32 resize-none transition-luxury" />
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-white/20 uppercase tracking-widest mr-6">الوصف الكامل للمنتج</label>
                      <textarea name="full_description" defaultValue={editingItem?.full_description} className="w-full bg-white/5 border border-white/10 rounded-[35px] px-8 py-6 text-white text-lg outline-none focus:border-[#cfd9cc]/40 h-64 resize-none transition-luxury" />
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-[#cfd9cc] uppercase tracking-widest mr-6">صور المنتج (تحميل مباشر)</label>
                      <div className="relative group p-10 border-2 border-dashed border-white/10 rounded-[40px] hover:border-[#cfd9cc]/40 transition-all text-center">
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          onChange={(e) => {
                            const files = e.target.files;
                            if (files) {
                              // Visual feedback could be added here
                            }
                          }}
                        />
                        <div className="flex flex-col items-center gap-4">
                          <ImageIcon size={48} className="text-white/20" />
                          <div className="text-white/40 font-bold">
                            {isUploading ? 'جاري التحميل...' : 'اسحب الصور هنا أو اضغط للاختيار'}
                          </div>
                          <div className="text-[10px] text-white/20 uppercase tracking-widest">يدعم PNG, JPG حتى 10MB لكل صورة</div>
                        </div>
                      </div>
                      {editingItem?.images && editingItem.images.length > 0 && (
                        <div className="flex gap-4 mt-6 overflow-x-auto pb-4">
                          {editingItem.images.map((img: string, idx: number) => (
                            <div key={idx} className="w-20 h-20 rounded-xl overflow-hidden border border-white/10 flex-shrink-0">
                              <img src={img} className="w-full h-full object-cover" alt="" />
                            </div>
                          ))}
                        </div>
                      )}
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
        )
      }
    </div >
  );
};

export default AdminPortal;
