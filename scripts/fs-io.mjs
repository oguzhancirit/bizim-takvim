// Ortak: Firestore'u JSON'a / JSON'u Firestore'a çevirir (zaman damgaları korunur).
import { cert, initializeApp } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

export const COLLECTIONS = ['allowed', 'users', 'busy', 'plans', 'notifications'];

export function connect() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) throw new Error('FIREBASE_SERVICE_ACCOUNT tanımlı değil');
  initializeApp({ credential: cert(JSON.parse(raw)) });
  return getFirestore();
}

export function encode(v) {
  if (v instanceof Timestamp) return { __ts: v.toMillis() };
  if (Array.isArray(v)) return v.map(encode);
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, encode(x)]));
  return v;
}

export function decode(v) {
  if (v && typeof v === 'object' && !Array.isArray(v) && Object.keys(v).length === 1 && '__ts' in v) return Timestamp.fromMillis(v.__ts);
  if (Array.isArray(v)) return v.map(decode);
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, decode(x)]));
  return v;
}

export async function dumpAll(db) {
  const out = {};
  for (const c of COLLECTIONS) {
    const snap = await db.collection(c).get();
    out[c] = Object.fromEntries(snap.docs.map((d) => [d.id, encode(d.data())]));
  }
  return out;
}
