import { useEffect, useRef, useCallback, useState } from 'react';
import { updateDocument } from '../services/documentService';

const useAutoSave = (documentId, document, enabled = true, onSaveSuccess = null) => {
  const timeoutRef = useRef(null);
  const lastSavedRef = useRef(null);
  const [isSaving, setIsSaving] = useState(false);

  const saveDocument = useCallback(async () => {
    if (!documentId || !document || isSaving) {
      return;
    }

    // Check if document has actually changed
    const currentDocString = JSON.stringify(document);
    if (lastSavedRef.current === currentDocString) {
      return;
    }

    // Prevent saving obviously invalid payloads
    if (!document.title || document.title.trim() === '') {
      return;
    }

    try {
      setIsSaving(true);
      // Don't use the returned document to avoid state updates that could reset cursor
      await updateDocument(documentId, document);
      lastSavedRef.current = currentDocString;
      console.log('Document auto-saved successfully');
      
      // Call the success callback if provided
      if (onSaveSuccess) {
        console.log('Auto-save completed successfully, calling success callback');
        onSaveSuccess();
      }
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setIsSaving(false);
    }
  }, [documentId, document, onSaveSuccess]);

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

  // Cleanup timers on unmount; do not trigger a save to avoid state update after unmount warnings
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const forceSave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    return saveDocument();
  }, [saveDocument]);

  return {
    forceSave,
    isSaving
  };
};

export default useAutoSave;