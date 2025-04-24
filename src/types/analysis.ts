export interface AnalysisResult {
  schema_text?: string; // Added to store the original schema
  executiveSummary: {
    healthScore: number;
    rationale: string;
    highImpactIssues: string[];
  };
  indexing: {
    missingFKIndexes: string[];
    underIndexedPredicates: string[];
    redundantIndexes: {
      name: string;
      scanCount?: number;
      tuplesRead?: number;
    }[];
    suggestedIndexes: {
      ddl: string;
      reason: string;
    }[];
    indexTypeRecommendations?: string[];
  };
  dataIntegrity: {
    nullableColumns: string[];
    foreignKeyIssues: string[];
    constraintOpportunities: string[];
    defaultValueRecommendations: string[];
  };
  tableDesign: {
    oversizedColumns: {
      column: string;
      currentLength: number;
      observedMax?: number;
    }[];
    inconsistentTypes: string[];
    enumRecommendations: string[];
    partitioningSuggestions: string[];
  };
  performance: {
    hotPageRisks: {
      table: string;
      deadPercentage?: number;
      risk: string;
    }[];
    expensiveJoins: string[];
    ttlCandidates: string[];
    estimatedSavings: string;
  };
  naming: {
    standardDeviations: string[];
    refactorMap: {
      current: string;
      proposed: string;
    }[];
  };
  security: {
    piiIssues: string[];
    auditTrailFindings: string[];
    encryptionNotes: string[];
  };
  quickWins: {
    priority: number;
    change: string;
    effortHours: number;
    risk: 'Low' | 'Medium' | 'High';
    expectedGain: string;
  }[];
}