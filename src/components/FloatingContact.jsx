import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Mail, Phone, Download, X, MessageCircle } from 'lucide-react';
import { profile } from '../data/portfolio.js';

/* ----------------------------------------------------------------
   Floating side contact panel (right edge, vertical stack)
   - Fixed on desktop, bottom-sheet trigger on mobile
   - Icons with expanding labels on hover
   - Staggered slide-in entrance
   - Glow & scale micro-interactions
---------------------------------------------------------------- */

const items = [
  {
    icon: Mail,
    label: 'Email',
    href: `mailto:${profile.email}`,
    color: 'from-blue-500 to-cyan-400',
    glow: 'rgba(59,130,246,0.5)',
  },
  {
    icon: Github,
    label: 'GitHub',
    href: profile.github,
    color: 'from-gray-600 to-gray-400 dark:from-gray-300 dark:to-white',
    glow: 'rgba(156,163,175,0.5)',
    external: true,
  },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    href: profile.linkedin,
    color: 'from-blue-600 to-blue-400',
    glow: 'rgba(37,99,235,0.5)',
    external: true,
  },
  {
    icon: Phone,
    label: 'Phone',
    href: `tel:${profile.phone.replace(/\s/g, '')}`,
    color: 'from-emerald-500 to-green-400',
    glow: 'rgba(16,185,129,0.5)',
  },
  {
    icon: Download,
    label: 'Resume',
    href: profile.resumeUrl,
    color: 'from-violet-500 to-fuchsia-500',
    glow: 'rgba(139,92,246,0.5)',
    download: true,
  },
];

function SideItem({ item, index }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.8 + index * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Expanding label tooltip (left side) */}
      <AnimatePresence>
        {hovered && (
          <motion.span
            initial={{ opacity: 0, x: 8, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 8, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap
                       rounded-lg bg-ink-900 dark:bg-white px-3 py-1.5
                       text-xs font-medium text-white dark:text-ink-900
                       shadow-lg pointer-events-none"
          >
            {item.label}
            {/* Arrow */}
            <span className="absolute top-1/2 -right-1 -translate-y-1/2 h-2 w-2
                             rotate-45 bg-ink-900 dark:bg-white" />
          </motion.span>
        )}
      </AnimatePresence>

      <a
        href={item.href}
        target={item.external ? '_blank' : undefined}
        rel={item.external ? 'noreferrer' : undefined}
        download={item.download || undefined}
        className="relative flex h-11 w-11 items-center justify-center rounded-2xl
                   border border-ink-200/60 dark:border-white/10
                   bg-white/80 dark:bg-ink-800/70 backdrop-blur-lg
                   text-ink-500 dark:text-ink-300
                   transition-all duration-300 ease-out
                   hover:scale-110
                   hover:shadow-lg"
        style={{
          boxShadow: hovered ? `0 0 24px -4px ${item.glow}` : undefined,
        }}
      >
        <motion.div
          animate={hovered ? { scale: [1, 1.2, 1], rotate: [0, -6, 6, 0] } : {}}
          transition={{ duration: 0.4 }}
        >
          <item.icon size={17} className={hovered ? 'text-accent' : ''} />
        </motion.div>
        {/* Glow ring on hover - inset-0 for alignment */}
        <span
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100
                     transition-opacity duration-300 ring-1 ring-inset ring-accent/40"
        />
      </a>
    </motion.div>
  );
}

export default function FloatingContact() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop: right-edge vertical strip */}
      <div className="hidden lg:flex fixed right-5 top-1/2 -translate-y-1/2 z-40 flex-col gap-3">
        {items.map((item, i) => (
          <SideItem key={item.label} item={item} index={i} />
        ))}
      </div>

      {/* Mobile: floating action button + sheet */}
      <div className="lg:hidden fixed bottom-5 right-5 z-40">
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ duration: 0.25 }}
              className="absolute bottom-16 right-0 flex flex-col gap-2.5 p-2 rounded-2xl
                         border border-ink-200/50 dark:border-white/10
                         bg-white/90 dark:bg-ink-900/90 backdrop-blur-2xl shadow-xl"
            >
              {items.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noreferrer' : undefined}
                  download={item.download || undefined}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5
                             hover:bg-ink-100/70 dark:hover:bg-white/5 transition-colors"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg
                                   bg-ink-100 dark:bg-white/5 text-ink-600 dark:text-ink-200">
                    <item.icon size={15} />
                  </span>
                  <span className="text-sm font-medium text-ink-700 dark:text-ink-100">
                    {item.label}
                  </span>
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setMobileOpen((v) => !v)}
          className="flex h-12 w-12 items-center justify-center rounded-2xl
                     bg-gradient-to-br from-accent to-violet-600 text-white
                     shadow-lg shadow-accent/30 transition-transform"
          aria-label="Contact options"
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={mobileOpen ? 'close' : 'open'}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {mobileOpen ? <X size={18} /> : <MessageCircle size={18} />}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </div>
    </>
  );
}
