import { motion } from 'framer-motion';
import { Github, Linkedin, Mail } from 'lucide-react';
import { profile } from '../data/portfolio.js';

export default function Footer() {
  const year = new Date().getFullYear();
  const socials = [
    { icon: Mail, href: `mailto:${profile.email}`, label: 'Email' },
    { icon: Github, href: profile.github, label: 'GitHub' },
    { icon: Linkedin, href: profile.linkedin, label: 'LinkedIn' },
  ];

  return (
    <footer className="border-t border-ink-100 dark:border-white/10 mt-10">
      <div className="container-page flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink-500 dark:text-ink-400">
          © {year} {profile.name}. Crafted with React, Tailwind & Framer Motion.
        </p>
        <div className="flex items-center gap-2">
          {socials.map((s) => (
            <motion.a
              key={s.label}
              aria-label={s.label}
              href={s.href}
              target={s.href.startsWith('http') ? '_blank' : undefined}
              rel="noreferrer"
              whileHover={{ y: -2, scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-400
                         hover:text-accent hover:bg-accent/5 transition-colors"
            >
              <s.icon size={15} />
            </motion.a>
          ))}
        </div>
      </div>
    </footer>
  );
}
