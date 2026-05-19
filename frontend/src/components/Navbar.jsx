import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [menuOpen, setMenuOpen] = useState(false);

  const [dark, setDark] = useState(() => {
    return (
      localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
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
        { to: "/jobs", label: "Job Search" },
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
        }

        .nav-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .nav-brand {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--nav-text);
          text-decoration: none;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .nav-link {
          color: var(--nav-muted);
          text-decoration: none;
          padding: 0.5rem 0.8rem;
          border-radius: 8px;
          transition: 0.2s;
          font-size: 0.9rem;
        }

        .nav-link:hover {
          background: var(--nav-hover-bg);
          color: var(--nav-text);
        }

        .nav-right {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .theme-toggle {
          width: 38px;
          height: 38px;
          border-radius: 8px;
          border: 1px solid var(--nav-border);
          background: transparent;
          cursor: pointer;
          color: var(--nav-text);
        }

        .nav-btn {
          padding: 0.55rem 1rem;
          border-radius: 8px;
          border: 1px solid var(--nav-border);
          cursor: pointer;
          font-size: 0.9rem;
          transition: 0.2s;
        }

        .nav-btn-ghost {
          background: transparent;
          color: var(--nav-text);
        }

        .nav-btn-ghost:hover {
          background: var(--nav-hover-bg);
        }

        .nav-btn-solid {
          background: #111;
          color: white;
          border-color: #111;
        }

        .nav-btn-solid:hover {
          opacity: 0.9;
        }

        .hamburger {
          display: none;
          flex-direction: column;
          gap: 4px;
          width: 38px;
          height: 38px;
          border-radius: 8px;
          border: 1px solid var(--nav-border);
          background: transparent;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .hamburger span {
          width: 18px;
          height: 2px;
          background: var(--nav-text);
        }

        .mobile-menu {
          display: none;
        }

        @media (max-width: 768px) {
          .nav-links {
            display: none;
          }

          .desktop-auth {
            display: none;
          }

          .hamburger {
            display: flex;
          }

          .mobile-menu.open {
            display: flex;
            flex-direction: column;
            padding: 1rem;
            background: var(--nav-mobile-bg);
            border-top: 1px solid var(--nav-border);
          }

          .mobile-link {
            text-decoration: none;
            color: var(--nav-text);
            padding: 0.8rem 0;
          }

          .mobile-actions {
            display: flex;
            gap: 0.5rem;
            margin-top: 1rem;
          }

          .mobile-actions button {
            flex: 1;
          }
        }
      `}</style>

      <nav className="navbar">
        <div className="nav-inner">
          <Link to="/" className="nav-brand">
            AI Resume System
          </Link>

          <div className="nav-links">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} className="nav-link">
                {link.label}
              </Link>
            ))}
          </div>

          <div className="nav-right">
            <button className="theme-toggle" onClick={() => setDark(!dark)}>
              {dark ? "☀" : "☾"}
            </button>

            <div className="desktop-auth nav-right">
              {token ? (
                <button
                  className="nav-btn nav-btn-ghost"
                  onClick={logoutHandler}
                >
                  Logout
                </button>
              ) : (
                <>
                  <button
                    className="nav-btn nav-btn-ghost"
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </button>

                  <button
                    className="nav-btn nav-btn-solid"
                    onClick={() => navigate("/register")}
                  >
                    Register
                  </button>
                </>
              )}
            </div>

            <button
              className="hamburger"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>

        <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="mobile-link"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          <div className="mobile-actions">
            {token ? (
              <button className="nav-btn nav-btn-ghost" onClick={logoutHandler}>
                Logout
              </button>
            ) : (
              <>
                <button
                  className="nav-btn nav-btn-ghost"
                  onClick={() => navigate("/login")}
                >
                  Login
                </button>

                <button
                  className="nav-btn nav-btn-solid"
                  onClick={() => navigate("/register")}
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
