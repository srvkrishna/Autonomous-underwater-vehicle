import { ArrowUpRight, LockKeyhole, Loader2 } from "lucide-react";
import { useState } from "react";
import { startLogin } from "@/const";

const mark = "/sonar-mark.svg";

export default function AuthPage() {
  const [signingIn, setSigningIn] = useState(false);

  const handleLogin = async () => {
    try {
      setSigningIn(true);
      await startLogin();
    } catch (err) {
      console.error("Login failed:", err);
      setSigningIn(false);
    }
  };

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
