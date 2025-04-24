import React from 'react';
import { motion } from 'framer-motion';

const LoadingAnalysis: React.FC = () => {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="mb-6">
        <motion.div
          className="w-16 h-16 rounded-full border-t-4 border-b-4 border-primary"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      </div>
      
      <h3 className="text-lg font-medium mb-2">Analyzing your schema</h3>
      <p className="text-gray-400 text-center max-w-sm">
        Our AI is analyzing your database structure, identifying optimization opportunities, and generating recommendations.
      </p>
      
      <div className="mt-8 space-y-3 w-full max-w-md">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="h-8 bg-gray-800 rounded"
            initial={{ width: "60%" }}
            animate={{ width: ["60%", "100%", "80%"] }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              repeatType: "reverse",
              delay: i * 0.3,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default LoadingAnalysis;