import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DocumentEditor from '../components/DocumentEditor';
import { getDocument } from '../services/documentService';

const DocumentPage = () => {
    const { id } = useParams();
    const [document, setDocument] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDocument = async () => {
            try {
                const fetchedDocument = await getDocument(id);
                setDocument(fetchedDocument);
            } catch (err) {
                setError('Failed to load document');
            } finally {
                setLoading(false);
            }
        };

        fetchDocument();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>{document.title}</h1>
            <DocumentEditor initialContent={document.content} />
        </div>
    );
};

export default DocumentPage;