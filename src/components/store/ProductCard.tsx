import React from 'react';
import { ProductWithCategory } from '../../types/store.types';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';

interface ProductCardProps {
    product: ProductWithCategory;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const navigate = useNavigate();

    // Fallback to a placeholder if no image exists or is incorrectly formatted
    const parsedImages = Array.isArray(product.images)
        ? product.images
        : (typeof product.images === 'string' ? JSON.parse(product.images) : []);

    const displayImage = parsedImages.length > 0 && typeof parsedImages[0] === 'string'
        ? parsedImages[0]
        : 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=600&auto=format&fit=crop';

    return (
        <div className="glass rounded-[35px] overflow-hidden border-white/5 group transition-luxury hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] flex flex-col h-full bg-[#0d2226]/80">
            <div
                className="relative h-56 cursor-pointer overflow-hidden bg-black/20"
                onClick={() => navigate(`/store/products/${product.slug}`)}
            >
                <img
                    src={displayImage}
                    alt={product.name}
                    className="w-full h-full object-cover transition-luxury duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d2226] via-transparent to-transparent opacity-80" />

                {product.is_featured && (
                    <div className="absolute top-4 right-4 bg-amber-400 text-[#0d2226] text-xs font-black tracking-widest px-3 py-1 rounded-full uppercase">
                        مميز
                    </div>
                )}

                {product.sale_price && (
                    <div className="absolute bottom-4 left-4 bg-rose-500 text-white text-xs font-black px-3 py-1 rounded-full shadow-lg">
                        تخفيض
                    </div>
                )}
            </div>

            <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-3">
                    <div onClick={() => navigate(`/store/products/${product.slug}`)} className="cursor-pointer">
                        <div className="text-[10px] uppercase tracking-widest text-[#cfd9cc]/50 font-black mb-1">
                            {product.category?.name || 'تصنيف عام'}
                        </div>
                        <h3 className="text-xl font-black text-white line-clamp-2 leading-tight group-hover:text-[#cfd9cc] transition-colors">{product.name}</h3>
                    </div>
                </div>

                <p className="text-[#cfd9cc]/60 text-sm line-clamp-2 mb-6 flex-grow leading-relaxed">
                    {product.description}
                </p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                    <div className="flex flex-col">
                        {product.sale_price ? (
                            <>
                                <span className="text-2xl font-black text-[#cfd9cc] leading-none">{product.sale_price} ر.س</span>
                                <span className="text-sm font-bold text-white/30 line-through">{product.price} ر.س</span>
                            </>
                        ) : (
                            <span className="text-2xl font-black text-[#cfd9cc] leading-none">{product.price} ر.س</span>
                        )}
                    </div>
                    <button
                        onClick={() => navigate(`/checkout?product=${product.id}`)}
                        className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-[#cfd9cc] text-white hover:text-[#0d2226] flex items-center justify-center transition-luxury group/btn"
                        title="أضف للسلة"
                    >
                        <ShoppingCart size={20} className="group-hover/btn:scale-110 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
};
