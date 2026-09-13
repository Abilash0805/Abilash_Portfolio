"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { simplex3d } from "@/components/three/noise.glsl";
import { scrollState } from "@/lib/scroll-store";

const vertexShader = /* glsl */ `
uniform float uTime;
uniform float uAmplitude;
uniform float uFrequency;
uniform float uScroll;

varying vec3 vNormal;
varying vec3 vNormalGeo;
varying vec3 vViewPosition;
varying float vDisplacement;

${simplex3d}

void main() {
  // Two octaves: a slow swell plus a finer ripple that speeds up with scroll.
  float base = snoise(position * uFrequency + vec3(0.0, uTime * 0.18, 0.0));
  float detail = snoise(position * (uFrequency * 2.7) - vec3(uTime * 0.32, 0.0, 0.0));
  float displacement = base * 0.75 + detail * 0.25;

  vDisplacement = displacement;

  vec3 displaced = position + normal * displacement * uAmplitude;

  // Recompute a usable normal by sampling the field along two tangents --
  // without this the lighting stays spherical while the surface churns.
  float eps = 0.08;
  vec3 tangent = normalize(cross(normal, vec3(0.0, 1.0, 0.0) + vec3(0.001)));
  vec3 bitangent = normalize(cross(normal, tangent));

  vec3 pa = position + tangent * eps;
  vec3 pb = position + bitangent * eps;
  float da = snoise(pa * uFrequency + vec3(0.0, uTime * 0.18, 0.0));
  float db = snoise(pb * uFrequency + vec3(0.0, uTime * 0.18, 0.0));

  vec3 va = (pa + normal * da * uAmplitude) - displaced;
  vec3 vb = (pb + normal * db * uAmplitude) - displaced;
  vNormal = normalize(normalMatrix * normalize(cross(va, vb)) * -1.0);
  // The undisplaced normal. Fresnel has to be measured against the underlying
  // sphere -- against the churned surface, every lump reads as a silhouette
  // edge and the rim light floods the whole object.
  vNormalGeo = normalize(normalMatrix * normal);

  vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
  vViewPosition = -mvPosition.xyz;
  gl_Position = projectionMatrix * mvPosition;
}
`;

const fragmentShader = /* glsl */ `
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uRim;
uniform float uScroll;

varying vec3 vNormal;
varying vec3 vNormalGeo;
varying vec3 vViewPosition;
varying float vDisplacement;

void main() {
  vec3 normal = normalize(vNormal);
  vec3 viewDir = normalize(vViewPosition);

  // A single key from the upper left, as if lit on a set, plus the specular
  // it throws. No ambient term worth the name -- the body should stay dark and
  // let the edges do the describing.
  vec3 keyDir = normalize(vec3(-0.55, 0.75, 0.6));
  float ndl = max(dot(normal, keyDir), 0.0);

  vec3 halfDir = normalize(keyDir + viewDir);
  float spec = pow(max(dot(normal, halfDir), 0.0), 54.0);

  // Fresnel rim off the geometric normal, so it hugs the silhouette.
  float fresnel = pow(1.0 - max(dot(normalize(vNormalGeo), viewDir), 0.0), 4.0);

  // Ember reaches only the top of the displacement range, so it looks like
  // heat caught in the ridges rather than a coat of paint.
  float ridge = smoothstep(0.2, 0.9, vDisplacement);

  vec3 color = uColorA * (0.05 + ndl * 0.2);
  color += uColorB * pow(ridge, 3.0) * ndl * 0.6;
  color += uRim * fresnel * (1.15 + uScroll * 0.7);
  color += vec3(1.0, 0.86, 0.76) * spec * 0.45;

  // Filmic roll-off so highlights bloom instead of clipping to flat white.
  color = color / (color + vec3(0.9));
  color = pow(color, vec3(0.4545));

  gl_FragColor = vec4(color, 1.0);
}
`;

export function Monolith({
  colorA = "#171420",
  colorB = "#ff5c2b",
  rim = "#ff7a45",
}: {
  colorA?: string;
  colorB?: string;
  rim?: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const shellRef = useRef<THREE.Mesh>(null);
  // Uniforms are reached through the material ref, never through the object
  // built during render -- the render pass stays free of mutation.
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Sit the form to the right of the headline on wide screens; centre it once
  // the layout stacks and there is no column to clear.
  const viewport = useThree((state) => state.viewport);
  const offsetX = viewport.aspect > 1.1 ? viewport.width * 0.2 : 0;
  const offsetY = viewport.aspect > 1.1 ? viewport.height * 0.08 : viewport.height * 0.12;

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAmplitude: { value: 0.34 },
      uFrequency: { value: 1.15 },
      uScroll: { value: 0 },
      uColorA: { value: new THREE.Color(colorA) },
      uColorB: { value: new THREE.Color(colorB) },
      uRim: { value: new THREE.Color(rim) },
    }),
    [colorA, colorB, rim],
  );

  useFrame((_, delta) => {
    const dt = Math.min(delta, 1 / 30);
    const u = materialRef.current?.uniforms;
    const { heroProgress, velocity, pointerX, pointerY } = scrollState;

    if (u) {
      u.uTime.value += dt;
      u.uScroll.value = heroProgress;

      // Scroll velocity churns the surface; scroll progress swells it.
      const targetAmp = 0.3 + heroProgress * 0.22 + Math.abs(velocity) * 0.3;
      u.uAmplitude.value += (targetAmp - u.uAmplitude.value) * dt * 4;
    }

    const mesh = meshRef.current;
    if (mesh) {
      mesh.rotation.y += dt * 0.12 + velocity * 0.05;
      mesh.rotation.x = THREE.MathUtils.lerp(mesh.rotation.x, pointerY * 0.22, dt * 2.2);
      mesh.rotation.z = THREE.MathUtils.lerp(mesh.rotation.z, pointerX * -0.16, dt * 2.2);

      const scale = 0.62 + heroProgress * 0.26;
      mesh.scale.setScalar(THREE.MathUtils.lerp(mesh.scale.x, scale, dt * 3));
      mesh.position.x = THREE.MathUtils.lerp(mesh.position.x, offsetX, dt * 3);
      mesh.position.y = THREE.MathUtils.lerp(
        mesh.position.y,
        offsetY + heroProgress * -0.9,
        dt * 3,
      );
    }

    const shell = shellRef.current;
    if (shell && mesh) {
      shell.rotation.y -= dt * 0.05;
      shell.rotation.x = mesh.rotation.x * 0.5;
      shell.position.copy(mesh.position);
      shell.scale.setScalar(mesh.scale.x * 1.42);
    }
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.25, 48]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
        />
      </mesh>

      {/* Wireframe shell: reads as a scan volume around the object. */}
      <mesh ref={shellRef}>
        <icosahedronGeometry args={[1.25, 2]} />
        <meshBasicMaterial
          color={rim}
          wireframe
          transparent
          opacity={0.07}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
