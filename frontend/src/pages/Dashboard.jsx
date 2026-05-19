// ============================================================
//  src/pages/Dashboard.jsx
//  PASTE THIS FILE AT: src/pages/Dashboard.jsx
//  Requires: axios, Navbar, react-router-dom Link
//  API calls: GET /api/predict/history  →  { history: [...] }
//             GET /api/agent/sessions   →  { sessions: [...] }
//             GET /api/jobs/history     →  { jobs: [...] }
//             GET /api/auth/me          →  { name, email, ... }
//  (Adjust endpoint paths to match your actual routes)
// ============================================================

import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

/* ─── theme hook ─── */
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

/* ─── animated count-up number ─── */
function CountUp({ target, duration = 1200, suffix = "" }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!target) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target]);
  return (
    <>
      {val}
      {suffix}
    </>
  );
}

/* ─── SVG ring with animated fill + glow ─── */
function GlowRing({
  value = 0,
  max = 100,
  size = 160,
  stroke = 14,
  color = "#22c55e",
  label,
  sublabel,
  dark,
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const [v, setV] = useState(0);
  useEffect(() => {
    let s = null;
    const target = (value / max) * 100;
    const step = (ts) => {
      if (!s) s = ts;
      const p = Math.min((ts - s) / 1400, 1);
      setV((1 - Math.pow(1 - p, 3)) * target);
      if (p < 1) requestAnimationFrame(step);
    };
    const id = setTimeout(() => requestAnimationFrame(step), 300);
    return () => clearTimeout(id);
  }, [value, max]);

  const offset = circ - (v / 100) * circ;
  const trackColor = dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
      }}
    >
      <div style={{ position: "relative", width: size, height: size }}>
        {/* glow layer */}
        <div
          style={{
            position: "absolute",
            inset: stroke * 1.5,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${color}22 0%, transparent 70%)`,
            animation: "glow-pulse 3s ease-in-out infinite",
            pointerEvents: "none",
          }}
        />
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ transform: "rotate(-90deg)" }}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={trackColor}
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            style={{
              transition: "stroke-dashoffset 0.03s linear",
              filter: `drop-shadow(0 0 6px ${color}88)`,
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
              fontSize: size * 0.2,
              fontWeight: 700,
              color,
              fontFamily: "'Cormorant Garamond', serif",
              lineHeight: 1,
            }}
          >
            {Math.round((v * max) / 100)}
            {max === 100 ? "%" : ""}
          </span>
          {sublabel && (
            <span
              style={{
                fontSize: 9,
                letterSpacing: "0.1em",
                color: dark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)",
                textTransform: "uppercase",
                marginTop: 2,
              }}
            >
              {sublabel}
            </span>
          )}
        </div>
      </div>
      {label && (
        <p
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: dark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.55)",
            textAlign: "center",
          }}
        >
          {label}
        </p>
      )}
    </div>
  );
}

/* ─── stat card ─── */
function StatCard({ icon, label, value, suffix = "", color, dark, delay = 0 }) {
  const T = {
    card: dark ? "#141414" : "#fff",
    bdr: dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)",
    fg: dark ? "#ededed" : "#111",
    fg2: dark ? "#888" : "#555",
  };
  return (
    <div
      style={{
        background: T.card,
        border: `1px solid ${T.bdr}`,
        borderRadius: 16,
        padding: "24px 22px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        animation: `fadeUp 0.5s ease ${delay}ms both`,
        borderTop: `2px solid ${color}`,
        transition: "transform .2s, box-shadow .2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = dark
          ? `0 16px 40px rgba(0,0,0,0.5), 0 0 20px ${color}18`
          : `0 12px 32px rgba(0,0,0,0.1), 0 0 20px ${color}18`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "";
        e.currentTarget.style.boxShadow = "";
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span style={{ fontSize: 20 }}>{icon}</span>
        <span
          style={{
            fontSize: 9,
            letterSpacing: "0.12em",
            color: T.fg2,
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          {label}
        </span>
      </div>
      <div
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 38,
          fontWeight: 700,
          color,
          lineHeight: 1,
        }}
      >
        <CountUp
          target={typeof value === "number" ? value : 0}
          suffix={suffix}
        />
        {typeof value === "string" && value}
      </div>
    </div>
  );
}

/* ─── mini job card for dashboard ─── */
function MiniJobCard({ job, dark, delay = 0 }) {
  const T = {
    card: dark ? "#141414" : "#fff",
    bdr: dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)",
    fg: dark ? "#ededed" : "#111",
    fg2: dark ? "#888" : "#555",
    fg3: dark ? "#444" : "#ccc",
    accent: "#22c55e",
  };
  const score = job.relevanceScore ?? job.relevance_score ?? 0;
  const color = score >= 75 ? "#22c55e" : score >= 50 ? "#f59e0b" : "#ef4444";
  const hasUrl = job.url?.startsWith("http");

  return (
    <div
      style={{
        background: T.card,
        border: `1px solid ${T.bdr}`,
        borderRadius: 14,
        padding: "16px 18px",
        display: "flex",
        alignItems: "center",
        gap: 14,
        animation: `fadeUp 0.4s ease ${delay}ms both`,
        transition: "transform .2s",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.transform = "translateX(4px)")
      }
      onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
    >
      {/* score ring small */}
      <div
        style={{ position: "relative", width: 50, height: 50, flexShrink: 0 }}
      >
        <svg
          width="50"
          height="50"
          viewBox="0 0 50 50"
          style={{ transform: "rotate(-90deg)" }}
        >
          <circle
            cx="25"
            cy="25"
            r="19"
            fill="none"
            stroke={dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}
            strokeWidth="5"
          />
          <circle
            cx="25"
            cy="25"
            r="19"
            fill="none"
            stroke={color}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 19}`}
            strokeDashoffset={`${2 * Math.PI * 19 * (1 - score / 100)}`}
            style={{ filter: `drop-shadow(0 0 4px ${color}88)` }}
          />
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 10,
            fontWeight: 700,
            color,
          }}
        >
          {score}%
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: T.fg,
            marginBottom: 3,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {job.title}
        </p>
        <p
          style={{
            fontSize: 11,
            color: T.fg2,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {job.company !== "N/A" ? job.company : ""}{" "}
          {job.location !== "N/A" ? `· ${job.location}` : ""}
        </p>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 4,
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontSize: 9,
            letterSpacing: "0.1em",
            color: T.fg3,
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          {job.source}
        </span>
        {hasUrl && (
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: 10,
              color: T.accent,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Apply ↗
          </a>
        )}
      </div>
    </div>
  );
}

/* ─── history row ─── */
function PredictRow({ item, dark, delay = 0 }) {
  const T = {
    bdr: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)",
    fg: dark ? "#ededed" : "#111",
    fg2: dark ? "#888" : "#555",
    fg3: dark ? "#444" : "#aaa",
  };
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr auto auto",
        gap: 12,
        padding: "14px 0",
        borderBottom: `1px solid ${T.bdr}`,
        alignItems: "center",
        animation: `fadeUp 0.4s ease ${delay}ms both`,
      }}
    >
      <div style={{ minWidth: 0 }}>
        <p
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: T.fg,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {item.predictedRole}
        </p>
        <p style={{ fontSize: 11, color: T.fg2, marginTop: 2 }}>
          Selected: {item.selectedRole}
        </p>
      </div>
      <p
        style={{
          fontSize: 11,
          color: T.fg2,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {item.fileName}
      </p>
      <span
        style={{
          padding: "3px 10px",
          borderRadius: 20,
          fontSize: 10,
          fontWeight: 600,
          background: item.match
            ? "rgba(34,197,94,0.12)"
            : "rgba(239,68,68,0.12)",
          color: item.match ? "#22c55e" : "#ef4444",
          border: `1px solid ${item.match ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)"}`,
          whiteSpace: "nowrap",
        }}
      >
        {item.match ? "✓ Match" : "✗ Mismatch"}
      </span>
      <span
        style={{
          fontSize: 12,
          fontWeight: 700,
          color:
            item.confidence >= 70
              ? "#22c55e"
              : item.confidence >= 50
                ? "#f59e0b"
                : "#ef4444",
        }}
      >
        {item.confidence}%
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN DASHBOARD
═══════════════════════════════════════════════════════════ */
export default function Dashboard() {
  const dark = useDark();
  const token = localStorage.getItem("token");

  const [user, setUser] = useState(null);
  const [predictHistory, setPredictHistory] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [latestAts, setLatestAts] = useState(null);
  const [loading, setLoading] = useState(true);

  const T = {
    bg: dark ? "#0d0d0d" : "#f8f7f4",
    bg2: dark ? "#141414" : "#efefec",
    card: dark ? "#141414" : "#ffffff",
    bdr: dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)",
    fg: dark ? "#ededed" : "#111111",
    fg2: dark ? "#888888" : "#555555",
    fg3: dark ? "#444444" : "#aaaaaa",
    accent: "#22c55e",
    strip: dark ? "#0a0a0a" : "#111",
    glow: dark ? "rgba(34,197,94,0.07)" : "rgba(34,197,94,0.06)",
  };

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [meRes, histRes, jobsRes, sessionRes] = await Promise.allSettled([
          axios.get("http://localhost:5000/api/auth/me", { headers }),
          axios.get("http://localhost:5000/api/predict/history", { headers }),
          axios.get("http://localhost:5000/api/jobs/history", { headers }),
          axios.get("http://localhost:5000/api/agent/sessions", { headers }),
        ]);
        if (meRes.status === "fulfilled") setUser(meRes.value.data);
        if (histRes.status === "fulfilled")
          setPredictHistory(histRes.value.data.history || []);
        if (jobsRes.status === "fulfilled")
          setJobs(jobsRes.value.data.jobs || []);
        if (sessionRes.status === "fulfilled") {
          const sessions = sessionRes.value.data.sessions || [];
          const withAts = sessions
            .filter((s) => s.atsReport)
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
          if (withAts.length) setLatestAts(withAts[0].atsReport);
        }
      } catch (_) {
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  /* derived stats */
  const avgConf = predictHistory.length
    ? Math.round(
        predictHistory.reduce((s, h) => s + (h.confidence || 0), 0) /
          predictHistory.length,
      )
    : 0;
  const matchRate = predictHistory.length
    ? Math.round(
        (predictHistory.filter((h) => h.match).length / predictHistory.length) *
          100,
      )
    : 0;
  const topRole = predictHistory.length
    ? (() => {
        const freq = {};
        predictHistory.forEach((h) => {
          freq[h.predictedRole] = (freq[h.predictedRole] || 0) + 1;
        });
        return Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";
      })()
    : "—";

  const atsBreakdown = latestAts?.score_breakdown
    ? [
        { label: "Skill Match", key: "skill_match", color: "#22c55e" },
        { label: "Technical", key: "technical_knowledge", color: "#3b82f6" },
        { label: "Communication", key: "communication", color: "#a855f7" },
        { label: "Problem Solving", key: "problem_solving", color: "#f59e0b" },
      ]
    : [];

  const greetHour = new Date().getHours();
  const greeting =
    greetHour < 12
      ? "Good morning"
      : greetHour < 17
        ? "Good afternoon"
        : "Good evening";

  if (loading)
    return (
      <div
        style={{
          minHeight: "100vh",
          background: T.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Navbar />
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 48,
              height: 48,
              border: "3px solid rgba(34,197,94,0.2)",
              borderTopColor: "#22c55e",
              borderRadius: "50%",
              animation: "spin 0.9s linear infinite",
              margin: "0 auto 16px",
            }}
          />
          <p style={{ fontSize: 13, color: T.fg2 }}>Loading your dashboard…</p>
        </div>
      </div>
    );

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
        @keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { to { transform:rotate(360deg); } }
        @keyframes glow-pulse { 0%,100%{opacity:.4;transform:scale(1);} 50%{opacity:.8;transform:scale(1.08);} }
        @keyframes shimmer { 0%{background-position:-400px 0;} 100%{background-position:400px 0;} }
        .dash-section { animation: fadeUp .5s ease both; }

        /* ── responsive grid helpers ── */
        .stats-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; }
        .ats-grid { display:grid; grid-template-columns:1fr 1fr; gap:24px; }
        .ats-rings { display:grid; grid-template-columns:repeat(4,1fr); gap:20px; justify-items:center; }
        .history-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
        .jobs-grid { display:grid; grid-template-columns:1fr; gap:10px; }
        .quick-links { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }

        @media(max-width:1024px){
          .stats-grid { grid-template-columns:repeat(2,1fr); }
          .ats-rings { grid-template-columns:repeat(2,1fr); gap:24px; }
          .ats-grid { grid-template-columns:1fr; }
          .history-grid { grid-template-columns:1fr; }
        }
        @media(max-width:640px){
          .stats-grid { grid-template-columns:1fr 1fr; }
          .quick-links { grid-template-columns:1fr; }
          .ats-rings { grid-template-columns:repeat(2,1fr); }
        }
        @media(max-width:420px){
          .stats-grid { grid-template-columns:1fr; }
        }
      `}</style>

      {/* radial glow bg */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          background: `radial-gradient(ellipse 70% 40% at 50% 0%, ${T.glow} 0%, transparent 65%)`,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1280,
          margin: "0 auto",
          padding: "40px 24px 80px",
        }}
      >
        {/* ── WELCOME HEADER ── */}
        <div
          className="dash-section"
          style={{
            marginBottom: 40,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div>
            <p
              style={{
                fontSize: 10,
                letterSpacing: "0.22em",
                color: T.fg3,
                textTransform: "uppercase",
                fontWeight: 500,
                marginBottom: 8,
              }}
            >
              ✦ &nbsp; Dashboard &nbsp; ✦
            </p>
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(28px,4vw,48px)",
                fontWeight: 700,
                lineHeight: 1.05,
                marginBottom: 6,
              }}
            >
              {greeting},<br />
              <em style={{ fontStyle: "italic", color: T.accent }}>
                {user?.name || "there"}
              </em>
            </h1>
            <p style={{ fontSize: 13, color: T.fg2, fontWeight: 300 }}>
              Here's an overview of your career analysis activity.
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link
              to="/predict-role"
              style={{
                padding: "10px 20px",
                background: T.card,
                border: `1px solid ${T.bdr}`,
                borderRadius: 10,
                fontSize: 12,
                fontWeight: 600,
                color: T.fg,
                textDecoration: "none",
                transition: "all .2s",
                whiteSpace: "nowrap",
              }}
            >
              ◈ Validate Role
            </Link>
            <Link
              to="/interview-agent"
              style={{
                padding: "10px 20px",
                background: T.accent,
                border: "none",
                borderRadius: 10,
                fontSize: 12,
                fontWeight: 600,
                color: "#fff",
                textDecoration: "none",
                transition: "all .2s",
                whiteSpace: "nowrap",
              }}
            >
              ◉ Start Interview →
            </Link>
          </div>
        </div>

        {/* ── STAT CARDS ── */}
        <div className="stats-grid dash-section" style={{ marginBottom: 32 }}>
          <StatCard
            icon="◈"
            label="Predictions Run"
            value={predictHistory.length}
            color="#22c55e"
            dark={dark}
            delay={0}
          />
          <StatCard
            icon="◎"
            label="Avg Confidence"
            value={avgConf}
            suffix="%"
            color="#3b82f6"
            dark={dark}
            delay={80}
          />
          <StatCard
            icon="◉"
            label="Match Rate"
            value={matchRate}
            suffix="%"
            color="#a855f7"
            dark={dark}
            delay={160}
          />
          <StatCard
            icon="◐"
            label="Jobs Scraped"
            value={jobs.length}
            color="#f59e0b"
            dark={dark}
            delay={240}
          />
        </div>

        {/* ── TOP ROLE BANNER ── */}
        {topRole !== "—" && (
          <div
            className="dash-section"
            style={{
              background: dark
                ? "linear-gradient(135deg, #0d4d2e 0%, #071a10 100%)"
                : "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
              border: `1px solid ${dark ? "rgba(34,197,94,0.2)" : "rgba(34,197,94,0.25)"}`,
              borderRadius: 18,
              padding: "24px 32px",
              marginBottom: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 20,
              flexWrap: "wrap",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 10,
                  letterSpacing: "0.16em",
                  color: dark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  marginBottom: 6,
                }}
              >
                AI's Best-Fit Role for You
              </p>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(22px,3vw,34px)",
                  fontWeight: 700,
                  color: dark ? "#fff" : "#0f172a",
                  lineHeight: 1.1,
                }}
              >
                {topRole}
              </h2>
            </div>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              <div>
                <p
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.1em",
                    color: dark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)",
                    textTransform: "uppercase",
                    marginBottom: 4,
                    fontWeight: 600,
                  }}
                >
                  Avg Confidence
                </p>
                <p
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 32,
                    fontWeight: 700,
                    color: T.accent,
                    lineHeight: 1,
                  }}
                >
                  {avgConf}%
                </p>
              </div>
              <div
                style={{
                  width: 1,
                  background: dark
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.1)",
                }}
              />
              <div>
                <p
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.1em",
                    color: dark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)",
                    textTransform: "uppercase",
                    marginBottom: 4,
                    fontWeight: 600,
                  }}
                >
                  Match Rate
                </p>
                <p
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 32,
                    fontWeight: 700,
                    color: "#3b82f6",
                    lineHeight: 1,
                  }}
                >
                  {matchRate}%
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── ATS REPORT SECTION ── */}
        {latestAts && (
          <div className="dash-section ats-grid" style={{ marginBottom: 32 }}>
            {/* left: main ring + info */}
            <div
              style={{
                background: T.card,
                border: `1px solid ${T.bdr}`,
                borderRadius: 20,
                padding: "32px 28px",
                display: "flex",
                flexDirection: "column",
                gap: 24,
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.16em",
                    color: T.fg3,
                    textTransform: "uppercase",
                    fontWeight: 600,
                    marginBottom: 6,
                  }}
                >
                  Latest Interview Score
                </p>
                <h2
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 22,
                    fontWeight: 700,
                    color: T.fg,
                  }}
                >
                  ATS Evaluation
                </h2>
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <GlowRing
                  value={latestAts.ats_score ?? 0}
                  max={100}
                  size={180}
                  stroke={16}
                  color="#22c55e"
                  sublabel="ATS Score"
                  dark={dark}
                />
              </div>
              <div
                style={{ padding: "16px 0 0", borderTop: `1px solid ${T.bdr}` }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                >
                  <span style={{ fontSize: 12, color: T.fg2 }}>
                    Readiness Level
                  </span>
                  <span
                    style={{ fontSize: 12, fontWeight: 700, color: T.accent }}
                  >
                    {latestAts.readiness_level || "—"}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: 12, color: T.fg2 }}>
                    Hire Recommendation
                  </span>
                  <span
                    style={{ fontSize: 12, fontWeight: 700, color: "#3b82f6" }}
                  >
                    {latestAts.hire_recommendation || "—"}
                  </span>
                </div>
              </div>
            </div>

            {/* right: breakdown rings + feedback */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div
                style={{
                  background: T.card,
                  border: `1px solid ${T.bdr}`,
                  borderRadius: 20,
                  padding: "28px 24px",
                }}
              >
                <p
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.16em",
                    color: T.fg3,
                    textTransform: "uppercase",
                    fontWeight: 600,
                    marginBottom: 24,
                  }}
                >
                  Score Breakdown
                </p>
                <div className="ats-rings">
                  {atsBreakdown.map((b, i) => (
                    <GlowRing
                      key={b.key}
                      value={latestAts.score_breakdown?.[b.key] ?? 0}
                      max={latestAts.score_breakdown?.[b.key] > 10 ? 100 : 10}
                      size={100}
                      stroke={10}
                      color={b.color}
                      label={b.label}
                      dark={dark}
                    />
                  ))}
                </div>
              </div>
              {latestAts.overall_feedback && (
                <div
                  style={{
                    background: T.card,
                    border: `1px solid ${T.bdr}`,
                    borderRadius: 20,
                    padding: "22px 24px",
                    flex: 1,
                  }}
                >
                  <p
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.16em",
                      color: T.fg3,
                      textTransform: "uppercase",
                      fontWeight: 600,
                      marginBottom: 12,
                    }}
                  >
                    Overall Feedback
                  </p>
                  <p
                    style={{
                      fontSize: 13,
                      color: T.fg2,
                      lineHeight: 1.75,
                      fontWeight: 300,
                    }}
                  >
                    {latestAts.overall_feedback}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── PREDICTION HISTORY + JOBS ── */}
        <div className="history-grid dash-section" style={{ marginBottom: 32 }}>
          {/* prediction history */}
          <div
            style={{
              background: T.card,
              border: `1px solid ${T.bdr}`,
              borderRadius: 20,
              padding: "28px 24px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.16em",
                    color: T.fg3,
                    textTransform: "uppercase",
                    fontWeight: 600,
                    marginBottom: 4,
                  }}
                >
                  Prediction History
                </p>
                <h3
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 20,
                    fontWeight: 700,
                    color: T.fg,
                  }}
                >
                  Role Validations
                </h3>
              </div>
              <Link
                to="/prediction-history"
                style={{
                  fontSize: 11,
                  color: T.accent,
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                View All →
              </Link>
            </div>
            {predictHistory.length === 0 ? (
              <div
                style={{ textAlign: "center", padding: "32px 0", color: T.fg3 }}
              >
                <div style={{ fontSize: 32, marginBottom: 10 }}>◎</div>
                <p style={{ fontSize: 13 }}>No predictions yet</p>
                <Link
                  to="/predict-role"
                  style={{
                    fontSize: 12,
                    color: T.accent,
                    fontWeight: 600,
                    textDecoration: "none",
                    marginTop: 8,
                    display: "inline-block",
                  }}
                >
                  Run your first →
                </Link>
              </div>
            ) : (
              <>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr auto auto",
                    gap: 12,
                    paddingBottom: 10,
                    borderBottom: `1px solid ${T.bdr}`,
                    marginBottom: 4,
                  }}
                >
                  {["Predicted Role", "File", "Match", "Score"].map((h) => (
                    <p
                      key={h}
                      style={{
                        fontSize: 9,
                        letterSpacing: "0.12em",
                        color: T.fg3,
                        textTransform: "uppercase",
                        fontWeight: 600,
                      }}
                    >
                      {h}
                    </p>
                  ))}
                </div>
                {predictHistory.slice(0, 5).map((item, i) => (
                  <PredictRow
                    key={item._id || i}
                    item={item}
                    dark={dark}
                    delay={i * 60}
                  />
                ))}
              </>
            )}
          </div>

          {/* recent scraped jobs */}
          <div
            style={{
              background: T.card,
              border: `1px solid ${T.bdr}`,
              borderRadius: 20,
              padding: "28px 24px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.16em",
                    color: T.fg3,
                    textTransform: "uppercase",
                    fontWeight: 600,
                    marginBottom: 4,
                  }}
                >
                  Live Matches
                </p>
                <h3
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 20,
                    fontWeight: 700,
                    color: T.fg,
                  }}
                >
                  Recent Jobs
                </h3>
              </div>
              <Link
                to="/jobs"
                style={{
                  fontSize: 11,
                  color: T.accent,
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Find More →
              </Link>
            </div>
            {jobs.length === 0 ? (
              <div
                style={{ textAlign: "center", padding: "32px 0", color: T.fg3 }}
              >
                <div style={{ fontSize: 32, marginBottom: 10 }}>◉</div>
                <p style={{ fontSize: 13 }}>No jobs scraped yet</p>
                <Link
                  to="/jobs"
                  style={{
                    fontSize: 12,
                    color: T.accent,
                    fontWeight: 600,
                    textDecoration: "none",
                    marginTop: 8,
                    display: "inline-block",
                  }}
                >
                  Search jobs →
                </Link>
              </div>
            ) : (
              <div className="jobs-grid">
                {jobs.slice(0, 5).map((job, i) => (
                  <MiniJobCard
                    key={job._id || i}
                    job={job}
                    dark={dark}
                    delay={i * 60}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── QUICK LINKS ── */}
        <div className="dash-section">
          <p
            style={{
              fontSize: 10,
              letterSpacing: "0.18em",
              color: T.fg3,
              textTransform: "uppercase",
              fontWeight: 600,
              marginBottom: 16,
            }}
          >
            Quick Actions
          </p>
          <div className="quick-links">
            {[
              {
                to: "/predict-role",
                icon: "◈",
                title: "Validate Role",
                desc: "Upload CV & check your best-fit role against a target.",
                color: "#22c55e",
              },
              {
                to: "/interview-agent",
                icon: "◉",
                title: "Mock Interview",
                desc: "Simulate a real interview and get your ATS score.",
                color: "#3b82f6",
              },
              {
                to: "/jobs",
                icon: "◐",
                title: "Find Jobs",
                desc: "Scrape live listings matched to your profile.",
                color: "#f59e0b",
              },
            ].map((link, i) => (
              <Link
                key={i}
                to={link.to}
                style={{ textDecoration: "none", display: "block" }}
              >
                <div
                  style={{
                    background: T.card,
                    border: `1px solid ${T.bdr}`,
                    borderRadius: 18,
                    padding: "24px 22px",
                    borderTop: `2px solid ${link.color}`,
                    transition: "transform .2s, box-shadow .2s",
                    animation: `fadeUp 0.5s ease ${i * 100}ms both`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = dark
                      ? `0 20px 50px rgba(0,0,0,0.5)`
                      : `0 16px 40px rgba(0,0,0,0.1)`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "";
                    e.currentTarget.style.boxShadow = "";
                  }}
                >
                  <div
                    style={{
                      fontSize: 24,
                      marginBottom: 12,
                      color: link.color,
                    }}
                  >
                    {link.icon}
                  </div>
                  <h3
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: T.fg,
                      marginBottom: 8,
                    }}
                  >
                    {link.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 12,
                      color: T.fg2,
                      lineHeight: 1.6,
                      fontWeight: 300,
                    }}
                  >
                    {link.desc}
                  </p>
                  <p
                    style={{
                      fontSize: 11,
                      color: link.color,
                      fontWeight: 600,
                      marginTop: 14,
                    }}
                  >
                    Go now →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
