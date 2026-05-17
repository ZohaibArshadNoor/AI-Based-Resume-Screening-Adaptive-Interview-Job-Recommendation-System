import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  role:      { type: String, enum: ['user', 'assistant'], required: true },
  content:   { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const InterviewSessionSchema = new mongoose.Schema({
  userId:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  jobDescription: { type: String, required: true },
  role:           { type: String, default: '' },
  resumeText:     { type: String, default: '' },
  resumeSkills:   { type: [String], default: [] },
  messages:       { type: [MessageSchema], default: [] },
  isComplete:     { type: Boolean, default: false },
  atsScore:       { type: Number, default: null },
  atsReport:      { type: mongoose.Schema.Types.Mixed, default: null },
}, { timestamps: true });

export default mongoose.model('InterviewSession', InterviewSessionSchema);