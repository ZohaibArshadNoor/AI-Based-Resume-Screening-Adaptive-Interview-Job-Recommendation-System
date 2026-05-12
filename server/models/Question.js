const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  jobRole: String,
  questionText: String,
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
}, { timestamps: true });

module.exports = mongoose.model('Question', QuestionSchema);
