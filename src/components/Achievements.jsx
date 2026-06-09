import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { achievements } from '../data/portfolio.js';

/* ================================================================
   Achievements - Animated metric grid with:
   - Counter animation (numbers count up)
   - Staggered card entrance
   - Hover lift + glow
   - Gradient border on hover
   - Morphing background subtle shift
================================================================ */

// Counter animation component
function AnimatedMetric({ value, inView }) {
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!inView) return;
    // Extract numeric part
    const match = value.match(/^([0-9,.]+)(.*)/);
    if (!match) { setDisplay(value); return; }
    const numStr = match[1].replace(/,/g, '');
    const suffix = match[2];
    const target = parseFloat(numStr);
    if (isNaN(target)) { setDisplay(value); return; }
    const isFloat = numStr.includes('.');
    const hasCommas = match[1].includes(',');
    const duration = 2000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4); // ease-out quart
      const current = eased * target;
      let formatted;
      if (isFloat) {
        formatted = current.toFixed(1);
      } else {
        const rounded = Math.floor(current);
        formatted = hasCommas ? rounded.toLocaleString() : String(rounded);
      }
      setDisplay(formatted + suffix);
      if (progress < 1) requestAnimationFrame(animate);
      else setDisplay(value);
    };
    animate();
  }, [inView, value]);

  return <>{display}</>;
}

const reveal = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
};

function AchievementCard({ achievement, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={reveal}
      custom={index}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ y: -4, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
      className="relative bg-[var(--bg-elevated)] p-8 sm:p-10 flex flex-col overflow-hidden
                 border border-[var(--border)] rounded-2xl
                 hover:border-accent/30 hover:shadow-[0_0_50px_-12px_rgba(0,229,160,0.15)]
                 transition-all duration-500 group"
    >
      {/* Hover glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        animate={{
          background: hovered
            ? 'radial-gradient(400px circle at 50% 50%, rgba(0,229,160,0.04), transparent 60%)'
            : 'transparent',
        }}
        transition={{ duration: 0.5 }}
      />

      <span className="relative text-4xl sm:text-5xl font-bold tracking-tighter gradient-text">
        <AnimatedMetric value={achievement.metric} inView={isInView} />
      </span>
      <h3 className="relative mt-4 text-sm font-semibold text-primary group-hover:text-accent transition-colors duration-500">
        {achievement.title}
      </h3>
      <p className="relative mt-2 text-[13px] leading-relaxed text-tertiary flex-1">
        {achievement.description}
      </p>

      {/* Bottom accent line */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent/0 via-accent/50 to-accent/0"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      />
    </motion.div>
  );
}

export default function Achievements() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section id="achievements" ref={sectionRef} className="py-32 sm:py-40">
      <div className="container-wide">
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="label mb-4"
        >
          Impact
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
          animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-headline max-w-lg mb-16"
        >
          Numbers that <span className="gradient-text">mattered</span>.
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((a, i) => (
            <AchievementCard key={a.title} achievement={a} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
