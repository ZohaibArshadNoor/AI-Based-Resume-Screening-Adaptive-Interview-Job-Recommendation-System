const express = require('express');
const { saveResult, getHistory } = require('../controllers/resultController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/save', authMiddleware, saveResult);
router.get('/history', authMiddleware, getHistory);

module.exports = router;