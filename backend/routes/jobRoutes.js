const express = require('express');
const { triggerScrape, getSavedJobs } = require('../controllers/jobController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/scrape', authMiddleware, triggerScrape);
router.get('/recommendations', authMiddleware, getSavedJobs);

module.exports = router;
