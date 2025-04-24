import React from 'react';
import { LightbulbIcon, AlertTriangle } from 'lucide-react';
import Accordion from '../ui/Accordion';
import { useAnalysisContext } from '../../context/AnalysisContext';

const ExecutiveSummary: React.FC = () => {
  const { analysis } = useAnalysisContext();
  
  if (!analysis) return null;
  
  const { healthScore, rationale, highImpactIssues } = analysis.executiveSummary;
  
  return (
    <Accordion 
      icon={<LightbulbIcon size={16} />}
      title="Executive summary"
      defaultOpen
    >
      <div className="space-y-6">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
            <div className="flex-1 space-y-3 text-center md:text-left">
              <div className="inline-flex flex-col md:flex-row items-center md:items-baseline gap-2 md:gap-3">
                <div className="text-4xl font-bold tracking-tight">
                  <span className={getScoreColor(healthScore)}>
                    {healthScore}
                  </span>
                  <span className="text-xl text-gray-500 ml-1.5">/100</span>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${getScoreBackground(healthScore)}`}>
                  {getHealthStatus(healthScore)}
                </div>
              </div>
              <p className="text-sm text-gray-300">{rationale}</p>
            </div>
            
            <div className="relative shrink-0 w-24 h-24">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  className="stroke-gray-800"
                  strokeWidth="12"
                />
                {/* Progress circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  className={getProgressColor(healthScore)}
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${2.51 * healthScore} 251`}
                  style={{
                    transition: 'stroke-dasharray 1s ease-in-out'
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-gray-900/80 backdrop-blur-sm" />
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={14} className="text-warning" />
            <h4 className="font-medium text-gray-300">Highest-impact issues</h4>
          </div>
          <ul className="space-y-2">
            {highImpactIssues.map((issue, index) => (
              <li 
                key={index}
                className="flex items-start gap-2 text-sm text-gray-400"
              >
                <span className="text-error mt-1">•</span>
                {issue}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-primary/5 border border-primary/10 rounded-lg p-4">
          <div className="text-sm text-gray-300">
            <span className="font-medium text-primary">Quick action:</span> Start by implementing the suggested indexes to achieve immediate performance gains with minimal risk.
          </div>
        </div>
      </div>
    </Accordion>
  );
};

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-success';
  if (score >= 60) return 'text-warning';
  return 'text-error';
}

function getScoreBackground(score: number): string {
  if (score >= 80) return 'bg-success/10 text-success';
  if (score >= 60) return 'bg-warning/10 text-warning';
  return 'bg-error/10 text-error';
}

function getProgressColor(score: number): string {
  if (score >= 80) return 'stroke-success';
  if (score >= 60) return 'stroke-warning';
  return 'stroke-error';
}

function getHealthStatus(score: number): string {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Needs Improvement';
  return 'Critical Issues';
}

export default ExecutiveSummary;