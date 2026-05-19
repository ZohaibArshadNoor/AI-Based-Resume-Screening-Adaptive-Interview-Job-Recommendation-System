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