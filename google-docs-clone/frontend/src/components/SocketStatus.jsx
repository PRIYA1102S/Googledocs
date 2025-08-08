import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const SocketStatus = () => {
  const [status, setStatus] = useState('Disconnected');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:5000', {
      withCredentials: true,
    });

    newSocket.on('connect', () => {
      setStatus('Connected');
      console.log('Socket connected successfully!');
    });

    newSocket.on('disconnect', () => {
      setStatus('Disconnected');
      console.log('Socket disconnected');
    });

    newSocket.on('connect_error', (error) => {
      setStatus('Connection Failed');
      console.error('Socket connection error:', error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const testConnection = () => {
    if (socket) {
      socket.emit('test', { message: 'Hello from client!' });
      console.log('Test message sent');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg p-3 shadow-lg z-50">
      <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${
          status === 'Connected' ? 'bg-green-500' : 
          status === 'Connection Failed' ? 'bg-red-500' : 'bg-yellow-500'
        }`}></div>
        <span className="text-sm font-medium">Socket: {status}</span>
      </div>
      <button 
        onClick={testConnection}
        className="mt-2 text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
      >
        Test Connection
      </button>
    </div>
  );
};

export default SocketStatus;
