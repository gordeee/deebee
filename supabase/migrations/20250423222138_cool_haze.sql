/*
  # Add shared analysis support
  
  1. New Tables
    - `shared_analyses`
      - `id` (uuid, primary key)
      - `analysis_id` (uuid, references analysis_results)
      - `share_id` (text, unique identifier for sharing)
      - `created_at` (timestamp)
      - `expires_at` (timestamp, optional)
      - `created_by` (uuid, references auth.users)
  
  2. Security
    - Enable RLS on shared_analyses table
    - Add policies for authenticated users to create and manage shares
    - Add policy for public access to shared analyses
*/

CREATE TABLE IF NOT EXISTS shared_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id uuid NOT NULL REFERENCES analysis_results(id) ON DELETE CASCADE,
  share_id text NOT NULL UNIQUE DEFAULT substring(gen_random_uuid()::text from 1 for 8),
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  created_by uuid NOT NULL REFERENCES auth.users(id)
);

ALTER TABLE shared_analyses ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to create shares
CREATE POLICY "Users can create shares"
  ON shared_analyses
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

-- Allow authenticated users to manage their shares
CREATE POLICY "Users can manage own shares"
  ON shared_analyses
  FOR ALL
  TO authenticated
  USING (auth.uid() = created_by);

-- Allow public access to shared analyses
CREATE POLICY "Public can view shared analyses"
  ON shared_analyses
  FOR SELECT
  TO anon
  USING (true);

-- Allow public to read analysis results that are shared
CREATE POLICY "Public can view shared analysis results"
  ON analysis_results
  FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM shared_analyses 
      WHERE analysis_id = id 
      AND (expires_at IS NULL OR expires_at > now())
    )
  );