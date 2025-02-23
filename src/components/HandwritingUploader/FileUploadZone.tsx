import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { transcribeImage } from '../../services/api';

interface FileUploadZoneProps {
  onFilesProcessed: (files: File[], transcriptions: string[]) => void;
  setLoading: (loading: boolean) => void;
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({ 
  onFilesProcessed,
  setLoading 
}) => {
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setLoading(true);

    try {
      const newTranscriptions = await Promise.all(
        acceptedFiles.map(file => transcribeImage(file))
      );
      onFilesProcessed(acceptedFiles, newTranscriptions);
    } catch (error) {
      onFilesProcessed(
        acceptedFiles, 
        acceptedFiles.map(() => "Error transcribing this image")
      );
    } finally {
      setLoading(false);
    }
  }, [onFilesProcessed, setLoading]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp']
    },
    multiple: true
  });

  return (
    <div 
      {...getRootProps()} 
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-200
        ${isDragActive 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-blue-300 hover:border-blue-500 hover:bg-blue-50'
        }`}
    >
      <input {...getInputProps()} />
      <div className="space-y-2">
        <svg 
          className={`mx-auto h-12 w-12 ${isDragActive ? 'text-blue-500' : 'text-blue-400'}`}
          stroke="currentColor" 
          fill="none" 
          viewBox="0 0 48 48" 
          aria-hidden="true"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M24 14v6m0 0v6m0-6h6m-6 0h-6" 
          />
        </svg>
        <p className={`text-base ${isDragActive ? 'text-blue-600' : 'text-blue-500'}`}>
          {isDragActive 
            ? 'Drop the files here...' 
            : 'Drag & drop files here, or click to select files'
          }
        </p>
        <p className="text-sm text-blue-400">
          Supported formats: JPEG, PNG, GIF, BMP
        </p>
      </div>
    </div>
  );
}; 