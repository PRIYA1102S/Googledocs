import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const DocumentPreview = ({ content, maxLength = 200 }) => {
  const { isDark } = useTheme();

  const renderContent = () => {
    if (!Array.isArray(content)) {
      return null;
    }

    const textBlock = content.find(block => block.type === 'text');
    if (!textBlock) {
      return null;
    }

    // Create a temporary div to extract text content from HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = textBlock.content;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';

    // Truncate if too long
    const truncated = textContent.length > maxLength 
      ? textContent.substring(0, maxLength) + '...' 
      : textContent;

    return (
      <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
        {truncated || 'No content yet'}
      </div>
    );
  };

  const renderImages = () => {
    if (!Array.isArray(content)) {
      return null;
    }

    const imageBlocks = content.filter(block => block.type === 'image');
    if (imageBlocks.length === 0) {
      return null;
    }

    return (
      <div className="flex gap-2 mt-2">
        {imageBlocks.slice(0, 3).map((block, index) => (
          <img
            key={index}
            src={block.src}
            alt={block.alt || 'Image'}
            className="w-12 h-12 object-cover rounded border"
          />
        ))}
        {imageBlocks.length > 3 && (
          <div className={`w-12 h-12 rounded border flex items-center justify-center text-xs ${
            isDark ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-gray-100 text-gray-600 border-gray-300'
          }`}>
            +{imageBlocks.length - 3}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-2">
      {renderContent()}
      {renderImages()}
    </div>
  );
};

export default DocumentPreview; 