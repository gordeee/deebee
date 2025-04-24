import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { AnalysisResult } from '../types/analysis';
import AnalysisPanel from '../components/analysis/AnalysisPanel';
import { AnalysisProvider } from '../context/AnalysisContext';
import Logo from '../components/ui/Logo';
import { ArrowLeft } from 'lucide-react';

const SharedAnalysis = () => {
  const { shareId } = useParams<{ shareId: string }>();
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSharedAnalysis = async () => {
      try {
        if (!shareId) {
          throw new Error('No share ID provided');
        }

        // Call the get_shared_analysis function
        const { data, error: rpcError } = await supabase.rpc('get_shared_analysis', {
          p_share_id: shareId
        });

        if (rpcError) throw rpcError;
        if (!data?.success) throw new Error(data?.error || 'Analysis not found');

        setAnalysis({
          ...data.analysis,
          schema_text: data.schema_text
        });
      } catch (err) {
        console.error('Error fetching shared analysis:', err);
        setError(err instanceof Error ? err.message : 'Analysis not found');
      } finally {
        setLoading(false);
      }
    };

    fetchSharedAnalysis();
  }, [shareId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-200 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-200 p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <Logo />
          </div>
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-8 text-center border border-gray-800/50">
            <h1 className="text-2xl font-bold mb-4">Analysis Not Found</h1>
            <p className="text-gray-400 mb-6">{error}</p>
            <Link 
              to="/" 
              className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <Logo />
          <Link 
            to="/" 
            className="inline-flex items-center text-gray-400 hover:text-gray-200 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Home
          </Link>
        </div>
        <AnalysisProvider initialAnalysis={analysis}>
          <AnalysisPanel />
        </AnalysisProvider>
      </div>
    </div>
  );
};

export default SharedAnalysis;