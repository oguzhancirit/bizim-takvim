import { useEffect, useRef } from 'react';

interface P { angle: number; radius: number; y: number; speed: number; size: number; alpha: number; sprite: number; }

/** Her renk için bir kez çizilen yumuşak, parlayan nokta (her karede gradyan hesaplamaktan çok daha ucuz). */
function makeSprite(color: string) {
  const c = document.createElement('canvas');
  const s = 64;
  c.width = c.height = s;
  const g = c.getContext('2d')!;
  const grd = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  grd.addColorStop(0, '#ffffff');
  grd.addColorStop(0.18, color);
  grd.addColorStop(0.45, color + '88');
  grd.addColorStop(1, color + '00');
  g.fillStyle = grd;
  g.fillRect(0, 0, s, s);
  return c;
}

/**
 * Magic UI "Floating 3D Particles" uyarlaması (Canvas 2D, WebGL yok): parlayan parçacıklar merkez
 * ekseni etrafında perspektifle döner ve yukarı süzülür; yakındakiler büyük ve parlak.
 * iPhone için: DPR en fazla 2, küçük ekranda daha az parçacık, sekme/alan görünmezken durur,
 * hareketi azalt açıksa tek kare çizer.
 */
export function Floating3DParticles({
  quantity = 320,
  colors = ['#ef6a4c', '#f6a04d', '#5fa8ff', '#ffd166'],
  size = 6,
  opacity = 0.75,
  drift = 0.45,
  depth = 0.8,
  mobileFactor = 0.4,
  className = '',
}: {
  quantity?: number; colors?: string[]; size?: number; opacity?: number; drift?: number; depth?: number;
  mobileFactor?: number; className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const sprites = colors.map(makeSprite);
    const t = Math.min(1, Math.max(0, depth));
    const fov = 800 - t * 600;
    const dist = 100 + t * 700;
    const range = t * Math.min(400, fov + dist - 1);
    let w = 0, h = 0, raf = 0, visible = true, last = 0;
    let parts: P[] = [];

    const spawn = (anyY: boolean): P => ({
      angle: Math.random() * Math.PI * 2,
      radius: Math.sqrt(Math.random()) * Math.max(w, h) * 0.8,
      y: anyY ? (Math.random() - 0.5) * h * 1.6 : h * 0.85,
      speed: 0.0012 + Math.random() * 0.0013,
      size: size * (0.5 + Math.random()),
      alpha: Math.min(1, Math.max(0.15, opacity + (Math.random() - 0.5) * 0.4)),
      sprite: Math.floor(Math.random() * sprites.length),
    });

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
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
        const d = p.size * s * 4; // sprite'ın parlama halesi dahil çapı
        ctx.globalAlpha = Math.min(1, p.alpha * (0.35 + s * 0.9));
        ctx.drawImage(sprites[p.sprite], x - d / 2, y - d / 2, d, d);
      }
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
  }, [quantity, size, opacity, drift, depth, mobileFactor]);

  return <canvas ref={ref} className={`particles ${className}`} aria-hidden />;
}
