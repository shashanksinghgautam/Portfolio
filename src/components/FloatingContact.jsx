import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Github, Linkedin, Mail, Phone, Download,
  X, Plus, Copy, Check, ExternalLink,
} from 'lucide-react';
import { profile } from '../data/portfolio.js';

/* ----------------------------------------------------------------
   Floating side contact panel
   - Desktop: fixed right-edge vertical strip
   - Hover: expands left into a card with value + copy + open btns
   - Mobile: FAB + bottom sheet
   - Full theme compatibility via CSS variables
---------------------------------------------------------------- */

const items = [
  {
    icon: Mail,
    label: 'Email',
    value: profile.email,
    display: profile.email,
    href: `mailto:${profile.email}`,
    copyable: true,
    external: false,
    download: false,
  },
  {
    icon: Github,
    label: 'GitHub',
    value: profile.github,
    display: profile.github.replace('https://', ''),
    href: profile.github,
    copyable: true,
    external: true,
    download: false,
  },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    value: profile.linkedin,
    display: profile.linkedin.replace('https://www.', ''),
    href: profile.linkedin,
    copyable: true,
    external: true,
    download: false,
  },
  {
    icon: Phone,
    label: 'Phone',
    value: profile.phone,
    display: profile.phone,
    href: `tel:${profile.phone?.replace(/\s/g, '')}`,
    copyable: true,
    external: false,
    download: false,
  },
  {
    icon: Download,
    label: 'Résumé',
    value: 'Shashank_Resume.pdf',
    display: 'Download PDF',
    href: profile.resumeUrl,
    copyable: false,
    external: false,
    download: true,
  },
];

// ── Copy-to-clipboard micro-button ───────────────────────────────
function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);

  const handle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <motion.button
      onClick={handle}
      whileTap={{ scale: 0.82 }}
      title="Copy to clipboard"
      className="flex h-6 w-6 items-center justify-center rounded-md flex-shrink-0
                 border border-[var(--border)] bg-[var(--bg-subtle)]
                 text-[var(--text-tertiary)] hover:text-accent hover:border-accent/40
                 transition-all duration-200"
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={copied ? 'check' : 'copy'}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ duration: 0.12 }}
        >
          {copied
            ? <Check size={11} className="text-accent" />
            : <Copy size={11} />}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}

// ── Single side item ──────────────────────────────────────────────
function SideItem({ item, index }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.0 + index * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex items-center justify-end"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Expanding card — spring-animates leftward from the icon */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 'auto', opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 26, mass: 0.7 }}
            className="absolute right-[calc(100%+10px)] overflow-hidden"
          >
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.18, delay: 0.06 }}
              className="flex flex-col gap-2 rounded-xl p-3 whitespace-nowrap
                         border-2 border-[var(--border)]
                         bg-[var(--bg-elevated)]
                         shadow-[0_8px_32px_-8px_rgba(0,0,0,0.22),0_0_0_1px_rgba(0,229,160,0.07)]"
            >
              {/* Category label */}
              <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-accent">
                {item.label}
              </span>

              {/* Value + action buttons */}
              <div className="flex items-center gap-2">
                <span className="text-[12.5px] font-medium text-[var(--text-primary)] max-w-[210px] truncate">
                  {item.display}
                </span>

                <div className="flex items-center gap-1 ml-1 flex-shrink-0">
                  {item.copyable && <CopyButton value={item.value} />}

                  {/* Open / download action */}
                  <motion.a
                    href={item.href}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noreferrer' : undefined}
                    download={item.download || undefined}
                    onClick={(e) => e.stopPropagation()}
                    whileTap={{ scale: 0.82 }}
                    title={item.download ? 'Download' : 'Open'}
                    className="flex h-6 w-6 items-center justify-center rounded-md flex-shrink-0
                               border border-[var(--border)] bg-[var(--bg-subtle)]
                               text-[var(--text-tertiary)] hover:text-accent hover:border-accent/40
                               transition-all duration-200"
                  >
                    {item.download
                      ? <Download size={11} />
                      : <ExternalLink size={11} />}
                  </motion.a>
                </div>
              </div>

              {/* Arrow connector */}
              <span
                className="absolute top-1/2 -right-[5px] -translate-y-1/2 h-2.5 w-2.5
                           rotate-45 border-t-2 border-r-2 border-[var(--border)]
                           bg-[var(--bg-elevated)]"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Icon button — also a link so clicking it navigates */}
      <motion.a
        href={item.href}
        target={item.external ? '_blank' : undefined}
        rel={item.external ? 'noreferrer' : undefined}
        download={item.download || undefined}
        aria-label={item.label}
        animate={hovered ? { scale: 1.1 } : { scale: 1 }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: 'spring', stiffness: 350, damping: 20 }}
        className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl
                   border-2 transition-colors duration-300"
        style={{
          borderColor: hovered ? 'rgba(0,229,160,0.5)' : 'var(--border)',
          background: 'var(--bg-elevated)',
          color: hovered ? 'var(--accent)' : 'var(--text-secondary)',
          boxShadow: hovered
            ? '0 0 20px -4px rgba(0,229,160,0.4), 0 2px 12px -2px rgba(0,0,0,0.15)'
            : '0 2px 12px -2px rgba(0,0,0,0.15)',
        }}
      >
        <motion.span
          animate={hovered ? { rotate: [0, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
        >
          <item.icon size={15} />
        </motion.span>
        <motion.span
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.25 }}
          className="absolute inset-0 rounded-xl ring-1 ring-inset ring-accent/25 pointer-events-none"
        />
      </motion.a>
    </motion.div>
  );
}

// ── Vertical tail line ────────────────────────────────────────────
function VerticalLine() {
  return (
    <motion.div
      initial={{ scaleY: 0, opacity: 0 }}
      animate={{ scaleY: 1, opacity: 1 }}
      transition={{ delay: 1.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="w-px h-14 origin-top bg-gradient-to-b from-accent/40 to-transparent mx-auto"
    />
  );
}

// ── Main export ───────────────────────────────────────────────────
export default function FloatingContact() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* ── Desktop ── */}
      <div className="hidden lg:flex fixed right-5 top-1/2 -translate-y-1/2 z-40 flex-col items-end gap-2.5">
        {items.map((item, i) => (
          <SideItem key={item.label} item={item} index={i} />
        ))}
        <VerticalLine />
      </div>

      {/* ── Mobile FAB + sheet ── */}
      <div className="lg:hidden fixed bottom-5 right-5 z-40">
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.92 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="absolute bottom-16 right-0 flex flex-col gap-1 p-2 rounded-2xl
                         border-2 border-[var(--border)]
                         bg-[var(--bg-elevated)]
                         shadow-[0_8px_40px_-8px_rgba(0,0,0,0.25)]"
            >
              {items.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 group
                             hover:bg-accent/5 transition-colors duration-200"
                >
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg
                                   border border-[var(--border)] bg-[var(--bg-subtle)]
                                   text-[var(--text-tertiary)] group-hover:text-accent
                                   group-hover:border-accent/30 transition-colors duration-200">
                    <item.icon size={14} />
                  </span>
                  <a
                    href={item.href}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noreferrer' : undefined}
                    download={item.download || undefined}
                    onClick={() => setMobileOpen(false)}
                    className="flex flex-col min-w-0"
                  >
                    <span className="text-[10px] font-mono uppercase tracking-wider text-accent">{item.label}</span>
                    <span className="text-[13px] font-medium text-[var(--text-secondary)] truncate max-w-[160px]">{item.display}</span>
                  </a>
                  {item.copyable && <CopyButton value={item.value} />}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setMobileOpen((v) => !v)}
          className="flex h-12 w-12 items-center justify-center rounded-2xl
                     border-2 border-[var(--border)]
                     bg-[var(--bg-elevated)]
                     text-[var(--text-secondary)]
                     shadow-[0_4px_20px_-4px_rgba(0,0,0,0.25)]
                     hover:border-accent/60 hover:text-accent
                     transition-all duration-300"
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
              {mobileOpen ? <X size={16} /> : <Plus size={16} />}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </div>
    </>
  );
}
