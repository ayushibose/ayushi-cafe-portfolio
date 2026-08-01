import { motion } from 'framer-motion';
import {
  MapPin, Mail, Download, ExternalLink, Github, GraduationCap,
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import {
  profile, stats, skillGroups, projects, experience, education, aLevels,
  achievements, careerInterests, socials,
} from '@/data/portfolioData';
import profilePhoto from "/mypic.jpg";

function getIcon(name: string) {
  const Icon = (LucideIcons as unknown as Record<string, LucideIcons.LucideIcon>)[name];
  return Icon ?? LucideIcons.Circle;
}

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.5 },
};

function SectionHeading({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="mb-10 text-center">
      <p className="mb-2 text-xs uppercase tracking-[0.3em] text-neon-cyan">{kicker}</p>
      <h2 className="font-display text-3xl neon-text-pink sm:text-4xl">{title}</h2>
    </div>
  );
}

export default function StandardPortfolio() {
  return (
    <div className="bg-night-900">
      {/* About */}
      {/* About */}
<section id="about" className="mx-auto max-w-5xl px-6 py-20">
  <motion.div {...fadeUp}>
    <SectionHeading kicker="Neon Sign" title="About Me" />

    <div className="mt-10 grid items-center gap-10 md:grid-cols-[1.4fr_0.6fr]">
      {/* Left: About information */}
      <div className="text-center md:text-left">
        <p className="text-lg leading-relaxed text-cream-100">
          {profile.summary}
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-cream-200 md:justify-start">
          <span className="inline-flex items-center gap-1.5">
            <MapPin size={16} className="text-neon-cyan" />
            {profile.location}
          </span>

          <span className="inline-flex items-center gap-1.5">
            <Mail size={16} className="text-neon-cyan" />
            {profile.email}
          </span>
        </div>
      </div>

      {/* Right: Profile photo */}
      <div className="flex justify-center md:justify-end">
        <div className="rounded-3xl bg-gradient-to-br from-neon-pink via-neon-purple to-neon-cyan p-[3px] shadow-[0_0_35px_rgba(236,72,153,0.35)]">
          <img
            src={profilePhoto}
            alt="Ayushi Bose"
            loading="lazy"
            className="h-80 w-64 rounded-3xl object-cover object-center"
          />
        </div>
      </div>
    </div>
  </motion.div>

  <motion.div
    {...fadeUp}
    className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4"
  >
    {stats.map((s) => (
      <div
        key={s.label}
        className="glass rounded-2xl p-5 text-center"
      >
        <p className="font-display text-2xl neon-text-cyan">
          {s.value}
        </p>
        <p className="mt-1 text-xs text-cream-200">
          {s.label}
        </p>
      </div>
    ))}
  </motion.div>

  <motion.div {...fadeUp} className="mx-auto mt-8 max-w-2xl">
    <h3 className="mb-3 text-center font-display text-lg text-cream-100">
      Career Interests
    </h3>

    <div className="flex flex-wrap justify-center gap-2">
      {careerInterests.map((c) => (
        <span
          key={c}
          className="rounded-full border border-neon-purple/40 bg-ink-700 px-3 py-1 text-sm text-cream-100"
        >
          {c}
        </span>
      ))}
    </div>
  </motion.div>
</section>

      {/* Skills */}
      <section id="skills" className="mx-auto max-w-5xl px-6 py-20">
        <motion.div {...fadeUp}>
          <SectionHeading kicker="Menu Board" title="Skills & Tech Stack" />
          <div className="grid gap-5 sm:grid-cols-2">
            {skillGroups.map((g) => {
              const Icon = getIcon(g.icon);
              return (
                <div key={g.category} className="rounded-2xl border border-ink-600 bg-ink-800/50 p-6">
                  <div className="mb-3 flex items-center gap-2">
                    <Icon size={20} className="text-neon-cyan" />
                    <h3 className="font-display text-xl text-cream-100">{g.category}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {g.items.map((s) => (
                      <span key={s} className="rounded-full border border-neon-purple/40 bg-ink-700 px-3 py-1 text-sm text-cream-100">{s}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* Projects */}
      <section id="projects" className="mx-auto max-w-5xl px-6 py-20">
        <motion.div {...fadeUp}>
          <SectionHeading kicker="Espresso Machine" title="Projects" />
          <div className="grid gap-5 md:grid-cols-2">
            {projects.map((p) => (
              <div key={p.name} className="rounded-2xl border border-ink-600 bg-ink-800/50 p-6 transition hover:border-neon-cyan/40 hover:shadow-glow-cyan">
                <div className="flex items-start justify-between">
                  <h3 className="font-display text-xl text-cream-100">{p.name}</h3>
                  <div className="flex gap-2">
                    {p.repo && (
                      <a href={p.repo} target="_blank" rel="noreferrer" aria-label={`${p.name} repo`} className="text-cream-200 hover:text-neon-cyan"><Github size={18} /></a>
                    )}
                    {p.link && (
                      <a href={p.link} target="_blank" rel="noreferrer" aria-label={`${p.name} live`} className="text-cream-200 hover:text-neon-cyan"><ExternalLink size={18} /></a>
                    )}
                  </div>
                </div>
                <p className="mt-2 text-sm text-cream-200">{p.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.tags.map((t) => <span key={t} className="rounded-full bg-ink-700 px-2.5 py-0.5 text-xs text-neon-cyan">{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Experience */}
      <section id="experience" className="mx-auto max-w-3xl px-6 py-20">
        <motion.div {...fadeUp}>
          <SectionHeading kicker="Laptop" title="Experience" />
          <div className="relative border-l border-neon-purple/40 pl-6">
            {experience.map((e) => (
              <div key={e.role + e.company} className="mb-8 last:mb-0">
                <div className="absolute -left-[7px] h-3 w-3 rounded-full border-2 border-night-900 bg-neon-pink shadow-glow-pink" />
                <h3 className="font-display text-xl text-cream-100">{e.role}</h3>
                <p className="text-sm text-neon-cyan">{e.company}{e.period ? ` · ${e.period}` : ''}{e.location ? ` · ${e.location}` : ''}</p>
                <ul className="mt-2 list-disc pl-5 text-sm text-cream-200">
                  {e.highlights.map((h) => <li key={h}>{h}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Education */}
      <section id="education" className="mx-auto max-w-3xl px-6 py-20">
        <motion.div {...fadeUp}>
          <SectionHeading kicker="Noticeboard" title="Education" />
          <div className="space-y-4">
            {education.map((e) => (
              <div key={e.institution} className="rounded-2xl border border-ink-600 bg-ink-800/50 p-6">
                <div className="flex items-center gap-2">
                  <GraduationCap size={22} className="text-neon-blue" />
                  <h3 className="font-display text-xl text-cream-100">{e.institution}</h3>
                </div>
                <p className="mt-1 text-sm text-neon-cyan">{e.course} · {e.period}</p>
                <ul className="mt-3 list-disc pl-5 text-sm text-cream-200">
                  {e.details.map((d) => <li key={d}>{d}</li>)}
                </ul>
              </div>
            ))}
            <div className="rounded-2xl border border-ink-600 bg-ink-800/50 p-6">
              <h3 className="font-display text-lg text-cream-100">A Levels</h3>
              <div className="mt-3 flex flex-wrap gap-3">
                {aLevels.map((a) => (
                  <span key={a.subject} className="rounded-full border border-neon-purple/40 bg-ink-700 px-3 py-1 text-sm text-cream-100">
                    {a.subject}: <span className="text-neon-cyan">{a.grade}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Achievements */}
      <section id="achievements" className="mx-auto max-w-5xl px-6 py-20">
        <motion.div {...fadeUp}>
          <SectionHeading kicker="Achievement Shelf" title="Achievements & Certifications" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {achievements.map((a) => {
              const Icon = getIcon(a.icon);
              return (
                <div key={a.title} className="flex items-center gap-3 rounded-2xl border border-neon-pink/30 bg-ink-800/50 p-4">
                  <Icon size={22} className="shrink-0 text-neon-pink" />
                  <span className="text-sm text-cream-100">{a.title}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* Contact */}
      <section id="contact" className="mx-auto max-w-3xl px-6 py-20 text-center">
        <motion.div {...fadeUp}>
          <SectionHeading kicker="Ordering Terminal" title="Let's Talk" />
          <p className="text-cream-200">I'm open to roles, collaborations and good coffee conversations.</p>
          <a href={`mailto:${profile.email}`} className="mt-5 inline-flex items-center gap-2 rounded-full bg-neon-magenta px-6 py-3 font-medium text-ink-900 transition hover:opacity-80">
            <Mail size={18} /> {profile.email}
          </a>
          <div className="mt-8 flex justify-center gap-4">
            {socials.map((s) => {
              const Icon = getIcon(s.icon);
              return (
                <a key={s.label} href={s.url} target="_blank" rel="noreferrer" aria-label={s.label}
                  className="rounded-full border border-ink-600 p-3 text-cream-200 transition hover:border-neon-magenta hover:text-neon-magenta">
                  <Icon size={22} />
                </a>
              );
            })}
          </div>
        </motion.div>
      </section>

      <footer className="border-t border-ink-700 py-8 text-center text-sm text-cream-200/60">
        <p>© {new Date().getFullYear()} {profile.name} · Ayushi's Cafe</p>
        <p className="mt-1">Designed and developed by Ayushi Bose · Built with React, Three.js & lots of espresso.</p>
      </footer>
    </div>
  );
}
