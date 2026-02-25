import { Database } from './supabase';

export type SubscriptionPlan = Database['public']['Tables']['subscription_plans']['Row'];
export type ServicePackage = Database['public']['Tables']['service_packages']['Row'];
export type UserSubscription = Database['public']['Tables']['user_subscriptions']['Row'];

// Extended types for UI
export interface PlanWithPackages extends SubscriptionPlan {
    packages: ServicePackage[];
}
