import React from 'react';
import './ProjectPattern.css';
import DotField from './DotField';

const ProjectPattern = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0a0a0a]">
      {/* Portfolio Background Image (Visible) */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center pointer-events-none opacity-60"
        style={{ backgroundImage: `url('/bg-image.png')` }}
      />

      {/* React Bits DotField Interactive Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <DotField 
          dotRadius={2}
          dotSpacing={16}
          bulgeStrength={75}
          glowRadius={220}
          sparkle={true}
          waveAmplitude={2}
          gradientFrom="rgba(239, 68, 68, 0.7)"
          gradientTo="rgba(220, 38, 38, 0.4)"
          glowColor="rgba(239, 68, 68, 0.45)"
        />
      </div>

      {/* Scrollable Content */}
      <div className="relative z-10 w-full">
        {children}
      </div>
    </div>
  );
}

export default ProjectPattern;
