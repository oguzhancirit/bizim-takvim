import { useEffect, useId, useMemo, useRef, useState } from 'react';

/**
 * Magic UI "Dot Pattern" uyarlaması: SVG nokta ızgarası. `glow` açıkken rastgele seçilmiş
 * noktalar sırayla parlayıp büyür (sadece CSS animasyonu, her noktaya JS yok).
 */
export function DotPattern({
  gap = 18, r = 1.1, glow = false, glowCount = 36, className = '',
}: { gap?: number; r?: number; glow?: boolean; glowCount?: number; className?: string }) {
  const id = useId().replace(/:/g, '');
  const ref = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Parlayan noktalar boyut değişene kadar sabit kalır (her render'da yeniden rastgele olmaz).
  const glows = useMemo(() => {
    if (!glow || !size.w) return [];
    const cols = Math.floor(size.w / gap);
    const rows = Math.floor(size.h / gap);
    let seed = cols * 31 + rows;
    const rand = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
    return Array.from({ length: glowCount }, () => ({
      x: Math.floor(rand() * cols) * gap + gap / 2,
      y: Math.floor(rand() * rows) * gap + gap / 2,
      delay: rand() * 5,
      dur: 2 + rand() * 3,
    }));
  }, [glow, glowCount, gap, size.w, size.h]);

  return (
    <svg ref={ref} className={`dot-pattern ${className}`} aria-hidden>
      <defs>
        <pattern id={`dp-${id}`} width={gap} height={gap} patternUnits="userSpaceOnUse">
          <circle cx={gap / 2} cy={gap / 2} r={r} fill="currentColor" />
        </pattern>
        <radialGradient id={`dg-${id}`}>
          <stop offset="0%" stopColor="var(--rose)" stopOpacity="1" />
          <stop offset="100%" stopColor="var(--rose)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill={`url(#dp-${id})`} />
      {glows.map((g, i) => (
        <circle
          key={i}
          className="dot-glow"
          cx={g.x}
          cy={g.y}
          r={r * 3}
          fill={`url(#dg-${id})`}
          style={{ animationDelay: `${g.delay}s`, animationDuration: `${g.dur}s`, transformOrigin: `${g.x}px ${g.y}px` }}
        />
      ))}
    </svg>
  );
}
