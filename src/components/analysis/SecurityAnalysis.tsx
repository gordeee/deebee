import React from 'react';
import { ShieldAlert } from 'lucide-react';
import Accordion from '../ui/Accordion';
import { useAnalysisContext } from '../../context/AnalysisContext';

const SecurityAnalysis: React.FC = () => {
  const { analysis } = useAnalysisContext();
  
  if (!analysis) return null;
  
  const { piiIssues, auditTrailFindings, encryptionNotes } = analysis.security;
  
  return (
    <Accordion 
      icon={<ShieldAlert size={16} />}
      title="Security & compliance"
    >
      <div className="space-y-6">
        <div>
          <h4 className="font-medium mb-2">PII handling issues:</h4>
          <ul className="list-disc pl-5 space-y-2 text-gray-300">
            {piiIssues.map((issue, index) => (
              <li key={index} className="text-sm">{issue}</li>
            ))}
          </ul>
        </div>
        
        <div>
          <h4 className="font-medium mb-2">Audit trail findings:</h4>
          <ul className="list-disc pl-5 space-y-2 text-gray-300">
            {auditTrailFindings.map((finding, index) => (
              <li key={index} className="text-sm">{finding}</li>
            ))}
          </ul>
        </div>
        
        <div>
          <h4 className="font-medium mb-2">Encryption recommendations:</h4>
          <ul className="list-disc pl-5 space-y-2 text-gray-300">
            {encryptionNotes.map((note, index) => (
              <li key={index} className="text-sm">{note}</li>
            ))}
          </ul>
        </div>
        
        <div className="bg-error/10 border border-error/20 rounded-lg p-4">
          <div className="text-sm text-gray-300">
            <span className="font-medium text-error">Critical:</span> Address PII handling issues first to ensure compliance with data protection regulations.
          </div>
        </div>
      </div>
    </Accordion>
  );
};

export default SecurityAnalysis;