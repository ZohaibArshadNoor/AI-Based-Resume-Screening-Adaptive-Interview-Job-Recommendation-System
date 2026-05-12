const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  extractedSkills: [String],
  resumeScore: Number,
  rawText: String,
}, { timestamps: true });

module.exports = mongoose.model('Resume', ResumeSchema);
