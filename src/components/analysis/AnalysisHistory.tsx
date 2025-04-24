import React, { useEffect, useState } from 'react';
import { History, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { useAnalysisContext } from '../../context/AnalysisContext';

interface AnalysisHistoryItem {
  id: string;
  created_at: string;
  schema_text: string;
}

const AnalysisHistory: React.FC = () => {
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
  const { user } = useAuth();
  const { analyzeSchema } = useAnalysisContext();

  useEffect(() => {
    if (!user) return;

    const fetchHistory = async () => {
      const { data, error } = await supabase
        .from('analysis_results')
        .select('id, created_at, schema_text')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (!error && data) {
        setHistory(data);
      }
    };

    fetchHistory();

    // Subscribe to changes
    const channel = supabase
      .channel('analysis_results_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'analysis_results',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchHistory();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [user]);

  if (!user || history.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 px-4 mb-2 text-sm font-medium text-gray-400">
        <History size={14} />
        <span>Recent Analyses</span>
      </div>
      
      <ul className="space-y-1">
        {history.map((item) => (
          <motion.li
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="group"
          >
            <button
              onClick={() => analyzeSchema(item.schema_text)}
              className="w-full px-4 py-2 text-left text-sm text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 rounded-md transition-colors flex items-center justify-between group-hover:bg-gray-800/50"
            >
              <span className="truncate">
                Analysis {new Date(item.created_at).toLocaleDateString()}
              </span>
              <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </motion.li>
        ))}
      </ul>
    </div>
  );
};

export default AnalysisHistory;