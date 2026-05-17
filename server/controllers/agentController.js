import axios    from 'axios';
import FormData from 'form-data';
import fs       from 'fs';
import InterviewSession from '../models/InterviewSession.js';

const ML_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

// ── Start Session ─────────────────────────────────────────────────────────────
export const startSession = async (req, res) => {
  try {
    const { jobDescription, role } = req.body;
    if (!jobDescription?.trim()) {
      return res.status(400).json({ message: 'Job description is required' });
    }

    const session = await InterviewSession.create({
      userId:         req.user.id,
      jobDescription: jobDescription.trim(),
      role:           role || '',
    });

    res.status(201).json({ sessionId: session._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Send Message ──────────────────────────────────────────────────────────────
export const sendMessage = async (req, res) => {
  try {
    const { sessionId, userMessage } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'sessionId required' });

    const session = await InterviewSession.findOne({ _id: sessionId, userId: req.user.id });
    if (!session)          return res.status(404).json({ message: 'Session not found' });
    if (session.isComplete) return res.status(400).json({ message: 'Interview already complete' });

    if (userMessage?.trim()) {
      session.messages.push({ role: 'user', content: userMessage.trim() });
    }

    const chatHistory = session.messages.map(m => ({ role: m.role, content: m.content }));

    // Only this section changes inside sendMessage — the formData.append for the file:

const formData = new FormData();
if (req.file && !session.resumeText) {
  formData.append('file', fs.createReadStream(req.file.path), {
    filename:    req.file.originalname,  // ← tells ML it's a .pdf/.docx
    contentType: req.file.mimetype,
  });
}
formData.append('job_description', session.jobDescription);
formData.append('candidate_name',  req.user.name || 'Candidate');
formData.append('role',            session.role);
formData.append('messages_json',   JSON.stringify(chatHistory));
formData.append('resume_text',     session.resumeText || '');
    const mlRes = await axios.post(`${ML_URL}/agent/chat`, formData, {
      headers: formData.getHeaders(),
      timeout: 30000,
    });

    if (req.file) fs.unlink(req.file.path, () => {});

    const { reply, is_complete, resume_text: extractedText, resume_skills } = mlRes.data;

    session.messages.push({ role: 'assistant', content: reply });

    if (extractedText && !session.resumeText) {
      session.resumeText   = extractedText;
      session.resumeSkills = resume_skills || [];
    }

    if (is_complete) session.isComplete = true;

    await session.save();

    res.status(200).json({
      reply,
      isComplete:   is_complete,
      messageCount: session.messages.filter(m => m.role === 'assistant').length,
      resumeSkills: session.resumeSkills,
    });

  } catch (error) {
    console.error('Agent chat error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// ── Generate ATS Score ────────────────────────────────────────────────────────
export const generateAtsScore = async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'sessionId required' });

    const session = await InterviewSession.findOne({ _id: sessionId, userId: req.user.id });
    if (!session) return res.status(404).json({ message: 'Session not found' });

    if (session.atsReport) return res.status(200).json(session.atsReport);

    const formData = new FormData();
    formData.append('conversation_json',  JSON.stringify(
      session.messages.map(m => ({ role: m.role, content: m.content }))
    ));
    formData.append('resume_text',        session.resumeText    || '');
    formData.append('job_description',    session.jobDescription || '');
    formData.append('resume_skills_json', JSON.stringify(session.resumeSkills || []));
    formData.append('role',               session.role || '');

    const mlRes = await axios.post(`${ML_URL}/agent/ats-score`, formData, {
      headers: formData.getHeaders(),
      timeout: 90000,   // ← was 45s, Groq scoring needs more time
    });

    // ← log what ML returned so you can see errors
    console.log('ML ATS response:', JSON.stringify(mlRes.data).slice(0, 200));

    if (mlRes.data.error) {
      return res.status(500).json({ message: mlRes.data.error });
    }

    session.atsScore  = mlRes.data.ats_score;
    session.atsReport = mlRes.data;
    await session.save();

    res.status(200).json(mlRes.data);

  } catch (error) {
    console.error('ATS score error:', error.message);   // ← was silent before
    res.status(500).json({ message: error.message });
  }
};
// ── Get Sessions ──────────────────────────────────────────────────────────────
export const getSessions = async (req, res) => {
  try {
    const sessions = await InterviewSession.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('-messages -resumeText');
    res.status(200).json({ sessions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};