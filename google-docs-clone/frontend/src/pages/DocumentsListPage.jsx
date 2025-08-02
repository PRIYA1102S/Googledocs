import React, { useEffect, useState } from 'react';
import {
  getAllDocuments,
  createDocument,
  updateDocument,
  deleteDocument,
} from '../services/documentService';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';

const DocumentListPage = () => {
  const [documents, setDocuments] = useState([]);
  const [newDoc, setNewDoc] = useState({ title: '', content: '' });
  const [editDocId, setEditDocId] = useState(null);
  const [editData, setEditData] = useState({ title: '', content: '' });
  const { isDark } = useTheme();

  const navigate = useNavigate();

  // Fetch all documents
  const fetchDocuments = async () => {
    try {
      const data = await getAllDocuments();
      setDocuments(data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Create a new document
  const handleCreate = async () => {
    if (!newDoc.title || !newDoc.content) return alert('Please fill all fields');
    try {
   await createDocument({
  title: newDoc.title,
  content: [
    {
      type: 'text',
      content: newDoc.content, 
    },
  ],
});


      setNewDoc({ title: '', content: '' });
      fetchDocuments();
    } catch (error) {
      console.error('Error creating document:', error);
    }
  };

  // Delete a document
  const handleDelete = async (id) => {
    try {
      await deleteDocument(id);
      fetchDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  // Start editing
  const startEditing = (doc) => {
    setEditDocId(doc._id);
    setEditData({ title: doc.title, content: doc.content });
  };

  // Save edited document
  const handleEditSave = async () => {
    try {
      await updateDocument(editDocId, editData);
      setEditDocId(null);
      setEditData({ title: '', content: '' });
      fetchDocuments();
    } catch (error) {
      console.error('Error updating document:', error);
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`flex justify-between items-center p-6 border-b ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
          Your Documents
        </h1>
        <ThemeToggle />
      </header>

      <div className="p-6 max-w-3xl mx-auto">
        {/* Create New Document */}
        <div className={`mb-6 border p-4 rounded ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-300'}`}>
          <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>Create Document</h3>
          <input
            type="text"
            placeholder="Title"
            value={newDoc.title}
            onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
            className={`w-full p-2 mb-2 border rounded ${
              isDark 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
            }`}
          />
          <textarea
            placeholder="Content"
            value={newDoc.content}
            onChange={(e) => setNewDoc({ ...newDoc, content: e.target.value })}
            className={`w-full p-2 mb-2 border rounded ${
              isDark 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
            }`}
          />
          <button
            onClick={handleCreate}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-200"
          >
            Create
          </button>
        </div>

        {/* Document List */}
        {documents.length === 0 ? (
          <p className={`text-center ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>No documents found.</p>
        ) : (
          <ul className="space-y-4">
            {documents.map((doc) => (
              <li key={doc._id} className={`border p-4 rounded ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}>
                {editDocId === doc._id ? (
                  <>
                    <input
                      type="text"
                      value={editData.title}
                      onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                      className={`w-full p-2 mb-2 border rounded ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                      }`}
                    />
                    <textarea
                      value={editData.content}
                      onChange={(e) => setEditData({ ...editData, content: e.target.value })}
                      className={`w-full p-2 mb-2 border rounded ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                      }`}
                    />
                    <button
                      onClick={handleEditSave}
                      className="bg-green-500 text-white px-3 py-1 mr-2 rounded hover:bg-green-600 transition-colors duration-200"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditDocId(null)}
                      className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <h4 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>{doc.title}</h4>
                    <div className={`mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {Array.isArray(doc.content) &&
                        doc.content.map((block, index) => {
                          if (block.type === 'text') {
                            return (
                              <div
                                key={index}
                                dangerouslySetInnerHTML={{ __html: block.content }}
                                className={isDark ? 'text-gray-300' : 'text-gray-700'}
                              />
                            );
                          }
                          if (block.type === 'image') {
                            return (
                              <img
                                key={index}
                                src={block.src}
                                alt={block.alt || 'Image'}
                                className="my-2 rounded"
                              />
                            );
                          }
                          return null;
                        })}
                    </div>

                    <button
                      onClick={() => navigate(`/document/${doc._id}`)}
                      className="bg-yellow-400 text-white px-3 py-1 mr-2 rounded hover:bg-yellow-500 transition-colors duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(doc._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors duration-200"
                    >
                      Delete
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DocumentListPage;
