import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const useSocket = (documentId, userId, userName) => {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  

  useEffect(() => {
    if (!documentId || !userId || !userName) return;

    // Initialize socket connection
    socketRef.current = io('http://localhost:5000', {
      withCredentials: true,
    });


    const socket = socketRef.current;

    // Add minimal connection logging
    socket.on('connect', () => {
      setIsConnected(true);
      console.log('✅ Socket connected');
    });

    socket.on('connect_error', (error) => {
      console.error('❌ Socket connection failed:', error);
    });

    // Join the document room
    socket.emit('join-document', {
      documentId,
      userId,
      userName,
    });

    // Cleanup on unmount
    return () => {
      if (socket) {
        setIsConnected(false);
        socket.disconnect();
        socketRef.current = null;
      }
    };
  }, [documentId, userId, userName]);

  const emitDocumentChange = (delta, content) => {
    if (socketRef.current && isConnected) {
      console.log('Socket emitting document-change:', { documentId, delta, content });
      socketRef.current.emit('document-change', {
        documentId,
        delta,
        content,
      });
    } else {
      console.warn('Socket not connected yet, skipping document-change emit');
    }
  };

  const emitCursorChange = (position, selection) => {
    if (socketRef.current && isConnected) {
      console.log('Socket emitting cursor-change:', { documentId, position, selection });
      socketRef.current.emit('cursor-change', {
        documentId,
        position,
        selection,
      });
    } else {
      console.warn('Socket not connected yet, skipping cursor-change emit');
    }
  };

  const onDocumentChange = (callback) => {
    if (socketRef.current) {
      socketRef.current.on('document-changed', callback);
    }
  };

  const onCursorChange = (callback) => {
    if (socketRef.current) {
      socketRef.current.on('cursor-changed', callback);
    }
  };

  const onUserJoined = (callback) => {
    if (socketRef.current) {
      socketRef.current.on('user-joined', callback);
    }
  };

  const onUserLeft = (callback) => {
    if (socketRef.current) {
      socketRef.current.on('user-left', callback);
    }
  };

  const onUsersInDocument = (callback) => {
    if (socketRef.current) {
      socketRef.current.on('users-in-document', callback);
    }
  };

  const offDocumentChange = () => {
    if (socketRef.current) {
      socketRef.current.off('document-changed');
    }
  };

  const offCursorChange = () => {
    if (socketRef.current) {
      socketRef.current.off('cursor-changed');
    }
  };

  const offUserJoined = () => {
    if (socketRef.current) {
      socketRef.current.off('user-joined');
    }
  };

  const offUserLeft = () => {
    if (socketRef.current) {
      socketRef.current.off('user-left');
    }
  };

  const offUsersInDocument = () => {
    if (socketRef.current) {
      socketRef.current.off('users-in-document');
    }
  };

  return {
    socket: socketRef.current,
    isConnected,
    emitDocumentChange,
    emitCursorChange,
    onDocumentChange,
    onCursorChange,
    onUserJoined,
    onUserLeft,
    onUsersInDocument,
    offDocumentChange,
    offCursorChange,
    offUserJoined,
    offUserLeft,
    offUsersInDocument,
  };
};

export default useSocket;