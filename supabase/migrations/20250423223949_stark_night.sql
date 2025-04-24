/*
  # Update analysis_results RLS policies

  1. Changes
    - Add policy to allow public access to shared analysis results
    - Fix policy for authenticated users to view their own results
  
  2. Security
    - Maintains RLS protection
    - Only allows public access to shared analyses
    - Preserves user data privacy
*/

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public can view shared analysis results" ON analysis_results;
DROP POLICY IF EXISTS "Users can read own analysis results" ON analysis_results;
DROP POLICY IF EXISTS "Users can create analysis results" ON analysis_results;

-- Update policies for analysis_results
ALTER TABLE analysis_results ENABLE ROW LEVEL SECURITY;

-- Allow public access to shared analysis results
CREATE POLICY "Public can view shared analysis results"
ON analysis_results
FOR SELECT
TO public
USING (
  EXISTS (
    SELECT 1 
    FROM shared_analyses 
    WHERE shared_analyses.analysis_id = analysis_results.id
  )
);

-- Allow users to read their own analysis results
CREATE POLICY "Users can read own analysis results"
ON analysis_results
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Allow users to create analysis results
CREATE POLICY "Users can create analysis results"
ON analysis_results
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);