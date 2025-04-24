import React from 'react';
import { Text } from 'lucide-react';
import Accordion from '../ui/Accordion';
import { useAnalysisContext } from '../../context/AnalysisContext';

const NamingAnalysis: React.FC = () => {
  const { analysis } = useAnalysisContext();
  
  if (!analysis) return null;
  
  const { standardDeviations, refactorMap } = analysis.naming;
  
  return (
    <Accordion 
      icon={<Text size={16} />}
      title="Naming & conventions"
    >
      <div className="space-y-6">
        <div>
          <h4 className="font-medium mb-2">Standard deviations:</h4>
          <ul className="list-disc pl-5 space-y-2 text-gray-300">
            {standardDeviations.map((deviation, index) => (
              <li key={index} className="text-sm">{deviation}</li>
            ))}
          </ul>
        </div>
        
        <div>
          <h4 className="font-medium mb-2">Recommended refactoring:</h4>
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="px-4 py-2 text-left font-medium">Current</th>
                  <th className="px-4 py-2 text-left font-medium">Proposed</th>
                </tr>
              </thead>
              <tbody>
                {refactorMap.map((item, index) => (
                  <tr key={index} className="border-b border-gray-700/50 last:border-0">
                    <td className="px-4 py-2 font-mono text-amber-400">{item.current}</td>
                    <td className="px-4 py-2 font-mono text-success">{item.proposed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Accordion>
  );
};

export default NamingAnalysis;