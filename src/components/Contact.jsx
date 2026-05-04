import { motion } from 'framer-motion';
import { ArrowRight, Download } from 'lucide-react';
import { profile } from '../data/portfolio.js';

/* ----------------------------------------------------------------
   Bottom CTA section - minimal & elegant.
   Primary contact is now the floating side panel; this is the
   anchor-scrollable "Let's connect" call-to-action.
---------------------------------------------------------------- */

export default function Contact() {
  return (
    <section id="contact" className="py-28 sm:py-36">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-3xl border border-ink-100 dark:border-white/10
                     bg-white/50 dark:bg-ink-800/40 backdrop-blur-xl p-10 sm:p-16"
        >
          {/* Ambient glow orbs */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full
                          bg-[radial-gradient(circle,rgba(31,111,235,0.15),transparent_60%)]" />
          <div className="pointer-events-none absolute -left-32 -bottom-32 h-96 w-96 rounded-full
                          bg-[radial-gradient(circle,rgba(124,58,237,0.12),transparent_60%)]" />

          <div className="relative max-w-xl mx-auto text-center">
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="section-heading-eyebrow"
            >
              Get in Touch
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="mt-3 font-display text-3xl sm:text-4xl font-semibold tracking-tight
                         text-ink-900 dark:text-white"
            >
              Let's build something{' '}
              <span className="gradient-text">great together</span>.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-4 text-base sm:text-lg text-ink-500 dark:text-ink-300"
            >
              I'm open to senior backend / full-stack roles, system-design discussions, and interesting collaborations.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-8 flex flex-wrap justify-center gap-3"
            >
              <a href={`mailto:${profile.email}`} className="btn-primary group">
                Say hello
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              </a>
              <a href={profile.resumeUrl} download className="btn-ghost">
                <Download size={16} /> Download Resume
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
