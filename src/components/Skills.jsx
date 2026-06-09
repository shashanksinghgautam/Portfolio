import { useRef, useState, memo } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { skillGroups } from '../data/portfolio.js';
import { useIsMobile } from '../hooks/useDevicePerformance.js';

/* ================================================================
   Skills - Animated bento grid with:
   - Cursor-tracking radial glow on each card
   - Staggered pill entrance with spring physics
   - Card tilt on hover (subtle 3D)
   - Active group highlight with animated border
   - Skill pill orbit animation on hover
================================================================ */

const reveal = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.8, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] },
  }),
};

const pillReveal = {
  hidden: { opacity: 0, scale: 0.5, y: 10 },
  visible: (i = 0) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20,
      delay: 0.4 + i * 0.04,
    },
  }),
};

const spanClasses = [
  'md:col-span-2', 'md:col-span-1', 'md:col-span-1', 'md:col-span-2',
  'md:col-span-1', 'md:col-span-2', 'md:col-span-1', 'md:col-span-1',
];

function SkillCard({ group, index }) {
  const cardRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const isMobile = useIsMobile();

  const handleMouseMove = (e) => {
    if (isMobile) return;
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    cardRef.current.style.setProperty('--mouse-x', `${x}%`);
    cardRef.current.style.setProperty('--mouse-y', `${y}%`);
    const tiltX = ((y - 50) / 50) * -4;
    const tiltY = ((x - 50) / 50) * 4;
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleLeave = () => {
    setHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleLeave}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={reveal}
      custom={index}
      animate={isMobile ? undefined : {
        rotateX: tilt.x,
        rotateY: tilt.y,
        transition: { type: 'spring', stiffness: 300, damping: 30 },
      }}
      style={isMobile ? undefined : { transformPerspective: 1000 }}
      className={`card-glow p-6 sm:p-8 ${spanClasses[index] || ''}`}
    >
      {/* Animated border on hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl border-2 border-accent/0 pointer-events-none"
        animate={{ borderColor: hovered ? 'rgba(0, 229, 160, 0.2)' : 'rgba(0, 229, 160, 0)' }}
        transition={{ duration: 0.4 }}
      />

      <h3 className="relative text-[11px] font-mono font-semibold uppercase tracking-wider text-accent mb-5 flex items-center gap-2">
        <motion.span
          animate={{ rotate: hovered ? 90 : 0 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="inline-block w-2 h-2 bg-accent/30 rounded-sm"
        />
        {group.title}
      </h3>

      <div className="relative flex flex-wrap gap-2">
        {group.items.map((item, i) => (
          <motion.span
            key={item}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={pillReveal}
            custom={i}
            whileHover={{
              scale: 1.08,
              y: -2,
              transition: { type: 'spring', stiffness: 400, damping: 15 },
            }}
            className="rounded-md border border-[var(--border)] bg-[var(--bg-subtle)] px-3 py-1.5
                       text-[12px] font-medium text-secondary cursor-default
                       hover:border-accent/40 hover:text-accent hover:bg-accent/5
                       hover:shadow-[0_0_16px_-4px_rgba(0,229,160,0.35)]
                       transition-colors duration-300"
          >
            {item}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}

export default function Skills() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section id="skills" ref={sectionRef} className="py-32 sm:py-40">
      <div className="container-wide">
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="label mb-4"
        >
          Stack
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
          animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-headline max-w-lg mb-16"
        >
          Technologies I use <span className="gradient-text">daily</span>.
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {skillGroups.map((g, idx) => (
            <SkillCard key={g.title} group={g} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
