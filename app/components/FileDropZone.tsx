'use client';

import { useState, DragEvent, ChangeEvent } from 'react';

interface FileDropZoneProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
  disabled?: boolean;
}

export default function FileDropZone({
  onFileSelect,
  accept = '.csv',
  maxSize = 10,
  className = '',
  disabled = false
}: FileDropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string>('');

  const validateFile = (file: File): boolean => {
    setError('');

    // Check file type
    if (accept && !file.name.toLowerCase().endsWith(accept.toLowerCase())) {
      setError(`File must be of type ${accept}`);
      return false;
    }

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      setError(`File size must be less than ${maxSize}MB`);
      return false;
    }

    return true;
  };

  const handleFileSelect = (file: File) => {
    if (validateFile(file)) {
      onFileSelect(file);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);

    if (disabled) return;

    const files = event.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  return (
    <div className={className}>
      <div
        className={`
          border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${isDragOver && !disabled
            ? 'border-blue-400 bg-blue-50'
            : error
            ? 'border-red-400 bg-red-50'
            : 'border-gray-300 bg-gray-50 hover:border-gray-400'
          }
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="flex flex-col items-center">
          <svg
            className={`w-12 h-12 mb-4 ${
              error ? 'text-red-400' : isDragOver ? 'text-blue-400' : 'text-gray-400'
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>

          {error ? (
            <div>
              <p className="text-lg font-medium text-red-600 mb-2">Upload Error</p>
              <p className="text-sm text-red-500 mb-4">{error}</p>
              <button
                onClick={() => setError('')}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div>
              <p className="text-lg font-medium text-gray-800 mb-2">
                Drop your {accept} file here
              </p>
              <p className="text-sm text-gray-600 mb-4">
                or click to browse files (max {maxSize}MB)
              </p>
              <input
                type="file"
                accept={accept}
                onChange={handleFileChange}
                className="hidden"
                id="file-input"
                disabled={disabled}
              />
              <label
                htmlFor="file-input"
                className={`
                  px-6 py-2 rounded-lg transition-colors
                  ${disabled
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                  }
                `}
              >
                Choose File
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}