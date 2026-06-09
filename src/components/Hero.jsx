import { useRef, useEffect, useState, useMemo } from 'react';
import { motion, useScroll, useTransform, useInView, useSpring, useMotionValue } from 'framer-motion';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { profile } from '../data/portfolio.js';
import Magnetic from './Magnetic.jsx';

/* ================================================================
   Hero - Cinematic immersive entrance.
   - Character-by-character text reveal with stagger
   - Animated counter for metrics
   - Parallax depth layers
   - Magnetic buttons
   - Typing cursor on role
   - Glitch on hover (name)
================================================================ */

// Text scramble effect hook
function useTextScramble(text, inView, delay = 0) {
  const [displayed, setDisplayed] = useState('');
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*';

  useEffect(() => {
    if (!inView) return;
    let frame = 0;
    const totalFrames = text.length * 3;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;
        const revealedLen = Math.floor(progress * text.length);
        let result = '';
        for (let i = 0; i < text.length; i++) {
          if (i < revealedLen) {
            result += text[i];
          } else if (i === revealedLen) {
            result += chars[Math.floor(Math.random() * chars.length)];
          } else {
            result += text[i] === ' ' ? ' ' : chars[Math.floor(Math.random() * chars.length)];
          }
        }
        setDisplayed(result);
        if (frame >= totalFrames) {
          setDisplayed(text);
          clearInterval(interval);
        }
      }, 30);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [inView, text, delay]);

  return displayed;
}

// Animated counter hook
function AnimatedCounter({ value, suffix = '', duration = 2000, delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    if (!isInView) return;
    const numericVal = parseInt(value.replace(/[^0-9]/g, ''), 10);
    if (isNaN(numericVal)) { setDisplay(value); return; }

    const timeout = setTimeout(() => {
      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * numericVal);
        setDisplay(`${current}${suffix}`);
        if (progress < 1) requestAnimationFrame(animate);
        else setDisplay(value);
      };
      animate();
    }, delay);
    return () => clearTimeout(timeout);
  }, [isInView, value, duration, delay, suffix]);

  return <span ref={ref}>{display}</span>;
}

// Character reveal component
function CharReveal({ text, className, delay = 0 }) {
  return (
    <motion.span className={`inline-block ${className}`}>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 40, rotateX: -90 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{
            duration: 0.6,
            delay: delay + i * 0.04,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="inline-block"
          style={{ transformOrigin: 'bottom' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.span>
  );
}

const reveal = {
  hidden: { opacity: 0, y: 40, filter: 'blur(12px)' },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 1,
      delay: 0.4 + i * 0.15,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

export default function Hero() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true });
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const opacityFade = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.6], [1, 0.92]);

  const roleText = useTextScramble('Software Engineer', isInView, 1200);

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative flex min-h-screen flex-col justify-between overflow-hidden px-6 sm:px-8 lg:px-12 pt-28 pb-10"
    >
      {/* Animated accent beams */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 2, delay: 1, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-[18%] left-0 right-0 h-px origin-left bg-gradient-to-r from-transparent via-accent/30 to-transparent"
        />
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 2, delay: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-[55%] left-0 right-0 h-px origin-right bg-gradient-to-r from-transparent via-glow-cyan/15 to-transparent"
        />
        <motion.div
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 0.5 }}
          transition={{ duration: 2.5, delay: 1.8, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-0 bottom-0 left-[15%] w-px origin-top bg-gradient-to-b from-accent/10 via-glow-purple/10 to-transparent"
        />
      </div>

      <motion.div
        style={{ y: yParallax, opacity: opacityFade, scale }}
        className="flex-1 flex flex-col justify-center max-w-[1200px] mx-auto w-full relative"
      >
        {/* Status chip */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="inline-flex items-center gap-2.5 rounded-full border border-accent/30 bg-accent/5 px-4 py-2 text-[12px] font-medium tracking-wide text-accent backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            Available for new opportunities
          </span>
        </motion.div>

        {/* Name - character-by-character reveal */}
        <h1 className="mt-10 text-display max-w-5xl overflow-hidden">
          <CharReveal text="SHASHANK" className="gradient-text" delay={0.6} />
          <br className="sm:hidden" />
          {' '}
          <CharReveal text="SINGH" className="text-primary" delay={1.0} />
        </h1>

        {/* Role with scramble */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="mt-6 flex items-center gap-4"
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 48 }}
            transition={{ duration: 0.8, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="h-px bg-gradient-to-r from-accent to-transparent"
          />
          <p className="text-xl sm:text-2xl font-medium tracking-tight text-secondary font-mono">
            {roleText}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
              className="text-accent ml-0.5"
            >
              |
            </motion.span>
          </p>
        </motion.div>

        {/* Description */}
        <motion.p
          custom={3}
          initial="hidden"
          animate="visible"
          variants={reveal}
          className="mt-8 max-w-xl text-base sm:text-lg leading-relaxed text-tertiary"
        >
          Building scalable backend systems, automation platforms, and enterprise-grade products.{' '}
          <span className="text-accent font-medium">{profile.yearsExperience}+ years</span>{' '}
          creating reliable software and business-critical automation.
        </motion.p>

        {/* Magnetic CTAs */}
        <motion.div custom={4} initial="hidden" animate="visible" variants={reveal} className="mt-10 flex flex-wrap items-center gap-4">
          <Magnetic strength={0.2}>
            <a href="#projects" className="btn-primary group">
              View my work
              <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </Magnetic>
          <Magnetic strength={0.2}>
            <a href={profile.resumeUrl} download className="btn-secondary">
              Download résumé
            </a>
          </Magnetic>
        </motion.div>
      </motion.div>

      {/* Bottom metrics with animated counters */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-[1200px] mx-auto w-full"
      >
        <div className="border-t border-[var(--border)] pt-8 flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-wrap gap-10">
            {profile.metrics.map((m, i) => (
              <div key={m.label} className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-bold tracking-tight gradient-text">
                  <AnimatedCounter value={m.value} delay={2000 + i * 200} />
                </span>
                <span className="mt-1 text-[11px] font-mono uppercase tracking-wider text-tertiary">{m.label}</span>
              </div>
            ))}
          </div>
          <Magnetic strength={0.4}>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="text-accent/60"
            >
              <ArrowDown size={18} />
            </motion.div>
          </Magnetic>
        </div>
      </motion.div>
    </section>
  );
}
