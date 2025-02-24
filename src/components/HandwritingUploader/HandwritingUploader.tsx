import React, { useState, useCallback, useEffect } from "react";
import { transcribeImage, submitTranscriptions, generateTitle } from "../../services/api";
import { PageNavigation } from "./PageNavigation";
import { TranscriptionDisplay } from "./TranscriptionDisplay";
import { FileUploadZone } from "./FileUploadZone";
import { SubmitButton } from "./SubmitButton";
import { Toast } from "../common/Toast";

interface ToastState {
  message: string;
  type: 'success' | 'error';
}

export const HandwritingUploader: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [transcriptions, setTranscriptions] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [toast, setToast] = useState<ToastState | null>(null);
  const [generatingTitle, setGeneratingTitle] = useState(false);

  const handleFilesProcessed = useCallback((newFiles: File[], newTranscriptions: string[]) => {
    setFiles(prev => [...prev, ...newFiles]);
    setTranscriptions(prev => [...prev, ...newTranscriptions]);
  }, []);

  const handleDelete = useCallback(() => {
    if (transcriptions.length === 0) return;

    setFiles(prev => prev.filter((_, index) => index !== currentPage));
    setTranscriptions(prev => prev.filter((_, index) => index !== currentPage));
    setCurrentPage(prev => 
      prev >= transcriptions.length - 1 ? Math.max(0, transcriptions.length - 2) : prev
    );
  }, [currentPage, transcriptions.length]);

  const handleSubmitSuccess = () => {
    setSubmitting(false);
    setFiles([]);
    setTranscriptions([]);
    setCurrentPage(0);
    setTitle('');
    setToast({
      message: 'Journal entry saved successfully!',
      type: 'success'
    });
  };

  const handleSubmitError = (error: Error) => {
    setSubmitting(false);
    setToast({
      message: error.message || 'Failed to save journal entry',
      type: 'error'
    });
    console.error('Failed to submit:', error);
  };

  // Generate title when transcriptions change
  useEffect(() => {
    const generateTitleFromContent = async () => {
      if (transcriptions.length > 0 && !title) {
        try {
          setGeneratingTitle(true);
          const combinedContent = transcriptions.join('\n\n---\n\n');
          const suggestedTitle = await generateTitle(combinedContent);
          setTitle(suggestedTitle);
        } catch (error) {
          console.error('Failed to generate title:', error);
          // Don't show error to user, just fallback to manual title entry
        } finally {
          setGeneratingTitle(false);
        }
      }
    };

    generateTitleFromContent();
  }, [transcriptions, title]);

  return (
    <div className="w-full max-w-[1200px] mx-auto bg-white rounded-lg shadow-lg p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-0">
          Upload Handwriting
        </h1>
      </div>
      
      <div className="max-w-3xl mx-auto">
        <div className="space-y-6">
          <FileUploadZone 
            onFilesProcessed={handleFilesProcessed}
            setLoading={setLoading}
          />
          
          <TranscriptionDisplay
            loading={loading}
            text={transcriptions[currentPage]}
            hasFiles={files.length > 0}
          />
          
          {files.length > 0 && (
            <>
              <PageNavigation
                currentPage={currentPage}
                totalPages={files.length}
                onPageChange={setCurrentPage}
                onDelete={handleDelete}
              />
              
              <div className="space-y-4">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a title for your journal entry"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                
                <SubmitButton
                  title={title}
                  transcriptions={transcriptions}
                  disabled={files.length === 0}
                  loading={submitting}
                  onSuccess={handleSubmitSuccess}
                  onError={handleSubmitError}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Toast notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}; 