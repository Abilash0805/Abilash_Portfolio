"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { scrollState } from "@/lib/scroll-store";

/**
 * Deterministic hash -> [0, 1). Using a seeded sequence instead of Math.random
 * keeps the field identical on every render (and between server and client),
 * so React never sees the geometry "change" underneath it.
 */
function rand(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * Slow-drifting particle field. Depth comes from size attenuation rather than a
 * post-process pass -- cheap enough to leave running on integrated graphics.
 */
export function Dust({ count = 900, color = "#ff8b5c" }: { count?: number; color?: string }) {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const array = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      // Spherical shell, so the field surrounds the camera instead of sitting
      // in a slab whose edges you can see.
      const radius = 3 + rand(i * 3) * 7;
      const theta = rand(i * 3 + 1) * Math.PI * 2;
      const phi = Math.acos(2 * rand(i * 3 + 2) - 1);
      array[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      array[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      array[i * 3 + 2] = radius * Math.cos(phi);
    }
    return array;
  }, [count]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 1 / 30);
    const points = pointsRef.current;
    if (!points) return;
    points.rotation.y += dt * 0.02;
    points.rotation.x += dt * 0.006;
    points.position.z = THREE.MathUtils.lerp(
      points.position.z,
      scrollState.pageProgress * 4,
      dt * 2,
    );
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.022}
        sizeAttenuation
        transparent
        opacity={0.55}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
