import React from 'react';
import { Activity } from 'lucide-react';
import Accordion from '../ui/Accordion';
import { useAnalysisContext } from '../../context/AnalysisContext';

const SuggestedIndexes: React.FC = () => {
  const { analysis } = useAnalysisContext();
  
  if (!analysis) return null;
  
  return (
    <Accordion 
      icon={<Activity size={16} />}
      title="Suggested single & composite indexes"
    >
      <div className="space-y-4">
        <div className="p-4 bg-gray-800 rounded-md border-l-4 border-secondary text-sm overflow-x-auto">
          <pre className="whitespace-pre-wrap text-xs text-gray-300">
            {`CREATE INDEX ix_users_company_permalink ON users (company_permalink);
CREATE INDEX ix_load_logs_assignee_id ON load_logs (assignee_id);
CREATE INDEX ix_load_logs_ignore_load_by ON load_logs (ignore_load_by);`}
          </pre>
        </div>
        
        <div className="mt-4">
          <h4 className="font-medium mb-2">Implementation notes:</h4>
          <ul className="list-disc pl-5 space-y-2 text-sm text-gray-300">
            <li>
              These indexes should be created during low-traffic periods
            </li>
            <li>
              Monitor query performance before and after to measure impact
            </li>
            <li>
              Consider using <code className="text-amber-400">CONCURRENTLY</code> option for PostgreSQL to avoid table locks
            </li>
          </ul>
        </div>
        
        <div className="mt-4 p-3 bg-secondary/10 rounded-md text-sm">
          <div className="flex items-start gap-2">
            <div className="text-secondary mt-0.5">
              <Activity size={16} />
            </div>
            <p className="text-gray-300">
              Estimated impact: <span className="text-secondary font-medium">High</span> - These indexes could improve join performance by 40-60% for queries involving these tables.
            </p>
          </div>
        </div>
      </div>
    </Accordion>
  );
};

export default SuggestedIndexes;