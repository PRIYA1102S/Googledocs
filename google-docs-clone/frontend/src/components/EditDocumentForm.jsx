import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import { useTheme } from '../contexts/ThemeContext';
import 'react-quill/dist/quill.snow.css';

const EditDocumentForm = ({ document, onSave, onCancel }) => {
  const [title, setTitle] = useState(document.title || '');
  const [content, setContent] = useState('');
  const { isDark } = useTheme();

  useEffect(() => {
    // Extract text content from document for editing
    if (Array.isArray(document.content)) {
      const textBlock = document.content.find(block => block.type === 'text');
      setContent(textBlock ? textBlock.content : '');
    } else {
      setContent(document.content || '');
    }
  }, [document]);

  const handleSave = () => {
    const updatedDocument = {
      title: title.trim(),
      content: [
        {
          type: 'text',
          content: content || '<p><br></p>',
        },
      ],
    };
    onSave(updatedDocument);
  };

  // Enhanced custom styles for dark mode
  const customStyles = `
    .ql-editor {
      ${isDark ? 'color: #f1f5f9; background-color: #1e293b;' : 'color: #1e293b; background-color: #ffffff;'}
      min-height: 120px;
      max-height: 200px;
      overflow-y: auto;
    }
    .ql-editor.ql-blank::before {
      ${isDark ? 'color: #94a3b8;' : 'color: #9ca3af;'}
    }
    .ql-toolbar {
      ${isDark ? 'background-color: #334155; border-color: #475569;' : 'background-color: #f8fafc; border-color: #e2e8f0;'}
    }
    .ql-toolbar button {
      ${isDark ? 'color: #e2e8f0;' : 'color: #475569;'}
    }
    .ql-toolbar button:hover {
      ${isDark ? 'color: #60a5fa; background-color: #475569;' : 'color: #3b82f6; background-color: #e2e8f0;'}
    }
    .ql-toolbar .ql-active {
      ${isDark ? 'color: #60a5fa; background-color: #475569;' : 'color: #3b82f6; background-color: #dbeafe;'}
    }
    .ql-toolbar .ql-picker {
      ${isDark ? 'color: #e2e8f0;' : 'color: #475569;'}
    }
    .ql-toolbar .ql-picker:hover {
      ${isDark ? 'color: #60a5fa;' : 'color: #3b82f6;'}
    }
    .ql-toolbar .ql-picker-label {
      ${isDark ? 'color: #e2e8f0;' : 'color: #475569;'}
    }
    .ql-toolbar .ql-picker-label:hover {
      ${isDark ? 'color: #60a5fa;' : 'color: #3b82f6;'}
    }
    .ql-toolbar .ql-picker-options {
      ${isDark ? 'background-color: #475569; border-color: #64748b;' : 'background-color: #ffffff; border-color: #e2e8f0;'}
    }
    .ql-toolbar .ql-picker-item {
      ${isDark ? 'color: #e2e8f0;' : 'color: #475569;'}
    }
    .ql-toolbar .ql-picker-item:hover {
      ${isDark ? 'color: #60a5fa; background-color: #64748b;' : 'color: #3b82f6; background-color: #f1f5f9;'}
    }
    .ql-toolbar .ql-stroke {
      ${isDark ? 'stroke: #e2e8f0;' : 'stroke: #475569;'}
    }
    .ql-toolbar .ql-fill {
      ${isDark ? 'fill: #e2e8f0;' : 'fill: #475569;'}
    }
    .ql-toolbar .ql-picker-label:hover .ql-stroke,
    .ql-toolbar button:hover .ql-stroke {
      ${isDark ? 'stroke: #60a5fa;' : 'stroke: #3b82f6;'}
    }
    .ql-toolbar .ql-picker-label:hover .ql-fill,
    .ql-toolbar button:hover .ql-fill {
      ${isDark ? 'fill: #60a5fa;' : 'fill: #3b82f6;'}
    }
    .ql-toolbar .ql-active .ql-stroke {
      ${isDark ? 'stroke: #60a5fa;' : 'stroke: #3b82f6;'}
    }
    .ql-toolbar .ql-active .ql-fill {
      ${isDark ? 'fill: #60a5fa;' : 'fill: #3b82f6;'}
    }
    .ql-container {
      ${isDark ? 'border-color: #475569;' : 'border-color: #e2e8f0;'}
    }
  `;

  return (
    <div className="space-y-3">
      <style>{customStyles}</style>
      
      <div>
        <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          Document Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isDark 
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
              : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
          }`}
        />
      </div>

      <div>
        <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          Document Content
        </label>
        <div className={`rounded-lg border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            placeholder="Edit your document content..."
            modules={{
              toolbar: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'align': [] }],
                ['link', 'image'],
                ['clean']
              ]
            }}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleSave}
          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors duration-200"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500 transition-colors duration-200"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditDocumentForm; 