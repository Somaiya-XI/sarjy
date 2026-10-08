'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';

const NAME = 'Sarjy'.split('');
const EASE = [0.16, 1, 0.3, 1] as const;

export function EntranceIntro() {
  return (
    <motion.div
      className="flex flex-col items-center gap-4 text-center"
      exit={{ opacity: 0, scale: 1.04, filter: 'blur(8px)' }}
      transition={{ duration: 1, ease: 'easeInOut' }}
    >
      {/* Logo */}
      <motion.div
        className="relative size-14"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: EASE }}
      >
        <Image src="/logo.svg" alt="Sarjy" fill priority />
      </motion.div>

      {/* App name, letter by letter */}
      <h1
        className="flex text-6xl font-bold tracking-wide text-primary font-display"
        aria-label="Sarjy"
      >
        {NAME.map((char, i) => (
          <motion.span
            key={i}
            aria-hidden
            initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: 0.9 + i * 0.15, duration: 0.9, ease: EASE }}
          >
            {char}
          </motion.span>
        ))}
      </h1>

      {/* Tagline */}
      <motion.p
        className="text-sm tracking-wide text-primary/70"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.4, duration: 0.8, ease: 'easeOut' }}
      >
        Your art companion for half-remembered pieces.
      </motion.p>
    </motion.div>
  );
}
