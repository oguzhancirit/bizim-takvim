import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import {
  motion, useAnimationFrame, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, useVelocity, type MotionValue,
} from 'motion/react';

const Ctx = createContext<MotionValue<number> | null>(null);

/** Magic UI "Scroll Based Velocity" uyarlaması: satırlar kendi kendine kayar, sayfa kaydırıldıkça hızlanır ve yön değiştirir. */
export function ScrollVelocityContainer({ children, className = '' }: { children: ReactNode; className?: string }) {
  const { scrollY } = useScroll();
  const v = useVelocity(scrollY);
  const smooth = useSpring(v, { damping: 50, stiffness: 400 });
  const factor = useTransform(smooth, (x) => Math.sign(x) * Math.min(5, (Math.abs(x) / 1000) * 5));
  return (
    <Ctx.Provider value={factor}>
      <div className={`sv-container ${className}`}>{children}</div>
    </Ctx.Provider>
  );
}

const wrap = (min: number, max: number, v: number) => {
  const r = max - min;
  return ((((v - min) % r) + r) % r) + min;
};

export function ScrollVelocityRow({ children, baseVelocity = 4, direction = 1 }: { children: ReactNode; baseVelocity?: number; direction?: 1 | -1 }) {
  const factor = useContext(Ctx);
  const reduce = useReducedMotion();
  const block = useRef<HTMLDivElement>(null);
  const row = useRef<HTMLDivElement>(null);
  const [unit, setUnit] = useState(0);
  const [copies, setCopies] = useState(3);
  const baseX = useMotionValue(0);
  const dir = useRef<number>(direction);
  const visible = useRef(true);
  const x = useTransform(baseX, (v) => (unit ? `${-wrap(0, unit, v)}px` : '0px'));

  useEffect(() => {
    const measure = () => {
      const bw = block.current?.offsetWidth ?? 0;
      const cw = row.current?.parentElement?.offsetWidth ?? 0;
      setUnit(bw);
      if (bw) setCopies(Math.max(3, Math.ceil(cw / bw) + 2));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (block.current) ro.observe(block.current);
    if (row.current?.parentElement) ro.observe(row.current.parentElement);
    const io = new IntersectionObserver(([e]) => (visible.current = e.isIntersecting));
    if (row.current) io.observe(row.current);
    return () => { ro.disconnect(); io.disconnect(); };
  }, []);

  useAnimationFrame((_, dt) => {
    if (reduce || !unit || !visible.current || document.hidden) return;
    const vf = factor?.get() ?? 0;
    if (vf < -0.1) dir.current = -direction;
    else if (vf > 0.1) dir.current = direction;
    baseX.set(baseX.get() + ((unit * baseVelocity) / 100) * dir.current * (1 + Math.abs(vf)) * (dt / 1000));
  });

  return (
    <div className="sv-row-clip">
      <motion.div ref={row} className="sv-row" style={{ x }}>
        {Array.from({ length: copies }, (_, i) => (
          <div key={i} ref={i === 0 ? block : undefined} className="sv-block" aria-hidden={i > 0}>
            {children}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
