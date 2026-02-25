import { supabase } from './supabase';
import { PlanWithPackages } from '../types/subscription.types';

export async function fetchServiceSubscriptionPlans(serviceId: string): Promise<PlanWithPackages[]> {
    const { data: plans, error: plansError } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('service_id', serviceId)
        .eq('is_active', true)
        .order('price_monthly', { ascending: true });

    if (plansError) {
        console.error('Error fetching plans:', plansError);
        return [];
    }

    if (!plans || plans.length === 0) return [];

    const planIds = plans.map(p => p.id);

    const { data: packages, error: packagesError } = await supabase
        .from('service_packages')
        .select('*')
        .in('plan_id', planIds)
        .order('sort_order', { ascending: true });

    if (packagesError) {
        console.error('Error fetching packages:', packagesError);
        return [];
    }

    const plansWithPackages: PlanWithPackages[] = plans.map(plan => ({
        ...plan,
        packages: packages?.filter(pkg => pkg.plan_id === plan.id) || []
    }));

    return plansWithPackages;
}
