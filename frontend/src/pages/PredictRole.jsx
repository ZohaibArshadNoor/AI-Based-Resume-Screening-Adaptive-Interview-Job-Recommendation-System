// src/pages/PredictRole.jsx
// ─── FULL WIDTH + RESPONSIVE ─────────────────────────────────────────────

import { useState, useEffect, useRef } from "react";
import axios from "axios";
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

/* ── animated confidence ring ── */
function ConfidenceRing({ value, match }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    let start = null;
    const duration = 1200;
    const target = value;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value]);

  const strokeColor = match
    ? "#22c55e"
    : displayed >= 60
      ? "#f59e0b"
      : "#ef4444";

  const dashOffset = circ - (displayed / 100) * circ;

  return (
    <div style={{ position: "relative", width: 140, height: 140 }}>
      <svg width="140" height="140" viewBox="0 0 140 140">
        {/* track */}
        <circle
          cx="70"
          cy="70"
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="10"
        />
        {/* fill */}
        <circle
          cx="70"
          cy="70"
          r={r}
          fill="none"
          stroke={strokeColor}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={dashOffset}
          style={{
            transform: "rotate(-90deg)",
            transformOrigin: "center",
            transition: "stroke-dashoffset 0.05s linear",
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
            fontSize: 28,
            fontWeight: 700,
            color: strokeColor,
            fontFamily: "'Cormorant Garamond', serif",
          }}
        >
          {displayed}%
        </span>
        <span
          style={{
            fontSize: 9,
            letterSpacing: "0.14em",
            color: "rgba(255,255,255,0.3)",
            textTransform: "uppercase",
          }}
        >
          confidence
        </span>
      </div>
    </div>
  );
}

/* ── file drop zone ── */
function FileDropZone({ file, setFile, dark }) {
  const inputRef = useRef();
  const [dragging, setDragging] = useState(false);

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  };

  const T = dark
    ? {
        border: dragging ? "#22c55e" : "rgba(255,255,255,0.14)",
        bg: dragging ? "rgba(34,197,94,0.05)" : "rgba(255,255,255,0.025)",
        text: "rgba(255,255,255,0.4)",
        accent: "#22c55e",
      }
    : {
        border: dragging ? "#16a34a" : "rgba(0,0,0,0.14)",
        bg: dragging ? "rgba(34,197,94,0.04)" : "rgba(0,0,0,0.02)",
        text: "rgba(0,0,0,0.4)",
        accent: "#16a34a",
      };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      onClick={() => inputRef.current.click()}
      style={{
        border: `1.5px dashed ${T.border}`,
        borderRadius: 14,
        background: T.bg,
        padding: "28px 20px",
        textAlign: "center",
        cursor: "pointer",
        transition: "all 0.2s",
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx,.txt"
        style={{ display: "none" }}
        onChange={(e) => setFile(e.target.files[0])}
      />
      <div style={{ fontSize: 28, marginBottom: 10 }}>{file ? "📄" : "⬆"}</div>
      {file ? (
        <>
          <p
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: T.accent,
              marginBottom: 4,
            }}
          >
            {file.name}
          </p>
          <p style={{ fontSize: 11, color: T.text }}>
            {(file.size / 1024).toFixed(1)} KB · Click to replace
          </p>
        </>
      ) : (
        <>
          <p
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: T.text,
              marginBottom: 4,
            }}
          >
            Drop your CV here or <span style={{ color: T.accent }}>browse</span>
          </p>
          <p style={{ fontSize: 11, color: T.text }}>
            PDF, DOCX, or TXT · Max 5 MB
          </p>
        </>
      )}
    </div>
  );
}

/* ── main page ── */
export default function PredictRole() {
  const dark = useDark();
  const [file, setFile] = useState(null);
  const [role, setRole] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState({ role: false, file: false });

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
    accentDark: "#16a34a",
    err: "#ef4444",
    glow: dark ? "rgba(34,197,94,0.06)" : "rgba(34,197,94,0.07)",
  };

  const handlePredict = async () => {
    setTouched({ role: true, file: true });
    setError("");
    setResult(null);
    if (!file || !role.trim()) {
      setError(!role.trim() ? "Role is required." : "Please upload your CV.");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("role", role.trim());
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/predict/predict-role",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setResult(res.data);
    } catch (err) {
      setError(
        err?.response?.data?.error || "Prediction failed. Please try again.",
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
        @keyframes pulse-glow { 0%,100% { opacity:.4; } 50% { opacity:.9; } }
        .predict-card { animation: fadeUp 0.5s ease both; }
        .result-card { animation: fadeUp 0.55s ease both; }
        .pr-input:focus { border-color: #22c55e !important; outline: none; }
        .pr-btn:hover:not(:disabled) { opacity: .88; transform: translateY(-1px); }
        .pr-btn:active:not(:disabled) { transform: translateY(0); }
        .match-pill { display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; }

        /* FULL WIDTH + RESPONSIVE LAYOUT */
        .page-wrapper {
          width: 100%;
          padding: 56px 24px 80px;
          position: relative;
          z-index: 1;
          box-sizing: border-box;
        }
        .result-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        /* Mobile adjustments */
        @media (max-width: 700px) {
          .page-wrapper {
            padding: 40px 16px 60px;
          }
          .result-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
        }
        @media (min-width: 1400px) {
          .page-wrapper {
            padding: 56px 80px 80px;
          }
        }
      `}</style>

      {/* decorative radial */}
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
        {/* page header - now centered text but container is full width */}
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
            Role
            <br />
            <em style={{ fontStyle: "italic", color: T.accent }}>Validator</em>
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
            Upload your CV and enter the role you're targeting. Our model will
            predict your best-fit role and show how closely it matches.
          </p>
        </div>

        {/* form card – now spans full width */}
        <div
          className="predict-card"
          style={{
            background: T.card,
            border: `1px solid ${T.cardBdr}`,
            borderRadius: 20,
            padding: "36px 32px",
            boxShadow: dark
              ? "0 32px 80px rgba(0,0,0,0.5)"
              : "0 8px 40px rgba(0,0,0,0.07)",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          {/* step indicators – responsive layout */}
          <div
            style={{
              display: "flex",
              gap: 10,
              marginBottom: 28,
              flexWrap: "wrap",
            }}
          >
            {[
              { n: "01", l: "Target Role" },
              { n: "02", l: "Upload CV" },
              { n: "03", l: "Get Report" },
            ].map((s, i) => (
              <div
                key={i}
                style={{
                  flex: "1 1 120px",
                  background: dark
                    ? "rgba(255,255,255,0.04)"
                    : "rgba(0,0,0,0.03)",
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
                <div style={{ fontSize: 11, color: T.fg2, fontWeight: 500 }}>
                  {s.l}
                </div>
              </div>
            ))}
          </div>

          {/* role input - full width */}
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
              className="pr-input"
              type="text"
              placeholder="e.g. Data Scientist, Software Engineer, ML Engineer"
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
                ⚠ This field is required.
              </p>
            )}
          </div>

          {/* file upload - full width */}
          <div style={{ marginBottom: 24 }}>
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
              Your CV / Resume <span style={{ color: T.err }}>*</span>
            </label>
            <FileDropZone file={file} setFile={setFile} dark={dark} />
            {touched.file && !file && (
              <p style={{ fontSize: 11, color: T.err, marginTop: 6 }}>
                ⚠ Please upload your CV.
              </p>
            )}
          </div>

          {/* error */}
          {error && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: dark ? "rgba(239,68,68,0.1)" : "#fef2f2",
                border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: 10,
                padding: "12px 14px",
                marginBottom: 20,
              }}
            >
              <span style={{ fontSize: 16 }}>⚠</span>
              <p style={{ fontSize: 13, color: T.err, fontWeight: 500 }}>
                {error}
              </p>
            </div>
          )}

          {/* submit */}
          <button
            className="pr-btn"
            onClick={handlePredict}
            disabled={loading}
            style={{
              width: "100%",
              background: dark ? "#fff" : "#111",
              color: dark ? "#111" : "#fff",
              border: "none",
              borderRadius: 10,
              padding: "14px",
              fontSize: 13,
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all .2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              letterSpacing: "0.06em",
              opacity: loading ? 0.7 : 1,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {loading ? (
              <>
                <span
                  style={{
                    width: 16,
                    height: 16,
                    border: `2px solid ${
                      dark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.2)"
                    }`,
                    borderTopColor: dark ? "#000" : "#fff",
                    borderRadius: "50%",
                    animation: "spin 0.7s linear infinite",
                    display: "inline-block",
                  }}
                />
                Analyzing your profile…
              </>
            ) : (
              "Predict My Role →"
            )}
          </button>
        </div>

        {/* RESULT - full width */}
        {result && (
          <div
            className="result-card"
            style={{
              marginTop: 32,
              background: T.card,
              border: `1px solid ${T.cardBdr}`,
              borderRadius: 20,
              overflow: "hidden",
              boxShadow: dark
                ? "0 32px 80px rgba(0,0,0,0.5)"
                : "0 8px 40px rgba(0,0,0,0.07)",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            {/* header strip - full width responsive */}
            <div
              style={{
                background: dark
                  ? "linear-gradient(135deg, #0d4d2e 0%, #071a10 100%)"
                  : "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
                padding: "24px 32px",
                borderBottom: `1px solid ${T.cardBdr}`,
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
                    fontSize: 9,
                    letterSpacing: "0.18em",
                    color: dark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
                    textTransform: "uppercase",
                    marginBottom: 6,
                    fontWeight: 600,
                  }}
                >
                  Prediction Report
                </p>
                <h2
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 28,
                    fontWeight: 700,
                    color: dark ? "#fff" : "#0f172a",
                    lineHeight: 1.1,
                  }}
                >
                  {result.predictedRole}
                </h2>
                <p
                  style={{
                    fontSize: 12,
                    color: dark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.45)",
                    marginTop: 4,
                  }}
                >
                  Predicted best-fit role from your CV
                </p>
              </div>
              <ConfidenceRing
                value={result.confidence ?? 0}
                match={result.match}
              />
            </div>

            {/* body */}
            <div
              style={{
                padding: "28px 32px",
                display: "flex",
                flexDirection: "column",
                gap: 20,
              }}
            >
              {/* match badge */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <span
                  className="match-pill"
                  style={{
                    background: result.match
                      ? dark
                        ? "rgba(34,197,94,0.15)"
                        : "#dcfce7"
                      : dark
                        ? "rgba(239,68,68,0.15)"
                        : "#fef2f2",
                    color: result.match ? "#22c55e" : "#ef4444",
                    border: `1px solid ${
                      result.match
                        ? "rgba(34,197,94,0.3)"
                        : "rgba(239,68,68,0.3)"
                    }`,
                  }}
                >
                  <span>{result.match ? "✓" : "✗"}</span>
                  {result.match ? "Role Confirmed" : "Role Mismatch"}
                </span>
                <p style={{ fontSize: 12, color: T.fg2, flex: 1 }}>
                  {result.match
                    ? "Your CV aligns with the role you selected."
                    : `Our model predicted a different role than "${result.selectedRole}".`}
                </p>
              </div>

              {/* comparison row – side by side on wider, stack on mobile */}
              <div className="result-grid">
                {[
                  {
                    label: "Selected by you",
                    value: result.selectedRole,
                    icon: "◎",
                  },
                  {
                    label: "Predicted by AI",
                    value: result.predictedRole,
                    icon: "◈",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      background: dark
                        ? "rgba(255,255,255,0.03)"
                        : "rgba(0,0,0,0.025)",
                      border: `1px solid ${T.cardBdr}`,
                      borderRadius: 12,
                      padding: "20px 18px",
                    }}
                  >
                    <p
                      style={{
                        fontSize: 9,
                        letterSpacing: "0.14em",
                        color: T.fg3,
                        textTransform: "uppercase",
                        marginBottom: 6,
                        fontWeight: 600,
                      }}
                    >
                      {item.icon} &nbsp;{item.label}
                    </p>
                    <p
                      style={{
                        fontSize: 16,
                        fontWeight: 600,
                        color: T.fg,
                        lineHeight: 1.3,
                      }}
                    >
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* confidence bar - full width */}
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      color: T.fg2,
                      fontWeight: 500,
                    }}
                  >
                    Match Confidence
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: result.match ? T.accent : T.err,
                    }}
                  >
                    {result.confidence}%
                  </span>
                </div>
                <div
                  style={{
                    height: 6,
                    background: dark
                      ? "rgba(255,255,255,0.06)"
                      : "rgba(0,0,0,0.06)",
                    borderRadius: 3,
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${result.confidence}%`,
                      borderRadius: 3,
                      background: result.match
                        ? T.accent
                        : result.confidence >= 60
                          ? "#f59e0b"
                          : T.err,
                      transition: "width 1s ease",
                    }}
                  />
                </div>
              </div>

              {/* meta row - responsive wrap */}
              <div
                style={{
                  display: "flex",
                  gap: 16,
                  paddingTop: 16,
                  borderTop: `1px solid ${T.cardBdr}`,
                  flexWrap: "wrap",
                }}
              >
                {[
                  { label: "File", value: result.fileName },
                  {
                    label: "Saved at",
                    value: new Date(result.createdAt).toLocaleString(),
                  },
                ].map((m, i) => (
                  <div key={i}>
                    <p
                      style={{
                        fontSize: 9,
                        letterSpacing: "0.1em",
                        color: T.fg3,
                        textTransform: "uppercase",
                        marginBottom: 3,
                        fontWeight: 600,
                      }}
                    >
                      {m.label}
                    </p>
                    <p style={{ fontSize: 12, color: T.fg2 }}>{m.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
