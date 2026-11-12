// GitHub Actions tarafından birkaç dakikada bir çalıştırılır:
// `pushed == false` olan bildirimleri alıcının telefonuna FCM web push olarak gönderir.
import { cert, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getMessaging } from 'firebase-admin/messaging';

const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
if (!raw) {
  console.log('FIREBASE_SERVICE_ACCOUNT tanımlı değil, atlanıyor.');
  process.exit(0);
}
const APP_URL = process.env.APP_URL || '/';

initializeApp({ credential: cert(JSON.parse(raw)) });
const db = getFirestore();
const messaging = getMessaging();

const shortDate = (k) => {
  const [y, m, d] = k.split('-').map(Number);
  return new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', weekday: 'short' }).format(new Date(y, m - 1, d));
};

function text(n) {
  const d = shortDate(n.date);
  const t = n.title ? ` · ${n.title}` : '';
  switch (n.type) {
    case 'draft': return { title: `✏️ ${n.fromName} date taslağı açtı`, body: `${d} — sen de etkinlik ekleyebilirsin` };
    case 'request': return { title: `💌 ${n.fromName} seni date'e çağırıyor!`, body: `${d}${t} — onaylamak için dokun` };
    case 'accepted': return { title: `🎉 ${n.fromName} date'i onayladı!`, body: `${d}${t}` };
    case 'returned': return { title: `↩️ ${n.fromName} planı düzenlemek istiyor`, body: `${d}${t}` };
    case 'cancelled': return { title: `💔 ${n.fromName} date'i iptal etti`, body: `${d}${t}` };
    default: return { title: 'Bizim Takvim', body: d };
  }
}

const DAY = 24 * 60 * 60 * 1000;
const snap = await db.collection('notifications').where('pushed', '==', false).limit(100).get();
console.log(`${snap.size} bekleyen bildirim`);

for (const docSnap of snap.docs) {
  const n = docSnap.data();
  const age = Date.now() - (n.createdAt?.toMillis?.() ?? Date.now());
  if (n.read || age > DAY) {
    await docSnap.ref.update({ pushed: true });
    continue;
  }

  const users = await db.collection('users').where('email', '==', n.toEmail).get();
  const owners = users.docs.flatMap((u) => (u.data().tokens ?? []).map((token) => ({ token, ref: u.ref })));
  if (owners.length) {
    const { title, body } = text(n);
    const res = await messaging.sendEachForMulticast({
      tokens: owners.map((o) => o.token),
      data: { title, body, url: APP_URL, tag: `plan-${n.planId}` },
      webpush: { headers: { Urgency: 'high', TTL: '86400' }, fcmOptions: { link: APP_URL } },
    });
    // Geçersiz/eski jetonları temizle
    for (const [i, r] of res.responses.entries()) {
      const code = r.error?.code ?? '';
      if (code.includes('registration-token-not-registered') || code.includes('invalid-registration-token') || code.includes('invalid-argument')) {
        const { FieldValue } = await import('firebase-admin/firestore');
        await owners[i].ref.update({ tokens: FieldValue.arrayRemove(owners[i].token) });
      }
    }
    console.log(`${docSnap.id}: ${res.successCount} gönderildi, ${res.failureCount} hata`);
  } else {
    console.log(`${docSnap.id}: alıcının kayıtlı cihazı yok`);
  }
  await docSnap.ref.update({ pushed: true });
}
process.exit(0);
