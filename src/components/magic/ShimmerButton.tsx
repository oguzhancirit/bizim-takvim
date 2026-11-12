import { motion, type HTMLMotionProps } from 'motion/react';
import type { CSSProperties } from 'react';

/** Magic UI "Shimmer Button" uyarlaması: kenar boyunca dolaşan ışık + içten parlama. */
export function ShimmerButton({
  children, className = '', shimmerColor = '#ffffff', duration = '3s', style, ...rest
}: HTMLMotionProps<'button'> & { shimmerColor?: string; duration?: string }) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      {...rest}
      className={`shimmer-btn ${className}`}
      style={{ '--shimmer': shimmerColor, '--shimmer-speed': duration, ...(style as object) } as CSSProperties}
    >
      <span className="shimmer-spark" aria-hidden>
        <span className="shimmer-spark-inner" />
      </span>
      <span className="shimmer-bg" aria-hidden />
      <span className="shimmer-slide" aria-hidden />
      <span className="shimmer-label">{children as React.ReactNode}</span>
    </motion.button>
  );
}
