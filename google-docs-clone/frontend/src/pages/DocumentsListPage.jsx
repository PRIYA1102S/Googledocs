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
import CreateDocumentForm from '../components/CreateDocumentForm';
import EditDocumentForm from '../components/EditDocumentForm';
import DocumentPreview from '../components/DocumentPreview';
import DocumentMeta from '../components/DocumentMeta';

const DocumentListPage = () => {
  const [documents, setDocuments] = useState([]);
  const [editDocId, setEditDocId] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
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

  // Refetch when window gains focus or tab becomes visible (e.g., after navigating back)
  useEffect(() => {
    const handleFocus = () => fetchDocuments();
    const handleVisibility = () => {
      if (!document.hidden) fetchDocuments();
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  // Create a new document
  const handleCreate = async (documentData) => {
    try {
      await createDocument(documentData);
      fetchDocuments();
      setShowCreateForm(false); // Hide form after creation
    } catch (error) {
      console.error('Error creating document:', error);
    }
  };

  // Delete a document
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await deleteDocument(id);
        fetchDocuments();
      } catch (error) {
        console.error('Error deleting document:', error);
      }
    }
  };

  // Start editing
  const startEditing = (doc) => {
    setEditDocId(doc._id);
  };

  // Save edited document
  const handleEditSave = async (updatedDocument) => {
    try {
      await updateDocument(editDocId, updatedDocument);
      setEditDocId(null);
      fetchDocuments();
    } catch (error) {
      console.error('Error updating document:', error);
    }
  };

  // Cancel editing
  const handleEditCancel = () => {
    setEditDocId(null);
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`flex justify-between items-center p-6 border-b ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
        <div className="flex items-center gap-4">
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
            Your Documents
          </h1>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
          }`}>
            {documents.length} document{documents.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </header>

      <div className="p-6 max-w-6xl mx-auto">
        {/* Create Document Section - Collapsible */}
        {showCreateForm && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                Create New Document
              </h2>
              <button
                onClick={() => setShowCreateForm(false)}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  isDark 
                    ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                    : 'hover:bg-gray-200 text-gray-500 hover:text-gray-700'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <CreateDocumentForm onSubmit={handleCreate} onCancel={() => setShowCreateForm(false)} />
          </div>
        )}

        {/* Documents List Section */}
        <div className="space-y-6">
          {/* Section Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                Recent Documents
              </h2>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {documents.length === 0 
                  ? 'No documents yet. Create your first document to get started!' 
                  : 'Manage and edit your documents'
                }
              </p>
            </div>
            
            {/* Floating Action Button */}
            {!showCreateForm && (
              <button
                onClick={() => setShowCreateForm(true)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl ${
                  isDark 
                    ? 'bg-green-500 hover:bg-green-600 text-white shadow-green-500/30' 
                    : 'bg-green-500 hover:bg-green-600 text-white shadow-green-500/30'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Document
              </button>
            )}
          </div>

          {/* Documents Grid */}
          {documents.length === 0 ? (
            <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium mb-2">No documents yet</h3>
              <p className="mb-4">Create your first document to get started with your writing journey.</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl ${
                  isDark 
                    ? 'bg-green-500 hover:bg-green-600 text-white shadow-green-500/30' 
                    : 'bg-green-500 hover:bg-green-600 text-white shadow-green-500/30'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Your First Document
              </button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {documents.map((doc) => (
                <div key={doc._id} className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-lg ${
                  isDark 
                    ? 'bg-gray-800 border-gray-700 hover:border-gray-600 hover:bg-gray-750' 
                    : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}>
                  {editDocId === doc._id ? (
                    <EditDocumentForm
                      document={doc}
                      onSave={handleEditSave}
                      onCancel={handleEditCancel}
                    />
                  ) : (
                    <>
                      <div className="flex items-start justify-between mb-2">
                        <h4 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                          {doc.title}
                        </h4>
                        
                        {/* Document permission indicator */}
                        <div className="flex items-center gap-1">
                          {(!doc.userPermission || doc.userPermission === 'owner') ? (
                            <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium dark:bg-yellow-900 dark:text-yellow-200">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              Owner
                            </div>
                          ) : doc.userPermission === 'editor' ? (
                            <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium dark:bg-green-900 dark:text-green-200">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Editor
                            </div>
                          ) : doc.userPermission === 'viewer' ? (
                            <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium dark:bg-blue-900 dark:text-blue-200">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              Viewer
                            </div>
                          ) : null}
                          
                          {/* Shared indicator */}
                          {doc.collaborators && doc.collaborators.length > 0 && (
                            <div className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium dark:bg-purple-900 dark:text-purple-200">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                              {doc.collaborators.length}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Show shared by info if not owner */}
                      {doc.userPermission && doc.userPermission !== 'owner' && doc.userId && (
                        <p className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          Shared by {doc.userId.username || doc.userId.email}
                        </p>
                      )}
                      
                      <DocumentPreview content={doc.content} maxLength={100} />
                      
                      <DocumentMeta document={doc} />

                      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        {/* Quick Edit - only if can edit */}
                        {(!doc.userPermission || doc.userPermission === 'owner' || doc.userPermission === 'editor') && (
                          <button
                            onClick={() => startEditing(doc)}
                            className={`flex-1 px-3 py-1.5 text-sm rounded transition-colors duration-200 ${
                              isDark 
                                ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                                : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                            }`}
                          >
                            Quick Edit
                          </button>
                        )}
                        
                        {/* Open document */}
                        <button
                          onClick={() => navigate(`/document/${doc._id}`)}
                          className={`flex-1 px-3 py-1.5 text-sm rounded transition-colors duration-200 ${
                            isDark 
                              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                              : 'bg-blue-600 hover:bg-blue-700 text-white'
                          }`}
                        >
                          {doc.userPermission === 'viewer' ? 'View' : 'Edit'}
                        </button>
                        
                        {/* Delete - only owners */}
                        {(!doc.userPermission || doc.userPermission === 'owner') && (
                          <button
                            onClick={() => handleDelete(doc._id)}
                            className={`px-3 py-1.5 text-sm rounded transition-colors duration-200 ${
                              isDark 
                                ? 'bg-red-600 hover:bg-red-700 text-white' 
                                : 'bg-red-500 hover:bg-red-600 text-white'
                            }`}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentListPage;
