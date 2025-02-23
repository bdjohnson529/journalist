import React, { useState } from "react";

interface PageNavigationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onDelete: () => void;
}

export const PageNavigation: React.FC<PageNavigationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  onDelete,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    onDelete();
    setShowDeleteConfirm(false);
  };

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${((currentPage + 1) / totalPages) * 100}%` }}
        />
      </div>

      <div className="flex items-center justify-between">
        {/* Navigation controls */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => onPageChange(Math.max(currentPage - 1, 0))}
            disabled={currentPage === 0}
            className={`px-4 py-2 rounded-md border ${
              currentPage === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'border-gray-300 hover:bg-gray-50 text-gray-700 hover:border-blue-500'
            }`}
          >
            ⬅ Previous
          </button>
          
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-bold text-blue-600">
              {currentPage + 1}
            </span>
            <span className="text-gray-500">of</span>
            <span className="text-lg text-gray-700">{totalPages}</span>
          </div>

          <button
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages - 1))}
            disabled={currentPage === totalPages - 1}
            className={`px-4 py-2 rounded-md border ${
              currentPage === totalPages - 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'border-gray-300 hover:bg-gray-50 text-gray-700 hover:border-blue-500'
            }`}
          >
            Next ➡
          </button>
        </div>

        {/* Delete button */}
        <button
          onClick={handleDelete}
          className="px-4 py-2 rounded-md border border-red-300 bg-red-50 text-red-600 hover:bg-red-100 transition-colors duration-200 ml-4"
          title="Delete current page"
        >
          🗑️ Delete
        </button>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirm Delete
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this transcription? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 