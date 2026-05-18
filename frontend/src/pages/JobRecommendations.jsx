import { useState, useEffect } from 'react';
import API from '../services/api';
import JobCard from '../components/JobCard';

export default function JobRecommendations() {
  const [jobRole, setJobRole] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingPrevious, setLoadingPrevious] = useState(true);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  // Load previously saved recommendations on mount
  useEffect(() => {
    API.get('/jobs/recommendations')
      .then(({ data }) => {
        if (data.jobs && data.jobs.length > 0) {
          setJobs(data.jobs);
          setSearched(true);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingPrevious(false));
  }, []);

  const handleSearch = async () => {
    if (!jobRole.trim() || !jobDescription.trim()) {
      setError('Please enter both a job role and a job description.');
      return;
    }
    setError('');
    setLoading(true);
    setJobs([]);

    try {
      const { data } = await API.post('/jobs/find', {
        jobRole: jobRole.trim(),
        jobDescription: jobDescription.trim(),
        useMock: false,      // set true to demo without real scraping
      });
      setJobs(data.jobs || []);
      setSearched(true);
    } catch (err) {
      setError('Agent error: ' + (err.response?.data?.msg || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-1">Job Recommendations</h2>
      <p className="text-gray-500 text-sm mb-6">
        Enter the job you're applying for. Our Gemini agent will find similar live jobs online.
      </p>

      {/* Input form */}
      <div className="bg-gray-50 border rounded-xl p-5 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Target Job Role</label>
        <input
          className="w-full border rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-300"
          placeholder="e.g. Software Engineer, Data Scientist, ML Engineer"
          value={jobRole}
          onChange={(e) => setJobRole(e.target.value)}
        />

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Reference Job Description
        </label>
        <textarea
          rows={5}
          className="w-full border rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
          placeholder="Paste the job description you found / are applying for. The agent will search for similar opportunities..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <button
          onClick={handleSearch}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-2 rounded-lg transition"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
              Agent searching... (this may take 15–30 seconds)
            </span>
          ) : '🔍 Find Similar Jobs'}
        </button>
      </div>

      {/* Results */}
      {loadingPrevious ? (
        <p className="text-gray-400 text-sm text-center">Loading previous results...</p>
      ) : searched && jobs.length === 0 && !loading ? (
        <div className="text-center py-10 text-gray-400">
          <p className="text-4xl mb-3">🤖</p>
          <p>No matching jobs found. Try a different description or enable mock mode.</p>
        </div>
      ) : (
        <>
          {jobs.length > 0 && (
            <p className="text-sm text-gray-500 mb-4">
              Found <strong>{jobs.length}</strong> similar jobs — sorted by relevance
            </p>
          )}
          <div className="grid gap-4">
            {jobs.map((job, i) => (
              <JobCard key={job._id || i} job={{
                ...job,
                descriptionSnippet: job.descriptionSnippet || job.description_snippet,
                relevanceScore: job.relevanceScore ?? job.relevance_score ?? 0,
              }} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}