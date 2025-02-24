import React, { useEffect, useState } from 'react';
import { JournalEntry, getJournalEntries } from '../../services/api';

export const JournalEntriesList: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const data = await getJournalEntries();
        setEntries(data);
        if (data.length > 0) {
          setSelectedEntryId(data[0].id); // Select first entry by default
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch journal entries');
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, []);

  const selectedEntry = entries.find(entry => entry.id === selectedEntryId);

  const formatPreview = (content: string) => {
    return content.length > 100 ? content.slice(0, 100) + '...' : content;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto">
      {/* Mobile view (list only, then detail when selected) */}
      <div className="block sm:hidden">
        {selectedEntryId ? (
          <div className="bg-white rounded-lg shadow-lg p-4">
            <button 
              onClick={() => setSelectedEntryId(null)}
              className="mb-4 text-primary flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to entries
            </button>
            
            {/* Selected entry content */}
            <div>
              <h1 className="text-xl font-bold text-gray-900 mb-2">
                {selectedEntry?.title}
              </h1>
              <div className="text-sm text-gray-500 mb-4">
                {selectedEntry && formatDate(selectedEntry.created_at)}
              </div>
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap text-gray-800">
                  {selectedEntry?.content}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Journal Entries</h2>
            {entries.length === 0 ? (
              <div className="text-gray-500">
                No journal entries yet.
              </div>
            ) : (
              <div className="space-y-3">
                {entries.map((entry) => (
                  <button
                    key={entry.id}
                    onClick={() => setSelectedEntryId(entry.id)}
                    className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
                  >
                    <div className="text-sm font-medium text-gray-900">
                      {entry.title}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(entry.created_at)}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {formatPreview(entry.content)}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Desktop view (side-by-side) */}
      <div className="hidden sm:flex bg-white rounded-lg shadow-lg">
        {/* Existing desktop layout */}
        <div className="w-[350px] border-r border-gray-200 p-4 overflow-y-auto max-h-[800px]">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Journal Entries</h2>
          {entries.length === 0 ? (
            <div className="text-gray-500">
              No journal entries yet.
            </div>
          ) : (
            <div className="space-y-2">
              {entries.map((entry) => (
                <button
                  key={entry.id}
                  onClick={() => setSelectedEntryId(entry.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors duration-200 ${
                    selectedEntryId === entry.id
                      ? 'bg-blue-50 border border-blue-200'
                      : 'hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <div className="text-sm font-medium text-gray-900">
                    {entry.title}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatDate(entry.created_at)}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {formatPreview(entry.content)}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex-1 p-6">
          {selectedEntry ? (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {selectedEntry.title}
                  </h1>
                  <div className="text-sm text-gray-500">
                    {formatDate(selectedEntry.created_at)}
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(selectedEntry.created_at).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap text-gray-800">
                  {selectedEntry.content}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              Select a journal entry to view its contents
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 