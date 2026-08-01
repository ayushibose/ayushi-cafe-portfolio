import { motion } from 'framer-motion';
import {
  Coffee,
  User,
  Briefcase,
  Code2,
  Trophy,
  GraduationCap,
  FileText,
  Send,
} from 'lucide-react';

import {
  interactiveObjects,
  type SectionId,
} from '@/data/portfolioData';

const iconMap = {
  about: User,
  projects: Briefcase,
  skills: Code2,
  experience: Briefcase,
  achievements: Trophy,
  education: GraduationCap,
  cv: FileText,
  contact: Send,
};

type MobileCafeFallbackProps = {
  onSelect: (id: SectionId) => void;
};

export default function MobileCafeFallback({
  onSelect,
}: MobileCafeFallbackProps) {
  return (
    <section
      aria-label="Alternative navigation for Ayushi's Cafe"
      className="relative flex min-h-[100svh] w-full items-center overflow-hidden bg-ink-900 px-6 py-16"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-neon-pink/20 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-neon-cyan/20 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-md text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Coffee
            size={40}
            className="mx-auto text-neon-pink"
          />

          <h2 className="mt-4 font-display text-2xl neon-text-pink">
            Ayushi&apos;s Cafe
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-cream-200">
            The 3D café could not load on this device. Select a section
            below to explore the portfolio.
          </p>
        </motion.div>

        <div className="mt-8 grid grid-cols-2 gap-3">
          {interactiveObjects.map((object, index) => {
            const Icon =
              iconMap[object.id as keyof typeof iconMap] ?? Coffee;

            return (
              <motion.button
                key={object.id}
                type="button"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onSelect(object.id)}
                className="glass flex min-h-28 flex-col items-center justify-center gap-2 rounded-2xl px-4 py-4 text-cream-100 transition hover:border-neon-pink/50 hover:shadow-glow-pink focus:outline-none focus:ring-2 focus:ring-neon-cyan"
              >
                <Icon
                  size={22}
                  className="text-neon-cyan"
                />

                <span className="text-sm font-semibold">
                  {object.label}
                </span>

                {object.hint && (
                  <span className="text-xs text-cream-200">
                    {object.hint}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}