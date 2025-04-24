/*
  # Improve sharing functionality with better error handling and validation
  
  1. Changes
    - Add input validation
    - Improve error handling
    - Add transaction management
    - Return consistent response format
  
  2. Security
    - Maintain SECURITY DEFINER
    - Validate all inputs
    - Handle edge cases
*/

-- Drop existing functions to avoid conflicts
DROP FUNCTION IF EXISTS create_share;
DROP FUNCTION IF EXISTS get_shared_analysis;

-- Create share function with improved implementation
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
  -- Input validation
  IF p_schema_text IS NULL OR p_schema_text = '' THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Schema text is required'
    );
  END IF;

  IF p_analysis IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Analysis data is required'
    );
  END IF;

  IF p_share_id IS NULL OR p_share_id = '' THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Share ID is required'
    );
  END IF;

  IF p_user_id IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'User ID is required'
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

    -- Return success result
    RETURN json_build_object(
      'success', true,
      'share_id', v_share_id,
      'analysis_id', v_analysis_id
    );
  EXCEPTION
    WHEN unique_violation THEN
      -- Generate a new share ID and try again
      v_share_id := substr(md5(random()::text), 1, 8);
      
      INSERT INTO shared_analyses (analysis_id, share_id, created_by)
      VALUES (v_analysis_id, v_share_id, p_user_id)
      RETURNING share_id INTO v_share_id;

      RETURN json_build_object(
        'success', true,
        'share_id', v_share_id,
        'analysis_id', v_analysis_id
      );
    WHEN OTHERS THEN
      RETURN json_build_object(
        'success', false,
        'error', 'Failed to create share: ' || SQLERRM
      );
  END;
END;
$$;

-- Get shared analysis function with improved error handling
CREATE OR REPLACE FUNCTION get_shared_analysis(p_share_id text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result json;
BEGIN
  -- Input validation
  IF p_share_id IS NULL OR p_share_id = '' THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Share ID is required'
    );
  END IF;

  -- Attempt to find the shared analysis
  SELECT json_build_object(
    'success', true,
    'analysis', ar.analysis,
    'schema_text', ar.schema_text,
    'created_at', sa.created_at,
    'created_by', sa.created_by
  )
  INTO v_result
  FROM shared_analyses sa
  JOIN analysis_results ar ON ar.id = sa.analysis_id
  WHERE sa.share_id = p_share_id;

  -- Handle not found case
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