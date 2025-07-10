import express from 'express';
import UserController from '../controllers/userController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import userService from '../services/userService.js'; 
const userController = new UserController(userService);

const router = express.Router();

router.post('/register', userController.registerUser.bind(userController));
router.post('/login', userController.loginUser.bind(userController));
router.get('/me', authMiddleware, userController.getUser.bind(userController));

export default router;
