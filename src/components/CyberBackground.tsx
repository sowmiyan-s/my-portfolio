import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import WebGLErrorBoundary from './WebGLErrorBoundary';

const themeHexMap: Record<string, string> = {
    red: '#ef4444',
    blue: '#3b82f6',
    green: '#10b981',
    purple: '#a855f7',
    yellow: '#f59e0b',
    neon: '#ec4899',
    midnight: '#06b6d4',
    phantom: '#f43f5e',
};

const ParticleField = () => {
    const count = 1000;
    const meshRef = useRef<THREE.Points>(null);
    const materialRef = useRef<THREE.PointsMaterial>(null);

    const particles = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const velocities = new Float32Array(count);
        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 50;
            positions[i * 3 + 1] = Math.random() * 50;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
            velocities[i] = 0.05 + Math.random() * 0.1;
        }
        return { positions, velocities };
    }, []);

    useFrame(() => {
        if (!meshRef.current) return;
        const positionAttr = meshRef.current.geometry.attributes.position;
        if (!positionAttr) return;
        const positions = positionAttr.array as Float32Array;
        for (let i = 0; i < count; i++) {
            positions[i * 3 + 1] -= particles.velocities[i];
            if (positions[i * 3 + 1] < -25) {
                positions[i * 3 + 1] = 25;
            }
        }
        positionAttr.needsUpdate = true;

        if (materialRef.current && typeof document !== 'undefined') {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'red';
            const hex = themeHexMap[currentTheme] || '#ef4444';
            materialRef.current.color.set(hex);
        }
    });

    return (
        <points ref={meshRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={particles.positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                ref={materialRef}
                size={0.05}
                color="#ef4444"
                transparent
                opacity={0.5}
                sizeAttenuation
            />
        </points>
    );
};

const CyberCssFallback = () => (
    <div className="fixed inset-0 bg-black pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsla(var(--theme-color),0.12)_0%,transparent_75%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px]" />
    </div>
);

const CyberBackground = () => {
    const isMobile = typeof window !== 'undefined' && (
        window.innerWidth <= 768 ||
        (window.matchMedia && window.matchMedia('(hover: none) and (pointer: coarse)').matches)
    );

    if (isMobile) {
        return <CyberCssFallback />;
    }

    return (
        <div id="canvas-container">
            <WebGLErrorBoundary fallback={<CyberCssFallback />}>
                <Canvas
                    camera={{ position: [0, 5, 20], fov: 75 }}
                    gl={{ powerPreference: 'low-power', antialias: false, failIfMajorPerformanceCaveat: false }}
                    onCreated={({ gl }) => {
                        gl.setClearColor('#000000', 0);
                    }}
                >
                    <ambientLight intensity={0.5} />
                    <ParticleField />
                </Canvas>
            </WebGLErrorBoundary>
        </div>
    );
};

export default CyberBackground;

