import { motion } from 'framer-motion';
import MagneticCard from './MagneticCard.jsx';
import SectionHeading from './SectionHeading.jsx';
import { skillGroups } from '../data/portfolio.js';

const reveal = {
  hidden: { opacity: 0, y: 20, filter: 'blur(6px)' },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Skills() {
  return (
    <section id="skills" className="py-28 sm:py-36">
      <div className="container-page">
        <SectionHeading
          eyebrow="Toolkit"
          title="Skills & Technologies"
          description="The stack I reach for to design, build, and operate production systems."
        />

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {skillGroups.map((g, idx) => (
            <motion.div
              key={g.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={reveal}
              custom={idx}
            >
              <MagneticCard className="group h-full">
                <div className="relative h-full overflow-hidden rounded-2xl border border-ink-100 dark:border-white/10
                                bg-white/70 dark:bg-ink-800/50 backdrop-blur-sm shadow-card
                                p-6 transition-shadow duration-300 hover:shadow-glow">
                  {/* Hover accent ring - no layout shift */}
                  <div className="pointer-events-none absolute inset-0 rounded-[inherit]
                                  ring-1 ring-inset ring-transparent transition-[box-shadow] duration-300
                                  group-hover:ring-accent/25" />
                  <h3 className="relative font-display text-sm font-semibold uppercase tracking-wider text-accent">
                    {g.title}
                  </h3>
                  <ul className="relative mt-4 flex flex-wrap gap-2">
                    {g.items.map((item, i) => (
                      <motion.li
                        key={item}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + i * 0.03, duration: 0.3 }}
                        className="rounded-lg bg-ink-100/70 dark:bg-white/5 px-3 py-1.5 text-xs font-medium
                                   text-ink-700 dark:text-ink-100 transition-all duration-200
                                   hover:bg-accent/10 hover:text-accent dark:hover:bg-accent/10 dark:hover:text-accent"
                      >
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </MagneticCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
