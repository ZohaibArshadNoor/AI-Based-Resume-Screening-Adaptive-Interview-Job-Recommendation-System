const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const { findJobs, getRecommendations } = require('../controllers/jobController');

// POST /api/jobs/find — trigger Gemini agent
router.post('/find', auth, findJobs);

// GET /api/jobs/recommendations — fetch saved results
router.get('/recommendations', auth, getRecommendations);

module.exports = router;