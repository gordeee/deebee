import React from 'react';
import { Gauge } from 'lucide-react';
import Accordion from '../ui/Accordion';
import { useAnalysisContext } from '../../context/AnalysisContext';

const PerformanceAnalysis: React.FC = () => {
  const { analysis } = useAnalysisContext();
  
  if (!analysis) return null;
  
  const { hotPageRisks, expensiveJoins, ttlCandidates, estimatedSavings } = analysis.performance;
  
  return (
    <Accordion 
      icon={<Gauge size={16} />}
      title="Performance & storage efficiency"
    >
      <div className="space-y-6">
        <div>
          <h4 className="font-medium mb-2">Hot-page risks:</h4>
          <ul className="list-disc pl-5 space-y-2 text-gray-300">
            {hotPageRisks.map((risk, index) => (
              <li key={index} className="text-sm">
                <code className="text-amber-400">{risk.table}</code>: {risk.risk}
                {risk.deadPercentage && <span> ({risk.deadPercentage}% dead tuples)</span>}
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h4 className="font-medium mb-2">Expensive JOIN patterns:</h4>
          <ul className="list-disc pl-5 space-y-2 text-gray-300">
            {expensiveJoins.map((join, index) => (
              <li key={index} className="text-sm">{join}</li>
            ))}
          </ul>
        </div>
        
        <div>
          <h4 className="font-medium mb-2">TTL candidates:</h4>
          <ul className="list-disc pl-5 space-y-2 text-gray-300">
            {ttlCandidates.map((candidate, index) => (
              <li key={index} className="text-sm">{candidate}</li>
            ))}
          </ul>
        </div>
        
        <div className="bg-secondary/10 rounded-lg p-4">
          <div className="text-sm text-gray-300">
            <span className="font-medium text-secondary">Estimated impact:</span> {estimatedSavings}
          </div>
        </div>
      </div>
    </Accordion>
  );
};

export default PerformanceAnalysis;