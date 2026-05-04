import { motion } from 'framer-motion';

const blurUp = {
  hidden: { opacity: 0, y: 14, filter: 'blur(6px)' },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function SectionHeading({ eyebrow, title, description, align = 'left' }) {
  const alignment = align === 'center' ? 'text-center mx-auto' : 'text-left';
  return (
    <div className={`max-w-2xl ${alignment}`}>
      {eyebrow && (
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={blurUp}
          custom={0}
          className="section-heading-eyebrow"
        >
          {eyebrow}
        </motion.p>
      )}
      <motion.h2
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={blurUp}
        custom={0.05}
        className="mt-3 font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold tracking-tight
                   text-ink-900 dark:text-white leading-tight"
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={blurUp}
          custom={0.1}
          className="mt-4 text-base sm:text-lg text-ink-500 dark:text-ink-300"
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}
