import { analyzeSchemaWithOpenAI } from './openai';
import { AnalysisResult } from '../types/analysis';
import { supabase } from '../lib/supabase';
import { runWithSession } from '../lib/session';

export async function analyzeSchema(schema: string): Promise<AnalysisResult> {
  try {
    // Analyze the schema
    const result = await analyzeSchemaWithOpenAI(schema);

    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // Save the analysis result to Supabase with session retry
      await runWithSession(async () => {
        const { error } = await supabase.from('analysis_results').insert({
          user_id: user.id,
          schema_text: schema,
          analysis: result
        });
        if (error) throw error;
      });
    }

    return result;
  } catch (error) {
    console.error('Error in schema analysis:', error);
    throw error;
  }
}