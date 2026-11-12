export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const spring = { type: 'spring', stiffness: 420, damping: 34 } as const;
export const softSpring = { type: 'spring', stiffness: 260, damping: 26 } as const;
