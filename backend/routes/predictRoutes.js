import express from "express";
import multer from "multer";
import path from "path";

import protect from "../middleware/authMiddleware.js";

import {
  predictRole,
  getPredictionHistory,
} from "../controllers/predictController.js";

const router = express.Router();

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9);

    cb(
      null,
      uniqueName +
        path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });

// Predict Role Route
router.post(
  "/predict-role",
  protect,
  upload.single("file"),
  predictRole
);

// Prediction History Route
router.get(
  "/history",
  protect,
  getPredictionHistory
);

export default router;