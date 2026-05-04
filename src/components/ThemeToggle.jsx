import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.jsx';

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={toggle}
      className="relative inline-flex h-8 w-14 items-center rounded-full border border-ink-200/60
                 dark:border-white/10 bg-ink-100/80 dark:bg-white/5 transition-all duration-300
                 hover:border-accent/40 hover:shadow-[0_0_12px_-3px_rgba(31,111,235,0.3)]"
    >
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className={`flex h-6 w-6 items-center justify-center rounded-full shadow-md
                    ${isDark
                      ? 'ml-[30px] bg-white text-ink-900'
                      : 'ml-[2px] bg-ink-900 text-white'
                    }`}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={theme}
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
          >
            {isDark ? <Moon size={12} /> : <Sun size={12} />}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </button>
  );
}
