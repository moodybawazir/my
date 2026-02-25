import { supabase } from './supabase';
import { StoreCategory, StoreProduct, ProductCategoryWithParent, ProductWithCategory } from '../types/store.types';

export async function fetchStoreCategories(): Promise<StoreCategory[]> {
    const { data, error } = await supabase
        .from('store_categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

    if (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
    return data || [];
}

export async function fetchCategoryBySlug(slug: string): Promise<StoreCategory | null> {
    const { data, error } = await supabase
        .from('store_categories')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

    if (error) {
        console.error('Error fetching category:', error);
        return null;
    }
    return data;
}

export async function fetchStoreProducts(categoryId?: string): Promise<ProductWithCategory[]> {
    let query = supabase
        .from('store_products')
        .select(`
            *,
            store_categories (
                id,
                name,
                slug
            )
        `)
        .eq('is_active', true);

    if (categoryId) {
        query = query.eq('category_id', categoryId);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching products:', error);
        return [];
    }

    return (data || []).map((p: any) => ({
        ...p,
        category: p.store_categories
    }));
}

export async function fetchProductBySlug(slug: string): Promise<ProductWithCategory | null> {
    const { data, error } = await supabase
        .from('store_products')
        .select(`
            *,
            store_categories (
                id,
                name,
                slug
            )
        `)
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

    if (error) {
        console.error('Error fetching product:', error);
        return null;
    }

    if (data) {
        return {
            ...data,
            category: (data as any).store_categories
        } as ProductWithCategory;
    }
    return null;
}
