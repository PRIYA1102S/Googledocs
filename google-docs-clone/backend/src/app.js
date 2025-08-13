import dotenv from 'dotenv';

dotenv.config();

import express from "express";
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';
import documentRoutes from './routes/documentRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { connectDB } from './config/db.js';
import  logger  from './utils/logger.js';
import authMiddleware from './middlewares/authMiddleware.js';
import uploadRoutes from './routes/upload.js';
import cors from 'cors';
import Document from './models/Document.js';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: '*', // or '*' for all origins (not recommended in prod)
  credentials: true
}));

// // Middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));


// Connect to Database
connectDB();

// Routes
// Public Routes
app.use('/api/users', userRoutes);

// Auth check route expected by frontend
app.get('/api/auth/check', authMiddleware, (req, res) => {
  // Return a minimal, safe user payload
  const user = req.user ? {
    _id: req.user._id,
    id: req.user._id, // some clients use id
    username: req.user.username,
    email: req.user.email
  } : null;
  res.json({ user });
});

// Protected Routes
app.use('/api/documents', authMiddleware, documentRoutes);

app.use('/api', uploadRoutes);

// Socket.IO connection handling
const documentRooms = new Map(); // Store document rooms and connected users

io.on('connection', (socket) => {
    logger.info(`User connected: ${socket.id}`);

    // Join a document room
    socket.on('join-document', async ({ documentId, userId, userName }) => {
        console.log('� User joining document:', { documentId, userId, userName });
        
        socket.userId = userId;
        socket.userName = userName;
        socket.documentId = documentId;
        
        // Join the document room
        socket.join(documentId);
        console.log(`✅ User ${userName} (${userId}) joined room ${documentId}`);
        
        // Log current room members
        const room = io.sockets.adapter.rooms.get(documentId);
        console.log('👥 Current room members:', room ? Array.from(room) : 'No room');
        
        // Notify others in the room
        socket.to(documentId).emit('user-joined', {
            userId,
            userName
        });
    });

    // Handle document content changes
    socket.on('document-change', async ({ documentId, delta, content }) => {
        try {
            logger.info(`Document change received from ${socket.userName} (${socket.userId}) for document ${documentId}`);
            
            // Check if user has edit permissions
            if (socket.userPermission !== 'owner' && socket.userPermission !== 'editor') {
                socket.emit('error', { message: 'Unauthorized to edit document' });
                logger.warn(`User ${socket.userName} (${socket.userId}) attempted to edit document ${documentId} without permission`);
                return;
            }

            logger.info(`Content: ${JSON.stringify(content).substring(0, 100)}...`);
            
            // Broadcast the change to all other users in the document room
            socket.to(documentId).emit('document-changed', {
                delta,
                content,
                userId: socket.userId,
                userName: socket.userName,
                userPermission: socket.userPermission
            });
            
            logger.info(`Broadcasted change to room ${documentId}`);
        } catch (error) {
            logger.error('Error handling document change:', error);
            socket.emit('error', { message: 'Failed to process document change' });
        }
    });

    // Handle cursor position changes
    socket.on('cursor-change', ({ documentId, position, selection }) => {
        console.log('🎯 Backend received cursor-change:', { 
            documentId, 
            position, 
            selection, 
            fromUser: socket.userId,
            fromUserName: socket.userName,
            userPermission: socket.userPermission
        });
        
        // Log all users in the room
        const room = io.sockets.adapter.rooms.get(documentId);
        console.log('👥 Users in room:', room ? Array.from(room) : 'No room found');
        
        socket.to(documentId).emit('cursor-changed', {
            userId: socket.userId,
            userName: socket.userName,
            userPermission: socket.userPermission,
            position,
            selection
        });
        
        console.log('📤 Broadcasted cursor-changed to room:', documentId);
    });

    // Test endpoint for debugging
    socket.on('test', (data) => {
        logger.info(`Test message received from ${socket.id}:`, data);
        socket.emit('test-response', { message: 'Test successful!', timestamp: new Date().toISOString() });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        if (socket.documentId && documentRooms.has(socket.documentId)) {
            const roomUsers = documentRooms.get(socket.documentId);
            roomUsers.delete(socket.id);

            // Notify other users about the disconnection
            socket.to(socket.documentId).emit('user-left', {
                userId: socket.userId,
                userName: socket.userName,
                socketId: socket.id,
                userPermission: socket.userPermission
            });

            // Clean up empty rooms
            if (roomUsers.size === 0) {
                documentRooms.delete(socket.documentId);
            }

            logger.info(`User ${socket.userName} (${socket.userId}) left document ${socket.documentId}`);
        }
        logger.info(`User disconnected: ${socket.id}`);
    });
});

// Start the server
server.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});



