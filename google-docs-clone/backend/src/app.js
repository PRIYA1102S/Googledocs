import dotenv from 'dotenv';

dotenv.config();

import express from "express";
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import documentRoutes from './routes/documentRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { connectDB } from './config/db.js';
import  logger  from './utils/logger.js';
import authMiddleware from './middlewares/authMiddleware.js';
import uploadRoutes from './routes/upload.js';
import cors from 'cors';

const app = express();
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

// Start the server
app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});