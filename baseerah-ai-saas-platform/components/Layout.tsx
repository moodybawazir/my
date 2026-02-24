
import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  Cpu, Menu, X, LogIn, MapPin, Mail, Phone
} from 'lucide-react';

export const Layout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'الرئيسية', path: '/' },
    { name: 'من نحن', path: '/about' },
    { name: 'الخدمات', path: '/services' },
    { name: 'المتجر الرقمي', path: '/products' },
    { name: 'بوابة العميل', path: '/portal' },
  ];

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <nav className="fixed top-0 w-full z-[100] glass border-b border-white/5 px-6 py-4 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#cfd9cc] to-[#1e403a] flex items-center justify-center shadow-lg group-hover:scale-105 transition-luxury">
              <Cpu className="text-[#0d2226]" size={22} />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-[#cfd9cc] uppercase">بصيرة AI</span>
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
              <Link to="/login" className="text-sm font-bold text-[#cfd9cc] hover:text-white flex items-center gap-2 transition-luxury">
                <LogIn size={18} /> دخول
              </Link>
              <Link to="/contact" className="bg-[#cfd9cc] text-[#0d2226] px-6 py-2.5 rounded-full text-sm font-black hover:bg-white transition-luxury shadow-glow">
                ابدأ الآن
              </Link>
            </div>
          </div>

          <button className="md:hidden text-[#cfd9cc] p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="absolute top-full right-0 w-full glass p-10 md:hidden border-b border-white/10 shadow-2xl animate-in slide-in-from-top duration-300">
            <div className="flex flex-col gap-8 text-center">
              {navLinks.map((link) => (
                <Link key={link.path} to={link.path} onClick={() => setIsMenuOpen(false)} className="text-2xl font-black text-[#cfd9cc] hover:text-white transition-luxury">{link.name}</Link>
              ))}
              <hr className="border-white/5" />
              <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-xl font-bold text-[#cfd9cc]">تسجيل الدخول</Link>
              <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="bg-[#cfd9cc] text-[#0d2226] py-5 rounded-2xl font-black text-xl shadow-glow">ابدأ الآن</Link>
            </div>
          </div>
        )}
      </nav>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-[#0a1b1e] border-t border-white/5 pt-24 pb-12 px-6 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 mb-20 text-right">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-[#cfd9cc] rounded-lg"><Cpu className="text-[#0d2226]" size={24} /></div>
              <span className="text-2xl font-black text-white tracking-tighter">بصيرة AI</span>
            </div>
            <p className="text-[#cfd9cc]/50 leading-relaxed font-light mb-8">رائدة أتمتة الأعمال في المملكة العربية السعودية عبر حلول الذكاء الاصطناعي السيادي.</p>
          </div>
          <div>
            <h4 className="font-black mb-8 text-white uppercase text-[10px] tracking-[0.4em] opacity-40">الخدمات</h4>
            <ul className="space-y-4 text-[#cfd9cc]/50 text-sm font-bold">
              <li className="hover:text-white transition-luxury"><Link to="/project/ecommerce">التجارة الإلكترونية</Link></li>
              <li className="hover:text-white transition-luxury"><Link to="/project/accounting">المحاسبة والمالية</Link></li>
              <li className="hover:text-white transition-luxury"><Link to="/project/real-estate">العقارات الذكية</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black mb-8 text-white uppercase text-[10px] tracking-[0.4em] opacity-40">روابط سريعة</h4>
            <ul className="space-y-4 text-[#cfd9cc]/50 text-sm font-bold">
              <li className="hover:text-white transition-luxury"><Link to="/admin">لوحة التحكم</Link></li>
              <li className="hover:text-white transition-luxury"><Link to="/products">المتجر الرقمي</Link></li>
              <li className="hover:text-white transition-luxury"><Link to="/contact">تواصل معنا</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black mb-8 text-white uppercase text-[10px] tracking-[0.4em] opacity-40">التواصل الاستراتيجي</h4>
            <div className="space-y-6 text-[#cfd9cc]/60 text-sm font-medium">
              <div className="flex items-center gap-4"><MapPin size={18} className="text-[#cfd9cc]/30" /> مكة المكرمة، المملكة العربية السعودية</div>
              <div className="flex items-center gap-4"><Mail size={18} className="text-[#cfd9cc]/30" /> info@basserahai.com</div>
              <div className="flex items-center gap-4" dir="ltr"><Phone size={18} className="text-[#cfd9cc]/30" /> 0546281876</div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-black text-white/10 uppercase tracking-[0.3em]">© ٢٠٢٤ بصيرة للذكاء الاصطناعي. جميع الحقوق محفوظة.</p>
          <div className="flex gap-8">
            <a href="#" className="text-[10px] font-black text-white/10 hover:text-[#cfd9cc] transition-luxury">سياسة الخصوصية</a>
            <a href="#" className="text-[10px] font-black text-white/10 hover:text-[#cfd9cc] transition-luxury">شروط الخدمة</a>
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
