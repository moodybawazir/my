import React from 'react';
import { X, Minus, Plus, ShoppingBag, ArrowLeft, Trash2 } from 'lucide-react';
import { useCart } from '../src/context/CartContext';
import { useNavigate } from 'react-router-dom';

export const CartDrawer: React.FC = () => {
    const { isCartOpen, setIsCartOpen, items, updateQuantity, removeItem, totalPrice } = useCart();
    const navigate = useNavigate();

    if (!isCartOpen) return null;

    return (
        <>
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] animate-in fade-in"
                onClick={() => setIsCartOpen(false)}
            />

            <div
                className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0d2226] border-l border-white/10 shadow-2xl z-[200] flex flex-col animate-in slide-in-from-right duration-300"
                dir="rtl"
            >
                <div className="p-6 border-b border-white/10 flex items-center justify-between bg-black/20">
                    <div className="flex items-center gap-3">
                        <ShoppingBag className="text-[#cfd9cc]" />
                        <h2 className="text-xl font-black text-white">سلة المشتريات</h2>
                        <span className="bg-[#cfd9cc] text-[#0d2226] text-xs font-bold px-2 py-0.5 rounded-full">
                            {items.length}
                        </span>
                    </div>
                    <button
                        onClick={() => setIsCartOpen(false)}
                        className="text-white/50 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center opacity-50 space-y-4">
                            <ShoppingBag size={64} className="mb-4 text-[#cfd9cc]" />
                            <p className="text-xl font-bold text-white">السلة فارغة</p>
                            <p className="text-sm font-light text-white/70">لم تقم بإضافة أي خدمات أو منتجات بعد.</p>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="mt-8 px-6 py-2 border border-white/20 rounded-full text-white text-sm hover:bg-white/5 transition-colors"
                            >
                                متابعة التصفح
                            </button>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div key={`${item.type}-${item.id}`} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 relative group">
                                {item.image_url ? (
                                    <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-black/40">
                                        <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                                    </div>
                                ) : (
                                    <div className="w-20 h-20 rounded-xl flex-shrink-0 bg-black/40 flex items-center justify-center border border-white/5">
                                        <ShoppingBag size={24} className="text-[#cfd9cc]/50" />
                                    </div>
                                )}

                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-bold text-white text-sm leading-tight mb-1 pr-6">{item.title}</h3>
                                        <p className="text-xs text-white/50">{item.type === 'service' ? 'خدمة أتمتة' : item.type === 'product' ? 'منتج رقمي' : 'مشروع'}</p>
                                        {item.details?.packageName && (
                                            <p className="text-xs text-[#cfd9cc] mt-1">{item.details.packageName}</p>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between mt-3">
                                        <div className="flex items-center gap-3 bg-black/30 rounded-lg p-1 border border-white/5">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.type, -1)}
                                                className="p-1 hover:bg-white/10 rounded-md text-white transition-colors"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="text-sm font-bold w-4 text-center text-white">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.type, 1)}
                                                className="p-1 hover:bg-white/10 rounded-md text-white transition-colors"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                        <div className="text-left font-black text-[#cfd9cc]">
                                            {item.price.toLocaleString()} ر.س
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => removeItem(item.id, item.type)}
                                    className="absolute top-4 left-4 p-1.5 text-white/30 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {items.length > 0 && (
                    <div className="p-6 border-t border-white/10 bg-black/20">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-white/60">الإجمالي المبدئي</span>
                            <span className="text-2xl font-black text-white">{totalPrice.toLocaleString()} <span className="text-sm text-[#cfd9cc]">ر.س</span></span>
                        </div>
                        <button
                            onClick={() => {
                                setIsCartOpen(false);
                                navigate('/checkout');
                            }}
                            className="w-full bg-[#cfd9cc] text-[#0d2226] py-4 rounded-xl font-black text-lg hover:bg-white transition-luxury shadow-glow flex items-center justify-center gap-3"
                        >
                            إتمام الطلب <ArrowLeft size={20} />
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};
