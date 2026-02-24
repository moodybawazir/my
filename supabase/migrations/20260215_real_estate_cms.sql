-- Real Estate CMS Tables
-- إنشاء جداول لإدارة محتوى صفحة العقارات بالكامل من لوحة الأدمن

-- جدول أقسام الصفحة العقارية (Hero, About, Features, etc.)
CREATE TABLE IF NOT EXISTS public.real_estate_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_type TEXT NOT NULL CHECK (section_type IN ('hero', 'about', 'features', 'cta', 'services_intro')),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  button_text TEXT,
  button_link TEXT,
  additional_data JSONB DEFAULT '{}',
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- جدول الخدمات الفرعية العقارية
CREATE TABLE IF NOT EXISTS public.real_estate_sub_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price TEXT NOT NULL,
  features JSONB DEFAULT '[]',
  icon TEXT DEFAULT 'Camera',
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_sections_type ON real_estate_sections(section_type);
CREATE INDEX IF NOT EXISTS idx_sections_active ON real_estate_sections(is_active);
CREATE INDEX IF NOT EXISTS idx_sections_order ON real_estate_sections(order_index);
CREATE INDEX IF NOT EXISTS idx_subservices_active ON real_estate_sub_services(is_active);
CREATE INDEX IF NOT EXISTS idx_subservices_order ON real_estate_sub_services(order_index);

-- Enable RLS
ALTER TABLE public.real_estate_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.real_estate_sub_services ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Public Read Access
CREATE POLICY "Anyone can read sections" ON real_estate_sections 
  FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can read sub-services" ON real_estate_sub_services 
  FOR SELECT USING (is_active = true);

-- RLS Policies: Admin Write Access
CREATE POLICY "Admins can manage sections" ON real_estate_sections 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can manage sub-services" ON real_estate_sub_services 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Insert default data for hero section
INSERT INTO public.real_estate_sections (section_type, title, description, image_url, button_text, button_link, order_index) VALUES
('hero', 'حلول العقارات الذكية', 'منظومة متكاملة لتحويل تجربة بيع وشراء العقارات إلى رحلة بصرية غامرة باستخدام أحدث تقنيات الواقع الافتراضي والذكاء الاصطناعي.', 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=1600', 'استكشف الخدمات', '#services', 1);

-- Insert default sub-services
INSERT INTO public.real_estate_sub_services (service_id, title, description, price, features, icon, order_index) VALUES
('property-photography', 'تصوير تميز العقار', 'تصوير احترافي بدقة 4K مع تحسينات ذكية بالذكاء الاصطناعي', '١,٥٠٠ ريال', 
  '["تصوير 360 درجة", "معالجة الصور بالذكاء الاصطناعي", "تسليم خلال 24 ساعة", "تحسين الإضاءة تلقائياً"]'::jsonb, 
  'Camera', 1),
  
('virtual-tour', 'الجولة الافتراضية', 'تجربة واقع افتراضي كاملة بجودة Ultra HD', '٢,٨٠٠ ريال',
  '["جولة تفاعلية 360 درجة", "متوافقة مع نظارات VR", "خرائط أرضية ذكية", "نقاط اهتمام قابلة للنقر"]'::jsonb,
  'Compass', 2),
  
('virtual-staging', 'التأثيث الافتراضي', 'تأثيث رقمي للعقارات الفارغة بأحدث تقنيات الـ AI', '١,٢٠٠ ريال',
  '["5 تصاميم ديكور مختلفة", "تأثيث واقعي بالذكاء الاصطناعي", "تعديلات غير محدودة", "جاهز خلال 48 ساعة"]'::jsonb,
  'Home', 3);
