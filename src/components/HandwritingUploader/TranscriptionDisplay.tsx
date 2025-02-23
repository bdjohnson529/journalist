import React from "react";

interface TranscriptionDisplayProps {
  loading: boolean;
  text?: string;
  hasFiles: boolean;
}

export const TranscriptionDisplay: React.FC<TranscriptionDisplayProps> = ({
  loading,
  text,
  hasFiles
}) => {
  return (
    <div className="border rounded-lg p-6 min-h-[300px] w-full bg-gray-50">
      {loading ? (
        <div className="flex flex-col items-center justify-center h-full space-y-4">
          <img 
            src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExdjJlMXUxcW5zNWsybjV4eXN0bWZ1ZG41dG12ODZuMzNrNnRodXIzcSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/RlH4gZYWOsAgg/giphy.gif" 
            alt="Loading llama" 
            className="h-40 w-40 object-contain"
          />
          <p className="text-gray-600 animate-pulse text-lg">
            Transcribing ...
          </p>
        </div>
      ) : (
        <div className="prose max-w-none h-full">
          {hasFiles ? (
            <p className="text-gray-800 whitespace-pre-wrap min-h-[200px]">
              {text}
            </p>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <p className="text-lg">
                Upload an image to get started
              </p>
              <p className="text-sm mt-2">
                Drag and drop files above or click to select
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}; 