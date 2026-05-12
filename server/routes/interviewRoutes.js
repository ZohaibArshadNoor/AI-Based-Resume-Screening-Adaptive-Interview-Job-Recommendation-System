const express = require('express');
const { getQuestions, submitAnswer } = require('../controllers/interviewController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/questions', authMiddleware, getQuestions);
router.post('/answer', authMiddleware, submitAnswer);

module.exports = router;
