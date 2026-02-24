
import { supabase } from './supabase';

export async function fetchPageContent(sectionKey: string) {
    const { data, error } = await (supabase.from('content_pages') as any)
        .select('content')
        .eq('section_key', sectionKey)
        .single();

    if (error) {
        console.error(`Error fetching ${sectionKey} content:`, error);
        return null;
    }

    return data?.content;
}

export async function fetchGeneralServices(limit: number = 3) {
    const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Error fetching services:', error);
        return [];
    }

    return data;
}
