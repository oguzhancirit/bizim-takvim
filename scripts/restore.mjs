// Yedekten geri yükleme. HİÇBİR ŞEYİ SİLMEZ: sadece yedekte olup şu an eksik/farklı olan belgeleri yazar.
// Kullanım: node scripts/restore.mjs 2026-11-20            → sadece rapor (değişiklik yapmaz)
//           node scripts/restore.mjs 2026-11-20 --apply    → raporlananları yazar
import { connect, decode, dumpAll } from './fs-io.mjs';

const [id, flag] = process.argv.slice(2);
if (!/^\d{4}-\d{2}-\d{2}$/.test(id ?? '')) {
  console.log('Tarih ver: node scripts/restore.mjs YYYY-MM-DD [--apply]');
  process.exit(1);
}
const apply = flag === '--apply';
const db = connect();
const ref = db.collection('backups').doc(id);
const meta = await ref.get();
if (!meta.exists) {
  const list = await db.collection('backups').get();
  console.log(`backups/${id} yok. Mevcut yedekler: ${list.docs.map((d) => d.id).join(', ')}`);
  process.exit(1);
}
const parts = await ref.collection('parts').orderBy('__name__').get();
const backup = JSON.parse(parts.docs.map((d) => d.data().json).join(''));
const current = await dumpAll(db);

// Public repoda iş kayıtları herkese açık: belge kimliklerini (e-posta, uid) maskele
const mask = (id) => (id.length <= 4 ? '****' : `${id.slice(0, 2)}…${id.slice(-2)}`);

let changes = 0;
for (const [col, docs] of Object.entries(backup)) {
  for (const [docId, data] of Object.entries(docs)) {
    const now = current[col]?.[docId];
    if (JSON.stringify(now) === JSON.stringify(data)) continue;
    changes++;
    console.log(`${now ? 'DEĞİŞMİŞ' : 'EKSİK  '}  ${col}/${mask(docId)}`);
    if (apply) await db.collection(col).doc(docId).set(decode(data));
  }
}
console.log(changes ? `${changes} belge ${apply ? 'geri yüklendi' : 'geri yüklenebilir (uygulamak için --apply)'}` : 'Yedekle şu anki veri aynı, yapılacak bir şey yok.');
process.exit(0);
