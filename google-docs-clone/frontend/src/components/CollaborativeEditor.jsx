import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDocument, updateDocument } from '../services/documentService';
import { useTheme } from '../contexts/ThemeContext';
import useAuth from '../hooks/useAuth';
import useSocket from '../hooks/useSocket';
import useAutoSave from '../hooks/useAutoSave';
import CollaborativeTextElement from './CollaborativeTextElement';
import ImageElement from './ImageElement';
import { mergeTextContent, hasConflict } from '../utils/conflictResolution';
import { AuthContext } from '../contexts/AuthContext';

const colorPalette = [
  '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'
];

const getColorForUserId = (userId) => {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
  const hash = userId.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  return colors[Math.abs(hash) % colors.length];
};

const CollaborativeEditor = ({ documentId, isReadOnly = false }) => {
  const { id: paramId } = useParams();
  const id = documentId || paramId; // Use prop if provided, otherwise use param
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const authContext = useContext(AuthContext);
  
  // Use authContext.user instead of useAuth
  const user = authContext.user;
  const loading = !authContext.isAuthenticated; // or however you track loading in AuthContext
  
  const [document, setDocument] = useState({ title: '', content: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [isOnline, setIsOnline] = useState(false);
  const [lastSavedContent, setLastSavedContent] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [userPermission, setUserPermission] = useState(null);
  const debounceTimeoutRef = useRef(null);
  const isRemoteChangeRef = useRef(false);
  const [remoteSelections, setRemoteSelections] = useState({}); // userId -> { index, length, color, name }

  // Auto-save hook - disable for viewers
  const canEdit = userPermission === 'owner' || userPermission === 'editor';
  
  // Callback to reset unsaved changes when auto-save completes
  const handleAutoSaveSuccess = useCallback(() => {
    console.log('Auto-save success callback triggered, resetting hasUnsavedChanges');
    setHasUnsavedChanges(false);
  }, []);
  
  const { forceSave, isSaving } = useAutoSave(id, document, isOnline && canEdit, handleAutoSaveSuccess);

  useEffect(() => {
    console.log('🔍 User state changed:', { 
      user, 
      userId: user?.id || user?._id, 
      userName: user?.name || user?.username || user?.email 
    });
  }, [user]);

  useEffect(() => {
    console.log('🔍 Auth Debug:', { 
      user, 
      userKeys: user ? Object.keys(user) : 'no user',
      userId: user?.id,
      userIdAlt: user?._id,
      userName: user?.name,
      userEmail: user?.email
    });
  }, [user]);

  useEffect(() => {
    console.log('🔍 User loading state:', { user, loading, isAuthenticated: !!user });
  }, [user, loading]);

  useEffect(() => {
    if (user) {
      console.log('🔍 User object structure:', {
        user,
        keys: Object.keys(user),
        id: user.id,
        _id: user._id,
        userId: user.userId,
        name: user.name,
        username: user.username,
        email: user.email
      });
    }
  }, [user]);

  //Socket connection
  const {
    emitDocumentChange,
    emitCursorChange,
    onDocumentChange,
    onCursorChange,
    onUserJoined,
    onUserLeft,
    onUsersInDocument,
    offDocumentChange,
    offCursorChange,
    offUserJoined,
    offUserLeft,
    offUsersInDocument,
    isConnected,
  } = useSocket(
    id, 
    user?.id || user?._id,
    user?.name || user?.username || user?.email || 'Anonymous'
  );

  console.log('🔗 Socket status:', { 
    isConnected, 
    userId: user?.id || user?._id, 
    documentId: id,
    user: user
  });

  
 useEffect(() => {
    let isMounted = true;
    const fetchDocument = async () => {
      try {
        const fetchedDocument = await getDocument(id);

        // Normalize content
        const normalizedContent = Array.isArray(fetchedDocument.content)
          ? fetchedDocument.content
          : [{ type: 'text', content: fetchedDocument.content || '' }];

        const documentData = {
          title: fetchedDocument.title || '',
          content: normalizedContent,
        };

        if (!isMounted) return;
        setDocument(documentData);
        setLastSavedContent(JSON.stringify(documentData));
        setUserPermission(fetchedDocument.userPermission);


        if (!isMounted) return;
        setIsOnline(true);
      } catch (error) {
        console.error('Error fetching document:', error);
        if (!isMounted) return;
        setIsOnline(false);
      } finally {
        if (!isMounted) return;
        setIsLoading(false);
      }
    };

    fetchDocument();
    return () => { isMounted = false; };
  }, [id]);

  // Set up socket event listeners
  useEffect(() => {
    if (!user) return;

    // Handle document changes from other sessions (including same user in another tab)
    onDocumentChange(({ content, userId, userName }) => {

      isRemoteChangeRef.current = true;

      setDocument((prevDoc) => {
        // Check for conflicts
        const currentContent = JSON.stringify(prevDoc.content);
        const remoteContent = JSON.stringify(content);

      if (hasConflict(currentContent, remoteContent, lastSavedContent)) {
      console.warn('Conflict detected - merging changes');
      
      // Better conflict resolution
      const mergedContent = mergeTextContent(
        prevDoc.content, 
        content, 
        lastSavedContent
      );
      
      return { ...prevDoc, content: mergedContent };
    }

        return { ...prevDoc, content };
      });


    });

    // Remote cursor/selection updates
    onCursorChange(({ userId: remoteUserId, userName: remoteUserName, position, selection }) => {
      console.log('📥 Received cursor change:', { 
        remoteUserId, 
        remoteUserName, 
        position, 
        selection,
        currentUserId: user?.id || user?._id
      });
      
      if (!remoteUserId || (remoteUserId === (user?.id || user?._id))) {
        console.log('❌ Ignoring cursor change - same user or no userId');
        return;
      }
      
      const color = getColorForUserId(remoteUserId);
      const index = selection?.index ?? position ?? 0;
      const length = selection?.length ?? 0;
      
      console.log('✅ Setting remote selection:', { remoteUserId, index, length, color });
      
      setRemoteSelections((prev) => ({
        ...prev,
        [remoteUserId]: {
          userId: remoteUserId,
          name: remoteUserName,
          color,
          index,
          length,
          updatedAt: Date.now(),
        }
      }));
    });

    // Handle user presence
    onUserJoined(({ userId, userName }) => {
      setConnectedUsers((prev) => {
        const exists = prev.find((u) => u.userId === userId);
        if (!exists) {
          return [...prev, { userId, userName }];
        }
        return prev;
      });

    });

    onUserLeft(({ userId, userName }) => {
      setConnectedUsers((prev) => prev.filter((u) => u.userId !== userId));
      setRemoteSelections((prev) => {
        const copy = { ...prev };
        delete copy[userId];
        return copy;
      });
    });

    onUsersInDocument((users) => {
      setConnectedUsers(users.filter((u) => u.userId !== (user?.id || user?._id)));
    });

    // Cleanup
    return () => {
      offDocumentChange();
      offCursorChange();
      offUserJoined();
      offUserLeft();
      offUsersInDocument();
    };
  }, [user, onDocumentChange, onCursorChange, onUserJoined, onUserLeft, onUsersInDocument, offDocumentChange, offCursorChange, offUserJoined, offUserLeft, offUsersInDocument]);

  const handleChange = (updatedContent) => {
    // Prevent viewers from making changes
    if (userPermission === 'viewer') {
      console.log('Viewers cannot edit documents');
      return;
    }

    setDocument((prevDoc) => ({ ...prevDoc, content: updatedContent }));
    setHasUnsavedChanges(true);

    // Don't emit changes if this was triggered by a remote change
    if (isRemoteChangeRef.current) {
      isRemoteChangeRef.current = false;
      return;
    }

    // Debounce socket emissions to avoid spam
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {

      emitDocumentChange(null, updatedContent);
    }, 300);
  };

  const handleSave = async () => {
    // Prevent viewers from saving
    if (userPermission === 'viewer') {
      alert('Viewers cannot save documents');
      return;
    }

    try {
      await forceSave();
      setLastSavedContent(JSON.stringify(document));
      setHasUnsavedChanges(false);
      alert('Document saved successfully!');
    } catch (error) {
      console.error('Error saving document:', error);
      alert('Error saving document');
    }
  };

  const handleImageUpload = async (e) => {
    // Prevent viewers from uploading images
    if (userPermission === 'viewer') {
      alert('Viewers cannot upload images');
      return;
    }

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

        const updatedContent = [...document.content, newImageBlock];
        handleChange(updatedContent);
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
      {/* Header with title and status */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
            {document.title || 'Untitled Document'}
          </h1>
          <div className="flex items-center mt-2 space-x-4">
            <div className={`flex items-center space-x-2 ${isConnected ? 'text-green-500' : 'text-red-500'}`}>
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm">{isConnected ? 'Connected' : 'Disconnected'}</span>
            </div>
            <div className="text-sm text-gray-500">
              User: {user?.name || user?.username || user?.email || 'Not logged in'}
            </div>
            <div className="text-sm text-gray-500">
              ID: {user?.id || user?._id || 'No ID'}
            </div>
            <div className={`flex items-center space-x-2 text-sm ${
              isSaving ? 'text-blue-500' : 
              hasUnsavedChanges ? 'text-yellow-500' : 'text-green-500'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                isSaving ? 'bg-blue-500 animate-pulse' : 
                hasUnsavedChanges ? 'bg-yellow-500' : 'bg-green-500'
              }`}></div>
              <span>
                {isSaving ? 'Saving...' : 
                 hasUnsavedChanges ? 'Unsaved changes' : 'All changes saved'}
              </span>
            </div>
            {connectedUsers.length > 0 && (
              <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {connectedUsers.length} other{connectedUsers.length === 1 ? ' user' : ' users'} editing
              </div>
            )}
          </div>
        </div>
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

      {/* Connected Users */}
      {connectedUsers.length > 0 && (
        <div className={`mb-4 p-3 rounded ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-blue-50 border border-blue-200'}`}>
          <div className={`text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            Currently editing:
          </div>
          <div className="flex flex-wrap gap-2">
            {connectedUsers.map((user) => (
              <span
                key={user.userId}
                className={`px-2 py-1 text-xs rounded-full ${
                  isDark 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {user.userName}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Image Upload */}
      {/* Upload Image Section - only show if not read-only */}
      {!isReadOnly && (
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
      )}

      {/* Document Content */}
      <div className="space-y-4">
        {document.content.map((element, index) => {
          if (element.type === 'text') {
            return (
              <CollaborativeTextElement
                key={index}
                content={element.content}
                isReadOnly={isReadOnly}
                user={user}
                remoteSelections={Object.values(remoteSelections)}
                onChange={isReadOnly ? undefined : (newContent) => {
                  const updatedContent = [...document.content];
                  updatedContent[index].content = newContent;
                  handleChange(updatedContent);
                }}
                onSelectionChange={(selection) => {
                  console.log('📡 About to emit cursor change:', { 
                    selection, 
                    isReadOnly, 
                    isConnected, 
                    userId: user?.id || user?._id 
                  });
                  if (!isReadOnly && selection && isConnected) {
                    console.log('🚀 Emitting cursor change:', selection.index, selection);
                    emitCursorChange(selection.index, selection);
                  } else {
                    console.log('❌ Not emitting cursor change - conditions not met');
                  }
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

      {/* Save Button - only show if not read-only */}
      {!isReadOnly && (
        <div className="mt-6 flex items-center space-x-4">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`px-4 py-2 rounded transition-colors duration-200 ${
              isSaving 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white`}
          >
            {isSaving ? 'Saving...' : 'Save Now'}
          </button>
          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Changes are auto-saved every 2 seconds
          </span>
        </div>
      )}
      
      {/* Read-only indicator */}
      {isReadOnly && (
        <div className="mt-6 flex items-center space-x-2">
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            You have view-only access to this document
          </span>
        </div>
      )}
    </div>
  );
};

export default CollaborativeEditor;
