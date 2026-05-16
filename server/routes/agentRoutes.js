import express from 'express';
import multer  from 'multer';
import { protect } from '../middleware/authMiddleware.js';
import {
  startSession,
  sendMessage,
  generateAtsScore,
  getSessions,
} from '../controllers/agentController.js';

const router  = express.Router();

// Store uploads in /uploads temporarily; controller deletes after use
const upload  = multer({ dest: 'uploads/' });

router.post('/start',      protect,                       startSession);
router.post('/message',    protect, upload.single('resume'), sendMessage);
router.post('/ats-score',  protect,                       generateAtsScore);
router.get('/sessions',    protect,                       getSessions);

export default router;