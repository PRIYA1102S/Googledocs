import React, { useState } from 'react';
import { downloadWithProgress } from '../services/downloadService';

const DownloadModal = ({ document, onClose }) => {
  const [progress, setProgress] = useState(0);
  const [quality, setQuality] = useState('high');
  const [format, setFormat] = useState('pdf');
  const [isDownloading, setIsDownloading] = useState(false);

  const formatOptions = [
    { value: 'pdf', label: 'PDF', icon: '📄', description: 'Best for sharing and printing' },
    { value: 'docx', label: 'Word Document', icon: '📝', description: 'Editable in Microsoft Word' },
    { value: 'html', label: 'HTML', icon: '🌐', description: 'Web page format' },
    { value: 'txt', label: 'Plain Text', icon: '📋', description: 'Simple text file' }
  ];

  const qualityOptions = [
    { value: 'low', label: 'Low', description: 'Smaller file size' },
    { value: 'medium', label: 'Medium', description: 'Balanced quality' },
    { value: 'high', label: 'High', description: 'Best quality' }
  ];

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      setProgress(10);
      
      await downloadWithProgress(document, format, quality, setProgress);
      
      setProgress(100);
      setTimeout(() => {
        onClose();
        setProgress(0);
        setIsDownloading(false);
      }, 1000);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
      setIsDownloading(false);
      setProgress(0);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Download Options
          </h3>
          <button
            onClick={onClose}
            disabled={isDownloading}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Format Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
            Format
          </label>
          <div className="space-y-2">
            {formatOptions.map(option => (
              <label
                key={option.value}
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                  format === option.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <input
                  type="radio"
                  name="format"
                  value={option.value}
                  checked={format === option.value}
                  onChange={(e) => setFormat(e.target.value)}
                  className="sr-only"
                />
                <span className="text-lg mr-3">{option.icon}</span>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {option.label}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {option.description}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Quality Selection (only for PDF) */}
        {format === 'pdf' && (
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
              Quality
            </label>
            <div className="flex gap-2">
              {qualityOptions.map(q => (
                <button
                  key={q.value}
                  onClick={() => setQuality(q.value)}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    quality === q.value 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                  }`}
                >
                  <div>{q.label}</div>
                  <div className="text-xs opacity-75">{q.description}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Progress Bar */}
        {progress > 0 && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Downloading...
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {progress}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isDownloading ? 'Downloading...' : 'Download'}
          </button>
          <button
            onClick={onClose}
            disabled={isDownloading}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors text-gray-700 dark:text-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DownloadModal;
