// Tidal Instrument style: small reusable instrument primitives for section labels and plotted signal traces.
const mark = "/sonar-mark.svg";

export function SectionLabel({ eyebrow, children }: { eyebrow: string; children: React.ReactNode }) {
  return <div className="section-label"><span className="label-mark"><img src={mark} alt="" /></span><span className="eyebrow">{eyebrow}</span><span className="label-rule" /><span>{children}</span></div>;
}

export function MiniWave({ points, tone = "teal" }: { points: string; tone?: string }) {
  return <svg className={`mini-wave ${tone}`} viewBox="0 0 100 50" preserveAspectRatio="none" aria-hidden="true"><polyline points={points} fill="none" vectorEffect="non-scaling-stroke" /></svg>;
}

export function PageFooter() {
  return <footer className="footer"><div><img src={mark} alt="" /><b>AUV SONAR</b><span>adaptive transmitter payload</span></div><p>Interface concept · Frontend-only preview · Sensor readings are representative demo values</p><a href="/" className="text-link">Back to overview <span aria-hidden="true">↗</span></a></footer>;
}
