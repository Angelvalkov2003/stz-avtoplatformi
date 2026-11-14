"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  Html,
  OrbitControls,
  useGLTF,
} from "@react-three/drei";
import { Suspense, useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { Group } from "three";

function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

type Dims = {
  slug: string;
  lengthM: number;
  widthM: number;
  name: string;
};

function ProceduralTrailer({ lengthM, widthM }: Dims) {
  const L = lengthM;
  const W = widthM;
  const deckY = 0.55;
  const deckT = 0.08;

  return (
    <group>
      {/* deck */}
      <mesh position={[0, deckY, 0]} castShadow receiveShadow>
        <boxGeometry args={[L, deckT, W]} />
        <meshStandardMaterial color="#C8CCD2" metalness={0.65} roughness={0.35} />
      </mesh>
      {/* side rails */}
      <mesh position={[0, deckY + 0.18, W / 2 - 0.04]}>
        <boxGeometry args={[L * 0.98, 0.28, 0.05]} />
        <meshStandardMaterial color="#6E737B" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0, deckY + 0.18, -W / 2 + 0.04]}>
        <boxGeometry args={[L * 0.98, 0.28, 0.05]} />
        <meshStandardMaterial color="#6E737B" metalness={0.5} roughness={0.4} />
      </mesh>
      {/* A-frame hitch */}
      <mesh position={[-L / 2 - 0.55, deckY - 0.05, 0]} rotation={[0, 0, -0.15]}>
        <boxGeometry args={[1.2, 0.08, 0.08]} />
        <meshStandardMaterial color="#1E2125" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[-L / 2 - 0.35, deckY - 0.05, 0.35]} rotation={[0, 0.4, -0.1]}>
        <boxGeometry args={[0.9, 0.06, 0.06]} />
        <meshStandardMaterial color="#1E2125" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[-L / 2 - 0.35, deckY - 0.05, -0.35]} rotation={[0, -0.4, -0.1]}>
        <boxGeometry args={[0.9, 0.06, 0.06]} />
        <meshStandardMaterial color="#1E2125" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* coupler */}
      <mesh position={[-L / 2 - 1.05, deckY - 0.12, 0]}>
        <boxGeometry args={[0.22, 0.16, 0.18]} />
        <meshStandardMaterial color="#FCBC04" metalness={0.3} roughness={0.45} />
      </mesh>
      {/* jockey wheel */}
      <mesh position={[-L / 2 - 0.55, 0.22, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.45, 12]} />
        <meshStandardMaterial color="#6E737B" />
      </mesh>
      <mesh position={[-L / 2 - 0.55, 0.05, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.12, 0.12, 0.05, 16]} />
        <meshStandardMaterial color="#1E2125" />
      </mesh>
      {/* dual axle */}
      {[0.35, 0.95].map((ox) => (
        <group key={ox} position={[L / 2 - ox - 0.8, 0.28, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.04, 0.04, W + 0.15, 12]} />
            <meshStandardMaterial color="#1E2125" />
          </mesh>
          {[-1, 1].map((side) => (
            <group key={side} position={[0, 0, (side * W) / 2]}>
              <mesh rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.32, 0.32, 0.22, 20]} />
                <meshStandardMaterial color="#1E2125" roughness={0.9} />
              </mesh>
              <mesh position={[0, 0.22, side * 0.05]}>
                <boxGeometry args={[0.55, 0.18, 0.35]} />
                <meshStandardMaterial color="#6E737B" metalness={0.4} roughness={0.5} />
              </mesh>
            </group>
          ))}
        </group>
      ))}
      {/* rear ramps */}
      <mesh position={[L / 2 + 0.35, 0.28, 0.35]} rotation={[0, 0, -0.55]}>
        <boxGeometry args={[0.9, 0.05, 0.35]} />
        <meshStandardMaterial color="#C8CCD2" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[L / 2 + 0.35, 0.28, -0.35]} rotation={[0, 0, -0.55]}>
        <boxGeometry args={[0.9, 0.05, 0.35]} />
        <meshStandardMaterial color="#C8CCD2" metalness={0.5} roughness={0.4} />
      </mesh>
      {/* winch */}
      <mesh position={[-L / 2 + 0.35, deckY + 0.22, 0]}>
        <boxGeometry args={[0.35, 0.28, 0.4]} />
        <meshStandardMaterial color="#1E2125" metalness={0.55} roughness={0.4} />
      </mesh>
      <mesh position={[-L / 2 + 0.35, deckY + 0.38, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.08, 0.08, 0.3, 12]} />
        <meshStandardMaterial color="#FCBC04" />
      </mesh>

      <Html position={[0, deckY + 0.55, 0]} center distanceFactor={10}>
        <span className="tabular rounded-none bg-white/90 px-2 py-0.5 text-[10px] text-graphite shadow-none">
          {lengthM.toFixed(2)} × {widthM.toFixed(2)} м
        </span>
      </Html>
    </group>
  );
}

function GlbModel({ slug }: { slug: string }) {
  const { scene } = useGLTF(`/models/${slug}.glb`);
  return <primitive object={scene} />;
}

function AutoRotate({
  enabled,
  children,
}: {
  enabled: boolean;
  children: React.ReactNode;
}) {
  const ref = useRef<Group>(null);
  useFrame((_, dt) => {
    if (enabled && ref.current) ref.current.rotation.y += dt * 0.25;
  });
  return <group ref={ref}>{children}</group>;
}

export function PlatformScene(props: Dims) {
  const [hasGlb, setHasGlb] = useState(false);
  const [userControl, setUserControl] = useState(false);
  const reduceMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    () => false,
  );

  useEffect(() => {
    let cancelled = false;
    fetch(`/models/${props.slug}.glb`, { method: "HEAD" })
      .then((r) => {
        if (!cancelled) setHasGlb(r.ok);
      })
      .catch(() => {
        if (!cancelled) setHasGlb(false);
      });
    return () => {
      cancelled = true;
    };
  }, [props.slug]);

  const auto = !reduceMotion && !userControl;

  return (
    <Canvas
      camera={{ position: [props.lengthM * 0.9, 2.2, props.lengthM * 0.9], fov: 40 }}
      gl={{ antialias: true }}
      onPointerDown={() => setUserControl(true)}
    >
      <color attach="background" args={["#ffffff"]} />
      <ambientLight intensity={0.75} />
      <directionalLight position={[4, 8, 3]} intensity={1.1} castShadow />
      <Suspense fallback={null}>
        <AutoRotate enabled={auto}>
          {hasGlb ? (
            <GlbModel slug={props.slug} />
          ) : (
            <ProceduralTrailer {...props} />
          )}
        </AutoRotate>
        <ContactShadows
          position={[0, 0, 0]}
          opacity={0.35}
          scale={props.lengthM * 2.2}
          blur={2.2}
        />
      </Suspense>
      <OrbitControls
        makeDefault
        enablePan={false}
        minDistance={3}
        maxDistance={14}
        minPolarAngle={0.35}
        maxPolarAngle={Math.PI / 2.1}
        onStart={() => setUserControl(true)}
      />
    </Canvas>
  );
}
