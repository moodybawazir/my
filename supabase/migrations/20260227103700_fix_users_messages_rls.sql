-- Add INSERT, UPDATE, and DELETE policies for authenticated users on messages
CREATE POLICY "Enable select for authenticated users" ON public.messages FOR
SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users" ON public.messages FOR DELETE USING (auth.role() = 'authenticated');
-- Add SELECT, UPDATE, and DELETE policies for admins on users table
CREATE POLICY "Enable select for admins" ON public.users FOR
SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable update for admins" ON public.users FOR
UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for admins" ON public.users FOR DELETE USING (auth.role() = 'authenticated');