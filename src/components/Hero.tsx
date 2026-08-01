import { motion } from 'framer-motion';
import { Coffee , ArrowDown, FileText, Download } from 'lucide-react';
import { profile } from '@/data/portfolioData';

type Props = {
  onExplore: () => void;
  onStandard: () => void;
  onDownloadCV: () => void;
};

export default function Hero({ onExplore, onStandard }: Props) {
  return (
    <section id="top" className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
      {/* glow backdrop */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-neon-pink/20 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 h-72 w-72 rounded-full bg-neon-cyan/20 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 flex flex-col items-center"
      >
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="mb-6 rounded-full border border-neon-pink/40 bg-ink-800/60 p-4 shadow-glow-pink"
        >
          <Coffee  size={40} className="text-neon-pink" strokeWidth={1.5} />
        </motion.div>

        <p className="mb-2 text-sm uppercase tracking-[0.3em] text-neon-cyan">Ayushi's Portfolio</p>
        <h1 className="font-display text-5xl leading-tight neon-text-pink sm:text-6xl md:text-7xl">
          {profile.name}
        </h1>
        <p className="mt-3 font-display text-xl text-cream-100 sm:text-2xl">{profile.title}</p>
        <p className="mt-4 max-w-xl text-cream-200">{profile.heroLine}</p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={onExplore}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-neon-pink px-6 py-3 font-semibold text-ink-900 transition hover:shadow-glow-pink"
          >
            <Coffee  size={18} /> Explore the Café
          </button>
          <button
            onClick={onStandard}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-neon-cyan/50 px-6 py-3 font-semibold text-neon-cyan transition hover:border-neon-cyan hover:shadow-glow-cyan"
          >
            <FileText size={18} /> View Portfolio
          </button>
        </div>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          className="mt-12 text-neon-cyan"
        >
          <ArrowDown size={24} />
        </motion.div>
      </motion.div>
    </section>
  );
}
