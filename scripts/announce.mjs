// Elle çalıştırılır (GitHub Actions → "Duyuru gönder"): izinli iki kişinin kayıtlı cihazlarına tek seferlik
// bir duyuru bildirimi gönderir. Veritabanına hiçbir şey yazmaz, hiçbir şey silmez; sadece okur.
import { cert, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getMessaging } from 'firebase-admin/messaging';

const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
if (!raw) {
  console.error('FIREBASE_SERVICE_ACCOUNT tanımlı değil.');
  process.exit(1);
}
const APP_URL = process.env.APP_URL || '/';
const clean = (s, max) => String(s ?? '').replace(/https?:\/\/\S+|www\.\S+/gi, '').replace(/[\u0000-\u001f‪-‮]/g, '').trim().slice(0, max);
const title = clean(process.env.ANNOUNCE_TITLE, 60) || '✨ Date Takvimi güncellendi';
const body = clean(process.env.ANNOUNCE_BODY, 180) || 'Yeni özelliği görmek için uygulamayı tamamen kapatıp yeniden aç.';

initializeApp({ credential: cert(JSON.parse(raw)) });
const db = getFirestore();

const allowed = new Set((await db.collection('allowed').get()).docs.map((d) => d.id));
const users = await db.collection('users').get();
const tokens = users.docs.filter((u) => allowed.has(u.data().email)).flatMap((u) => u.data().tokens ?? []);
if (!tokens.length) {
  console.log('Kayıtlı cihaz yok.');
  process.exit(0);
}
const res = await getMessaging().sendEachForMulticast({
  tokens,
  data: { title, body, url: APP_URL, tag: 'duyuru' },
  webpush: { headers: { Urgency: 'high', TTL: '86400' }, fcmOptions: { link: APP_URL } },
});
console.log(`${tokens.length} cihaz: ${res.successCount} gönderildi, ${res.failureCount} hata`);
process.exit(res.successCount ? 0 : 1);
