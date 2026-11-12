// Günlük yedek: tüm koleksiyonları backups/{YYYY-MM-DD} altına kopyalar, 60 günden eskileri temizler.
// Yedekler uygulamadan okunamaz/silinemez (firestore.rules). Geri yükleme: scripts/restore.mjs
import { FieldValue } from 'firebase-admin/firestore';
import { connect, dumpAll } from './fs-io.mjs';

const KEEP_DAYS = 60;
const CHUNK = 700_000; // Firestore belge sınırı 1 MB; büyük yedekler parçalara bölünür

const db = connect();
const data = await dumpAll(db);
const json = JSON.stringify(data);
const id = new Date().toISOString().slice(0, 10);
const ref = db.collection('backups').doc(id);

const parts = [];
for (let i = 0; i < json.length; i += CHUNK) parts.push(json.slice(i, i + CHUNK));
const counts = Object.fromEntries(Object.entries(data).map(([k, v]) => [k, Object.keys(v).length]));

const batch = db.batch();
batch.set(ref, { createdAt: FieldValue.serverTimestamp(), counts, parts: parts.length, bytes: json.length });
parts.forEach((p, i) => batch.set(ref.collection('parts').doc(String(i).padStart(3, '0')), { json: p }));
await batch.commit();
console.log(`Yedek alındı: backups/${id}`, counts, `${json.length} bayt, ${parts.length} parça`);

// Eski yedekleri temizle
const cutoff = new Date(Date.now() - KEEP_DAYS * 86_400_000).toISOString().slice(0, 10);
const old = await db.collection('backups').where('__name__', '<', db.collection('backups').doc(cutoff)).get();
for (const d of old.docs) {
  await db.recursiveDelete(d.ref);
  console.log(`Eski yedek silindi: ${d.id}`);
}
process.exit(0);
