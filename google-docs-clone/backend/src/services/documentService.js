import Document from '../models/Document.js';
import logger from '../utils/logger.js';

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


export const getDocument = async (documentId, userId) => {
    const document = await Document.findById(documentId);
    if (!document) {
        throw new Error('Document not found');
    }
    if (document.userId.toString() !== userId.toString()) {
        throw new Error('Unauthorized access');
    }
    return document;
};


export const updateDocument = async (documentId, updateData, userId) => {
    const document = await Document.findById(documentId);
    if (!document) {
        throw new Error('Document not found');
    }
    if (document.userId.toString() !== userId.toString()) {
        throw new Error('Unauthorized access');
    }

    Object.assign(document, updateData);
    await document.save();
    return document;
};


export const deleteDocument = async (documentId, userId) => {
    const document = await Document.findById(documentId);
    if (!document) {
        throw new Error('Document not found');
    }
    if (document.userId.toString() !== userId.toString()) {
        throw new Error('Unauthorized access');
    }

    await document.deleteOne();
    return document;
};

export const getAllDocumentsForUser = async (userId) => {
    return await Document.find({ userId });
};
