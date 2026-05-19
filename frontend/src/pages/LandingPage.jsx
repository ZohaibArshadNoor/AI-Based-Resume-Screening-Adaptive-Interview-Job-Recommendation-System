// src/pages/LandingPage.jsx
// npm install gsap

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function LandingPage() {
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains("dark"),
  );

  // Sync with Navbar's theme toggle
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

  // Light theme overrides for landing page
  useEffect(() => {
    const styleId = "landing-light-theme-overrides";
    let existing = document.getElementById(styleId);
    if (!dark) {
      if (!existing) {
        const style = document.createElement("style");
        style.id = styleId;
        style.textContent = `
          /* Light mode: make badge text visible */
          .hero-badge {
            color: #333333 !important;
          }
          /* Optional: also improve any other light-gray-on-white issues */
          .land-hero-inner > p:first-of-type {
            color: #333333 !important;
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

  /* ── GSAP ── */
  useEffect(() => {
    const load = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      gsap.fromTo(
        ".land-hero-inner > *",
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.11,
          duration: 0.85,
          ease: "power3.out",
          delay: 0.25,
        },
      );

      gsap.utils.toArray(".reveal").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.72,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 86%" },
          },
        );
      });

      gsap.utils.toArray(".reveal-card").forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            delay: (i % 5) * 0.07,
            scrollTrigger: { trigger: el, start: "top 88%" },
          },
        );
      });
    };
    load();
  }, []);

  /* ── Theme vars ── */
  const T = {
    bg: dark ? "#0d0d0d" : "#f8f7f4",
    bg2: dark ? "#141414" : "#efefec",
    fg: dark ? "#ededed" : "#111111",
    fg2: dark ? "#888888" : "#555555",
    fg3: dark ? "#555555" : "#aaaaaa",
    bdr: dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)",
    card: dark ? "#181818" : "#ffffff",
    cBdr: dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)",
    darkStrip: dark ? "#0a0a0a" : "#111111",
  };

  const features = [
    {
      n: "01",
      t: "Role Prediction",
      b: "Trained on 13K+ CVs across 42 job categories. Our model maps your resume to the best-fit role with a confidence score.",
    },
    {
      n: "02",
      t: "AI Interview Coach",
      b: "Simulate a real interview based on your job description. Get instant feedback, strengths, weaknesses, and a growth roadmap.",
    },
    {
      n: "03",
      t: "Live Job Scraper",
      b: "Our agent surfaces live listings matched to your profile — company name, required skills, and a one-click apply link.",
    },
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
    { n: "42", d: "Job Categories" },
    { n: "95%", d: "Accuracy" },
    { n: "5 min", d: "Full Analysis" },
  ];

  const team = [
    { init: "KM", name: "Keyan Majid", role: "Lead , Frontend" },
    { init: "ZAN", name: "Zohaib Arshad Noor", role: "ML,Backend" },
    { init: "IY", name: "Ifrahim Yousef", role: "Data,DataBase" },
  ];

  const cell = (bdr, last) => (last ? {} : { borderRight: `1px solid ${bdr}` });

  return (
    <div
      style={{
        background: T.bg,
        color: T.fg,
        fontFamily: "'DM Sans',sans-serif",
        minHeight: "100vh",
        transition: "background .3s,color .3s",
      }}
    >
      <Navbar />

      {/* ══════════ HERO ══════════ */}
      <section
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: `1px solid ${T.bdr}`,
          overflow: "hidden",
        }}
      >
        {/* Decorative grid lines */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: 0,
              right: 0,
              height: 1,
              background: T.bdr,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: "50%",
              width: 1,
              background: T.bdr,
            }}
          />
        </div>

        {/* Subtle radial glow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
            background: dark
              ? "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(34,197,94,0.06) 0%, transparent 70%)"
              : "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(34,197,94,0.07) 0%, transparent 70%)",
          }}
        />

        <div
          className="land-hero-inner"
          style={{
            position: "relative",
            zIndex: 1,
            textAlign: "center",
            padding: "0 24px",
            maxWidth: 800,
            width: "100%",
          }}
        >
          <p
            style={{
              fontSize: 11,
              letterSpacing: "0.22em",
              color: T.fg3,
              marginBottom: 32,
              textTransform: "uppercase",
              fontWeight: 500,
            }}
            className="hero-badge"
          >
            ✦ &nbsp; AI Career Intelligence &nbsp; ✦
          </p>

          <h1
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "clamp(60px,10vw,120px)",
              fontWeight: 700,
              lineHeight: 0.9,
              letterSpacing: "-0.03em",
              marginBottom: 36,
              color: T.fg,
            }}
          >
            CAREER
            <br />
            <em style={{ fontStyle: "italic", color: "#22c55e" }}>LENS</em>
          </h1>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
              marginBottom: 32,
              flexWrap: "wrap",
            }}
          >
            <div style={{ height: 1, width: 56, background: T.fg3 }} />
            <p
              style={{
                fontSize: 11,
                letterSpacing: "0.16em",
                color: T.fg2,
                textTransform: "uppercase",
              }}
            >
              ANALYZE &nbsp;|&nbsp; PREDICT &nbsp;|&nbsp; APPLY
            </p>
            <div style={{ height: 1, width: 56, background: T.fg3 }} />
          </div>

          <p
            style={{
              fontSize: 15,
              color: T.fg2,
              lineHeight: 1.8,
              fontWeight: 300,
              maxWidth: 480,
              margin: "0 auto 48px",
            }}
          >
            Upload your resume. Our AI decodes your ideal job role, coaches you
            through mock interviews, and finds live opportunities — in minutes.
          </p>

          <div
            style={{
              display: "flex",
              gap: 14,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              to="/register"
              style={{
                background: T.fg,
                color: T.bg,
                padding: "13px 34px",
                borderRadius: 2,
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                textDecoration: "none",
              }}
            >
              Analyze My CV
            </Link>
            <Link
              to="/login"
              style={{
                border: `1px solid ${T.bdr}`,
                color: T.fg,
                padding: "13px 34px",
                borderRadius: 2,
                fontSize: 12,
                fontWeight: 500,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                textDecoration: "none",
              }}
            >
              Sign In →
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          style={{
            position: "absolute",
            bottom: 36,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              fontSize: 9,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: T.fg3,
            }}
          >
            scroll
          </span>
          <div style={{ width: 1, height: 36, background: T.fg3 }} />
        </div>
      </section>

      {/* ══════════ 4-ICON PILLARS ══════════ */}
      <section style={{ borderBottom: `1px solid ${T.bdr}` }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div
            className="pillars-grid"
            style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)" }}
          >
            {[
              { icon: "◈", label: "Upload" },
              { icon: "◉", label: "Analyze" },
              { icon: "◐", label: "Interview" },
              { icon: "◎", label: "Apply" },
            ].map((p, i, arr) => (
              <div
                key={i}
                className="reveal-card"
                style={{
                  textAlign: "center",
                  padding: "56px 20px",
                  ...cell(T.bdr, i === arr.length - 1),
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 14,
                }}
              >
                <span style={{ fontSize: 30, color: T.fg, lineHeight: 1 }}>
                  {p.icon}
                </span>
                <div style={{ width: 28, height: 1, background: T.bdr }} />
                <span
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.18em",
                    color: T.fg2,
                    textTransform: "uppercase",
                    fontWeight: 500,
                  }}
                >
                  {p.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ EDITORIAL TAGLINE ══════════ */}
      <section
        style={{
          padding: "100px 40px",
          borderBottom: `1px solid ${T.bdr}`,
          background: T.bg,
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <h2
            className="reveal"
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "clamp(26px,3.5vw,42px)",
              fontWeight: 400,
              lineHeight: 1.3,
              marginBottom: 20,
              color: T.fg,
            }}
          >
            We analyze career potential.
          </h2>
          <svg
            className="reveal"
            width="48"
            height="12"
            viewBox="0 0 48 12"
            fill="none"
            style={{ display: "block", margin: "0 auto 24px" }}
          >
            <path
              d="M0 6 Q12 0 24 6 Q36 12 48 6"
              stroke={T.fg3}
              strokeWidth="1"
              fill="none"
            />
          </svg>
          <p
            className="reveal"
            style={{
              fontSize: 15,
              color: T.fg2,
              lineHeight: 1.85,
              fontWeight: 300,
              maxWidth: 500,
              margin: "0 auto",
            }}
          >
            Your experience, your ambition — it's worth pursuing the right path.
            CareerLens helps every candidate discover where they truly stand.
          </p>
        </div>
      </section>

      {/* ══════════ DARK FEATURES STRIP ══════════ */}
      <section
        style={{
          background: T.darkStrip,
          color: "#f0f0f0",
          padding: "100px 40px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div
            className="features-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "280px 1fr",
              gap: 80,
              alignItems: "start",
            }}
          >
            <div>
              <h2
                className="reveal"
                style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: "clamp(24px,2.8vw,36px)",
                  fontWeight: 400,
                  lineHeight: 1.25,
                  marginBottom: 20,
                  color: "#f0f0f0",
                }}
              >
                We build intelligent career experiences
              </h2>
              <p
                className="reveal"
                style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.38)",
                  lineHeight: 1.8,
                  marginBottom: 36,
                  fontWeight: 300,
                }}
              >
                Trained on 13,000+ real CVs across 42 categories. Our models
                deliver clarity on where your profile fits best.
              </p>
              <Link
                to="/register"
                className="reveal"
                style={{
                  display: "inline-block",
                  border: "1px solid rgba(255,255,255,0.22)",
                  color: "#fff",
                  padding: "10px 22px",
                  fontSize: 11,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  borderRadius: 2,
                }}
              >
                Get Started
              </Link>
            </div>
            <div>
              {features.map((f, i) => (
                <div
                  key={i}
                  className="reveal-card"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "44px 1fr",
                    gap: 24,
                    padding: "32px 0",
                    borderBottom:
                      i < features.length - 1
                        ? "1px solid rgba(255,255,255,0.06)"
                        : "none",
                    alignItems: "start",
                  }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      color: "rgba(255,255,255,0.22)",
                      letterSpacing: "0.08em",
                      paddingTop: 3,
                    }}
                  >
                    {f.n}
                  </span>
                  <div>
                    <h3
                      style={{
                        fontSize: 16,
                        fontWeight: 600,
                        marginBottom: 8,
                        color: "#f0f0f0",
                      }}
                    >
                      {f.t}
                    </h3>
                    <p
                      style={{
                        fontSize: 13,
                        color: "rgba(255,255,255,0.38)",
                        lineHeight: 1.75,
                        fontWeight: 300,
                      }}
                    >
                      {f.b}
                    </p>
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
          <div
            className="metrics-grid"
            style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)" }}
          >
            {metrics.map((m, i, arr) => (
              <div
                key={i}
                className="reveal-card"
                style={{
                  textAlign: "center",
                  padding: "60px 16px",
                  ...cell(T.bdr, i === arr.length - 1),
                }}
              >
                <div
                  style={{
                    fontFamily: "'Playfair Display',serif",
                    fontSize: "clamp(36px,4vw,54px)",
                    fontWeight: 700,
                    color: T.fg,
                    marginBottom: 8,
                    lineHeight: 1,
                  }}
                >
                  {m.n}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.16em",
                    color: T.fg3,
                    textTransform: "uppercase",
                  }}
                >
                  {m.d}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ QUOTE ══════════ */}
      <section
        style={{
          padding: "100px 40px",
          borderBottom: `1px solid ${T.bdr}`,
          background: T.bg,
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 660, margin: "0 auto" }}>
          <p
            className="reveal"
            style={{
              fontFamily: "'Playfair Display',serif",
              fontStyle: "italic",
              fontSize: "clamp(15px,2.2vw,20px)",
              color: T.fg2,
              lineHeight: 1.85,
              marginBottom: 28,
            }}
          >
            "Surround yourself with the dreamers and the doers, the believers
            and thinkers — most of all, those who see greatness within you, even
            when you don't see it yourself."
          </p>
          <span
            className="reveal"
            style={{
              fontSize: 11,
              letterSpacing: "0.14em",
              color: T.fg3,
              textTransform: "uppercase",
            }}
          >
            — Edmund Lee
          </span>
          <div
            className="reveal"
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 8,
              marginTop: 28,
            }}
          >
            {[28, 10, 10].map((w, i) => (
              <div
                key={i}
                style={{
                  width: w,
                  height: 3,
                  background: i === 0 ? T.fg : T.bdr,
                  borderRadius: 2,
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ WORKFLOW / STEPS ══════════ */}
      <section
        style={{
          padding: "100px 40px",
          borderBottom: `1px solid ${T.bdr}`,
          background: T.bg2,
        }}
      >
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <p
            className="reveal"
            style={{
              fontSize: 11,
              letterSpacing: "0.2em",
              color: T.fg3,
              textTransform: "uppercase",
              marginBottom: 56,
              textAlign: "center",
            }}
          >
            Workflow
          </p>
          {steps.map((step, i) => (
            <div
              key={i}
              className="reveal-card"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 28,
                padding: "22px 0",
                borderBottom: `1px solid ${T.bdr}`,
              }}
            >
              <span
                style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: "clamp(24px,3vw,32px)",
                  fontWeight: 700,
                  color: T.bdr,
                  minWidth: 44,
                  lineHeight: 1,
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span style={{ fontSize: 15, color: T.fg, fontWeight: 400 }}>
                {step}
              </span>
              <span
                style={{
                  marginLeft: "auto",
                  fontSize: 18,
                  color: T.fg3,
                  flexShrink: 0,
                }}
              >
                →
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════ TEAM ══════════ */}
      <section
        style={{
          padding: "100px 40px",
          borderBottom: `1px solid ${T.bdr}`,
          background: T.bg,
        }}
      >
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <p
            className="reveal"
            style={{
              marginBottom: 16,
              textAlign: "center",
              fontSize: 11,
              letterSpacing: "0.2em",
              color: T.fg3,
              textTransform: "uppercase",
            }}
          >
            The Team
          </p>

          <h2
            className="reveal"
            style={{
              fontFamily: "'Playfair Display',serif",
              textAlign: "center",
              fontSize: "clamp(26px,3vw,38px)",
              fontWeight: 400,
              marginBottom: 60,
              color: T.fg,
            }}
          >
            Built by engineers
          </h2>

          <div
            className="team-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5,max-content)",
              gap: 20,
              justifyContent: "center",
            }}
          >
            {team.map((m, i) => (
              <div
                key={i}
                className="reveal-card"
                style={{
                  textAlign: "center",
                  padding: "32px 16px",
                  border: `1px solid ${T.cBdr}`,
                  background: T.card,
                  borderRadius: 2,
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    background: T.bg2,
                    border: `1px solid ${T.bdr}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    fontWeight: 700,
                    color: T.fg,
                    margin: "0 auto 16px",
                  }}
                >
                  {m.init}
                </div>

                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: T.fg,
                    marginBottom: 4,
                  }}
                >
                  {m.name}
                </div>

                <div
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.1em",
                    color: T.fg3,
                    textTransform: "uppercase",
                  }}
                >
                  {m.role}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ CTA ══════════ */}
      <section
        style={{ padding: "100px 40px", background: T.bg, textAlign: "center" }}
      >
        <p
          className="reveal"
          style={{
            fontSize: 11,
            letterSpacing: "0.2em",
            color: T.fg3,
            textTransform: "uppercase",
            marginBottom: 20,
          }}
        >
          Ready to begin?
        </p>
        <h2
          className="reveal"
          style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: "clamp(36px,6vw,72px)",
            fontWeight: 700,
            lineHeight: 0.92,
            letterSpacing: "-0.025em",
            marginBottom: 44,
            color: T.fg,
          }}
        >
          Decode your
          <br />
          career today.
        </h2>
        <Link
          to="/register"
          className="reveal"
          style={{
            display: "inline-block",
            background: T.fg,
            color: T.bg,
            padding: "14px 40px",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            textDecoration: "none",
            borderRadius: 2,
          }}
        >
          Start For Free
        </Link>
      </section>

      {/* ══════════ FOOTER ══════════ */}
      <footer style={{ borderTop: `1px solid ${T.bdr}`, padding: "28px 40px" }}>
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <span
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: 18,
              fontWeight: 700,
              color: T.fg,
            }}
          >
            CareerLens
          </span>
          <p style={{ fontSize: 11, color: T.fg3, letterSpacing: "0.05em" }}>
            © 2025 CareerLens · Team CareerLens
          </p>
          <div style={{ display: "flex", gap: 24 }}>
            {["Privacy", "Terms", "Contact"].map((l) => (
              <a
                key={l}
                href="#"
                style={{
                  fontSize: 11,
                  color: T.fg3,
                  textDecoration: "none",
                  letterSpacing: "0.05em",
                }}
              >
                {l}
              </a>
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
