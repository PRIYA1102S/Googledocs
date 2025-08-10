import axiosInstance from '../axiosInstance';

const API_URL = '/api/documents';

// Share a document with another user
export const shareDocument = async (documentId, email, permission) => {
    try {
        const response = await axiosInstance.post(`${API_URL}/${documentId}/share`, {
            email,
            permission
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to share document');
    }
};

// Remove a collaborator from a document
export const removeCollaborator = async (documentId, collaboratorId) => {
    try {
        const response = await axiosInstance.delete(`${API_URL}/${documentId}/collaborators/${collaboratorId}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to remove collaborator');
    }
};

// Update collaborator permission
export const updateCollaboratorPermission = async (documentId, collaboratorId, permission) => {
    try {
        const response = await axiosInstance.put(`${API_URL}/${documentId}/collaborators/${collaboratorId}`, {
            permission
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to update permission');
    }
};

// Get all collaborators for a document
export const getCollaborators = async (documentId) => {
    try {
        const response = await axiosInstance.get(`${API_URL}/${documentId}/collaborators`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch collaborators');
    }
};

// Generate shareable link
export const generateShareableLink = async (documentId) => {
    try {
        const response = await axiosInstance.post(`${API_URL}/${documentId}/generate-link`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to generate shareable link');
    }
};

// Get document by shareable link
export const getDocumentByShareableLink = async (shareableLink) => {
    try {
        const response = await axiosInstance.get(`${API_URL}/shared/${shareableLink}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to access shared document');
    }
};
