import React from 'react';
import { Zap } from 'lucide-react';
import Accordion from '../ui/Accordion';
import { useAnalysisContext } from '../../context/AnalysisContext';

const QuickWinsAnalysis: React.FC = () => {
  const { analysis } = useAnalysisContext();
  
  if (!analysis) return null;
  
  return (
    <Accordion 
      icon={<Zap size={16} />}
      title="Quick-win action plan (0-48h)"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="px-4 py-2 text-left font-medium">Priority</th>
              <th className="px-4 py-2 text-left font-medium">Change</th>
              <th className="px-4 py-2 text-left font-medium">Effort</th>
              <th className="px-4 py-2 text-left font-medium">Risk</th>
              <th className="px-4 py-2 text-left font-medium">Expected Gain</th>
            </tr>
          </thead>
          <tbody>
            {analysis.quickWins.map((win, index) => (
              <tr key={index} className="border-b border-gray-800/50 last:border-0">
                <td className="px-4 py-2">{win.priority}</td>
                <td className="px-4 py-2">{win.change}</td>
                <td className="px-4 py-2">{win.effortHours}h</td>
                <td className="px-4 py-2">
                  <span className={getRiskColor(win.risk)}>
                    {win.risk}
                  </span>
                </td>
                <td className="px-4 py-2 text-success">{win.expectedGain}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Accordion>
  );
};

function getRiskColor(risk: 'Low' | 'Medium' | 'High'): string {
  switch (risk) {
    case 'Low':
      return 'text-success';
    case 'Medium':
      return 'text-warning';
    case 'High':
      return 'text-error';
  }
}

export default QuickWinsAnalysis;