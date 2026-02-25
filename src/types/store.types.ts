import { Database } from './supabase';

export type StoreCategory = Database['public']['Tables']['store_categories']['Row'];
export type StoreProduct = Database['public']['Tables']['store_products']['Row'];

export interface ProductCategoryWithParent extends StoreCategory {
    parent?: StoreCategory | null;
}

export interface ProductWithCategory extends StoreProduct {
    category?: StoreCategory | null;
}
