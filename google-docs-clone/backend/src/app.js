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

// Protected Routes
app.use('/api/documents', authMiddleware, documentRoutes);

app.use('/api', uploadRoutes);

// Socket.IO connection handling
const documentRooms = new Map(); // Store document rooms and connected users

io.on('connection', (socket) => {
    logger.info(`User connected: ${socket.id}`);

    // Join a document room
    socket.on('join-document', ({ documentId, userId, userName }) => {
        socket.join(documentId);
        socket.documentId = documentId;
        socket.userId = userId;
        socket.userName = userName;

        // Track users in the document room
        if (!documentRooms.has(documentId)) {
            documentRooms.set(documentId, new Map());
        }
        
        const roomUsers = documentRooms.get(documentId);
        roomUsers.set(socket.id, { userId, userName, socketId: socket.id });

        // Notify other users in the room
        socket.to(documentId).emit('user-joined', {
            userId,
            userName,
            socketId: socket.id
        });

        // Send current users list to the new user
        const currentUsers = Array.from(roomUsers.values());
        socket.emit('users-in-document', currentUsers);

        logger.info(`User ${userName} (${userId}) joined document ${documentId}`);
    });

    // Handle document content changes
    socket.on('document-change', ({ documentId, delta, content }) => {
        logger.info(`Document change received from ${socket.userName} (${socket.userId}) for document ${documentId}`);
        logger.info(`Content: ${JSON.stringify(content).substring(0, 100)}...`);
        
        // Broadcast the change to all other users in the document room
    socket.to(documentId).emit('document-changed', {
            delta,
            content,
            userId: socket.userId,
            userName: socket.userName
        });
        
        logger.info(`Broadcasted change to room ${documentId}`);
    });

    // Handle cursor position changes
    socket.on('cursor-change', ({ documentId, position, selection }) => {
        socket.to(documentId).emit('cursor-changed', {
            userId: socket.userId,
            userName: socket.userName,
            position,
            selection
        });
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
                socketId: socket.id
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