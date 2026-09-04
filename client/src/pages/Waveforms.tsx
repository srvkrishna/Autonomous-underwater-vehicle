// Tidal Instrument style: focused waveform laboratory page with calm plotted traces and operational specification blocks.
import { useState } from "react";
import { ArrowUpRight, CircleHelp, Radio, SlidersHorizontal } from "lucide-react";
import AuvShell from "@/components/AuvShell";
import { MiniWave, PageFooter, SectionLabel } from "@/components/SonarPrimitives";

const waveforms = [
  { id: "lfm", number: "01", name: "LFM chirp", kicker: "Linear frequency modulation", description: "A continuous sweep through a controlled band. Its long time–bandwidth product gives the receiver processing gain while keeping transmitted pulse energy modest.", range: "8–28 kHz", tone: "teal", points: "0,44 18,40 35,30 55,16 78,7 100,4", best: "Balanced range and resolution" },
  { id: "phase", number: "02", name: "Phase-coded pulse", kicker: "Discrete phase sequence", description: "A sequence of phase reversals packs a sharp autocorrelation peak into a short pulse. It is useful when timing resolution and sidelobe behavior matter.", range: "12–24 kHz", tone: "sand", points: "0,36 14,36 14,12 27,12 27,43 40,43 40,18 54,18 54,38 68,38 68,8 82,8 82,32 100,32", best: "Timing resolution and coding" },
  { id: "geo", number: "03", name: "Geometric sweep", kicker: "Logarithmic frequency motion", description: "A sweep whose rate follows a geometric progression. More time is spent in the lower band, helping preserve useful energy as absorption rises with frequency.", range: "6–22 kHz", tone: "blue", points: "0,42 16,42 31,40 45,35 58,27 70,18 82,10 100,4", best: "Penetration through higher loss" },
];

export default function Waveforms() {
  const [active, setActive] = useState("lfm");
  const waveform = waveforms.find((item) => item.id === active) ?? waveforms[0];
  return <AuvShell sectionTitle="WAVEFORM LIBRARY">
    <section className="page-hero"><SectionLabel eyebrow="02 / waveform library">Three ways to speak underwater</SectionLabel><div className="page-hero-row"><div><h1>Choose the waveform<br /><em>the water can carry.</em></h1><p>Waveform synthesis is the control layer between live conditions and a useful return. Compare the three families used by the payload.</p></div><div className="page-hero-stat"><Radio size={19} /><span>Active synthesis</span><b>32-bit FFT / NPT</b></div></div></section>
    <section className="page-content waveform-library-page"><div className="wave-tabs">{waveforms.map((item) => <button key={item.id} className={active === item.id ? "selected" : ""} onClick={() => setActive(item.id)}><span>{item.number}</span>{item.name}</button>)}</div><div className="wave-detail"><div className="wave-detail-head"><div><span className="eyebrow">{waveform.kicker}</span><h2>{waveform.name}</h2></div><span className="frequency-tag">{waveform.range}</span></div><p>{waveform.description}</p><div className="wave-plot wave-plot-large"><div className="plot-grid" /><MiniWave points={waveform.points} tone={waveform.tone} /><span className="plot-start">f₀</span><span className="plot-end">f₁</span><span className="plot-axis">time →</span></div><div className="wave-specs"><span><b>Pulse length</b>48 ms</span><span><b>Bandwidth</b>20 kHz</span><span><b>Processing gain</b>+16 dB</span><span><b>Best suited to</b>{waveform.best}</span></div></div></section>
    <section className="page-note"><SlidersHorizontal size={17} /><div><b>How to read this page</b><p>Choose one waveform family above to update the plot and operating notes. The final band should be constrained by the transducer profile and live environmental telemetry.</p></div></section>
    <PageFooter />
  </AuvShell>;
}
