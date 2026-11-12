import confetti from 'canvas-confetti';
import { prefersReducedMotion } from './motion';

const COLORS = ['#ef6a4c', '#f6a04d', '#ffd166', '#5fb3e8', '#7fd1a8', '#ffffff'];

/** Date onaylandığında: ortadan patlama + iki yandan konfeti yağmuru. */
export function celebrate() {
  if (prefersReducedMotion()) return;
  const end = Date.now() + 1400;
  const base = { disableForReducedMotion: true, zIndex: 1000, colors: COLORS };

  confetti({ ...base, particleCount: 120, spread: 90, startVelocity: 48, origin: { y: 0.65 } });
  confetti({ ...base, particleCount: 40, spread: 120, scalar: 1.4, shapes: ['star'], origin: { y: 0.6 } });

  (function frame() {
    confetti({ ...base, particleCount: 4, angle: 60, spread: 60, origin: { x: 0, y: 0.75 } });
    confetti({ ...base, particleCount: 4, angle: 120, spread: 60, origin: { x: 1, y: 0.75 } });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}
