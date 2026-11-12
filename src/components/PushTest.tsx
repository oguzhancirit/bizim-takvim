import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { Person } from '../types';
import { enablePush, localTestNotification, pushDiagnostics, type PushState } from '../lib/push';
import { sendTestNotification } from '../lib/store';

const STATE_TEXT: Record<PushState, string> = {
  granted: 'Açık ✅',
  default: 'Henüz sorulmadı',
  denied: 'Kapalı ❌ (Ayarlar → Bildirimler)',
  'needs-install': 'Önce Ana Ekrana Ekle',
  unsupported: 'Bu tarayıcı desteklemiyor',
};

/** Zil panelinin altında: küçük bir satır, basınca yerinde açılan bildirim testi. */
export function PushTest({ me, onToast }: { me: Person; onToast: (m: string) => void }) {
  const [open, setOpen] = useState(false);
  const [diag, setDiag] = useState<{ state: PushState; registered: boolean } | null>(null);
  const [busy, setBusy] = useState(false);

  const check = async () => setDiag(await pushDiagnostics(me.uid));
  const toggle = () => {
    setOpen((o) => !o);
    if (!open) check();
  };

  const run = async (fn: () => Promise<unknown>, ok: string) => {
    setBusy(true);
    try {
      await fn();
      onToast(ok);
    } catch (e) {
      console.error(e);
      onToast('Olmadı, tekrar dener misin?');
    } finally {
      setBusy(false);
      check();
    }
  };

  return (
    <div className="push-test">
      <button className="push-test-toggle" onClick={toggle} aria-expanded={open}>
        🔔 Bildirimleri test et <span className={`chev${open ? ' up' : ''}`}>⌄</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="push-test-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            <div className="push-test-in">
              <div className="pt-row"><span>Bildirim izni</span><b>{diag ? STATE_TEXT[diag.state] : '…'}</b></div>
              <div className="pt-row"><span>Bu cihaz kayıtlı</span><b>{diag ? (diag.registered ? 'Evet ✅' : 'Hayır') : '…'}</b></div>

              {diag?.state === 'default' && (
                <button className="btn soft" disabled={busy} onClick={() => run(() => enablePush(me.uid), 'Bildirimler açıldı 🔔')}>Bildirimleri aç</button>
              )}
              {diag?.state === 'granted' && (
                <>
                  <button className="btn soft" disabled={busy} onClick={() => run(localTestNotification, 'Telefonda bildirim çıkmış olmalı')}>
                    Hemen dene (bu cihaz)
                  </button>
                  <button className="btn ghost" disabled={busy} onClick={() => run(() => sendTestNotification(me), 'Sırada! 5–15 dk içinde telefona gelir')}>
                    Sunucudan dene (gerçek push)
                  </button>
                  <p className="hint small">
                    "Hemen dene" cihazın bildirim gösterebildiğini kontrol eder. "Sunucudan dene" uygulama kapalıyken gelen gerçek
                    bildirimi gönderir. Uygulamayı kapatıp bekle, 5–15 dakika içinde gelmesi gerekir.
                  </p>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
