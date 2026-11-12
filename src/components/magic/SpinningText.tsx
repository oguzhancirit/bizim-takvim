import type { CSSProperties } from 'react';

/** Magic UI "Spinning Text" uyarlaması: harfler bir çember üzerinde, çember sürekli döner. */
export function SpinningText({
  text, radius = 5, duration = 12, reverse = false, className = '',
}: { text: string; radius?: number; duration?: number; reverse?: boolean; className?: string }) {
  const letters = [...`${text} `];
  return (
    <span
      className={`spin-text ${className}`}
      style={{ '--spin-dur': `${duration}s`, '--spin-dir': reverse ? 'reverse' : 'normal' } as CSSProperties}
      aria-hidden
    >
      {letters.map((l, i) => (
        <span
          key={i}
          style={{
            transform: `translate(-50%, -50%) rotate(${(360 / letters.length) * i}deg) translateY(-${radius}ch)`,
          }}
        >
          {l}
        </span>
      ))}
    </span>
  );
}
