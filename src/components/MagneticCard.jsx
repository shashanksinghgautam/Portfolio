import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/* ----------------------------------------------------------------
   Magnetic card wrapper - 3D tilt + cursor-follow glow.
   FIX: glow uses inset-0 (not -inset-px) to prevent sub-pixel
   misalignment under perspective transforms. Hover state managed
   via React state instead of group-hover to guarantee sync.
---------------------------------------------------------------- */

export default function MagneticCard({ children, className = '', glowColor = 'rgba(31,111,235,0.10)' }) {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const springX = useSpring(x, { stiffness: 260, damping: 22 });
  const springY = useSpring(y, { stiffness: 260, damping: 22 });

  const rotateX = useTransform(springY, [0, 1], [3, -3]);
  const rotateY = useTransform(springX, [0, 1], [-3, 3]);

  const glowBg = useTransform(
    [springX, springY],
    ([px, py]) =>
      `radial-gradient(350px circle at ${px * 100}% ${py * 100}%, ${glowColor}, transparent 55%)`
  );

  const handleMouseMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseLeave = () => {
    x.set(0.5);
    y.set(0.5);
    setHovered(false);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 900,
        willChange: 'transform',
      }}
      className={`relative ${className}`}
    >
      {/* Glow layer - inset-0 keeps it pixel-aligned under perspective */}
      <motion.div
        style={{ background: glowBg }}
        className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-400"
        animate={{ opacity: hovered ? 1 : 0 }}
      />
      {children}
    </motion.div>
  );
}
