import express from 'express';
import DocumentController from '../controllers/documentController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import * as documentService from '../services/documentService.js';


const router = express.Router();
const documentController = new DocumentController(documentService);

router.post('/', authMiddleware, documentController.createDocument.bind(documentController));
router.get('/:id', authMiddleware, documentController.getDocument.bind(documentController));
router.put('/:id', authMiddleware, documentController.updateDocument.bind(documentController));
router.delete('/:id', authMiddleware, documentController.deleteDocument.bind(documentController));

export default router;