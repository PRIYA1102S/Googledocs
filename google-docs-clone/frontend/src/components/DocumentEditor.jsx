import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getDocument, saveDocument } from '../services/documentService';
import TextElement from './TextElement';
import ImageElement from './ImageElement';

const DocumentEditor = () => {
    const { id } = useParams();
    const [document, setDocument] = useState({ title: '', content: [] });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDocument = async () => {
            try {
                const fetchedDocument = await getDocument(id);
                setDocument(fetchedDocument);
            } catch (error) {
                console.error('Error fetching document:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDocument();
    }, [id]);

    const handleSave = async () => {
        try {
            await saveDocument(document);
            alert('Document saved successfully!');
        } catch (error) {
            console.error('Error saving document:', error);
        }
    };

    const handleChange = (updatedContent) => {
        setDocument((prevDoc) => ({ ...prevDoc, content: updatedContent }));
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{document.title}</h1>
            <button onClick={handleSave}>Save Document</button>
            <div>
                {document.content.map((element, index) => {
                    if (element.type === 'text') {
                        return (
                            <TextElement
                                key={index}
                                content={element.content}
                                onChange={(newContent) => {
                                    const updatedContent = [...document.content];
                                    updatedContent[index].content = newContent;
                                    handleChange(updatedContent);
                                }}
                            />
                        );
                    } else if (element.type === 'image') {
                        return (
                            <ImageElement
                                key={index}
                                src={element.src}
                                alt={element.alt}
                                onChange={(newSrc) => {
                                    const updatedContent = [...document.content];
                                    updatedContent[index].src = newSrc;
                                    handleChange(updatedContent);
                                }}
                            />
                        );
                    }
                    return null;
                })}
            </div>
        </div>
    );
};

export default DocumentEditor;