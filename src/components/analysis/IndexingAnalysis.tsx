import React from 'react';
import { LayoutGrid } from 'lucide-react';
import Accordion from '../ui/Accordion';
import { useAnalysisContext } from '../../context/AnalysisContext';

const IndexingAnalysis: React.FC = () => {
  const { analysis } = useAnalysisContext();
  
  if (!analysis) return null;
  
  return (
    <Accordion 
      icon={<LayoutGrid size={16} />}
      title="Indexing & access paths"
    >
      <div className="space-y-6">
        <div>
          <h4 className="font-medium mb-2">Missing indexes on FK columns:</h4>
          <ul className="list-disc pl-5 space-y-2 text-gray-300">
            <li className="text-sm">
              <code className="text-amber-400">users.company_permalink</code> should have an index to improve join performance with the company table.
            </li>
            <li className="text-sm">
              <code className="text-amber-400">load_logs.assignee_id</code> and <code className="text-amber-400">load_logs.ignore_load_by</code> should have indexes to improve join performance with the users table.
            </li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-medium mb-2">Under-indexed filter / sort predicates:</h4>
          <ul className="list-disc pl-5 space-y-2 text-gray-300">
            <li className="text-sm">
              Consider adding indexes on frequently queried columns like <code className="text-amber-400">users.email_address</code> and <code className="text-amber-400">loads.native_system_load_status</code>.
            </li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-medium mb-2">Redundant or unused indexes:</h4>
          <ul className="list-disc pl-5 space-y-2 text-gray-300">
            <li className="text-sm">
              No specific data provided to identify unused indexes. Consider using <code className="text-amber-400">pg_stat_user_indexes</code> for PostgreSQL to identify unused indexes.
            </li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-medium mb-2">B-tree vs GIN vs BRIN recommendations:</h4>
          <ul className="list-disc pl-5 space-y-2 text-gray-300">
            <li className="text-sm">
              Use B-tree indexes for equality and range queries, which are most common in this schema.
            </li>
          </ul>
        </div>
      </div>
    </Accordion>
  );
};

export default IndexingAnalysis;