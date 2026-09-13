"use client";

import { Canvas } from "@react-three/fiber";
import { useCallback, useSyncExternalStore } from "react";
import { Dust } from "@/components/three/Dust";
import { Monolith } from "@/components/three/Monolith";

/** Probed once per page load; creating throwaway contexts is not free. */
let webglSupport: boolean | null = null;

function hasWebGL() {
  if (webglSupport !== null) return webglSupport;
  try {
    const canvas = document.createElement("canvas");
    webglSupport = Boolean(
      canvas.getContext("webgl2") ??
        canvas.getContext("webgl") ??
        canvas.getContext("experimental-webgl"),
    );
  } catch {
    webglSupport = false;
  }
  return webglSupport;
}

/**
 * The WebGL layer, mounted only when the browser can actually give us a context
 * and the visitor has not asked for reduced motion. In either fallback case the
 * hero's CSS gradient carries the same composition on its own.
 *
 * useSyncExternalStore rather than an effect: the answer lives outside React
 * (the GPU and a media query), and the server snapshot is simply "no".
 */
export function Scene({
  colorA,
  colorB,
  rim,
}: {
  colorA?: string;
  colorB?: string;
  rim?: string;
}) {
  const subscribe = useCallback((onChange: () => void) => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  const enabled = useSyncExternalStore(
    subscribe,
    () => !window.matchMedia("(prefers-reduced-motion: reduce)").matches && hasWebGL(),
    () => false,
  );

  if (!enabled) return null;

  return (
    <Canvas
      className="!absolute inset-0"
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 5.0], fov: 42 }}
      frameloop="always"
    >
      <Monolith colorA={colorA} colorB={colorB} rim={rim} />
      <Dust color={rim} />
    </Canvas>
  );
}
