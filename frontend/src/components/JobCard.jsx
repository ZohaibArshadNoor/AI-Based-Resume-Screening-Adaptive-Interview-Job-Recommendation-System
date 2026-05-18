export default function JobCard({ job }) {
  const score = job.relevanceScore || 0;
  const scoreColor =
    score >= 75 ? 'bg-green-500' :
    score >= 50 ? 'bg-yellow-400' :
    'bg-red-400';

  return (
    <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="font-semibold text-gray-800 text-base">{job.title}</h3>
          <p className="text-sm text-gray-500">{job.company} — {job.location}</p>
        </div>
        <div className="flex flex-col items-center min-w-[52px]">
          <span className={`text-white text-xs font-bold px-2 py-1 rounded-full ${scoreColor}`}>
            {score}%
          </span>
          <span className="text-[10px] text-gray-400 mt-1">match</span>
        </div>
      </div>

      {/* Match progress bar */}
      <div className="w-full bg-gray-100 rounded-full h-1.5 mb-3">
        <div
          className={`h-1.5 rounded-full ${scoreColor}`}
          style={{ width: `${score}%` }}
        />
      </div>

      {job.descriptionSnippet && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{job.descriptionSnippet}</p>
      )}

      {job.reason && (
        <p className="text-xs text-blue-600 italic mb-3">💡 {job.reason}</p>
      )}

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
          {job.source}
        </span>
        <a
          href={job.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:underline font-medium"
        >
          View Job →
        </a>
      </div>
    </div>
  );
}