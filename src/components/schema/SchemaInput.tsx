import React from 'react';
import { motion } from 'framer-motion';

interface SchemaInputProps {
  value: string;
  onChange: (value: string) => void;
}

const SchemaInput: React.FC<SchemaInputProps> = ({ value, onChange }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 }}
      className="relative w-full"
    >
      <textarea
        className="font-mono text-sm w-full h-80 p-4 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
        placeholder="Paste your schema here..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck="false"
        data-gramm="false"
      />
      
      <div className="absolute bottom-2 right-2 text-xs text-gray-500">
        {value.length} characters
      </div>
    </motion.div>
  );
};

export default SchemaInput;