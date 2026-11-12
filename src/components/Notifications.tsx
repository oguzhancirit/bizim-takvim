import { AnimatePresence, motion } from 'motion/react';
import type { AppNotification } from '../types';
import { notifText, timeAgo } from '../lib/notifText';

export function NotificationList({ items, onOpen }: { items: AppNotification[]; onOpen: (n: AppNotification) => void }) {
  return (
    <div>
      <h3 className="panel-title">Bildirimler</h3>
      {items.length === 0 ? (
        <p className="hint">Henüz bildirim yok. Bir date planla, haber versin 📨</p>
      ) : (
        <ul className="notifs">
          {items.map((n, i) => {
            const t = notifText(n);
            return (
              <motion.li key={n.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.04, 0.3) }}>
                <button className={`notif${n.read ? '' : ' unread'}`} onClick={() => onOpen(n)}>
                  <span className="notif-icon">{t.icon}</span>
                  <span className="notif-text">
                    <strong>{t.title}</strong>
                    <small>{t.body}</small>
                  </span>
                  <time>{n.createdAt ? timeAgo(n.createdAt.toMillis()) : ''}</time>
                </button>
              </motion.li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export function Toast({ message }: { message: string | null }) {
  return (
    <div className="toast-wrap" aria-live="polite">
      <AnimatePresence>
        {message && (
          <motion.div
            key={message}
            className="toast"
            initial={{ opacity: 0, y: -30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function BellButton({ count, onClick }: { count: number; onClick: () => void }) {
  return (
    <motion.button
      className="icon-btn bell"
      onClick={onClick}
      aria-label={`Bildirimler${count ? `, ${count} okunmamış` : ''}`}
      key={count}
      animate={count ? { rotate: [0, -16, 14, -10, 8, 0] } : {}}
      transition={{ duration: 0.6 }}
    >
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
        <path fill="currentColor" d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22Zm7-6V11a7 7 0 0 0-5.5-6.84V3.5a1.5 1.5 0 0 0-3 0v.66A7 7 0 0 0 5 11v5l-1.7 1.7A1 1 0 0 0 4 19.4h16a1 1 0 0 0 .7-1.7Z" />
      </svg>
      <AnimatePresence>
        {count > 0 && (
          <motion.span className="badge" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: 'spring', stiffness: 500, damping: 20 }}>
            {count > 9 ? '9+' : count}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
