
import { supabase } from './supabase';

export interface IndustrySection {
    id: string;
    industry_id: string;
    section_type: 'hero' | 'interactive_demo' | 'standard';
    demo_type?: 'three_d' | 'loyalty' | 'calendar' | 'chatbot';
    title: string;
    subtitle?: string;
    description?: string;
    image_url?: string;
    action_text?: string;
    action_link?: string;
    sort_order: number;
}

export interface IndustrySubService {
    id: string;
    industry_id: string;
    title: string;
    description: string;
    price: string;
    image_url?: string;
    icon?: string;
    features: string[];
    is_active: boolean;
    sort_order: number;
}

export interface LoyaltyProgram {
    id: string;
    industry_id: string;
    title: string;
    description: string;
    total_stamps: number;
    reward_text: string;
    reward_icon: string;
    stamp_icon: string;
    bg_image_url?: string;
}

export async function fetchIndustryContent(industryId: string) {
    const sectionsPromise = supabase
        .from('industry_sections')
        .select('*')
        .eq('industry_id', industryId)
        .order('sort_order', { ascending: true });

    const servicesPromise = supabase
        .from('industry_sub_services')
        .select('*')
        .eq('industry_id', industryId)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

    const loyaltyPromise = supabase
        .from('loyalty_programs')
        .select('*')
        .eq('industry_id', industryId)
        .maybeSingle();

    const mainServicePromise = supabase
        .from('services')
        .select('*')
        .eq('id', industryId)
        .maybeSingle();

    const [sections, services, loyalty, mainService] = await Promise.all([
        sectionsPromise,
        servicesPromise,
        loyaltyPromise,
        mainServicePromise
    ]);

    return {
        serviceModel: mainService.data || null,
        sections: sections.data as IndustrySection[] || [],
        services: services.data as IndustrySubService[] || [],
        loyalty: loyalty.data as LoyaltyProgram || null
    };
}

export async function fetchIndustryDemo(industryId: string, demoKey: string) {
    const { data, error } = await supabase
        .from('demos')
        .select('data')
        .eq('industry_id', industryId)
        .eq('demo_key', demoKey)
        .single();

    if (error) {
        console.error(`Error fetching demo ${demoKey} for ${industryId}:`, error);
        return null;
    }

    return data?.data;
}
