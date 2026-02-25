import React from 'react';
import { StoreCategory } from '../../types/store.types';
import { useNavigate } from 'react-router-dom';

interface CategoryChipsProps {
    categories: StoreCategory[];
    activeCategorySlug?: string;
}

export const CategoryChips: React.FC<CategoryChipsProps> = ({ categories, activeCategorySlug }) => {
    const navigate = useNavigate();

    return (
        <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x">
            <button
                onClick={() => navigate('/store')}
                className={`flex-shrink-0 px-6 py-2.5 rounded-full text-sm font-bold transition-luxury snap-start ${!activeCategorySlug ? 'bg-[#cfd9cc] text-[#0d2226] shadow-md' : 'bg-white/5 text-[#cfd9cc]/60 hover:bg-white/10 hover:text-white'}`}
            >
                الكل
            </button>
            {categories.filter(c => !c.parent_id).map(category => (
                <button
                    key={category.id}
                    onClick={() => navigate(`/store/category/${category.slug}`)}
                    className={`flex-shrink-0 px-6 py-2.5 rounded-full text-sm font-bold transition-luxury snap-start ${activeCategorySlug === category.slug ? 'bg-[#cfd9cc] text-[#0d2226] shadow-md' : 'bg-white/5 text-[#cfd9cc]/60 hover:bg-white/10 hover:text-white'}`}
                >
                    {category.name}
                </button>
            ))}
        </div>
    );
};
