import axios from 'axios';

const API_URL = '/api/documents';

export const createDocument = async (documentData) => {
    const response = await axios.post(API_URL, documentData);
    return response.data;
};

export const getDocument = async (documentId) => {
    const response = await axios.get(`${API_URL}/${documentId}`);
    return response.data;
};

export const updateDocument = async (documentId, documentData) => {
    const response = await axios.put(`${API_URL}/${documentId}`, documentData);
    return response.data;
};

export const deleteDocument = async (documentId) => {
    const response = await axios.delete(`${API_URL}/${documentId}`);
    return response.data;
};

export const getAllDocuments = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};