import { useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import {
  addDoc, arrayRemove, arrayUnion, collection, doc, getDoc, onSnapshot, query,
  runTransaction, serverTimestamp, setDoc, updateDoc, where, writeBatch,
} from 'firebase/firestore';
import { auth, db } from '../firebase';
import type { Activity, AppNotification, NotifType, Person, Plan } from '../types';
import { firstName, todayKey } from './dates';

/* ---------------- Oturum ve erişim ---------------- */

export type AccessState = 'loading' | 'signed-out' | 'denied' | 'ok';

export function useSession() {
  const [user, setUser] = useState<User | null>(null);
  const [access, setAccess] = useState<AccessState>('loading');

  useEffect(
    () =>
      onAuthStateChanged(auth, async (u) => {
        setUser(u);
        if (!u?.email) return setAccess(u ? 'denied' : 'signed-out');
        try {
          const ok = await getDoc(doc(db, 'allowed', u.email.toLowerCase()));
          if (!ok.exists()) return setAccess('denied');
          await setDoc(
            doc(db, 'users', u.uid),
            { email: u.email.toLowerCase(), name: u.displayName ?? u.email, photoURL: u.photoURL ?? '' },
            { merge: true },
          );
          setAccess('ok');
        } catch {
          setAccess('denied');
        }
      }),
    [],
  );
  return { user, access };
}

/* ---------------- Canlı veriler ---------------- */

/** İki kişiyi döndürür: ben ve partnerim (partner henüz hiç giriş yapmadıysa allowed listesinden). */
export function usePeople(me: User) {
  const [users, setUsers] = useState<Person[]>([]);
  const [allowed, setAllowed] = useState<{ email: string; name?: string; nick?: string }[]>([]);

  useEffect(
    () =>
      onSnapshot(collection(db, 'users'), (s) =>
        setUsers(s.docs.map((d) => ({ uid: d.id, ...(d.data() as Omit<Person, 'uid'>) }))),
      ),
    [],
  );
  useEffect(
    () =>
      onSnapshot(collection(db, 'allowed'), (s) =>
        setAllowed(s.docs.map((d) => ({ email: d.id, name: d.data().name as string | undefined, nick: d.data().nick as string | undefined }))),
      ),
    [],
  );

  return useMemo(() => {
    const myEmail = me.email!.toLowerCase();
    const meP: Person = users.find((u) => u.uid === me.uid) ?? {
      uid: me.uid, email: myEmail, name: me.displayName ?? myEmail, photoURL: me.photoURL ?? '',
    };
    const otherAllowed = allowed.find((a) => a.email !== myEmail);
    const otherUser = users.find((u) => u.uid !== me.uid);
    const partner: Person | null = otherUser
      ? { ...otherUser, name: otherAllowed?.name || otherUser.name, nick: otherAllowed?.nick }
      : otherAllowed
        ? { uid: '', email: otherAllowed.email, name: otherAllowed.name || otherAllowed.email.split('@')[0], nick: otherAllowed.nick }
        : null;
    const myName = allowed.find((a) => a.email === myEmail)?.name;
    return { me: { ...meP, name: myName || meP.name }, partner };
  }, [users, allowed, me]);
}

export function useBusy() {
  const [busy, setBusy] = useState<Record<string, Set<string>>>({});
  useEffect(
    () =>
      onSnapshot(collection(db, 'busy'), (s) => {
        const next: Record<string, Set<string>> = {};
        s.docs.forEach((d) => (next[d.id] = new Set((d.data().days as string[]) ?? [])));
        setBusy(next);
      }),
    [],
  );
  return busy;
}

export function usePlans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  useEffect(
    () =>
      onSnapshot(collection(db, 'plans'), (s) =>
        // İptal edilen planlar veritabanında kalır, sadece ekranda gösterilmez.
        setPlans(s.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Plan, 'id'>) })).filter((p) => p.status !== 'cancelled')),
      ),
    [],
  );
  return plans;
}

export function useNotifications(email: string) {
  const [items, setItems] = useState<AppNotification[]>([]);
  const [loaded, setLoaded] = useState(false);
  useEffect(
    () =>
      onSnapshot(query(collection(db, 'notifications'), where('toEmail', '==', email)), (s) => {
        const list = s.docs.map((d) => ({ id: d.id, ...(d.data({ serverTimestamps: 'estimate' }) as Omit<AppNotification, 'id'>) }));
        list.sort((a, b) => (b.createdAt?.toMillis() ?? 0) - (a.createdAt?.toMillis() ?? 0));
        setItems(list.slice(0, 40));
        setLoaded(true);
      }),
    [email],
  );
  return { items, loaded };
}

/* ---------------- İşlemler ---------------- */

async function notify(to: Person | null, from: Person, type: NotifType, plan: Pick<Plan, 'id' | 'date' | 'title'>) {
  if (!to?.email) return;
  await addDoc(collection(db, 'notifications'), {
    toEmail: to.email, fromName: firstName(from.name), type, planId: plan.id, date: plan.date,
    title: plan.title, read: false, pushed: false, createdAt: serverTimestamp(),
  });
}

export const setBusyDay = (uid: string, day: string, busy: boolean) =>
  setDoc(doc(db, 'busy', uid), { days: busy ? arrayUnion(day) : arrayRemove(day) }, { merge: true });

export async function createPlan(date: string, me: Person, partner: Person | null) {
  const ref = await addDoc(collection(db, 'plans'), {
    date, title: '', time: '', place: '', activities: [], status: 'draft',
    createdBy: me.uid, updatedBy: me.uid, updatedAt: serverTimestamp(),
  });
  await notify(partner, me, 'draft', { id: ref.id, date, title: '' });
  return ref.id;
}

export const updatePlanField = (id: string, uid: string, field: 'title' | 'time' | 'place', value: string) =>
  updateDoc(doc(db, 'plans', id), { [field]: value, updatedBy: uid, updatedAt: serverTimestamp() });

export const addActivity = (id: string, uid: string, text: string) => {
  const a: Activity = { id: crypto.randomUUID(), text, by: uid };
  return updateDoc(doc(db, 'plans', id), { activities: arrayUnion(a), updatedBy: uid, updatedAt: serverTimestamp() });
};

/** Etkinlik düzenle/sil: aynı anda iki kişi yazarsa birbirini ezmesin diye transaction. */
export const changeActivity = (id: string, uid: string, activityId: string, text: string | null) =>
  runTransaction(db, async (tx) => {
    const ref = doc(db, 'plans', id);
    const snap = await tx.get(ref);
    if (!snap.exists()) return;
    const list = (snap.data().activities as Activity[]) ?? [];
    if (text === null) {
      // Silinen etkinlik kaybolmasın: removedActivities içine arşivlenir.
      const gone = list.find((a) => a.id === activityId);
      tx.update(ref, {
        activities: list.filter((a) => a.id !== activityId),
        ...(gone ? { removedActivities: arrayUnion({ ...gone, removedBy: uid, removedAt: Date.now() }) } : {}),
        updatedBy: uid,
        updatedAt: serverTimestamp(),
      });
      return;
    }
    const next = list.map((a) => (a.id === activityId ? { ...a, text } : a));
    tx.update(ref, { activities: next, updatedBy: uid, updatedAt: serverTimestamp() });
  });

export async function sendForApproval(plan: Plan, me: Person, partner: Person | null) {
  await updateDoc(doc(db, 'plans', plan.id), { status: 'pending', sentBy: me.uid, updatedBy: me.uid, updatedAt: serverTimestamp() });
  await notify(partner, me, 'request', plan);
}

export async function acceptPlan(plan: Plan, me: Person, partner: Person | null) {
  await updateDoc(doc(db, 'plans', plan.id), { status: 'accepted', updatedBy: me.uid, updatedAt: serverTimestamp() });
  await notify(partner, me, 'accepted', plan);
}

export async function returnToDraft(plan: Plan, me: Person, partner: Person | null) {
  const wasMine = plan.sentBy === me.uid;
  await updateDoc(doc(db, 'plans', plan.id), { status: 'draft', updatedBy: me.uid, updatedAt: serverTimestamp() });
  if (!wasMine) await notify(partner, me, 'returned', plan);
}

/** Plan silinmez: 'cancelled' olarak işaretlenir, önceki durumu saklanır (geri getirilebilir). */
export async function cancelPlan(plan: Plan, me: Person, partner: Person | null) {
  await updateDoc(doc(db, 'plans', plan.id), {
    status: 'cancelled', statusBeforeCancel: plan.status, cancelledBy: me.uid, cancelledAt: serverTimestamp(),
    updatedBy: me.uid, updatedAt: serverTimestamp(),
  });
  await notify(partner, me, 'cancelled', plan);
}

/** Kendine test bildirimi: uygulama içinde hemen görünür, telefona GitHub Actions ile 5–15 dk içinde gelir. */
export async function sendTestNotification(me: Person) {
  await addDoc(collection(db, 'notifications'), {
    toEmail: me.email, fromName: firstName(me.name), type: 'test', planId: '', date: todayKey(),
    title: '', read: false, pushed: false, createdAt: serverTimestamp(),
  });
}

export async function markRead(ids: string[]) {
  if (!ids.length) return;
  const b = writeBatch(db);
  ids.forEach((id) => b.update(doc(db, 'notifications', id), { read: true }));
  await b.commit();
}
