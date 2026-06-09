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
  const ringX = useSpring(cursorX, { stiffness: 200, damping: 22, mass: 0.45 });
  const ringY = useSpring(cursorY, { stiffness: 200, damping: 22, mass: 0.45 });
  const dotX = useSpring(cursorX, { stiffness: 480, damping: 32 });
  const dotY = useSpring(cursorY, { stiffness: 480, damping: 32 });
  const scale = useMotionValue(1);
  const ringScale = useSpring(scale, { stiffness: 320, damping: 24 });
  const ringOpacity = useMotionValue(0.45);
  const dotOpacity = useMotionValue(0.8);

  useEffect(() => {
    // Only show on desktop
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleHoverStart = () => {
      scale.set(1.45);
      ringOpacity.set(0.72);
    };
    const handleHoverEnd = () => {
      scale.set(1);
      ringOpacity.set(0.45);
    };

    const handleMouseDown = () => {
      scale.set(0.9);
      dotOpacity.set(1);
    };
    const handleMouseUp = () => {
      scale.set(1);
      dotOpacity.set(0.8);
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

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
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      interactives.forEach((el) => {
        el.removeEventListener('mouseenter', handleHoverStart);
        el.removeEventListener('mouseleave', handleHoverEnd);
      });
      observer.disconnect();
    };
  }, [cursorX, cursorY, scale, ringOpacity, dotOpacity]);

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
          opacity: ringOpacity,
          translateX: '-50%',
          translateY: '-50%',
        }}
        className="pointer-events-none fixed left-0 top-0 z-[9998] hidden md:block
                   h-8 w-8 rounded-full border border-accent/50
                   bg-accent/5 transition-colors duration-300"
      />
      {/* Dot - tight follow */}
      <motion.div
        style={{
          x: dotX,
          y: dotY,
          opacity: dotOpacity,
          translateX: '-50%',
          translateY: '-50%',
        }}
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden md:block
                   h-1.5 w-1.5 rounded-full bg-accent"
      />
    </>
  );
}
