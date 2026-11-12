import { AnimatePresence, motion } from 'motion/react';
import type { Plan } from '../types';
import { longDate } from '../lib/dates';

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
            <div className="big-heart beat">♥</div>
            <p className="eyebrow">Date ayarlandı!</p>
            <h2>{plan.title || 'Bizim günümüz'}</h2>
            <p className="cele-date">{longDate(plan.date)}{plan.time ? ` · ${plan.time}` : ''}</p>
            {plan.place && <p className="cele-place">📍 {plan.place}</p>}
            <button className="btn primary" onClick={onClose}>Yaşasın 💕</button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
