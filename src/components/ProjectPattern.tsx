import React from 'react';
import './ProjectPattern.css';
import DotField from './DotField';
import { useThemeColors } from '@/lib/useThemeColors';

const ProjectPattern = ({ children }: { children?: React.ReactNode }) => {
  const { rgbaPrimary, rgbaSecondary } = useThemeColors();

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0a0a0a]">
      {/* React Bits DotField Interactive Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <DotField 
          dotRadius={2}
          dotSpacing={16}
          bulgeStrength={75}
          glowRadius={220}
          sparkle={true}
          waveAmplitude={2}
          gradientFrom={rgbaPrimary(0.7)}
          gradientTo={rgbaSecondary(0.4)}
          glowColor={rgbaPrimary(0.45)}
        />
      </div>

      {/* Scrollable Content */}
      <div className="relative z-10 w-full">
        {children}
      </div>
    </div>
  );
};

export default ProjectPattern;
