import mongoose from 'mongoose';

const ScrapedJobSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    jobRole: { type: String, required: true },
    title: { type: String, required: true },
    company: { type: String, default: 'N/A' },
    location: { type: String, default: 'N/A' },
    url: { type: String, required: true },
    source: { type: String, default: 'N/A' },
    postedDate: { type: String, default: '' },
    descriptionSnippet: { type: String, default: '' },
    relevanceScore: { type: Number, default: 0 },
    reason: { type: String, default: '' },
  },
  { timestamps: true }
);

// Auto-delete after 48 hours so results stay fresh
ScrapedJobSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 172800 }
);

// IMPORTANT: ES Module export
export default mongoose.model('ScrapedJob', ScrapedJobSchema);