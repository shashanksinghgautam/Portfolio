import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

/* ================================================================
   SectionDivider - animated gradient line with expanding glow.
   Reveals on scroll with a growing width animation.
================================================================ */

export default function SectionDivider() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.9', 'end 0.5'],
  });
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  return (
    <div ref={ref} className="container-wide py-4">
      <div className="relative h-px overflow-hidden">
        <motion.div
          style={{ scaleX, opacity }}
          className="absolute inset-0 origin-left bg-gradient-to-r from-transparent via-accent/40 to-transparent"
        />
        <motion.div
          style={{ scaleX, opacity }}
          className="absolute inset-0 origin-left bg-gradient-to-r from-transparent via-accent/20 to-transparent blur-sm"
        />
      </div>
    </div>
  );
}
