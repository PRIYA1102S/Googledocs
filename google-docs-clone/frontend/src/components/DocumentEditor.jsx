import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDocument, updateDocument } from '../services/documentService';
import { useTheme } from '../contexts/ThemeContext';
import TextElement from './TextElement';
import ImageElement from './ImageElement';

const DocumentEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const [document, setDocument] = useState({ title: '', content: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const fetchedDocument = await getDocument(id);

        // Normalize content
        const normalizedContent = Array.isArray(fetchedDocument.content)
          ? fetchedDocument.content
          : [{ type: 'text', content: fetchedDocument.content || '' }];

        setDocument({
          title: fetchedDocument.title || '',
          content: normalizedContent,
        });


      } catch (error) {
        console.error('Error fetching document:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocument();
  }, [id]);

  const handleChange = (updatedContent) => {
    setDocument((prevDoc) => ({ ...prevDoc, content: updatedContent }));
  };

  const handleSave = async () => {
    try {
      await updateDocument(id, document);
      alert('Document saved successfully!');
    } catch (error) {
      console.error('Error saving document:', error);
    }
  };


  const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // Optional: check file size limit (e.g., 5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('Image is too large (max 5MB)');
    return;
  }

  const formData = new FormData();
  formData.append('image', file);

  try {
    const res = await fetch('https://collabdocs-oeum.onrender.com/api/upload-image', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();

    if (data.imageUrl) {
      const newImageBlock = {
        type: 'image',
        src: data.imageUrl,
        alt: file.name,
      };

      setDocument((prev) => ({
        ...prev,
        content: [...prev.content, newImageBlock],
      }));
    } else {
      alert('Upload failed. Try again.');
    }
  } catch (error) {
    console.error('Upload error:', error);
    alert('Something went wrong during upload.');
  }
};


  if (isLoading) return (
    <div className={`flex items-center justify-center min-h-screen ${isDark ? 'text-white' : 'text-gray-800'}`}>
      Loading...
    </div>
  );

  return (
    <div className={`p-6 max-w-4xl mx-auto ${isDark ? 'text-white' : 'text-gray-800'}`}>
      <div className="flex justify-between items-center mb-4">
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
          {document.title || 'Untitled Document'}
        </h1>
        <button
          onClick={() => navigate('/documents')}
          className={`text-sm px-3 py-1 rounded transition-colors duration-200 ${
            isDark 
              ? 'bg-gray-700 hover:bg-gray-600 text-white' 
              : 'bg-gray-300 hover:bg-gray-400 text-gray-800'
          }`}
        >
          Back to List
        </button>
      </div>

      <div className={`mb-4 p-4 rounded ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
        <label className={`block font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>Add Image</label>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleImageUpload}
          className={`block w-full text-sm ${
            isDark 
              ? 'text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-white hover:file:bg-gray-600' 
              : 'text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100'
          }`}
        />
      </div>

      <div className="space-y-4">
        {document.content.map((element, index) => {
          if (element.type === 'text') {
            return (
              <TextElement
                key={index}
                content={element.content}
                onChange={(newContent) => {
                  const updatedContent = [...document.content];
                  updatedContent[index].content = newContent;
                  handleChange(updatedContent);
                }}
              />
            );
          } else if (element.type === 'image') {
            return (
              <ImageElement
                key={index}
                src={element.src}
                alt={element.alt}
                onDelete={() => {
                  const updatedContent = document.content.filter((_, i) => i !== index);
                  handleChange(updatedContent);
                }}
              />
            );
          }
          return null;
        })}
      </div>

      <div className="mt-6">
        <button
          onClick={handleSave}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-200"
        >
          Save Document
        </button>
      </div>
    </div>
  );
};

export default DocumentEditor;
