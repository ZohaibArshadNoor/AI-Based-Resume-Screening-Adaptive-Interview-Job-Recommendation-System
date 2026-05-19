// src/pages/LoginPage.jsx

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

/* ─── Password-strength helper ─── */
function getStrength(pwd) {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return score; // 0-4
}
const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
const strengthColor = ["", "#ef4444", "#f59e0b", "#3b82f6", "#22c55e"];

/* ─── Email validator ─── */
const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

export default function Login() {
  const navigate = useNavigate();

  // Dark mode sync with html class
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains("dark"),
  );

  useEffect(() => {
    const obs = new MutationObserver(() => {
      setDark(document.documentElement.classList.contains("dark"));
    });
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => obs.disconnect();
  }, []);

  // Inject/remove light theme overrides based on dark
  useEffect(() => {
    const styleId = "login-light-theme-overrides";
    let existing = document.getElementById(styleId);
    if (!dark) {
      if (!existing) {
        const style = document.createElement("style");
        style.id = styleId;
        style.textContent = `
          /* Light theme overrides for LoginPage (only when dark=false) */
          .login-root {
            background: #f5f5f5 !important;
          }
          .login-root .login-card {
            border-color: rgba(0,0,0,0.1) !important;
            box-shadow: 0 40px 100px rgba(0,0,0,0.1) !important;
          }
          .login-root .login-left {
            background: linear-gradient(145deg, #e8f5e9 0%, #c8e6c9 40%, #a5d6a7 100%) !important;
          }
          .login-root .login-left * {
            color: #1a2e1a !important;
          }
          .login-root .login-left .left-badge,
          .login-root .login-left .step,
          .login-root .login-left .step-active {
            background: rgba(0,0,0,0.05) !important;
            border-color: rgba(0,0,0,0.1) !important;
            color: #1a2e1a !important;
          }
          .login-root .login-left .step-num {
            background: rgba(0,0,0,0.1) !important;
            border-color: rgba(0,0,0,0.15) !important;
            color: #1a2e1a !important;
          }
          .login-root .login-left .step-num-active {
            background: #fff !important;
            color: #0a3320 !important;
          }
          .login-root .login-left .stat-divider {
            background: rgba(0,0,0,0.1) !important;
          }
          .login-root .login-right {
            background: #ffffff !important;
          }
          .login-root .login-right input,
          .login-root .login-right button,
          .login-root .login-right .oauth-btn,
          .login-root .login-right .submit-btn {
            background: #f0f0f0 !important;
            border-color: #ddd !important;
            color: #111 !important;
          }
          .login-root .login-right input:focus {
            border-color: #22c55e !important;
          }
          .login-root .login-right .oauth-btn:hover {
            background: #e0e0e0 !important;
          }
          .login-root .login-right .submit-btn {
            background: #000 !important;
            color: #fff !important;
          }
          .login-root .login-right .submit-btn:disabled {
            opacity: 0.6 !important;
          }
          .login-root .login-right a {
            color: #000 !important;
          }
          .login-root .login-right h2 {
            color: #111 !important;
          }

          /* FIX: password strength bars – set parent background, do NOT override individual bar colors */
          .login-root .login-right .strength-bars {
            background: #e0e0e0 !important;
            border-radius: 2px;
          }
          .login-root .login-right .or-line {
            background: #ccc !important;
          }
          .login-root .login-right .or-text,
          .login-root .login-right .sub-heading,
          .login-root .login-right .login-link {
            color: #666 !important;
          }
        `;
        document.head.appendChild(style);
      }
    } else {
      if (existing) existing.remove();
    }
    return () => {
      const el = document.getElementById(styleId);
      if (el) el.remove();
    };
  }, [dark]);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });

  const pwdStrength = getStrength(formData.password);
  const emailValid = isValidEmail(formData.email);

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const blurHandler = (e) => {
    setTouched({ ...touched, [e.target.name]: true });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!emailValid || !formData.password) return;

    try {
      setLoading(true);
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData,
      );
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.root} className="login-root">
      <Navbar />

      {/* Ambient blobs */}
      <div style={s.blob1} />
      <div style={s.blob2} />
      <div style={s.noise} />

      <div style={s.outerWrap}>
        <div style={s.card} className="login-card">
          {/* LEFT panel – green gradient */}
          <div style={s.left} className="login-left">
            <div style={s.leftContent}>
              <div style={s.leftBadge} className="left-badge">
                <span style={s.badgeDot} />
                AI-POWERED CAREER SUITE
              </div>

              <h2 style={s.leftHeading}>
                Welcome
                <br />
                Back
              </h2>

              <p style={s.leftSub}>
                Sign in to continue
                <br />
                your career journey.
              </p>

              {/* Info tiles */}
              <div style={s.steps}>
                {[
                  { n: "◈", label: "Analyze\nyour CV" },
                  { n: "◉", label: "Practice\nInterviews" },
                  { n: "◎", label: "Find\nOpportunities" },
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{ ...s.step, ...(i === 0 ? s.stepActive : {}) }}
                    className={i === 0 ? "step-active" : "step"}
                  >
                    <div
                      style={{
                        ...s.stepNum,
                        ...(i === 0 ? s.stepNumActive : {}),
                      }}
                      className={i === 0 ? "step-num-active" : "step-num"}
                    >
                      {item.n}
                    </div>
                    <p style={s.stepLabel}>{item.label}</p>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div style={s.statsRow}>
                <div style={s.statItem}>
                  <span style={s.statNum}>95%</span>
                  <span style={s.statDesc}>Accuracy</span>
                </div>
                <div style={s.statDivider} className="stat-divider" />
                <div style={s.statItem}>
                  <span style={s.statNum}>5 min</span>
                  <span style={s.statDesc}>Full Analysis</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT panel – form */}
          <div style={s.right} className="login-right">
            <div style={s.formInner} className="login-form-inner">
              <h2 style={s.heading}>Sign In</h2>
              <p style={s.subHeading} className="sub-heading">
                Enter your credentials to access your account.
              </p>

              {/* OAuth buttons */}
              <div style={s.oauthRow}>
                <button style={s.oauthBtn} className="oauth-btn">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    style={{ marginRight: 8 }}
                  >
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Google
                </button>
                <button style={s.oauthBtn} className="oauth-btn">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    style={{ marginRight: 8 }}
                  >
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                  </svg>
                  Github
                </button>
              </div>

              <div style={s.orRow}>
                <span style={s.orLine} className="or-line" />
                <span style={s.orText} className="or-text">
                  Or
                </span>
                <span style={s.orLine} className="or-line" />
              </div>

              <form onSubmit={submitHandler} noValidate style={s.form}>
                {/* Email */}
                <div style={s.fieldWrap}>
                  <label style={s.label}>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={changeHandler}
                    onBlur={blurHandler}
                    placeholder="eg. hello@email.com"
                    required
                    style={{
                      ...s.input,
                      borderColor: touched.email
                        ? emailValid
                          ? "rgba(34,197,94,0.5)"
                          : "#ef4444"
                        : "rgba(255,255,255,0.1)",
                    }}
                  />
                  {touched.email && !emailValid && (
                    <p style={s.err}>Enter a valid email address.</p>
                  )}
                </div>

                {/* Password */}
                <div style={s.fieldWrap}>
                  <label style={s.label}>Password</label>
                  <div style={s.pwdWrap}>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={changeHandler}
                      onBlur={blurHandler}
                      placeholder="Enter your password"
                      required
                      style={{
                        ...s.input,
                        paddingRight: 44,
                        borderColor:
                          touched.password && !formData.password
                            ? "#ef4444"
                            : "rgba(255,255,255,0.1)",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={s.eyeBtn}
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>

                  {/* Strength bars */}
                  {formData.password && (
                    <div style={s.strengthWrap}>
                      <div style={s.strengthBars}>
                        {[1, 2, 3, 4].map((n) => (
                          <div
                            key={n}
                            style={{
                              ...s.strengthBar,
                              backgroundColor:
                                pwdStrength >= n
                                  ? strengthColor[pwdStrength]
                                  : "rgba(255,255,255,0.08)",
                            }}
                          />
                        ))}
                      </div>
                      <span
                        style={{
                          color: strengthColor[pwdStrength],
                          fontSize: 11,
                        }}
                      >
                        {strengthLabel[pwdStrength]}
                      </span>
                    </div>
                  )}
                  {touched.password && !formData.password && (
                    <p style={s.err}>Password is required.</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={s.submitBtn}
                  className="submit-btn"
                >
                  {loading ? <span style={s.spinner} /> : "Login"}
                </button>
              </form>

              <p style={s.loginLink} className="login-link">
                Don't have an account?{" "}
                <Link to="/register" style={s.loginLinkA}>
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@300;400;500&display=swap');
        *,*::before,*::after { box-sizing:border-box; margin:0; padding:0; }
        body { background:#0a0a0a; }
        input:-webkit-autofill {
          -webkit-box-shadow:0 0 0 50px #161616 inset;
          -webkit-text-fill-color:#fff;
        }
        @keyframes spin { to { transform:rotate(360deg); } }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @media (max-width:860px) {
          .login-left { display:none !important; }
          .login-card { grid-template-columns:1fr !important; }
        }
        @media (max-width:480px) {
          .login-form-inner { padding:32px 20px !important; }
        }
      `}</style>
    </div>
  );
}

/* ─── Styles (unchanged) ─── */
const s = {
  root: {
    minHeight: "100vh",
    background: "#0a0a0a",
    fontFamily: "'DM Sans', sans-serif",
    color: "#fff",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  blob1: {
    position: "fixed",
    width: 500,
    height: 500,
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(16,120,70,0.35) 0%, transparent 70%)",
    top: -100,
    left: -100,
    zIndex: 0,
    pointerEvents: "none",
    filter: "blur(40px)",
  },
  blob2: {
    position: "fixed",
    width: 400,
    height: 400,
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(16,120,70,0.2) 0%, transparent 70%)",
    bottom: -80,
    right: -80,
    zIndex: 0,
    pointerEvents: "none",
    filter: "blur(50px)",
  },
  noise: {
    position: "fixed",
    inset: 0,
    zIndex: 1,
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")",
    pointerEvents: "none",
  },
  outerWrap: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 20px",
    position: "relative",
    zIndex: 2,
  },
  card: {
    display: "grid",
    gridTemplateColumns: "420px 1fr",
    width: "100%",
    maxWidth: 900,
    borderRadius: 20,
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.07)",
    boxShadow: "0 40px 100px rgba(0,0,0,0.6)",
    animation: "fadeUp 0.6s ease both",
  },
  left: {
    background:
      "linear-gradient(145deg, #0d4d2e 0%, #0a3320 40%, #071a10 100%)",
    padding: "48px 40px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    position: "relative",
    overflow: "hidden",
  },
  leftContent: { display: "flex", flexDirection: "column", gap: 24 },
  leftBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 20,
    padding: "5px 12px",
    fontSize: 9,
    letterSpacing: "0.12em",
    color: "rgba(255,255,255,0.5)",
    fontWeight: 500,
    width: "fit-content",
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#22c55e",
    display: "inline-block",
    boxShadow: "0 0 6px #22c55e",
  },
  leftHeading: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 44,
    fontWeight: 700,
    lineHeight: 1.08,
  },
  leftSub: {
    fontSize: 13,
    color: "rgba(255,255,255,0.45)",
    lineHeight: 1.6,
    fontWeight: 300,
  },
  steps: { display: "flex", gap: 12, marginTop: 8 },
  step: {
    flex: 1,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 12,
    padding: "14px 12px",
  },
  stepActive: {
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.15)",
  },
  stepNum: {
    width: 28,
    height: 28,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.15)",
    border: "1px solid rgba(255,255,255,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 10,
  },
  stepNumActive: { background: "#fff", color: "#071a10", border: "none" },
  stepLabel: {
    fontSize: 11,
    color: "rgba(255,255,255,0.55)",
    lineHeight: 1.4,
    whiteSpace: "pre-line",
  },
  statsRow: {
    display: "flex",
    alignItems: "center",
    gap: 20,
    padding: "20px 0 0",
    borderTop: "1px solid rgba(255,255,255,0.08)",
    marginTop: 8,
  },
  statItem: { display: "flex", flexDirection: "column", gap: 2 },
  statNum: {
    fontSize: 26,
    fontWeight: 700,
    fontFamily: "'Cormorant Garamond', serif",
    color: "#fff",
  },
  statDesc: {
    fontSize: 10,
    color: "rgba(255,255,255,0.35)",
    letterSpacing: "0.05em",
  },
  statDivider: { width: 1, height: 36, background: "rgba(255,255,255,0.1)" },
  right: {
    background: "#111",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  formInner: { padding: "52px 44px", width: "100%", maxWidth: 440 },
  heading: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 30,
    fontWeight: 700,
    marginBottom: 6,
  },
  subHeading: {
    fontSize: 12,
    color: "rgba(255,255,255,0.35)",
    marginBottom: 28,
    fontWeight: 300,
  },
  oauthRow: { display: "flex", gap: 12, marginBottom: 20 },
  oauthBtn: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 8,
    padding: "10px 16px",
    color: "#fff",
    fontSize: 13,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    transition: "background 0.2s",
  },
  orRow: { display: "flex", alignItems: "center", gap: 12, marginBottom: 20 },
  orLine: { flex: 1, height: 1, background: "rgba(255,255,255,0.08)" },
  orText: { fontSize: 12, color: "rgba(255,255,255,0.3)" },
  form: { display: "flex", flexDirection: "column", gap: 16 },
  fieldWrap: { display: "flex", flexDirection: "column", gap: 6 },
  label: {
    fontSize: 10,
    letterSpacing: "0.1em",
    color: "rgba(255,255,255,0.4)",
    textTransform: "uppercase",
    fontWeight: 500,
  },
  input: {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 8,
    padding: "11px 14px",
    color: "#fff",
    fontSize: 13,
    outline: "none",
    transition: "border-color 0.2s",
    fontFamily: "'DM Sans', sans-serif",
  },
  pwdWrap: { position: "relative" },
  eyeBtn: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "rgba(255,255,255,0.3)",
    display: "flex",
    alignItems: "center",
    padding: 0,
  },
  strengthWrap: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginTop: 6,
  },
  strengthBars: { display: "flex", gap: 4, flex: 1 },
  strengthBar: {
    height: 3,
    flex: 1,
    borderRadius: 2,
    transition: "background-color 0.3s",
  },
  err: { fontSize: 10, color: "#ef4444", marginTop: 2 },
  submitBtn: {
    marginTop: 8,
    background: "#fff",
    color: "#000",
    border: "none",
    borderRadius: 8,
    padding: "13px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    transition: "opacity 0.2s",
    letterSpacing: "0.04em",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'DM Sans', sans-serif",
  },
  spinner: {
    width: 16,
    height: 16,
    border: "2px solid rgba(0,0,0,0.2)",
    borderTop: "2px solid #000",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
    display: "inline-block",
  },
  loginLink: {
    marginTop: 20,
    fontSize: 12,
    color: "rgba(255,255,255,0.35)",
    textAlign: "center",
  },
  loginLinkA: { color: "#fff", fontWeight: 600, textDecoration: "none" },
};
