import { useState } from 'react';
import { motion } from 'motion/react';

function FloatingDots() {
  return (
    <div className="dots-bg" aria-hidden>
      {Array.from({ length: 14 }, (_, i) => (
        <span key={i} style={{ left: `${(i * 37) % 100}%`, animationDelay: `${(i * 0.9) % 7}s`, fontSize: `${8 + ((i * 7) % 14)}px` }}>●</span>
      ))}
    </div>
  );
}

export function Login({ onSignIn }: { onSignIn: () => Promise<void> }) {
  const [err, setErr] = useState('');
  const signIn = async () => {
    setErr('');
    try {
      await onSignIn();
    } catch {
      setErr('Giriş yapılamadı, tekrar dener misin?');
    }
  };
  return (
    <main className="gate">
      <FloatingDots />
      <motion.div className="gate-card" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 22 }}>
        <motion.img src={`${import.meta.env.BASE_URL}icons/icon.svg`} alt="" className="gate-logo" animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }} />
        <h1>Date Takvimi</h1>
        <p>Boş günleri bulalım, date'leri birlikte planlayalım.</p>
        <motion.button className="btn google" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={signIn}>
          <svg viewBox="0 0 48 48" width="20" height="20" aria-hidden><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>
          Google ile giriş yap
        </motion.button>
        {err && <p className="error">{err}</p>}
      </motion.div>
    </main>
  );
}

export function Denied({ email, onSignOut }: { email: string | null; onSignOut: () => void }) {
  return (
    <main className="gate">
      <div className="gate-card">
        <div className="gate-emoji">🔒</div>
        <h1>Bu takvim özel</h1>
        <p>{email ?? 'Bu hesap'} bu takvime ekli değil.</p>
        <button className="btn ghost" onClick={onSignOut}>Başka hesapla dene</button>
      </div>
    </main>
  );
}

export function NotConfigured() {
  return (
    <main className="gate">
      <div className="gate-card">
        <div className="gate-emoji">🛠️</div>
        <h1>Kurulum bekleniyor</h1>
        <p><code>src/firebase-config.ts</code> içine Firebase ayarlarını yapıştır (README'deki adımlar).</p>
      </div>
    </main>
  );
}

export function Loading() {
  return (
    <main className="gate">
      <div className="loader" aria-label="Yükleniyor" />
    </main>
  );
}
