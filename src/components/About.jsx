import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { about, profile } from '../data/portfolio.js';

/* ----------------------------------------------------------------
   About - asymmetric editorial layout with glowing card.
---------------------------------------------------------------- */

const reveal = {
  hidden: { opacity: 0, y: 40, filter: 'blur(8px)' },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.9, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function About() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section id="about" ref={sectionRef} className="py-32 sm:py-40">
      <div className="container-wide">
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="label mb-4"
        >
          About
        </motion.p>

        <div className="grid gap-16 lg:grid-cols-[1.3fr_1fr] lg:gap-20">
          {/* Left */}
          <div>
            <motion.h2
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }}
              variants={reveal} custom={1}
              className="text-headline max-w-lg"
            >
              I build systems that{' '}
              <span className="gradient-text">work reliably</span> - at scale, without drama.
            </motion.h2>

            <div className="mt-10 space-y-5">
              {about.paragraphs.map((p, i) => (
                <motion.p
                  key={i}
                  initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
                  variants={reveal} custom={i + 2}
                  className="text-base leading-relaxed text-secondary"
                >
                  {p}
                </motion.p>
              ))}
            </div>
          </div>

          {/* Right - glowing card */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
            variants={reveal} custom={3}
            className="lg:pt-12"
          >
            <div className="card-glow p-8">
              <p className="label mb-6">What I bring</p>
              <ul className="space-y-4">
                {about.highlights.map((h, i) => (
                  <motion.li
                    key={h}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-start gap-3 text-sm text-secondary"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent shadow-[0_0_6px_rgba(0,229,160,0.6)]" />
                    {h}
                  </motion.li>
                ))}
              </ul>

              <div className="mt-8 pt-6 border-t border-[var(--border)] flex flex-wrap gap-3">
                <span className="rounded-full border border-accent/20 bg-accent/5 px-3 py-1 text-[11px] font-mono text-accent">
                  {profile.yearsExperience}+ years
                </span>
                <span className="rounded-full border border-accent/20 bg-accent/5 px-3 py-1 text-[11px] font-mono text-accent">
                  6+ platforms
                </span>
                <span className="rounded-full border border-accent/20 bg-accent/5 px-3 py-1 text-[11px] font-mono text-accent">
                  3× awarded
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
