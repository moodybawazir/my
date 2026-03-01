
import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  Cpu, Menu, X, LogIn, LogOut, MapPin, Mail, Phone, User as UserIcon, ShoppingBag
} from 'lucide-react';
import { useAuth } from '../src/context/AuthContext';
import { supabase } from '../src/lib/supabase';
import { useCart } from '../src/context/CartContext';
import { CartDrawer } from './CartDrawer';
import { MobileNav } from './MobileNav';

export const Layout: React.FC = () => {
  const { user } = useAuth();
  const [userRole, setUserRole] = React.useState<string | null>(null);
  const location = useLocation();
  const { items, setIsCartOpen } = useCart();
  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const [footerServices, setFooterServices] = React.useState<any[]>([]);
  const [footerCategories, setFooterCategories] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (user) {
      supabase.from('users').select('role').eq('id', user.id).single().then(({ data }) => {
        if (data) setUserRole(data.role);
      });
    } else {
      setUserRole(null);
    }

    const fetchFooterData = async () => {
      // Fetch services
      const { data: services } = await supabase.from('industry_sections').select('*').eq('section_type', 'standard').limit(6);
      if (services) setFooterServices(services);

      // Fetch store categories
      const { data: categories } = await supabase.from('store_categories').select('*').limit(6);
      if (categories) setFooterCategories(categories);
    };
    fetchFooterData();
  }, [user]);

  const navLinks = [
    { name: 'الرئيسية', path: '/' },
    { name: 'من نحن', path: '/about' },
    { name: 'الخدمات', path: '/services' },
    { name: 'المتجر الرقمي', path: '/store' },
  ];

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <nav className="fixed top-0 w-full z-[100] glass border-b border-white/5 px-6 py-4 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 flex items-center justify-center transition-luxury group-hover:scale-110">
              <img src="/logo.png" alt="Baseerah AI" className="w-full h-full object-contain" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-[#cfd9cc] uppercase">Baseerah AI</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-semibold transition-luxury hover:text-white ${location.pathname === link.path ? 'text-white border-b-2 border-[#cfd9cc] pb-1' : 'text-[#cfd9cc]/60'
                  }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="flex items-center gap-4 border-r border-white/10 pr-8 mr-2">
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-[#cfd9cc] hover:text-white transition-colors"
              >
                <ShoppingBag size={20} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#cfd9cc] text-[#0d2226] text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-in zoom-in">
                    {cartItemCount}
                  </span>
                )}
              </button>

              {user ? (
                <div className="flex items-center gap-2">
                  <Link to={(userRole === 'admin' || user.email === 'odood48@gmail.com' || user.email === 'mohmmedc@gmail.com') ? '/admin' : '/portal'} className="bg-[#cfd9cc] text-[#0d2226] px-6 py-2.5 rounded-full text-sm font-black hover:bg-white transition-luxury shadow-glow flex items-center gap-2">
                    <UserIcon size={18} /> أهلاً بك، {user.user_metadata?.full_name?.split(' ')[0] || user.email?.split('@')[0]}
                  </Link>
                  <button
                    onClick={() => supabase.auth.signOut()}
                    className="p-2.5 text-[#cfd9cc]/40 hover:text-red-400 transition-luxury hover:bg-red-400/10 rounded-xl"
                    title="تسجيل الخروج"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <>
                  <Link to="/login" className="text-sm font-bold text-[#cfd9cc] hover:text-white flex items-center gap-2 transition-luxury">
                    <LogIn size={18} /> دخول
                  </Link>
                  <Link to="/contact" className="bg-[#cfd9cc] text-[#0d2226] px-6 py-2.5 rounded-full text-sm font-black hover:bg-white transition-luxury shadow-glow">
                    ابدأ الآن
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <CartDrawer />
      <MobileNav />

      <main className="flex-grow pt-24 pb-20 md:pb-0">
        <Outlet />
      </main>

      <footer className="bg-[#0a1b1e] border-t border-white/5 pt-24 pb-12 px-6 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-10 mb-20 text-right">
          {/* Logo & About Column */}
          <div className="space-y-8 lg:col-span-1">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/5 rounded-2xl p-2.5 backdrop-blur-xl border border-white/10 shadow-glow">
                <img src="/logo.png" alt="Baseerah AI" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="text-2xl font-black text-white tracking-tighter block leading-none">Baseerah AI</span>
                <span className="text-[9px] font-black text-[#cfd9cc]/30 uppercase tracking-[0.4em] mt-1 block">بصيرة للذكاء الاصطناعي</span>
              </div>
            </div>
            <p className="text-[#cfd9cc]/40 leading-relaxed font-light text-sm max-w-[280px]">
              رائدة أتمتة الأعمال في المملكة العربية السعودية عبر حلول الذكاء الاصطناعي السيادي والفائق.
            </p>
          </div>

          {/* Services Column */}
          <div>
            <h4 className="font-black mb-10 text-white uppercase text-[10px] tracking-[0.4em] opacity-40">أتمتة الأعمال</h4>
            <ul className="space-y-4 text-[#cfd9cc]/50 text-sm font-bold">
              {footerServices.map((service) => (
                <li key={service.id} className="hover:text-white transition-luxury flex items-center justify-end gap-2 group">
                  <Link to={`/project/${service.section_key}`}>{service.title}</Link>
                  <div className="w-1 h-1 bg-[#cfd9cc]/20 rounded-full group-hover:bg-[#cfd9cc] transition-colors" />
                </li>
              ))}
            </ul>
          </div>

          {/* Store & Products Column */}
          <div>
            <h4 className="font-black mb-10 text-white uppercase text-[10px] tracking-[0.4em] opacity-40">المتجر الرقمي</h4>
            <ul className="space-y-4 text-[#cfd9cc]/50 text-sm font-bold">
              {footerCategories.length > 0 ? footerCategories.map((cat) => (
                <li key={cat.id} className="hover:text-white transition-luxury flex items-center justify-end gap-2 group">
                  <Link to={`/store/category/${cat.slug}`}>{cat.name}</Link>
                  <div className="w-1 h-1 bg-[#cfd9cc]/20 rounded-full group-hover:bg-[#cfd9cc] transition-colors" />
                </li>
              )) : (
                <>
                  <li className="hover:text-white transition-luxury flex items-center justify-end gap-2 group">
                    <Link to="/store">قوالب الأعمال</Link>
                    <div className="w-1 h-1 bg-[#cfd9cc]/20 rounded-full group-hover:bg-[#cfd9cc] transition-colors" />
                  </li>
                  <li className="hover:text-white transition-luxury flex items-center justify-end gap-2 group">
                    <Link to="/store">أنظمة AI جاهزة</Link>
                    <div className="w-1 h-1 bg-[#cfd9cc]/20 rounded-full group-hover:bg-[#cfd9cc] transition-colors" />
                  </li>
                  <li className="hover:text-white transition-luxury flex items-center justify-end gap-2 group">
                    <Link to="/store">تطبيقات سحابية</Link>
                    <div className="w-1 h-1 bg-[#cfd9cc]/20 rounded-full group-hover:bg-[#cfd9cc] transition-colors" />
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="font-black mb-10 text-white uppercase text-[10px] tracking-[0.4em] opacity-40">الشركة</h4>
            <ul className="space-y-4 text-[#cfd9cc]/50 text-sm font-bold">
              <li className="hover:text-white transition-luxury flex items-center justify-end gap-2 group">
                <Link to="/about">من نحن</Link>
                <div className="w-1 h-1 bg-[#cfd9cc]/20 rounded-full group-hover:bg-[#cfd9cc] transition-colors" />
              </li>
              <li className="hover:text-white transition-luxury flex items-center justify-end gap-2 group">
                <Link to="/contact">تواصل معنا</Link>
                <div className="w-1 h-1 bg-[#cfd9cc]/20 rounded-full group-hover:bg-[#cfd9cc] transition-colors" />
              </li>
              <li className="hover:text-white transition-luxury flex items-center justify-end gap-2 group">
                <Link to="/policy/privacy">سياسة الخصوصية</Link>
                <div className="w-1 h-1 bg-[#cfd9cc]/20 rounded-full group-hover:bg-[#cfd9cc] transition-colors" />
              </li>
              <li className="hover:text-white transition-luxury flex items-center justify-end gap-2 group">
                <Link to="/policy/refund">سياسة الاسترجاع</Link>
                <div className="w-1 h-1 bg-[#cfd9cc]/20 rounded-full group-hover:bg-[#cfd9cc] transition-colors" />
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="font-black mb-10 text-white uppercase text-[10px] tracking-[0.4em] opacity-40">اتصل بنا</h4>
            <div className="space-y-8 text-[#cfd9cc]/60 text-sm font-medium">
              <div className="flex items-start justify-end gap-4">
                <div className="text-right">
                  <p className="text-white font-black text-xs mb-1 text-[10px]">مكة المكرمة</p>
                  <p className="opacity-60 text-[11px]">المملكة العربية السعودية</p>
                </div>
                <MapPin size={16} className="text-[#cfd9cc]/30" />
              </div>
              <div className="flex items-start justify-end gap-4">
                <div className="text-right">
                  <p className="text-white font-black text-xs mb-1 text-[10px]">البريد الإلكتروني</p>
                  <p className="opacity-60 text-[11px]">info@basserahai.com</p>
                </div>
                <Mail size={16} className="text-[#cfd9cc]/30" />
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-black text-white/10 uppercase tracking-[0.3em]">© ٢٠٢٤ بصيرة للذكاء الاصطناعي. جميع الحقوق محفوظة.</p>
          <div className="flex gap-8">
            <Link to="/policy/privacy" className="text-[10px] font-black text-white/10 hover:text-[#cfd9cc] transition-luxury">سياسة الخصوصية والاستخدام</Link>
            <Link to="/policy/refund" className="text-[10px] font-black text-white/10 hover:text-[#cfd9cc] transition-luxury">سياسة الاسترجاع</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export const AdminLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0d2226]">
      <Outlet />
    </div>
  );
};
