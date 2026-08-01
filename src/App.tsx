import { Suspense, lazy, useState, useEffect, useRef, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import LoadingScreen from '@/components/LoadingScreen';
import SceneErrorBoundary from '@/components/SceneErrorBoundary';
import MobileCafeFallback from '@/components/MobileCafeFallback';
import InfoPanel from '@/components/InfoPanel';
import StandardPortfolio from '@/components/StandardPortfolio';
import { profile, type SectionId } from '@/data/portfolioData';

const CoffeeShopScene = lazy(() => import('@/components/CoffeeShopScene'));

const MOBILE_BREAKPOINT = 768;

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return reduced;
}

function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < MOBILE_BREAKPOINT);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return mobile;
}

export default function App() {
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile();

  const [sceneLoaded, setSceneLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId | null>(null);
  const [hovered, setHovered] = useState<SectionId | null>(null);

  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setSceneLoaded(true), 1600);
    return () => clearTimeout(t);
  }, []);

  const handleSelect = useCallback((id: SectionId) => setActiveSection(id), []);
  const closePanel = useCallback(() => setActiveSection(null), []);

  const scrollToScene = () => {
    sceneRef.current?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
  };

  const scrollToStandard = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
  };

  const handleDownloadCV = () => {
    const link = document.createElement('a');
    link.href = profile.cvUrl;
    link.download = '';
    link.click();
  };

  return (
    <div className="relative min-h-screen bg-night-900">
      {!sceneLoaded && <LoadingScreen />}

      <Navbar />

      <Hero onExplore={scrollToScene} onStandard={scrollToStandard} onDownloadCV={handleDownloadCV} />

      {/* 3D Cyberpunk Café experience */}
      <section
        ref={sceneRef}
        aria-label="Interactive 3D cyberpunk cafe"
        className="relative h-screen w-full overflow-hidden"
      >
        {isMobile ? (
          <MobileCafeFallback onSelect={handleSelect} />
        ) : (
          <SceneErrorBoundary fallback={<MobileCafeFallback onSelect={handleSelect} />}>
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
        )}

        {/* Overlay UI */}
        {!isMobile && (
          <>
            {/* Hint */}
            <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
              <p className="text-sm text-cream-200/60">Drag to orbit · Click glowing objects to explore</p>
            </div>

            {/* Object legend */}
            <div className="pointer-events-none absolute right-4 top-20 hidden flex-col gap-1.5 lg:flex">
              {[
                { id: 'about' as const, label: 'Neon Sign', color: 'text-neon-pink' },
                { id: 'projects' as const, label: 'Espresso Machine', color: 'text-neon-cyan' },
                { id: 'skills' as const, label: 'Menu Board', color: 'text-neon-cyan' },
                { id: 'experience' as const, label: 'Laptop', color: 'text-neon-purple' },
                { id: 'achievements' as const, label: 'Achievement Shelf', color: 'text-neon-pink' },
                { id: 'education' as const, label: 'Noticeboard', color: 'text-neon-blue' },
                { id: 'cv' as const, label: 'Receipt Printer', color: 'text-neon-green' },
                { id: 'contact' as const, label: 'Contact Terminal', color: 'text-neon-magenta' },
              ].map((o) => (
                <div
                  key={o.id}
                  className={`text-xs transition ${hovered === o.id ? `${o.color} font-semibold` : 'text-cream-200/40'}`}
                >
                  {o.label}
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* Standard portfolio (semantic HTML) */}
      <StandardPortfolio />

      {/* Info panel */}
      <InfoPanel section={activeSection} onClose={closePanel} />

      {/* Hidden semantic content for accessibility */}
      <div className="sr-only" aria-hidden="false">
        <h2>{profile.name} — {profile.title}</h2>
        <p>{profile.summary}</p>
      </div>
    </div>
  );
}
