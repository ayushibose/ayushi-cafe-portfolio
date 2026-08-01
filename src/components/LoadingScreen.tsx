import { motion } from 'framer-motion';
import { LucideCoffee } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-night-900">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center gap-6"
      >
        <motion.div
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          className="text-neon-pink shadow-glow-pink"
        >
          <LucideCoffee size={48} strokeWidth={1.5} />
        </motion.div>
        <div className="text-center">
          <h2 className="font-display text-2xl neon-text-pink">Ayushi's Cafe</h2>
          <p className="mt-1 text-sm text-neon-cyan">Entering Ayushi's cafe...</p>
        </div>
        <div className="h-1 w-48 overflow-hidden rounded-full bg-ink-700">
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            className="h-full w-1/2 rounded-full bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan"
          />
        </div>
      </motion.div>
    </div>
  );
}
