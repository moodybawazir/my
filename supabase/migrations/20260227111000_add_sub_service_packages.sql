-- Add columns to handle dynamic packages for industry sub-services
ALTER TABLE public.industry_sub_services
ADD COLUMN IF NOT EXISTS has_packages BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS packages JSONB DEFAULT '[]'::jsonb;