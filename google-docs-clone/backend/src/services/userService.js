import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger.js';

const userService = {
    async createUser(userData) {
        try {
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            const user = new User({ ...userData, password: hashedPassword });
            await user.save();
            logger.info(`User registered: ${userData.username}`);
            return user;
        } catch (error) {
            logger.error(`Error registering user: ${error.message}`);
            throw new Error('User registration failed');
        }
    },

    async loginUser(credentials) {
        try {
            const user = await User.findOne({ email: credentials.email });
            if (!user) {
                throw new Error('User not found');
            }
            const isMatch = await bcrypt.compare(credentials.password, user.password);
            if (!isMatch) {
                throw new Error('Invalid credentials');
            }
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            logger.info(`User logged in: ${user.username}`);
            return { user, token };
        } catch (error) {
            logger.error(`Error logging in user: ${error.message}`);
            throw new Error('Login failed');
        }
    },

    async getUser(userId) {
        try {
            const user = await User.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }
            return user;
        } catch (error) {
            logger.error(`Error fetching user: ${error.message}`);
            throw new Error('User retrieval failed');
        }
    }
};

export default userService;