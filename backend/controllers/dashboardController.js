import User from "../models/User.js";
import InterviewSession from "../models/InterviewSession.js";
import PredictHistory from "../models/PredictHistory.js";

export const getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // user info
    const user = await User.findById(userId).select("-password");

    // latest interview session
    const latestSession = await InterviewSession.findOne({ userId })
      .sort({ createdAt: -1 });

    // ATS average or latest
    const atsScore = latestSession?.atsScore || 0;

    // prediction history
    const predictions = await PredictHistory.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      user,
      atsScore,
      latestSession,
      predictions,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};