class DocumentController {
    constructor(documentService) {
        this.documentService = documentService;
    }

    async createDocument(req, res) {
        try {
            const documentData = {
                ...req.body,
                userId: req.user._id,  // Attach the current user ID
            };
            const newDocument = await this.documentService.createDocument(documentData);
            res.status(201).json(newDocument);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getDocument(req, res) {
        try {
            const { id } = req.params;
            const document = await this.documentService.getDocument(id, req.user._id);
            res.status(200).json(document);
        } catch (error) {
            const statusCode = error.message === 'Unauthorized access' ? 403 : 404;
            res.status(statusCode).json({ message: error.message });
        }
    }

    async updateDocument(req, res) {
        try {
            const { id } = req.params;
            const updatedData = req.body;
            const updatedDocument = await this.documentService.updateDocument(id, updatedData, req.user._id);
            res.status(200).json(updatedDocument);
        } catch (error) {
            // Distinguish validation errors vs not found vs unauthorized
            if (error.message === 'Unauthorized access') {
                return res.status(403).json({ message: error.message });
            }
            if (error.message === 'Document not found') {
                return res.status(404).json({ message: error.message });
            }
            // Mongoose validation or other issues
            return res.status(400).json({ message: error.message });
        }
    }

    async deleteDocument(req, res) {
        try {
            const { id } = req.params;
            await this.documentService.deleteDocument(id, req.user._id);
            res.status(204).send();
        } catch (error) {
            const statusCode = error.message === 'Unauthorized access' ? 403 : 404;
            res.status(statusCode).json({ message: error.message });
        }
    }


    async getAllDocuments(req, res) {
        try {
            const documents = await this.documentService.getAllDocumentsForUser(req.user.id);
            res.status(200).json(documents);
        } catch (error) {
            res.status(500).json({ message: 'Failed to fetch documents' });
        }
    }

    // Sharing related methods
    async shareDocument(req, res) {
        try {
            const { id } = req.params;
            const { email, permission } = req.body;
            
            if (!email || !permission) {
                return res.status(400).json({ message: 'Email and permission are required' });
            }

            if (!['viewer', 'editor'].includes(permission)) {
                return res.status(400).json({ message: 'Invalid permission type' });
            }

            const document = await this.documentService.shareDocument(id, req.user._id, email, permission);
            res.status(200).json({ 
                message: 'Document shared successfully',
                document 
            });
        } catch (error) {
            const statusCode = error.message.includes('not found') ? 404 : 
                              error.message.includes('Unauthorized') ? 403 : 400;
            res.status(statusCode).json({ message: error.message });
        }
    }

    async removeCollaborator(req, res) {
        try {
            const { id, collaboratorId } = req.params;
            const document = await this.documentService.removeCollaborator(id, req.user._id, collaboratorId);
            res.status(200).json({ 
                message: 'Collaborator removed successfully',
                document 
            });
        } catch (error) {
            const statusCode = error.message.includes('not found') ? 404 : 
                              error.message.includes('Unauthorized') ? 403 : 400;
            res.status(statusCode).json({ message: error.message });
        }
    }

    async updateCollaboratorPermission(req, res) {
        try {
            const { id, collaboratorId } = req.params;
            const { permission } = req.body;

            if (!permission || !['viewer', 'editor'].includes(permission)) {
                return res.status(400).json({ message: 'Valid permission is required' });
            }

            const document = await this.documentService.updateCollaboratorPermission(id, req.user._id, collaboratorId, permission);
            res.status(200).json({ 
                message: 'Collaborator permission updated successfully',
                document 
            });
        } catch (error) {
            const statusCode = error.message.includes('not found') ? 404 : 
                              error.message.includes('Unauthorized') ? 403 : 400;
            res.status(statusCode).json({ message: error.message });
        }
    }

    async generateShareableLink(req, res) {
        try {
            const { id } = req.params;
            const shareableLink = await this.documentService.generateShareableLink(id, req.user._id);
            res.status(200).json({ 
                shareableLink,
                fullUrl: `${req.protocol}://${req.get('host')}/api/documents/shared/${shareableLink}`
            });
        } catch (error) {
            const statusCode = error.message.includes('not found') ? 404 : 
                              error.message.includes('Unauthorized') ? 403 : 400;
            res.status(statusCode).json({ message: error.message });
        }
    }

    async getDocumentByShareableLink(req, res) {
        try {
            const { shareableLink } = req.params;
            const document = await this.documentService.getDocumentByShareableLink(shareableLink, req.user._id);
            res.status(200).json(document);
        } catch (error) {
            const statusCode = error.message.includes('not found') || error.message.includes('Invalid') ? 404 : 
                              error.message.includes('Unauthorized') ? 403 : 400;
            res.status(statusCode).json({ message: error.message });
        }
    }

    async getCollaborators(req, res) {
        try {
            const { id } = req.params;
            const document = await this.documentService.getDocument(id, req.user._id);
            
            // Return collaborators with user permission info
            const collaborators = document.collaborators.map(collab => ({
                _id: collab._id,
                userId: collab.userId,
                permission: collab.permission,
                invitedBy: collab.invitedBy,
                invitedAt: collab.invitedAt,
                status: collab.status
            }));

            res.status(200).json({
                owner: document.userId,
                collaborators,
                userPermission: document.userPermission
            });
        } catch (error) {
            const statusCode = error.message.includes('not found') ? 404 : 
                              error.message.includes('Unauthorized') ? 403 : 400;
            res.status(statusCode).json({ message: error.message });
        }
    }
}

export default DocumentController;
