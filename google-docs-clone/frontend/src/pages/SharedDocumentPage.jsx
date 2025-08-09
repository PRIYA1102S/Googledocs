import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { getDocumentByShareableLink } from '../services/sharingService';
import DocumentEditor from '../components/DocumentEditor';
import ThemeToggle from '../components/ThemeToggle';

const SharedDocumentPage = () => {
  const { shareableLink } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSharedDocument();
  }, [shareableLink]);

  const fetchSharedDocument = async () => {
    try {
      setLoading(true);
      const doc = await getDocumentByShareableLink(shareableLink);
      setDocument(doc);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      }`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading shared document...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      }`}>
        <div className="text-center max-w-md mx-auto">
          <div className="mb-4">
            <svg className="w-16 h-16 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={() => navigate('/documents')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Your Documents
          </button>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      }`}>
        <div className="text-center">
          <p>Document not found</p>
        </div>
      </div>
    );
  }

  const userPermission = document.userPermission || 'viewer';

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`border-b ${
        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/documents')}
                className={`mr-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {document.title}
                </h1>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Shared by {document.userId?.username || 'Unknown'} • {userPermission === 'viewer' ? 'View only' : 'Can edit'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                userPermission === 'editor' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
              }`}>
                {userPermission === 'editor' ? 'Can edit' : 'View only'}
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Document Editor */}
      <DocumentEditor 
        documentId={document._id} 
        isReadOnly={userPermission === 'viewer'}
      />
    </div>
  );
};

export default SharedDocumentPage;
