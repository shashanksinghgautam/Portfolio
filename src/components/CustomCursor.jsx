import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/* ================================================================
   Custom Animated Cursor
   - Smooth interpolated follow
   - Scales up on hover over interactive elements
   - Dot + ring combo with spring physics
   - Blend mode for visual interest
================================================================ */

export default function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const ringX = useSpring(cursorX, { stiffness: 150, damping: 15, mass: 0.5 });
  const ringY = useSpring(cursorY, { stiffness: 150, damping: 15, mass: 0.5 });
  const dotX = useSpring(cursorX, { stiffness: 400, damping: 28 });
  const dotY = useSpring(cursorY, { stiffness: 400, damping: 28 });
  const scale = useMotionValue(1);
  const ringScale = useSpring(scale, { stiffness: 300, damping: 20 });

  useEffect(() => {
    // Only show on desktop
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleHoverStart = () => scale.set(2.5);
    const handleHoverEnd = () => scale.set(1);

    window.addEventListener('mousemove', moveCursor);

    // Listen for hovers on interactive elements
    const interactives = document.querySelectorAll('a, button, [role="button"], .card-glow, input, textarea');
    interactives.forEach((el) => {
      el.addEventListener('mouseenter', handleHoverStart);
      el.addEventListener('mouseleave', handleHoverEnd);
    });

    // MutationObserver to catch dynamically added elements
    const observer = new MutationObserver(() => {
      const newInteractives = document.querySelectorAll('a, button, [role="button"], .card-glow, input, textarea');
      newInteractives.forEach((el) => {
        el.removeEventListener('mouseenter', handleHoverStart);
        el.removeEventListener('mouseleave', handleHoverEnd);
        el.addEventListener('mouseenter', handleHoverStart);
        el.addEventListener('mouseleave', handleHoverEnd);
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      interactives.forEach((el) => {
        el.removeEventListener('mouseenter', handleHoverStart);
        el.removeEventListener('mouseleave', handleHoverEnd);
      });
      observer.disconnect();
    };
  }, [cursorX, cursorY, scale]);

  // Don't render on mobile
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <>
      {/* Ring - follows with lag */}
      <motion.div
        style={{
          x: ringX,
          y: ringY,
          scale: ringScale,
          translateX: '-50%',
          translateY: '-50%',
        }}
        className="pointer-events-none fixed left-0 top-0 z-[9998] hidden md:block
                   h-10 w-10 rounded-full border border-accent/40
                   mix-blend-difference transition-colors duration-300"
      />
      {/* Dot - tight follow */}
      <motion.div
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden md:block
                   h-2 w-2 rounded-full bg-accent"
      />
    </>
  );
}
