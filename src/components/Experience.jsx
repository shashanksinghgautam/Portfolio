import { motion } from 'framer-motion';
import { Award, Briefcase, GraduationCap } from 'lucide-react';
import SectionHeading from './SectionHeading.jsx';
import { experience, education } from '../data/portfolio.js';

const reveal = {
  hidden: { opacity: 0, x: -24, filter: 'blur(6px)' },
  visible: (i = 0) => ({
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

function TimelineItem({ icon: Icon, title, subtitle, period, location, children, isLast, index }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={reveal}
      custom={index}
      className="relative pl-12"
    >
      {!isLast && (
        <motion.div
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          className="absolute left-[18px] top-10 bottom-0 w-px origin-top bg-gradient-to-b from-accent/40 to-transparent"
        />
      )}
      <motion.div
        whileHover={{ scale: 1.15, rotate: 8 }}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        className="absolute left-0 top-0 flex h-9 w-9 items-center justify-center rounded-full
                   bg-gradient-to-br from-accent to-violet-600 text-white shadow-glow"
      >
        <Icon size={16} />
      </motion.div>
      <div className="group relative overflow-hidden rounded-2xl border border-ink-100 dark:border-white/10
                 bg-white/70 dark:bg-ink-800/50 backdrop-blur-sm shadow-card
                 p-7 transition-shadow duration-300 hover:shadow-glow">
        {/* Hover accent ring */}
        <div className="pointer-events-none absolute inset-0 rounded-[inherit]
                        ring-1 ring-inset ring-transparent transition-[box-shadow] duration-300
                        group-hover:ring-accent/25" />
        <div className="relative flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <h3 className="font-display text-lg font-semibold text-ink-900 dark:text-white">{title}</h3>
            <p className="text-sm text-accent font-medium">{subtitle}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium text-ink-500 dark:text-ink-300">{period}</p>
            {location && <p className="text-xs text-ink-400">{location}</p>}
          </div>
        </div>
        {children}
      </div>
    </motion.div>
  );
}

export default function Experience() {
  return (
    <section id="experience" className="py-28 sm:py-36">
      <div className="container-page">
        <SectionHeading
          eyebrow="Journey"
          title="Experience & Education"
          description="From engineering classrooms to production-grade microservices."
        />

        <div className="mt-14 space-y-6">
          {experience.map((e, i) => (
            <TimelineItem
              key={e.company}
              icon={Briefcase}
              title={e.role}
              subtitle={e.company}
              period={e.period}
              location={e.location}
              isLast={false}
              index={i}
            >
              <ul className="mt-4 space-y-2">
                {e.bullets.map((b, bi) => (
                  <motion.li
                    key={b}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + bi * 0.04 }}
                    className="flex gap-2 text-sm text-ink-600 dark:text-ink-200"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {b}
                  </motion.li>
                ))}
              </ul>
              {e.awards?.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 }}
                  className="mt-5 flex flex-wrap items-center gap-2"
                >
                  <Award size={14} className="text-amber-500" />
                  {e.awards.map((a) => (
                    <span key={a} className="chip !text-amber-600 dark:!text-amber-400 !border-amber-500/30">
                      {a}
                    </span>
                  ))}
                </motion.div>
              )}
            </TimelineItem>
          ))}

          {education.map((ed, i) => (
            <TimelineItem
              key={ed.school}
              icon={GraduationCap}
              title={ed.degree}
              subtitle={ed.school}
              period={ed.period}
              location={ed.location}
              isLast={i === education.length - 1}
              index={experience.length + i}
            >
              <p className="mt-3 text-sm text-ink-600 dark:text-ink-200">{ed.detail}</p>
            </TimelineItem>
          ))}
        </div>
      </div>
    </section>
  );
}
