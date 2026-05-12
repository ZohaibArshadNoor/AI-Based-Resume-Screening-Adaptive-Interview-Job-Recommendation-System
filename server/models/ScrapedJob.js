const mongoose = require('mongoose');

const ScrapedJobSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: String,
  company: String,
  location: String,
  jobUrl: String,
  requiredSkills: [String],
  matchScore: Number,
  scrapedAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('ScrapedJob', ScrapedJobSchema);
