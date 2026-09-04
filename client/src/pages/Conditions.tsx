// Tidal Instrument style: focused water-condition page with calibrated frequency windows, attenuation bars, and field-guide notes.
import { ArrowUpRight, Droplets, SlidersHorizontal, Waves } from "lucide-react";
import AuvShell from "@/components/AuvShell";
import { PageFooter, SectionLabel } from "@/components/SonarPrimitives";

const conditions = [
  { name: "Clear / low turbidity", note: "Best detail and longest usable range", band: "18–30 kHz", attenuation: "Low", accent: "#78c8c2", width: "86%", metric: "detail priority" },
  { name: "Mildly turbid", note: "Balanced starting band for mixed columns", band: "10–20 kHz", attenuation: "Moderate", accent: "#a8b7d4", width: "62%", metric: "balanced" },
  { name: "Muddy / high solids", note: "Favor penetration over fine detail", band: "4–12 kHz", attenuation: "Higher", accent: "#d9b98b", width: "39%", metric: "penetration priority" },
];

export default function Conditions() {
  return <AuvShell sectionTitle="WATER CONDITIONS">
    <section className="page-hero"><SectionLabel eyebrow="03 / water conditions">Frequency follows the medium</SectionLabel><div className="page-hero-row"><div><h1>Every water column<br /><em>has a different voice.</em></h1><p>Higher frequencies resolve more detail but attenuate faster. Suspended sediment and mud scatter energy, so the payload can move down-band for a more resilient return.</p></div><div className="page-hero-stat"><Droplets size={19} /><span>Current profile</span><b>31.8 NTU / turbid</b></div></div></section>
    <section className="page-content conditions-page"><div className="conditions-page-head"><div><span className="eyebrow">Transmission guide / 03</span><h2>Start with the column.</h2></div><div className="condition-scale"><span>low loss</span><div><i /></div><span>high loss</span></div></div><div className="condition-list">{conditions.map((condition) => <article className="condition-row condition-row-large" key={condition.name}><div className="condition-row-top"><div><h3>{condition.name}</h3><p>{condition.note}</p></div><strong>{condition.band}</strong></div><div className="calibration-chip"><span>CAL / 04</span><b>{condition.metric}</b><span>± 2 kHz</span></div><div className="attenuation"><span>relative transmission window</span><div><i style={{ width: condition.width, backgroundColor: condition.accent }} /></div><b>{condition.attenuation}</b></div></article>)}</div></section>
    <section className="page-note"><SlidersHorizontal size={17} /><div><b>Engineering note</b><p>These frequency bands are engineering starting points, not universal limits. Confirm against transducer bandwidth, depth, temperature, salinity, target size, and measured noise before deployment.</p></div><a href="/telemetry" className="text-link">Inspect sensor data <ArrowUpRight size={14} /></a></section>
    <section className="water-facts"><div><Waves size={18} /><span><b>Sound speed</b> changes with temperature, salinity, and pressure.</span></div><div><Droplets size={18} /><span><b>Suspended solids</b> increase scattering and absorption.</span></div></section>
    <PageFooter />
  </AuvShell>;
}
