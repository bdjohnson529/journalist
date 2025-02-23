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
    <div className="min-h-screen bg-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-[800px] mx-auto bg-white rounded-lg shadow-lg p-6 space-y-6">
        <h1 className="text-2xl font-bold text-center text-blue-900 mb-8">
          Handwriting Transcription
        </h1>
        
        <FileUploadZone 
          onFilesProcessed={handleFilesProcessed}
          setLoading={setLoading}
        />

        {files.length > 0 && (
          <div className="text-sm text-blue-500">
            {files.length} file(s) selected
          </div>
        )}

        {transcriptions.length > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Entry Title
              </label>
              {generatingTitle && (
                <span className="text-sm text-blue-500">
                  Generating title...
                </span>
              )}
            </div>
            <div className="relative">
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={generatingTitle ? "Generating title..." : "Give your journal entry a title"}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={generatingTitle}
              />
              {title && !generatingTitle && (
                <button
                  onClick={() => setTitle('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  title="Clear title"
                >
                  ✕
                </button>
              )}
            </div>
            <p className="text-xs text-gray-500">
              A title has been automatically generated. Feel free to modify it.
            </p>
          </div>
        )}

        {transcriptions.length > 0 && (
          <PageNavigation
            currentPage={currentPage}
            totalPages={transcriptions.length}
            onPageChange={setCurrentPage}
            onDelete={handleDelete}
          />
        )}

        <TranscriptionDisplay
          loading={loading}
          text={transcriptions[currentPage]}
          hasFiles={files.length > 0}
        />

        {transcriptions.length > 0 && (
          <SubmitButton 
            title={title}
            transcriptions={transcriptions}
            disabled={submitting || !title.trim()}
            loading={submitting}
            onSuccess={handleSubmitSuccess}
            onError={handleSubmitError}
          />
        )}
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