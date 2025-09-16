'use client';

import LoadingSpinner from './LoadingSpinner';

interface UploadProgressProps {
  fileName: string;
  fileSize: number;
  isUploading: boolean;
  progress?: number; // 0-100
  onCancel?: () => void;
  onReset?: () => void;
}

export default function UploadProgress({
  fileName,
  fileSize,
  isUploading,
  progress = 0,
  onCancel,
  onReset
}: UploadProgressProps) {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-white border rounded-xl p-6 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-medium text-gray-800 mb-1">
            {fileName}
          </h3>
          <p className="text-sm text-gray-500">
            {formatFileSize(fileSize)}
          </p>
        </div>
        
        {isUploading ? (
          <div className="flex items-center space-x-2">
            <LoadingSpinner size="sm" />
            <span className="text-sm text-blue-600">Uploading...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <svg
              className="w-5 h-5 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-sm text-green-600">Ready to upload</span>
          </div>
        )}
      </div>

      {/* Progress bar */}
      {isUploading && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Upload Progress</span>
            <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex space-x-3">
        {isUploading && onCancel ? (
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Cancel
          </button>
        ) : (
          onReset && (
            <button
              onClick={onReset}
              className="px-4 py-2 text-sm bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Choose Different File
            </button>
          )
        )}
      </div>
    </div>
  );
}