import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CollaborativeEditor from '../components/CollaborativeEditor';
import DocumentSharing from '../components/DocumentSharing';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';
import { getDocument } from '../services/documentService';
import ErrorBoundary from '../components/ErrorBoundary';

const DocumentPage = () => {
    const { isDark } = useTheme();
    const { id } = useParams();
    const navigate = useNavigate();
    const [document, setDocument] = useState(null);
    const [showSharing, setShowSharing] = useState(false);
    const [userPermission, setUserPermission] = useState('viewer');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchDocument();
        }
    }, [id]);

    const fetchDocument = async () => {
        try {
        
            setLoading(true);
            const doc = await getDocument(id);

            setDocument(doc);
            // Get user permission from the document
            setUserPermission(doc.userPermission || 'owner');
            console.log('DocumentPage: Set user permission:', doc.userPermission || 'owner');
        } catch (error) {
            console.error('DocumentPage: Error fetching document:', error);
            // Redirect to documents list if document not found or unauthorized
            navigate('/documents');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className={isDark ? 'text-white' : 'text-gray-900'}>Loading document {id}...</p>
                </div>
            </div>
        );
    }

    if (!document) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
                <div className="text-center">
                    <p className={isDark ? 'text-white' : 'text-gray-900'}>Document not found</p>
                    <button 
                        onClick={() => navigate('/documents')}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Back to Documents
                    </button>
                </div>
            </div>
        );
    }
    
    return (
        <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
            {/* Header */}
            <header className={`flex justify-between items-center p-4 border-b ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/documents')}
                        className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                            isDark ? 'text-gray-300' : 'text-gray-600'
                        }`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                        {document.title || 'Collaborative Document Editor'}
                    </h1>
                    
                    {/* Permission indicator */}
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        (!userPermission || userPermission === 'owner')
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : userPermission === 'editor'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    }`}>
                        {(!userPermission || userPermission === 'owner') ? 'Owner' : userPermission === 'editor' ? 'Can edit' : 'View only'}
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    {/* Share button - only for owners and editors */}
                    {(!userPermission || userPermission === 'owner' || userPermission === 'editor') && (
                        <button
                            onClick={() => setShowSharing(true)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                isDark 
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                            </svg>
                            Share
                        </button>
                    )}
                    
                    <ThemeToggle />
                </div>
            </header>
            
            
            <ErrorBoundary>
                <CollaborativeEditor 
                    documentId={id}
                    isReadOnly={userPermission === 'viewer'}
                />
            </ErrorBoundary>
            
            {/* Sharing Modal */}
            {showSharing && (
                <DocumentSharing
                    documentId={id}
                    userPermission={userPermission}
                    onClose={() => setShowSharing(false)}
                />
            )}
        </div>
    );
};

export default DocumentPage;

