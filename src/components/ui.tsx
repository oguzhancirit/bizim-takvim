import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useDragControls } from 'motion/react';
import type { Person } from '../types';
import { firstName } from '../lib/dates';
import { spring } from '../lib/motion';

/** İki kişinin her iki cihazda da aynı renkte görünmesi için uid'ye göre sabit renk. */
export function personColor(uid: string, people: (Person | null)[]) {
  const uids = people.map((p) => p?.uid ?? '').sort();
  return uid && uids[0] === uid ? 'var(--p1)' : 'var(--p2)';
}

export function Avatar({ person, color, size = 32, ring = false }: { person: Person | null; color: string; size?: number; ring?: boolean }) {
  const [broken, setBroken] = useState(false);
  const initial = person ? firstName(person.name).charAt(0).toLocaleUpperCase('tr-TR') : '?';
  return (
    <span className={`avatar${ring ? ' ring' : ''}`} style={{ width: size, height: size, background: color, fontSize: size * 0.42 }}>
      {person?.photoURL && !broken ? (
        <img src={person.photoURL} alt="" referrerPolicy="no-referrer" onError={() => setBroken(true)} />
      ) : (
        initial
      )}
    </span>
  );
}

/** Alttan açılan sayfa: yaylı giriş, aşağı sürükleyerek kapatma, Esc ile kapatma. */
export function Sheet({ open, onClose, children, label }: { open: boolean; onClose: () => void; children: ReactNode; label: string }) {
  const controls = useDragControls();
  const [kb, setKb] = useState({ bottom: 0, height: 0 });
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);

    // Arka sayfa kaymasın (iPhone klavye açınca tüm sayfayı kaydırıp öğeleri üst üste bindiriyordu)
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = 'hidden';

    // Klavye: görünür alan küçülünce panel klavyenin üstünde dursun ve yüksekliği ona göre ayarlansın
    const vv = window.visualViewport;
    const update = () => {
      if (!vv) return;
      const bottom = Math.max(0, window.innerHeight - (vv.height + vv.offsetTop));
      setKb({ bottom, height: vv.height });
    };
    vv?.addEventListener('resize', update);
    vv?.addEventListener('scroll', update);
    update();

    // Odaklanan kutuyu panelin içinde görünür yere kaydır
    const onFocus = (e: FocusEvent) => {
      const t = e.target as HTMLElement;
      if (t.matches('input, textarea')) setTimeout(() => t.scrollIntoView({ block: 'center', behavior: 'smooth' }), 300);
    };
    document.addEventListener('focusin', onFocus);

    return () => {
      window.removeEventListener('keydown', onKey);
      html.style.overflow = prevOverflow;
      vv?.removeEventListener('resize', update);
      vv?.removeEventListener('scroll', update);
      document.removeEventListener('focusin', onFocus);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="sheet-root" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
          <div className="backdrop" onClick={onClose} />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={label}
            className="sheet"
            style={kb.bottom > 0 ? { marginBottom: kb.bottom, maxHeight: kb.height - 8 } : undefined}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={spring}
            drag="y"
            dragListener={false}
            dragControls={controls}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => (info.offset.y > 120 || info.velocity.y > 600) && onClose()}
          >
            <div className="sheet-grip" onPointerDown={(e) => controls.start(e)}>
              <span />
            </div>
            <div className="sheet-body">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Canlı senkron input: karşı tarafın yazdıkları anında gelir, sen yazarken üzerine yazılmaz. */
export function SyncedInput({
  value, onSave, disabled, placeholder, type = 'text', className = 'field', ariaLabel, maxLength,
}: {
  value: string; onSave: (v: string) => void; disabled?: boolean; placeholder?: string; type?: string; className?: string; ariaLabel?: string;
  /** Sunucu kurallarındaki sınırla aynı olmalı (firestore.rules) */
  maxLength?: number;
}) {
  const [local, setLocal] = useState(value);
  const focused = useRef(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!focused.current) setLocal(value);
  }, [value]);

  // Yazı kaybolmasın: sayfa kapanırken/arka plana geçerken bekleyen değişikliği hemen gönder
  const latest = useRef({ local, value, onSave });
  latest.current = { local, value, onSave };
  useEffect(() => {
    const save = () => {
      const { local: l, value: v, onSave: s } = latest.current;
      if (focused.current && l !== v) {
        window.clearTimeout(timer.current);
        s(l);
      }
    };
    const onVis = () => document.visibilityState === 'hidden' && save();
    window.addEventListener('pagehide', save);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      save();
      window.removeEventListener('pagehide', save);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  const flush = (v: string) => {
    window.clearTimeout(timer.current);
    if (v !== value) onSave(v);
  };

  return (
    <input
      className={className}
      type={type}
      value={local}
      disabled={disabled}
      maxLength={maxLength}
      placeholder={placeholder}
      aria-label={ariaLabel ?? placeholder}
      onFocus={() => (focused.current = true)}
      onBlur={() => {
        focused.current = false;
        flush(local);
      }}
      onChange={(e) => {
        const v = e.target.value;
        setLocal(v);
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => onSave(v), 600);
      }}
      onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
    />
  );
}

export function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} className={`switch${checked ? ' on' : ''}`} onClick={() => onChange(!checked)}>
      <motion.span layout transition={spring} className="knob" />
    </button>
  );
}
