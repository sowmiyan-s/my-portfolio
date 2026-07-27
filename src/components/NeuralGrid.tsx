import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import WebGLErrorBoundary from './WebGLErrorBoundary';

function ParticleField() {
  const ref = useRef<THREE.Points>(null);
  
  // Create a grid of points
  const [positions] = useMemo(() => {
    const count = 2000;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        pos[i * 3] = (Math.random() - 0.5) * 50;
        pos[i * 3 + 1] = (Math.random() - 0.5) * 50;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    return [pos];
  }, []);

  useFrame((state) => {
    if (ref.current) {
        // Subtle rotation
        ref.current.rotation.x += 0.0005;
        ref.current.rotation.y += 0.0008;
        
        // Mouse reaction (subtle shift)
        const mouseX = state.mouse.x * 2;
        const mouseY = state.mouse.y * 2;
        ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, mouseX, 0.05);
        ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, mouseY, 0.05);
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#ff0000"
          size={0.1}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.3}
        />
      </Points>
    </group>
  );
}

const NeuralCssFallback = () => (
  <div className="absolute inset-0 pointer-events-none -z-10 bg-black overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,0,0,0.15)_0%,transparent_70%)]" />
  </div>
);

const NeuralGrid = () => {
  return (
    <div className="absolute inset-0 pointer-events-none -z-10 bg-black">
      <WebGLErrorBoundary fallback={<NeuralCssFallback />}>
        <Canvas
          camera={{ position: [0, 0, 20], fov: 60 }}
          gl={{ powerPreference: 'low-power', antialias: false, failIfMajorPerformanceCaveat: false }}
        >
          <color attach="background" args={['#000']} />
          <fog attach="fog" args={['#000', 10, 35]} />
          <ambientLight intensity={1} />
          <ParticleField />
        </Canvas>
      </WebGLErrorBoundary>
      {/* Tactical Scanlines Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] z-10 pointer-events-none bg-[length:100%_4px,3px_100%]" />
    </div>
  );
};

export default NeuralGrid;

