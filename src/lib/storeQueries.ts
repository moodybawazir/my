import { supabase } from './supabase';
import { StoreCategory, StoreProduct, ProductCategoryWithParent, ProductWithCategory } from '../types/store.types';

export async function fetchStoreCategories(): Promise<StoreCategory[]> {
    console.log('Fetching store categories...');
    const { data, error } = await supabase
        .from('store_categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

    if (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
    console.log(`Successfully fetched ${data?.length || 0} categories`);
    return data || [];
}

export async function fetchCategoryBySlug(slug: string): Promise<StoreCategory | null> {
    console.log(`Fetching category by slug: ${slug}`);
    const { data, error } = await supabase
        .from('store_categories')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

    if (error) {
        console.error(`Error fetching category ${slug}:`, error);
        return null;
    }
    return data;
}

export async function fetchStoreProducts(categoryId?: string): Promise<ProductWithCategory[]> {
    console.log(`Fetching store products (category filtered: ${categoryId || 'None'})...`);
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

    console.log(`Successfully fetched ${data?.length || 0} products`);
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
