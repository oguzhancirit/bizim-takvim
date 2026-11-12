import confetti from 'canvas-confetti';
import { prefersReducedMotion } from './motion';

const COLORS = ['#f27a8f', '#e05577', '#ffc2cf', '#ffd27a', '#9fd8b8', '#ffffff'];

/** Date onaylandığında: iki yandan kalp + konfeti yağmuru. */
export function celebrate() {
  if (prefersReducedMotion()) return;
  const heart = confetti.shapeFromText({ text: '💖', scalar: 2 });
  const end = Date.now() + 1400;
  const base = { disableForReducedMotion: true, zIndex: 1000, colors: COLORS };

  confetti({ ...base, particleCount: 120, spread: 90, startVelocity: 48, origin: { y: 0.65 } });
  confetti({ ...base, particleCount: 26, spread: 110, scalar: 2, shapes: [heart], origin: { y: 0.6 } });

  (function frame() {
    confetti({ ...base, particleCount: 4, angle: 60, spread: 60, origin: { x: 0, y: 0.75 } });
    confetti({ ...base, particleCount: 4, angle: 120, spread: 60, origin: { x: 1, y: 0.75 } });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}
