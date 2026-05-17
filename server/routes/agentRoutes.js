import express from 'express';
import multer  from 'multer';
import path    from 'path';
import { protect } from '../middleware/authMiddleware.js';
import {
  startSession,
  sendMessage,
  generateAtsScore,
  getSessions,
} from '../controllers/agentController.js';

const router = express.Router();

// ← preserve original extension so ML knows file type
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);   // e.g. 1716912345678.pdf
  },
});
const upload = multer({ storage });

router.post('/start',     protect,                        startSession);
router.post('/message',   protect, upload.single('resume'), sendMessage);
router.post('/ats-score', protect,                        generateAtsScore);
router.get('/sessions',   protect,                        getSessions);

export default router;