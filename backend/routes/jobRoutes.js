import express from 'express';

const router = express.Router();

import auth from '../middleware/authMiddleware.js';
import { findJobs, getRecommendations } from '../controllers/jobController.js';

// Routes
router.post('/find', auth, findJobs);
router.get('/recommendations', auth, getRecommendations);

export default router;