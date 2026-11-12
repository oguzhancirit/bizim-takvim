import { getMessaging, getToken, isSupported, onMessage } from 'firebase/messaging';
import { arrayUnion, doc, getDoc, setDoc } from 'firebase/firestore';
import { app, db } from '../firebase';
import { vapidKey } from '../firebase-config';

const swUrl = `${import.meta.env.BASE_URL}sw.js`;

export async function registerSW() {
  if (!('serviceWorker' in navigator)) return null;
  return navigator.serviceWorker.register(swUrl, { scope: import.meta.env.BASE_URL });
}

export type PushState = 'unsupported' | 'needs-install' | 'default' | 'granted' | 'denied';

export async function pushState(): Promise<PushState> {
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const standalone = window.matchMedia('(display-mode: standalone)').matches;
  if (ios && !standalone) return 'needs-install';
  if (!('Notification' in window) || !(await isSupported())) return 'unsupported';
  return Notification.permission as PushState;
}

/** İzin ister, FCM jetonunu alır ve kullanıcının belgesine kaydeder. Kullanıcı tıklamasıyla çağrılmalı. */
export async function enablePush(uid: string) {
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return permission;
  const reg = (await registerSW()) ?? undefined;
  const messaging = getMessaging(app);
  const token = await getToken(messaging, { vapidKey, serviceWorkerRegistration: reg });
  if (token) await setDoc(doc(db, 'users', uid), { tokens: arrayUnion(token) }, { merge: true });
  return permission;
}

/** Uygulama açıkken gelen push'ları sessizce yut (uygulama içi bildirim zaten gösteriliyor). */
export async function listenForeground() {
  if (!(await isSupported())) return;
  onMessage(getMessaging(app), () => {});
}

/** Bildirim durumu: izin + bu cihazın jetonu hesaba kayıtlı mı. İzin isteği açmaz. */
export interface PushDiag { state: PushState; registered: boolean; standalone: boolean; rightHost: boolean; ios: boolean }

export const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches || (navigator as { standalone?: boolean }).standalone === true;

export async function pushDiagnostics(uid: string): Promise<PushDiag> {
  const state = await pushState();
  const base = { standalone: isStandalone(), rightHost: location.hostname === 'bizim-takvim-48b62.firebaseapp.com' || location.hostname === 'localhost', ios: /iphone|ipad|ipod/i.test(navigator.userAgent) };
  if (state !== 'granted') return { state, registered: false, ...base };
  try {
    const reg = (await registerSW()) ?? undefined;
    const token = await getToken(getMessaging(app), { vapidKey, serviceWorkerRegistration: reg });
    const snap = await getDoc(doc(db, 'users', uid));
    const tokens = (snap.data()?.tokens as string[] | undefined) ?? [];
    if (token && !tokens.includes(token)) {
      // Jeton değişmiş/eksikse sessizce kaydet ki bildirimler kaçmasın
      await setDoc(doc(db, 'users', uid), { tokens: arrayUnion(token) }, { merge: true });
    }
    return { state, registered: !!token, ...base };
  } catch {
    return { state, registered: false, ...base };
  }
}

/** Cihazın bildirim gösterebildiğini anında dener (sunucuya gitmez). */
export async function localTestNotification() {
  const reg = await navigator.serviceWorker.ready;
  await reg.showNotification('🔔 Test bildirimi', {
    body: 'Bu cihaz bildirim gösterebiliyor 🎉',
    icon: `${import.meta.env.BASE_URL}icons/icon-192.png`,
    tag: 'test-local',
  });
}
