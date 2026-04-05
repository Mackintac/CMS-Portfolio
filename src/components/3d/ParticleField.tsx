"use client";
// src/components/3d/ParticleField.tsx

import { useRef, useMemo, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// ─── Constants ───────────────────────────────────────────────────────────────

const NODE_COUNT = 150;
const EDGE_DISTANCE_THRESHOLD = 1.5;
const REPEL_RADIUS = 2.0;
const REPEL_STRENGTH = 0.04;
const LERP_FACTOR = 0.08;

const X_RANGE = 8;
const Y_RANGE = 5;

const COLOR_CENTRE = new THREE.Color("#7c3aed"); // violet
const COLOR_EDGE = new THREE.Color("#06b6d4");   // cyan

// ─── Types ───────────────────────────────────────────────────────────────────

interface MouseRef {
  x: number;
  y: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function buildInitialPositions(): Float32Array {
  const positions = new Float32Array(NODE_COUNT * 3);
  for (let i = 0; i < NODE_COUNT; i++) {
    positions[i * 3 + 0] = (Math.random() * 2 - 1) * X_RANGE;
    positions[i * 3 + 1] = (Math.random() * 2 - 1) * Y_RANGE;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 0.4; // very near z=0
  }
  return positions;
}

/** Colour per node based on distance from centre, violet→cyan */
function buildNodeColors(positions: Float32Array): Float32Array {
  const colors = new Float32Array(NODE_COUNT * 3);
  const maxDist = Math.sqrt(X_RANGE * X_RANGE + Y_RANGE * Y_RANGE);
  const tmp = new THREE.Color();
  for (let i = 0; i < NODE_COUNT; i++) {
    const x = positions[i * 3 + 0];
    const y = positions[i * 3 + 1];
    const t = Math.min(Math.sqrt(x * x + y * y) / maxDist, 1);
    tmp.lerpColors(COLOR_CENTRE, COLOR_EDGE, t);
    colors[i * 3 + 0] = tmp.r;
    colors[i * 3 + 1] = tmp.g;
    colors[i * 3 + 2] = tmp.b;
  }
  return colors;
}

/** Build edge index pairs for nodes within the distance threshold. */
function buildEdgeIndices(positions: Float32Array): number[] {
  const indices: number[] = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    const ax = positions[i * 3 + 0];
    const ay = positions[i * 3 + 1];
    for (let j = i + 1; j < NODE_COUNT; j++) {
      const dx = ax - positions[j * 3 + 0];
      const dy = ay - positions[j * 3 + 1];
      if (Math.sqrt(dx * dx + dy * dy) < EDGE_DISTANCE_THRESHOLD) {
        indices.push(i, j);
      }
    }
  }
  return indices;
}

// ─── Inner scene (must be inside Canvas) ─────────────────────────────────────

function ParticleScene({ mouseRef }: { mouseRef: React.MutableRefObject<MouseRef> }) {
  const { viewport } = useThree();

  // Stable initial positions (origin positions for repel reset)
  const originPositions = useMemo(() => buildInitialPositions(), []);

  // Live positions that get mutated each frame
  const livePositions = useMemo(
    () => new Float32Array(originPositions),
    [originPositions],
  );

  const nodeColors = useMemo(() => buildNodeColors(originPositions), [originPositions]);

  const edgeIndices = useMemo(() => buildEdgeIndices(originPositions), [originPositions]);

  // Edge positions buffer — updated each frame from livePositions
  const edgePositions = useMemo(
    () => new Float32Array(edgeIndices.length * 3),
    [edgeIndices],
  );

  // Refs to BufferAttributes so we can mark needsUpdate
  const nodeGeoRef = useRef<THREE.BufferGeometry>(null);
  const edgeGeoRef = useRef<THREE.BufferGeometry>(null);

  useFrame(() => {
    // Map mouse from [-1,1] to scene coords
    const mx = mouseRef.current.x * viewport.width * 0.5;
    const my = mouseRef.current.y * viewport.height * 0.5;

    // Update live positions with repel + lerp back to origin
    for (let i = 0; i < NODE_COUNT; i++) {
      const ox = originPositions[i * 3 + 0];
      const oy = originPositions[i * 3 + 1];
      const oz = originPositions[i * 3 + 2];

      let cx = livePositions[i * 3 + 0];
      let cy = livePositions[i * 3 + 1];

      const dx = cx - mx;
      const dy = cy - my;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < REPEL_RADIUS && dist > 0) {
        const force = (1 - dist / REPEL_RADIUS) * REPEL_STRENGTH;
        cx += (dx / dist) * force * viewport.width;
        cy += (dy / dist) * force * viewport.width;
      }

      // Lerp back toward origin
      livePositions[i * 3 + 0] = cx + (ox - cx) * LERP_FACTOR;
      livePositions[i * 3 + 1] = cy + (oy - cy) * LERP_FACTOR;
      livePositions[i * 3 + 2] = oz; // z unchanged
    }

    // Push updated positions to node geometry
    if (nodeGeoRef.current) {
      const attr = nodeGeoRef.current.getAttribute(
        "position",
      ) as THREE.BufferAttribute;
      attr.set(livePositions);
      attr.needsUpdate = true;
    }

    // Rebuild edge position buffer
    if (edgeGeoRef.current) {
      for (let e = 0; e < edgeIndices.length; e++) {
        const ni = edgeIndices[e];
        edgePositions[e * 3 + 0] = livePositions[ni * 3 + 0];
        edgePositions[e * 3 + 1] = livePositions[ni * 3 + 1];
        edgePositions[e * 3 + 2] = livePositions[ni * 3 + 2];
      }
      const attr = edgeGeoRef.current.getAttribute(
        "position",
      ) as THREE.BufferAttribute;
      attr.set(edgePositions);
      attr.needsUpdate = true;
    }
  });

  return (
    <>
      {/* ── Nodes ── */}
      <points>
        <bufferGeometry ref={nodeGeoRef}>
          <bufferAttribute
            attach="attributes-position"
            args={[livePositions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[nodeColors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          vertexColors
          size={0.08}
          sizeAttenuation
          transparent
          opacity={0.7}
          depthWrite={false}
        />
      </points>

      {/* ── Edges ── */}
      <lineSegments>
        <bufferGeometry ref={edgeGeoRef}>
          <bufferAttribute
            attach="attributes-position"
            args={[edgePositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#7c3aed"
          transparent
          opacity={0.12}
          depthWrite={false}
        />
      </lineSegments>
    </>
  );
}

// ─── Public component (owns Canvas + mouse state) ────────────────────────────

export function ParticleField() {
  const mouseRef = useRef<MouseRef>({ x: 0, y: 0 });

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    },
    [],
  );

  const handlePointerLeave = useCallback(() => {
    mouseRef.current.x = 9999; // park far away so no repel
    mouseRef.current.y = 9999;
  }, []);

  return (
    <div
      className="absolute inset-0"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        gl={{ antialias: false, alpha: true }}
        style={{ background: "transparent" }}
        dpr={[1, 1.5]}
      >
        <ParticleScene mouseRef={mouseRef} />
      </Canvas>
    </div>
  );
}
