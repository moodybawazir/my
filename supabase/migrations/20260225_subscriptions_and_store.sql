-- Add Subscription Fields to Services Table
ALTER TABLE public.services
ADD COLUMN IF NOT EXISTS has_subscription BOOLEAN DEFAULT FALSE;
ALTER TABLE public.services
ADD COLUMN IF NOT EXISTS subscription_type VARCHAR(20) DEFAULT 'none' CHECK (
        subscription_type IN ('monthly', 'tiered', 'none')
    );
-- Subscription Plans Table
CREATE TABLE IF NOT EXISTS public.subscription_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price_monthly DECIMAL(10, 2) NOT NULL,
    price_bimonthly DECIMAL(10, 2),
    price_yearly DECIMAL(10, 2) NOT NULL,
    tier_level INTEGER CHECK (tier_level IN (1, 2, 3)),
    features JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Service Packages Table
CREATE TABLE IF NOT EXISTS public.service_packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_id UUID REFERENCES public.subscription_plans(id) ON DELETE CASCADE,
    service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
    package_name VARCHAR(255) NOT NULL,
    package_description TEXT,
    limits JSONB,
    extras JSONB,
    is_featured BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0
);
-- User Subscriptions Table
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES public.subscription_plans(id) ON DELETE CASCADE,
    package_id UUID REFERENCES public.service_packages(id) ON DELETE
    SET NULL,
        billing_cycle VARCHAR(20) CHECK (
            billing_cycle IN ('monthly', 'bimonthly', 'yearly')
        ),
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        status VARCHAR(20) DEFAULT 'pending' CHECK (
            status IN ('active', 'expired', 'cancelled', 'pending')
        ),
        auto_renew BOOLEAN DEFAULT TRUE,
        payment_ref VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Store Categories Table
CREATE TABLE IF NOT EXISTS public.store_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    icon TEXT,
    image TEXT,
    parent_id UUID REFERENCES public.store_categories(id) ON DELETE CASCADE,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Store Products Table
CREATE TABLE IF NOT EXISTS public.store_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES public.store_categories(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    sale_price DECIMAL(10, 2),
    images JSONB,
    stock INTEGER DEFAULT 0,
    sku VARCHAR(100),
    attributes JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- RLS Policies
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_products ENABLE ROW LEVEL SECURITY;
-- Public can read plans, packages, categories, products
CREATE POLICY "Public plans are viewable by everyone" ON public.subscription_plans FOR
SELECT USING (true);
CREATE POLICY "Public packages are viewable by everyone" ON public.service_packages FOR
SELECT USING (true);
CREATE POLICY "Public categories are viewable by everyone" ON public.store_categories FOR
SELECT USING (true);
CREATE POLICY "Public products are viewable by everyone" ON public.store_products FOR
SELECT USING (true);
-- Users can read their own subscriptions
CREATE POLICY "Users can view own subscriptions" ON public.user_subscriptions FOR
SELECT USING (auth.uid() = user_id);