import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import SectionHeading from './SectionHeading.jsx';
import { about, profile } from '../data/portfolio.js';

const reveal = {
  hidden: { opacity: 0, y: 24, filter: 'blur(6px)' },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function About() {
  return (
    <section id="about" className="py-28 sm:py-36">
      <div className="container-page grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeading
            eyebrow="About"
            title="Backend craft, with a product mindset."
            description="I care about systems that scale, codebases that stay readable, and metrics that prove impact."
          />
        </div>
        <div className="lg:col-span-7 space-y-5">
          {about.paragraphs.map((p, i) => (
            <motion.p
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={reveal}
              custom={i}
              className="text-base sm:text-lg leading-relaxed text-ink-600 dark:text-ink-200"
            >
              {p}
            </motion.p>
          ))}

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={reveal}
            custom={3}
            whileHover={{ y: -4, transition: { type: 'spring', stiffness: 300 } }}
            className="group relative overflow-hidden rounded-2xl border border-ink-100 dark:border-white/10
                       bg-white/70 dark:bg-ink-800/50 backdrop-blur-sm shadow-card
                       mt-8 p-7 transition-shadow duration-300 hover:shadow-glow"
          >
            {/* Hover accent ring */}
            <div className="pointer-events-none absolute inset-0 rounded-[inherit]
                            ring-1 ring-inset ring-transparent transition-[box-shadow] duration-300
                            group-hover:ring-accent/25" />
            <div className="relative flex items-center gap-2 text-sm font-semibold text-accent">
              <Sparkles size={16} /> What I bring
            </div>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {about.highlights.map((h, i) => (
                <motion.li
                  key={h}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="flex items-start gap-2 text-sm text-ink-600 dark:text-ink-200"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {h}
                </motion.li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-ink-500 dark:text-ink-300">
              <span className="chip">{profile.yearsExperience}+ yrs experience</span>
              <span className="chip">Java · Spring Boot</span>
              <span className="chip">Microservices</span>
              <span className="chip">AWS</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
