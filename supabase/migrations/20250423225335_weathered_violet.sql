/*
  # Fix sharing implementation
  
  1. Changes
    - Drop and recreate tables with proper relationships
    - Add correct indexes and constraints
    - Update RLS policies
  
  2. Security
    - Enable RLS on all tables
    - Set up proper public and authenticated access
*/

-- Drop existing tables to start fresh
DROP TABLE IF EXISTS shared_analyses CASCADE;
DROP TABLE IF EXISTS analysis_results CASCADE;

-- Recreate analysis_results table
CREATE TABLE analysis_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  schema_text text NOT NULL,
  analysis jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create shared_analyses table
CREATE TABLE shared_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id uuid NOT NULL REFERENCES analysis_results(id) ON DELETE CASCADE,
  share_id text UNIQUE NOT NULL DEFAULT substring(gen_random_uuid()::text FROM 1 FOR 8),
  created_at timestamptz DEFAULT now(),
  created_by uuid NOT NULL REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE analysis_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_analyses ENABLE ROW LEVEL SECURITY;

-- Analysis results policies
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

CREATE POLICY "Public can view shared analysis results"
  ON analysis_results
  FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 
      FROM shared_analyses 
      WHERE shared_analyses.analysis_id = id
    )
  );

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

-- Create indexes
CREATE INDEX idx_analysis_results_user_id ON analysis_results(user_id);
CREATE INDEX idx_shared_analyses_analysis_id ON shared_analyses(analysis_id);
CREATE UNIQUE INDEX idx_shared_analyses_share_id ON shared_analyses(share_id);