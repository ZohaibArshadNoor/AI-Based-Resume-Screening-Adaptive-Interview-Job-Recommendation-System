# Navbar code:
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(() => {
    return localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navLinks = token
    ? [
        { to: "/", label: "Home" },
        { to: "/dashboard", label: "Dashboard" },
        { to: "/predict-role", label: "Validate" },
        { to: "/prediction-history", label: "History" },
        { to: "/interview-agent", label: "Interview Agent" },
      ]
    : [{ to: "/", label: "Home" }];

  return (
    <>
      <style>{`
        .navbar {
          width: 100%;
          border-bottom: 1px solid var(--nav-border);
          background: var(--nav-bg);
          position: sticky;
          top: 0;
          z-index: 50;
          backdrop-filter: blur(8px);
        }
        :root {
          --nav-bg: rgba(255,255,255,0.92);
          --nav-border: #e5e5e5;
          --nav-text: #111;
          --nav-muted: #666;
          --nav-hover-bg: #f4f4f4;
          --nav-btn-border: #222;
          --nav-btn-hover-bg: #111;
          --nav-btn-hover-text: #fff;
          --nav-mobile-bg: #fff;
          --nav-toggle-text: #111;
        }
        .dark {
          --nav-bg: rgba(10,10,10,0.92);
          --nav-border: #222;
          --nav-text: #eee;
          --nav-muted: #999;
          --nav-hover-bg: #1a1a1a;
          --nav-btn-border: #ccc;
          --nav-btn-hover-bg: #eee;
          --nav-btn-hover-text: #111;
          --nav-mobile-bg: #0a0a0a;
          --nav-toggle-text: #eee;
        }
        .nav-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }
        .nav-brand {
          font-size: 1rem;
          font-weight: 600;
          letter-spacing: -0.02em;
          color: var(--nav-text);
          text-decoration: none;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .nav-links {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          flex: 1;
          padding: 0 1rem;
        }
        .nav-link {
          font-size: 0.875rem;
          color: var(--nav-muted);
          text-decoration: none;
          padding: 0.375rem 0.625rem;
          border-radius: 6px;
          transition: color 0.15s, background 0.15s;
          white-space: nowrap;
        }
        .nav-link:hover {
          color: var(--nav-text);
          background: var(--nav-hover-bg);
        }
        .nav-right {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-shrink: 0;
        }
        .theme-toggle {
          width: 36px;
          height: 36px;
          border: 1px solid var(--nav-border);
          background: transparent;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--nav-text);
          font-size: 0.875rem;
          transition: background 0.15s;
        }
        .theme-toggle:hover { background: var(--nav-hover-bg); }
        .nav-btn {
          font-size: 0.8125rem;
          font-weight: 500;
          padding: 0.375rem 0.875rem;
          border-radius: 7px;
          cursor: pointer;
          transition: all 0.15s;
          white-space: nowrap;
        }
        .nav-btn-ghost {
          border: 1px solid var(--nav-border);
          background: transparent;
          color: var(--nav-text);
        }
        .nav-btn-ghost:hover { background: var(--nav-hover-bg); }
        .nav-btn-solid {
          border: 1px solid var(--nav-btn-border);
          background: var(--nav-btn-border);
          color: var(--nav-btn-hover-text);
        }
        .nav-btn-solid:hover {
          background: var(--nav-btn-hover-bg);
          border-color: var(--nav-btn-hover-bg);
          color: var(--nav-btn-hover-text);
        }
        .hamburger {
          display: none;
          width: 36px;
          height: 36px;
          border: 1px solid var(--nav-border);
          background: transparent;
          border-radius: 8px;
          cursor: pointer;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 4px;
          padding: 8px;
        }
        .hamburger span {
          display: block;
          width: 16px;
          height: 1.5px;
          background: var(--nav-text);
          transition: all 0.2s;
        }
        .hamburger.open span:nth-child(1) { transform: translateY(5.5px) rotate(45deg); }
        .hamburger.open span:nth-child(2) { opacity: 0; }
        .hamburger.open span:nth-child(3) { transform: translateY(-5.5px) rotate(-45deg); }
        .mobile-menu {
          display: none;
          background: var(--nav-mobile-bg);
          border-top: 1px solid var(--nav-border);
          padding: 0.75rem 1.5rem 1rem;
          flex-direction: column;
          gap: 0.125rem;
        }
        .mobile-menu.open { display: flex; }
        .mobile-link {
          font-size: 0.9375rem;
          color: var(--nav-muted);
          text-decoration: none;
          padding: 0.625rem 0.25rem;
          border-bottom: 1px solid var(--nav-border);
          transition: color 0.15s;
        }
        .mobile-link:hover { color: var(--nav-text); }
        .mobile-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.75rem;
        }
        .mobile-actions button { flex: 1; }
        @media (max-width: 768px) {
          .nav-links { display: none; }
          .hamburger { display: flex; }
          .desktop-auth { display: none; }
        }
      `}</style>

      <nav className="navbar">
        <div className="nav-inner">
          <Link to="/" className="nav-brand">AI Resume</Link>

          <div className="nav-links">
            {navLinks.map((l) => (
              <Link key={l.to} to={l.to} className="nav-link">{l.label}</Link>
            ))}
          </div>

          <div className="nav-right">
            <button
              className="theme-toggle"
              onClick={() => setDark((d) => !d)}
              aria-label="Toggle theme"
            >
              {dark ? "☀" : "☾"}
            </button>

            <div className="desktop-auth nav-right">
              {token ? (
                <button className="nav-btn nav-btn-ghost" onClick={logoutHandler}>Logout</button>
              ) : (
                <>
                  <button className="nav-btn nav-btn-ghost" onClick={() => navigate("/login")}>Login</button>
                  <button className="nav-btn nav-btn-solid" onClick={() => navigate("/register")}>Register</button>
                </>
              )}
            </div>

            <button
              className={`hamburger ${menuOpen ? "open" : ""}`}
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>

        <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} className="mobile-link" onClick={() => setMenuOpen(false)}>
              {l.label}
            </Link>
          ))}
          <div className="mobile-actions">
            {token ? (
              <button className="nav-btn nav-btn-ghost" onClick={logoutHandler}>Logout</button>
            ) : (
              <>
                <button className="nav-btn nav-btn-ghost" onClick={() => { navigate("/login"); setMenuOpen(false); }}>Login</button>
                <button className="nav-btn nav-btn-solid" onClick={() => { navigate("/register"); setMenuOpen(false); }}>Register</button>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

# Landing page code:
// src/pages/LandingPage.jsx
// npm install gsap

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function LandingPage() {
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  // Sync with Navbar's theme toggle
  useEffect(() => {
    const obs = new MutationObserver(() => {
      setDark(document.documentElement.classList.contains("dark"));
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  /* ── GSAP ── */
  useEffect(() => {
    const load = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      gsap.fromTo(
        ".land-hero-inner > *",
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, stagger: 0.11, duration: 0.85, ease: "power3.out", delay: 0.25 }
      );

      gsap.utils.toArray(".reveal").forEach((el) => {
        gsap.fromTo(el, { opacity: 0, y: 24 }, {
          opacity: 1, y: 0, duration: 0.72, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 86%" },
        });
      });

      gsap.utils.toArray(".reveal-card").forEach((el, i) => {
        gsap.fromTo(el, { opacity: 0, y: 32 }, {
          opacity: 1, y: 0, duration: 0.6, ease: "power2.out",
          delay: (i % 5) * 0.07,
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });
    };
    load();
  }, []);

  /* ── Theme vars ── */
  const T = {
    bg:    dark ? "#0d0d0d" : "#f8f7f4",
    bg2:   dark ? "#141414" : "#efefec",
    fg:    dark ? "#ededed" : "#111111",
    fg2:   dark ? "#888888" : "#555555",
    fg3:   dark ? "#555555" : "#aaaaaa",
    bdr:   dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)",
    card:  dark ? "#181818" : "#ffffff",
    cBdr:  dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)",
    darkStrip: dark ? "#0a0a0a" : "#111111",
  };

  const features = [
    { n: "01", t: "Role Prediction",    b: "Trained on 13K+ CVs across 42 job categories. Our model maps your resume to the best-fit role with a confidence score." },
    { n: "02", t: "AI Interview Coach", b: "Simulate a real interview based on your job description. Get instant feedback, strengths, weaknesses, and a growth roadmap." },
    { n: "03", t: "Live Job Scraper",   b: "Our agent surfaces live listings matched to your profile — company name, required skills, and a one-click apply link." },
  ];

  const steps = [
    "Upload your CV (PDF or paste text)",
    "Enter the target job description",
    "Receive role prediction + confidence score",
    "Complete the AI mock interview session",
    "Browse live job listings matched to you",
  ];

  const metrics = [
    { n: "13K+", d: "CV Entries" },
    { n: "42",   d: "Job Categories" },
    { n: "95%",  d: "Accuracy" },
    { n: "5 min",d: "Full Analysis" },
  ];

  const team = [
    { init: "KM", name: "Keyan Majid",    role: "Lead" },
    { init: "ZH", name: "Zohaib",         role: "ML" },
    { init: "AR", name: "Arshad",         role: "Backend" },
    { init: "NO", name: "Noor",           role: "Data" },
    { init: "IY", name: "Ibrahim Yousef", role: "Frontend" },
  ];

  const cell = (bdr, last) => last ? {} : { borderRight: `1px solid ${bdr}` };

  return (
    <div style={{ background: T.bg, color: T.fg, fontFamily: "'DM Sans',sans-serif", minHeight: "100vh", transition: "background .3s,color .3s" }}>

      <Navbar />

      {/* ══════════ HERO ══════════ */}
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", borderBottom: `1px solid ${T.bdr}`, overflow: "hidden" }}>

        {/* Decorative grid lines */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
          <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 1, background: T.bdr }} />
          <div style={{ position: "absolute", top: 0, bottom: 0, left: "50%", width: 1, background: T.bdr }} />
        </div>

        {/* Subtle radial glow */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", background: dark ? "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(34,197,94,0.06) 0%, transparent 70%)" : "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(34,197,94,0.07) 0%, transparent 70%)" }} />

        <div className="land-hero-inner" style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "0 24px", maxWidth: 800, width: "100%" }}>
          <p style={{ fontSize: 11, letterSpacing: "0.22em", color: T.fg3, marginBottom: 32, textTransform: "uppercase", fontWeight: 500 }}>
            ✦ &nbsp; AI Career Intelligence &nbsp; ✦
          </p>

          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(60px,10vw,120px)", fontWeight: 700, lineHeight: 0.9, letterSpacing: "-0.03em", marginBottom: 36, color: T.fg }}>
            CAREER<br />
            <em style={{ fontStyle: "italic", color: "#22c55e" }}>LENS</em>
          </h1>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 32, flexWrap: "wrap" }}>
            <div style={{ height: 1, width: 56, background: T.fg3 }} />
            <p style={{ fontSize: 11, letterSpacing: "0.16em", color: T.fg2, textTransform: "uppercase" }}>
              ANALYZE &nbsp;|&nbsp; PREDICT &nbsp;|&nbsp; APPLY
            </p>
            <div style={{ height: 1, width: 56, background: T.fg3 }} />
          </div>

          <p style={{ fontSize: 15, color: T.fg2, lineHeight: 1.8, fontWeight: 300, maxWidth: 480, margin: "0 auto 48px" }}>
            Upload your resume. Our AI decodes your ideal job role, coaches you through mock interviews, and finds live opportunities — in minutes.
          </p>

          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/register" style={{ background: T.fg, color: T.bg, padding: "13px 34px", borderRadius: 2, fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none" }}>
              Analyze My CV
            </Link>
            <Link to="/login" style={{ border: `1px solid ${T.bdr}`, color: T.fg, padding: "13px 34px", borderRadius: 2, fontSize: 12, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none" }}>
              Sign In →
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: "absolute", bottom: 36, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", color: T.fg3 }}>scroll</span>
          <div style={{ width: 1, height: 36, background: T.fg3 }} />
        </div>
      </section>

      {/* ══════════ 4-ICON PILLARS ══════════ */}
      <section style={{ borderBottom: `1px solid ${T.bdr}` }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div className="pillars-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)" }}>
            {[
              { icon: "◈", label: "Upload" },
              { icon: "◉", label: "Analyze" },
              { icon: "◐", label: "Interview" },
              { icon: "◎", label: "Apply" },
            ].map((p, i, arr) => (
              <div key={i} className="reveal-card" style={{ textAlign: "center", padding: "56px 20px", ...cell(T.bdr, i === arr.length - 1), display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
                <span style={{ fontSize: 30, color: T.fg, lineHeight: 1 }}>{p.icon}</span>
                <div style={{ width: 28, height: 1, background: T.bdr }} />
                <span style={{ fontSize: 10, letterSpacing: "0.18em", color: T.fg2, textTransform: "uppercase", fontWeight: 500 }}>{p.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ EDITORIAL TAGLINE ══════════ */}
      <section style={{ padding: "100px 40px", borderBottom: `1px solid ${T.bdr}`, background: T.bg, textAlign: "center" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <h2 className="reveal" style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(26px,3.5vw,42px)", fontWeight: 400, lineHeight: 1.3, marginBottom: 20, color: T.fg }}>
            We analyze career potential.
          </h2>
          <svg className="reveal" width="48" height="12" viewBox="0 0 48 12" fill="none" style={{ display: "block", margin: "0 auto 24px" }}>
            <path d="M0 6 Q12 0 24 6 Q36 12 48 6" stroke={T.fg3} strokeWidth="1" fill="none" />
          </svg>
          <p className="reveal" style={{ fontSize: 15, color: T.fg2, lineHeight: 1.85, fontWeight: 300, maxWidth: 500, margin: "0 auto" }}>
            Your experience, your ambition — it's worth pursuing the right path. CareerLens helps every candidate discover where they truly stand.
          </p>
        </div>
      </section>

      {/* ══════════ DARK FEATURES STRIP ══════════ */}
      <section style={{ background: T.darkStrip, color: "#f0f0f0", padding: "100px 40px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div className="features-grid" style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 80, alignItems: "start" }}>
            <div>
              <h2 className="reveal" style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(24px,2.8vw,36px)", fontWeight: 400, lineHeight: 1.25, marginBottom: 20, color: "#f0f0f0" }}>
                We build intelligent career experiences
              </h2>
              <p className="reveal" style={{ fontSize: 13, color: "rgba(255,255,255,0.38)", lineHeight: 1.8, marginBottom: 36, fontWeight: 300 }}>
                Trained on 13,000+ real CVs across 42 categories. Our models deliver clarity on where your profile fits best.
              </p>
              <Link to="/register" className="reveal" style={{ display: "inline-block", border: "1px solid rgba(255,255,255,0.22)", color: "#fff", padding: "10px 22px", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", textDecoration: "none", borderRadius: 2 }}>
                Get Started
              </Link>
            </div>
            <div>
              {features.map((f, i) => (
                <div key={i} className="reveal-card" style={{ display: "grid", gridTemplateColumns: "44px 1fr", gap: 24, padding: "32px 0", borderBottom: i < features.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none", alignItems: "start" }}>
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.22)", letterSpacing: "0.08em", paddingTop: 3 }}>{f.n}</span>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, color: "#f0f0f0" }}>{f.t}</h3>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.38)", lineHeight: 1.75, fontWeight: 300 }}>{f.b}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ METRICS ══════════ */}
      <section style={{ borderBottom: `1px solid ${T.bdr}`, background: T.bg }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div className="metrics-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)" }}>
            {metrics.map((m, i, arr) => (
              <div key={i} className="reveal-card" style={{ textAlign: "center", padding: "60px 16px", ...cell(T.bdr, i === arr.length - 1) }}>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(36px,4vw,54px)", fontWeight: 700, color: T.fg, marginBottom: 8, lineHeight: 1 }}>{m.n}</div>
                <div style={{ fontSize: 10, letterSpacing: "0.16em", color: T.fg3, textTransform: "uppercase" }}>{m.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ QUOTE ══════════ */}
      <section style={{ padding: "100px 40px", borderBottom: `1px solid ${T.bdr}`, background: T.bg, textAlign: "center" }}>
        <div style={{ maxWidth: 660, margin: "0 auto" }}>
          <p className="reveal" style={{ fontFamily: "'Playfair Display',serif", fontStyle: "italic", fontSize: "clamp(15px,2.2vw,20px)", color: T.fg2, lineHeight: 1.85, marginBottom: 28 }}>
            "Surround yourself with the dreamers and the doers, the believers and thinkers — most of all, those who see greatness within you, even when you don't see it yourself."
          </p>
          <span className="reveal" style={{ fontSize: 11, letterSpacing: "0.14em", color: T.fg3, textTransform: "uppercase" }}>— Edmund Lee</span>
          <div className="reveal" style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 28 }}>
            {[28, 10, 10].map((w, i) => (
              <div key={i} style={{ width: w, height: 3, background: i === 0 ? T.fg : T.bdr, borderRadius: 2 }} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ WORKFLOW / STEPS ══════════ */}
      <section style={{ padding: "100px 40px", borderBottom: `1px solid ${T.bdr}`, background: T.bg2 }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <p className="reveal" style={{ fontSize: 11, letterSpacing: "0.2em", color: T.fg3, textTransform: "uppercase", marginBottom: 56, textAlign: "center" }}>Workflow</p>
          {steps.map((step, i) => (
            <div key={i} className="reveal-card" style={{ display: "flex", alignItems: "center", gap: 28, padding: "22px 0", borderBottom: `1px solid ${T.bdr}` }}>
              <span style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(24px,3vw,32px)", fontWeight: 700, color: T.bdr, minWidth: 44, lineHeight: 1 }}>{String(i + 1).padStart(2, "0")}</span>
              <span style={{ fontSize: 15, color: T.fg, fontWeight: 400 }}>{step}</span>
              <span style={{ marginLeft: "auto", fontSize: 18, color: T.fg3, flexShrink: 0 }}>→</span>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════ TEAM ══════════ */}
      <section style={{ padding: "100px 40px", borderBottom: `1px solid ${T.bdr}`, background: T.bg }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <p className="reveal" style={{ textAlign: "center", fontSize: 11, letterSpacing: "0.2em", color: T.fg3, textTransform: "uppercase", marginBottom: 16 }}>The Team</p>
          <h2 className="reveal" style={{ fontFamily: "'Playfair Display',serif", textAlign: "center", fontSize: "clamp(26px,3vw,38px)", fontWeight: 400, marginBottom: 60, color: T.fg }}>
            Built by engineers
          </h2>
          <div className="team-grid" style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 20 }}>
            {team.map((m, i) => (
              <div key={i} className="reveal-card" style={{ textAlign: "center", padding: "32px 16px", border: `1px solid ${T.cBdr}`, background: T.card, borderRadius: 2 }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: T.bg2, border: `1px solid ${T.bdr}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: T.fg, margin: "0 auto 16px" }}>
                  {m.init}
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: T.fg, marginBottom: 4 }}>{m.name}</div>
                <div style={{ fontSize: 10, letterSpacing: "0.1em", color: T.fg3, textTransform: "uppercase" }}>{m.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ CTA ══════════ */}
      <section style={{ padding: "100px 40px", background: T.bg, textAlign: "center" }}>
        <p className="reveal" style={{ fontSize: 11, letterSpacing: "0.2em", color: T.fg3, textTransform: "uppercase", marginBottom: 20 }}>Ready to begin?</p>
        <h2 className="reveal" style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(36px,6vw,72px)", fontWeight: 700, lineHeight: 0.92, letterSpacing: "-0.025em", marginBottom: 44, color: T.fg }}>
          Decode your<br />career today.
        </h2>
        <Link to="/register" className="reveal" style={{ display: "inline-block", background: T.fg, color: T.bg, padding: "14px 40px", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none", borderRadius: 2 }}>
          Start For Free
        </Link>
      </section>

      {/* ══════════ FOOTER ══════════ */}
      <footer style={{ borderTop: `1px solid ${T.bdr}`, padding: "28px 40px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: T.fg }}>CareerLens</span>
          <p style={{ fontSize: 11, color: T.fg3, letterSpacing: "0.05em" }}>© 2025 CareerLens · Team CareerLens</p>
          <div style={{ display: "flex", gap: 24 }}>
            {["Privacy", "Terms", "Contact"].map((l) => (
              <a key={l} href="#" style={{ fontSize: 11, color: T.fg3, textDecoration: "none", letterSpacing: "0.05em" }}>{l}</a>
            ))}
          </div>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        *,*::before,*::after { box-sizing:border-box; margin:0; padding:0; }
        html { scroll-behavior:smooth; }
        body { overflow-x:hidden; }
        a { text-decoration:none; }
        .reveal,.reveal-card { opacity:0; }

        /* Responsive: pillars */
        @media (max-width:700px) {
          .pillars-grid { grid-template-columns:repeat(2,1fr) !important; }
          .pillars-grid > div { border-right:none !important; border-bottom:1px solid rgba(0,0,0,0.08); }
        }

        /* Responsive: features strip */
        @media (max-width:900px) {
          .features-grid { grid-template-columns:1fr !important; gap:48px !important; }
        }

        /* Responsive: metrics */
        @media (max-width:700px) {
          .metrics-grid { grid-template-columns:repeat(2,1fr) !important; }
          .metrics-grid > div { border-right:none !important; border-bottom:1px solid rgba(0,0,0,0.08); }
        }

        /* Responsive: team */
        @media (max-width:860px) {
          .team-grid { grid-template-columns:repeat(3,1fr) !important; }
        }
        @media (max-width:560px) {
          .team-grid { grid-template-columns:repeat(2,1fr) !important; }
        }

        /* Responsive: hero padding */
        @media (max-width:480px) {
          section { padding-left:20px !important; padding-right:20px !important; }
          footer { padding:24px 20px !important; }
        }
      `}</style>
    </div>
  );
}

# Login code:
// src/pages/LoginPage.jsx

import { useState } from "react";
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
      const { data } = await axios.post("http://localhost:5000/api/auth/login", formData);
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
    <div style={s.root}>
      <Navbar />

      {/* Ambient blobs */}
      <div style={s.blob1} />
      <div style={s.blob2} />
      <div style={s.noise} />

      <div style={s.outerWrap}>
        <div style={s.card}>

          {/* ── LEFT panel – same green gradient as Register ── */}
          <div style={s.left} className="login-left">
            <div style={s.leftContent}>
              <div style={s.leftBadge}>
                <span style={s.badgeDot} />
                AI-POWERED CAREER SUITE
              </div>

              <h2 style={s.leftHeading}>
                Welcome<br />Back
              </h2>

              <p style={s.leftSub}>
                Sign in to continue<br />your career journey.
              </p>

              {/* Info tiles */}
              <div style={s.steps}>
                {[
                  { n: "◈", label: "Analyze\nyour CV" },
                  { n: "◉", label: "Practice\nInterviews" },
                  { n: "◎", label: "Find\nOpportunities" },
                ].map((item, i) => (
                  <div key={i} style={{ ...s.step, ...(i === 0 ? s.stepActive : {}) }}>
                    <div style={{ ...s.stepNum, ...(i === 0 ? s.stepNumActive : {}) }}>
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
                <div style={s.statDivider} />
                <div style={s.statItem}>
                  <span style={s.statNum}>5 min</span>
                  <span style={s.statDesc}>Full Analysis</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT panel – form ── */}
          <div style={s.right}>
            <div style={s.formInner} className="login-form-inner">
              <h2 style={s.heading}>Sign In</h2>
              <p style={s.subHeading}>Enter your credentials to access your account.</p>

              {/* OAuth buttons */}
              <div style={s.oauthRow}>
                <button style={s.oauthBtn}>
                  <svg width="16" height="16" viewBox="0 0 24 24" style={{ marginRight: 8 }}>
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google
                </button>
                <button style={s.oauthBtn}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: 8 }}>
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                  </svg>
                  Github
                </button>
              </div>

              <div style={s.orRow}>
                <span style={s.orLine} />
                <span style={s.orText}>Or</span>
                <span style={s.orLine} />
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
                        ? emailValid ? "rgba(34,197,94,0.5)" : "#ef4444"
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
                        borderColor: touched.password && !formData.password
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
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                          <line x1="1" y1="1" x2="23" y2="23"/>
                        </svg>
                      ) : (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                      )}
                    </button>
                  </div>

                  {/* Strength bars */}
                  {formData.password && (
                    <div style={s.strengthWrap}>
                      <div style={s.strengthBars}>
                        {[1, 2, 3, 4].map((n) => (
                          <div key={n} style={{
                            ...s.strengthBar,
                            backgroundColor: pwdStrength >= n ? strengthColor[pwdStrength] : "rgba(255,255,255,0.08)",
                          }} />
                        ))}
                      </div>
                      <span style={{ color: strengthColor[pwdStrength], fontSize: 11 }}>
                        {strengthLabel[pwdStrength]}
                      </span>
                    </div>
                  )}
                  {touched.password && !formData.password && (
                    <p style={s.err}>Password is required.</p>
                  )}
                </div>

                <button type="submit" disabled={loading} style={s.submitBtn}>
                  {loading ? <span style={s.spinner} /> : "Login"}
                </button>
              </form>

              <p style={s.loginLink}>
                Don't have an account?{" "}
                <Link to="/register" style={s.loginLinkA}>Sign up</Link>
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

/* ─── Styles (mirror of RegisterPage) ─── */
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
    position: "fixed", width: 500, height: 500, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(16,120,70,0.35) 0%, transparent 70%)",
    top: -100, left: -100, zIndex: 0, pointerEvents: "none", filter: "blur(40px)",
  },
  blob2: {
    position: "fixed", width: 400, height: 400, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(16,120,70,0.2) 0%, transparent 70%)",
    bottom: -80, right: -80, zIndex: 0, pointerEvents: "none", filter: "blur(50px)",
  },
  noise: {
    position: "fixed", inset: 0, zIndex: 1,
    backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")",
    pointerEvents: "none",
  },
  outerWrap: {
    flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
    padding: "60px 20px", position: "relative", zIndex: 2,
  },
  card: {
    display: "grid", gridTemplateColumns: "420px 1fr",
    width: "100%", maxWidth: 900,
    borderRadius: 20, overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.07)",
    boxShadow: "0 40px 100px rgba(0,0,0,0.6)",
    animation: "fadeUp 0.6s ease both",
    className: "login-card",
  },
  left: {
    background: "linear-gradient(145deg, #0d4d2e 0%, #0a3320 40%, #071a10 100%)",
    padding: "48px 40px", display: "flex", flexDirection: "column",
    justifyContent: "space-between", position: "relative", overflow: "hidden",
  },
  leftContent: { display: "flex", flexDirection: "column", gap: 24 },
  leftBadge: {
    display: "inline-flex", alignItems: "center", gap: 8,
    background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 20, padding: "5px 12px", fontSize: 9,
    letterSpacing: "0.12em", color: "rgba(255,255,255,0.5)", fontWeight: 500, width: "fit-content",
  },
  badgeDot: {
    width: 6, height: 6, borderRadius: "50%",
    background: "#22c55e", display: "inline-block", boxShadow: "0 0 6px #22c55e",
  },
  leftHeading: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 44, fontWeight: 700, lineHeight: 1.08,
  },
  leftSub: { fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.6, fontWeight: 300 },
  steps: { display: "flex", gap: 12, marginTop: 8 },
  step: {
    flex: 1, background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 12, padding: "14px 12px",
  },
  stepActive: { background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" },
  stepNum: {
    width: 28, height: 28, borderRadius: "50%",
    background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 13, fontWeight: 600, marginBottom: 10,
  },
  stepNumActive: { background: "#fff", color: "#071a10", border: "none" },
  stepLabel: { fontSize: 11, color: "rgba(255,255,255,0.55)", lineHeight: 1.4, whiteSpace: "pre-line" },
  statsRow: {
    display: "flex", alignItems: "center", gap: 20,
    padding: "20px 0 0", borderTop: "1px solid rgba(255,255,255,0.08)", marginTop: 8,
  },
  statItem: { display: "flex", flexDirection: "column", gap: 2 },
  statNum: { fontSize: 26, fontWeight: 700, fontFamily: "'Cormorant Garamond', serif", color: "#fff" },
  statDesc: { fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: "0.05em" },
  statDivider: { width: 1, height: 36, background: "rgba(255,255,255,0.1)" },
  right: { background: "#111", display: "flex", alignItems: "center", justifyContent: "center" },
  formInner: { padding: "52px 44px", width: "100%", maxWidth: 440 },
  heading: { fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 700, marginBottom: 6 },
  subHeading: { fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 28, fontWeight: 300 },
  oauthRow: { display: "flex", gap: 12, marginBottom: 20 },
  oauthBtn: {
    flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 8, padding: "10px 16px", color: "#fff", fontSize: 13,
    cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "background 0.2s",
  },
  orRow: { display: "flex", alignItems: "center", gap: 12, marginBottom: 20 },
  orLine: { flex: 1, height: 1, background: "rgba(255,255,255,0.08)" },
  orText: { fontSize: 12, color: "rgba(255,255,255,0.3)" },
  form: { display: "flex", flexDirection: "column", gap: 16 },
  fieldWrap: { display: "flex", flexDirection: "column", gap: 6 },
  label: {
    fontSize: 10, letterSpacing: "0.1em",
    color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 500,
  },
  input: {
    width: "100%", background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8,
    padding: "11px 14px", color: "#fff", fontSize: 13, outline: "none",
    transition: "border-color 0.2s", fontFamily: "'DM Sans', sans-serif",
  },
  pwdWrap: { position: "relative" },
  eyeBtn: {
    position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
    background: "none", border: "none", cursor: "pointer",
    color: "rgba(255,255,255,0.3)", display: "flex", alignItems: "center", padding: 0,
  },
  strengthWrap: { display: "flex", alignItems: "center", gap: 10, marginTop: 6 },
  strengthBars: { display: "flex", gap: 4, flex: 1 },
  strengthBar: { height: 3, flex: 1, borderRadius: 2, transition: "background-color 0.3s" },
  err: { fontSize: 10, color: "#ef4444", marginTop: 2 },
  submitBtn: {
    marginTop: 8, background: "#fff", color: "#000", border: "none",
    borderRadius: 8, padding: "13px", fontSize: 13, fontWeight: 600,
    cursor: "pointer", transition: "opacity 0.2s", letterSpacing: "0.04em",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "'DM Sans', sans-serif",
  },
  spinner: {
    width: 16, height: 16,
    border: "2px solid rgba(0,0,0,0.2)", borderTop: "2px solid #000",
    borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block",
  },
  loginLink: { marginTop: 20, fontSize: 12, color: "rgba(255,255,255,0.35)", textAlign: "center" },
  loginLinkA: { color: "#fff", fontWeight: 600, textDecoration: "none" },
};

# Register page code:
// src/pages/RegisterPage.jsx

import { useState } from "react";
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
  return score;
}
const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
const strengthColor = ["", "#ef4444", "#f59e0b", "#3b82f6", "#22c55e"];

const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ name: false, email: false, password: false });

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
    setTouched({ name: true, email: true, password: true });
    if (!formData.name || !emailValid || !formData.password) return;

    try {
      setLoading(true);
      const { data } = await axios.post("http://localhost:5000/api/auth/register", formData);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.root}>
      <Navbar />

      {/* Ambient blobs */}
      <div style={s.blob1} />
      <div style={s.blob2} />
      <div style={s.noise} />

      <div style={s.outerWrap}>
        <div style={s.card} className="reg-card">

          {/* ── LEFT panel – green gradient ── */}
          <div style={s.left} className="reg-left">
            <div style={s.leftContent}>
              <div style={s.leftBadge}>
                <span style={s.badgeDot} />
                AI-POWERED CAREER SUITE
              </div>

              <h2 style={s.leftHeading}>
                Get Started<br />with Us
              </h2>

              <p style={s.leftSub}>
                Complete these easy steps<br />to register your account.
              </p>

              {/* Step indicators */}
              <div style={s.steps}>
                {[
                  { n: "1", label: "Sign up your\naccount" },
                  { n: "2", label: "Set up your\nworkspace" },
                  { n: "3", label: "Set up your\nprofile" },
                ].map((step, i) => (
                  <div key={i} style={{ ...s.step, ...(i === 0 ? s.stepActive : {}) }}>
                    <div style={{ ...s.stepNum, ...(i === 0 ? s.stepNumActive : {}) }}>
                      {step.n}
                    </div>
                    <p style={s.stepLabel}>{step.label}</p>
                  </div>
                ))}
              </div>

              {/* Decorative stats */}
              <div style={s.statsRow}>
                <div style={s.statItem}>
                  <span style={s.statNum}>42</span>
                  <span style={s.statDesc}>Job Categories</span>
                </div>
                <div style={s.statDivider} />
                <div style={s.statItem}>
                  <span style={s.statNum}>13K+</span>
                  <span style={s.statDesc}>CV Entries</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT panel – form ── */}
          <div style={s.right}>
            <div style={s.formInner} className="reg-form-inner">
              <h2 style={s.heading}>Sign Up Account</h2>
              <p style={s.subHeading}>Enter your personal data to create your account.</p>

              {/* OAuth buttons */}
              <div style={s.oauthRow}>
                <button style={s.oauthBtn}>
                  <svg width="16" height="16" viewBox="0 0 24 24" style={{ marginRight: 8 }}>
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google
                </button>
                <button style={s.oauthBtn}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: 8 }}>
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                  </svg>
                  Github
                </button>
              </div>

              <div style={s.orRow}>
                <span style={s.orLine} />
                <span style={s.orText}>Or</span>
                <span style={s.orLine} />
              </div>

              <form onSubmit={submitHandler} noValidate style={s.form}>
                {/* Name */}
                <div style={s.fieldWrap}>
                  <label style={s.label}>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={changeHandler}
                    onBlur={blurHandler}
                    placeholder="eg. Keyan Majid"
                    required
                    style={{
                      ...s.input,
                      borderColor: touched.name
                        ? formData.name ? "rgba(34,197,94,0.5)" : "#ef4444"
                        : "rgba(255,255,255,0.1)",
                    }}
                  />
                  {touched.name && !formData.name && (
                    <p style={s.err}>Name is required.</p>
                  )}
                </div>

                {/* Email */}
                <div style={s.fieldWrap}>
                  <label style={s.label}>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={changeHandler}
                    onBlur={blurHandler}
                    placeholder="eg. keyan@gmail.com"
                    required
                    style={{
                      ...s.input,
                      borderColor: touched.email
                        ? emailValid ? "rgba(34,197,94,0.5)" : "#ef4444"
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
                        borderColor: touched.password && !formData.password
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
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                          <line x1="1" y1="1" x2="23" y2="23"/>
                        </svg>
                      ) : (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                      )}
                    </button>
                  </div>
                  <p style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>
                    Must be at least 8 characters.
                  </p>

                  {formData.password && (
                    <div style={s.strengthWrap}>
                      <div style={s.strengthBars}>
                        {[1, 2, 3, 4].map((n) => (
                          <div key={n} style={{
                            ...s.strengthBar,
                            backgroundColor: pwdStrength >= n ? strengthColor[pwdStrength] : "rgba(255,255,255,0.08)",
                          }} />
                        ))}
                      </div>
                      <span style={{ color: strengthColor[pwdStrength], fontSize: 11 }}>
                        {strengthLabel[pwdStrength]}
                      </span>
                    </div>
                  )}
                  {touched.password && !formData.password && (
                    <p style={s.err}>Password is required.</p>
                  )}
                </div>

                <button type="submit" disabled={loading} style={s.submitBtn}>
                  {loading ? <span style={s.spinner} /> : "Sign Up"}
                </button>
              </form>

              <p style={s.loginLink}>
                Already have an account?{" "}
                <Link to="/login" style={s.loginLinkA}>Log in</Link>
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
          .reg-left { display:none !important; }
          .reg-card { grid-template-columns:1fr !important; }
        }
        @media (max-width:480px) {
          .reg-form-inner { padding:32px 20px !important; }
        }
      `}</style>
    </div>
  );
}

/* ─── Styles ─── */
const s = {
  root: {
    minHeight: "100vh", background: "#0a0a0a",
    fontFamily: "'DM Sans', sans-serif", color: "#fff",
    position: "relative", overflow: "hidden", display: "flex", flexDirection: "column",
  },
  blob1: {
    position: "fixed", width: 500, height: 500, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(16,120,70,0.35) 0%, transparent 70%)",
    top: -100, left: -100, zIndex: 0, pointerEvents: "none", filter: "blur(40px)",
  },
  blob2: {
    position: "fixed", width: 400, height: 400, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(16,120,70,0.2) 0%, transparent 70%)",
    bottom: -80, right: -80, zIndex: 0, pointerEvents: "none", filter: "blur(50px)",
  },
  noise: {
    position: "fixed", inset: 0, zIndex: 1,
    backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")",
    pointerEvents: "none",
  },
  outerWrap: {
    flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
    padding: "60px 20px", position: "relative", zIndex: 2,
  },
  card: {
    display: "grid", gridTemplateColumns: "420px 1fr",
    width: "100%", maxWidth: 900, borderRadius: 20, overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.07)",
    boxShadow: "0 40px 100px rgba(0,0,0,0.6)",
    animation: "fadeUp 0.6s ease both",
  },
  left: {
    background: "linear-gradient(145deg, #0d4d2e 0%, #0a3320 40%, #071a10 100%)",
    padding: "48px 40px", display: "flex", flexDirection: "column",
    justifyContent: "space-between", position: "relative", overflow: "hidden",
  },
  leftContent: { display: "flex", flexDirection: "column", gap: 24 },
  leftBadge: {
    display: "inline-flex", alignItems: "center", gap: 8,
    background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 20, padding: "5px 12px", fontSize: 9,
    letterSpacing: "0.12em", color: "rgba(255,255,255,0.5)", fontWeight: 500, width: "fit-content",
  },
  badgeDot: {
    width: 6, height: 6, borderRadius: "50%",
    background: "#22c55e", display: "inline-block", boxShadow: "0 0 6px #22c55e",
  },
  leftHeading: { fontFamily: "'Cormorant Garamond', serif", fontSize: 44, fontWeight: 700, lineHeight: 1.08 },
  leftSub: { fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.6, fontWeight: 300 },
  steps: { display: "flex", gap: 12, marginTop: 8 },
  step: {
    flex: 1, background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "14px 12px",
  },
  stepActive: { background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" },
  stepNum: {
    width: 22, height: 22, borderRadius: "50%",
    background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 11, fontWeight: 600, marginBottom: 10,
  },
  stepNumActive: { background: "#fff", color: "#071a10", border: "none" },
  stepLabel: { fontSize: 11, color: "rgba(255,255,255,0.55)", lineHeight: 1.4, whiteSpace: "pre-line" },
  statsRow: {
    display: "flex", alignItems: "center", gap: 20,
    padding: "20px 0 0", borderTop: "1px solid rgba(255,255,255,0.08)", marginTop: 8,
  },
  statItem: { display: "flex", flexDirection: "column", gap: 2 },
  statNum: { fontSize: 26, fontWeight: 700, fontFamily: "'Cormorant Garamond', serif", color: "#fff" },
  statDesc: { fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: "0.05em" },
  statDivider: { width: 1, height: 36, background: "rgba(255,255,255,0.1)" },
  right: { background: "#111", display: "flex", alignItems: "center", justifyContent: "center" },
  formInner: { padding: "52px 44px", width: "100%", maxWidth: 440 },
  heading: { fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 700, marginBottom: 6 },
  subHeading: { fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 28, fontWeight: 300 },
  oauthRow: { display: "flex", gap: 12, marginBottom: 20 },
  oauthBtn: {
    flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 8, padding: "10px 16px", color: "#fff", fontSize: 13,
    cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "background 0.2s",
  },
  orRow: { display: "flex", alignItems: "center", gap: 12, marginBottom: 20 },
  orLine: { flex: 1, height: 1, background: "rgba(255,255,255,0.08)" },
  orText: { fontSize: 12, color: "rgba(255,255,255,0.3)" },
  form: { display: "flex", flexDirection: "column", gap: 16 },
  fieldWrap: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 10, letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 500 },
  input: {
    width: "100%", background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8,
    padding: "11px 14px", color: "#fff", fontSize: 13, outline: "none",
    transition: "border-color 0.2s", fontFamily: "'DM Sans', sans-serif",
  },
  pwdWrap: { position: "relative" },
  eyeBtn: {
    position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
    background: "none", border: "none", cursor: "pointer",
    color: "rgba(255,255,255,0.3)", display: "flex", alignItems: "center", padding: 0,
  },
  strengthWrap: { display: "flex", alignItems: "center", gap: 10, marginTop: 6 },
  strengthBars: { display: "flex", gap: 4, flex: 1 },
  strengthBar: { height: 3, flex: 1, borderRadius: 2, transition: "background-color 0.3s" },
  err: { fontSize: 10, color: "#ef4444", marginTop: 2 },
  submitBtn: {
    marginTop: 8, background: "#fff", color: "#000", border: "none",
    borderRadius: 8, padding: "13px", fontSize: 13, fontWeight: 600,
    cursor: "pointer", transition: "opacity 0.2s", letterSpacing: "0.04em",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "'DM Sans', sans-serif",
  },
  spinner: {
    width: 16, height: 16, border: "2px solid rgba(0,0,0,0.2)",
    borderTop: "2px solid #000", borderRadius: "50%",
    animation: "spin 0.7s linear infinite", display: "inline-block",
  },
  loginLink: { marginTop: 20, fontSize: 12, color: "rgba(255,255,255,0.35)", textAlign: "center" },
  loginLinkA: { color: "#fff", fontWeight: 600, textDecoration: "none" },
};
 