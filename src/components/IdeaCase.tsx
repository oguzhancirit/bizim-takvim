import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, animate, motion, useMotionValue } from 'motion/react';
import { IDEAS, TIERS, ideaById, pickIdea, type Idea } from '../lib/ideas';
import { sparkle } from '../lib/confetti';
import { prefersReducedMotion, spring } from '../lib/motion';

/**
 * Günün kasası: günde bir kez açılır, şeritte fikirler kayar ve biri seçilir.
 * Sadece fikir verir: plana, bildirime ya da sunucuya bağlı değildir. Son açılış bu cihazda (localStorage) tutulur.
 */
const KEY = 'gunun-kasasi';
const DAY = 24 * 60 * 60 * 1000;
const ITEM_W = 104;
const GAP = 8;
const STEP = ITEM_W + GAP;
const REEL_LEN = 46;
const WIN_AT = 39;

type Saved = { at: number; id: string };

function load(): Saved | null {
  try {
    const s = JSON.parse(localStorage.getItem(KEY) ?? 'null') as Saved | null;
    if (s && typeof s.at === 'number' && ideaById(s.id) && Date.now() - s.at < DAY && s.at <= Date.now()) return s;
  } catch {
    /* yok say */
  }
  return null;
}

function lastId(): string | undefined {
  try {
    return (JSON.parse(localStorage.getItem(KEY) ?? 'null') as Saved | null)?.id;
  } catch {
    return undefined;
  }
}

function remaining(at: number) {
  const ms = Math.max(0, at + DAY - Date.now());
  const h = Math.floor(ms / 3600000);
  const m = Math.ceil((ms % 3600000) / 60000);
  if (h === 0) return `${Math.max(1, m)} dk`;
  return m === 60 ? `${h + 1} sa` : `${h} sa ${m} dk`;
}

/** Date'e uygun kasa: kurdeleli hediye sandığı. */
function CaseArt({ open }: { open: boolean }) {
  return (
    <svg className={`case-art${open ? ' open' : ''}`} viewBox="0 0 120 112" aria-hidden>
      <defs>
        <linearGradient id="kasa-govde" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff9a76" />
          <stop offset="1" stopColor="#e8603f" />
        </linearGradient>
        <linearGradient id="kasa-kapak" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffb08f" />
          <stop offset="1" stopColor="#f0764f" />
        </linearGradient>
        <radialGradient id="kasa-isik" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffe9a8" />
          <stop offset="1" stopColor="#ffe9a8" stopOpacity="0" />
        </radialGradient>
      </defs>
      <polygon className="case-hex" points="60,3 111,30 111,82 60,109 9,82 9,30" />
      <ellipse className="case-glow" cx="60" cy="52" rx="42" ry="26" fill="url(#kasa-isik)" />
      <ellipse cx="60" cy="96" rx="34" ry="4.5" fill="rgba(0,0,0,.16)" />
      {/* gövde */}
      <rect x="27" y="54" width="66" height="40" rx="7" fill="url(#kasa-govde)" />
      <rect x="27" y="54" width="66" height="7" fill="rgba(0,0,0,.12)" />
      <rect x="54" y="54" width="12" height="40" fill="#fff4e6" />
      <path d="M33 70h14M33 78h10M73 70h14M77 78h10" stroke="rgba(255,255,255,.35)" strokeWidth="2.4" strokeLinecap="round" />
      {/* kapak */}
      <g className="case-lid">
        <rect x="23" y="40" width="74" height="17" rx="6" fill="url(#kasa-kapak)" />
        <rect x="54" y="40" width="12" height="17" fill="#fff4e6" />
        <path d="M60 40c-5-11-19-13-20-5-1 7 12 7 20 5Zm0 0c5-11 19-13 20-5 1 7-12 7-20 5Z" fill="#fff4e6" stroke="#f3d9bf" strokeWidth="1" />
        <circle cx="60" cy="40" r="4.2" fill="#ffd166" />
      </g>
      {/* kilit etiketi */}
      <circle className="case-seal" cx="60" cy="66" r="8.5" fill="#ffd166" />
      <path className="case-seal" d="M60 60.2l1.7 3.9 4.2.4-3.2 2.8 1 4.1-3.7-2.2-3.7 2.2 1-4.1-3.2-2.8 4.2-.4z" fill="#b8742a" />
    </svg>
  );
}

function ReelItem({ idea }: { idea: Idea }) {
  return (
    <div className="reel-item" style={{ ['--tier' as string]: TIERS[idea.tier].color }}>
      <span className="reel-emoji">{idea.emoji}</span>
      <span className="reel-title">{idea.title}</span>
    </div>
  );
}

function Reel({ win, onDone }: { win: Idea; onDone: () => void }) {
  const [items] = useState(() => {
    // Şeritte çeşit olsun diye düz rastgele (yan yana aynı kart gelmez); kazanan ağırlıklı seçimle önceden belirlendi
    const list: Idea[] = [];
    for (let i = 0; i < REEL_LEN; i++) {
      if (i === WIN_AT) { list.push(win); continue; }
      let it: Idea;
      do it = IDEAS[Math.floor(Math.random() * IDEAS.length)];
      while (it.id === list[i - 1]?.id || ((i === WIN_AT - 1 || i === WIN_AT + 1) && it.id === win.id));
      list.push(it);
    }
    return list;
  });
  const view = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const done = useRef(onDone);
  done.current = onDone;

  useEffect(() => {
    const w = view.current?.offsetWidth ?? 320;
    const center = (i: number) => w / 2 - (i * STEP + ITEM_W / 2);
    const offset = (Math.random() - 0.5) * ITEM_W * 0.7;
    x.set(center(1));
    let t = 0;
    const spin = animate(x, center(WIN_AT) + offset, {
      duration: 6.4,
      ease: [0.1, 0.72, 0.1, 1],
      onComplete: () => {
        // Çizgi tam kazananın ortasına otursun
        animate(x, center(WIN_AT), { duration: 0.35, ease: 'easeOut' });
        t = window.setTimeout(() => done.current(), 900);
      },
    });
    return () => {
      spin.stop();
      window.clearTimeout(t);
    };
  }, [x]);

  return (
    <div className="reel" ref={view} aria-label="Fikirler kayıyor">
      <motion.div className="reel-strip" style={{ x }}>
        {items.map((it, i) => <ReelItem key={i} idea={it} />)}
      </motion.div>
      <span className="reel-marker" aria-hidden />
    </div>
  );
}

export function IdeaCase() {
  const [saved, setSaved] = useState<Saved | null>(load);
  const [stage, setStage] = useState<'closed' | 'opening' | 'spinning' | 'done'>(saved ? 'done' : 'closed');
  const [fresh, setFresh] = useState(false);
  const [, tick] = useState(0);
  const resultRef = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);

  // Geri sayım; süre dolunca kasa yeniden kapanır
  useEffect(() => {
    if (stage !== 'done' || !saved) return;
    const check = () => {
      if (Date.now() - saved.at >= DAY) {
        setSaved(null);
        setFresh(false);
        setStage('closed');
      } else tick((n) => n + 1);
    };
    const id = window.setInterval(check, 30000);
    document.addEventListener('visibilitychange', check);
    return () => {
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', check);
    };
  }, [stage, saved]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const open = () => {
    if (stage !== 'closed') return;
    const still = load(); // başka sekmede açıldıysa
    if (still) {
      setSaved(still);
      setStage('done');
      return;
    }
    const idea = pickIdea(lastId());
    const next = { at: Date.now(), id: idea.id };
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* gizli sekme: yine de açılır */
    }
    setSaved(next);
    setFresh(true);
    if (prefersReducedMotion()) {
      setStage('done');
      return;
    }
    setStage('opening');
    timer.current = window.setTimeout(() => setStage('spinning'), 850);
  };

  const idea = saved ? ideaById(saved.id) : undefined;
  const tier = idea ? TIERS[idea.tier] : undefined;

  useEffect(() => {
    if (stage === 'done' && fresh && tier) sparkle(resultRef.current, tier.color);
  }, [stage, fresh, tier]);

  return (
    <div className="idea-case" data-stage={stage}>
      <AnimatePresence mode="wait" initial={false}>
        {(stage === 'closed' || stage === 'opening') && (
          <motion.div key="closed" className="case-closed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.2 }}>
            <CaseArt open={stage === 'opening'} />
            <div className="case-copy">
              <strong>Günün kasası</strong>
              <p>İçinden Ankara'da yapılacak bir date fikri çıkar. Günde bir kez açılır.</p>
              <button className="btn primary sm" onClick={open} disabled={stage === 'opening'}>
                {stage === 'opening' ? 'Açılıyor…' : 'Kasayı aç'}
              </button>
            </div>
          </motion.div>
        )}

        {stage === 'spinning' && idea && (
          <motion.div key="spin" className="case-spin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <small>Kasa açıldı, fikir seçiliyor…</small>
            <Reel win={idea} onDone={() => setStage('done')} />
          </motion.div>
        )}

        {stage === 'done' && idea && tier && saved && (
          <motion.div
            key="done"
            ref={resultRef}
            className="case-result"
            style={{ ['--tier' as string]: tier.color }}
            initial={fresh ? { opacity: 0, scale: 0.86, y: 10 } : { opacity: 0 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={fresh ? spring : { duration: 0.2 }}
          >
            <span className="result-emoji">{idea.emoji}</span>
            <div className="result-text">
              <span className="tier-chip">{tier.label}</span>
              <strong>{idea.title}</strong>
              <p>{idea.detail}</p>
              <small className="result-next">Yeni kasa {remaining(saved.at)} sonra</small>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
