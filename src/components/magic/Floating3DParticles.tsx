import { useEffect, useRef } from 'react';

interface P { angle: number; radius: number; y: number; speed: number; size: number; alpha: number; }

function rgba(hex: string, a: number) {
  const h = hex.replace('#', '');
  const f = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const n = parseInt(f, 16);
  if (Number.isNaN(n) || f.length !== 6) return `rgba(232,96,63,${a})`;
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

/**
 * Magic UI "Floating 3D Particles" uyarlaması (Canvas 2D, WebGL yok): parçacıklar merkez ekseni
 * etrafında perspektifle döner ve yavaşça yukarı süzülür. Yakındakiler büyük ve parlak.
 * Görünmezken ve sekme arka plandayken durur; hareketi azalt açıksa tek kare çizer.
 */
export function Floating3DParticles({
  quantity = 260, colors = ['#e8603f', '#f6a04d', '#3f7fd6'], size = 3.2, opacity = 0.35, drift = 0.35, depth = 0.6, className = '',
}: { quantity?: number; colors?: string[]; size?: number; opacity?: number; drift?: number; depth?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const t = Math.min(1, Math.max(0, depth));
    const fov = 800 - t * 600;
    const dist = 100 + t * 700;
    const range = t * Math.min(400, fov + dist - 1);
    let w = 0, h = 0, raf = 0, visible = true;
    let parts: (P & { color: string })[] = [];

    const spawn = (anyY: boolean): P & { color: string } => {
      const maxR = Math.max(w, h) * 0.75;
      return {
        angle: Math.random() * Math.PI * 2,
        radius: Math.sqrt(Math.random()) * maxR,
        y: anyY ? (Math.random() - 0.5) * h * 1.4 : h * 0.7,
        speed: 0.0015 + Math.random() * 0.001,
        size: size * (0.6 + Math.random() * 0.8),
        alpha: Math.min(1, Math.max(0.05, opacity + (Math.random() - 0.5) * 0.4)),
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    };

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(w < 768 ? quantity * 0.35 : quantity);
      parts = Array.from({ length: n }, () => spawn(true));
      draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2, cy = h / 2;
      const proj = parts.map((p) => {
        const s = fov / (fov + dist + Math.sin(p.angle) * range);
        return { x: cx + Math.cos(p.angle) * p.radius * s, y: cy + p.y * s, s, p };
      });
      proj.sort((a, b) => a.s - b.s);
      for (const { x, y, s, p } of proj) {
        ctx.beginPath();
        ctx.fillStyle = rgba(p.color, Math.min(1, p.alpha * (0.5 + s)));
        ctx.arc(x, y, Math.max(0.3, p.size * s), 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const tick = () => {
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        p.angle += p.speed;
        p.y -= drift;
        if (p.y < -h * 0.75) parts[i] = spawn(false);
      }
      draw();
      raf = requestAnimationFrame(tick);
    };
    const start = () => { if (!reduce && visible && !document.hidden && !raf) raf = requestAnimationFrame(tick); };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; visible ? start() : stop(); });
    io.observe(canvas);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVis);
    resize();
    start();
    return () => { stop(); ro.disconnect(); io.disconnect(); document.removeEventListener('visibilitychange', onVis); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quantity, size, opacity, drift, depth]);

  return <canvas ref={ref} className={`particles ${className}`} aria-hidden />;
}
