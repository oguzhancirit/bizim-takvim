import { useEffect, useRef } from 'react';
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from 'motion/react';

const BAND = 17;
const DEFAULT_COLORS = ['#f6a04d', '#e8603f', '#ff9a7a', '#ffd166', '#3f7fd6'];
const ease = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);

/**
 * Magic UI "Dia Text Reveal" uyarlaması: renkli bir bant metnin üzerinden soldan sağa geçer,
 * bandın solu yazı rengine oturur, sağı henüz görünmez.
 */
export function DiaTextReveal({
  text, colors = DEFAULT_COLORS, textColor = 'var(--ink)', duration = 1.5, delay = 0, className = '', as = 'span',
}: {
  text: string; colors?: string[]; textColor?: string; duration?: number; delay?: number; className?: string;
  as?: 'span' | 'h1' | 'h2' | 'strong';
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });
  const reduce = useReducedMotion();
  const pos = useMotionValue(-BAND);

  const bg = useTransform(pos, (p) => {
    if (p >= 100 + BAND) return `linear-gradient(90deg, ${textColor}, ${textColor})`;
    const start = p - BAND;
    const step = (BAND * 2) / (colors.length - 1);
    const stops = colors.map((c, i) => `${c} ${(start + i * step).toFixed(2)}%`).join(', ');
    return `linear-gradient(90deg, ${textColor} 0%, ${textColor} ${start.toFixed(2)}%, ${stops}, transparent ${(p + BAND).toFixed(2)}%, transparent 100%)`;
  });

  useEffect(() => {
    if (reduce) return pos.set(100 + BAND);
    if (!inView) return;
    pos.set(-BAND);
    const c = animate(pos, 100 + BAND, { duration, delay, ease });
    return () => c.stop();
  }, [inView, reduce, text, duration, delay, pos]);

  const Tag = motion[as];
  return (
    <Tag ref={ref as never} className={`dia ${className}`} style={{ backgroundImage: bg }} aria-label={text}>
      {text}
    </Tag>
  );
}
