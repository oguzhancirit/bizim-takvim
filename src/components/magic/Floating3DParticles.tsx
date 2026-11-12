import { useEffect, useRef } from 'react';

interface P { angle: number; radius: number; y: number; speed: number; size: number; alpha: number; sprite: number; spin: number; rot: number; }

/** Hafif kalpler + date etkinliği simgeleri. */
export const DATE_ICONS = ['🤍', '🩷', '⛺', '🎬', '☕', '🍿', '🎡', '🎳', '🍝', '🚲', '🎵', '📸', '🌅', '🍦', '🎨', '🛶', '🎲', '🌸', '✨', '🧁'];

/** Her simge bir kez küçük bir tuvale çizilir; her karede metin çizmekten çok daha ucuz (iPhone için önemli). */
function makeSprite(icon: string) {
  const c = document.createElement('canvas');
  const s = 72;
  c.width = c.height = s;
  const g = c.getContext('2d')!;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.font = `${s * 0.78}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`;
  g.fillText(icon, s / 2, s / 2 + s * 0.04);
  return c;
}

/**
 * Magic UI "Floating 3D Particles" uyarlaması (Canvas 2D, WebGL yok): kalp ve etkinlik simgeleri merkez
 * ekseni etrafında perspektifle döner, hafifçe sallanarak yukarı süzülür; yakındakiler büyük ve net.
 * iPhone için: DPR en fazla 2, küçük ekranda daha az parçacık, sekme/alan görünmezken durur,
 * hareketi azalt açıksa tek kare çizer.
 */
export function Floating3DParticles({
  quantity = 70,
  icons = DATE_ICONS,
  size = 22,
  opacity = 0.42,
  drift = 0.35,
  depth = 0.8,
  mobileFactor = 0.55,
  className = '',
}: {
  quantity?: number; icons?: string[]; size?: number; opacity?: number; drift?: number; depth?: number;
  mobileFactor?: number; className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const sprites = icons.map(makeSprite);
    const t = Math.min(1, Math.max(0, depth));
    const fov = 800 - t * 600;
    const dist = 100 + t * 700;
    const range = t * Math.min(400, fov + dist - 1);
    let w = 0, h = 0, raf = 0, visible = true, last = 0, dpr = 1;
    let parts: P[] = [];

    const spawn = (anyY: boolean): P => ({
      angle: Math.random() * Math.PI * 2,
      radius: Math.sqrt(Math.random()) * Math.max(w, h) * 0.8,
      y: anyY ? (Math.random() - 0.5) * h * 1.6 : h * 0.85,
      speed: 0.0012 + Math.random() * 0.0013,
      size: size * (0.6 + Math.random() * 0.7),
      alpha: Math.min(1, Math.max(0.12, opacity + (Math.random() - 0.5) * 0.25)),
      sprite: Math.floor(Math.random() * sprites.length),
      spin: (Math.random() - 0.5) * 0.012,
      rot: (Math.random() - 0.5) * 0.6,
    });

    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = canvas.clientWidth; h = canvas.clientHeight;
      if (!w || !h) return;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const weak = (navigator.hardwareConcurrency ?? 8) <= 4;
      const factor = (w < 768 ? mobileFactor : 1) * (weak ? 0.6 : 1);
      parts = Array.from({ length: Math.round(quantity * factor) }, () => spawn(true));
      draw();
    };

    const proj: { x: number; y: number; s: number; p: P }[] = [];
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2, cy = h / 2;
      proj.length = 0;
      for (const p of parts) {
        const s = fov / (fov + dist + Math.sin(p.angle) * range);
        proj.push({ x: cx + Math.cos(p.angle) * p.radius * s, y: cy + p.y * s, s, p });
      }
      proj.sort((a, b) => a.s - b.s); // uzaktakiler önce (ressam algoritması)
      for (const { x, y, s, p } of proj) {
        const d = p.size * s * 4;
        ctx.globalAlpha = Math.min(1, p.alpha * (0.45 + s * 0.8));
        ctx.setTransform(dpr * Math.cos(p.rot), dpr * Math.sin(p.rot), -dpr * Math.sin(p.rot), dpr * Math.cos(p.rot), dpr * x, dpr * y);
        ctx.drawImage(sprites[p.sprite], -d / 2, -d / 2, d, d);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalAlpha = 1;
    };

    const tick = (now: number) => {
      // Kare süresine göre ölçekle: 60 Hz ve 120 Hz (ProMotion iPhone) aynı hızda görünür.
      const k = last ? Math.min(3, (now - last) / 16.67) : 1;
      last = now;
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        p.angle += p.speed * k;
        p.y -= drift * k;
        p.rot += p.spin * k;
        if (Math.abs(p.rot) > 0.5) p.spin = -p.spin; // hafif sallanma
        if (p.y < -h * 0.85) parts[i] = spawn(false);
      }
      draw();
      raf = requestAnimationFrame(tick);
    };
    const start = () => { if (!reduce && visible && !document.hidden && !raf) { last = 0; raf = requestAnimationFrame(tick); } };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); else stop(); });
    io.observe(canvas);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVis);
    resize();
    start();
    return () => { stop(); ro.disconnect(); io.disconnect(); document.removeEventListener('visibilitychange', onVis); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quantity, size, opacity, drift, depth, mobileFactor, icons.join('')]);

  return <canvas ref={ref} className={`particles ${className}`} aria-hidden />;
}
