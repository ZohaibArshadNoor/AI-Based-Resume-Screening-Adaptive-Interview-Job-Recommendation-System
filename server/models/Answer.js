const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  answerText: String,
  score: Number,
}, { timestamps: true });

module.exports = mongoose.model('Answer', AnswerSchema);
