-- Add INSERT, UPDATE, and DELETE policies for authenticated users on store_products
CREATE POLICY "Enable insert for authenticated users" ON public.store_products FOR
INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users" ON public.store_products FOR
UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users" ON public.store_products FOR DELETE USING (auth.role() = 'authenticated');
-- Add INSERT, UPDATE, and DELETE policies for authenticated users on store_categories
CREATE POLICY "Enable insert for authenticated users" ON public.store_categories FOR
INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users" ON public.store_categories FOR
UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users" ON public.store_categories FOR DELETE USING (auth.role() = 'authenticated');