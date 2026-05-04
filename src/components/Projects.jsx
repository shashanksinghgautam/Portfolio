import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import SectionHeading from './SectionHeading.jsx';
import { projects } from '../data/portfolio.js';

/* 3D tilt card for projects - glow aligned with inset-0, hover via state */
function ProjectCard({ project, index }) {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const sx = useSpring(x, { stiffness: 260, damping: 22 });
  const sy = useSpring(y, { stiffness: 260, damping: 22 });
  const rotateX = useTransform(sy, [0, 1], [4, -4]);
  const rotateY = useTransform(sx, [0, 1], [-4, 4]);
  const glowBg = useTransform(
    [sx, sy],
    ([px, py]) => `radial-gradient(320px circle at ${px * 100}% ${py * 100}%, rgba(31,111,235,0.13), transparent 50%)`
  );

  const handleMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  };
  const handleLeave = () => { x.set(0.5); y.set(0.5); setHovered(false); };

  return (
    <motion.article
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleLeave}
      initial={{ opacity: 0, y: 28, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      style={{ rotateX, rotateY, transformPerspective: 900, willChange: 'transform' }}
      className="group relative overflow-hidden rounded-2xl border border-ink-100 dark:border-white/10
                 bg-white/70 dark:bg-ink-800/50 backdrop-blur-sm shadow-card transition-shadow duration-300
                 hover:shadow-glow"
    >
      {/* Cursor-follow glow - inset-0 for perfect alignment */}
      <motion.div
        style={{ background: glowBg }}
        className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-400"
        animate={{ opacity: hovered ? 1 : 0 }}
      />

      {/* Hover accent ring - uses outline to avoid layout shift */}
      <div className="pointer-events-none absolute inset-0 rounded-[inherit]
                      ring-1 ring-inset ring-transparent transition-[box-shadow] duration-300
                      group-hover:ring-accent/25" />

      <div className="relative p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-accent">{project.subtitle}</div>
            <h3 className="mt-1.5 font-display text-xl font-semibold text-ink-900 dark:text-white">{project.title}</h3>
          </div>
          {project.link ? (
            <a href={project.link} target="_blank" rel="noreferrer"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl
                         bg-ink-100 dark:bg-white/5 text-ink-600 dark:text-ink-200
                         transition-all duration-300 group-hover:bg-accent group-hover:text-white group-hover:scale-110"
              aria-label="Open project"
            >
              <ArrowUpRight size={16} />
            </a>
          ) : (
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl
                             bg-ink-100/60 dark:bg-white/5 text-ink-400
                             group-hover:text-accent transition-colors duration-300">
              <Sparkles size={15} />
            </span>
          )}
        </div>

        <p className="mt-5 text-sm leading-relaxed text-ink-600 dark:text-ink-300">{project.description}</p>

        <div className="mt-6 flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <span key={t} className="rounded-md bg-ink-100/70 dark:bg-white/5 px-2.5 py-1 text-[11px] font-medium
                                     text-ink-600 dark:text-ink-200 transition-colors duration-200
                                     group-hover:bg-accent/10 group-hover:text-accent">
              {t}
            </span>
          ))}
        </div>

        <div className="mt-7 flex items-center justify-between border-t border-ink-100/80 dark:border-white/[0.06] pt-5">
          <span className="text-xs font-medium uppercase tracking-wider text-ink-400">Impact</span>
          <span className="text-sm font-bold gradient-text">{project.impact}</span>
        </div>
      </div>
    </motion.article>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="py-28 sm:py-36">
      <div className="container-page">
        <SectionHeading
          eyebrow="Selected Work"
          title="Projects with measurable impact"
          description="A snapshot of systems I've designed and shipped - with the metrics that mattered to the business."
        />

        <div className="mt-16 grid gap-6 md:grid-cols-2" style={{ perspective: 1000 }}>
          {projects.map((p, i) => (
            <ProjectCard key={p.title} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
