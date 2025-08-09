import express from 'express';
import DocumentController from '../controllers/documentController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import * as documentService from '../services/documentService.js';


const router = express.Router();
const documentController = new DocumentController(documentService);

// Document CRUD routes
router.post('/', authMiddleware, documentController.createDocument.bind(documentController));
router.get('/', authMiddleware, documentController.getAllDocuments.bind(documentController));
router.get('/:id', authMiddleware, documentController.getDocument.bind(documentController));
router.put('/:id', authMiddleware, documentController.updateDocument.bind(documentController));
router.delete('/:id', authMiddleware, documentController.deleteDocument.bind(documentController));

// Sharing routes
router.post('/:id/share', authMiddleware, documentController.shareDocument.bind(documentController));
router.delete('/:id/collaborators/:collaboratorId', authMiddleware, documentController.removeCollaborator.bind(documentController));
router.put('/:id/collaborators/:collaboratorId', authMiddleware, documentController.updateCollaboratorPermission.bind(documentController));
router.get('/:id/collaborators', authMiddleware, documentController.getCollaborators.bind(documentController));
router.post('/:id/generate-link', authMiddleware, documentController.generateShareableLink.bind(documentController));
router.get('/shared/:shareableLink', authMiddleware, documentController.getDocumentByShareableLink.bind(documentController));


export default router;