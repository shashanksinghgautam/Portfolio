import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { profile } from '../data/portfolio.js';
import Magnetic from './Magnetic.jsx';

/* ----------------------------------------------------------------
   Contact - bold CTA with glowing accent elements.
---------------------------------------------------------------- */

const reveal = {
  hidden: { opacity: 0, y: 40, filter: 'blur(8px)' },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.9, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function Contact() {
  return (
    <section id="contact" className="py-32 sm:py-40">
      <div className="container-wide">
        {/* Glowing container */}
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
          variants={reveal} custom={0}
          className="relative rounded-3xl border border-accent/20 bg-[var(--bg-elevated)] p-10 sm:p-16 overflow-hidden"
        >
          {/* Ambient glow orbs */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full
                          bg-[radial-gradient(circle,rgba(0,229,160,0.15),transparent_60%)] blur-xl" />
          <div className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 rounded-full
                          bg-[radial-gradient(circle,rgba(34,211,238,0.08),transparent_60%)] blur-xl" />

          <div className="relative max-w-xl">
            <motion.p variants={reveal} custom={1} className="label mb-4">
              Contact
            </motion.p>

            <motion.h2 variants={reveal} custom={2} className="text-headline">
              Let's build something{' '}
              <span className="gradient-text">extraordinary</span>.
            </motion.h2>

            <motion.p variants={reveal} custom={3} className="mt-6 text-base text-secondary max-w-lg">
              I'm open to full-stack engineering roles, backend projects, and
              ambitious product collaborations. Let's talk.
            </motion.p>

            <motion.div variants={reveal} custom={4} className="mt-10 flex flex-wrap items-center gap-4">
              <Magnetic strength={0.2}>
                <a href={`mailto:${profile.email}`} className="btn-primary group">
                  {profile.email}
                  <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </Magnetic>
            </motion.div>

            <motion.div variants={reveal} custom={5} className="mt-8 flex flex-wrap gap-6">
              <a href={profile.github} target="_blank" rel="noreferrer"
                 className="text-sm text-tertiary hover:text-accent transition-colors duration-300">
                GitHub
              </a>
              <a href={profile.linkedin} target="_blank" rel="noreferrer"
                 className="text-sm text-tertiary hover:text-accent transition-colors duration-300">
                LinkedIn
              </a>
              <a href={profile.resumeUrl} download
                 className="text-sm text-tertiary hover:text-accent transition-colors duration-300">
                Résumé
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
