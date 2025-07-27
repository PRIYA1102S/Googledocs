import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDocument, updateDocument } from '../services/documentService';
import TextElement from './TextElement';
import ImageElement from './ImageElement';

const DocumentEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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

        console.log('Fetched document on edit page:', fetchedDocument);
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
    const res = await fetch('http://localhost:5000/api/upload-image', {
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


  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{document.title || 'Untitled Document'}</h1>
        <button
          onClick={() => navigate('/documents')}
          className="bg-gray-300 text-sm px-3 py-1 rounded hover:bg-gray-400"
        >
          Back to List
        </button>
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Add Image</label>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
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
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Save Document
        </button>
      </div>
    </div>
  );
};

export default DocumentEditor;
