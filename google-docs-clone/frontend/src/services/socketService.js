import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.documentId = null;
    this.isConnected = false;
  }

  connect(serverUrl = 'http://localhost:5000') {
    if (this.socket && this.isConnected) {
      return this.socket;
    }

    this.socket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      withCredentials: true
    });

    this.socket.on('connect', () => {
      console.log('Connected to server:', this.socket.id);
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.documentId = null;
    }
  }

  joinDocument(documentId, userId, userName) {
    if (!this.socket || !this.isConnected) {
      console.error('Socket not connected');
      return;
    }

    this.documentId = documentId;
    this.socket.emit('join-document', {
      documentId,
      userId,
      userName
    });
  }

  leaveDocument() {
    if (this.socket && this.documentId) {
      this.socket.disconnect();
      this.documentId = null;
    }
  }

  sendDocumentChange(documentId, delta, content) {
    if (!this.socket || !this.isConnected) {
      console.error('Socket not connected');
      return;
    }

    this.socket.emit('document-change', {
      documentId,
      delta,
      content
    });
  }

  sendCursorChange(documentId, position, selection) {
    if (!this.socket || !this.isConnected) {
      console.error('Socket not connected');
      return;
    }

    this.socket.emit('cursor-change', {
      documentId,
      position,
      selection
    });
  }

  // Event listeners
  onDocumentChanged(callback) {
    if (this.socket) {
      this.socket.on('document-changed', callback);
    }
  }

  onUserJoined(callback) {
    if (this.socket) {
      this.socket.on('user-joined', callback);
    }
  }

  onUserLeft(callback) {
    if (this.socket) {
      this.socket.on('user-left', callback);
    }
  }

  onUsersInDocument(callback) {
    if (this.socket) {
      this.socket.on('users-in-document', callback);
    }
  }

  onCursorChanged(callback) {
    if (this.socket) {
      this.socket.on('cursor-changed', callback);
    }
  }

  // Remove event listeners
  offDocumentChanged(callback) {
    if (this.socket) {
      this.socket.off('document-changed', callback);
    }
  }

  offUserJoined(callback) {
    if (this.socket) {
      this.socket.off('user-joined', callback);
    }
  }

  offUserLeft(callback) {
    if (this.socket) {
      this.socket.off('user-left', callback);
    }
  }

  offUsersInDocument(callback) {
    if (this.socket) {
      this.socket.off('users-in-document', callback);
    }
  }

  offCursorChanged(callback) {
    if (this.socket) {
      this.socket.off('cursor-changed', callback);
    }
  }
}

// Create a singleton instance
const socketService = new SocketService();

export default socketService;