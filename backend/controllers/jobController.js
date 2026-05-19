import axios from 'axios';
import ScrapedJob from '../models/ScrapedJob.js';

const ML_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

// POST /api/jobs/find
export const findJobs = async (req, res) => {
  try {
    const {
      jobRole,
      jobDescription,
      userSkills = [],
      maxResults = 8
    } = req.body;

    if (!jobRole || !jobDescription) {
      return res.status(400).json({
        success: false,
        message: 'jobRole and jobDescription are required',
      });
    }

    // Call Python ML service
    const mlResponse = await axios.post(
      `${ML_URL}/find-jobs`,
      {
        job_role: jobRole,
        job_description: jobDescription,
        user_skills: userSkills,
        max_results: maxResults,
      },
      { timeout: 120000 }
    );

    const { jobs = [] } = mlResponse.data;

    if (!jobs.length) {
      return res.json({ success: true, count: 0, jobs: [] });
    }

    // Delete previous results for this user
    await ScrapedJob.deleteMany({ userId: req.user.id });

    // Save new results
    const docs = jobs.map(job => ({
      userId: req.user.id,
      jobRole,
      title: job.title || 'N/A',
      company: job.company || 'N/A',
      location: job.location || 'N/A',
      url: job.url || '',
      source: job.source || 'N/A',
      postedDate: job.posted_date || '',
      descriptionSnippet: job.description_snippet || '',
      relevanceScore: job.relevance_score || 0,
      reason: job.reason || '',
    }));

    const saved = await ScrapedJob.insertMany(docs);

    return res.json({
      success: true,
      count: saved.length,
      jobs: saved,
    });

  } catch (err) {
    console.error('[jobController] findJobs error:', err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
      jobs: [],
    });
  }
};

// GET /api/jobs/recommendations
export const getRecommendations = async (req, res) => {
  try {
    const jobs = await ScrapedJob
      .find({ userId: req.user.id })
      .sort({ relevanceScore: -1 })
      .limit(20);

    return res.json({
      success: true,
      count: jobs.length,
      jobs
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};