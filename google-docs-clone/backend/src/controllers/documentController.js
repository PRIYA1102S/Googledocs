class DocumentController {
    constructor(documentService) {
        this.documentService = documentService;
    }

    async createDocument(req, res) {
        try {
            const documentData = req.body;
            const newDocument = await this.documentService.createDocument(documentData);
            res.status(201).json(newDocument);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getDocument(req, res) {
        try {
            const { id } = req.params;
            const document = await this.documentService.getDocument(id);
            if (!document) {
                return res.status(404).json({ message: 'Document not found' });
            }
            res.status(200).json(document);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async updateDocument(req, res) {
        try {
            const { id } = req.params;
            const updatedData = req.body;
            const updatedDocument = await this.documentService.updateDocument(id, updatedData);
            if (!updatedDocument) {
                return res.status(404).json({ message: 'Document not found' });
            }
            res.status(200).json(updatedDocument);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async deleteDocument(req, res) {
        try {
            const { id } = req.params;
            const deletedDocument = await this.documentService.deleteDocument(id);
            if (!deletedDocument) {
                return res.status(404).json({ message: 'Document not found' });
            }
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default DocumentController;