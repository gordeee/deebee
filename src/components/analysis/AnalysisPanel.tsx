import React from 'react';
import { LineChart, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import ExecutiveSummary from './ExecutiveSummary';
import IndexingAnalysis from './IndexingAnalysis';
import DataIntegrityAnalysis from './DataIntegrityAnalysis';
import TableDesignAnalysis from './TableDesignAnalysis';
import PerformanceAnalysis from './PerformanceAnalysis';
import NamingAnalysis from './NamingAnalysis';
import SecurityAnalysis from './SecurityAnalysis';
import QuickWinsAnalysis from './QuickWinsAnalysis';
import ShareButton from './ShareButton';
import EmptyAnalysis from './EmptyAnalysis';
import LoadingAnalysis from './LoadingAnalysis';
import { useAnalysisContext } from '../../context/AnalysisContext';

const AnalysisPanel: React.FC = () => {
  const { analysis, isLoading } = useAnalysisContext();
  
  const hasAnalysis = !!analysis;

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-gray-800/50 shadow-xl h-full overflow-hidden flex flex-col">
      <div className="flex items-center space-x-2 text-lg font-medium mb-6">
        <LineChart size={20} className="text-secondary" />
        <h2>Analysis</h2>
        
        {hasAnalysis && (
          <div className="ml-auto flex items-center gap-4">
            <ShareButton />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 px-3 py-1.5 bg-secondary/10 rounded-full text-secondary text-xs font-medium"
            >
              <Sparkles size={12} />
              AI-Powered
            </motion.div>
          </div>
        )}
      </div>
      
      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <LoadingAnalysis />
        ) : hasAnalysis ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="space-y-6 pb-4"
          >
            <ExecutiveSummary />
            <IndexingAnalysis />
            <DataIntegrityAnalysis />
            <TableDesignAnalysis />
            <PerformanceAnalysis />
            <NamingAnalysis />
            <SecurityAnalysis />
            <QuickWinsAnalysis />
          </motion.div>
        ) : (
          <EmptyAnalysis />
        )}
      </div>
    </div>
  );
};

export default AnalysisPanel;