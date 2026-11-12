import type { Timestamp } from 'firebase/firestore';

/** 'cancelled': silinmiş/iptal edilmiş plan. Veri asla silinmez, sadece bu durumla gizlenir. */
export type PlanStatus = 'draft' | 'pending' | 'accepted' | 'cancelled';

export interface Person {
  uid: string;
  email: string;
  name: string;
  /** Hitap adı (Firestore `allowed/{email}.nick`), ör. açılış notunda kullanılır */
  nick?: string;
  photoURL?: string;
}

export interface Activity {
  id: string;
  text: string;
  by: string; // uid
}

export interface Plan {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  time: string; // HH:MM veya ''
  place: string;
  activities: Activity[];
  /** Silinen etkinlikler kaybolmaz; buraya taşınır (geri getirilebilir). */
  removedActivities?: (Activity & { removedBy: string; removedAt: number })[];
  status: PlanStatus;
  createdBy: string; // uid
  sentBy?: string; // onaya gönderen uid
  updatedBy?: string;
  updatedAt?: Timestamp;
}

export type NotifType = 'draft' | 'request' | 'accepted' | 'returned' | 'cancelled' | 'test';

export interface AppNotification {
  id: string;
  toEmail: string;
  fromName: string;
  type: NotifType;
  planId: string;
  date: string;
  title: string;
  read: boolean;
  pushed: boolean;
  createdAt?: Timestamp;
}

export type DayState = 'past' | 'free' | 'busy' | 'draft' | 'pending' | 'date';
