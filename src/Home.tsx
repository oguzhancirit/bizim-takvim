import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { signOut, type User } from 'firebase/auth';
import { auth } from './firebase';
import type { AppNotification, Plan } from './types';
import { daysUntil, firstName, longDate, todayKey } from './lib/dates';
import { markRead, setBusyDay, useBusy, useNotifications, usePeople, usePlans } from './lib/store';
import { celebrate } from './lib/confetti';
import { enablePush, listenForeground, pushState, registerSW, type PushState } from './lib/push';
import { notifText } from './lib/notifText';
import { spring } from './lib/motion';
import { Calendar, type DayInfo } from './components/Calendar';
import { DayPanel } from './components/DayPanel';
import { BellButton, NotificationList, Toast } from './components/Notifications';
import { Celebration } from './components/Celebration';
import { Avatar, Sheet, personColor } from './components/ui';

const STATUS_ORDER = { accepted: 0, pending: 1, draft: 2 } as const;

export default function Home({ user }: { user: User }) {
  const { me, partner } = usePeople(user);
  const busy = useBusy();
  const plans = usePlans();
  const { items: notifs, loaded } = useNotifications(me.email);

  const [selected, setSelected] = useState<string | null>(null);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [busyMode, setBusyMode] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [cele, setCele] = useState<Pick<Plan, 'date' | 'title' | 'time' | 'place'> | null>(null);
  const [push, setPush] = useState<PushState>('unsupported');
  const [pushDismissed, setPushDismissed] = useState(() => {
    try {
      return localStorage.getItem('push-banner') === 'off';
    } catch {
      return false;
    }
  });

  const toastTimer = useRef<number | undefined>(undefined);
  const showToast = useCallback((m: string) => {
    setToast(m);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 3200);
  }, []);

  useEffect(() => {
    registerSW().catch(() => {});
    listenForeground().catch(() => {});
    pushState().then(setPush).catch(() => {});
  }, []);

  /* Gün bilgisi: plan > geçmiş > dolu > boş */
  const plansByDay = useMemo(() => {
    const m = new Map<string, Plan>();
    [...plans]
      .sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status])
      .forEach((p) => !m.has(p.date) && m.set(p.date, p));
    return m;
  }, [plans]);

  const today = todayKey();
  const infoFor = useCallback(
    (key: string): DayInfo => {
      const plan = plansByDay.get(key);
      const meBusy = busy[me.uid]?.has(key) ?? false;
      const partnerBusy = partner?.uid ? (busy[partner.uid]?.has(key) ?? false) : false;
      const state = plan
        ? plan.status === 'accepted'
          ? 'date'
          : plan.status
        : key < today
          ? 'past'
          : meBusy || partnerBusy
            ? 'busy'
            : 'free';
      return { state, plan, meBusy, partnerBusy };
    },
    [plansByDay, busy, me.uid, partner?.uid, today],
  );

  /* Yeni bildirim gelince: toast; onay bildirimi ise konfeti + kutlama kartı */
  const seen = useRef<Set<string> | null>(null);
  useEffect(() => {
    if (!loaded) return;
    const first = seen.current === null;
    if (first) seen.current = new Set();
    const fresh = notifs.filter((n) => !seen.current!.has(n.id));
    fresh.forEach((n) => seen.current!.add(n.id));
    const newAccepted = fresh.find((n) => n.type === 'accepted' && !n.read);
    if (newAccepted) {
      const p = plans.find((x) => x.id === newAccepted.planId);
      setCele(p ?? { date: newAccepted.date, title: newAccepted.title, time: '', place: '' });
      celebrate();
      markRead([newAccepted.id]);
    } else if (!first) {
      const n = fresh.find((x) => !x.read);
      if (n) {
        const t = notifText(n);
        showToast(`${t.icon} ${t.title}`);
      }
    }
  }, [notifs, loaded, plans, showToast]);

  const unread = notifs.filter((n) => !n.read);
  const openNotifs = () => {
    setShowNotifs(true);
    markRead(unread.map((n) => n.id));
  };
  const openFromNotif = (n: AppNotification) => {
    setShowNotifs(false);
    setBusyMode(false);
    setTimeout(() => setSelected(n.date), 220);
  };

  const onDay = (key: string) => {
    if (busyMode) {
      const isBusy = busy[me.uid]?.has(key) ?? false;
      setBusyDay(me.uid, key, !isBusy);
      return;
    }
    setSelected(key);
  };

  /* Öne çıkan kart: bana gelen onay isteği > sıradaki date */
  const waitingForMe = plans
    .filter((p) => p.status === 'pending' && p.sentBy !== me.uid && p.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))[0];
  const nextDate = plans
    .filter((p) => p.status === 'accepted' && p.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))[0];
  const pName = partner ? firstName(partner.name) : 'Partnerin';

  const askPush = async () => {
    try {
      const r = await enablePush(me.uid);
      setPush(r as PushState);
      showToast(r === 'granted' ? 'Bildirimler açıldı 🔔' : 'Bildirim izni verilmedi');
    } catch (e) {
      console.error(e);
      showToast('Bildirim açılamadı');
    }
  };
  const dismissPush = () => {
    setPushDismissed(true);
    try {
      localStorage.setItem('push-banner', 'off');
    } catch {
      /* yok say */
    }
  };

  return (
    <div className="app">
      <Toast message={toast} />

      <header className="topbar">
        <button className="couple" onClick={() => setShowMenu(true)} aria-label="Menü">
          <Avatar person={me} color={personColor(me.uid, [me, partner])} size={38} ring />
          <span className="couple-heart">♥</span>
          <Avatar person={partner} color={personColor(partner?.uid ?? '', [me, partner])} size={38} ring />
        </button>
        <div className="hello">
          <small>Merhaba {firstName(me.name)}</small>
          <strong>Sen & {pName}</strong>
        </div>
        <BellButton count={unread.length} onClick={openNotifs} />
      </header>

      <AnimatePresence>
        {!pushDismissed && (push === 'default' || push === 'needs-install') && (
          <motion.div className="banner" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <div className="banner-in">
              <span>🔔</span>
              {push === 'needs-install' ? (
                <p>
                  Telefona bildirim için: Safari'de <b>Paylaş → Ana Ekrana Ekle</b>, sonra uygulamayı oradan aç.
                </p>
              ) : (
                <p>{pName} date planlayınca haberin olsun mu?</p>
              )}
              {push === 'default' && (
                <button className="btn primary sm" onClick={askPush}>
                  Aç
                </button>
              )}
              <button className="x" aria-label="Kapat" onClick={dismissPush}>
                ×
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait" initial={false}>
        {waitingForMe ? (
          <motion.button
            key={`w-${waitingForMe.id}`}
            className="hero invite"
            onClick={() => setSelected(waitingForMe.date)}
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={spring}
          >
            <span className="hero-emoji wiggle">💌</span>
            <span>
              <small>{pName} seni date'e çağırıyor</small>
              <strong>{waitingForMe.title || 'Bir sürpriz'}</strong>
              <em>{longDate(waitingForMe.date)} · Bakmak için dokun</em>
            </span>
          </motion.button>
        ) : nextDate ? (
          <motion.button
            key={`n-${nextDate.id}`}
            className="hero next"
            onClick={() => setSelected(nextDate.date)}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={spring}
          >
            <span className="countdown">
              <b>{daysUntil(nextDate.date) === 0 ? 'Bugün!' : daysUntil(nextDate.date)}</b>
              {daysUntil(nextDate.date) > 0 && <small>gün</small>}
            </span>
            <span>
              <small>Sıradaki date</small>
              <strong>{nextDate.title || 'Bizim günümüz'}</strong>
              <em>
                {longDate(nextDate.date)}
                {nextDate.time ? ` · ${nextDate.time}` : ''}
              </em>
            </span>
          </motion.button>
        ) : (
          <motion.div key="empty" className="hero empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <span className="hero-emoji">🌿</span>
            <span>
              <strong>Yeşil bir gün seç</strong>
              <em>ikinizin de boş olduğu günlerde date planlayabilirsin</em>
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mode" role="tablist" aria-label="Mod">
        {[
          { v: false, t: '💕 Date planla' },
          { v: true, t: '📅 Dolu günlerim' },
        ].map((o) => (
          <button key={String(o.v)} role="tab" aria-selected={busyMode === o.v} className={busyMode === o.v ? 'active' : ''} onClick={() => setBusyMode(o.v)}>
            {busyMode === o.v && <motion.span layoutId="mode-pill" className="mode-pill" transition={spring} />}
            <span className="mode-label">{o.t}</span>
          </button>
        ))}
      </div>
      <AnimatePresence>
        {busyMode && (
          <motion.p className="mode-hint" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            Dolu olduğun günlere dokun, kırmızıya dönsün. Tekrar dokununca boşalır.
          </motion.p>
        )}
      </AnimatePresence>

      <Calendar infoFor={infoFor} onDay={onDay} me={me} partner={partner} busyMode={busyMode} />

      <Sheet open={!!selected} onClose={() => setSelected(null)} label="Gün detayı">
        {selected && <DayPanel day={selected} info={infoFor(selected)} me={me} partner={partner} onToast={showToast} />}
      </Sheet>

      <Sheet open={showNotifs} onClose={() => setShowNotifs(false)} label="Bildirimler">
        <NotificationList items={notifs} onOpen={openFromNotif} />
      </Sheet>

      <Sheet open={showMenu} onClose={() => setShowMenu(false)} label="Menü">
        <h3 className="panel-title">Ayarlar</h3>
        <div className="menu">
          <p className="hint small">{me.email}</p>
          {push === 'default' && (
            <button className="btn soft" onClick={askPush}>
              🔔 Telefon bildirimlerini aç
            </button>
          )}
          {push === 'granted' && <p className="hint">🔔 Bildirimler açık</p>}
          {push === 'denied' && <p className="hint">Bildirimler tarayıcı ayarlarından kapalı.</p>}
          {push === 'needs-install' && (
            <p className="hint">
              iPhone'da bildirim için önce Safari → Paylaş → <b>Ana Ekrana Ekle</b>.
            </p>
          )}
          <button className="btn ghost" onClick={() => signOut(auth)}>
            Çıkış yap
          </button>
        </div>
      </Sheet>

      <Celebration plan={cele} onClose={() => setCele(null)} />
    </div>
  );
}
