import React, { createContext, useContext, useState } from 'react';
import { AnalysisResult } from '../types/analysis';
import { analyzeSchema as analyzeSchemaService } from '../services/analyzeSchema';

interface AnalysisContextType {
  analysis: AnalysisResult | null;
  isLoading: boolean;
  error: string | null;
  analyzeSchema: (schema: string) => Promise<void>;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export const useAnalysisContext = () => {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error('useAnalysisContext must be used within an AnalysisProvider');
  }
  return context;
};

interface AnalysisProviderProps {
  children: React.ReactNode;
  initialAnalysis?: AnalysisResult | null;
}

export const AnalysisProvider: React.FC<AnalysisProviderProps> = ({ 
  children,
  initialAnalysis = null
}) => {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(initialAnalysis);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeSchema = async (schema: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await analyzeSchemaService(schema);
      result.schema_text = schema; // Store the original schema text
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during analysis');
      console.error('Error analyzing schema:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnalysisContext.Provider value={{ analysis, isLoading, error, analyzeSchema }}>
      {children}
    </AnalysisContext.Provider>
  );
};