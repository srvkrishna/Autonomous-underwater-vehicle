// Tidal Instrument style: shared AUV SONAR shell with a persistent mission-console rail and calm instrument hierarchy.
import { ArrowUpRight, BatteryCharging, ChevronRight, CircleHelp, LockKeyhole, Menu, Wifi, X, Loader2, LogOut, User as UserIcon } from "lucide-react";
import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { Link, useLocation } from "wouter";
import { useState } from "react";

const mark = "/sonar-mark.svg";

const navigation = [
  { label: "Dashboard overview", path: "/" },
  { label: "Waveform library", path: "/waveforms" },
  { label: "Water conditions", path: "/conditions" },
  { label: "Sensor telemetry", path: "/telemetry" },
  { label: "Technical workflow", path: "/workflow" },
];

export default function AuvShell({ children, sectionTitle }: { children: React.ReactNode; sectionTitle: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const { user, loading, logout } = useAuth();
  const [location] = useLocation();
  const activePath = location === "/" ? "/" : location;

  const handleLogin = async () => {
    try {
      setSigningIn(true);
      await startLogin();
    } catch (err) {
      console.error("Login failed:", err);
      setSigningIn(false);
    }
  };

  if (loading) {
    return <div className="auth-loading"><div className="auth-loading-mark"><img src={mark} alt="" /></div><span>Checking secure workspace access…</span></div>;
  }

  if (!user) {
    return (
      <div className="auth-screen">
        <div className="auth-brand-panel">
          <div className="auth-brand">
            <img src={mark} alt="" />
            <div>
              <b>AUV SONAR</b>
              <span>adaptive payload control</span>
            </div>
          </div>
          <div className="auth-brand-copy">
            <span className="eyebrow">PRIVATE PAYLOAD CONSOLE</span>
            <h1>
              Read the water.<br />
              <em>Protect the mission.</em>
            </h1>
            <p>
              A secure workspace for adaptive sonar synthesis, environmental telemetry, and AUV payload control.
            </p>
            <div className="auth-points">
              <span>✓ Environmental context stays in the console</span>
              <span>✓ Waveform controls remain mission-specific</span>
              <span>✓ Built for authenticated operators</span>
            </div>
          </div>
          <small>YOUR DATA, YOUR MISSION.</small>
        </div>
        <div className="auth-form-panel">
          <div className="auth-form-top">
            <span>AUV SONAR workspace</span>
            <span className="secure-label">
              <LockKeyhole size={13} /> Secure sign-in
            </span>
          </div>
          <div className="auth-card">
            <div className="auth-icon">
              <LockKeyhole size={18} />
            </div>
            <span className="eyebrow">PRIVATE WORKSPACE ACCESS</span>
            <h2>Welcome back.</h2>
            <p>Sign in to continue to your protected sonar intelligence workspace.</p>
            <button
              className="auth-primary"
              onClick={handleLogin}
              disabled={signingIn}
              style={{ cursor: signingIn ? "wait" : "pointer", opacity: signingIn ? 0.8 : 1 }}
            >
              {signingIn ? "Entering workspace…" : "Open protected workspace"}
              {signingIn ? <Loader2 size={16} className="animate-spin" /> : <ArrowUpRight size={16} />}
            </button>
            <div className="auth-disclaimer">
              <b>Operator Access Ready</b><br />
              Select “Open protected workspace” to access the AUV console as an authenticated Sonar Specialist.
            </div>
          </div>
          <small className="auth-footer-note">Built for the sensitive water column.</small>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <aside className={`side-rail ${menuOpen ? "open" : ""}`}>
        <div className="rail-brand">
          <img src={mark} alt="" />
          <div>
            <b>AUV SONAR</b>
            <span>adaptive payload control</span>
          </div>
          <button className="mobile-close" onClick={() => setMenuOpen(false)} aria-label="Close navigation">
            <X size={18} />
          </button>
        </div>
        <div className="rail-status">
          <span className="status-dot">
            <i className="pulse" />LIVE DEMO STREAM
          </span>
          <span className="mono">ESP32–S3</span>
        </div>
        <div className="rail-nav-title">MISSION CONSOLE</div>
        <nav className="rail-nav" aria-label="AUV SONAR sections">
          {navigation.map((item, index) => (
            <Link
              key={item.path}
              href={item.path}
              className={activePath === item.path ? "active" : ""}
              onClick={() => setMenuOpen(false)}
            >
              <span>0{index + 1}</span>
              {item.label}
              <ChevronRight size={14} />
            </Link>
          ))}
        </nav>
        <div className="rail-footer">
          <div className="rail-footer-row">
            <Wifi size={15} />
            <span>Local link</span>
            <b>98%</b>
          </div>
          <div className="rail-footer-row">
            <BatteryCharging size={15} />
            <span>Payload power</span>
            <b>72%</b>
          </div>
          <div
            style={{
              marginTop: "14px",
              paddingTop: "12px",
              borderTop: "1px solid rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: "10px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#a5bcc1" }}>
              <UserIcon size={13} style={{ color: "#78c8c2" }} />
              <span style={{ maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user.name || "Operator"}
              </span>
            </div>
            <button
              onClick={() => logout()}
              title="Sign out"
              style={{
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.18)",
                color: "#a5bcc1",
                borderRadius: "5px",
                padding: "3px 6px",
                fontSize: "9px",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                cursor: "pointer",
              }}
            >
              <LogOut size={10} /> Exit
            </button>
          </div>
          <p>Frontend preview<br />No hardware connected</p>
        </div>
      </aside>

      <main className="main-canvas">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMenuOpen(true)} aria-label="Open navigation">
            <Menu size={20} />
          </button>
          <div className="breadcrumb">
            <span>AUV SONAR</span>
            <ChevronRight size={13} />
            <b>{sectionTitle}</b>
          </div>
          <div className="top-actions">
            <span className="status-dot">
              <i className="pulse" />Telemetry nominal
            </span>
            <button
              onClick={() => logout()}
              style={{
                background: "rgba(24,49,73,0.06)",
                border: "1px solid rgba(24,49,73,0.12)",
                borderRadius: "6px",
                padding: "5px 10px",
                fontSize: "10px",
                color: "#31403f",
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              <LogOut size={12} /> Sign out
            </button>
            <button className="icon-button" aria-label="Help">
              <CircleHelp size={18} />
            </button>
          </div>
        </header>
        <div className="signal-spine" aria-hidden="true">
          <i /><i /><i /><i /><i />
        </div>
        {children}
      </main>
    </div>
  );
}
