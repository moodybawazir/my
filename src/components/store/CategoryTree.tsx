import React from 'react';
import { StoreCategory } from '../../types/store.types';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Folder } from 'lucide-react';

interface CategoryTreeProps {
    categories: StoreCategory[];
    activeCategorySlug?: string;
}

export const CategoryTree: React.FC<CategoryTreeProps> = ({ categories, activeCategorySlug }) => {
    const navigate = useNavigate();

    // Organize categories into a tree structure
    const rootCategories = categories.filter(c => !c.parent_id);

    const getChildren = (parentId: string) => {
        return categories.filter(c => c.parent_id === parentId);
    };

    return (
        <div className="glass p-6 rounded-[35px] border-white/5 hidden md:block w-72 flex-shrink-0 self-start sticky top-32">
            <h3 className="text-xl font-black text-white mb-6 tracking-tight flex items-center gap-3">
                <Folder size={20} className="text-[#cfd9cc]" />
                أقسام المتجر
            </h3>
            <ul className="space-y-2">
                <li>
                    <button
                        onClick={() => navigate('/store')}
                        className={`w-full text-right px-4 py-3 rounded-2xl text-sm font-bold transition-luxury flex items-center justify-between ${!activeCategorySlug ? 'bg-white/10 text-white' : 'text-[#cfd9cc]/60 hover:bg-white/5 hover:text-white'}`}
                    >
                        <span>الكل</span>
                    </button>
                </li>
                {rootCategories.map(category => {
                    const children = getChildren(category.id);
                    const isParentActive = activeCategorySlug === category.slug || children.some(c => c.slug === activeCategorySlug);

                    return (
                        <li key={category.id} className="space-y-1">
                            <button
                                onClick={() => navigate(`/store/category/${category.slug}`)}
                                className={`w-full text-right px-4 py-3 rounded-2xl text-sm font-bold transition-luxury flex items-center justify-between ${isParentActive && !children.length ? 'bg-[#cfd9cc] text-[#0d2226]' :
                                        isParentActive ? 'bg-white/10 text-white' :
                                            'text-[#cfd9cc]/60 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <span>{category.name}</span>
                                {children.length > 0 && <ChevronDown size={16} className={`transition-transform ${isParentActive ? 'rotate-180' : ''}`} />}
                            </button>

                            {/* Children */}
                            {children.length > 0 && isParentActive && (
                                <ul className="pl-4 pr-6 space-y-1 mt-1 border-r-2 border-white/5">
                                    {children.map(child => (
                                        <li key={child.id}>
                                            <button
                                                onClick={() => navigate(`/store/category/${child.slug}`)}
                                                className={`w-full text-right px-4 py-2.5 rounded-xl text-xs font-bold transition-luxury ${activeCategorySlug === child.slug ? 'bg-[#cfd9cc]/20 text-[#cfd9cc]' : 'text-[#cfd9cc]/40 hover:text-white hover:bg-white/5'}`}
                                            >
                                                {child.name}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};
