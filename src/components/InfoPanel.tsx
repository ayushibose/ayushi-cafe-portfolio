import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Github, Download, Mail, User, Briefcase, Code2, Trophy, FileText, Send, GraduationCap } from 'lucide-react';
import {
  profile,
  skillGroups,
  projects,
  experience,
  education,
  aLevels,
  achievements,
  careerInterests,
  socials,
  type SectionId,
} from '@/data/portfolioData';
import * as LucideIcons from 'lucide-react';

type Props = { section: SectionId | null; onClose: () => void };

function getIcon(name: string) {
  const Icon = (LucideIcons as unknown as Record<string, LucideIcons.LucideIcon>)[name];
  return Icon ?? LucideIcons.Circle;
}

const sectionMeta: Record<SectionId, { title: string; icon: typeof User; accent: string }> = {
  about: { title: 'About Me', icon: User, accent: 'pink' },
  projects: { title: 'Projects', icon: Briefcase, accent: 'cyan' },
  skills: { title: 'Skills & Tech Stack', icon: Code2, accent: 'cyan' },
  experience: { title: 'Experience', icon: Briefcase, accent: 'purple' },
  achievements: { title: 'Achievements & Certifications', icon: Trophy, accent: 'pink' },
  education: { title: 'Education', icon: GraduationCap, accent: 'blue' },
  cv: { title: 'Download CV', icon: FileText, accent: 'green' },
  contact: { title: 'Contact Me', icon: Send, accent: 'magenta' },
};

const accentClass: Record<string, string> = {
  pink: 'neon-text-pink',
  cyan: 'neon-text-cyan',
  purple: 'neon-text-purple',
  green: 'text-neon-green',
  magenta: 'text-neon-magenta',
  blue: 'text-neon-blue',
};

function SectionContent({ section }: { section: SectionId }) {
  switch (section) {
    case 'about':
      return (
        <div>
          <p className="text-base leading-relaxed text-cream-100">{profile.summary}</p>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[
              { label: 'Location', value: profile.location },
              { label: 'Email', value: profile.email },
              { label: 'Focus', value: 'Software, Data & Product' },
            ].map((item) => (
              <div key={item.label} className="rounded-lg border border-ink-600 bg-ink-800/60 p-3">
                <p className="text-xs text-neon-cyan">{item.label}</p>
                <p className="mt-1 text-sm text-cream-100">{item.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <h4 className="mb-2 font-display text-sm text-cream-200">Career Interests</h4>
            <div className="flex flex-wrap gap-2">
              {careerInterests.map((c) => (
                <span key={c} className="rounded-full border border-neon-purple/40 bg-ink-700 px-3 py-1 text-xs text-cream-100">{c}</span>
              ))}
            </div>
          </div>
        </div>
      );

    case 'skills':
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          {skillGroups.map((g) => {
            const Icon = getIcon(g.icon);
            return (
              <div key={g.category} className="rounded-xl border border-ink-600 bg-ink-800/60 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Icon size={18} className="text-neon-cyan" />
                  <h4 className="font-display text-lg text-cream-100">{g.category}</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {g.items.map((s) => (
                    <span key={s} className="rounded-full border border-neon-purple/40 bg-ink-700 px-3 py-1 text-xs text-cream-100">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      );

    case 'projects':
      return (
        <div className="grid gap-4">
          {projects.map((p) => (
            <div key={p.name} className="rounded-xl border border-ink-600 bg-ink-800/60 p-4">
              <div className="flex items-start justify-between gap-3">
                <h4 className="font-display text-lg text-cream-100">{p.name}</h4>
                <div className="flex gap-2">
                  {p.repo && (
                    <a href={p.repo} target="_blank" rel="noreferrer" aria-label={`${p.name} repository`} className="text-cream-200 hover:text-neon-cyan">
                      <Github size={18} />
                    </a>
                  )}
                  {p.link && (
                    <a href={p.link} target="_blank" rel="noreferrer" aria-label={`${p.name} live`} className="text-cream-200 hover:text-neon-cyan">
                      <ExternalLink size={18} />
                    </a>
                  )}
                </div>
              </div>
              <p className="mt-1 text-sm text-cream-200">{p.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <span key={t} className="rounded-full bg-ink-700 px-2.5 py-0.5 text-xs text-neon-cyan">{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      );

    case 'experience':
      return (
        <div className="relative border-l border-neon-purple/40 pl-5">
          {experience.map((e) => (
            <div key={e.role + e.company} className="mb-6 last:mb-0">
              <div className="absolute -left-[7px] h-3 w-3 rounded-full border-2 border-ink-900 bg-neon-pink shadow-glow-pink" />
              <h4 className="font-display text-lg text-cream-100">{e.role}</h4>
              <p className="text-sm text-neon-cyan">{e.company}{e.period ? ` · ${e.period}` : ''}{e.location ? ` · ${e.location}` : ''}</p>
              <ul className="mt-2 list-disc pl-5 text-sm text-cream-200">
                {e.highlights.map((h) => <li key={h}>{h}</li>)}
              </ul>
            </div>
          ))}
        </div>
      );

    case 'education':
      return (
        <div>
          {education.map((e) => (
            <div key={e.institution} className="rounded-xl border border-ink-600 bg-ink-800/60 p-4">
              <h4 className="font-display text-lg text-cream-100">{e.institution}</h4>
              <p className="text-sm text-neon-cyan">{e.course} · {e.period}</p>
              <ul className="mt-2 list-disc pl-5 text-sm text-cream-200">
                {e.details.map((d) => <li key={d}>{d}</li>)}
              </ul>
            </div>
          ))}
          <div className="mt-4 rounded-xl border border-ink-600 bg-ink-800/60 p-4">
            <h4 className="mb-2 font-display text-base text-cream-100">A Levels</h4>
            <div className="flex flex-wrap gap-3">
              {aLevels.map((a) => (
                <span key={a.subject} className="rounded-full border border-neon-purple/40 bg-ink-700 px-3 py-1 text-sm text-cream-100">
                  {a.subject}: <span className="text-neon-cyan">{a.grade}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      );

    case 'achievements':
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          {achievements.map((a) => {
            const Icon = getIcon(a.icon);
            return (
              <div key={a.title} className="flex items-center gap-3 rounded-xl border border-neon-pink/30 bg-ink-800/60 p-3">
                <Icon size={20} className="shrink-0 text-neon-pink" />
                <span className="text-sm text-cream-100">{a.title}</span>
              </div>
            );
          })}
        </div>
      );

    case 'cv':
      return (
        <div className="text-center">
          <p className="text-cream-200">Download a printable PDF of my full CV.</p>
          <a
            href={profile.cvUrl}
            download
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-neon-green px-6 py-3 font-medium text-ink-900 transition hover:opacity-80"
          >
            <Download size={18} /> Download CV (PDF)
          </a>
        </div>
      );

    case 'contact':
      return (
        <div className="text-center">
          <p className="text-cream-200">I would love to hear from you. Reach out and let's talk.</p>
          <a href={`mailto:${profile.email}`} className="mt-4 inline-flex items-center gap-2 rounded-full bg-neon-magenta px-6 py-3 font-medium text-ink-900 transition hover:opacity-80">
            <Mail size={18} /> {profile.email}
          </a>
          <div className="mt-6 flex justify-center gap-4">
            {socials.map((s) => {
              const Icon = getIcon(s.icon);
              return (
                <a key={s.label} href={s.url} target="_blank" rel="noreferrer" aria-label={s.label}
                  className="rounded-full border border-ink-600 p-3 text-cream-200 transition hover:border-neon-magenta hover:text-neon-magenta">
                  <Icon size={20} />
                </a>
              );
            })}
          </div>
        </div>
      );
  }
}

export default function InfoPanel({ section, onClose }: Props) {
  return (
    <AnimatePresence>
      {section && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={sectionMeta[section].title}
        >
          <div className="absolute inset-0 bg-night-950/80 backdrop-blur-md" onClick={onClose} />
          <motion.div
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ type: 'spring', damping: 24, stiffness: 260 }}
            className="glass relative z-10 max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl p-6 shadow-2xl"
          >
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {(() => {
                  const Icon = sectionMeta[section].icon;
                  return <Icon size={24} className={accentClass[sectionMeta[section].accent]} />;
                })()}
                <h3 className={`font-display text-2xl ${accentClass[sectionMeta[section].accent]}`}>
                  {sectionMeta[section].title}
                </h3>
              </div>
              <button
                onClick={onClose}
                aria-label="Close panel"
                className="rounded-full p-2 text-cream-200 transition hover:bg-ink-700 hover:text-neon-pink"
              >
                <X size={20} />
              </button>
            </div>
            <SectionContent section={section} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
