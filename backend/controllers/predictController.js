import axios from "axios";
import fs from "fs";
import FormData from "form-data";

import PredictHistory from "../models/PredictHistory.js";

export const predictRole = async (req, res) => {
  try {
    const file = req.file;
    const { role } = req.body;

    if (!file) {
      return res.status(400).json({
        error: "CV file is required",
      });
    }

    // Create form data for FastAPI
    const form = new FormData();

    form.append("role", role);

    form.append(
      "file",
      fs.createReadStream(file.path)
    );

    // Call FastAPI ML service
    const response = await axios.post(
      "http://localhost:8000/predict-role",
      form,
      {
        headers: form.getHeaders(),
      }
    );

    const predictionData = response.data;

    // Save to MongoDB
    const savedPrediction =
      await PredictHistory.create({
        user: req.user._id,

        fileName: predictionData.file_name,

        selectedRole:
          predictionData.selected_role,

        predictedRole:
          predictionData.predicted_role,

        match: predictionData.match,

        confidence:
          predictionData.confidence,
      });

    // Delete uploaded temp file
    fs.unlinkSync(file.path);

    return res.json(savedPrediction);

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      error: "Prediction failed",
      details: error.message,
    });
  }
};


// GET USER HISTORY
export const getPredictionHistory =
  async (req, res) => {
    try {

      const history =
        await PredictHistory.find({
          user: req.user._id,
        }).sort({
          createdAt: -1,
        });

      return res.json(history);

    } catch (error) {

      return res.status(500).json({
        error:
          "Could not fetch history",
      });
    }
  };