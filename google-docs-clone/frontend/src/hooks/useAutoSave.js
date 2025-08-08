import { useEffect, useRef, useCallback } from 'react';
import { updateDocument } from '../services/documentService';

const useAutoSave = (documentId, document, enabled = true) => {
  const timeoutRef = useRef(null);
  const lastSavedRef = useRef(null);
  const isSavingRef = useRef(false);

  const saveDocument = useCallback(async () => {
    if (!documentId || !document || isSavingRef.current) {
      return;
    }

    // Check if document has actually changed
    const currentDocString = JSON.stringify(document);
    if (lastSavedRef.current === currentDocString) {
      return;
    }

    try {
      isSavingRef.current = true;
      await updateDocument(documentId, document);
      lastSavedRef.current = currentDocString;
      console.log('Document auto-saved successfully');
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      isSavingRef.current = false;
    }
  }, [documentId, document]);

  const debouncedSave = useCallback(() => {
    if (!enabled) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      saveDocument();
    }, 2000); // Auto-save after 2 seconds of inactivity
  }, [saveDocument, enabled]);

  useEffect(() => {
    if (enabled && document) {
      debouncedSave();
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [document, debouncedSave, enabled]);

  // Save immediately when component unmounts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      // Immediate save on unmount
      saveDocument();
    };
  }, [saveDocument]);

  const forceSave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    return saveDocument();
  }, [saveDocument]);

  return {
    forceSave,
    isSaving: isSavingRef.current
  };
};

export default useAutoSave;