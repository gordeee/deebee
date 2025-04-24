/*
  # Final sharing functionality fix

  1. Changes
    - Drop all existing policies
    - Recreate policies with proper permissions
    - Add required indexes
    - Fix cascade behavior

  2. Security
    - Enable RLS on all tables
    - Set up proper public and authenticated access
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "Public can view shared analyses" ON shared_analyses;
DROP POLICY IF EXISTS "Users can create shares" ON shared_analyses;
DROP POLICY IF EXISTS "Users can manage own shares" ON shared_analyses;
DROP POLICY IF EXISTS "Public can view shared analysis results" ON analysis_results;
DROP POLICY IF EXISTS "Users can read own analysis results" ON analysis_results;
DROP POLICY IF EXISTS "Users can create analysis results" ON analysis_results;

-- Enable RLS
ALTER TABLE shared_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_results ENABLE ROW LEVEL SECURITY;

-- Shared analyses policies
CREATE POLICY "Public can view shared analyses"
ON shared_analyses
FOR SELECT
TO public
USING (true);

CREATE POLICY "Users can create shares"
ON shared_analyses
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can manage own shares"
ON shared_analyses
FOR ALL
TO authenticated
USING (auth.uid() = created_by);

-- Analysis results policies
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

CREATE POLICY "Users can read own analysis results"
ON analysis_results
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create analysis results"
ON analysis_results
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Drop existing indexes to avoid conflicts
DROP INDEX IF EXISTS idx_shared_analyses_share_id;
DROP INDEX IF EXISTS idx_shared_analyses_analysis_id;
DROP INDEX IF EXISTS idx_analysis_results_user_id;

-- Recreate indexes
CREATE UNIQUE INDEX idx_shared_analyses_share_id 
ON shared_analyses (share_id);

CREATE INDEX idx_shared_analyses_analysis_id 
ON shared_analyses (analysis_id);

CREATE INDEX idx_analysis_results_user_id 
ON analysis_results (user_id);

-- Add cascade delete
ALTER TABLE shared_analyses
DROP CONSTRAINT IF EXISTS shared_analyses_analysis_id_fkey,
ADD CONSTRAINT shared_analyses_analysis_id_fkey
  FOREIGN KEY (analysis_id)
  REFERENCES analysis_results(id)
  ON DELETE CASCADE;