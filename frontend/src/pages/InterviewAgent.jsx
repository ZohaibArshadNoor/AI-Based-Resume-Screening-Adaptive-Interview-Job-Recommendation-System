// src/pages/InterviewAgent.jsx
// ─── IMPROVED ATS REPORT – FULL WIDTH, ANIMATED, AWESOME ─────────────────

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

/* ── theme sync ── */
function useDark() {
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );
  useEffect(() => {
    const obs = new MutationObserver(() =>
      setDark(document.documentElement.classList.contains("dark"))
    );
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => obs.disconnect();
  }, []);
  return dark;
}

/* ── animated score circle (enhanced) ── */
function ScoreCircle({ label, value, max = 100, accent = "#22c55e", size = 90 }) {
  const r = size / 2 - 9;
  const circ = 2 * Math.PI * r;
  const [v, setV] = useState(0);
  useEffect(() => {
    let start = null;
    const dur = 1000;
    const target = (value / max) * 100;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      setV(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value, max]);

  const offset = circ - (v / 100) * circ;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
      }}
    >
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="8"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={accent}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            style={{
              transform: "rotate(-90deg)",
              transformOrigin: "center",
              transition: "stroke-dashoffset 0.04s linear",
            }}
          />
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <span
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: accent,
              fontFamily: "'Cormorant Garamond', serif",
            }}
          >
            {value}
          </span>
        </div>
      </div>
      <span
        style={{
          fontSize: 10,
          letterSpacing: "0.12em",
          color: "rgba(255,255,255,0.5)",
          textTransform: "uppercase",
          fontWeight: 600,
          textAlign: "center",
          maxWidth: size,
        }}
      >
        {label}
      </span>
    </div>
  );
}

/* ── loading screen (unchanged) ── */
function LoadingScreen({ dark }) {
  const msgs = [
    "Analyzing your resume…",
    "Parsing job description…",
    "Calibrating difficulty level…",
    "Preparing interview questions…",
    "Almost ready…",
  ];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % msgs.length), 1600);
    return () => clearInterval(id);
  }, []);

  const T = {
    bg: dark ? "#0d0d0d" : "#f8f7f4",
    fg: dark ? "#ededed" : "#111",
    fg2: dark ? "#888" : "#666",
    accent: "#22c55e",
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: T.bg,
        zIndex: 999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 32,
      }}
    >
      <div style={{ position: "relative", width: 100, height: 100 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(34,197,94,0.25) 0%, transparent 70%)",
            animation: "orb-pulse 2s ease-in-out infinite",
          }}
        />
        <svg
          width="100"
          height="100"
          viewBox="0 0 100 100"
          style={{ animation: "spin 2.5s linear infinite" }}
        >
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="rgba(34,197,94,0.15)"
            strokeWidth="4"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#22c55e"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="80 172"
            style={{ transformOrigin: "center" }}
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
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 28,
            color: T.fg,
            marginBottom: 12,
          }}
        >
          Setting up your interview
        </h2>
        <p
          style={{
            fontSize: 13,
            color: T.fg2,
            animation: "fadeUp 0.4s ease",
          }}
          key={idx}
        >
          {msgs[idx]}
        </p>
      </div>
    </div>
  );
}

/* ── NEW, IMPROVED, FULL-WIDTH ATS REPORT ── */
function ATSReport({ atsReport, dark }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    // trigger entrance animation after mount
    setTimeout(() => setAnimated(true), 100);
  }, []);

  const T = {
    card: dark ? "#141414" : "#ffffff",
    cardBdr: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
    fg: dark ? "#ededed" : "#111111",
    fg2: dark ? "#a0a0a0" : "#555555",
    fg3: dark ? "#666" : "#aaaaaa",
    accent: "#22c55e",
    strip: dark
      ? "linear-gradient(135deg, #0a2e1a 0%, #051a0c 100%)"
      : "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)",
    stripFg: dark ? "#fff" : "#0f172a",
    listBg: dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
  };

  const breakdownKeys = [
    { key: "skill_match", label: "Skill Match", icon: "⚙️" },
    { key: "technical_knowledge", label: "Technical", icon: "🔧" },
    { key: "communication", label: "Communication", icon: "💬" },
    { key: "problem_solving", label: "Problem Solving", icon: "🧩" },
  ];
  const accents = ["#22c55e", "#3b82f6", "#f59e0b", "#a855f7"];

  return (
    <div
      style={{
        marginTop: 32,
        animation: animated ? "fadeUp 0.6s cubic-bezier(0.2, 0.9, 0.4, 1.1)" : "none",
        opacity: animated ? 1 : 0,
        transform: animated ? "translateY(0)" : "translateY(30px)",
        transition: "all 0.5s ease",
      }}
    >
      <div
        style={{
          background: T.card,
          border: `1px solid ${T.cardBdr}`,
          borderRadius: 28,
          overflow: "hidden",
          boxShadow: dark
            ? "0 25px 50px -12px rgba(0,0,0,0.6)"
            : "0 20px 35px -10px rgba(0,0,0,0.1)",
        }}
      >
        {/* Header with score and rings */}
        <div
          style={{
            background: T.strip,
            padding: "32px 32px 24px",
            borderBottom: `1px solid ${T.cardBdr}`,
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 24,
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 10,
                  letterSpacing: "0.2em",
                  color: dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
                  textTransform: "uppercase",
                  marginBottom: 8,
                  fontWeight: 600,
                }}
              >
                ✦ Interview Evaluation Report
              </p>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "clamp(42px, 8vw, 64px)",
                    fontWeight: 700,
                    color: T.stripFg,
                    lineHeight: 1,
                  }}
                >
                  {atsReport.ats_score}
                  <span style={{ fontSize: 24, opacity: 0.6 }}>/100</span>
                </span>
                <span
                  style={{
                    background: dark ? "rgba(34,197,94,0.15)" : "rgba(34,197,94,0.2)",
                    padding: "4px 12px",
                    borderRadius: 30,
                    fontSize: 12,
                    fontWeight: 600,
                    color: T.accent,
                  }}
                >
                  {atsReport.readiness_level}
                </span>
              </div>
            </div>
            <div className="rings-grid" style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {breakdownKeys.map((b, i) => (
                <ScoreCircle
                  key={b.key}
                  label={b.label}
                  value={atsReport.score_breakdown?.[b.key] ?? 0}
                  accent={accents[i]}
                  size={80}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "28px 32px" }}>
          {/* Hire rec + overall feedback */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 16,
              marginBottom: 32,
              paddingBottom: 20,
              borderBottom: `1px solid ${T.cardBdr}`,
            }}
          >
            <div>
              <p style={{ fontSize: 11, color: T.fg3, letterSpacing: "0.1em", marginBottom: 6 }}>
                HIRING RECOMMENDATION
              </p>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: dark ? "rgba(34,197,94,0.1)" : "#dcfce7",
                  padding: "6px 18px",
                  borderRadius: 40,
                  border: `1px solid ${T.accent}40`,
                }}
              >
                <span style={{ fontSize: 14 }}>{atsReport.hire_recommendation === "Strong Hire" ? "🔥" : "✓"}</span>
                <span style={{ fontWeight: 700, color: T.accent, fontSize: 13 }}>
                  {atsReport.hire_recommendation}
                </span>
              </div>
            </div>
            <div style={{ maxWidth: 300, textAlign: "right" }}>
              <p style={{ fontSize: 10, color: T.fg3, letterSpacing: "0.1em", marginBottom: 4 }}>
                OVERALL FEEDBACK
              </p>
              <p style={{ fontSize: 13, color: T.fg2, lineHeight: 1.6 }}>
                {atsReport.overall_feedback}
              </p>
            </div>
          </div>

          {/* Strengths & Weaknesses – modern cards with icons */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 24,
              marginBottom: 32,
            }}
          >
            <div
              style={{
                background: T.listBg,
                borderRadius: 20,
                padding: "20px 20px",
                border: `1px solid ${T.cardBdr}`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <span style={{ fontSize: 20 }}></span>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: T.accent, letterSpacing: "0.05em" }}>
                  STRENGTHS
                </h3>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {atsReport.strengths?.map((s, i) => (
                  <li
                    key={i}
                    style={{
                      fontSize: 12,
                      color: T.fg2,
                      padding: "8px 0 8px 20px",
                      borderBottom: i !== atsReport.strengths.length - 1 ? `1px solid ${T.cardBdr}` : "none",
                      position: "relative",
                    }}
                  >
                    <span style={{ position: "absolute", left: 0, color: T.accent }}>▹</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div
              style={{
                background: T.listBg,
                borderRadius: 20,
                padding: "20px 20px",
                border: `1px solid ${T.cardBdr}`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <span style={{ fontSize: 20 }}></span>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#ef4444", letterSpacing: "0.05em" }}>
                  WEAKNESSES
                </h3>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {atsReport.weaknesses?.map((w, i) => (
                  <li
                    key={i}
                    style={{
                      fontSize: 12,
                      color: T.fg2,
                      padding: "8px 0 8px 20px",
                      borderBottom: i !== atsReport.weaknesses.length - 1 ? `1px solid ${T.cardBdr}` : "none",
                      position: "relative",
                    }}
                  >
                    <span style={{ position: "absolute", left: 0, color: "#ef4444" }}>▹</span>
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Improvement Suggestions */}
          {atsReport.improvement_suggestions?.length > 0 && (
            <div
              style={{
                background: T.listBg,
                borderRadius: 20,
                padding: "20px 20px",
                border: `1px solid ${T.cardBdr}`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <span style={{ fontSize: 20 }}></span>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#f59e0b", letterSpacing: "0.05em" }}>
                  IMPROVEMENT SUGGESTIONS
                </h3>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                {atsReport.improvement_suggestions.map((s, i) => (
                  <li
                    key={i}
                    style={{
                      fontSize: 12,
                      color: T.fg2,
                      paddingLeft: 20,
                      position: "relative",
                    }}
                  >
                    <span style={{ position: "absolute", left: 0, color: "#f59e0b" }}>✦</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── main component (unchanged except responsiveness) ── */
export default function InterviewAgent() {
  const dark = useDark();
  const [jobDescription, setJobDescription] = useState("");
  const [role, setRole] = useState("");
  const [file, setFile] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [starting, setStarting] = useState(false);
  const [started, setStarted] = useState(false);
  const [atsReport, setAtsReport] = useState(null);
  const [atsLoading, setAtsLoading] = useState(false);
  const [touched, setTouched] = useState({ jd: false, role: false });
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef();
  const token = localStorage.getItem("token");

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
    userBubble: dark ? "#fff" : "#111",
    userBubbleFg: dark ? "#000" : "#fff",
    aiBubble: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
    aiBubbleFg: dark ? "#ededed" : "#111",
    chatBg: dark ? "#0a0a0a" : "#f4f4f1",
    glow: dark ? "rgba(34,197,94,0.06)" : "rgba(34,197,94,0.07)",
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const startInterview = async () => {
    setTouched({ jd: true, role: true });
    if (!jobDescription.trim() || !role.trim()) return;
    try {
      setStarting(true);
      const res = await axios.post(
        "http://localhost:5000/api/agent/start",
        { jobDescription, role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSessionId(res.data.sessionId);
      setStarted(true);
    } catch (err) {
      alert(
        "Failed to start interview: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setStarting(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    const userInput = input;
    setInput("");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("sessionId", sessionId);
      formData.append("userMessage", userInput);
      if (file && messages.length === 0) formData.append("file", file);
      const res = await axios.post(
        "http://localhost:5000/api/agent/message",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages([
        ...newMessages,
        { role: "assistant", content: res.data.reply },
      ]);
    } catch (err) {
      alert(
        "Message failed: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const getATS = async () => {
    try {
      setAtsLoading(true);
      const res = await axios.post(
        "http://localhost:5000/api/agent/ats-score",
        { sessionId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAtsReport(res.data);
    } catch (err) {
      alert(
        "Failed to generate report: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setAtsLoading(false);
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
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Syne:wght@400;500;600;700&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { to { transform:rotate(360deg); } }
        @keyframes orb-pulse { 0%,100% { transform:scale(1); opacity:.4; } 50% { transform:scale(1.15); opacity:.8; } }
        @keyframes typing-dot { 0%,60%,100% { opacity:.2; transform:translateY(0); } 30% { opacity:1; transform:translateY(-4px); } }
        .ia-card { animation: fadeUp 0.5s ease both; }
        .ia-input:focus { border-color: #22c55e !important; outline: none; }
        .ia-btn:hover:not(:disabled) { opacity:.85; transform:translateY(-1px); }
        .ia-btn:active:not(:disabled) { transform:translateY(0); }
        .chat-input:focus { outline:none; border-color: #22c55e; }
        .typing-dot { display:inline-block; animation: typing-dot 1.2s infinite; }
        .typing-dot:nth-child(2) { animation-delay:.2s; }
        .typing-dot:nth-child(3) { animation-delay:.4s; }
        .msg-bubble { animation: fadeUp 0.3s ease both; }
        .ats-btn:hover:not(:disabled) { opacity:.85; }

        /* responsive layout – full width */
        .page-wrapper { width: 100%; padding: 56px 24px 80px; position: relative; z-index: 1; box-sizing: border-box; }
        @media (max-width: 700px) {
          .page-wrapper { padding: 40px 16px 60px; }
        }
        @media (min-width: 1400px) {
          .page-wrapper { padding: 56px 80px 80px; }
        }
        .rings-grid { display: flex; gap: 16px; flex-wrap: wrap; justify-content: center; }
      `}</style>

      {/* decorative glow */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          background: `radial-gradient(ellipse 60% 40% at 50% 20%, ${T.glow} 0%, transparent 70%)`,
        }}
      />

      {starting && <LoadingScreen dark={dark} />}

      <div className="page-wrapper">
        {/* header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <p
            style={{
              fontSize: 10,
              letterSpacing: "0.22em",
              color: T.fg2,
              textTransform: "uppercase",
              marginBottom: 16,
              fontWeight: 500,
            }}
          >
            ✦ &nbsp; AI Career Intelligence &nbsp; ✦
          </p>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(40px,8vw,64px)",
              fontWeight: 700,
              lineHeight: 0.95,
              letterSpacing: "-0.02em",
              marginBottom: 16,
            }}
          >
            Interview
            <br />
            <em style={{ fontStyle: "italic", color: T.accent }}>Agent</em>
          </h1>
          <p
            style={{
              fontSize: 14,
              color: T.fg2,
              lineHeight: 1.7,
              fontWeight: 300,
              maxWidth: 480,
              margin: "0 auto",
            }}
          >
            Simulate a real interview based on your resume and job description.
            Receive a full evaluation report at the end.
          </p>
        </div>

        {/* SETUP FORM */}
        {!started && (
          <div
            className="ia-card"
            style={{
              background: T.card,
              border: `1px solid ${T.cardBdr}`,
              borderRadius: 20,
              padding: "36px 32px",
              boxShadow: dark
                ? "0 32px 80px rgba(0,0,0,0.5)"
                : "0 8px 40px rgba(0,0,0,0.07)",
            }}
          >
            {/* step indicators */}
            <div style={{ display: "flex", gap: 10, marginBottom: 28, flexWrap: "wrap" }}>
              {[
                { n: "01", l: "Job Details" },
                { n: "02", l: "Upload CV" },
                { n: "03", l: "Interview" },
              ].map((s, i) => (
                <div
                  key={i}
                  style={{
                    flex: "1 1 100px",
                    background: dark
                      ? "rgba(255,255,255,0.03)"
                      : "rgba(0,0,0,0.025)",
                    border: `1px solid ${T.cardBdr}`,
                    borderRadius: 10,
                    padding: "12px 10px",
                  }}
                >
                  <div
                    style={{
                      fontSize: 9,
                      letterSpacing: "0.1em",
                      color: T.fg3,
                      marginBottom: 4,
                      fontWeight: 600,
                    }}
                  >
                    {s.n}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: T.fg2,
                      fontWeight: 500,
                    }}
                  >
                    {s.l}
                  </div>
                </div>
              ))}
            </div>

            {/* role */}
            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 10,
                  letterSpacing: "0.12em",
                  color: T.fg2,
                  textTransform: "uppercase",
                  fontWeight: 600,
                  marginBottom: 8,
                }}
              >
                Target Role <span style={{ color: T.err }}>*</span>
              </label>
              <input
                className="ia-input"
                placeholder="e.g. Senior Backend Engineer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  background: T.input,
                  border: `1.5px solid ${
                    touched.role && !role.trim() ? T.err : T.inputBdr
                  }`,
                  borderRadius: 10,
                  padding: "12px 14px",
                  color: T.fg,
                  fontSize: 13,
                  transition: "border-color .2s",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              />
              {touched.role && !role.trim() && (
                <p style={{ fontSize: 11, color: T.err, marginTop: 6 }}>
                  ⚠ Role is required.
                </p>
              )}
            </div>

            {/* job description */}
            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 10,
                  letterSpacing: "0.12em",
                  color: T.fg2,
                  textTransform: "uppercase",
                  fontWeight: 600,
                  marginBottom: 8,
                }}
              >
                Job Description <span style={{ color: T.err }}>*</span>
              </label>
              <p style={{ fontSize: 11, color: T.fg3, marginBottom: 8 }}>
                Paste the full job advertisement — the more detail, the better
                your interview will be calibrated.
              </p>
              <textarea
                className="ia-input"
                placeholder="Paste the complete job description here…"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={6}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  background: T.input,
                  border: `1.5px solid ${
                    touched.jd && !jobDescription.trim()
                      ? T.err
                      : T.inputBdr
                  }`,
                  borderRadius: 10,
                  padding: "12px 14px",
                  color: T.fg,
                  fontSize: 13,
                  resize: "vertical",
                  transition: "border-color .2s",
                  fontFamily: "'DM Sans', sans-serif",
                  lineHeight: 1.65,
                }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 4,
                }}
              >
                {touched.jd && !jobDescription.trim() ? (
                  <p style={{ fontSize: 11, color: T.err }}>
                    ⚠ Job description is required.
                  </p>
                ) : (
                  <span />
                )}
                <span style={{ fontSize: 11, color: T.fg3 }}>
                  {jobDescription.length} chars
                </span>
              </div>
            </div>

            {/* file upload */}
            <div style={{ marginBottom: 28 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 10,
                  letterSpacing: "0.12em",
                  color: T.fg2,
                  textTransform: "uppercase",
                  fontWeight: 600,
                  marginBottom: 8,
                }}
              >
                Resume / CV{" "}
                <span
                  style={{
                    fontSize: 10,
                    color: T.fg3,
                    textTransform: "none",
                    letterSpacing: 0,
                  }}
                >
                  (optional — improves accuracy)
                </span>
              </label>
              <div
                onClick={() => fileInputRef.current.click()}
                style={{
                  border: `1.5px dashed ${
                    file ? T.accent : T.inputBdr
                  }`,
                  borderRadius: 12,
                  background: file
                    ? dark
                      ? "rgba(34,197,94,0.05)"
                      : "rgba(34,197,94,0.04)"
                    : T.input,
                  padding: "20px 16px",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all .2s",
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.txt"
                  style={{ display: "none" }}
                  onChange={(e) => setFile(e.target.files[0])}
                />
                {file ? (
                  <>
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: T.accent,
                      }}
                    >
                      📄 {file.name}
                    </p>
                    <p
                      style={{
                        fontSize: 11,
                        color: T.fg2,
                        marginTop: 4,
                      }}
                    >
                      Click to replace
                    </p>
                  </>
                ) : (
                  <>
                    <p style={{ fontSize: 13, color: T.fg2 }}>
                      ⬆ Drop your CV or{" "}
                      <span style={{ color: T.accent }}>browse</span>
                    </p>
                    <p
                      style={{
                        fontSize: 11,
                        color: T.fg3,
                        marginTop: 4,
                      }}
                    >
                      PDF, DOCX, TXT
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* start button */}
            <button
              className="ia-btn"
              onClick={startInterview}
              disabled={starting}
              style={{
                width: "100%",
                background: dark ? "#fff" : "#111",
                color: dark ? "#000" : "#fff",
                border: "none",
                borderRadius: 10,
                padding: "14px",
                fontSize: 13,
                fontWeight: 600,
                cursor: starting ? "not-allowed" : "pointer",
                transition: "all .2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                letterSpacing: "0.06em",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {starting ? (
                <>
                  <span
                    style={{
                      width: 16,
                      height: 16,
                      border: "2px solid rgba(0,0,0,0.15)",
                      borderTopColor: "#000",
                      borderRadius: "50%",
                      animation: "spin 0.7s linear infinite",
                      display: "inline-block",
                    }}
                  />{" "}
                  Launching…
                </>
              ) : (
                "Begin Interview →"
              )}
            </button>
          </div>
        )}

        {/* CHAT INTERFACE */}
        {started && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* session badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 16px",
                background: dark
                  ? "rgba(34,197,94,0.08)"
                  : "rgba(34,197,94,0.06)",
                border: "1px solid rgba(34,197,94,0.2)",
                borderRadius: 12,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: T.accent,
                  boxShadow: `0 0 6px ${T.accent}`,
                  animation: "orb-pulse 2s ease-in-out infinite",
                  display: "inline-block",
                }}
              />
              <span
                style={{
                  fontSize: 12,
                  color: T.accent,
                  fontWeight: 600,
                }}
              >
                Live Interview Session
              </span>
              <span
                style={{
                  fontSize: 11,
                  color: T.fg2,
                  marginLeft: "auto",
                }}
              >
                {role}
              </span>
            </div>

            {/* messages */}
            <div
              style={{
                background: T.chatBg,
                border: `1px solid ${T.cardBdr}`,
                borderRadius: 16,
                padding: "20px 16px",
                height: 420,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              {messages.length === 0 && (
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 12,
                    color: T.fg3,
                    textAlign: "center",
                  }}
                >
                  <span style={{ fontSize: 36 }}>◈</span>
                  <p style={{ fontSize: 13, lineHeight: 1.6 }}>
                    Your interview is ready.
                    <br />
                    Start by greeting the interviewer. For example: “Hello,
                    I’m ready for the interview.”
                  </p>
                </div>
              )}
              {messages.map((m, i) => (
                <div
                  key={i}
                  className="msg-bubble"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems:
                      m.role === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  <span
                    style={{
                      fontSize: 9,
                      letterSpacing: "0.1em",
                      color: T.fg3,
                      marginBottom: 4,
                      textTransform: "uppercase",
                      fontWeight: 600,
                    }}
                  >
                    {m.role === "user" ? "You" : "AI Interviewer"}
                  </span>
                  <div
                    style={{
                      maxWidth: "80%",
                      background:
                        m.role === "user"
                          ? T.userBubble
                          : T.aiBubble,
                      color:
                        m.role === "user"
                          ? T.userBubbleFg
                          : T.aiBubbleFg,
                      borderRadius:
                        m.role === "user"
                          ? "16px 16px 4px 16px"
                          : "16px 16px 16px 4px",
                      padding: "12px 16px",
                      fontSize: 13,
                      lineHeight: 1.7,
                    }}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: 4,
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
                    AI Interviewer
                  </span>
                  <div
                    style={{
                      background: T.aiBubble,
                      borderRadius: "16px 16px 16px 4px",
                      padding: "14px 18px",
                    }}
                  >
                    <span
                      className="typing-dot"
                      style={{ fontSize: 18, color: T.accent }}
                    >
                      ·
                    </span>
                    <span
                      className="typing-dot"
                      style={{ fontSize: 18, color: T.accent }}
                    >
                      ·
                    </span>
                    <span
                      className="typing-dot"
                      style={{ fontSize: 18, color: T.accent }}
                    >
                      ·
                    </span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* input row */}
            <div style={{ display: "flex", gap: 10 }}>
              <input
                className="chat-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && !e.shiftKey && sendMessage()
                }
                placeholder={
                  messages.length === 0
                    ? "Type your greeting and press Enter…"
                    : "Type your answer and press Enter…"
                }
                style={{
                  flex: 1,
                  background: T.card,
                  border: `1.5px solid ${T.inputBdr}`,
                  borderRadius: 12,
                  padding: "13px 16px",
                  color: T.fg,
                  fontSize: 13,
                  fontFamily: "'DM Sans', sans-serif",
                  transition: "border-color .2s",
                }}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                style={{
                  padding: "13px 22px",
                  background: dark ? "#fff" : "#111",
                  color: dark ? "#000" : "#fff",
                  border: "none",
                  borderRadius: 12,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor:
                    loading || !input.trim() ? "not-allowed" : "pointer",
                  opacity: loading || !input.trim() ? 0.5 : 1,
                  transition: "all .2s",
                  fontFamily: "'DM Sans', sans-serif",
                  whiteSpace: "nowrap",
                }}
              >
                Send →
              </button>
            </div>

            {/* ATS button */}
            {!atsReport && (
              <button
                className="ats-btn"
                onClick={getATS}
                disabled={atsLoading || messages.length < 2}
                style={{
                  width: "100%",
                  border: `1.5px solid ${
                    messages.length < 2 ? T.inputBdr : T.accent
                  }`,
                  background: "transparent",
                  color: messages.length < 2 ? T.fg3 : T.accent,
                  borderRadius: 12,
                  padding: "13px",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor:
                    atsLoading || messages.length < 2
                      ? "not-allowed"
                      : "pointer",
                  transition: "all .2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {atsLoading ? (
                  <>
                    <span
                      style={{
                        width: 15,
                        height: 15,
                        border: "2px solid rgba(34,197,94,0.3)",
                        borderTopColor: T.accent,
                        borderRadius: "50%",
                        animation: "spin 0.8s linear infinite",
                        display: "inline-block",
                      }}
                    />{" "}
                    Generating your report…
                  </>
                ) : messages.length < 2 ? (
                  "Complete at least one exchange to generate report"
                ) : (
                  "◈ Generate Evaluation Report"
                )}
              </button>
            )}

            {/* ATS report – now full width and animated */}
            {atsReport && <ATSReport atsReport={atsReport} dark={dark} />}
          </div>
        )}
      </div>
    </div>
  );
}