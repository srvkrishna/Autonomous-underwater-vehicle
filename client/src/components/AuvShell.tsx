// Tidal Instrument style: shared AUV SONAR shell with a persistent mission-console rail and calm instrument hierarchy.
import { BatteryCharging, ChevronRight, CircleHelp, Menu, Wifi, X } from "lucide-react";
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
  const [location] = useLocation();
  const activePath = location === "/" ? "/" : location;

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
