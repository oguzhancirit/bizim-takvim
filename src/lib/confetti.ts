import confetti from 'canvas-confetti';
import { prefersReducedMotion } from './motion';

const COLORS = ['#ef6a4c', '#f6a04d', '#ffd166', '#5fb3e8', '#7fd1a8', '#ffffff'];
const STAR_COLORS = ['#FFE400', '#FFBD00', '#E89400', '#FFCA6C', '#FDFFB8'];

/** iPhone gibi küçük ekranlarda parçacık sayısını düşür (pil + akıcılık). */
const scale = () => (window.innerWidth < 768 ? 0.6 : 1);
const n = (count: number) => Math.round(count * scale());

const base = { disableForReducedMotion: true, zIndex: 1000, colors: COLORS };

/** Magic UI "Side Cannons": iki alt köşeden içeri doğru sürekli konfeti. */
function sideCannons(ms: number) {
  const end = Date.now() + ms;
  (function frame() {
    if (Date.now() > end) return;
    confetti({ ...base, particleCount: 2, angle: 60, spread: 55, startVelocity: 60, origin: { x: 0, y: 0.5 } });
    confetti({ ...base, particleCount: 2, angle: 120, spread: 55, startVelocity: 60, origin: { x: 1, y: 0.5 } });
    requestAnimationFrame(frame);
  })();
}

/** Magic UI "Fireworks": ekranın rastgele noktalarında art arda patlamalar. */
function fireworks(ms: number) {
  const end = Date.now() + ms;
  const rand = (a: number, b: number) => Math.random() * (b - a) + a;
  const id = window.setInterval(() => {
    const left = end - Date.now();
    if (left <= 0) return window.clearInterval(id);
    const count = n(50 * (left / ms));
    const opts = { ...base, startVelocity: 30, spread: 360, ticks: 60, particleCount: count };
    confetti({ ...opts, origin: { x: rand(0.1, 0.3), y: Math.random() - 0.2 } });
    confetti({ ...opts, origin: { x: rand(0.7, 0.9), y: Math.random() - 0.2 } });
  }, 250);
}

/** Magic UI "Stars": ortadan yıldız patlaması. */
function stars() {
  const opts = { ...base, spread: 360, ticks: 70, gravity: 0, decay: 0.94, startVelocity: 30, colors: STAR_COLORS };
  const shoot = () => {
    confetti({ ...opts, particleCount: n(40), scalar: 1.2, shapes: ['star'] });
    confetti({ ...opts, particleCount: n(10), scalar: 0.75, shapes: ['circle'] });
  };
  setTimeout(shoot, 0);
  setTimeout(shoot, 120);
  setTimeout(shoot, 240);
}

/**
 * Date onaylandığı an: ortadan büyük patlama + yıldızlar + yan toplar + havai fişekler.
 * `from` verilirse ilk patlama o elementin (ör. Onayla butonu) üzerinden çıkar.
 */
export function celebrate(from?: HTMLElement | null) {
  if (prefersReducedMotion()) return;
  let origin = { x: 0.5, y: 0.6 };
  if (from) {
    const r = from.getBoundingClientRect();
    origin = { x: (r.left + r.width / 2) / window.innerWidth, y: (r.top + r.height / 2) / window.innerHeight };
  }
  confetti({ ...base, particleCount: n(160), spread: 100, startVelocity: 55, origin });
  stars();
  sideCannons(2200);
  setTimeout(() => fireworks(3000), 400);
}

/** Günün kasası açıldığında: çıkan kartın üzerinden, nadirlik renginde küçük yıldız patlaması. */
export function sparkle(from: HTMLElement | null, color: string) {
  if (prefersReducedMotion() || !from) return;
  const r = from.getBoundingClientRect();
  const origin = { x: (r.left + r.width / 2) / window.innerWidth, y: (r.top + r.height / 2) / window.innerHeight };
  const opts = { ...base, origin, spread: 360, ticks: 60, gravity: 0.3, decay: 0.93, startVelocity: 22, colors: [color, '#ffd166', '#ffffff'] };
  confetti({ ...opts, particleCount: n(36), scalar: 1.1, shapes: ['star'] });
  confetti({ ...opts, particleCount: n(14), scalar: 0.7, shapes: ['circle'] });
}
