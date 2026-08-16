import React from 'react';
import './ProjectPattern.css';

const ProjectPattern = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0a0a0a]">
      {/* Portfolio Background Image (Crisp & Visible without background effect) */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center pointer-events-none opacity-75"
        style={{ backgroundImage: `url('/assets/bg-image.png')` }}
      />

      {/* Scrollable Content */}
      <div className="relative z-10 w-full">
        {children}
      </div>
    </div>
  );
}

export default ProjectPattern;
