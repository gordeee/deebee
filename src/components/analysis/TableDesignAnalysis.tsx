import React from 'react';
import { Table2 } from 'lucide-react';
import Accordion from '../ui/Accordion';
import { useAnalysisContext } from '../../context/AnalysisContext';

const TableDesignAnalysis: React.FC = () => {
  const { analysis } = useAnalysisContext();
  
  if (!analysis) return null;
  
  const { oversizedColumns, inconsistentTypes, enumRecommendations, partitioningSuggestions } = analysis.tableDesign;
  
  return (
    <Accordion 
      icon={<Table2 size={16} />}
      title="Table & column design"
    >
      <div className="space-y-6">
        <div>
          <h4 className="font-medium mb-2">Oversized columns:</h4>
          <ul className="list-disc pl-5 space-y-2 text-gray-300">
            {oversizedColumns.map((col, index) => (
              <li key={index} className="text-sm">
                <code className="text-amber-400">{col.column}</code>: Current {col.currentLength} chars, 
                {col.observedMax && <span> observed max {col.observedMax} chars</span>}
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h4 className="font-medium mb-2">Data type inconsistencies:</h4>
          <ul className="list-disc pl-5 space-y-2 text-gray-300">
            {inconsistentTypes.map((issue, index) => (
              <li key={index} className="text-sm">{issue}</li>
            ))}
          </ul>
        </div>
        
        <div>
          <h4 className="font-medium mb-2">ENUM recommendations:</h4>
          <ul className="list-disc pl-5 space-y-2 text-gray-300">
            {enumRecommendations.map((rec, index) => (
              <li key={index} className="text-sm">{rec}</li>
            ))}
          </ul>
        </div>
        
        <div>
          <h4 className="font-medium mb-2">Partitioning suggestions:</h4>
          <ul className="list-disc pl-5 space-y-2 text-gray-300">
            {partitioningSuggestions.map((suggestion, index) => (
              <li key={index} className="text-sm">{suggestion}</li>
            ))}
          </ul>
        </div>
      </div>
    </Accordion>
  );
};

export default TableDesignAnalysis;