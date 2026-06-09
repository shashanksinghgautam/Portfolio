import { memo } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useIsMobile } from '../hooks/useDevicePerformance.js';

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, mass: 0.5 });
  const isMobile = useIsMobile();

  return (
    <>
      {/* Main bar */}
      <motion.div
        style={{ scaleX }}
        className="fixed left-0 top-0 z-[60] h-[2px] w-full origin-left
                   bg-gradient-to-r from-accent via-glow-cyan to-glow-purple"
        aria-hidden="true"
      />
      {/* Glow underneath - desktop only */}
      {!isMobile && (
        <motion.div
          style={{ scaleX }}
          className="fixed left-0 top-0 z-[59] h-[6px] w-full origin-left blur-sm
                     bg-gradient-to-r from-accent/50 via-glow-cyan/40 to-glow-purple/30"
          aria-hidden="true"
        />
      )}
    </>
  );
}

export default memo(ScrollProgress);
