// Tidal Instrument style: focused telemetry page with structured ESP32 readings, tabular values, and calm signal history.
import { useEffect, useState } from "react";
import { Activity, ArrowUpRight, Gauge, Layers3, RefreshCw, Satellite, Thermometer, Waves, Wind } from "lucide-react";
import AuvShell from "@/components/AuvShell";
import { PageFooter, SectionLabel } from "@/components/SonarPrimitives";

type Esp32Status = {
  distance?: number;
  turbidity?: number;
  turbRaw?: number;
  turbVoltage?: number;
  temperature?: number;
  bmeOk?: boolean;
  bmeTemp?: number;
  bmeHum?: number;
  bmePress?: number;
  bmeGas?: number;
  humidity?: number;
  bmeTemperature?: number;
  pressure?: number;
  gasResistance?: number;
  salinity?: number;
};

const esp32StatusUrl = import.meta.env.VITE_ESP32_STATUS_URL as string | undefined;

export default function Telemetry() {
  const [live, setLive] = useState(true);
  const [tick, setTick] = useState(0);
  const [deviceStatus, setDeviceStatus] = useState<Esp32Status | null>(null);
  const [deviceOnline, setDeviceOnline] = useState(false);
  useEffect(() => { const interval = window.setInterval(() => setTick((value) => value + 1), 2500); return () => window.clearInterval(interval); }, []);
  useEffect(() => {
    if (!esp32StatusUrl || !live) return;

    let cancelled = false;
    const readStatus = async () => {
      try {
        const response = await fetch(esp32StatusUrl, { cache: "no-store" });
        if (!response.ok) throw new Error(`ESP32 returned ${response.status}`);
        const status = (await response.json()) as Esp32Status;
        if (cancelled) return;
        setDeviceStatus(status);
        setDeviceOnline(true);
      } catch {
        if (!cancelled) setDeviceOnline(false);
      }
    };

    readStatus();
    const interval = window.setInterval(readStatus, 1000);
    return () => { cancelled = true; window.clearInterval(interval); };
  }, [live]);

  const demoSensors = [
    { label: "Depth", value: `${(184 + (tick % 3) * 0.4).toFixed(1)}`, unit: "m", icon: Waves, trend: "0.4%" },
    { label: "Turbidity", value: `${(31.8 + (tick % 4) * 0.7).toFixed(1)}`, unit: "NTU", icon: Layers3, trend: "2.1%" },
    { label: "Temperature", value: `${(18.6 + (tick % 3) * 0.1).toFixed(1)}`, unit: "°C", icon: Thermometer, trend: "0.2%" },
    { label: "Humidity", value: "62.4", unit: "%", icon: Wind, trend: "0.3%" },
    { label: "BME temp", value: "18.8", unit: "°C", icon: Thermometer, trend: "0.2%" },
    { label: "Pressure", value: "1012.6", unit: "hPa", icon: Gauge, trend: "0.1%" },
    { label: "Gas resistance", value: "84.2", unit: "kΩ", icon: Activity, trend: "1.4%" },
    { label: "Salinity", value: `${(34.2 + (tick % 2) * 0.1).toFixed(1)}`, unit: "PSU", icon: Gauge, trend: "0.1%" },
  ];
  const sensors = [
    { ...demoSensors[0], value: deviceStatus?.distance?.toFixed(1) ?? demoSensors[0].value },
    { ...demoSensors[1], value: deviceStatus?.turbidity?.toFixed(1) ?? deviceStatus?.turbVoltage?.toFixed(2) ?? demoSensors[1].value, unit: deviceStatus?.turbidity === undefined && deviceStatus?.turbVoltage !== undefined ? "V" : demoSensors[1].unit },
    { ...demoSensors[2], value: deviceStatus?.temperature?.toFixed(1) ?? demoSensors[2].value },
    { ...demoSensors[3], value: deviceStatus?.bmeOk === false ? "--" : (deviceStatus?.humidity ?? deviceStatus?.bmeHum)?.toFixed(1) ?? "--" },
    { ...demoSensors[4], value: deviceStatus?.bmeOk === false ? "--" : (deviceStatus?.bmeTemperature ?? deviceStatus?.bmeTemp)?.toFixed(1) ?? "--" },
    { ...demoSensors[5], value: deviceStatus?.bmeOk === false ? "--" : (deviceStatus?.pressure ?? deviceStatus?.bmePress)?.toFixed(1) ?? "--" },
    { ...demoSensors[6], value: deviceStatus?.bmeOk === false ? "--" : (deviceStatus?.gasResistance ?? deviceStatus?.bmeGas)?.toFixed(1) ?? "--" },
    { ...demoSensors[7], value: deviceStatus?.salinity?.toFixed(1) ?? demoSensors[7].value },
  ];
  return <AuvShell sectionTitle="SENSOR TELEMETRY">
    <section className="page-hero telemetry-page-hero"><SectionLabel eyebrow="04 / environmental sensors">Live environmental context</SectionLabel><div className="page-hero-row"><div><h1>ESP32 telemetry,<br /><em>structured.</em></h1><p>Monitor the environmental values that shape every transmission. This frontend preview uses representative values and is ready for a live ESP32 transport.</p></div><div className="page-hero-stat"><Satellite size={19} /><span>Device packet</span><b>ESP32–S3 / 12-bit ADC</b></div></div></section>
    <section className="page-content telemetry-page-content"><div className="telemetry-head"><div><span className="eyebrow">Environment packet / 04</span><h2>Read the column.</h2></div><div className="telemetry-controls"><span className="demo-pill"><i className="pulse" /> {esp32StatusUrl ? (deviceOnline ? "ESP32 connected" : "ESP32 offline") : "demo stream"}</span><button className="live-toggle" onClick={() => setLive(!live)}>{live ? "Pause" : "Resume"}<RefreshCw size={14} /></button></div></div><div className="sensor-grid">{sensors.map((sensor) => { const Icon = sensor.icon; return <article className="sensor-card" key={sensor.label}><div className="sensor-card-top"><span className="sensor-icon"><Icon size={17} /></span><span className="mono">ADC / {sensor.label.toUpperCase()}</span><ArrowUpRight size={14} /></div><div className="sensor-value"><b>{sensor.value}</b><span>{sensor.unit}</span></div><div className="sensor-card-bottom"><span>{live ? "updated just now" : "last packet received"}</span><strong>↗ {sensor.trend}</strong></div></article>; })}</div><div className="telemetry-lower"><div className="spark-panel"><div className="spark-header"><span><Activity size={16} /> 30 min signal history</span><span className="mono">normalized</span></div><div className="spark-chart"><div className="plot-grid" /><svg viewBox="0 0 500 120" preserveAspectRatio="none"><path d="M0,83 C25,74 32,45 55,60 S86,104 110,73 S135,30 158,56 S184,91 206,62 S235,43 252,71 S276,93 301,58 S324,27 345,45 S369,95 393,68 S424,40 448,52 S477,75 500,30" /></svg><span>12:00</span><span>12:15</span><span>12:30</span></div></div><div className="stream-card"><div className="stream-top"><Satellite size={17} /><span>ESP32–S3 / ADC</span><b>12-bit</b></div><p>{esp32StatusUrl ? "Reading sensor packets from the ESP32 over Wi-Fi." : "Set VITE_ESP32_STATUS_URL to read live ESP32 packets over Wi-Fi."}</p><code>{`{ distance: 184.0, turbVoltage: 1.2, temperature: 18.6 }`}</code><a href="/workflow" className="text-link">View data contract <ArrowUpRight size={14} /></a></div></div></section>
    <PageFooter />
  </AuvShell>;
}
