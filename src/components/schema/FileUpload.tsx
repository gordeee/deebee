import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File } from 'lucide-react';
import { motion } from 'framer-motion';

interface FileUploadProps {
  onFileContent: (content: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileContent }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    const reader = new FileReader();
    
    reader.onload = () => {
      const content = reader.result as string;
      onFileContent(content);
    };
    
    reader.readAsText(file);
  }, [onFileContent]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.sql', '.txt', '.ddl'],
      'application/sql': ['.sql'],
    },
    maxFiles: 1,
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="w-full"
    >
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive 
            ? 'border-primary bg-primary/10' 
            : 'border-gray-700 hover:border-gray-600 hover:bg-gray-800/30'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-2">
          {isDragActive ? (
            <>
              <File className="h-6 w-6 text-primary" />
              <p className="text-sm font-medium text-gray-300">Drop the file here</p>
            </>
          ) : (
            <>
              <Upload className="h-6 w-6 text-gray-400" />
              <p className="text-sm text-gray-400">
                <span className="font-medium text-gray-300">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">SQL, TXT, DDL (max 10MB)</p>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default FileUpload;