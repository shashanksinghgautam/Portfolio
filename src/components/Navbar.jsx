import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { navLinks, profile } from '../data/portfolio.js';
import ThemeToggle from './ThemeToggle.jsx';

/* ----------------------------------------------------------------
   Navbar - floating glass with accent border glow on scroll.
   Alien/futuristic: glowing border + backdrop blur + subtle pulse.
---------------------------------------------------------------- */

// Each comet: position, timing, wiggle variant, and its own color scheme
const COMETS = [
  {
    top: '18%', dur: '3.8s', del: '0s', opacity: 0.8, wig: 'wiggle1', tailMax: '170px',
    cMid: 'rgba(0,229,160,0.7)', cTip: 'rgba(34,211,238,0.5)',
    cHead: '#00E5A0', cGlow: 'rgba(0,229,160,0.65)',
  },
  {
    top: '58%', dur: '4.6s', del: '1.4s', opacity: 0.7, wig: 'wiggle2', tailMax: '140px',
    cMid: 'rgba(34,211,238,0.7)', cTip: 'rgba(167,139,250,0.5)',
    cHead: '#22D3EE', cGlow: 'rgba(34,211,238,0.65)',
  },
  {
    top: '38%', dur: '3.1s', del: '2.7s', opacity: 0.75, wig: 'wiggle3', tailMax: '155px',
    cMid: 'rgba(167,139,250,0.7)', cTip: 'rgba(0,229,160,0.4)',
    cHead: '#A78BFA', cGlow: 'rgba(167,139,250,0.65)',
  },
  {
    top: '78%', dur: '5.1s', del: '0.5s', opacity: 0.6, wig: 'wiggle4', tailMax: '120px',
    cMid: 'rgba(251,146,60,0.7)', cTip: 'rgba(34,211,238,0.4)',
    cHead: '#FB923C', cGlow: 'rgba(251,146,60,0.6)',
  },
  {
    top: '10%', dur: '3.4s', del: '3.6s', opacity: 0.7, wig: 'wiggle5', tailMax: '145px',
    cMid: 'rgba(244,114,182,0.65)', cTip: 'rgba(167,139,250,0.45)',
    cHead: '#F472B6', cGlow: 'rgba(244,114,182,0.6)',
  },
];

function CometLayer() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {COMETS.map((c, i) => (
        <span
          key={i}
          className="comet-group"
          style={{
            top: c.top,
            left: 0,
            opacity: c.opacity,
            '--dur': c.dur,
            '--del': c.del,
            '--wig-name': c.wig,
            '--tail-max': c.tailMax,
          }}
        >
          <span
            className="comet-tail"
            style={{
              '--dur': c.dur,
              '--del': c.del,
              '--tail-max': c.tailMax,
              '--c-mid': c.cMid,
              '--c-tip': c.cTip,
            }}
          />
          <span
            className="comet-head"
            style={{
              '--c-head': c.cHead,
              '--c-glow': c.cGlow,
            }}
          />
        </span>
      ))}
    </div>
  );
}

function NavLink({ link, isActive, onHover }) {
  return (
    <a
      href={link.href}
      onMouseEnter={() => onHover(link.href)}
      className={`relative px-3 py-1.5 text-[13px] font-medium transition-all duration-300
        ${isActive ? 'text-accent' : 'text-tertiary hover:text-primary'}`}
    >
      {link.label}
      {isActive && (
        <motion.span
          layoutId="nav-active"
          className="absolute inset-x-1 -bottom-1 h-[2px] rounded-full bg-accent shadow-[0_0_8px_rgba(0,229,160,0.6)]"
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      )}
    </a>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState(null);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
      const sections = navLinks.map((l) => l.href.slice(1));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.getBoundingClientRect().top <= 140) {
          setActive(`#${sections[i]}`);
          return;
        }
      }
      setActive(null);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentHighlight = hovered || active;

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4"
    >
      {/* Comet strip - spans full header width above the pill */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-full overflow-hidden opacity-60">
        <CometLayer />
      </div>

      <nav
        onMouseLeave={() => setHovered(null)}
        className={`relative flex w-full max-w-[760px] items-center justify-between rounded-full px-2 py-2 transition-all duration-700
          ${scrolled
            ? 'border border-accent/20 bg-[var(--bg)]/85 backdrop-blur-2xl shadow-[0_0_30px_-10px_rgba(0,229,160,0.15)]'
            : 'border border-transparent bg-[var(--bg)]/50 backdrop-blur-md'
          }`}
      >
        {/* Logo mark */}
        <a href="#top" className="flex items-center gap-2 pl-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10 border border-accent/30">
            <span className="text-[11px] font-bold text-accent">SSG</span>
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-0.5">
          {navLinks.map((l) => (
            <NavLink key={l.href} link={l} isActive={currentHighlight === l.href} onHover={setHovered} />
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-1.5">
          <a
            href={profile.resumeUrl}
            download
            className="hidden sm:inline-flex items-center gap-1 rounded-full border border-accent/20
                       bg-accent/5 px-3 py-1.5 text-[11px] font-medium text-accent
                       hover:bg-accent/10 hover:shadow-[0_0_12px_-4px_rgba(0,229,160,0.4)] transition-all duration-300"
          >
            Résumé <ArrowUpRight size={10} />
          </a>
          <ThemeToggle />
          <button
            className="md:hidden flex h-8 w-8 items-center justify-center rounded-lg
                       text-secondary hover:text-accent transition-colors"
            aria-label="Menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="absolute top-full left-4 right-4 mt-2 rounded-2xl border border-accent/20
                       bg-[var(--bg-elevated)]/95 backdrop-blur-2xl shadow-[0_0_40px_-10px_rgba(0,229,160,0.1)] overflow-hidden"
          >
            <div className="flex flex-col p-3">
              {navLinks.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="rounded-xl px-4 py-2.5 text-sm font-medium text-secondary
                             hover:text-accent hover:bg-accent/5 transition-all"
                >
                  {l.label}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
