import express from "express";
import multer from "multer";
import path from "path";
import { protect } from "../middleware/authMiddleware.js";

import {
  startSession,
  sendMessage,
  generateAtsScore,
  getSessions,
} from "../controllers/agentController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage });

// ✅ correct endpoints
router.post("/start", protect, startSession);
router.post("/message", protect, upload.single("file"), sendMessage);
router.post("/ats-score", protect, generateAtsScore);
router.get("/sessions", protect, getSessions);

export default router;