import React from 'react';
import { ArrowRight, Database, LineChart, Shield, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const EmptyAnalysis: React.FC = () => {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center h-full p-8 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <div className="relative mb-6">
        <div className="absolute -inset-6 rounded-full bg-primary/5 animate-pulse" />
        <div className="relative bg-gray-800 rounded-full p-4">
          <Database size={32} className="text-gray-400" />
        </div>
        <motion.div 
          className="absolute top-0 right-0"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <ArrowRight size={20} className="text-primary" />
        </motion.div>
        <motion.div 
          className="absolute top-0 right-[-32px]"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <LineChart size={32} className="text-secondary" />
        </motion.div>
      </div>
      
      <h3 className="text-lg font-medium mb-2">Ready to analyze your schema</h3>
      <p className="text-gray-400 max-w-sm">
        Paste your database schema or upload a schema file, then click "Submit" to receive optimization recommendations.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 w-full max-w-md">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 text-center border border-gray-800/50"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <div className="mb-3 flex justify-center">
              {feature.icon}
            </div>
            <h4 className="text-sm font-medium text-gray-300">{feature.title}</h4>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const features = [
  {
    title: 'Performance',
    icon: <LineChart size={24} className="text-secondary" />
  },
  {
    title: 'Integrity',
    icon: <Shield size={24} className="text-error" />
  },
  {
    title: 'Optimization',
    icon: <Zap size={24} className="text-warning" />
  }
];

export default EmptyAnalysis;