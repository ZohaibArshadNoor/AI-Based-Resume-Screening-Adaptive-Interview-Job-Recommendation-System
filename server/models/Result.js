const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resumeScore: Number,
  interviewScore: Number,
  overallScore: Number,
  feedback: String,
}, { timestamps: true });

module.exports = mongoose.model('Result', ResultSchema);
