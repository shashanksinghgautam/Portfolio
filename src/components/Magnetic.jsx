import { useRef, memo } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useIsMobile } from '../hooks/useDevicePerformance.js';

/* ================================================================
   Magnetic - wraps any element and makes it magnetically attracted
   to the cursor on hover. Disabled on mobile for performance.
================================================================ */

function Magnetic({ children, strength = 0.3, className = '' }) {
  const ref = useRef(null);
  const isMobile = useIsMobile();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 15 });
  const springY = useSpring(y, { stiffness: 200, damping: 15 });

  // On mobile, render children without magnetic effect
  if (isMobile) {
    return <div className={`inline-block ${className}`}>{children}</div>;
  }

  const handleMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * strength);
    y.set((e.clientY - centerY) * strength);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x: springX, y: springY }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}

export default memo(Magnetic);
