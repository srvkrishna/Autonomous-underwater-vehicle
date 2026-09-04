// Tidal Instrument style: dashboard overview page with editorial marine instrumentation and direct paths into dedicated console pages.
import { ArrowDownRight, ArrowUpRight, BatteryCharging, Gauge, Layers3, Radio, Satellite, Thermometer, Waves } from "lucide-react";
import { Link } from "wouter";
import AuvShell from "@/components/AuvShell";
import { PageFooter, SectionLabel } from "@/components/SonarPrimitives";

const hero = "/tidal-hero.svg";

const sectionCards = [
  { path: "/waveforms", number: "02", title: "Waveform library", text: "Compare LFM chirp, phase-coded pulse, and geometric sweep families.", meta: "3 waveform families", tone: "aqua" },
  { path: "/conditions", number: "03", title: "Water conditions", text: "Choose a starting frequency band for clear, turbid, or muddy water.", meta: "4–30 kHz guidance", tone: "sand" },
  { path: "/telemetry", number: "04", title: "Sensor telemetry", text: "Read structured depth, turbidity, temperature, and salinity packets.", meta: "ESP32–S3 / 12-bit ADC", tone: "blue" },
  { path: "/workflow", number: "05", title: "Technical workflow", text: "Trace the closed loop from environmental sensing to transmitted pulse.", meta: "10 Hz control loop", tone: "ink" },
];

export default function Home() {
  return <AuvShell sectionTitle="DASHBOARD OVERVIEW">
    <section className="hero-section overview-hero">
      <div className="hero-copy"><SectionLabel eyebrow="01 / overview">Low-power real-time intelligence</SectionLabel><h1>Read the water.<br /><em>Shape the pulse.</em></h1><p className="hero-lede">An adaptive software-defined sonar transmitter payload for AUVs — sensing the column, tuning the waveform, and transmitting only what the mission needs.</p><div className="hero-actions"><Link className="primary-cta" href="/telemetry">Open telemetry <ArrowDownRight size={16} /></Link><Link className="text-link" href="/workflow">View system flow <ArrowUpRight size={15} /></Link></div><div className="hero-meta"><span><b>10 Hz</b> update loop</span><span><b>&lt; 10 ms</b> adaptation latency</span><span><b>3.7 V</b> low-power rail</span></div></div>
      <div className="hero-visual"><img src={hero} alt="Abstract underwater contour waves" /><div className="hero-visual-shade" /><div className="visual-caption"><span className="mono">WATER COLUMN / 184 M</span><span>signal path active <i className="pulse" /></span></div><div className="hero-readout"><span>ACTIVE BAND</span><b>8–28 kHz</b><small>LFM chirp</small></div><div className="sweep-line" /></div>
    </section>
    <section className="overview-summary"><div className="overview-summary-head"><div><SectionLabel eyebrow="Console map">Navigate the payload</SectionLabel><h2>One mission console,<br /><em>four focused pages.</em></h2></div><p>Each section is now a dedicated view so the signal narrative stays focused — no long scrolling between unrelated instruments.</p></div><div className="section-card-grid">{sectionCards.map((card) => <Link href={card.path} className={`section-card ${card.tone}`} key={card.path}><div className="section-card-top"><span className="card-number">{card.number}</span><ArrowUpRight size={15} /></div><h3>{card.title}</h3><p>{card.text}</p><span className="section-card-meta">{card.meta}</span></Link>)}</div></section>
    <section className="overview-ribbon"><div><Radio size={17} /><span>Adaptive payload status</span></div><div><b>Nominal</b><span>demo stream active</span></div><div><BatteryCharging size={17} /><span>72% payload power</span></div><div><Gauge size={17} /><span>184.0 m operating depth</span></div><div><Satellite size={17} /><span>ESP32–S3 connected</span></div></section>
    <PageFooter />
  </AuvShell>;
}
