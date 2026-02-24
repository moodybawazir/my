// Supabase queries for Real Estate CMS

import { supabase } from './supabase';

// Types
export interface RealEstateSection {
    id: string;
    section_type: 'hero' | 'about' | 'features' | 'cta' | 'services_intro';
    title: string;
    description?: string;
    image_url?: string;
    button_text?: string;
    button_link?: string;
    additional_data?: any;
    order_index: number;
    is_active: boolean;
}

export interface RealEstateSubService {
    id: string;
    service_id: string;
    title: string;
    description: string;
    price: string;
    features: string[];
    icon: string;
    order_index: number;
    is_active: boolean;
}

// ========== FETCH QUERIES ==========

/**
 * Fetch all active real estate sections ordered by index
 */
export async function fetchRealEstateSections() {
    const { data, error } = await supabase
        .from('real_estate_sections')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });

    if (error) throw error;
    return data as RealEstateSection[];
}

/**
 * Fetch all active real estate sub-services ordered by index
 */
export async function fetchRealEstateSubServices() {
    const { data, error } = await supabase
        .from('real_estate_sub_services')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });

    if (error) throw error;
    return data as RealEstateSubService[];
}

/**
 * Fetch a specific section by ID
 */
export async function fetchRealEstateSectionById(id: string) {
    const { data, error } = await supabase
        .from('real_estate_sections')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;
    return data as RealEstateSection;
}

/**
 * Fetch a specific sub-service by service_id
 */
export async function fetchRealEstateSubServiceById(serviceId: string) {
    const { data, error } = await supabase
        .from('real_estate_sub_services')
        .select('*')
        .eq('service_id', serviceId)
        .single();

    if (error) throw error;
    return data as RealEstateSubService;
}

// ========== ADMIN MUTATIONS ==========

/**
 * Update a real estate section
 */
export async function updateRealEstateSection(
    id: string,
    updates: Partial<RealEstateSection>
) {
    const { data, error } = await supabase
        .from('real_estate_sections')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

/**
 * Update a real estate sub-service
 */
export async function updateRealEstateSubService(
    id: string,
    updates: Partial<RealEstateSubService>
) {
    const { data, error } = await supabase
        .from('real_estate_sub_services')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

/**
 * Create a new sub-service
 */
export async function createRealEstateSubService(
    service: Omit<RealEstateSubService, 'id'>
) {
    const { data, error } = await supabase
        .from('real_estate_sub_services')
        .insert(service)
        .select()
        .single();

    if (error) throw error;
    return data;
}

/**
 * Delete a sub-service (soft delete by setting is_active = false)
 */
export async function deleteRealEstateSubService(id: string) {
    const { error } = await supabase
        .from('real_estate_sub_services')
        .update({ is_active: false })
        .eq('id', id);

    if (error) throw error;
}

/**
 * Reorder sections
 */
export async function reorderRealEstateSections(
    sectionIds: string[]
) {
    const promises = sectionIds.map((id, index) =>
        supabase
            .from('real_estate_sections')
            .update({ order_index: index + 1 })
            .eq('id', id)
    );

    const results = await Promise.all(promises);
    const errors = results.filter((r) => r.error);
    if (errors.length > 0) throw errors[0].error;
}

/**
 * Reorder sub-services
 */
export async function reorderRealEstateSubServices(
    serviceIds: string[]
) {
    const promises = serviceIds.map((id, index) =>
        supabase
            .from('real_estate_sub_services')
            .update({ order_index: index + 1 })
            .eq('id', id)
    );

    const results = await Promise.all(promises);
    const errors = results.filter((r) => r.error);
    if (errors.length > 0) throw errors[0].error;
}
