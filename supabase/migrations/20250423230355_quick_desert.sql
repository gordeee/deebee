/*
  # Final sharing functionality fix
  
  1. Changes
    - Add stored procedures for atomic operations
    - Simplify schema and constraints
    - Improve error handling
  
  2. Security
    - Enable RLS on all tables
    - Add proper access control
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

-- Create shared_analyses table with a simpler structure
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

-- Create stored procedure for atomic share creation
CREATE OR REPLACE FUNCTION create_share(
  p_schema_text text,
  p_analysis jsonb,
  p_share_id text,
  p_user_id uuid
) RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_analysis_id uuid;
  v_share_id text;
BEGIN
  -- Insert analysis result
  INSERT INTO analysis_results (user_id, schema_text, analysis)
  VALUES (p_user_id, p_schema_text, p_analysis)
  RETURNING id INTO v_analysis_id;

  -- Create share
  INSERT INTO shared_analyses (analysis_id, share_id, created_by)
  VALUES (v_analysis_id, p_share_id, p_user_id)
  RETURNING share_id INTO v_share_id;

  RETURN json_build_object(
    'share_id', v_share_id,
    'analysis_id', v_analysis_id
  );
END;
$$;

-- Create stored procedure for fetching shared analysis
CREATE OR REPLACE FUNCTION get_shared_analysis(p_share_id text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result json;
BEGIN
  SELECT json_build_object(
    'analysis', ar.analysis,
    'created_at', sa.created_at
  )
  INTO v_result
  FROM shared_analyses sa
  JOIN analysis_results ar ON ar.id = sa.analysis_id
  WHERE sa.share_id = p_share_id;

  IF v_result IS NULL THEN
    RAISE EXCEPTION 'Share not found';
  END IF;

  RETURN v_result;
END;
$$;