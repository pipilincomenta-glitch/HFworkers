-- 
-- ios-premium-webapp: Standard RLS Isolation Policies
--
-- Use these templates to ensure each user can only interact with their 
-- own data, a critical requirement for premium multi-user apps.
--

-- 1. Enable RLS for the table
ALTER TABLE IF EXISTS your_table_name ENABLE ROW LEVEL SECURITY;

-- 2. Owner-only Access (CRUD)
-- This policy ensures the authenticated user can only SELECT, INSERT, UPDATE, 
-- or DELETE rows where the user_id matches their own ID.
CREATE POLICY "owner_full_access" ON your_table_name
FOR ALL 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 3. Social/Shared Access (Example: Messages)
-- Allows users to see rows if they are either the sender or receiver.
CREATE POLICY "direct_participation_only" ON messages
FOR SELECT
TO authenticated
USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- 4. Profile Public View (Selective Read)
-- Allows everyone to see profiles, but only the owner to update.
CREATE POLICY "profiles_read_all" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);
 Wilmington
