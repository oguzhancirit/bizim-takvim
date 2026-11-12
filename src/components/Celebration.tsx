import { AnimatePresence, motion } from 'motion/react';
import type { Plan } from '../types';
import { longDate } from '../lib/dates';
import { DiaTextReveal } from './magic/DiaTextReveal';
import { Floating3DParticles } from './magic/Floating3DParticles';
import { ShimmerButton } from './magic/ShimmerButton';

export function Celebration({ plan, onClose }: { plan: Pick<Plan, 'date' | 'title' | 'time' | 'place'> | null; onClose: () => void }) {
  return (
    <AnimatePresence>
      {plan && (
        <motion.div className="celebrate-root" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div
            className="celebrate-card"
            role="dialog"
            aria-label="Date ayarlandı"
            initial={{ scale: 0.6, y: 40, rotate: -4 }}
            animate={{ scale: 1, y: 0, rotate: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Floating3DParticles className="cele-particles" quantity={40} size={18} drift={0.6} opacity={0.6} mobileFactor={0.8} />
            <div className="big-emoji pop">🎉</div>
            <p className="eyebrow">Date ayarlandı!</p>
            <DiaTextReveal as="h2" text={plan.title || 'Date'} delay={0.25} />
            <p className="cele-date">{longDate(plan.date)}{plan.time ? ` · ${plan.time}` : ''}</p>
            {plan.place && <p className="cele-place">📍 {plan.place}</p>}
            <ShimmerButton className="big" onClick={onClose}>Harika!</ShimmerButton>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
