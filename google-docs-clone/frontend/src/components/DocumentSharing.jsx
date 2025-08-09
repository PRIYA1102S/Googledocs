import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import {
  shareDocument,
  removeCollaborator,
  updateCollaboratorPermission,
  getCollaborators,
  generateShareableLink
} from '../services/sharingService';

const DocumentSharing = ({ documentId, onClose, userPermission }) => {
  const { isDark } = useTheme();
  const [collaborators, setCollaborators] = useState([]);
  const [owner, setOwner] = useState(null);
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState('viewer');
  const [loading, setLoading] = useState(false);
  const [shareableLink, setShareableLink] = useState('');
  const [showShareableLink, setShowShareableLink] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Check if current user can manage collaborators
  const canManage = userPermission === 'owner' || userPermission === 'editor';

  useEffect(() => {
    fetchCollaborators();
  }, [documentId]);

  const fetchCollaborators = async () => {
    try {
      setLoading(true);
      const data = await getCollaborators(documentId);
      setCollaborators(data.collaborators);
      setOwner(data.owner);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter an email address');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await shareDocument(documentId, email.trim(), permission);
      setEmail('');
      setSuccess('Document shared successfully!');
      setTimeout(() => setSuccess(''), 3000);
      await fetchCollaborators();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCollaborator = async (collaboratorId) => {
    if (!window.confirm('Are you sure you want to remove this collaborator?')) {
      return;
    }

    try {
      setLoading(true);
      await removeCollaborator(documentId, collaboratorId);
      setSuccess('Collaborator removed successfully!');
      setTimeout(() => setSuccess(''), 3000);
      await fetchCollaborators();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionChange = async (collaboratorId, newPermission) => {
    try {
      setLoading(true);
      await updateCollaboratorPermission(documentId, collaboratorId, newPermission);
      setSuccess('Permission updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
      await fetchCollaborators();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateLink = async () => {
    try {
      setLoading(true);
      const data = await generateShareableLink(documentId);
      setShareableLink(data.fullUrl);
      setShowShareableLink(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareableLink);
      setSuccess('Link copied to clipboard!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to copy link');
    }
  };

  const getPermissionIcon = (permission) => {
    switch (permission) {
      case 'owner':
        return (
          <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      case 'editor':
        return (
          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        );
      case 'viewer':
        return (
          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getPermissionText = (permission) => {
    switch (permission) {
      case 'owner': return 'Owner';
      case 'editor': return 'Can edit';
      case 'viewer': return 'Can view';
      default: return permission;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`max-w-md w-full mx-4 rounded-lg shadow-xl ${
        isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold">Share Document</h3>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 max-h-96 overflow-y-auto">
          {/* Error/Success Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded-lg">
              {success}
            </div>
          )}

          {/* Add Collaborator Form */}
          {canManage && (
            <div className="mb-6">
              <h4 className="text-sm font-medium mb-3">Invite People</h4>
              <form onSubmit={handleShare} className="space-y-3">
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    disabled={loading}
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={permission}
                    onChange={(e) => setPermission(e.target.value)}
                    className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    disabled={loading}
                  >
                    <option value="viewer">Can view</option>
                    <option value="editor">Can edit</option>
                  </select>
                  <button
                    type="submit"
                    disabled={loading || !email.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? 'Sharing...' : 'Share'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Generate Shareable Link */}
          {userPermission === 'owner' && (
            <div className="mb-6">
              <h4 className="text-sm font-medium mb-3">Shareable Link</h4>
              {!showShareableLink ? (
                <button
                  onClick={handleGenerateLink}
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Generating...' : 'Generate Link'}
                </button>
              ) : (
                <div className="space-y-2">
                  <div className={`p-3 border rounded-lg ${
                    isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
                  }`}>
                    <p className="text-sm break-all">{shareableLink}</p>
                  </div>
                  <button
                    onClick={copyToClipboard}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                  >
                    Copy Link
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Current Collaborators */}
          <div>
            <h4 className="text-sm font-medium mb-3">People with access</h4>
            <div className="space-y-2">
              {/* Owner */}
              {owner && (
                <div className="flex items-center justify-between p-3 border rounded-lg border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                      {owner.username?.charAt(0).toUpperCase() || 'O'}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{owner.username}</p>
                      <p className="text-xs text-gray-500">{owner.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getPermissionIcon('owner')}
                    <span className="text-sm text-yellow-600">Owner</span>
                  </div>
                </div>
              )}

              {/* Collaborators */}
              {collaborators.map((collaborator) => (
                <div key={collaborator._id} className="flex items-center justify-between p-3 border rounded-lg border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white ${
                      collaborator.permission === 'editor' ? 'bg-green-500' : 'bg-blue-500'
                    }`}>
                      {collaborator.userId?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{collaborator.userId?.username || 'Unknown User'}</p>
                      <p className="text-xs text-gray-500">{collaborator.userId?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {canManage ? (
                      <select
                        value={collaborator.permission}
                        onChange={(e) => handlePermissionChange(collaborator.userId?._id, e.target.value)}
                        className={`text-sm px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        disabled={loading}
                      >
                        <option value="viewer">Can view</option>
                        <option value="editor">Can edit</option>
                      </select>
                    ) : (
                      <div className="flex items-center gap-1">
                        {getPermissionIcon(collaborator.permission)}
                        <span className="text-sm">{getPermissionText(collaborator.permission)}</span>
                      </div>
                    )}
                    {canManage && (
                      <button
                        onClick={() => handleRemoveCollaborator(collaborator.userId?._id)}
                        disabled={loading}
                        className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900 rounded transition-colors"
                        title="Remove collaborator"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {collaborators.length === 0 && (
                <p className="text-sm text-gray-500 py-4 text-center">
                  No collaborators yet. Invite people to start collaborating!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentSharing;
