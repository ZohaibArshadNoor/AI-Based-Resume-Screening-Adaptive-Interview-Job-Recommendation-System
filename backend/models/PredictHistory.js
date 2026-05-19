import mongoose from "mongoose";

const predictHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    fileName: {
      type: String,
      required: true,
    },

    selectedRole: {
      type: String,
      required: true,
    },

    predictedRole: {
      type: String,
      required: true,
    },

    match: {
      type: Boolean,
      default: false,
    },

    confidence: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const PredictHistory = mongoose.model(
  "PredictHistory",
  predictHistorySchema
);

export default PredictHistory;