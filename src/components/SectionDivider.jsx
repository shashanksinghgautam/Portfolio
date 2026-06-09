import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, memo } from 'react';
import { useIsMobile } from '../hooks/useDevicePerformance.js';

/* ================================================================
   SectionDivider - animated gradient line with expanding glow.
   Mobile: static line (no scroll tracking overhead).
================================================================ */

function SectionDivider() {
  const ref = useRef(null);
  const isMobile = useIsMobile();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.9', 'end 0.5'],
  });
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  if (isMobile) {
    return (
      <div className="container-wide py-4">
        <div className="h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
      </div>
    );
  }

  return (
    <div ref={ref} className="container-wide py-4">
      <div className="relative h-px overflow-hidden">
        <motion.div
          style={{ scaleX, opacity }}
          className="absolute inset-0 origin-left bg-gradient-to-r from-transparent via-accent/40 to-transparent"
        />
      </div>
    </div>
  );
}

export default memo(SectionDivider);
