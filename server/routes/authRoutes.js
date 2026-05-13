import express from 'express';

import {
    register,
    login
} from '../controllers/authController.js';

import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);

router.post('/login', login);

router.get(
    '/me',
    authMiddleware,
    async (req, res) => {

        res.status(200).json({
            message: 'Protected route accessed',
            userId: req.user.id
        });

    }
);

export default router;