const axios = require('axios');
const ScrapedJob = require('../models/ScrapedJob');

const ML_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

/**
 * POST /api/jobs/find
 * Triggers the Gemini agent and stores results in MongoDB.
 */
exports.findJobs = async (req, res) => {
  try {
    const { jobRole, jobDescription, userSkills = [], useMock = false } = req.body;

    if (!jobRole || !jobDescription) {
      return res.status(400).json({ msg: 'jobRole and jobDescription are required' });
    }

    // Call ML service Gemini agent
    const mlRes = await axios.post(`${ML_URL}/find-jobs`, {
      job_role: jobRole,
      job_description: jobDescription,
      user_skills: userSkills,
      max_results: 8,
      use_mock: useMock,
    });

    const { jobs } = mlRes.data;

    if (!jobs || jobs.length === 0) {
      return res.json({ msg: 'No jobs found', jobs: [] });
    }

    // Delete previous results for this user (fresh search)
    await ScrapedJob.deleteMany({ userId: req.user.id });

    // Save new results to MongoDB
    const docs = jobs.map((job) => ({
      userId: req.user.id,
      jobRole,
      title: job.title,
      company: job.company,
      location: job.location,
      url: job.url,
      source: job.source,
      descriptionSnippet: job.description_snippet,
      relevanceScore: job.relevance_score,
      reason: job.reason,
    }));

    const saved = await ScrapedJob.insertMany(docs);

    res.json({
      msg: 'Jobs found and saved',
      count: saved.length,
      jobs: saved,
    });
  } catch (err) {
    console.error('[findJobs error]', err.message);
    res.status(500).json({ msg: 'Agent error: ' + err.message });
  }
};

/**
 * GET /api/jobs/recommendations
 * Returns the most recent saved jobs for the logged-in user.
 */
exports.getRecommendations = async (req, res) => {
  try {
    const jobs = await ScrapedJob.find({ userId: req.user.id })
      .sort({ relevanceScore: -1 })
      .limit(10);

    res.json({ jobs });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};