import { motion, useScroll, useSpring } from 'framer-motion';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 25, mass: 0.5 });
  return (
    <>
      <motion.div
        style={{ scaleX }}
        className="fixed left-0 top-0 z-[60] h-[2px] w-full origin-left
                   bg-gradient-to-r from-accent via-violet-500 to-fuchsia-500"
      />
      {/* Glow under the progress bar */}
      <motion.div
        style={{ scaleX }}
        className="fixed left-0 top-0 z-[59] h-[6px] w-full origin-left blur-[4px]
                   bg-gradient-to-r from-accent/50 via-violet-500/50 to-fuchsia-500/50"
      />
    </>
  );
}
