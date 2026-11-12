import { getMessaging, getToken, isSupported, onMessage } from 'firebase/messaging';
import { arrayUnion, doc, setDoc } from 'firebase/firestore';
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
