import {
  Suspense,
  lazy,
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';

import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import LoadingScreen from '@/components/LoadingScreen';
import SceneErrorBoundary from '@/components/SceneErrorBoundary';
import MobileCafeFallback from '@/components/MobileCafeFallback';
import InfoPanel from '@/components/InfoPanel';
import StandardPortfolio from '@/components/StandardPortfolio';

import { profile, type SectionId } from '@/data/portfolioData';

const CoffeeShopScene = lazy(
  () => import('@/components/CoffeeShopScene'),
);

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    );

    setReduced(mq.matches);

    const handler = (event: MediaQueryListEvent) => {
      setReduced(event.matches);
    };

    mq.addEventListener('change', handler);

    return () => {
      mq.removeEventListener('change', handler);
    };
  }, []);

  return reduced;
}

export default function App() {
  const reducedMotion = useReducedMotion();

  const [sceneLoaded, setSceneLoaded] = useState(false);
  const [activeSection, setActiveSection] =
    useState<SectionId | null>(null);
  const [hovered, setHovered] =
    useState<SectionId | null>(null);

  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSceneLoaded(true);
    }, 1600);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  const handleSelect = useCallback((id: SectionId) => {
    setActiveSection(id);
  }, []);

  const closePanel = useCallback(() => {
    setActiveSection(null);
  }, []);

  const scrollToScene = () => {
    sceneRef.current?.scrollIntoView({
      behavior: reducedMotion ? 'auto' : 'smooth',
    });
  };

  const scrollToStandard = () => {
    document.getElementById('about')?.scrollIntoView({
      behavior: reducedMotion ? 'auto' : 'smooth',
    });
  };

  return (
    <div className="relative min-h-screen bg-night-900">
      {!sceneLoaded && <LoadingScreen />}

      <Navbar />

      <Hero
        onExplore={scrollToScene}
        onStandard={scrollToStandard}
      />

      {/* Interactive 3D café */}
      <section
        ref={sceneRef}
        aria-label="Interactive 3D cyberpunk cafe"
        className="relative h-[100svh] min-h-[600px] w-full overflow-hidden"
      >
        <SceneErrorBoundary
          fallback={
            <MobileCafeFallback onSelect={handleSelect} />
          }
        >
          <Suspense fallback={null}>
            <CoffeeShopScene
              hovered={hovered}
              setHovered={setHovered}
              onSelect={handleSelect}
              reducedMotion={reducedMotion}
              selected={activeSection}
            />
          </Suspense>
        </SceneErrorBoundary>

        {/* Interaction hint — shown on desktop and mobile */}
        <div className="pointer-events-none absolute bottom-5 left-1/2 z-20 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 text-center">
          <p className="rounded-full border border-neon-cyan/20 bg-night-900/65 px-4 py-2 text-xs text-cream-200/80 backdrop-blur-md sm:text-sm">
            Drag to explore · Tap glowing objects
          </p>
        </div>

        {/* Object legend — desktop only */}
        <div className="pointer-events-none absolute right-4 top-20 z-20 hidden flex-col gap-1.5 lg:flex">
          {[
            {
              id: 'about' as const,
              label: 'Neon Sign',
              color: 'text-neon-pink',
            },
            {
              id: 'projects' as const,
              label: 'Espresso Machine',
              color: 'text-neon-cyan',
            },
            {
              id: 'skills' as const,
              label: 'Menu Board',
              color: 'text-neon-cyan',
            },
            {
              id: 'experience' as const,
              label: 'Laptop',
              color: 'text-neon-purple',
            },
            {
              id: 'achievements' as const,
              label: 'Achievement Shelf',
              color: 'text-neon-pink',
            },
            {
              id: 'education' as const,
              label: 'Noticeboard',
              color: 'text-neon-blue',
            },
            {
              id: 'contact' as const,
              label: 'Contact Terminal',
              color: 'text-neon-magenta',
            },
          ].map((object) => (
            <div
              key={object.id}
              className={`text-xs transition ${
                hovered === object.id
                  ? `${object.color} font-semibold`
                  : 'text-cream-200/40'
              }`}
            >
              {object.label}
            </div>
          ))}
        </div>
      </section>

      {/* Standard semantic portfolio */}
      <StandardPortfolio />

      {/* Portfolio information panel */}
      <InfoPanel
        section={activeSection}
        onClose={closePanel}
      />

      {/* Hidden semantic introduction */}
      <div className="sr-only" aria-hidden="false">
        <h2>
          {profile.name} — {profile.title}
        </h2>
        <p>{profile.summary}</p>
      </div>
    </div>
  );
}