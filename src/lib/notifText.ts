import type { AppNotification } from '../types';
import { shortDate } from './dates';

export function notifText(n: Pick<AppNotification, 'type' | 'fromName' | 'date' | 'title'>) {
  const d = shortDate(n.date);
  const t = n.title ? ` · ${n.title}` : '';
  switch (n.type) {
    case 'draft': return { icon: '✏️', title: `${n.fromName} ${d} için date taslağı açtı`, body: 'Sen de etkinlik ekleyebilirsin' };
    case 'request': return { icon: '📅', title: `${n.fromName} bir date önerdi`, body: `${d}${t}` };
    case 'accepted': return { icon: '🎉', title: `${n.fromName} date'i onayladı!`, body: `${d}${t}` };
    case 'returned': return { icon: '↩️', title: `${n.fromName} planı düzenlemek istiyor`, body: `${d}${t}` };
    case 'test': return { icon: '🔔', title: 'Test bildirimi', body: 'Bildirimler bu hesaba ulaşıyor 🎉' };
    case 'cancelled': return { icon: '✖️', title: `${n.fromName} date'i iptal etti`, body: `${d}${t}` };
  }
}

export function timeAgo(ms: number) {
  const s = Math.max(1, Math.round((Date.now() - ms) / 1000));
  if (s < 60) return 'şimdi';
  const m = Math.round(s / 60);
  if (m < 60) return `${m} dk önce`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} sa önce`;
  return `${Math.round(h / 24)} gün önce`;
}
