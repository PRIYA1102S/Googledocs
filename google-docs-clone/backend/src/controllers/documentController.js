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
            const statusCode = error.message === 'Unauthorized access' ? 403 : 404;
            res.status(statusCode).json({ message: error.message });
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
}

export default DocumentController;
