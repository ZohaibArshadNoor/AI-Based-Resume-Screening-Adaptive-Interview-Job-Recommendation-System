#  Predict-role page code:
import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function PredictRole() {

  const [file, setFile] = useState(null);
  const [role, setRole] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePredict = async () => {

    setError("");
    setResult(null);

    if (!file || !role) {
      setError("Please upload CV and enter role");
      return;
    }

    const formData = new FormData();

    formData.append("file", file);
    formData.append("role", role);

    try {

      setLoading(true);

      // ✅ GET TOKEN
      const token = localStorage.getItem("token");

      // ✅ API CALL
      const res = await axios.post(
        "http://localhost:5000/api/predict/predict-role",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",

            // ✅ SEND JWT TOKEN
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("RESPONSE:", res.data);

      setResult(res.data);

    } catch (err) {

      console.log(err);

      setError(
        err?.response?.data?.error ||
        "Prediction failed"
      );

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black">

      <Navbar />

      <div className="flex flex-col items-center mt-10 px-6">

        <div className="w-full max-w-xl border p-8 rounded-3xl shadow-xl">

          <h1 className="text-3xl font-bold mb-6">
            AI Role Predictor
          </h1>

          {/* ROLE INPUT */}
          <input
            type="text"
            placeholder="Enter role"
            value={role}
            className="w-full border p-3 mb-4 rounded-lg"
            onChange={(e) => setRole(e.target.value)}
          />

          {/* FILE INPUT */}
          <input
            type="file"
            accept=".pdf,.docx,.txt"
            className="w-full border p-3 mb-4 rounded-lg"
            onChange={(e) => setFile(e.target.files[0])}
          />

          {/* BUTTON */}
          <button
            onClick={handlePredict}
            disabled={loading}
            className="w-full bg-black text-white p-3 rounded-lg hover:opacity-90 transition"
          >
            {loading
              ? "Processing..."
              : "Predict Role"}
          </button>

          {/* ERROR */}
          {error && (
            <p className="text-red-500 mt-4">
              {error}
            </p>
          )}

          {/* RESULT */}
          {result && (
            <div className="mt-6 p-4 border rounded-lg bg-gray-50 space-y-2">

              <p>
                <b>Predicted Role:</b>{" "}
                {result.predictedRole}
              </p>

              <p>
                <b>Selected Role:</b>{" "}
                {result.selectedRole}
              </p>

              <p>
                <b>Match:</b>{" "}
                {result.match ? "Yes" : "No"}
              </p>

              <p>
                <b>Confidence:</b>{" "}
                {result.confidence}%
              </p>

              <p>
                <b>Uploaded File:</b>{" "}
                {result.fileName}
              </p>

              <p>
                <b>Saved At:</b>{" "}
                {new Date(
                  result.createdAt
                ).toLocaleString()}
              </p>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}

#  Jobsearch page code:
import { useState, useEffect } from 'react';
import { findJobs, getJobRecommendations } from '../services/api';
import JobCard from '../components/JobCard';
import { Search, Briefcase, RefreshCw, AlertCircle } from 'lucide-react';

export default function JobSearch() {
  const [jobRole,        setJobRole]        = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jobs,           setJobs]           = useState([]);
  const [loading,        setLoading]        = useState(false);
  const [loadingPrev,    setLoadingPrev]    = useState(true);
  const [error,          setError]          = useState('');
  const [searched,       setSearched]       = useState(false);
  const [sortBy,         setSortBy]         = useState('relevance');

  // Load previous results on mount
  useEffect(() => {
    getJobRecommendations()
      .then(({ data }) => {
        if (data.jobs?.length) {
          setJobs(data.jobs);
          setSearched(true);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingPrev(false));
  }, []);

  const handleSearch = async () => {
    if (!jobRole.trim())        return setError('Please enter a job role.');
    if (!jobDescription.trim()) return setError('Please paste the job description.');
    if (jobDescription.trim().length < 50)
      return setError('Job description is too short. Paste the full text.');

    setError('');
    setLoading(true);
    setJobs([]);

    try {
      const { data } = await findJobs({
        jobRole:        jobRole.trim(),
        jobDescription: jobDescription.trim(),
        maxResults:     10,
      });

      setJobs(data.jobs || []);
      setSearched(true);

      if (!data.jobs?.length) {
        setError('No matching jobs found. Try a broader role title or different description.');
      }
    } catch (err) {
      setError('Search failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Sort jobs on client side without re-fetching
  const sortedJobs = [...jobs].sort((a, b) => {
    const aScore = a.relevanceScore ?? a.relevance_score ?? 0;
    const bScore = b.relevanceScore ?? b.relevance_score ?? 0;
    if (sortBy === 'relevance') return bScore - aScore;
    if (sortBy === 'company')   return (a.company || '').localeCompare(b.company || '');
    return 0;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      {/* ── Header ── */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Briefcase className="text-indigo-600" size={30} />
          Job Recommendations
        </h1>
        <p className="text-gray-500 mt-1">
          Paste the job description you are targeting. Our AI agent will find similar live jobs
          from LinkedIn, Rozee.pk, and Indeed with direct apply links.
        </p>
      </div>

      {/* ── Input Form ── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8 shadow-sm">

        {/* Job Role */}
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Target Job Role <span className="text-red-500">*</span>
        </label>
        <input
          value={jobRole}
          onChange={e => setJobRole(e.target.value)}
          placeholder="e.g. Backend Software Engineer, Data Scientist, ML Engineer"
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm
                     focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-4"
        />

        {/* Job Description */}
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Reference Job Description <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-gray-400 mb-2">
          Copy and paste the full job advertisement text — requirements, responsibilities, everything.
          The more text, the better the results.
        </p>
        <textarea
          value={jobDescription}
          onChange={e => setJobDescription(e.target.value)}
          rows={6}
          placeholder="Paste the complete job description here..."
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm
                     focus:outline-none focus:ring-2 focus:ring-indigo-400
                     resize-none mb-1"
        />
        <p className="text-xs text-gray-400 text-right mb-4">
          {jobDescription.length} characters
        </p>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200
                          rounded-lg px-4 py-3 mb-4 text-sm text-red-700">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSearch}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2
                     bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60
                     text-white font-semibold py-3 rounded-xl transition-colors"
        >
          {loading ? (
            <>
              <RefreshCw size={18} className="animate-spin" />
              AI agent searching live jobs... (15–40 seconds)
            </>
          ) : (
            <>
              <Search size={18} />
              Find Similar Jobs
            </>
          )}
        </button>
      </div>

      {/* ── Results ── */}
      {loadingPrev ? (
        <div className="text-center py-16 text-gray-400">Loading previous results...</div>
      ) : (
        <>
          {searched && jobs.length > 0 && (
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">{jobs.length}</span> jobs found
                — sorted by{' '}
                <span className="text-indigo-600 font-medium">
                  {sortBy === 'relevance' ? 'relevance' : 'company name'}
                </span>
              </p>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-1.5
                           focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="relevance">Sort: Relevance</option>
                <option value="company">Sort: Company A–Z</option>
              </select>
            </div>
          )}

          {/* Job cards grid */}
          {sortedJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {sortedJobs.map((job, i) => (
                <JobCard key={job._id || job.url || i} job={job} />
              ))}
            </div>
          ) : searched && !loading ? (
            <div className="text-center py-16">
              <Briefcase size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">No jobs found yet</p>
              <p className="text-gray-400 text-sm mt-1">
                Fill in the form above and click "Find Similar Jobs"
              </p>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}

#  Interview page code:
import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function InterviewAgent() {
  const [jobDescription, setJobDescription] = useState("");
  const [role, setRole] = useState("");
  const [file, setFile] = useState(null);

  const [sessionId, setSessionId] = useState(null);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);

  const [atsReport, setAtsReport] = useState(null);
  const [atsLoading, setAtsLoading] = useState(false);

  const token = localStorage.getItem("token");

  // ───────── START INTERVIEW ─────────
  const startInterview = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/agent/start",
        { jobDescription, role },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSessionId(res.data.sessionId);
      setStarted(true);
    } catch (err) {
      console.log(err.response?.data || err.message);
      alert("Failed to start interview");
    }
  };

  // ───────── SEND MESSAGE ─────────
  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [
      ...messages,
      { role: "user", content: input },
    ];

    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("sessionId", sessionId);
      formData.append("userMessage", input);

      if (file && messages.length === 0) {
        formData.append("file", file);
      }

      const res = await axios.post(
        "http://localhost:5000/api/agent/message",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessages([
        ...newMessages,
        { role: "assistant", content: res.data.reply },
      ]);
    } catch (err) {
      console.log(err.response?.data || err.message);
      alert("Message failed");
    } finally {
      setLoading(false);
    }
  };

  // ───────── ATS SCORE ─────────
  const getATS = async () => {
    try {
      setAtsLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/agent/ats-score",
        { sessionId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setAtsReport(res.data);
    } catch (err) {
      console.log(err.response?.data || err.message);
      alert("Failed to generate ATS report");
    } finally {
      setAtsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />

      <div className="max-w-4xl mx-auto p-6">

        <h1 className="text-3xl font-bold mb-4">
          AI Interview Agent
        </h1>

        {/* ───────── SETUP ───────── */}
        {!started && (
          <div className="space-y-3">
            <textarea
              placeholder="Job Description"
              className="w-full border p-3 rounded"
              onChange={(e) => setJobDescription(e.target.value)}
            />

            <input
              placeholder="Role"
              className="w-full border p-3 rounded"
              onChange={(e) => setRole(e.target.value)}
            />

            <input
              type="file"
              className="w-full border p-3 rounded"
              onChange={(e) => setFile(e.target.files[0])}
            />

            <button
              onClick={startInterview}
              className="bg-black text-white w-full p-3 rounded"
            >
              Start Interview
            </button>
          </div>
        )}

        {/* ───────── CHAT ───────── */}
        {started && (
          <>
            <div className="border p-4 h-[400px] overflow-y-auto mt-4 rounded">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`mb-3 ${
                    m.role === "user" ? "text-right" : "text-left"
                  }`}
                >
                  <span
                    className={`inline-block p-2 rounded ${
                      m.role === "user"
                        ? "bg-black text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    {m.content}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-4">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 border p-3 rounded"
                placeholder="Answer..."
              />

              <button
                onClick={sendMessage}
                className="bg-black text-white px-6 rounded"
              >
                {loading ? "..." : "Send"}
              </button>
            </div>

            {/* ATS BUTTON */}
            <button
              onClick={getATS}
              className="mt-4 w-full bg-green-600 text-white p-3 rounded"
            >
              {atsLoading ? "Generating ATS..." : "Get ATS Report"}
            </button>

            {/* ───────── ATS REPORT UI ───────── */}
            {atsReport && (
              <div className="mt-6 p-5 border rounded bg-gray-50">

                <h2 className="text-2xl font-bold mb-4">
                  ATS REPORT
                </h2>

                {/* SCORE */}
                <div className="text-lg mb-2">
                  <b>Total Score:</b>{" "}
                  <span className="text-green-700 font-bold">
                    {atsReport.ats_score}
                  </span>
                </div>

                {/* READINESS */}
                <p className="mb-2">
                  <b>Readiness Level:</b>{" "}
                  {atsReport.readiness_level}
                </p>

                {/* SCORE BREAKDOWN */}
                <div className="mt-4">
                  <h3 className="font-bold mb-2">
                    Score Breakdown
                  </h3>

                  <div className="grid grid-cols-2 gap-2">
                    <p>
                      <b>Skill Match:</b>{" "}
                      {atsReport.score_breakdown?.skill_match}
                    </p>

                    <p>
                      <b>Technical:</b>{" "}
                      {atsReport.score_breakdown?.technical_knowledge}
                    </p>

                    <p>
                      <b>Communication:</b>{" "}
                      {atsReport.score_breakdown?.communication}
                    </p>

                    <p>
                      <b>Problem Solving:</b>{" "}
                      {atsReport.score_breakdown?.problem_solving}
                    </p>
                  </div>
                </div>

                {/* FEEDBACK */}
                <div className="mt-4">
                  <h3 className="font-bold mb-1">
                    Overall Feedback
                  </h3>
                  <p className="text-gray-700">
                    {atsReport.overall_feedback}
                  </p>
                </div>

                {/* STRENGTHS */}
                <div className="mt-4">
                  <h3 className="font-bold">Strengths</h3>
                  <ul className="list-disc ml-6">
                    {atsReport.strengths?.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>

                {/* WEAKNESSES */}
                <div className="mt-4">
                  <h3 className="font-bold">Weaknesses</h3>
                  <ul className="list-disc ml-6">
                    {atsReport.weaknesses?.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>

                {/* IMPROVEMENTS */}
                <div className="mt-4">
                  <h3 className="font-bold">Improvement Suggestions</h3>
                  <ul className="list-disc ml-6">
                    {atsReport.improvement_suggestions?.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>

                {/* HIRE DECISION */}
                <div className="mt-4 text-lg">
                  <b>Hire Recommendation:</b>{" "}
                  <span className="font-bold text-blue-600">
                    {atsReport.hire_recommendation}
                  </span>
                </div>

              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

#  JobCard (Component) code:
import { ExternalLink, MapPin, Building2, Star, Clock, Zap } from 'lucide-react';

const SOURCE_COLORS = {
  'LinkedIn':  { bg: 'bg-blue-50',   border: 'border-blue-200',  badge: 'bg-blue-100 text-blue-700',  dot: 'bg-blue-500'  },
  'Rozee.pk':  { bg: 'bg-green-50',  border: 'border-green-200', badge: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
  'Indeed':    { bg: 'bg-yellow-50', border: 'border-yellow-200',badge: 'bg-yellow-100 text-yellow-700',dot:'bg-yellow-500'},
  'default':   { bg: 'bg-gray-50',   border: 'border-gray-200',  badge: 'bg-gray-100 text-gray-700',  dot: 'bg-gray-400'  },
};

const SCORE_CONFIG = (score) => {
  if (score >= 75) return { bar: 'bg-emerald-500', text: 'text-emerald-700', label: 'Strong Match' };
  if (score >= 50) return { bar: 'bg-amber-400',   text: 'text-amber-700',   label: 'Good Match'   };
  return               { bar: 'bg-red-400',      text: 'text-red-700',     label: 'Partial Match' };
};

export default function JobCard({ job }) {
  const score   = job.relevanceScore ?? job.relevance_score ?? 0;
  const colors  = SOURCE_COLORS[job.source] || SOURCE_COLORS['default'];
  const scoreCfg = SCORE_CONFIG(score);
  const snippet  = job.descriptionSnippet || job.description_snippet || '';
  const reason   = job.reason || '';
  const posted   = job.postedDate || job.posted_date || '';
  const hasUrl   = job.url && job.url.startsWith('http');

  const handleApply = () => {
    if (hasUrl) window.open(job.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`
      rounded-xl border ${colors.border} ${colors.bg}
      p-5 flex flex-col gap-3
      hover:shadow-md transition-shadow duration-200
      overflow-hidden        /* prevents any child from overflowing the card */
    `}>

      {/* ── Row 1: Title + Score Badge ── */}
      <div className="flex items-start justify-between gap-3 min-w-0">
        <div className="min-w-0 flex-1">
          {/* Title — clamps to 2 lines, never overflows */}
          <h3 className="font-semibold text-gray-900 text-base leading-snug
                         line-clamp-2 break-words">
            {job.title}
          </h3>
          {/* Company + Location row */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
            {job.company && job.company !== 'N/A' && (
              <span className="flex items-center gap-1 text-sm text-gray-600 min-w-0">
                <Building2 size={13} className="shrink-0" />
                <span className="truncate">{job.company}</span>
              </span>
            )}
            {job.location && job.location !== 'N/A' && (
              <span className="flex items-center gap-1 text-sm text-gray-500 min-w-0">
                <MapPin size={13} className="shrink-0" />
                <span className="truncate">{job.location}</span>
              </span>
            )}
          </div>
        </div>

        {/* Score pill */}
        <div className="shrink-0 flex flex-col items-center">
          <span className={`text-lg font-bold ${scoreCfg.text}`}>{score}%</span>
          <span className="text-[10px] text-gray-400 leading-none mt-0.5">match</span>
        </div>
      </div>

      {/* ── Row 2: Score bar ── */}
      <div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className={`h-1.5 rounded-full ${scoreCfg.bar} transition-all duration-500`}
            style={{ width: `${Math.min(score, 100)}%` }}
          />
        </div>
        <span className={`text-[11px] font-medium ${scoreCfg.text} mt-0.5 block`}>
          {scoreCfg.label}
        </span>
      </div>

      {/* ── Row 3: Snippet (clamped, never breaks layout) ── */}
      {snippet && (
        <p className="text-sm text-gray-600 line-clamp-3 break-words leading-relaxed">
          {snippet}
        </p>
      )}

      {/* ── Row 4: Gemini reason ── */}
      {reason && (
        <div className="flex items-start gap-2 bg-white/70 rounded-lg px-3 py-2 border border-white">
          <Zap size={13} className="text-indigo-500 shrink-0 mt-0.5" />
          <p className="text-xs text-indigo-700 italic line-clamp-2 break-words">
            {reason}
          </p>
        </div>
      )}

      {/* ── Row 5: Footer — Source badge + Posted date + Apply button ── */}
      <div className="flex items-center justify-between gap-2 mt-auto pt-1 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          {/* Source badge */}
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${colors.badge} shrink-0`}>
            <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
            {job.source}
          </span>
          {/* Posted date */}
          {posted && (
            <span className="flex items-center gap-1 text-xs text-gray-400 min-w-0">
              <Clock size={11} className="shrink-0" />
              <span className="truncate">{posted}</span>
            </span>
          )}
        </div>

        {/* Apply button */}
        <button
          onClick={handleApply}
          disabled={!hasUrl}
          className={`
            inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium
            transition-colors duration-150 shrink-0
            ${hasUrl
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          Apply Now
          {hasUrl && <ExternalLink size={13} />}
        </button>
      </div>
    </div>
  );
}

