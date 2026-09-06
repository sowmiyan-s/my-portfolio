import React, { memo } from 'react';
import { useThemeColors } from '@/lib/useThemeColors';

/**
 * UIverse-inspired Cyber Matrix Grid Background
 * Provides high-visibility, razor-sharp technical grid lines with glowing
 * theme intersection dots and atmospheric glow flares across the entire viewport.
 */
const CyberGridBackground: React.FC = memo(() => {
  const { rgbaPrimary } = useThemeColors();

  return (
    <div 
      className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Deep true dark background foundation */}
      <div className="absolute inset-0 bg-[#070709]" />

      {/* Primary Cyber Grid: 36px clean visible tech lines */}
      <div 
        className="absolute inset-0 opacity-100"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.065) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.065) 1px, transparent 1px)
          `,
          backgroundSize: '36px 36px',
        }}
      />

      {/* Major Division Cyber Accent Lines: Every 180px (5x5 blocks) */}
      <div 
        className="absolute inset-0 opacity-100"
        style={{
          backgroundImage: `
            linear-gradient(to right, ${rgbaPrimary(0.22)} 1.5px, transparent 1.5px),
            linear-gradient(to bottom, ${rgbaPrimary(0.22)} 1.5px, transparent 1.5px)
          `,
          backgroundSize: '180px 180px',
        }}
      />

      {/* Glowing Theme Matrix Intersection Dots at each 36px vertex */}
      <div
        className="absolute inset-0 opacity-100"
        style={{
          backgroundImage: `radial-gradient(circle, ${rgbaPrimary(0.6)} 1.5px, transparent 1.5px)`,
          backgroundSize: '36px 36px',
          backgroundPosition: '0 0',
        }}
      />

      {/* Atmospheric Theme Volumetric Spotlights (UIverse Aurora / Glow effect) */}
      <div 
        className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[450px] rounded-full blur-[140px] pointer-events-none opacity-25"
        style={{ background: rgbaPrimary(0.6) }}
      />
      <div 
        className="absolute top-[50%] -right-20 w-[600px] h-[600px] rounded-full blur-[150px] pointer-events-none opacity-20"
        style={{ background: rgbaPrimary(0.5) }}
      />
      <div 
        className="absolute top-[80%] -left-20 w-[700px] h-[700px] rounded-full blur-[160px] pointer-events-none opacity-20"
        style={{ background: rgbaPrimary(0.4) }}
      />

      {/* Edge Vignette Mask for high-contrast focus */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.8)_100%)] pointer-events-none" />
    </div>
  );
});

CyberGridBackground.displayName = 'CyberGridBackground';
export default CyberGridBackground;
