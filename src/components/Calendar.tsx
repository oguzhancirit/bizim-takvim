import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { DayState, Person, Plan } from '../types';
import { WEEKDAYS, monthGrid, monthTitle, todayKey } from '../lib/dates';
import { personColor } from './ui';

export interface DayInfo {
  state: DayState;
  plan?: Plan;
  meBusy: boolean;
  partnerBusy: boolean;
}

interface Props {
  infoFor: (key: string) => DayInfo;
  onDay: (key: string) => void;
  me: Person;
  partner: Person | null;
  busyMode: boolean;
}

const LABEL: Record<DayState, string> = {
  past: 'geçmiş', free: 'ikiniz de boş', busy: 'dolu', draft: 'date taslağı', pending: 'onay bekliyor', date: 'date günü',
};

export function Calendar({ infoFor, onDay, me, partner, busyMode }: Props) {
  const now = new Date();
  const [{ y, m, dir }, setView] = useState({ y: now.getFullYear(), m: now.getMonth(), dir: 0 });
  const go = (d: number) =>
    setView(({ y, m }) => {
      const t = new Date(y, m + d, 1);
      return { y: t.getFullYear(), m: t.getMonth(), dir: d };
    });
  const today = todayKey();
  const grid = monthGrid(y, m);
  const isCurrent = y === now.getFullYear() && m === now.getMonth();

  return (
    <section className="card calendar" aria-label="Takvim">
      <header className="cal-head">
        <button className="icon-btn" onClick={() => go(-1)} aria-label="Önceki ay">‹</button>
        <AnimatePresence mode="popLayout" initial={false} custom={dir}>
          <motion.h2
            key={`${y}-${m}`}
            className="cal-title"
            custom={dir}
            initial={{ opacity: 0, y: dir >= 0 ? 12 : -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: dir >= 0 ? -12 : 12 }}
            transition={{ duration: 0.25 }}
          >
            {monthTitle(y, m)}
          </motion.h2>
        </AnimatePresence>
        <button className="icon-btn" onClick={() => go(1)} aria-label="Sonraki ay">›</button>
      </header>
      {!isCurrent && (
        <button className="today-link" onClick={() => setView({ y: now.getFullYear(), m: now.getMonth(), dir: y * 12 + m > now.getFullYear() * 12 + now.getMonth() ? -1 : 1 })}>
          Bugüne dön
        </button>
      )}

      <div className="weekdays">
        {WEEKDAYS.map((w) => <span key={w}>{w}</span>)}
      </div>

      <div className="grid-clip">
        <AnimatePresence mode="popLayout" initial={false} custom={dir}>
          <motion.div
            key={`${y}-${m}`}
            className="grid"
            custom={dir}
            initial={{ x: dir > 0 ? '40%' : '-40%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: dir > 0 ? '-40%' : '40%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.25}
            onDragEnd={(_, i) => (i.offset.x < -60 ? go(1) : i.offset.x > 60 ? go(-1) : null)}
          >
            {grid.map((c, i) => {
              const info = infoFor(c.key);
              const clickable = info.state !== 'past' || !!info.plan;
              return (
                <motion.button
                  key={c.key}
                  className={`day ${info.state}${c.inMonth ? '' : ' out'}${c.key === today ? ' today' : ''}${busyMode && info.meBusy ? ' mine' : ''}`}
                  disabled={!clickable}
                  onClick={() => onDay(c.key)}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: Math.min(i * 0.008, 0.3), duration: 0.22 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={`${c.day}, ${LABEL[info.state]}${info.meBusy ? ', sen dolusun' : ''}${info.partnerBusy ? `, ${partner?.name ?? 'partnerin'} dolu` : ''}`}
                >
                  <span className="num">{c.day}</span>
                  {info.state === 'date' && <span className="mark" aria-hidden>✦</span>}
                  {(info.state === 'draft' || info.state === 'pending') && <span className="mini-mark" aria-hidden>✎</span>}
                  {info.state !== 'past' && (info.meBusy || info.partnerBusy) && (
                    <span className="who" aria-hidden>
                      {info.meBusy && <i style={{ background: personColor(me.uid, [me, partner]) }} />}
                      {info.partnerBusy && <i style={{ background: personColor(partner?.uid ?? '', [me, partner]) }} />}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      <ul className="legend">
        <li><i className="lg free" />İkiniz de boş</li>
        <li><i className="lg busy" />Dolu</li>
        <li><i className="lg draft" />Planlanıyor</li>
        <li><i className="lg date" />Date günü</li>
      </ul>
    </section>
  );
}
