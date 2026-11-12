import { useState } from 'react';
import { motion } from 'motion/react';
import { AnimatedGradientText, GradientPill } from './magic/AnimatedGradientText';
import { DiaTextReveal } from './magic/DiaTextReveal';
import { DotPattern } from './magic/DotPattern';
import { Floating3DParticles } from './magic/Floating3DParticles';
import { ScrollVelocityContainer, ScrollVelocityRow } from './magic/ScrollVelocity';
import { ShimmerButton } from './magic/ShimmerButton';
import { SpinningText } from './magic/SpinningText';
import { TextReveal } from './magic/TextReveal';

export const IDEAS_A = ['☕ Kahve', '🎬 Sinema', '🌅 Gün batımı', '🍝 Akşam yemeği', '🎨 Sergi', '🎳 Bowling', '🚲 Bisiklet'];
export const IDEAS_B = ['🎵 Konser', '🌳 Piknik', '🍦 Dondurma', '🎲 Kutu oyunu', '📸 Fotoğraf turu', '🛶 Sahil yürüyüşü', '🍳 Kahvaltı'];

export function IdeaMarquee() {
  return (
    <ScrollVelocityContainer className="idea-marquee">
      <ScrollVelocityRow baseVelocity={3}>
        {IDEAS_A.map((t) => <span key={t} className="idea-chip">{t}</span>)}
      </ScrollVelocityRow>
      <ScrollVelocityRow baseVelocity={3} direction={-1}>
        {IDEAS_B.map((t) => <span key={t} className="idea-chip alt">{t}</span>)}
      </ScrollVelocityRow>
    </ScrollVelocityContainer>
  );
}

const GoogleIcon = () => (
  <svg viewBox="0 0 48 48" width="20" height="20" aria-hidden>
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
    <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
  </svg>
);

const STEPS = [
  { n: '01', cls: 'busy', title: 'Dolu günlerini işaretle', body: 'Müsait olmadığın günlere dokun, kırmızıya dönsün. Karşı taraf da aynısını yapar.' },
  { n: '02', cls: 'draft', title: 'Yeşil günde birlikte planla', body: 'İkinizin de boş olduğu günü ayır; saat, yer ve etkinlikleri ortak taslağa ikiniz de yazın.' },
  { n: '03', cls: 'date', title: 'Onaya gönder, belli olsun', body: 'Karşı tarafa bildirim gider. Onaylandığı an konfeti patlar ve gün takvimde işaretlenir.' },
];

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
    <main className="landing">
      <section className="land-hero">
        <DotPattern glow className="land-dots" />
        <Floating3DParticles className="land-particles" />
        <div className="land-hero-in">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <GradientPill>
              ✨ <AnimatedGradientText>İki kişilik ortak takvim</AnimatedGradientText>
            </GradientPill>
          </motion.div>

          <motion.div className="logo-orbit" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 0.1 }}>
            <SpinningText text="BOŞ GÜNÜ BUL • PLANLA • ONAYLA •" radius={9} duration={16} />
            <img src={`${import.meta.env.BASE_URL}icons/icon.svg`} alt="" className="gate-logo" />
          </motion.div>

          <DiaTextReveal as="h1" text="Date Takvimi" className="land-title" duration={1.6} delay={0.3} />
          <motion.p className="land-sub" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
            Boş günleri bulalım, date'leri birlikte planlayalım.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}>
            <ShimmerButton className="big google-shimmer" onClick={signIn}>
              <GoogleIcon /> Google ile giriş yap
            </ShimmerButton>
          </motion.div>
          {err && <p className="error">{err}</p>}

          <motion.span className="scroll-cue" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}>
            Nasıl çalışır <span className="cue-arrow">↓</span>
          </motion.span>
        </div>
      </section>

      <IdeaMarquee />

      <section className="land-how">
        <TextReveal
          text="Dolu günlerini işaretle. İkinizin de boş olduğu günler yeşil yanar. Birini seç, etkinlikleri birlikte yazın, onaya gönder. Onaylandığı an date belli."
          highlight={{ yeşil: 'var(--free)', onaya: 'var(--amber)', belli: 'var(--rose)' }}
        />
      </section>

      <section className="land-steps">
        {STEPS.map((s, i) => (
          <motion.article
            key={s.n}
            className={`step-card ${s.cls}`}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ type: 'spring', stiffness: 220, damping: 24, delay: i * 0.08 }}
          >
            <span className="step-n">{s.n}</span>
            <h3>{s.title}</h3>
            <p>{s.body}</p>
          </motion.article>
        ))}
      </section>

      <section className="land-cta">
        <DotPattern className="cta-dots" />
        <DiaTextReveal as="h2" text="Hadi bir gün seçelim" duration={1.4} />
        <ShimmerButton className="big google-shimmer" onClick={signIn}>
          <GoogleIcon /> Google ile giriş yap
        </ShimmerButton>
      </section>
    </main>
  );
}

export function Denied({ email, onSignOut }: { email: string | null; onSignOut: () => void }) {
  return (
    <main className="gate">
      <DotPattern className="land-dots" />
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
    <main className="gate" aria-label="Yükleniyor">
      <div className="loader-orbit">
        <SpinningText text="YÜKLENİYOR • DATE TAKVİMİ •" radius={6} duration={6} />
        <span className="loader-dot" />
      </div>
    </main>
  );
}
