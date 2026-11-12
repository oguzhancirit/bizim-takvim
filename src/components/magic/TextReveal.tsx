import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react';

/**
 * Magic UI "Text Reveal" uyarlaması: sayfa kaydırıldıkça kelimeler sırayla soluk halden
 * tam görünür hale gelir. `highlight` içindeki kelimeler vurgu renginde yanar.
 */
export function TextReveal({
  text, className = '', highlight = {}, offset = ['start 0.9', 'end 0.45'],
}: { text: string; className?: string; highlight?: Record<string, string>; offset?: [string, string] }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: offset as never });
  const words = text.split(' ');
  return (
    <p ref={ref} className={`text-reveal ${className}`}>
      {words.map((w, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} reduce={!!reduce} color={Object.entries(highlight).find(([h]) => w.includes(h))?.[1]}>
          {w}
        </Word>
      ))}
    </p>
  );
}

function Word({ children, progress, range, reduce, color }: { children: string; progress: MotionValue<number>; range: [number, number]; reduce: boolean; color?: string }) {
  const opacity = useTransform(progress, range, [0, 1]);
  const y = useTransform(progress, range, [6, 0]);
  return (
    <span className="tr-word">
      <span className="tr-ghost">{children}</span>
      <motion.span className="tr-live" style={reduce ? { color } : { opacity, y, color }}>{children}</motion.span>
    </span>
  );
}
