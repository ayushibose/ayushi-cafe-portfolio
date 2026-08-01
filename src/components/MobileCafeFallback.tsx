import { motion } from 'framer-motion';
import {
  Zap, Briefcase, Code2, User, Trophy, FileText, Send, GraduationCap,
} from 'lucide-react';
import { interactiveObjects, type SectionId } from '@/data/portfolioData';

const iconMap: Record<string, typeof Zap> = {
  about: User,
  projects: Briefcase,
  skills: Code2,
  experience: Briefcase,
  achievements: Trophy,
  education: GraduationCap,
  cv: FileText,
  contact: Send,
};

const accentMap: Record<string, string> = {
  about: 'text-neon-pink',
  projects: 'text-neon-cyan',
  skills: 'text-neon-cyan',
  experience: 'text-neon-purple',
  achievements: 'text-neon-pink',
  education: 'text-neon-blue',
  cv: 'text-neon-green',
  contact: 'text-neon-magenta',
};

export default function MobileCafeFallback({
  onSelect,
}: {
  onSelect: (id: SectionId) => void;
}) {
  return (
    <section
      aria-label="Cyberpunk cafe illustration"
      className="relative min-h-[80vh] w-full overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-neon-pink/20 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 h-64 w-64 rounded-full bg-neon-cyan/20 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-md flex-col items-center px-6 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Zap className="mx-auto text-neon-pink shadow-glow-pink" size={40} />
          <h2 className="mt-4 font-display text-2xl neon-text-pink">Ayushi's Cafe</h2>
          <p className="mt-2 text-sm text-neon-cyan">
            The full 3D cyberpunk cafe is best on a larger screen. Tap an object below to explore each section.
          </p>
        </motion.div>

        <div className="mt-8 grid w-full grid-cols-2 gap-3">
          {interactiveObjects.map((obj, i) => {
            const Icon = iconMap[obj.id] ?? Zap;
            return (
              <motion.button
                key={obj.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
                onClick={() => onSelect(obj.id)}
                className="glass flex flex-col items-center gap-2 rounded-2xl px-4 py-5 text-cream-100 transition hover:border-neon-pink/50 hover:shadow-glow-pink"
              >
                <Icon size={22} className={accentMap[obj.id]} />
                <span className="text-sm font-semibold">{obj.label}</span>
                <span className="text-xs text-cream-200">{obj.hint}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
