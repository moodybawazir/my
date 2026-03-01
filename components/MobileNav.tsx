import React from 'react';
import { Home, Grid, ShoppingBag, ShoppingCart, User } from 'lucide-react';
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
        { name: 'المتجر', path: '/store', icon: ShoppingBag },
        {
            name: 'السلة',
            icon: ShoppingCart,
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
        <div className="md:hidden fixed bottom-8 left-1/2 -translate-x-1/2 w-[92%] max-w-md z-[200] pointer-events-none" dir="rtl">
            <div className="flex justify-between items-center bg-[#050c0d]/80 backdrop-blur-3xl rounded-[2.5rem] p-2 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] pointer-events-auto">
                {navItems.map((item, idx) => {
                    const isActive = item.path ? location.pathname === item.path : false;

                    return (
                        <button
                            key={idx}
                            onClick={() => item.action ? item.action() : navigate(item.path!)}
                            className="relative flex items-center justify-center transition-all duration-300 active:scale-90"
                        >
                            <div className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 overflow-hidden ${isActive
                                    ? 'bg-gradient-to-br from-[#cfd9cc] via-[#7ba494] to-[#1e403a] text-[#0d2226] shadow-[0_0_20px_rgba(207,217,204,0.3)]'
                                    : 'text-white/40 hover:text-white/70'
                                }`}>
                                <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} className="relative z-10" />

                                {item.badge !== undefined && item.badge > 0 && (
                                    <span className={`absolute top-2 right-2 flex items-center justify-center w-4 h-4 text-[9px] font-black rounded-full border border-white/10 ${isActive ? 'bg-[#0d2226] text-[#cfd9cc]' : 'bg-[#cfd9cc] text-[#0d2226]'
                                        }`}>
                                        {item.badge}
                                    </span>
                                )}

                                {/* Subtle glow for active item */}
                                {isActive && (
                                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
