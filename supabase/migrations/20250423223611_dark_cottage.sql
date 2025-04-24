/*
  # Update shared analysis policies and indexes

  1. Changes
    - Add indexes for performance optimization
    - Drop existing policies to avoid conflicts
    - Recreate policies with proper access control

  2. Security
    - Enable RLS on shared_analyses table
    - Add policies for proper access control
*/

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public can view shared analyses" ON shared_analyses;
DROP POLICY IF EXISTS "Users can create shares" ON shared_analyses;
DROP POLICY IF EXISTS "Users can manage own shares" ON shared_analyses;

-- Update shared_analyses policies
ALTER TABLE shared_analyses ENABLE ROW LEVEL SECURITY;

-- Allow public access to shared analyses
CREATE POLICY "Public can view shared analyses"
ON shared_analyses
FOR SELECT
TO public
USING (true);

-- Allow authenticated users to create shares
CREATE POLICY "Users can create shares"
ON shared_analyses
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = created_by);

-- Allow users to manage their own shares
CREATE POLICY "Users can manage own shares"
ON shared_analyses
FOR ALL
TO authenticated
USING (auth.uid() = created_by);

-- Add index for share_id lookups
CREATE INDEX IF NOT EXISTS idx_shared_analyses_share_id 
ON shared_analyses (share_id);

-- Add index for analysis_id lookups
CREATE INDEX IF NOT EXISTS idx_shared_analyses_analysis_id 
ON shared_analyses (analysis_id);