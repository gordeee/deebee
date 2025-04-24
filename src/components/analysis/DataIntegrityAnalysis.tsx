import React from 'react';
import { Shield } from 'lucide-react';
import Accordion from '../ui/Accordion';
import { useAnalysisContext } from '../../context/AnalysisContext';

const DataIntegrityAnalysis: React.FC = () => {
  const { analysis } = useAnalysisContext();
  
  if (!analysis) return null;
  
  return (
    <Accordion 
      icon={<Shield size={16} />}
      title="Data-integrity & constraints"
    >
      <div className="space-y-6">
        <div>
          <h4 className="font-medium mb-2">Nullable columns that should be NOT NULL:</h4>
          <ul className="list-disc pl-5 space-y-2 text-gray-300">
            <li className="text-sm">
              <code className="text-amber-400">company.created_at</code>, <code className="text-amber-400">users.created_at</code>, and similar audit columns should be NOT NULL to ensure data integrity.
            </li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-medium mb-2">Missing or mismatched FOREIGN KEYs:</h4>
          <ul className="list-disc pl-5 space-y-2 text-gray-300">
            <li className="text-sm">
              No mismatches found, but ensure all foreign keys are indexed for performance.
            </li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-medium mb-2">CHECK / UNIQUE opportunities:</h4>
          <ul className="list-disc pl-5 space-y-2 text-gray-300">
            <li className="text-sm">
              Consider adding CHECK constraints for columns like <code className="text-amber-400">users.user_type</code> to enforce valid values.
            </li>
          </ul>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-md text-sm">
          <div className="mb-2 font-medium text-white">Recommended Action:</div>
          <pre className="whitespace-pre-wrap text-xs text-gray-300 overflow-auto max-h-36">
            {`-- Add NOT NULL constraint to audit columns
ALTER TABLE company ALTER COLUMN created_at SET NOT NULL;
ALTER TABLE users ALTER COLUMN created_at SET NOT NULL;

-- Add check constraint for user_type
ALTER TABLE users 
ADD CONSTRAINT check_user_type 
CHECK (user_type IN ('admin', 'standard', 'guest'));`}
          </pre>
        </div>
      </div>
    </Accordion>
  );
};

export default DataIntegrityAnalysis;