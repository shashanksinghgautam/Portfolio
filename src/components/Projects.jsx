import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useInView } from 'framer-motion';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import { projects } from '../data/portfolio.js';
import Magnetic from './Magnetic.jsx';

/* ================================================================
   Projects - Premium case study cards with:
   - Deep 3D perspective tilt (spring physics)
   - Cursor-following light source (CSS + canvas glow)
   - Staggered entrance with scale + blur
   - Hover lift with glow shadow
   - Tech pills with spring pop
   - Image-less: typography-focused cards
================================================================ */

const reveal = {
  hidden: { opacity: 0, y: 60, scale: 0.94, filter: 'blur(12px)' },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 1, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
};

function ProjectCard({ project, index }) {
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });
  const rotateX = useTransform(springY, [0, 1], [6, -6]);
  const rotateY = useTransform(springX, [0, 1], [-6, 6]);
  const brightness = useTransform(springX, [0, 0.5, 1], [0.95, 1, 1.05]);

  const handleMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    x.set(px);
    y.set(py);
    ref.current.style.setProperty('--mouse-x', `${px * 100}%`);
    ref.current.style.setProperty('--mouse-y', `${py * 100}%`);
  };

  const handleLeave = () => {
    x.set(0.5);
    y.set(0.5);
    setIsHovered(false);
  };

  return (
    <motion.article
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleLeave}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={reveal}
      custom={index}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      whileHover={{ y: -8, transition: { type: 'spring', stiffness: 200, damping: 20 } }}
      className="card-glow p-8 sm:p-10 group"
    >
      {/* Shimmer border effect on hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden"
        initial={false}
        animate={{
          boxShadow: isHovered
            ? '0 0 60px -10px rgba(0, 229, 160, 0.2), inset 0 0 60px -20px rgba(0, 229, 160, 0.05)'
            : '0 0 0px 0px transparent',
        }}
        transition={{ duration: 0.5 }}
      />

      {/* Header */}
      <div className="relative flex items-start justify-between gap-4 mb-6">
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
          className="text-[11px] font-mono uppercase tracking-wider text-accent"
        >
          {project.subtitle}
        </motion.span>
        <motion.span
          whileHover={{ scale: 1.05 }}
          className="inline-flex items-center gap-1 rounded-full border border-accent/30
                     bg-accent/5 px-3 py-1 text-[11px] font-semibold text-accent
                     shadow-[0_0_12px_-4px_rgba(0,229,160,0.4)]"
        >
          {project.impact}
        </motion.span>
      </div>

      {/* Title */}
      <h3 className="relative text-title sm:text-[1.5rem] max-w-lg leading-tight
                     group-hover:text-accent transition-colors duration-500">
        {project.title}
      </h3>

      {/* Description */}
      <p className="relative mt-4 text-sm leading-relaxed text-secondary max-w-2xl">
        {project.description}
      </p>

      {/* Tech + link */}
      <div className="relative mt-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {project.tech.map((t, ti) => (
            <motion.span
              key={t}
              initial={{ opacity: 0, scale: 0.7 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.5 + ti * 0.04 }}
              whileHover={{ scale: 1.1, y: -2 }}
              className="rounded-md border border-[var(--border)] bg-[var(--bg-subtle)] px-2.5 py-1
                         text-[11px] font-mono text-tertiary cursor-default
                         hover:border-accent/30 hover:text-accent hover:bg-accent/5
                         transition-colors duration-300"
            >
              {t}
            </motion.span>
          ))}
        </div>
        {project.link && (
          <Magnetic strength={0.3}>
            <a href={project.link} target="_blank" rel="noreferrer"
               className="inline-flex items-center gap-1.5 text-xs font-medium text-accent
                          hover:gap-2.5 transition-all duration-300">
              View project <ArrowUpRight size={12} />
            </a>
          </Magnetic>
        )}
      </div>
    </motion.article>
  );
}

export default function Projects() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section id="projects" ref={sectionRef} className="py-32 sm:py-40">
      <div className="container-wide">
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="label mb-4"
        >
          Work
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
          animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-headline max-w-lg mb-16"
        >
          Projects with <span className="gradient-text">measurable impact</span>.
        </motion.h2>

        <div className="grid gap-6">
          {projects.map((p, idx) => (
            <ProjectCard key={p.title} project={p} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
