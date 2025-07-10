import Document from '../models/Document';
import logger from '../utils/logger';

export const createDocument = async (documentData) => {
    try {
        const document = new Document(documentData);
        await document.save();
        return document;
    } catch (error) {
        logger.error('Error creating document:', error);
        throw new Error('Could not create document');
    }
};

export const getDocument = async (documentId) => {
    try {
        const document = await Document.findById(documentId);
        if (!document) {
            throw new Error('Document not found');
        }
        return document;
    } catch (error) {
        logger.error('Error fetching document:', error);
        throw new Error('Could not fetch document');
    }
};

export const updateDocument = async (documentId, updateData) => {
    try {
        const updatedDocument = await Document.findByIdAndUpdate(documentId, updateData, { new: true });
        if (!updatedDocument) {
            throw new Error('Document not found');
        }
        return updatedDocument;
    } catch (error) {
        logger.error('Error updating document:', error);
        throw new Error('Could not update document');
    }
};

export const deleteDocument = async (documentId) => {
    try {
        const deletedDocument = await Document.findByIdAndDelete(documentId);
        if (!deletedDocument) {
            throw new Error('Document not found');
        }
        return deletedDocument;
    } catch (error) {
        logger.error('Error deleting document:', error);
        throw new Error('Could not delete document');
    }
};