import { motion } from 'framer-motion';
import { Award } from 'lucide-react';
import { experience, education } from '../data/portfolio.js';

/* ----------------------------------------------------------------
   Experience - glowing timeline with accent pulsing nodes.
---------------------------------------------------------------- */

const reveal = {
  hidden: { opacity: 0, y: 30, filter: 'blur(6px)' },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] },
  }),
};

function TimelineEntry({ entry, index }) {
  return (
    <motion.div
      initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
      variants={reveal} custom={index}
      className="relative grid grid-cols-[auto_1fr] gap-6 md:gap-10"
    >
      {/* Track */}
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3, type: 'spring', stiffness: 300 }}
          className="relative h-4 w-4 rounded-full border-2 border-accent bg-[var(--bg)] flex-shrink-0 mt-1.5"
        >
          {/* Pulse ring */}
          <span className="absolute inset-0 rounded-full bg-accent/30 animate-ping" />
        </motion.div>
        <div className="w-px flex-1 bg-gradient-to-b from-accent/40 via-accent/10 to-transparent mt-2" />
      </div>

      {/* Content */}
      <div className="pb-16">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <h3 className="text-title">{entry.role}</h3>
            <p className="mt-1 text-sm font-medium text-accent">{entry.company}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-mono text-tertiary">{entry.period}</p>
            <p className="text-xs text-tertiary mt-0.5">{entry.location}</p>
          </div>
        </div>

        <ul className="mt-6 space-y-3">
          {entry.bullets.map((b, bi) => (
            <motion.li
              key={bi}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + bi * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex gap-3 text-sm leading-relaxed text-secondary"
            >
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent/60" />
              {b}
            </motion.li>
          ))}
        </ul>

        {entry.awards?.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-6 flex flex-wrap items-center gap-3"
          >
            <Award size={14} className="text-amber-400" />
            {entry.awards.map((a) => (
              <span key={a} className="rounded-full border border-amber-400/30 bg-amber-400/5 px-3 py-1
                                       text-[11px] font-medium text-amber-400">
                {a}
              </span>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

function EducationEntry({ entry, index }) {
  return (
    <motion.div
      initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
      variants={reveal} custom={index}
      className="relative grid grid-cols-[auto_1fr] gap-6 md:gap-10"
    >
      <div className="flex flex-col items-center">
        <div className="h-4 w-4 rounded-full border-2 border-[var(--text-tertiary)] bg-[var(--bg)] flex-shrink-0 mt-1.5" />
      </div>
      <div className="pb-8">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold tracking-tight text-primary">{entry.degree}</h3>
            <p className="mt-1 text-sm text-secondary">{entry.school}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-mono text-tertiary">{entry.period}</p>
            <p className="text-xs text-tertiary mt-0.5">{entry.detail}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Experience() {
  return (
    <section id="experience" className="py-32 sm:py-40">
      <div className="container-wide">
        <motion.p
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }}
          variants={reveal} custom={0}
          className="label mb-4"
        >
          Experience
        </motion.p>
        <motion.h2
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }}
          variants={reveal} custom={1}
          className="text-headline max-w-lg mb-16"
        >
          Building enterprise software{' '}
          <span className="gradient-text">since 2022</span>.
        </motion.h2>

        <div className="max-w-3xl">
          {experience.map((e, i) => (
            <TimelineEntry key={e.company} entry={e} index={i} />
          ))}
          {education.map((ed, i) => (
            <EducationEntry key={ed.school} entry={ed} index={experience.length + i} />
          ))}
        </div>
      </div>
    </section>
  );
}
