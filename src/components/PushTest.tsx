import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { Person } from '../types';
import { enablePush, localTestNotification, pushDiagnostics, type PushDiag, type PushState } from '../lib/push';
import { sendTestNotification, useSyncStatus } from '../lib/store';

const STATE_TEXT: Record<PushState, string> = {
  granted: 'Açık ✅',
  default: 'Henüz sorulmadı',
  denied: 'Reddedildi ❌',
  'needs-install': 'Önce Ana Ekrana Ekle',
  unsupported: 'Bu tarayıcı desteklemiyor',
};

/** Zil panelinin altında: küçük bir satır, basınca yerinde açılan bildirim testi + teşhis. */
export function PushTest({ me, onToast }: { me: Person; onToast: (m: string) => void }) {
  const [open, setOpen] = useState(false);
  const [diag, setDiag] = useState<PushDiag | null>(null);
  const [busy, setBusy] = useState(false);
  const [lastAsk, setLastAsk] = useState<string | null>(null);
  const synced = useSyncStatus();

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

  // İzin isteği: kullanıcı dokunuşunun içinde, ilk iş olarak çağrılır (iOS bunu şart koşar)
  const ask = async () => {
    setBusy(true);
    try {
      const r = await enablePush(me.uid);
      setLastAsk(r);
      onToast(r === 'granted' ? 'Bildirimler açıldı 🔔' : 'İzin verilmedi, aşağıdaki adımlara bak');
    } catch (e) {
      setLastAsk('hata: ' + ((e as Error).message || 'bilinmiyor').slice(0, 80));
    } finally {
      setBusy(false);
      check();
    }
  };

  const notInstalled = diag?.ios && !diag.standalone;
  const denied = diag?.state === 'denied' || (lastAsk !== null && lastAsk !== 'granted');

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
              <div className="pt-row"><span>Açılış</span><b>{diag ? (diag.standalone ? 'Ana ekran uygulaması ✅' : 'Tarayıcı sekmesi') : '…'}</b></div>
              <div className="pt-row"><span>Adres</span><b>{diag ? (diag.rightHost ? 'Doğru ✅' : 'Eski adres ⚠️') : '…'}</b></div>
              <div className="pt-row"><span>Bildirim izni</span><b>{diag ? STATE_TEXT[diag.state] : '…'}</b></div>
              <div className="pt-row"><span>Bu cihaz kayıtlı</span><b>{diag ? (diag.registered ? 'Evet ✅' : 'Hayır') : '…'}</b></div>
              <div className="pt-row"><span>Verilerin</span><b>{synced === null ? 'Kontrol ediliyor…' : synced ? 'Hepsi sunucuda ✅' : 'Gönderiliyor… (internete bağlan)'}</b></div>
              {lastAsk && <div className="pt-row"><span>Son izin isteği</span><b>{lastAsk === 'granted' ? 'Verildi ✅' : lastAsk === 'denied' ? 'Reddedildi' : lastAsk}</b></div>}

              {diag?.state === 'default' && !notInstalled && (
                <button className="btn soft" disabled={busy} onClick={ask}>Bildirimleri aç</button>
              )}

              {notInstalled && (
                <p className="pt-help">
                  iPhone'da bildirim sadece <b>ana ekrandan açılan</b> uygulamada çalışır: Safari'de Paylaş → <b>Ana Ekrana Ekle</b>,
                  sonra uygulamayı ana ekrandaki simgeden aç ve burada "Bildirimleri aç"a bas.
                </p>
              )}

              {denied && !notInstalled && (
                <div className="pt-help">
                  <b>İzin reddedilmiş görünüyor. Sırayla dene:</b>
                  <ol>
                    <li>iPhone <b>Ayarlar → Bildirimler</b> listesinde <b>Date Takvimi</b>'ni bul → <b>Bildirimlere İzin Ver</b>.</li>
                    <li>Listede yoksa: yukarıda <b>"Verilerin: Hepsi sunucuda ✅"</b> yazdığından emin ol, sonra ana ekrandaki simgeyi sil.</li>
                    <li>Safari'de <b>bizim-takvim-48b62.firebaseapp.com</b> aç → Paylaş → <b>Ana Ekrana Ekle</b>.</li>
                    <li>Ana ekrandaki simgeden aç → giriş yap → zil → burada <b>"Bildirimleri aç"</b> → çıkan pencerede <b>İzin Ver</b>.</li>
                  </ol>
                </div>
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
