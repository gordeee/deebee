/*
  # Final fix for sharing functionality
  
  1. Changes
    - Drop and recreate tables with correct structure
    - Add proper indexes and constraints
    - Set up correct RLS policies
  
  2. Security
    - Enable RLS on all tables
    - Set up proper access control
*/

-- Drop existing tables
DROP TABLE IF EXISTS shared_analyses CASCADE;
DROP TABLE IF EXISTS analysis_results CASCADE;

-- Create analysis_results table
CREATE TABLE analysis_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  schema_text text NOT NULL,
  analysis jsonb NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create shared_analyses table
CREATE TABLE shared_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id uuid NOT NULL,
  share_id text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  created_by uuid NOT NULL REFERENCES auth.users(id),
  CONSTRAINT fk_analysis
    FOREIGN KEY (analysis_id)
    REFERENCES analysis_results(id)
    ON DELETE CASCADE,
  CONSTRAINT unique_share_id
    UNIQUE (share_id)
);

-- Create indexes
CREATE INDEX idx_analysis_results_user_id ON analysis_results(user_id);
CREATE INDEX idx_shared_analyses_analysis_id ON shared_analyses(analysis_id);
CREATE INDEX idx_shared_analyses_share_id ON shared_analyses(share_id);

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