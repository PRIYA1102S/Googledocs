import React, { useEffect, useState } from 'react';
import {
  getAllDocuments,
  createDocument,
  updateDocument,
  deleteDocument,
} from '../services/documentService';
import { useNavigate } from 'react-router-dom';

const DocumentListPage = () => {
  const [documents, setDocuments] = useState([]);
  const [newDoc, setNewDoc] = useState({ title: '', content: '' });
  const [editDocId, setEditDocId] = useState(null);
  const [editData, setEditData] = useState({ title: '', content: '' });

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
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Your Documents</h2>

      {/* Create New Document */}
      <div className="mb-6 border p-4 rounded bg-gray-100">
        <h3 className="text-lg font-semibold mb-2">Create Document</h3>
        <input
          type="text"
          placeholder="Title"
          value={newDoc.title}
          onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
          className="w-full p-2 mb-2 border rounded"
        />
        <textarea
          placeholder="Content"
          value={newDoc.content}
          onChange={(e) => setNewDoc({ ...newDoc, content: e.target.value })}
          className="w-full p-2 mb-2 border rounded"
        />
        <button
          onClick={handleCreate}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create
        </button>
      </div>

      {/* Document List */}
      {documents.length === 0 ? (
        <p>No documents found.</p>
      ) : (
        <ul className="space-y-4">
          {documents.map((doc) => (
            <li key={doc._id} className="border p-4 rounded bg-white">
              {editDocId === doc._id ? (
                <>
                  <input
                    type="text"
                    value={editData.title}
                    onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                    className="w-full p-2 mb-2 border rounded"
                  />
                  <textarea
                    value={editData.content}
                    onChange={(e) => setEditData({ ...editData, content: e.target.value })}
                    className="w-full p-2 mb-2 border rounded"
                  />
                  <button
                    onClick={handleEditSave}
                    className="bg-green-500 text-white px-3 py-1 mr-2 rounded hover:bg-green-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditDocId(null)}
                    className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  {/* <h4 className="text-xl font-semibold">{doc.title}</h4>
                  <p className="text-gray-700 mb-2">{doc.content}</p> */}

                  <h4 className="text-xl font-semibold">{doc.title}</h4>
<div className="text-gray-700 mb-2">
  {Array.isArray(doc.content) &&
    doc.content.map((block, index) => {
      if (block.type === 'text') {
        return (
          <div
            key={index}
            dangerouslySetInnerHTML={{ __html: block.content }}
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

                  {/* <button
                    onClick={() => startEditing(doc)}
                    className="bg-yellow-400 text-white px-3 py-1 mr-2 rounded hover:bg-yellow-500"
                  >
                    Edit
                  </button> */}
                  <button
  onClick={() => navigate(`/document/${doc._id}`)}
  className="bg-yellow-400 text-white px-3 py-1 mr-2 rounded hover:bg-yellow-500"
>
  Edit
</button>
                  <button
                    onClick={() => handleDelete(doc._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
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
  );
};

export default DocumentListPage;
