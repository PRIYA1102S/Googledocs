import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const useSocket = (documentId, userId, userName) => {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  

  useEffect(() => {
    if (!documentId || !userId) {
      console.log('❌ Missing required params:', { documentId, userId, userName });
      return;
    }

    console.log('🔌 Creating socket connection...', { documentId, userId, userName });
    
    const newSocket = io('http://localhost:5000', {
      transports: ['websocket', 'polling'],
      timeout: 10000,
    });

    newSocket.on('connect', () => {
      console.log('✅ Socket connected successfully:', newSocket.id);
      setIsConnected(true);
      
      newSocket.emit('join-document', {
        documentId,
        userId,
        userName
      });
      console.log('📋 Emitted join-document event');
    });

    newSocket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error);
      setIsConnected(false);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
      setIsConnected(false);
    });

    socketRef.current = newSocket;

    return () => {
      console.log('🧹 Cleaning up socket');
      if (newSocket) {
        newSocket.disconnect();
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
      console.log('🔗 Setting up cursor-changed listener');
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
      console.log('🔌 Removing cursor-changed listener');
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
