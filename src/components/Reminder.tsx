import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { Aurora } from './magic/Aurora';
import { AnimatedGradientText } from './magic/AnimatedGradientText';
import { DiaTextReveal } from './magic/DiaTextReveal';
import { DotPattern } from './magic/DotPattern';
import { Floating3DParticles } from './magic/Floating3DParticles';
import { ShimmerButton } from './magic/ShimmerButton';
import { SpinningText } from './magic/SpinningText';
import { prefersReducedMotion } from '../lib/motion';

/** Kelimeleri sırayla bulanıktan netleştirerek getirir. */
function BlurWords({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <p className="blur-words" aria-label={text}>
      {text.split(' ').map((w, i) => (
        <motion.span
          key={i}
          aria-hidden
          initial={{ opacity: 0, y: 10, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ delay: delay + i * 0.07, duration: 0.45 }}
        >
          {w}
        </motion.span>
      ))}
    </p>
  );
}

/**
 * Uygulama her açıldığında çıkan hatırlatma: "{partner}'ye vakit ayırmayı unutma".
 * "Tamam, söz" deyince yıldız patlaması + ekran butondan başlayarak dairesel kapanır ve takvim açılır.
 */
export function Reminder({ nameDative, onDone }: { nameDative: string | null; onDone: () => void }) {
  const [leaving, setLeaving] = useState(false);
  const [origin, setOrigin] = useState('50% 80%');
  const btn = useRef<HTMLButtonElement>(null);

  const promise = () => {
    const r = btn.current?.getBoundingClientRect();
    if (r) {
      const x = r.left + r.width / 2, y = r.top + r.height / 2;
      setOrigin(`${x}px ${y}px`);
      if (!prefersReducedMotion()) {
        confetti({
          particleCount: 60, spread: 360, startVelocity: 22, gravity: 0.4, ticks: 70, scalar: 0.9, shapes: ['star'],
          colors: ['#ffd166', '#f6a04d', '#ef6a4c', '#ffffff'], origin: { x: x / innerWidth, y: y / innerHeight }, zIndex: 1001,
        });
      }
    }
    setLeaving(true);
  };

  return (
    <AnimatePresence onExitComplete={onDone}>
      {!leaving && (
        <motion.div
          className="reminder"
          role="dialog"
          aria-label="Hatırlatma"
          initial={{ clipPath: `circle(150% at ${origin})` }}
          animate={{ clipPath: `circle(150% at ${origin})` }}
          exit={{ clipPath: `circle(0% at ${origin})` }}
          transition={{ duration: 0.75, ease: [0.65, 0, 0.35, 1] }}
        >
          <Aurora />
          <DotPattern glow glowCount={30} className="reminder-dots" />
          <Floating3DParticles quantity={300} mobileFactor={0.45} />

          <motion.div className="reminder-in" exit={{ y: -40, opacity: 0, filter: 'blur(6px)' }} transition={{ duration: 0.45 }}>
            <motion.div className="reminder-orbit" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 180, damping: 16 }}>
              <SpinningText text="KÜÇÜK BİR HATIRLATMA • KÜÇÜK BİR HATIRLATMA •" radius={9.5} duration={18} />
              <span className="reminder-emoji">⏳</span>
            </motion.div>

            {nameDative ? (
              <>
                <motion.h1 className="reminder-name" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.25, duration: 0.5 }}>
                  <AnimatedGradientText from="var(--rose)" to="var(--p2)" speed={1.4}>{nameDative}</AnimatedGradientText>
                </motion.h1>
                <DiaTextReveal as="h2" text="vakit ayırmayı unutma" className="reminder-line" delay={0.6} duration={1.5} />
              </>
            ) : (
              <DiaTextReveal as="h2" text="Birbirinize vakit ayırmayı unutmayın" className="reminder-line" delay={0.3} duration={1.6} />
            )}

            <BlurWords text="Plan yapmak kolay, asıl güzel olan o zamanı gerçekten ayırmak." delay={1.6} />

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.3, type: 'spring', stiffness: 220, damping: 20 }}>
              <ShimmerButton ref={btn} className="big promise-btn" onClick={promise}>
                Tamam, söz 🤞
              </ShimmerButton>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
