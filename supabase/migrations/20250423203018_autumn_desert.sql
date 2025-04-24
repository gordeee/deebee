/*
  # Schema for analysis storage

  1. New Tables
    - `analysis_results`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `schema_text` (text, the input schema)
      - `analysis` (jsonb, the analysis results)
      - `created_at` (timestamp with time zone)

  2. Security
    - Enable RLS on `analysis_results` table
    - Add policies for users to:
      - Read their own analysis results
      - Create new analysis results
*/

CREATE TABLE IF NOT EXISTS analysis_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  schema_text text NOT NULL,
  analysis jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE analysis_results ENABLE ROW LEVEL SECURITY;

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