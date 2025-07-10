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


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
// app.use(authMiddleware);

// Connect to Database
connectDB();

// Routes
// Public Routes
app.use('/api/users', userRoutes);

// Protected Routes
app.use('/api/documents', authMiddleware, documentRoutes);

// Start the server
app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});