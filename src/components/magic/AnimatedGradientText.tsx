import type { CSSProperties, ReactNode } from 'react';

/** Magic UI "Animated Gradient Text" uyarlaması: harflerin içinde sürekli kayan renk geçişi. */
export function AnimatedGradientText({
  children, from = 'var(--rose)', to = 'var(--p2)', speed = 1, className = '',
}: { children: ReactNode; from?: string; to?: string; speed?: number; className?: string }) {
  return (
    <span
      className={`agt ${className}`}
      style={{ '--agt-from': from, '--agt-to': to, '--agt-dur': `${6 / speed}s` } as CSSProperties}
    >
      {children}
    </span>
  );
}

/** Gradyan çerçeveli küçük etiket (Magic UI demo'sundaki hap). */
export function GradientPill({ children }: { children: ReactNode }) {
  return <span className="agt-pill">{children}</span>;
}
