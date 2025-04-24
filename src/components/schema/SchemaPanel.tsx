import React, { useState, useEffect } from 'react';
import { Zap, Upload, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import SchemaInput from './SchemaInput';
import FileUpload from './FileUpload';
import { useAnalysisContext } from '../../context/AnalysisContext';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

const SchemaPanel: React.FC = () => {
  const [schema, setSchema] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { analyzeSchema, isLoading } = useAnalysisContext();
  const { user } = useAuth();

  // Load the most recent analysis for the user
  useEffect(() => {
    async function loadRecentAnalysis() {
      if (!user) return;

      const { data, error } = await supabase
        .from('analysis_results')
        .select('schema_text')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (!error && data && data.length > 0) {
        setSchema(data[0].schema_text);
      }
    }

    loadRecentAnalysis();
  }, [user]);

  const handleSubmit = async () => {
    if (!schema.trim()) {
      setError('Please enter a schema or upload a file');
      return;
    }
    
    setError(null);
    await analyzeSchema(schema);
  };

  const handleFileContent = (content: string) => {
    setSchema(content);
    setError(null);
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-gray-800/50 shadow-xl h-full flex flex-col">
      <div className="flex items-center space-x-2 text-lg font-medium mb-6">
        <Zap size={20} className="text-primary" />
        <h2>Schema</h2>
      </div>
      
      <div className="mb-4">
        <p className="text-gray-400 text-sm mb-6">
          Paste your database schema below or upload a file to analyze for optimization opportunities.
        </p>
        
        <div className="mb-4 max-w-full">
          <FileUpload onFileContent={handleFileContent} />
        </div>
        
        <div className="mt-2">
          <SchemaInput value={schema} onChange={setSchema} />
        </div>
        
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-error flex items-center text-sm"
          >
            <AlertCircle size={16} className="mr-1" />
            {error}
          </motion.div>
        )}
      </div>
      
      <div className="mt-auto pt-6 border-t border-gray-800/50">
        <div className="flex items-center">
          <ul className="text-xs text-gray-500 mb-4 list-disc pl-5 space-y-1">
            <li>Supports PostgreSQL, MySQL, SQLite, SQL Server</li>
            <li>Includes tables, indexes, constraints, and views</li>
            <li>Larger schemas may take slightly longer to analyze</li>
          </ul>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            <span className="text-primary">✓</span> End-to-end encrypted
          </div>
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading}
            isLoading={isLoading}
            size="lg"
            className="px-8"
          >
            {isLoading ? 'Analyzing...' : 'Analyze Schema'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SchemaPanel;