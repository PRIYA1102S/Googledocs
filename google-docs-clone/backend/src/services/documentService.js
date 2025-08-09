import Document from '../models/Document.js';
import logger from '../utils/logger.js';
import mongoose from 'mongoose';
import crypto from 'crypto';

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
    const document = await Document.findById(documentId)
        .populate('userId', 'username email')
        .populate('collaborators.userId', 'username email')
        .populate('collaborators.invitedBy', 'username email');
    
    if (!document) {
        throw new Error('Document not found');
    }
    
    // Check if user has permission to view the document
    if (!document.canView(userId)) {
        throw new Error('Unauthorized access');
    }
    
    // Add user's permission level to the document
    const docObj = document.toObject();
    docObj.userPermission = document.getUserPermission(userId);
    
    return docObj;
};


export const updateDocument = async (documentId, updateData, userId) => {
    const document = await Document.findById(documentId);
    if (!document) {
        throw new Error('Document not found');
    }
    
    // Check if user has permission to edit the document
    if (!document.canEdit(userId)) {
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
    
    // Only owners can delete documents
    if (document.userId.toString() !== userId.toString()) {
        throw new Error('Unauthorized access');
    }

    await document.deleteOne();
    return document;
};

export const getAllDocumentsForUser = async (userId) => {
    // Find documents owned by user
    const ownedDocuments = await Document.find({ userId })
        .populate('userId', 'username email')
        .populate('collaborators.userId', 'username email');
    
    // Find documents where user is a collaborator
    const sharedDocuments = await Document.find({
        'collaborators.userId': userId,
        'collaborators.status': 'accepted'
    })
        .populate('userId', 'username email')
        .populate('collaborators.userId', 'username email');
    
    // Combine and return all documents
    const allDocuments = [...ownedDocuments, ...sharedDocuments];
    
    // Remove duplicates (if any) and add permission info
    const uniqueDocuments = allDocuments.reduce((acc, doc) => {
        const existing = acc.find(d => d._id.toString() === doc._id.toString());
        if (!existing) {
            // Add user's permission level to the document
            const docObj = doc.toObject();
            docObj.userPermission = doc.getUserPermission(userId);
            acc.push(docObj);
        }
        return acc;
    }, []);
    
    return uniqueDocuments;
};

// New sharing-related functions
export const shareDocument = async (documentId, inviterUserId, inviteeEmail, permission) => {
    const document = await Document.findById(documentId);
    if (!document) {
        throw new Error('Document not found');
    }
    
    // Check if inviter has permission to manage collaborators
    if (!document.canManageCollaborators(inviterUserId)) {
        throw new Error('Unauthorized to share this document');
    }
    
    // Find the user to invite by email
    const User = mongoose.model('User');
    const inviteeUser = await User.findOne({ email: inviteeEmail });
    if (!inviteeUser) {
        throw new Error('User not found with that email');
    }
    
    // Check if user is the owner
    if (document.userId.toString() === inviteeUser._id.toString()) {
        throw new Error('Cannot share document with the owner');
    }
    
    try {
        document.addCollaborator(inviteeUser._id, permission, inviterUserId);
        await document.save();
        
        // Populate the new collaborator info
        await document.populate('collaborators.userId', 'username email');
        
        return document;
    } catch (error) {
        throw new Error(error.message || 'Failed to share document');
    }
};

export const removeCollaborator = async (documentId, ownerUserId, collaboratorUserId) => {
    const document = await Document.findById(documentId);
    if (!document) {
        throw new Error('Document not found');
    }
    
    // Check if user has permission to manage collaborators
    if (!document.canManageCollaborators(ownerUserId)) {
        throw new Error('Unauthorized to manage collaborators');
    }
    
    document.removeCollaborator(collaboratorUserId);
    await document.save();
    
    return document;
};

export const updateCollaboratorPermission = async (documentId, ownerUserId, collaboratorUserId, newPermission) => {
    const document = await Document.findById(documentId);
    if (!document) {
        throw new Error('Document not found');
    }
    
    // Check if user has permission to manage collaborators
    if (!document.canManageCollaborators(ownerUserId)) {
        throw new Error('Unauthorized to manage collaborators');
    }
    
    document.updateCollaboratorPermission(collaboratorUserId, newPermission);
    await document.save();
    
    return document;
};

export const generateShareableLink = async (documentId, userId) => {
    const document = await Document.findById(documentId);
    if (!document) {
        throw new Error('Document not found');
    }
    
    // Only owners can generate shareable links
    if (document.userId.toString() !== userId.toString()) {
        throw new Error('Unauthorized to generate shareable link');
    }
    
    // Generate a unique shareable link if it doesn't exist
    if (!document.shareableLink) {
        document.shareableLink = crypto.randomBytes(32).toString('hex');
        await document.save();
    }
    
    return document.shareableLink;
};

export const getDocumentByShareableLink = async (shareableLink, userId) => {
    const document = await Document.findOne({ shareableLink })
        .populate('userId', 'username email')
        .populate('collaborators.userId', 'username email');
    
    if (!document) {
        throw new Error('Invalid or expired link');
    }
    
    // Check if user has access
    if (!document.canView(userId) && !document.isPublic) {
        throw new Error('Unauthorized access');
    }
    
    return document;
};
