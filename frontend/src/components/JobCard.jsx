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