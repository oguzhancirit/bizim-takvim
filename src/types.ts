import type { Timestamp } from 'firebase/firestore';

export type PlanStatus = 'draft' | 'pending' | 'accepted';

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
  status: PlanStatus;
  createdBy: string; // uid
  sentBy?: string; // onaya gönderen uid
  updatedBy?: string;
  updatedAt?: Timestamp;
}

export type NotifType = 'draft' | 'request' | 'accepted' | 'returned' | 'cancelled';

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
