import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Download, MapPin, Terminal } from 'lucide-react';
import { profile } from '../data/portfolio.js';

const fadeUp = {
  hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, delay: 0.15 + i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

function CountUp({ value }) {
  return <span>{value}</span>;
}

/* Geometric accent behind hero title - abstract circuit node pattern */
function HeroAccent() {
  return (
    <div className="pointer-events-none absolute -right-16 -top-12 h-[340px] w-[340px] opacity-[0.06] dark:opacity-[0.04]">
      <svg viewBox="0 0 340 340" fill="none" className="h-full w-full">
        <circle cx="170" cy="170" r="140" stroke="currentColor" strokeWidth="0.5" strokeDasharray="8 6" />
        <circle cx="170" cy="170" r="90" stroke="currentColor" strokeWidth="0.5" />
        <circle cx="170" cy="170" r="40" stroke="currentColor" strokeWidth="0.8" />
        <circle cx="170" cy="30" r="4" fill="currentColor" />
        <circle cx="310" cy="170" r="4" fill="currentColor" />
        <circle cx="170" cy="310" r="4" fill="currentColor" />
        <circle cx="30" cy="170" r="4" fill="currentColor" />
        <line x1="170" y1="30" x2="170" y2="130" stroke="currentColor" strokeWidth="0.4" />
        <line x1="310" y1="170" x2="210" y2="170" stroke="currentColor" strokeWidth="0.4" />
        <line x1="170" y1="310" x2="170" y2="210" stroke="currentColor" strokeWidth="0.4" />
        <line x1="30" y1="170" x2="130" y2="170" stroke="currentColor" strokeWidth="0.4" />
      </svg>
    </div>
  );
}

export default function Hero() {
  const { scrollYProgress } = useScroll();
  const yParallax = useTransform(scrollYProgress, [0, 0.3], [0, -50]);
  const opacityFade = useTransform(scrollYProgress, [0, 0.25], [1, 0.3]);
  const heroName = profile.name.split(' ')[0];
  const [typedName, setTypedName] = useState('');
  const [typingDone, setTypingDone] = useState(false);

  useEffect(() => {
    let i = 0;
    let intervalId;
    const startTimeout = setTimeout(() => {
      intervalId = setInterval(() => {
        i += 1;
        setTypedName(heroName.slice(0, i));
        if (i >= heroName.length) {
          clearInterval(intervalId);
          setTypingDone(true);
        }
      }, 95);
    }, 260);

    return () => {
      clearTimeout(startTimeout);
      if (intervalId) clearInterval(intervalId);
    };
  }, [heroName]);

  return (
    <section id="top" className="relative pt-36 pb-28 sm:pt-44 sm:pb-36">
      <motion.div style={{ y: yParallax, opacity: opacityFade }} className="container-page">
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.06 } } }}
          className="relative max-w-4xl"
        >
          <HeroAccent />

          <motion.div variants={fadeUp} custom={0} className="chip">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Available for new opportunities
          </motion.div>

          <motion.h1
            variants={fadeUp}
            custom={1}
            className="mt-8 font-display text-5xl sm:text-6xl lg:text-[5.5rem] font-semibold leading-[1.05]
                       tracking-tight text-ink-900 dark:text-white"
          >
            <span className="text-ink-500 dark:text-ink-300">Hi, I'm</span>{' '}
            <span className="relative inline-flex items-end">
              <span className="gradient-text">{typedName}</span>
              <motion.span
                aria-hidden="true"
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
                className="mb-[0.08em] ml-1 inline-block h-[0.86em] w-[2px]
                           rounded-full bg-accent/80"
              />
              {/* Animated underline */}
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: typedName.length >= heroName.length ? 1 : 0 }}
                transition={{ duration: 0.8, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="absolute -bottom-1.5 left-0 h-[3px] w-full origin-left
                           bg-gradient-to-r from-accent via-violet-500 to-fuchsia-500 rounded-full"
              />
            </span>
            .
          </motion.h1>

          <div className="mt-4 max-w-3xl overflow-hidden">
            <motion.p
              initial={{ x: -72, opacity: 0, filter: 'blur(6px)' }}
              animate={typingDone ? { x: 0, opacity: 1, filter: 'blur(0px)' } : { x: -72, opacity: 0, filter: 'blur(6px)' }}
              transition={{ duration: 0.75, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="text-ink-500 dark:text-ink-300 text-[1.05rem] sm:text-[1.25rem] font-medium"
            >
              Fullstack developer building
            </motion.p>
            <motion.p
              initial={{ x: 72, opacity: 0, filter: 'blur(6px)' }}
              animate={typingDone ? { x: 0, opacity: 1, filter: 'blur(0px)' } : { x: 72, opacity: 0, filter: 'blur(6px)' }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="mt-1 text-ink-500 dark:text-ink-300 text-[1.05rem] sm:text-[1.25rem] font-medium"
            >
              scalable, event-driven systems and delightful user experiences.
            </motion.p>
          </div>

          <motion.p
            variants={fadeUp}
            custom={2}
            className="mt-8 max-w-2xl text-base sm:text-lg leading-relaxed text-ink-500 dark:text-ink-300"
          >
            {profile.blurb}
          </motion.p>

          <motion.div variants={fadeUp} custom={3} className="mt-10 flex flex-wrap items-center gap-3">
            <a href="#projects" className="btn-primary group">
              View my work
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </a>
            <a href={profile.resumeUrl} download className="btn-ghost">
              <Download size={16} /> Download Resume
            </a>
          </motion.div>

          <motion.div
            variants={fadeUp}
            custom={4}
            className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-500 dark:text-ink-400"
          >
            <span className="inline-flex items-center gap-2">
              <MapPin size={14} /> {profile.location}
            </span>
            <span className="inline-flex items-center gap-2">
              <Terminal size={14} /> {profile.yearsExperience}+ years engineering
            </span>
          </motion.div>
        </motion.div>

        {/* Metrics strip */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          variants={{ show: { transition: { staggerChildren: 0.1 } } }}
          className="mt-24 grid grid-cols-2 gap-5 sm:grid-cols-4 sm:gap-6"
        >
          {profile.metrics.map((m, i) => (
            <motion.div
              key={m.label}
              variants={fadeUp}
              custom={i}
              whileHover={{ y: -6, transition: { type: 'spring', stiffness: 400, damping: 15 } }}
              className="group relative overflow-hidden rounded-2xl border border-ink-100 dark:border-white/10
                         bg-white/70 dark:bg-ink-800/50 backdrop-blur-sm shadow-card
                         p-7 transition-shadow duration-300 hover:shadow-glow"
            >
              <div className="pointer-events-none absolute inset-0 rounded-[inherit]
                              ring-1 ring-inset ring-transparent transition-[box-shadow] duration-300
                              group-hover:ring-accent/25" />
              <div className="relative font-display text-3xl sm:text-4xl font-bold gradient-text">
                <CountUp value={m.value} />
              </div>
              <div className="relative mt-2.5 text-sm text-ink-500 dark:text-ink-300">{m.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
