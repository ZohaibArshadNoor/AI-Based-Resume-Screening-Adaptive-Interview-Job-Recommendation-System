// src/pages/JobSearch.jsx
// ─── FULL WIDTH + RESPONSIVE + ENHANCED CARD DESIGN ─────────────────────

import { useState, useEffect, useRef } from "react";
import { findJobs, getJobRecommendations } from "../services/api";
import Navbar from "../components/Navbar";

/* ── theme sync ── */
function useDark() {
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains("dark"),
  );
  useEffect(() => {
    const obs = new MutationObserver(() =>
      setDark(document.documentElement.classList.contains("dark")),
    );
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => obs.disconnect();
  }, []);
  return dark;
}

/* ─────────────────────────────────────────────────────────────────────────
   JOB CARD – improved, larger, more appealing
───────────────────────────────────────────────────────────────────────── */
const SOURCE_COLORS_DARK = {
  LinkedIn: {
    badge: "rgba(59,130,246,0.15)",
    badgeFg: "#60a5fa",
    dot: "#3b82f6",
  },
  "Rozee.pk": {
    badge: "rgba(34,197,94,0.12)",
    badgeFg: "#4ade80",
    dot: "#22c55e",
  },
  Indeed: {
    badge: "rgba(245,158,11,0.15)",
    badgeFg: "#fbbf24",
    dot: "#f59e0b",
  },
  default: {
    badge: "rgba(255,255,255,0.07)",
    badgeFg: "#aaa",
    dot: "#888",
  },
};
const SOURCE_COLORS_LIGHT = {
  LinkedIn: {
    badge: "rgba(59,130,246,0.1)",
    badgeFg: "#2563eb",
    dot: "#3b82f6",
  },
  "Rozee.pk": {
    badge: "rgba(34,197,94,0.1)",
    badgeFg: "#16a34a",
    dot: "#22c55e",
  },
  Indeed: {
    badge: "rgba(245,158,11,0.1)",
    badgeFg: "#b45309",
    dot: "#f59e0b",
  },
  default: {
    badge: "rgba(0,0,0,0.05)",
    badgeFg: "#666",
    dot: "#aaa",
  },
};

function scoreColor(score) {
  if (score >= 75) return "#22c55e";
  if (score >= 50) return "#f59e0b";
  return "#ef4444";
}
function scoreLabel(score) {
  if (score >= 75) return "Strong Match";
  if (score >= 50) return "Good Match";
  return "Partial Match";
}

export function JobCard({ job, dark, featured = false }) {
  const score = job.relevanceScore ?? job.relevance_score ?? 0;
  const snippet = job.descriptionSnippet || job.description_snippet || "";
  const reason = job.reason || "";
  const posted = job.postedDate || job.posted_date || "";
  const hasUrl = job.url && job.url.startsWith("http");
  const palette = dark
    ? SOURCE_COLORS_DARK[job.source] || SOURCE_COLORS_DARK.default
    : SOURCE_COLORS_LIGHT[job.source] || SOURCE_COLORS_LIGHT.default;
  const accent = scoreColor(score);
  const T = {
    card: dark ? "#141414" : "#fff",
    cardBdr: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
    fg: dark ? "#ededed" : "#111",
    fg2: dark ? "#aaa" : "#555",
    fg3: dark ? "#666" : "#ccc",
    reasonBg: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.025)",
    reasonBdr: dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)",
    btnBg: dark ? "#fff" : "#111",
    btnFg: dark ? "#000" : "#fff",
    trackBg: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)",
  };

  const circSize = featured ? 100 : 84;
  const r = circSize / 2 - 8;
  const circ = 2 * Math.PI * r;
  const [v, setV] = useState(0);
  useEffect(() => {
    let s = null;
    const step = (ts) => {
      if (!s) s = ts;
      const p = Math.min((ts - s) / 900, 1);
      setV(Math.round((1 - Math.pow(1 - p, 3)) * score));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [score]);

  return (
    <div
      style={{
        background: T.card,
        border: `1px solid ${T.cardBdr}`,
        borderRadius: featured ? 24 : 20,
        padding: featured ? "28px 26px" : "24px 22px",
        display: "flex",
        flexDirection: "column",
        gap: featured ? 18 : 14,
        boxShadow: dark
          ? "0 15px 45px rgba(0,0,0,0.5)"
          : "0 6px 24px rgba(0,0,0,0.08)",
        height: "100%",
        boxSizing: "border-box",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = dark
          ? "0 24px 60px rgba(0,0,0,0.7)"
          : "0 16px 40px rgba(0,0,0,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "";
        e.currentTarget.style.boxShadow = dark
          ? "0 15px 45px rgba(0,0,0,0.5)"
          : "0 6px 24px rgba(0,0,0,0.08)";
      }}
    >
      {/* title row */}
      <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3
            style={{
              fontSize: featured ? 22 : 18,
              fontWeight: 700,
              color: T.fg,
              lineHeight: 1.3,
              marginBottom: 8,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {job.title}
          </h3>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            {job.company && job.company !== "N/A" && (
              <span
                style={{
                  fontSize: 12,
                  color: T.fg2,
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                🏢 {job.company}
              </span>
            )}
            {job.location && job.location !== "N/A" && (
              <span
                style={{
                  fontSize: 12,
                  color: T.fg2,
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                📍 {job.location}
              </span>
            )}
          </div>
        </div>
        {/* score ring */}
        <div
          style={{
            flexShrink: 0,
            position: "relative",
            width: circSize,
            height: circSize,
          }}
        >
          <svg
            width={circSize}
            height={circSize}
            viewBox={`0 0 ${circSize} ${circSize}`}
          >
            <circle
              cx={circSize / 2}
              cy={circSize / 2}
              r={r}
              fill="none"
              stroke={T.trackBg}
              strokeWidth="7"
            />
            <circle
              cx={circSize / 2}
              cy={circSize / 2}
              r={r}
              fill="none"
              stroke={accent}
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={circ - (v / 100) * circ}
              style={{
                transform: "rotate(-90deg)",
                transformOrigin: "center",
                transition: "stroke-dashoffset 0.04s",
              }}
            />
          </svg>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontSize: featured ? 20 : 18,
                fontWeight: 700,
                color: accent,
                lineHeight: 1,
              }}
            >
              {score}%
            </span>
            <span
              style={{
                fontSize: 9,
                color: T.fg3,
                letterSpacing: "0.08em",
                marginTop: 2,
              }}
            >
              match
            </span>
          </div>
        </div>
      </div>

      {/* match label - larger pill */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span
          style={{
            display: "inline-block",
            padding: "5px 14px",
            borderRadius: 30,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.1em",
            background: `${accent}18`,
            color: accent,
            border: `1px solid ${accent}40`,
          }}
        >
          {scoreLabel(score)}
        </span>
      </div>

      {/* snippet – more lines if featured */}
      {snippet && (
        <p
          style={{
            fontSize: featured ? 14 : 13,
            color: T.fg2,
            lineHeight: 1.7,
            display: "-webkit-box",
            WebkitLineClamp: featured ? 4 : 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {snippet}
        </p>
      )}

      {/* AI reason – larger text */}
      {reason && (
        <div
          style={{
            background: T.reasonBg,
            border: `1px solid ${T.reasonBdr}`,
            borderRadius: 14,
            padding: "14px 16px",
            display: "flex",
            gap: 10,
            alignItems: "flex-start",
          }}
        >
          <span style={{ fontSize: 14, flexShrink: 0 }}>⚡</span>
          <p
            style={{
              fontSize: 13,
              color: T.fg2,
              fontStyle: "italic",
              lineHeight: 1.6,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {reason}
          </p>
        </div>
      )}

      {/* footer – larger elements */}
      <div
        style={{
          marginTop: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 14px",
              borderRadius: 30,
              fontSize: 11,
              fontWeight: 600,
              background: palette.badge,
              color: palette.badgeFg,
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: palette.dot,
                display: "inline-block",
              }}
            />
            {job.source || "N/A"}
          </span>
          {posted && (
            <span style={{ fontSize: 11, color: T.fg3 }}>🕐 {posted}</span>
          )}
        </div>
        <button
          onClick={() =>
            hasUrl && window.open(job.url, "_blank", "noopener,noreferrer")
          }
          disabled={!hasUrl}
          style={{
            padding: "10px 24px",
            background: hasUrl ? T.btnBg : T.trackBg,
            color: hasUrl ? T.btnFg : T.fg3,
            border: "none",
            borderRadius: 12,
            fontSize: 13,
            fontWeight: 600,
            cursor: hasUrl ? "pointer" : "not-allowed",
            transition: "opacity 0.2s",
            display: "flex",
            alignItems: "center",
            gap: 6,
            whiteSpace: "nowrap",
          }}
        >
          Apply Now ↗
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   CAROUSEL – improved, larger, smoother
───────────────────────────────────────────────────────────────────────── */
function Carousel({ jobs, dark }) {
  const [active, setActive] = useState(0);
  const autoRef = useRef();

  const reset = () => {
    clearInterval(autoRef.current);
    autoRef.current = setInterval(
      () => setActive((a) => (a + 1) % jobs.length),
      5000,
    );
  };
  useEffect(() => {
    reset();
    return () => clearInterval(autoRef.current);
  }, [jobs.length]);

  const T = {
    fg: dark ? "#ededed" : "#111",
    fg2: dark ? "#888" : "#555",
    fg3: dark ? "#444" : "#ccc",
    dotBg: dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",
    navBg: dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)",
    navBdr: dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)",
    accent: "#22c55e",
  };

  const prev = () => {
    setActive((a) => (a - 1 + jobs.length) % jobs.length);
    reset();
  };
  const next = () => {
    setActive((a) => (a + 1) % jobs.length);
    reset();
  };

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <p
            style={{
              fontSize: 11,
              letterSpacing: "0.18em",
              color: T.fg2,
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            Top Matches
          </p>
          <h3
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 28,
              color: T.fg,
              fontWeight: 700,
            }}
          >
            Highest Relevance
          </h3>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          {[
            { fn: prev, icon: "←" },
            { fn: next, icon: "→" },
          ].map((btn, i) => (
            <button
              key={i}
              onClick={btn.fn}
              style={{
                width: 44,
                height: 44,
                border: `1px solid ${T.navBdr}`,
                background: T.navBg,
                borderRadius: 14,
                cursor: "pointer",
                color: T.fg,
                fontSize: 18,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
                fontWeight: 600,
              }}
            >
              {btn.icon}
            </button>
          ))}
        </div>
      </div>

      <div style={{ minHeight: 380, position: "relative" }}>
        {jobs.map((job, i) => (
          <div
            key={job._id || job.url || i}
            style={{
              position: i === active ? "relative" : "absolute",
              top: 0,
              left: 0,
              right: 0,
              opacity: i === active ? 1 : 0,
              transform:
                i === active
                  ? "translateX(0)"
                  : i < active
                    ? "translateX(-40px)"
                    : "translateX(40px)",
              transition: "all 0.5s cubic-bezier(0.2, 0.9, 0.4, 1.1)",
              pointerEvents: i === active ? "auto" : "none",
            }}
          >
            <JobCard job={job} dark={dark} featured />
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 10,
          marginTop: 24,
        }}
      >
        {jobs.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setActive(i);
              reset();
            }}
            style={{
              width: i === active ? 24 : 10,
              height: 10,
              borderRadius: 6,
              border: "none",
              background: i === active ? T.accent : T.dotBg,
              cursor: "pointer",
              transition: "all 0.3s",
              padding: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   LOADING STATE – enhanced
───────────────────────────────────────────────────────────────────────── */
function SearchingLoader({ dark }) {
  const steps = [
    "Connecting to job boards…",
    "Scanning LinkedIn listings…",
    "Checking Rozee.pk…",
    "Scraping Indeed…",
    "Scoring relevance with AI…",
    "Finalizing results…",
  ];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(
      () => setIdx((i) => Math.min(i + 1, steps.length - 1)),
      3500,
    );
    return () => clearInterval(id);
  }, []);
  const T = {
    fg: dark ? "#ededed" : "#111",
    fg2: dark ? "#888" : "#555",
    accent: "#22c55e",
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "80px 20px",
        gap: 32,
      }}
    >
      <div style={{ position: "relative", width: 80, height: 80 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(34,197,94,0.2) 0%, transparent 70%)",
            animation: "orb-pulse 2s ease-in-out infinite",
          }}
        />
        <svg
          width="80"
          height="80"
          viewBox="0 0 80 80"
          style={{ animation: "spin 2s linear infinite" }}
        >
          <circle
            cx="40"
            cy="40"
            r="32"
            fill="none"
            stroke="rgba(34,197,94,0.12)"
            strokeWidth="5"
          />
          <circle
            cx="40"
            cy="40"
            r="32"
            fill="none"
            stroke="#22c55e"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray="60 140"
          />
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
          }}
        >
          ◈
        </div>
      </div>
      <div style={{ textAlign: "center" }}>
        <h3
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 26,
            color: T.fg,
            marginBottom: 12,
          }}
        >
          Searching live jobs
        </h3>
        <p
          style={{
            fontSize: 14,
            color: T.fg2,
            animation: "fadeUp 0.4s ease",
          }}
          key={idx}
        >
          {steps[idx]}
        </p>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        {steps.map((_, i) => (
          <div
            key={i}
            style={{
              width: i <= idx ? 24 : 10,
              height: 6,
              borderRadius: 4,
              background: i <= idx ? T.accent : "rgba(34,197,94,0.15)",
              transition: "all 0.4s",
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   MAIN PAGE – full width, responsive, larger typography
───────────────────────────────────────────────────────────────────────── */
export default function JobSearch() {
  const dark = useDark();
  const [jobRole, setJobRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [resume, setResume] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingPrev, setLoadingPrev] = useState(true);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [touched, setTouched] = useState({ role: false, jd: false });
  const fileRef = useRef();

  const T = {
    bg: dark ? "#0d0d0d" : "#f8f7f4",
    card: dark ? "#141414" : "#ffffff",
    cardBdr: dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)",
    fg: dark ? "#ededed" : "#111111",
    fg2: dark ? "#888888" : "#555555",
    fg3: dark ? "#444444" : "#cccccc",
    input: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
    inputBdr: dark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.12)",
    accent: "#22c55e",
    err: "#ef4444",
    glow: dark ? "rgba(34,197,94,0.06)" : "rgba(34,197,94,0.07)",
    sectionBdr: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)",
  };

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

  const sortedJobs = [...jobs].sort((a, b) => {
    const as = a.relevanceScore ?? a.relevance_score ?? 0;
    const bs = b.relevanceScore ?? b.relevance_score ?? 0;
    return bs - as;
  });
  const topJobs = sortedJobs.slice(0, 4);
  const allJobs = sortedJobs;

  const handleSearch = async () => {
    setTouched({ role: true, jd: true });
    if (!jobRole.trim()) return setError("Job role is required.");
    if (!jobDescription.trim()) return setError("Job description is required.");
    if (jobDescription.trim().length < 50)
      return setError("Job description is too short — paste the full text.");
    setError("");
    setLoading(true);
    setJobs([]);
    setShowAll(false);
    try {
      const formData = new FormData();
      formData.append("jobRole", jobRole.trim());
      formData.append("jobDescription", jobDescription.trim());
      formData.append("maxResults", 10);
      if (resume) formData.append("resume", resume);
      const { data } = await findJobs({
        jobRole: jobRole.trim(),
        jobDescription: jobDescription.trim(),
        maxResults: 10,
      });
      setJobs(data.jobs || []);
      setSearched(true);
      if (!data.jobs?.length)
        setError("No matching jobs found. Try a broader role title.");
    } catch (err) {
      setError(
        "Search failed: " + (err.response?.data?.message || err.message),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: T.bg,
        color: T.fg,
        fontFamily: "'DM Sans', sans-serif",
        transition: "background .3s, color .3s",
      }}
    >
      <Navbar />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { to { transform:rotate(360deg); } }
        @keyframes orb-pulse { 0%,100% { transform:scale(1); opacity:.4; } 50% { transform:scale(1.15); opacity:.9; } }
        .js-card { animation: fadeUp 0.5s ease both; }
        .js-input:focus { border-color: #22c55e !important; outline: none; }
        .js-btn:hover:not(:disabled) { opacity:.87; transform:translateY(-1px); }
        .js-btn:active:not(:disabled) { transform:translateY(0); }
        .job-grid-item { animation: fadeUp 0.45s ease both; }

        /* FULL WIDTH + RESPONSIVE */
        .page-wrapper {
          width: 100%;
          padding: 56px 32px 80px;
          position: relative;
          z-index: 1;
          box-sizing: border-box;
        }
        .job-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
          gap: 28px;
        }
        @media (max-width: 768px) {
          .page-wrapper {
            padding: 40px 20px 60px;
          }
          .job-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
        }
        @media (min-width: 1600px) {
          .page-wrapper {
            padding: 56px 80px 80px;
          }
          .job-grid {
            grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          }
        }
      `}</style>

      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          background: `radial-gradient(ellipse 60% 40% at 50% 20%, ${T.glow} 0%, transparent 70%)`,
        }}
      />

      <div className="page-wrapper">
        {/* header – larger text */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <p
            style={{
              fontSize: 11,
              letterSpacing: "0.22em",
              color: T.fg2,
              textTransform: "uppercase",
              marginBottom: 20,
              fontWeight: 500,
            }}
          >
            ✦ &nbsp; AI Career Intelligence &nbsp; ✦
          </p>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(48px,10vw,80px)",
              fontWeight: 700,
              lineHeight: 0.95,
              letterSpacing: "-0.02em",
              marginBottom: 20,
            }}
          >
            Job
            <br />
            <em style={{ fontStyle: "italic", color: T.accent }}>Finder</em>
          </h1>
          <p
            style={{
              fontSize: 16,
              color: T.fg2,
              lineHeight: 1.7,
              fontWeight: 300,
              maxWidth: 520,
              margin: "0 auto",
            }}
          >
            Paste a job description and let our AI agent surface live, relevant
            listings from LinkedIn, Rozee.pk, and Indeed — ranked by fit.
          </p>
        </div>

        {/* form card – wider, larger inputs */}
        <div
          className="js-card"
          style={{
            background: T.card,
            border: `1px solid ${T.cardBdr}`,
            borderRadius: 24,
            padding: "44px 40px",
            boxShadow: dark
              ? "0 32px 80px rgba(0,0,0,0.5)"
              : "0 12px 40px rgba(0,0,0,0.08)",
            marginBottom: 48,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 24,
              marginBottom: 28,
            }}
          >
            {/* role */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 11,
                  letterSpacing: "0.12em",
                  color: T.fg2,
                  textTransform: "uppercase",
                  fontWeight: 600,
                  marginBottom: 10,
                }}
              >
                Job Role <span style={{ color: T.err }}>*</span>
              </label>
              <input
                className="js-input"
                placeholder="e.g. Data Scientist"
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  background: T.input,
                  border: `1.5px solid ${
                    touched.role && !jobRole.trim() ? T.err : T.inputBdr
                  }`,
                  borderRadius: 12,
                  padding: "14px 16px",
                  color: T.fg,
                  fontSize: 14,
                  transition: "border-color .2s",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              />
              {touched.role && !jobRole.trim() && (
                <p style={{ fontSize: 12, color: T.err, marginTop: 6 }}>
                  ⚠ Required
                </p>
              )}
            </div>

            {/* resume */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 11,
                  letterSpacing: "0.12em",
                  color: T.fg2,
                  textTransform: "uppercase",
                  fontWeight: 600,
                  marginBottom: 10,
                }}
              >
                Resume{" "}
                <span
                  style={{
                    fontSize: 11,
                    color: T.fg3,
                    textTransform: "none",
                    letterSpacing: 0,
                  }}
                >
                  (optional)
                </span>
              </label>
              <div
                onClick={() => fileRef.current.click()}
                style={{
                  border: `1.5px dashed ${resume ? T.accent : T.inputBdr}`,
                  borderRadius: 12,
                  background: resume
                    ? dark
                      ? "rgba(34,197,94,0.05)"
                      : "rgba(34,197,94,0.04)"
                    : T.input,
                  padding: "14px 16px",
                  cursor: "pointer",
                  transition: "all .2s",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  height: 54,
                  boxSizing: "border-box",
                }}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.docx,.txt"
                  style={{ display: "none" }}
                  onChange={(e) => setResume(e.target.files[0])}
                />
                <span style={{ fontSize: 18 }}>{resume ? "📄" : "⬆"}</span>
                <span
                  style={{
                    fontSize: 14,
                    color: resume ? T.accent : T.fg3,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {resume ? resume.name : "Upload CV (PDF, DOCX)"}
                </span>
              </div>
            </div>
          </div>

          {/* job description */}
          <div style={{ marginBottom: 28 }}>
            <label
              style={{
                display: "block",
                fontSize: 11,
                letterSpacing: "0.12em",
                color: T.fg2,
                textTransform: "uppercase",
                fontWeight: 600,
                marginBottom: 10,
              }}
            >
              Reference Job Description <span style={{ color: T.err }}>*</span>
            </label>
            <p style={{ fontSize: 13, color: T.fg3, marginBottom: 12 }}>
              Paste the complete job advertisement text — requirements,
              responsibilities, everything. More text = better results.
            </p>
            <textarea
              className="js-input"
              placeholder="Paste the full job description here…"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={6}
              style={{
                width: "100%",
                boxSizing: "border-box",
                background: T.input,
                border: `1.5px solid ${
                  touched.jd && !jobDescription.trim() ? T.err : T.inputBdr
                }`,
                borderRadius: 12,
                padding: "14px 16px",
                color: T.fg,
                fontSize: 14,
                resize: "vertical",
                transition: "border-color .2s",
                fontFamily: "'DM Sans', sans-serif",
                lineHeight: 1.7,
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 8,
              }}
            >
              {touched.jd && !jobDescription.trim() ? (
                <p style={{ fontSize: 12, color: T.err }}>
                  ⚠ Job description is required.
                </p>
              ) : jobDescription.length > 0 && jobDescription.length < 50 ? (
                <p style={{ fontSize: 12, color: "#f59e0b" }}>
                  ⚠ Paste more text for better results.
                </p>
              ) : (
                <span />
              )}
              <span style={{ fontSize: 12, color: T.fg3 }}>
                {jobDescription.length} chars
              </span>
            </div>
          </div>

          {/* error */}
          {error && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                background: dark ? "rgba(239,68,68,0.1)" : "#fef2f2",
                border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: 14,
                padding: "14px 18px",
                marginBottom: 28,
              }}
            >
              <span style={{ fontSize: 16 }}>⚠</span>
              <p style={{ fontSize: 14, color: T.err, fontWeight: 500 }}>
                {error}
              </p>
            </div>
          )}

          <button
            className="js-btn"
            onClick={handleSearch}
            disabled={loading}
            style={{
              width: "100%",
              background: dark ? "#fff" : "#111",
              color: dark ? "#000" : "#fff",
              border: "none",
              borderRadius: 14,
              padding: "16px",
              fontSize: 14,
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all .2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              letterSpacing: "0.08em",
              fontFamily: "'DM Sans', sans-serif",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? (
              <>
                <span
                  style={{
                    width: 18,
                    height: 18,
                    border: "2px solid rgba(0,0,0,0.15)",
                    borderTopColor: dark ? "#000" : "#fff",
                    borderRadius: "50%",
                    animation: "spin 0.7s linear infinite",
                    display: "inline-block",
                  }}
                />
                Searching live jobs…
              </>
            ) : (
              "◈ Find Similar Jobs"
            )}
          </button>
        </div>

        {/* RESULTS */}
        {loadingPrev ? (
          <div
            style={{
              textAlign: "center",
              padding: "80px 0",
              color: T.fg3,
              fontSize: 14,
            }}
          >
            Loading previous results…
          </div>
        ) : loading ? (
          <SearchingLoader dark={dark} />
        ) : searched && sortedJobs.length > 0 ? (
          <div>
            {/* divider */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                marginBottom: 40,
              }}
            >
              <div style={{ flex: 1, height: 1, background: T.sectionBdr }} />
              <span
                style={{
                  fontSize: 12,
                  letterSpacing: "0.2em",
                  color: T.fg3,
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                {sortedJobs.length} Jobs Found
              </span>
              <div style={{ flex: 1, height: 1, background: T.sectionBdr }} />
            </div>

            {/* carousel – featured card */}
            {topJobs.length > 0 && (
              <div
                style={{
                  background: T.card,
                  border: `1px solid ${T.cardBdr}`,
                  borderRadius: 28,
                  padding: "36px 32px",
                  marginBottom: 48,
                  boxShadow: dark
                    ? "0 25px 60px rgba(0,0,0,0.5)"
                    : "0 12px 32px rgba(0,0,0,0.08)",
                }}
              >
                <Carousel jobs={topJobs} dark={dark} />
              </div>
            )}

            {/* show all toggle */}
            {!showAll ? (
              <div style={{ textAlign: "center", marginBottom: 32 }}>
                <button
                  onClick={() => setShowAll(true)}
                  style={{
                    border: `2px solid ${T.accent}`,
                    background: "transparent",
                    color: T.accent,
                    padding: "12px 36px",
                    borderRadius: 14,
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    fontFamily: "'DM Sans', sans-serif",
                    letterSpacing: "0.08em",
                  }}
                >
                  Show All {sortedJobs.length} Jobs ↓
                </button>
              </div>
            ) : (
              <>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 20,
                    marginBottom: 28,
                  }}
                >
                  <div
                    style={{ flex: 1, height: 1, background: T.sectionBdr }}
                  />
                  <span
                    style={{
                      fontSize: 12,
                      letterSpacing: "0.2em",
                      color: T.fg3,
                      textTransform: "uppercase",
                      fontWeight: 600,
                    }}
                  >
                    All Results
                  </span>
                  <div
                    style={{ flex: 1, height: 1, background: T.sectionBdr }}
                  />
                </div>
                <div className="job-grid">
                  {allJobs.map((job, i) => (
                    <div
                      key={job._id || job.url || i}
                      className="job-grid-item"
                      style={{ animationDelay: `${i * 0.05}s` }}
                    >
                      <JobCard job={job} dark={dark} />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ) : searched && !loading ? (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ fontSize: 56, marginBottom: 20 }}>◎</div>
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 28,
                color: T.fg,
                marginBottom: 12,
              }}
            >
              No jobs found yet
            </p>
            <p style={{ fontSize: 15, color: T.fg2 }}>
              Fill in the form above and click "Find Similar Jobs"
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
