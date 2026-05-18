const mongoose = require('mongoose');

const ScrapedJobSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  jobRole: { type: String, required: true },
  title: { type: String, required: true },
  company: { type: String },
  location: { type: String },
  url: { type: String },
  source: { type: String },           // LinkedIn / Indeed / Rozee.pk
  descriptionSnippet: { type: String },
  relevanceScore: { type: Number, default: 0 },
  reason: { type: String },
}, {
  timestamps: true,
});

// Auto-delete documents older than 48 hours
ScrapedJobSchema.index({ createdAt: 1 }, { expireAfterSeconds: 172800 });

module.exports = mongoose.model('ScrapedJob', ScrapedJobSchema);