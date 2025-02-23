import React from 'react';
import { submitJournalEntry } from '../../services/api';

interface SubmitButtonProps {
  title: string;
  transcriptions: string[];
  disabled: boolean;
  loading: boolean;
  onSuccess: () => void;
  onError: (error: Error) => void;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({ 
  title,
  transcriptions,
  disabled,
  loading,
  onSuccess,
  onError
}) => {
  const handleSubmit = async () => {
    try {
      // Combine all transcriptions with a separator
      const combinedContent = transcriptions.join('\n\n---\n\n');
      
      // Submit to journal entries with title
      await submitJournalEntry(title, combinedContent);
      
      // Call success callback
      onSuccess();
    } catch (err) {
      onError(err instanceof Error ? err : new Error('Failed to submit journal entry'));
    }
  };

  return (
    <button 
      onClick={handleSubmit}
      disabled={disabled || loading || !title}
      className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white 
        ${disabled || loading || !title
          ? 'bg-blue-300 cursor-not-allowed' 
          : 'bg-blue-600 hover:bg-blue-700'} 
        transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
    >
      {loading ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Saving Journal Entry...
        </span>
      ) : (
        'Save to Journal'
      )}
    </button>
  );
}; 