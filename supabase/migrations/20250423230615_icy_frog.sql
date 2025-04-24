/*
  # Improve share procedures with better error handling
  
  1. Changes
    - Add better error handling
    - Improve transaction management
    - Add input validation
  
  2. Security
    - Maintain RLS policies
    - Keep security definer for proper access control
*/

-- Drop and recreate the stored procedures with improved implementation
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
  -- Validate inputs
  IF p_schema_text IS NULL OR p_analysis IS NULL OR p_share_id IS NULL OR p_user_id IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Missing required parameters'
    );
  END IF;

  -- Start transaction
  BEGIN
    -- Insert analysis result
    INSERT INTO analysis_results (user_id, schema_text, analysis)
    VALUES (p_user_id, p_schema_text, p_analysis)
    RETURNING id INTO v_analysis_id;

    -- Create share
    INSERT INTO shared_analyses (analysis_id, share_id, created_by)
    VALUES (v_analysis_id, p_share_id, p_user_id)
    RETURNING share_id INTO v_share_id;

    -- Return complete result
    RETURN json_build_object(
      'success', true,
      'share_id', v_share_id,
      'analysis_id', v_analysis_id
    );
  EXCEPTION
    WHEN unique_violation THEN
      RETURN json_build_object(
        'success', false,
        'error', 'Share ID already exists'
      );
    WHEN OTHERS THEN
      RETURN json_build_object(
        'success', false,
        'error', 'Failed to create share: ' || SQLERRM
      );
  END;
END;
$$;

-- Improve the get_shared_analysis function
CREATE OR REPLACE FUNCTION get_shared_analysis(p_share_id text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result json;
BEGIN
  -- Validate input
  IF p_share_id IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Share ID is required'
    );
  END IF;

  SELECT json_build_object(
    'success', true,
    'analysis', ar.analysis,
    'schema_text', ar.schema_text,
    'created_at', sa.created_at
  )
  INTO v_result
  FROM shared_analyses sa
  JOIN analysis_results ar ON ar.id = sa.analysis_id
  WHERE sa.share_id = p_share_id;

  IF v_result IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Share not found'
    );
  END IF;

  RETURN v_result;
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Failed to retrieve analysis: ' || SQLERRM
    );
END;
$$;