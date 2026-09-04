// Tidal Instrument style: focused workflow page combining the supplied technical reference with a compact payload module card.
import { ArrowUpRight, BatteryCharging, Cpu, Gauge, Radio, RefreshCw, ShieldCheck } from "lucide-react";
import AuvShell from "@/components/AuvShell";
import { PageFooter, SectionLabel } from "@/components/SonarPrimitives";

const workflow = "/technical-workflow.svg";
const payload = "/auv-payload.svg";

const steps = [
  { number: "01", title: "Read sensors", text: "Capture depth, turbidity, temperature, and salinity from the ADC layer." },
  { number: "02", title: "Update parameters", text: "Select a frequency window and power profile for the current water column." },
  { number: "03", title: "Reconfigure waveform", text: "Synthesize the selected pulse family in the software-defined engine." },
  { number: "04", title: "Transmit", text: "Send the shaped sonar pulse through the high-speed DAC output." },
];

export default function Workflow() {
  return <AuvShell sectionTitle="TECHNICAL WORKFLOW">
    <section className="page-hero"><SectionLabel eyebrow="05 / technical workflow">From sensing to pulse</SectionLabel><div className="page-hero-row"><div><h1>A compact loop for<br /><em>adaptive transmission.</em></h1><p>The payload closes the loop between environmental context and acoustic output — with a small, power-aware control surface built for AUV missions.</p></div><div className="page-hero-stat"><RefreshCw size={19} /><span>Parameter update rate</span><b>10 Hz / &lt; 10 ms</b></div></div></section>
    <section className="page-content workflow-page"><div className="workflow-layout"><div className="workflow-image"><img src={workflow} alt="Technical workflow diagram for the adaptive sonar transmitter" /><div className="image-overlay">Provided system reference <ArrowUpRight size={14} /></div></div><div className="payload-card"><div className="payload-image"><img src={payload} alt="Compact cylindrical AUV sonar payload" /></div><div className="payload-copy"><span className="eyebrow">Payload module</span><h2>Built for the<br /><em>quiet mission.</em></h2><p>Compact, waterproof, and power-aware. The control loop reads sensors, updates parameters, reconfigures the waveform, then transmits.</p><div className="payload-tags"><span>IP68 enclosure</span><span>AUV mountable</span><span>DMA transfer</span></div></div></div></div></section>
    <section className="workflow-steps"><div className="workflow-steps-head"><SectionLabel eyebrow="Control loop">One pass, four decisions</SectionLabel><span className="mono">STM32H7 / ESP32–S3</span></div><div className="workflow-step-grid">{steps.map((step) => <article key={step.number}><span className="workflow-step-number">{step.number}</span><h3>{step.title}</h3><p>{step.text}</p></article>)}</div></section>
    <section className="workflow-ribbon"><div><Cpu size={18} /><span><b>32-bit</b> processing core</span></div><div><Gauge size={18} /><span><b>16-bit</b> DAC resolution</span></div><div><BatteryCharging size={18} /><span><b>&lt; 10 mA</b> target draw</span></div><div><ShieldCheck size={18} /><span><b>IP68</b> enclosure intent</span></div><div><Radio size={18} /><span><b>Software-defined</b> output</span></div></section>
    <PageFooter />
  </AuvShell>;
}
