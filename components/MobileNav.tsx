import React from 'react';
import { Home, Grid, ShoppingBag, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../src/context/CartContext';
import { useAuth } from '../src/context/AuthContext';
import { supabase } from '../src/lib/supabase';

export const MobileNav: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { items, setIsCartOpen } = useCart();
    const { user } = useAuth();
    const [isAdmin, setIsAdmin] = React.useState(false);

    React.useEffect(() => {
        if (user) {
            if (user.email === 'odood48@gmail.com' || user.email === 'mohmmedc@gmail.com') {
                setIsAdmin(true);
            } else {
                supabase.from('users').select('role').eq('id', user.id).single().then(({ data }) => {
                    if (data?.role === 'admin') setIsAdmin(true);
                });
            }
        }
    }, [user]);

    const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    const navItems = [
        { name: 'الرئيسية', path: '/', icon: Home },
        { name: 'الخدمات', path: '/services', icon: Grid },
        {
            name: 'السلة',
            icon: ShoppingBag,
            action: () => setIsCartOpen(true),
            badge: cartItemCount
        },
        {
            name: 'حسابي',
            path: user ? (isAdmin ? '/admin' : '/portal') : '/login',
            icon: User
        }
    ];

    // Don't render on desktop
    return (
        <div className="md:hidden fixed bottom-0 w-full z-[120] pb-safe" dir="rtl">
            {/* PWA bottom safe area padding is handled by pb-safe in index.html/css if configured, otherwise just basic padding */}
            <div className="glass border-t border-white/10 px-6 py-3 flex justify-between items-center bg-[#0a1b1e]/90 backdrop-blur-xl shadow-[0_-10px_40px_rgba(0,0,0,0.3)]">
                {navItems.map((item, idx) => {
                    const isActive = item.path ? location.pathname === item.path : false;

                    return (
                        <button
                            key={idx}
                            onClick={() => item.action ? item.action() : navigate(item.path!)}
                            className="relative flex flex-col items-center gap-1 min-w-[64px] transition-transform active:scale-95"
                        >
                            <div className={`relative p-2 rounded-xl transition-all duration-300 ${isActive ? 'bg-[#cfd9cc]/20 text-[#cfd9cc]' : 'text-white/50 hover:text-white'}`}>
                                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                                {item.badge !== undefined && item.badge > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-[#cfd9cc] text-[#0d2226] text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-in zoom-in">
                                        {item.badge}
                                    </span>
                                )}
                            </div>
                            <span className={`text-[10px] font-bold transition-colors ${isActive ? 'text-[#cfd9cc]' : 'text-white/50'}`}>
                                {item.name}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
