import { useRef, useMemo, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { interactiveObjects, type SectionId } from '@/data/portfolioData';

// ============================================================
//  AYUSHI'S CAFE — COSY STREET-SIDE CAFÉ
//  Warm wood & cream café with subtle cyberpunk accents.
//  Open-front shop on a night-time street, orbit-controllable.
// ============================================================

// --- Warm café palette ---
const WOOD = '#6b4423';
const WOOD_DARK = '#4a2f18';
const WOOD_LIGHT = '#8b5e3c';
const CREAM = '#f5e6d3';
const CREAM_DARK = '#e8d5b7';
const CARAMEL = '#c68c42';
const TERRACOTTA = '#b5654a';
const BRICK = '#7a4a3a';
const DARK_BROWN = '#2a1a10';
const PLANT_GREEN = '#4a7c4a';

// --- Subtle neon accents (used sparingly) ---
const NEON_PINK = '#ff2d95';
const NEON_CYAN = '#00f0ff';
const NEON_PURPLE = '#9d4edd';
const NEON_BLUE = '#3a86ff';
const NEON_MAGENTA = '#d600ff';
const NEON_GREEN = '#39ff14';
const NEON_AMBER = '#ffb000';

// --- Night street palette ---
const NIGHT_SKY = '#0d1428';
const NIGHT_DEEP = '#070a18';
const STREET = '#1a1a22';

type SceneProps = {
  hovered: SectionId | null;
  setHovered: (id: SectionId | null) => void;
  onSelect: (id: SectionId) => void;
  reducedMotion: boolean;
  selected: SectionId | null;
};

// ---------- Material helpers --------------------------------
function woodMat(color: string, rough = 0.7) {
  return new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: 0.1 });
}
function creamMat(color: string, rough = 0.6) {
  return new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: 0.05 });
}
function metalMat(color = '#888', rough = 0.2, metal = 0.9) {
  return new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal });
}
function neonMat(color: string, intensity = 2.5) {
  return new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: intensity, roughness: 0.3, metalness: 0.6 });
}
function glassMat(opacity = 0.15) {
  return new THREE.MeshStandardMaterial({ color: '#a8c5d8', roughness: 0.05, metalness: 0.1, transparent: true, opacity });
}

// ---------- Interactive wrapper ------------------------------
type WrapperProps = {
  id: SectionId;
  position: [number, number, number];
  children: React.ReactNode;
  hovered: SectionId | null;
  setHovered: (id: SectionId | null) => void;
  onSelect: (id: SectionId) => void;
  hint: string;
  reducedMotion: boolean;
  selected: SectionId | null;
};

function InteractiveObject({
  id, position, children, hovered, setHovered, onSelect, hint, reducedMotion, selected,
}: WrapperProps) {
  const ref = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const isHovered = hovered === id;
  const isSelected = selected === id;

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const target = isHovered ? 1.05 : 1;
    if (!reducedMotion) {
      ref.current.scale.x = THREE.MathUtils.lerp(ref.current.scale.x, target, 0.15);
      ref.current.scale.y = THREE.MathUtils.lerp(ref.current.scale.y, target, 0.15);
      ref.current.scale.z = THREE.MathUtils.lerp(ref.current.scale.z, target, 0.15);
      const baseY = position[1];
      ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, isHovered ? baseY + 0.03 : baseY, 0.15);
    }
    if (ringRef.current) {
      const mat = ringRef.current.material as THREE.MeshBasicMaterial;
      const pulse = 0.5 + 0.5 * Math.sin(t * 3);
      mat.opacity = (isHovered || isSelected) ? 0.35 + pulse * 0.35 : 0.0;
      ringRef.current.rotation.z = t * 0.5;
    }
  });

  return (
    <group
      ref={ref}
      position={position}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(id); document.body.style.cursor = 'pointer'; }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(null); document.body.style.cursor = 'auto'; }}
      onClick={(e) => { e.stopPropagation(); onSelect(id); }}
    >
      {children}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -position[1] + 0.02, 0]}>
        <ringGeometry args={[0.4, 0.52, 32]} />
        <meshBasicMaterial color={NEON_AMBER} transparent opacity={0} side={THREE.DoubleSide} />
      </mesh>
      {isHovered && (
        <Html center distanceFactor={10} position={[0, 0.6, 0]} pointerEvents="none" zIndexRange={[20, 0]}>
          <div
            role="tooltip"
            className="glass-pink px-3 py-1.5 rounded-md text-cream-100 text-xs font-semibold whitespace-nowrap select-none shadow-glow-pink"
            style={{ pointerEvents: 'none' }}
          >
            <span className="neon-text-pink">{hint}</span>
          </div>
        </Html>
      )}
    </group>
  );
}

// ============================================================
//  CAFÉ STRUCTURE — storefront façade, back wall, counter
// ============================================================

// ---------- Storefront façade with awning & windows ----------
function Storefront() {
  return (
    <group position={[0, 0, -3.4]}>
      {/* Back wall — warm cream plaster */}
      <mesh receiveShadow position={[0, 2.5, 0]}>
        <boxGeometry args={[11, 5, 0.2]} />
        <primitive object={creamMat(CREAM_DARK, 0.85)} attach="material" />
      </mesh>

      {/* Brick wainscot along bottom of wall */}
      <mesh receiveShadow position={[0, 0.4, 0.12]}>
        <boxGeometry args={[11, 0.8, 0.04]} />
        <primitive object={woodMat(BRICK, 0.9)} attach="material" />
      </mesh>

      {/* Window frames on back wall (decorative storefront windows) */}
      {[-3.5, 3.5].map((x) => (
        <group key={x} position={[x, 2.6, 0.13]}>
          <mesh>
            <boxGeometry args={[1.6, 1.8, 0.04]} />
            <primitive object={woodMat(WOOD_DARK, 0.6)} attach="material" />
          </mesh>
          {/* Window glass — warm glow */}
          <mesh position={[0, 0, 0.03]}>
            <planeGeometry args={[1.4, 1.6]} />
            <meshStandardMaterial color="#ffd9a0" emissive="#ffaa55" emissiveIntensity={0.3} roughness={0.1} transparent opacity={0.5} />
          </mesh>
          {/* Window cross frame */}
          <mesh position={[0, 0, 0.05]}>
            <boxGeometry args={[0.04, 1.6, 0.02]} />
            <primitive object={woodMat(WOOD_DARK, 0.6)} attach="material" />
          </mesh>
          <mesh position={[0, 0, 0.05]}>
            <boxGeometry args={[1.4, 0.04, 0.02]} />
            <primitive object={woodMat(WOOD_DARK, 0.6)} attach="material" />
          </mesh>
        </group>
      ))}

      {/* Awning / canopy above the café front */}
      <group position={[0, 4.2, 0]}>
        {/* Awning body — striped fabric */}
        <mesh castShadow position={[0, 0, 1.0]} rotation={[-0.3, 0, 0]}>
          <boxGeometry args={[10, 0.08, 2.2]} />
          <primitive object={woodMat(TERRACOTTA, 0.8)} attach="material" />
        </mesh>
        {/* Awning stripes */}
        {Array.from({ length: 10 }, (_, i) => (
          <mesh key={i} position={[-4.5 + i * 1.0, 0.05, 1.0]} rotation={[-0.3, 0, 0]}>
            <boxGeometry args={[0.1, 0.04, 2.15]} />
            <meshStandardMaterial color={i % 2 === 0 ? CREAM : TERRACOTTA} roughness={0.8} />
          </mesh>
        ))}
        {/* Awning scalloped edge */}
        {Array.from({ length: 12 }, (_, i) => (
          <mesh key={`s-${i}`} position={[-4.7 + i * 0.86, -0.06, 2.0]} rotation={[-0.3, 0, 0]}>
            <cylinderGeometry args={[0.12, 0.12, 0.04, 8, 1, false, 0, Math.PI]} />
            <meshStandardMaterial color={i % 2 === 0 ? CREAM : TERRACOTTA} roughness={0.8} />
          </mesh>
        ))}
        {/* Awning support brackets */}
        {[-4.5, 4.5].map((x) => (
          <mesh key={x} position={[x, -0.2, 0.3]} rotation={[0.2, 0, 0]}>
            <boxGeometry args={[0.08, 0.5, 0.8]} />
            <primitive object={woodMat(WOOD_DARK, 0.6)} attach="material" />
          </mesh>
        ))}
      </group>

      {/* Hanging string lights along the awning */}
      {Array.from({ length: 7 }, (_, i) => {
        const x = -3.6 + i * 1.2;
        return (
          <group key={i} position={[x, 4.0, 1.4]}>
            <mesh>
              <sphereGeometry args={[0.06, 8, 8]} />
              <meshStandardMaterial color="#ffd9a0" emissive="#ffaa55" emissiveIntensity={1.5} roughness={0.2} />
            </mesh>
            <pointLight position={[0, 0, 0]} intensity={0.4} distance={2.5} color="#ffb060" />
          </group>
        );
      })}
    </group>
  );
}

// ---------- Side walls (partial, for intimacy) ---------------
function SideWalls() {
  return (
    <>
      {/* Left wall */}
      <mesh receiveShadow position={[-5.5, 2.5, -0.5]}>
        <boxGeometry args={[0.2, 5, 5]} />
        <primitive object={woodMat(WOOD_DARK, 0.85)} attach="material" />
      </mesh>
      {/* Right wall */}
      <mesh receiveShadow position={[5.5, 2.5, -0.5]}>
        <boxGeometry args={[0.2, 5, 5]} />
        <primitive object={woodMat(WOOD_DARK, 0.85)} attach="material" />
      </mesh>
      {/* Warm wall sconces */}
      {[-5.3, 5.3].map((x) => (
        <group key={x} position={[x, 2.8, -1.5]}>
          <mesh>
            <sphereGeometry args={[0.1, 12, 12]} />
            <meshStandardMaterial color="#ffd9a0" emissive="#ffaa55" emissiveIntensity={2} roughness={0.2} />
          </mesh>
          <pointLight position={[x > 0 ? 0.3 : -0.3, 0, 0.3]} intensity={0.6} distance={3} color="#ffb060" />
        </group>
      ))}
    </>
  );
}

// ---------- Large service counter — detailed wood ----------
function Counter() {
  return (
    <group position={[0, 0, -1.8]}>
      {/* Counter body — warm wood panels */}
      <mesh castShadow receiveShadow position={[0, 0.55, 0]}>
        <boxGeometry args={[7, 1.1, 1.4]} />
        <primitive object={woodMat(WOOD, 0.75)} attach="material" />
      </mesh>
      {/* Counter top — light wood / butcher block */}
      <mesh castShadow receiveShadow position={[0, 1.12, 0]}>
        <boxGeometry args={[7.2, 0.08, 1.6]} />
        <primitive object={woodMat(WOOD_LIGHT, 0.4)} attach="material" />
      </mesh>
      {/* Counter front panels — cream inset panels */}
      {[[-2.4, 0], [0, 0], [2.4, 0]].map((p, i) => (
        <mesh key={i} position={[p[0], 0.55, 0.72]}>
          <boxGeometry args={[1.8, 0.7, 0.02]} />
          <primitive object={creamMat(CREAM, 0.5)} attach="material" />
        </mesh>
      ))}
      {/* Counter top edge trim — subtle amber accent */}
      <mesh position={[0, 1.17, 0.8]}>
        <boxGeometry args={[7.2, 0.015, 0.02]} />
        <meshStandardMaterial color={NEON_AMBER} emissive={NEON_AMBER} emissiveIntensity={0.8} roughness={0.3} />
      </mesh>
      {/* Glass sneeze guard / pastry case on counter top */}
      <mesh position={[0, 1.35, -0.2]} castShadow>
        <boxGeometry args={[4, 0.4, 0.5]} />
        <primitive object={glassMat(0.12)} attach="material" />
      </mesh>
      {/* Glass top frame */}
      <mesh position={[0, 1.56, -0.2]}>
        <boxGeometry args={[4.02, 0.03, 0.52]} />
        <primitive object={metalMat('#999', 0.3, 0.9)} attach="material" />
      </mesh>
      {/* Pastries visible in top case */}
      {[-1.2, -0.4, 0.4, 1.2].map((x, i) => (
        <mesh key={i} castShadow position={[x, 1.28, -0.2]}>
          <cylinderGeometry args={[0.1, 0.08, 0.06, 12]} />
          <meshStandardMaterial color={['#d4a017', '#c44', '#e8c060', '#b5654a'][i]} roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

// ---------- Shelves behind counter — wood with café items ----
function BackShelves() {
  const items = useMemo(() => {
    const arr: { x: number; y: number; type: number }[] = [];
    for (let shelf = 0; shelf < 2; shelf++) {
      for (let i = 0; i < 8; i++) {
        arr.push({ x: -3.2 + i * 0.9, y: 2.0 + shelf * 0.7, type: (i + shelf) % 4 });
      }
    }
    return arr;
  }, []);

  return (
    <group position={[0, 0, -3.1]}>
      {/* Shelf boards — warm wood */}
      {[2.0, 2.7].map((y) => (
        <mesh key={y} position={[0, y, 0]} receiveShadow castShadow>
          <boxGeometry args={[7, 0.06, 0.4]} />
          <primitive object={woodMat(WOOD_LIGHT, 0.5)} attach="material" />
        </mesh>
      ))}
      {/* Shelf brackets — dark metal */}
      {[-3.4, 3.4].map((x) => [2.0, 2.7].map((y) => (
        <mesh key={`${x}-${y}`} position={[x, y - 0.2, 0.1]}>
          <boxGeometry args={[0.04, 0.4, 0.25]} />
          <primitive object={metalMat('#555', 0.4, 0.8)} attach="material" />
        </mesh>
      )))}
      {/* Items on shelves */}
      {items.map((item, i) => (
        <group key={i} position={[item.x, item.y + 0.15, 0]}>
          {item.type === 0 && (
            <>
              {/* Ceramic mug */}
              <mesh castShadow>
                <cylinderGeometry args={[0.08, 0.07, 0.2, 12]} />
                <meshStandardMaterial color={CREAM} roughness={0.4} />
              </mesh>
              <mesh position={[0.08, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <torusGeometry args={[0.04, 0.012, 6, 12]} />
                <meshStandardMaterial color={CREAM} roughness={0.4} />
              </mesh>
            </>
          )}
          {item.type === 1 && (
            <mesh castShadow rotation={[0, 0, 0.05]}>
              <boxGeometry args={[0.14, 0.22, 0.08]} />
              <meshStandardMaterial color="#3a2a1a" roughness={0.85} />
            </mesh>
          )}
          {item.type === 2 && (
            <>
              <mesh castShadow>
                <cylinderGeometry args={[0.09, 0.09, 0.2, 12]} />
                <primitive object={glassMat(0.2)} attach="material" />
              </mesh>
              <mesh position={[0, -0.04, 0]}>
                <cylinderGeometry args={[0.08, 0.08, 0.12, 12]} />
                <meshStandardMaterial color="#2a1a10" roughness={0.9} />
              </mesh>
              <mesh position={[0, 0.12, 0]}>
                <cylinderGeometry args={[0.1, 0.1, 0.03, 12]} />
                <primitive object={metalMat('#888', 0.3, 0.9)} attach="material" />
              </mesh>
            </>
          )}
          {item.type === 3 && (
            <mesh castShadow>
              <cylinderGeometry args={[0.1, 0.1, 0.04, 16]} />
              <meshStandardMaterial color={CREAM} roughness={0.4} />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
}

// ---------- Hanging mugs rack above counter -------------------
function HangingMugs() {
  const mugs = useMemo(
    () => [-2.5, -1.5, -0.5, 0.5, 1.5, 2.5].map((x) => ({ x })),
    [],
  );
  return (
    <group position={[0, 2.6, -1.8]}>
      {/* Rack bar — dark wood */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[6.5, 0.05, 0.05]} />
        <primitive object={woodMat(WOOD_DARK, 0.6)} attach="material" />
      </mesh>
      {mugs.map((m, i) => (
        <group key={i} position={[m.x, -0.15, 0]}>
          {/* Hook */}
          <mesh position={[0, 0.08, 0]}>
            <cylinderGeometry args={[0.008, 0.008, 0.08, 6]} />
            <primitive object={metalMat('#666', 0.3, 0.9)} attach="material" />
          </mesh>
          {/* Mug — hanging upside down, cream ceramic */}
          <mesh castShadow rotation={[Math.PI, 0, 0]}>
            <cylinderGeometry args={[0.09, 0.07, 0.16, 12]} />
            <meshStandardMaterial color={CREAM} roughness={0.4} />
          </mesh>
          {/* Handle */}
          <mesh position={[0.09, -0.08, 0]} rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.035, 0.01, 6, 12]} />
            <meshStandardMaterial color={CREAM} roughness={0.4} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ============================================================
//  COUNTER PROPS — non-interactive café equipment
// ============================================================

// ---------- Coffee grinder -----------------------------------
function CoffeeGrinder({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[0.35, 0.45, 0.35]} />
        <primitive object={metalMat('#444', 0.3, 0.8)} attach="material" />
      </mesh>
      {/* Hopper — clear with beans */}
      <mesh castShadow position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.12, 0.08, 0.2, 12]} />
        <primitive object={glassMat(0.25)} attach="material" />
      </mesh>
      <mesh position={[0, 0.28, 0]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#2a1a10" roughness={0.9} />
      </mesh>
      {/* Dose dial */}
      <mesh position={[0, 0.05, 0.18]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.02, 16]} />
        <primitive object={metalMat('#aaa', 0.2, 0.9)} attach="material" />
      </mesh>
    </group>
  );
}

// ---------- Syrup bottles ------------------------------------
function SyrupBottles({ position }: { position: [number, number, number] }) {
  const colors = ['#c44', '#d4a017', '#8b4513', '#5a3a2a'];
  return (
    <group position={position}>
      {colors.map((c, i) => (
        <group key={i} position={[i * 0.14 - 0.21, 0, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.05, 0.05, 0.2, 8]} />
            <meshStandardMaterial color={c} transparent opacity={0.75} roughness={0.2} metalness={0.1} />
          </mesh>
          <mesh position={[0, 0.13, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.06, 6]} />
            <primitive object={metalMat('#555', 0.3, 0.8)} attach="material" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ---------- Milk jugs ----------------------------------------
function MilkJugs({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {[0, 1].map((i) => (
        <group key={i} position={[i * 0.25 - 0.12, 0, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.07, 0.06, 0.18, 12]} />
            <primitive object={metalMat('#bbb', 0.15, 0.95)} attach="material" />
          </mesh>
          <mesh position={[0.08, 0.06, 0]} rotation={[0, 0, -0.5]}>
            <boxGeometry args={[0.06, 0.02, 0.02]} />
            <primitive object={metalMat('#bbb', 0.15, 0.95)} attach="material" />
          </mesh>
          <mesh position={[-0.08, 0.03, 0]} rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.04, 0.008, 6, 12, Math.PI]} />
            <primitive object={metalMat('#bbb', 0.15, 0.95)} attach="material" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ---------- Pastry / cake display case — prominent -----------
function PastryDisplay({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Glass case */}
      <mesh castShadow>
        <boxGeometry args={[1.4, 0.5, 0.6]} />
        <primitive object={glassMat(0.15)} attach="material" />
      </mesh>
      {/* Wood base */}
      <mesh position={[0, -0.26, 0]} castShadow>
        <boxGeometry args={[1.42, 0.04, 0.62]} />
        <primitive object={woodMat(WOOD_LIGHT, 0.5)} attach="material" />
      </mesh>
      {/* Wood top */}
      <mesh position={[0, 0.26, 0]} castShadow>
        <boxGeometry args={[1.42, 0.04, 0.62]} />
        <primitive object={woodMat(WOOD_LIGHT, 0.5)} attach="material" />
      </mesh>
      {/* Pastries inside */}
      {[-0.4, 0, 0.4].map((x, i) => (
        <mesh key={i} castShadow position={[x, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.07, 0.07, 12]} />
          <meshStandardMaterial color={['#d4a017', '#c44', '#e8c060'][i]} roughness={0.7} />
        </mesh>
      ))}
      {/* Cake on stand */}
      <mesh position={[0, -0.18, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.02, 16]} />
        <primitive object={metalMat('#999', 0.2, 0.9)} attach="material" />
      </mesh>
      {/* Internal warm light */}
      <pointLight position={[0, 0.1, 0]} intensity={0.4} distance={1.5} color="#ffb060" />
    </group>
  );
}

// ---------- Coffee bean bags ---------------------------------
function BeanBags({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {[-0.15, 0, 0.15].map((x, i) => (
        <mesh key={i} castShadow position={[x, i * 0.02, 0]} rotation={[0, i * 0.3, 0.1]}>
          <boxGeometry args={[0.18, 0.28, 0.1]} />
          <meshStandardMaterial color="#3a2a1a" roughness={0.85} />
        </mesh>
      ))}
    </group>
  );
}

// ---------- Stacked takeaway cups ----------------------------
function TakeawayCups({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} castShadow position={[0, i * 0.12, 0]}>
          <cylinderGeometry args={[0.08, 0.06, 0.13, 12]} />
          <meshStandardMaterial color={CREAM} roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

// ============================================================
//  INTERACTIVE OBJECTS — 8 clickable portfolio sections
// ============================================================

// ---------- Café Sign "Ayushi's Cafe" = About Me --------------
function NeonSign({
  hovered, setHovered, onSelect, reducedMotion, selected,
}: Omit<WrapperProps, 'id' | 'position' | 'hint' | 'children'>) {
  const groupRef = useRef<THREE.Group>(null);
  const [flicker, setFlicker] = useState(1);

  useEffect(() => {
    if (reducedMotion) return;
    const interval = setInterval(() => {
      setFlicker((f) => (Math.random() > 0.95 ? 0.5 : 1));
    }, 250);
    return () => clearInterval(interval);
  }, [reducedMotion]);

  const letterMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: NEON_PINK, emissive: NEON_PINK, emissiveIntensity: 2.5 * flicker, roughness: 0.2 }),
    [flicker],
  );
  const subMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: NEON_CYAN, emissive: NEON_CYAN, emissiveIntensity: 2 * flicker, roughness: 0.2 }),
    [flicker],
  );

  const letters = "AYUSHI'S CAFE".split('');

  return (
    <InteractiveObject
      id="about" position={[0, 4.0, -3.25]} hovered={hovered} setHovered={setHovered}
      onSelect={onSelect} hint="About Me" reducedMotion={reducedMotion} selected={selected}
    >
      <group ref={groupRef}>
        {/* Sign backing board — dark wood */}
        <mesh position={[0, 0, -0.08]}>
          <boxGeometry args={[5.2, 1.0, 0.08]} />
          <primitive object={woodMat(DARK_BROWN, 0.7)} attach="material" />
        </mesh>
        {letters.map((ch, i) => {
          if (ch === ' ') return <mesh key={i} position={[i * 0.34 - 2.4, 0, 0]} visible={false} />;
          const w = ch === 'I' ? 0.08 : 0.24;
          return (
            <mesh key={i} position={[i * 0.34 - 2.4, 0.05, 0.02]} material={letterMat}>
              <boxGeometry args={[w, 0.32, 0.06]} />
            </mesh>
          );
        })}
        <mesh position={[0, -0.35, 0.02]} material={subMat}>
          <boxGeometry args={[4.6, 0.04, 0.04]} />
        </mesh>
        <mesh position={[-2.5, 0, 0]} material={subMat}>
          <boxGeometry args={[0.04, 0.8, 0.04]} />
        </mesh>
        <mesh position={[2.5, 0, 0]} material={subMat}>
          <boxGeometry args={[0.04, 0.8, 0.04]} />
        </mesh>
        <pointLight position={[0, 0, 0.5]} intensity={1.5} distance={5} color={NEON_PINK} />
      </group>
    </InteractiveObject>
  );
}

// ---------- Espresso Machine = Projects (prominent) ----------
function EspressoMachine(props: Omit<WrapperProps, 'id' | 'position' | 'hint' | 'children'>) {
  const steamRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!steamRef.current || props.reducedMotion) return;
    const t = state.clock.elapsedTime;
    steamRef.current.children.forEach((child, i) => {
      const cycle = (t * 0.5 + i * 0.3) % 2;
      child.position.y = 0.6 + cycle * 0.5;
      const m = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
      m.opacity = 0.15 * (1 - cycle / 2);
    });
  });

  return (
    <InteractiveObject id="projects" position={[-1.0, 1.25, -1.8]} hint="Projects" {...props}>
      {/* Main body — large chrome commercial machine */}
      <mesh castShadow>
        <boxGeometry args={[1.8, 1.1, 0.85]} />
        <primitive object={metalMat('#ccc', 0.15, 0.95)} attach="material" />
      </mesh>
      {/* Top section — cup warming tray */}
      <mesh castShadow position={[0, 0.6, 0]}>
        <boxGeometry args={[1.7, 0.15, 0.75]} />
        <primitive object={metalMat('#aaa', 0.2, 0.9)} attach="material" />
      </mesh>
      {/* Cups on warming tray */}
      {[-0.5, -0.2, 0.2, 0.5].map((x) => (
        <mesh key={x} castShadow position={[x, 0.72, 0]}>
          <cylinderGeometry args={[0.06, 0.05, 0.08, 12]} />
          <meshStandardMaterial color={CREAM} roughness={0.4} />
        </mesh>
      ))}
      {/* Front panel — dark with subtle amber accent strip */}
      <mesh position={[0, 0.1, 0.43]}>
        <boxGeometry args={[1.7, 0.6, 0.02]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[0, 0.35, 0.44]}>
        <boxGeometry args={[1.6, 0.02, 0.02]} />
        <meshStandardMaterial color={NEON_AMBER} emissive={NEON_AMBER} emissiveIntensity={1} roughness={0.3} />
      </mesh>
      {/* Two group heads — prominent */}
      {[-0.4, 0.4].map((x) => (
        <group key={x} position={[x, -0.25, 0.43]}>
          {/* Portafilter handle */}
          <mesh material={metalMat('#333', 0.3, 0.85)}>
            <cylinderGeometry args={[0.1, 0.1, 0.12, 16]} />
          </mesh>
          <mesh position={[0, -0.18, 0]}>
            <cylinderGeometry args={[0.07, 0.06, 0.15, 12]} />
            <primitive object={metalMat('#222', 0.3, 0.9)} attach="material" />
          </mesh>
          <mesh position={[0, -0.28, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.2, 8]} />
            <primitive object={woodMat(DARK_BROWN, 0.6)} attach="material" />
          </mesh>
        </group>
      ))}
      {/* Pressure gauges */}
      {[-0.6, 0.6].map((x) => (
        <mesh key={x} position={[x, 0.25, 0.44]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.04, 16]} />
          <meshStandardMaterial color="#f5f5f5" emissive="#ffd9a0" emissiveIntensity={0.3} roughness={0.2} metalness={0.8} />
        </mesh>
      ))}
      {/* Steam wands */}
      {[-0.8, 0.8].map((x) => (
        <mesh key={x} position={[x, 0.15, 0.43]} rotation={[0, 0, x > 0 ? 0.3 : -0.3]}>
          <cylinderGeometry args={[0.015, 0.015, 0.35, 8]} />
          <primitive object={metalMat('#999', 0.15, 0.95)} attach="material" />
        </mesh>
      ))}
      {/* Subtle cyan accent on top edge */}
      <mesh position={[0, 0.55, 0]}>
        <boxGeometry args={[1.82, 0.02, 0.02]} />
        <meshStandardMaterial color={NEON_CYAN} emissive={NEON_CYAN} emissiveIntensity={0.8} roughness={0.3} />
      </mesh>
      {/* Steam */}
      <group ref={steamRef} position={[0, 0.6, 0.43]}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[0, 0, 0]}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.15} depthWrite={false} />
          </mesh>
        ))}
      </group>
      {/* Warm light from machine */}
      <pointLight position={[0, 0.3, 0.6]} intensity={0.8} distance={3} color="#ffb060" />
    </InteractiveObject>
  );
}

// ---------- Menu Board = Skills (chalkboard style) ------------
function MenuBoard(props: Omit<WrapperProps, 'id' | 'position' | 'hint' | 'children'>) {
  return (
    <InteractiveObject id="skills" position={[1.8, 3.2, -3.15]} hint="Skills & Tech" {...props}>
      {/* Wood frame */}
      <mesh castShadow>
        <boxGeometry args={[2.6, 1.4, 0.1]} />
        <primitive object={woodMat(WOOD_DARK, 0.6)} attach="material" />
      </mesh>
      {/* Chalkboard surface */}
      <mesh position={[0, 0, 0.07]}>
        <planeGeometry args={[2.3, 1.1]} />
        <meshStandardMaterial color="#1a1a14" roughness={0.95} />
      </mesh>
      {/* Menu category bars — chalk-style */}
      {[-0.4, -0.15, 0.1, 0.35].map((y, i) => (
        <group key={i} position={[0, y, 0.08]}>
          <mesh>
            <planeGeometry args={[1.8, 0.04]} />
            <meshBasicMaterial color="#d5c8a0" transparent opacity={0.5} />
          </mesh>
          <mesh position={[-0.95, 0, 0]}>
            <planeGeometry args={[0.5, 0.06]} />
            <meshBasicMaterial color={['#ff7daa', '#7defff', '#c08aff', '#ffc070'][i]} transparent opacity={0.7} />
          </mesh>
        </group>
      ))}
      {/* Small warm light above board */}
      <pointLight position={[0, 0.8, 0.4]} intensity={0.5} distance={3} color="#ffb060" />
    </InteractiveObject>
  );
}

// ---------- Laptop on table = Experience ----------------------
function Laptop(props: Omit<WrapperProps, 'id' | 'position' | 'hint' | 'children'>) {
  const screenRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!screenRef.current || props.reducedMotion) return;
    const m = screenRef.current.material as THREE.MeshStandardMaterial;
    m.emissiveIntensity = 1 + 0.3 * Math.sin(state.clock.elapsedTime * 1.5);
  });

  return (
    <InteractiveObject id="experience" position={[-2.5, 0.83, 1.5]} hint="Experience" {...props}>
      <mesh castShadow>
        <boxGeometry args={[0.5, 0.02, 0.35]} />
        <primitive object={metalMat('#555', 0.3, 0.8)} attach="material" />
      </mesh>
      <group position={[0, 0.02, -0.16]} rotation={[-0.25, 0, 0]}>
        <mesh castShadow position={[0, 0.15, 0]}>
          <boxGeometry args={[0.48, 0.3, 0.02]} />
          <primitive object={metalMat('#333', 0.3, 0.8)} attach="material" />
        </mesh>
        <mesh ref={screenRef} position={[0, 0.15, 0.01]}>
          <planeGeometry args={[0.42, 0.26]} />
          <meshStandardMaterial color={NEON_PURPLE} emissive={NEON_PURPLE} emissiveIntensity={1} roughness={0.2} />
        </mesh>
      </group>
      <pointLight position={[0, 0.2, 0]} intensity={0.5} distance={1.5} color={NEON_PURPLE} />
    </InteractiveObject>
  );
}

// ---------- Trophy / cup shelf = Achievements ----------------
function AchievementDisplay(props: Omit<WrapperProps, 'id' | 'position' | 'hint' | 'children'>) {
  return (
    <InteractiveObject id="achievements" position={[2.5, 1.35, -1.8]} hint="Achievements" {...props}>
      {/* Wood shelf */}
      <mesh castShadow>
        <boxGeometry args={[1.2, 0.5, 0.6]} />
        <primitive object={woodMat(WOOD_LIGHT, 0.5)} attach="material" />
      </mesh>
      {/* Trophy / award items */}
      {[-0.35, 0, 0.35].map((x, i) => (
        <group key={i} position={[x, 0.28, 0]}>
          {i === 0 && (
            <>
              {/* Gold trophy cup */}
              <mesh position={[0, 0.05, 0]} castShadow>
                <cylinderGeometry args={[0.06, 0.08, 0.15, 12]} />
                <meshStandardMaterial color="#d4a017" emissive="#d4a017" emissiveIntensity={0.3} roughness={0.3} metalness={0.8} />
              </mesh>
              <mesh position={[0, 0.16, 0]} castShadow>
                <sphereGeometry args={[0.05, 12, 12]} />
                <meshStandardMaterial color="#d4a017" emissive="#d4a017" emissiveIntensity={0.3} roughness={0.3} metalness={0.8} />
              </mesh>
              <mesh position={[0, -0.06, 0]} castShadow>
                <boxGeometry args={[0.12, 0.02, 0.12]} />
                <primitive object={woodMat(WOOD_DARK, 0.5)} attach="material" />
              </mesh>
            </>
          )}
          {i === 1 && (
            <>
              {/* Certificate frame */}
              <mesh position={[0, 0, 0]} castShadow>
                <boxGeometry args={[0.12, 0.18, 0.04]} />
                <primitive object={woodMat(WOOD_DARK, 0.5)} attach="material" />
              </mesh>
              <mesh position={[0, 0, 0.03]}>
                <planeGeometry args={[0.09, 0.15]} />
                <meshStandardMaterial color={CREAM} roughness={0.5} />
              </mesh>
            </>
          )}
          {i === 2 && (
            <>
              {/* Award badge */}
              <mesh position={[0, 0.05, 0]} castShadow>
                <cylinderGeometry args={[0.08, 0.08, 0.02, 24]} />
                <meshStandardMaterial color="#c0c0c0" roughness={0.2} metalness={0.9} />
              </mesh>
              <mesh position={[0, 0.07, 0]}>
                <torusGeometry args={[0.06, 0.015, 8, 24]} />
                <meshStandardMaterial color="#d4a017" roughness={0.3} metalness={0.8} />
              </mesh>
            </>
          )}
        </group>
      ))}
      <pointLight position={[0, 0.3, 0.3]} intensity={0.6} distance={2} color="#ffb060" />
    </InteractiveObject>
  );
}

// ---------- Receipt printer = Download CV ---------------------
function ReceiptPrinter(props: Omit<WrapperProps, 'id' | 'position' | 'hint' | 'children'>) {
  const paperRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!paperRef.current || props.reducedMotion) return;
    paperRef.current.position.y = -0.12 + Math.sin(state.clock.elapsedTime * 0.8) * 0.015;
  });

  return (
    <InteractiveObject id="cv" position={[-2.5, 1.2, -1.8]} hint="Download CV" {...props}>
      <mesh castShadow>
        <boxGeometry args={[0.45, 0.25, 0.35]} />
        <primitive object={metalMat('#555', 0.3, 0.8)} attach="material" />
      </mesh>
      <mesh position={[0, 0.14, 0]}>
        <boxGeometry args={[0.47, 0.02, 0.37]} />
        <primitive object={woodMat(WOOD_DARK, 0.5)} attach="material" />
      </mesh>
      <mesh ref={paperRef} position={[0, -0.12, 0.15]}>
        <boxGeometry args={[0.25, 0.3, 0.015]} />
        <meshStandardMaterial color={CREAM} roughness={0.9} />
      </mesh>
      {/* Receipt text lines */}
      {[-0.03, -0.08, -0.13, -0.18].map((y) => (
        <mesh key={y} position={[0, y, 0.16]}>
          <boxGeometry args={[0.18, 0.008, 0.005]} />
          <meshBasicMaterial color="#666" transparent opacity={0.5} />
        </mesh>
      ))}
      {/* Subtle green LED */}
      <mesh position={[0.18, 0.08, 0.18]}>
        <sphereGeometry args={[0.015, 8, 8]} />
        <meshStandardMaterial color={NEON_GREEN} emissive={NEON_GREEN} emissiveIntensity={1.5} />
      </mesh>
      <pointLight position={[0, 0.15, 0.25]} intensity={0.4} distance={1.5} color="#ffb060" />
    </InteractiveObject>
  );
}

// ---------- Contact tablet on counter = Contact --------------
function OrderingTerminal(props: Omit<WrapperProps, 'id' | 'position' | 'hint' | 'children'>) {
  const screenRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!screenRef.current || props.reducedMotion) return;
    const m = screenRef.current.material as THREE.MeshStandardMaterial;
    m.emissiveIntensity = 1.2 + 0.4 * Math.sin(state.clock.elapsedTime * 2.5);
  });

  return (
    <InteractiveObject id="contact" position={[3.0, 1.2, -1.4]} hint="Contact Me" {...props}>
      {/* Tablet stand */}
      <mesh castShadow position={[0, -0.15, 0]}>
        <boxGeometry args={[0.15, 0.15, 0.12]} />
        <primitive object={metalMat('#555', 0.3, 0.8)} attach="material" />
      </mesh>
      {/* Tablet housing */}
      <mesh castShadow position={[0, 0.1, 0]} rotation={[-0.3, 0, 0]}>
        <boxGeometry args={[0.45, 0.3, 0.03]} />
        <primitive object={metalMat('#333', 0.3, 0.8)} attach="material" />
      </mesh>
      {/* Screen */}
      <mesh ref={screenRef} position={[0, 0.1, 0.02]} rotation={[-0.3, 0, 0]}>
        <planeGeometry args={[0.4, 0.25]} />
        <meshStandardMaterial color={NEON_MAGENTA} emissive={NEON_MAGENTA} emissiveIntensity={1.2} roughness={0.2} />
      </mesh>
      {/* Touch target dots */}
      {[-0.06, 0, 0.06].map((y) => (
        <mesh key={y} position={[0, y + 0.1, 0.03]} rotation={[-0.3, 0, 0]}>
          <planeGeometry args={[0.22, 0.015]} />
          <meshBasicMaterial color="#1a1a1a" transparent opacity={0.4} />
        </mesh>
      ))}
      <pointLight position={[0, 0.15, 0.3]} intensity={0.6} distance={2} color={NEON_MAGENTA} />
    </InteractiveObject>
  );
}

// ---------- University noticeboard = Education ----------------
function NoticeBoard(props: Omit<WrapperProps, 'id' | 'position' | 'hint' | 'children'>) {
  return (
    <InteractiveObject id="education" position={[-1.8, 3.2, -3.15]} hint="Education" {...props}>
      {/* Cork board frame — wood */}
      <mesh castShadow>
        <boxGeometry args={[1.6, 1.1, 0.08]} />
        <primitive object={woodMat(WOOD_DARK, 0.6)} attach="material" />
      </mesh>
      {/* Cork surface */}
      <mesh position={[0, 0, 0.05]}>
        <planeGeometry args={[1.4, 0.9]} />
        <meshStandardMaterial color="#c4a878" roughness={0.95} />
      </mesh>
      {/* Notice cards / postcards pinned on board */}
      {[-0.3, 0.0, 0.3].map((y, i) => (
        <group key={i} position={[0, y, 0.08]} rotation={[0, 0, (i - 1) * 0.08]}>
          <mesh castShadow>
            <planeGeometry args={[0.9, 0.2]} />
            <meshStandardMaterial color={['#f5e6d3', '#e8d5b7', '#f5e6d3'][i]} roughness={0.7} />
          </mesh>
          {/* Pin */}
          <mesh position={[0, 0.08, 0.02]}>
            <sphereGeometry args={[0.015, 8, 8]} />
            <meshStandardMaterial color="#c44" roughness={0.3} metalness={0.5} />
          </mesh>
        </group>
      ))}
      {/* Accent lines on cards */}
      {[-0.3, 0.0, 0.3].map((y, i) => (
        <mesh key={`l-${i}`} position={[-0.35, y, 0.09]} rotation={[0, 0, (i - 1) * 0.08]}>
          <planeGeometry args={[0.15, 0.015]} />
          <meshBasicMaterial color={['#ff7daa', '#7defff', '#c08aff'][i]} transparent opacity={0.6} />
        </mesh>
      ))}
      <pointLight position={[0, 0, 0.4]} intensity={0.5} distance={3} color="#ffb060" />
    </InteractiveObject>
  );
}

// ============================================================
//  CUSTOMER AREA — round tables, chairs, cosy seating
// ============================================================

function RoundTable({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Round tabletop — warm wood */}
      <mesh castShadow receiveShadow position={[0, 0.72, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.04, 24]} />
        <primitive object={woodMat(WOOD_LIGHT, 0.4)} attach="material" />
      </mesh>
      {/* Table pedestal */}
      <mesh castShadow position={[0, 0.36, 0]}>
        <cylinderGeometry args={[0.05, 0.06, 0.72, 12]} />
        <primitive object={woodMat(WOOD_DARK, 0.6)} attach="material" />
      </mesh>
      {/* Base foot */}
      <mesh castShadow receiveShadow position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.2, 0.22, 0.04, 16]} />
        <primitive object={woodMat(WOOD_DARK, 0.6)} attach="material" />
      </mesh>
    </group>
  );
}

function Chair({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Seat — warm wood */}
      <mesh castShadow position={[0, 0.45, 0]}>
        <boxGeometry args={[0.35, 0.04, 0.35]} />
        <primitive object={woodMat(WOOD, 0.6)} attach="material" />
      </mesh>
      {/* Cushion — cream fabric */}
      <mesh castShadow position={[0, 0.48, 0]}>
        <boxGeometry args={[0.32, 0.03, 0.32]} />
        <primitive object={creamMat(CREAM, 0.7)} attach="material" />
      </mesh>
      {/* Backrest */}
      <mesh castShadow position={[0, 0.7, -0.15]}>
        <boxGeometry args={[0.35, 0.5, 0.04]} />
        <primitive object={woodMat(WOOD, 0.6)} attach="material" />
      </mesh>
      {/* Legs */}
      {[[-0.14, 0, -0.14], [0.14, 0, -0.14], [-0.14, 0, 0.14], [0.14, 0, 0.14]].map((p, i) => (
        <mesh key={i} position={[p[0], 0.22, p[2]]}>
          <boxGeometry args={[0.04, 0.45, 0.04]} />
          <primitive object={woodMat(WOOD_DARK, 0.6)} attach="material" />
        </mesh>
      ))}
    </group>
  );
}

function CoffeeCupOnTable({ position, steam = false, reducedMotion = false }: { position: [number, number, number]; steam?: boolean; reducedMotion?: boolean }) {
  const steamRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!steamRef.current || !steam || reducedMotion) return;
    const t = state.clock.elapsedTime;
    steamRef.current.children.forEach((child, i) => {
      const cycle = (t * 0.4 + i * 0.4) % 1.5;
      child.position.y = 0.08 + cycle * 0.3;
      const m = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
      m.opacity = 0.15 * (1 - cycle / 1.5);
    });
  });

  return (
    <group position={position}>
      {/* Cup — cream ceramic */}
      <mesh castShadow>
        <cylinderGeometry args={[0.06, 0.05, 0.09, 12]} />
        <meshStandardMaterial color={CREAM} roughness={0.3} />
      </mesh>
      {/* Coffee surface */}
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.055, 0.055, 0.005, 12]} />
        <meshStandardMaterial color="#3a1a0a" roughness={0.2} />
      </mesh>
      {/* Handle */}
      <mesh position={[0.07, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.025, 0.008, 6, 12]} />
        <meshStandardMaterial color={CREAM} roughness={0.3} />
      </mesh>
      {/* Saucer */}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.01, 16]} />
        <meshStandardMaterial color={CREAM} roughness={0.3} />
      </mesh>
      {/* Steam */}
      {steam && (
        <group ref={steamRef} position={[0, 0.05, 0]}>
          {[0, 1].map((i) => (
            <mesh key={i} position={[0, 0, 0]}>
              <sphereGeometry args={[0.03, 6, 6]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.15} depthWrite={false} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
}

// ============================================================
//  DECORATIVE CLUTTER — plants, books, chalkboard, candles
// ============================================================

function PottedPlant({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      {/* Pot — terracotta */}
      <mesh castShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.1, 0.2, 12]} />
        <meshStandardMaterial color={TERRACOTTA} roughness={0.8} />
      </mesh>
      {/* Foliage — simple spheres */}
      <mesh castShadow position={[0, 0.2, 0]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial color={PLANT_GREEN} roughness={0.8} />
      </mesh>
      <mesh castShadow position={[0.08, 0.28, 0.04]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#5a8c5a" roughness={0.8} />
      </mesh>
      <mesh castShadow position={[-0.06, 0.25, -0.04]}>
        <sphereGeometry args={[0.09, 8, 8]} />
        <meshStandardMaterial color="#3a6a3a" roughness={0.8} />
      </mesh>
    </group>
  );
}

function ChalkboardSign({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Stand */}
      <mesh castShadow position={[0, 0.15, 0]}>
        <boxGeometry args={[0.04, 0.3, 0.04]} />
        <primitive object={woodMat(WOOD_DARK, 0.6)} attach="material" />
      </mesh>
      {/* Board frame */}
      <mesh castShadow position={[0, 0.45, 0]}>
        <boxGeometry args={[0.4, 0.3, 0.03]} />
        <primitive object={woodMat(WOOD, 0.6)} attach="material" />
      </mesh>
      {/* Chalk surface */}
      <mesh position={[0, 0.45, 0.02]}>
        <planeGeometry args={[0.34, 0.24]} />
        <meshStandardMaterial color="#1a1a14" roughness={0.95} />
      </mesh>
      {/* Chalk text lines */}
      {[-0.04, 0, 0.04].map((y) => (
        <mesh key={y} position={[0, 0.45 + y, 0.025]}>
          <planeGeometry args={[0.2, 0.008]} />
          <meshBasicMaterial color="#d5c8a0" transparent opacity={0.4} />
        </mesh>
      ))}
    </group>
  );
}

function StackOfBooks({ position }: { position: [number, number, number] }) {
  const colors = ['#8b4513', '#5a3a2a', '#b5654a'];
  return (
    <group position={position}>
      {colors.map((c, i) => (
        <mesh key={i} castShadow position={[0, i * 0.04, 0]} rotation={[0, i * 0.1, 0]}>
          <boxGeometry args={[0.2, 0.035, 0.14]} />
          <meshStandardMaterial color={c} roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

function FramedArt({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh castShadow>
        <boxGeometry args={[0.4, 0.3, 0.03]} />
        <primitive object={woodMat(WOOD_DARK, 0.5)} attach="material" />
      </mesh>
      <mesh position={[0, 0, 0.02]}>
        <planeGeometry args={[0.34, 0.24]} />
        <meshStandardMaterial color="#d4a574" roughness={0.6} />
      </mesh>
    </group>
  );
}

function TableCandle({ position }: { position: [number, number, number] }) {
  const flameRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!flameRef.current) return;
    const t = state.clock.elapsedTime;
    flameRef.current.scale.y = 1 + Math.sin(t * 8) * 0.1;
    flameRef.current.scale.x = 1 + Math.cos(t * 6) * 0.05;
  });
  return (
    <group position={position}>
      {/* Candle holder */}
      <mesh castShadow>
        <cylinderGeometry args={[0.05, 0.06, 0.02, 12]} />
        <primitive object={metalMat('#aa8844', 0.3, 0.8)} attach="material" />
      </mesh>
      {/* Candle */}
      <mesh castShadow position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.06, 8]} />
        <meshStandardMaterial color={CREAM} roughness={0.5} />
      </mesh>
      {/* Flame */}
      <mesh ref={flameRef} position={[0, 0.09, 0]}>
        <coneGeometry args={[0.012, 0.03, 6]} />
        <meshBasicMaterial color="#ffaa44" transparent opacity={0.9} />
      </mesh>
      <pointLight position={[0, 0.12, 0]} intensity={0.3} distance={1} color="#ffaa55" />
    </group>
  );
}

// ---------- Pendant lights that gently sway --------------------
function PendantLight({ position, delay = 0, reducedMotion = false }: { position: [number, number, number]; delay?: number; reducedMotion?: boolean }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current || reducedMotion) return;
    const t = state.clock.elapsedTime + delay;
    ref.current.rotation.z = Math.sin(t * 0.5) * 0.03;
    ref.current.rotation.x = Math.cos(t * 0.4) * 0.02;
  });
  return (
    <group ref={ref} position={position}>
      {/* Cord */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 1.0, 6]} />
        <primitive object={woodMat('#222', 0.5)} attach="material" />
      </mesh>
      {/* Shade — copper/brass */}
      <mesh castShadow position={[0, 0, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.15, 0.12, 16, 1, true]} />
        <meshStandardMaterial color="#b87333" roughness={0.3} metalness={0.8} side={THREE.DoubleSide} />
      </mesh>
      {/* Bulb */}
      <mesh position={[0, 0.02, 0]}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshStandardMaterial color="#ffd9a0" emissive="#ffaa55" emissiveIntensity={2.5} roughness={0.1} />
      </mesh>
      <pointLight position={[0, -0.1, 0]} intensity={0.8} distance={4} color="#ffb060" castShadow />
    </group>
  );
}

// ============================================================
//  AMBIENT — floor, street, particles, skyline
// ============================================================

function CafeFloor() {
  return (
    <group>
      {/* Wooden café floor — warm planks */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[12, 8]} />
        <meshStandardMaterial color={WOOD} roughness={0.6} metalness={0.1} />
      </mesh>
      {/* Floor plank lines */}
      {[-3, -1.5, 0, 1.5, 3].map((x) => (
        <mesh key={x} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.01, 0]}>
          <planeGeometry args={[0.02, 8]} />
          <meshBasicMaterial color={WOOD_DARK} transparent opacity={0.4} />
        </mesh>
      ))}
    </group>
  );
}

function StreetGround() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[40, 40]} />
      <meshStandardMaterial color={STREET} roughness={0.7} metalness={0.3} />
    </mesh>
  );
}

function FloatingParticles({ reducedMotion }: { reducedMotion: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(40 * 3);
    for (let i = 0; i < 40; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 1] = Math.random() * 4 + 0.5;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!ref.current || reducedMotion) return;
    const t = state.clock.elapsedTime;
    const pos = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < 40; i++) {
      pos.array[i * 3 + 1] = ((i * 0.06 + t * 0.15) % 4) + 0.5;
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={40} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#ffd9a0" size={0.03} transparent opacity={0.3} sizeAttenuation />
    </points>
  );
}

function CitySkyline() {
  const buildings = useMemo(
    () => Array.from({ length: 16 }, (_, i) => ({
      x: (i - 8) * 2.2 + (Math.random() - 0.5) * 0.5,
      h: 1.5 + Math.random() * 4,
      w: 1.0 + Math.random() * 0.6,
      hasWindow: Math.random() > 0.4,
    })),
    [],
  );
  return (
    <group position={[0, 0, -15]}>
      {buildings.map((b, i) => (
        <group key={i} position={[b.x, b.h / 2, 0]}>
          <mesh>
            <boxGeometry args={[b.w, b.h, 0.5]} />
            <meshStandardMaterial color="#0a0a14" roughness={0.8} />
          </mesh>
          {/* Warm window lights */}
          {b.hasWindow && Array.from({ length: Math.floor(b.h) }, (_, j) => (
            <mesh key={j} position={[0, -b.h / 2 + 0.5 + j * 0.6, 0.26]}>
              <planeGeometry args={[0.15, 0.2]} />
              <meshStandardMaterial color="#ffd9a0" emissive="#ffaa55" emissiveIntensity={0.4} transparent opacity={0.6} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

// ---------- Camera transition on select ----------------------
function CameraController({ selected }: { selected: SectionId | null }) {
  const { camera } = useThree();
  const targetRef = useRef(new THREE.Vector3(0, 1.5, 0));
  const posTargetRef = useRef(new THREE.Vector3(0, 3.0, 9));

  const targets: Record<SectionId, { pos: [number, number, number]; look: [number, number, number] }> = {
    about: { pos: [0, 4.5, 5], look: [0, 4.0, -3.25] },
    projects: { pos: [-1, 2, 3], look: [-1.0, 1.25, -1.8] },
    skills: { pos: [1.8, 3.2, 4], look: [1.8, 3.2, -3.15] },
    experience: { pos: [-2.5, 1.5, 3.5], look: [-2.5, 0.83, 1.5] },
    achievements: { pos: [2.5, 1.5, 2.5], look: [2.5, 1.35, -1.8] },
    cv: { pos: [-2.5, 1.5, 2.5], look: [-2.5, 1.2, -1.8] },
    contact: { pos: [3, 1.5, 2], look: [3.0, 1.2, -1.4] },
    education: { pos: [-1.8, 3.2, 4], look: [-1.8, 3.2, -3.15] },
  };

  useFrame(() => {
    if (selected && targets[selected]) {
      const t = targets[selected];
      posTargetRef.current.set(...t.pos);
      targetRef.current.set(...t.look);
    } else {
      posTargetRef.current.set(0, 3.0, 9);
      targetRef.current.set(0, 1.5, 0);
    }
    camera.position.lerp(posTargetRef.current, 0.04);
    camera.lookAt(targetRef.current);
  });

  return null;
}

// ============================================================
//  MAIN SCENE
// ============================================================
function Scene({ hovered, setHovered, onSelect, reducedMotion, selected }: SceneProps) {
  const wrapperProps = { hovered, setHovered, onSelect, reducedMotion, selected };

  return (
    <>
      {/* Warm ambient + subtle cool night fill */}
      <ambientLight intensity={0.35} color="#ffd9a0" />
      <hemisphereLight args={['#ffb060', '#0a0a14', 0.3]} />
      <directionalLight position={[3, 8, 4]} intensity={0.5} color="#ffd9a0" castShadow />
      <pointLight position={[0, 4, 0]} intensity={0.8} distance={12} color="#ffb060" />
      <pointLight position={[0, 2, -2]} intensity={0.5} distance={8} color="#ffaa55" />
      {/* Subtle cool fill from the night sky */}
      <pointLight position={[-5, 3, 2]} intensity={0.2} distance={10} color="#3a86ff" />

      <StreetGround />
      <CafeFloor />
      <CitySkyline />
      <FloatingParticles reducedMotion={reducedMotion} />

      {/* Café structure */}
      <Storefront />
      <SideWalls />
      <Counter />
      <BackShelves />
      <HangingMugs />

      {/* Pendant lights — warm, swaying */}
      <PendantLight position={[-2, 3.5, 0]} delay={0} reducedMotion={reducedMotion} />
      <PendantLight position={[2, 3.5, 0]} delay={1.5} reducedMotion={reducedMotion} />
      <PendantLight position={[0, 3.5, 2]} delay={0.8} reducedMotion={reducedMotion} />

      {/* Non-interactive counter props */}
      <CoffeeGrinder position={[-2.2, 1.18, -1.8]} />
      <SyrupBottles position={[1.8, 1.18, -1.8]} />
      <MilkJugs position={[-1.8, 1.18, -1.8]} />
      <PastryDisplay position={[2.5, 1.18, -1.8]} />
      <BeanBags position={[-3.0, 1.18, -1.8]} />
      <TakeawayCups position={[3.2, 1.18, -1.8]} />

      {/* Interactive objects */}
      <NeonSign {...wrapperProps} />
      <EspressoMachine {...wrapperProps} />
      <MenuBoard {...wrapperProps} />
      <Laptop {...wrapperProps} />
      <AchievementDisplay {...wrapperProps} />
      <ReceiptPrinter {...wrapperProps} />
      <OrderingTerminal {...wrapperProps} />
      <NoticeBoard {...wrapperProps} />

      {/* Customer seating — intimate, close together */}
      <RoundTable position={[-2.5, 0, 1.5]} />
      <RoundTable position={[2.5, 0, 1.5]} />
      <RoundTable position={[0, 0, 2.8]} />
      <Chair position={[-2.5, 0, 2.1]} rotation={Math.PI} />
      <Chair position={[2.5, 0, 2.1]} rotation={Math.PI} />
      <Chair position={[-1.7, 0, 1.5]} rotation={Math.PI / 2} />
      <Chair position={[1.7, 0, 1.5]} rotation={-Math.PI / 2} />
      <Chair position={[0, 0, 3.5]} rotation={Math.PI} />

      {/* Coffee cups on tables with steam */}
      <CoffeeCupOnTable position={[-2.5, 0.75, 1.5]} steam reducedMotion={reducedMotion} />
      <CoffeeCupOnTable position={[2.5, 0.75, 1.5]} steam reducedMotion={reducedMotion} />
      <CoffeeCupOnTable position={[0, 0.75, 2.8]} steam reducedMotion={reducedMotion} />

      {/* Decorative clutter — lived-in feel */}
      <PottedPlant position={[-4.8, 0, -1]} scale={1.2} />
      <PottedPlant position={[4.8, 0, -1]} scale={1.0} />
      <PottedPlant position={[-4.8, 0, 2.5]} scale={0.8} />
      <ChalkboardSign position={[-3.5, 0, 0.5]} rotation={0.3} />
      <StackOfBooks position={[2.5, 0.75, 1.3]} />
      <TableCandle position={[0, 0.76, 3.0]} />
      <FramedArt position={[-5.3, 2.5, 0]} rotation={Math.PI / 2} />
      <FramedArt position={[5.3, 2.5, 0]} rotation={-Math.PI / 2} />

      <CameraController selected={selected} />
    </>
  );
}

// ---------- Exported canvas wrapper --------------------------
export default function CoffeeShopScene({
  hovered, setHovered, onSelect, reducedMotion, selected,
}: SceneProps) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.8]}
      camera={{ position: [0, 3.0, 9], fov: 45 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
    >
      <color attach="background" args={[NIGHT_SKY]} />
      <fog attach="fog" args={[NIGHT_DEEP, 14, 32]} />
      <Suspense fallback={null}>
        <Scene
          hovered={hovered}
          setHovered={setHovered}
          onSelect={onSelect}
          reducedMotion={reducedMotion}
          selected={selected}
        />
        <Environment preset="night" />
      </Suspense>
      <OrbitControls
        enablePan={false}
        minDistance={5}
        maxDistance={14}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.1}
        autoRotate={!reducedMotion && !selected}
        autoRotateSpeed={0.3}
        enableDamping
        dampingFactor={0.08}
      />
    </Canvas>
  );
}

export { interactiveObjects };
