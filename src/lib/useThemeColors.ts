import { useState, useEffect } from 'react';

export interface ThemeColors {
  themeId: string;
  primary: string;
  secondary: string;
  rgbaPrimary: (opacity?: number) => string;
  rgbaSecondary: (opacity?: number) => string;
}

export const THEME_COLOR_MAP: Record<string, { primary: string; secondary: string; r: number; g: number; b: number; r2: number; g2: number; b2: number }> = {
  red: { primary: '#ef4444', secondary: '#f87171', r: 239, g: 68, b: 68, r2: 248, g2: 113, b2: 113 },
  blue: { primary: '#3b82f6', secondary: '#60a5fa', r: 59, g: 130, b: 246, r2: 96, g2: 165, b2: 250 },
  green: { primary: '#10b981', secondary: '#34d399', r: 16, g: 185, b: 129, r2: 52, g2: 211, b2: 153 },
  purple: { primary: '#a855f7', secondary: '#c084fc', r: 168, g: 85, b: 247, r2: 192, g2: 132, b2: 252 },
  yellow: { primary: '#f59e0b', secondary: '#fbbf24', r: 245, g: 158, b: 11, r2: 251, g2: 191, b2: 36 },
  neon: { primary: '#ec4899', secondary: '#f472b6', r: 236, g: 72, b: 153, r2: 244, g2: 114, b2: 182 },
  midnight: { primary: '#06b6d4', secondary: '#22d3ee', r: 6, g: 182, b: 212, r2: 34, g2: 211, b2: 238 },
  phantom: { primary: '#f43f5e', secondary: '#fb7185', r: 244, g: 63, b: 94, r2: 251, g2: 113, b2: 133 },
  rainbow: { primary: '#ec4899', secondary: '#8b5cf6', r: 236, g: 72, b: 153, r2: 139, g2: 92, b2: 246 },
};

export function useThemeColors(): ThemeColors {
  const [themeId, setThemeId] = useState<string>(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.getAttribute('data-theme') || localStorage.getItem('sowmiyan-portfolio-theme') || 'red';
    }
    return 'red';
  });

  useEffect(() => {
    const updateTheme = () => {
      const current = document.documentElement.getAttribute('data-theme') || localStorage.getItem('sowmiyan-portfolio-theme') || 'red';
      setThemeId(current);
    };

    updateTheme();

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'attributes' && m.attributeName === 'data-theme') {
          updateTheme();
        }
      }
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    window.addEventListener('theme-change', updateTheme);

    return () => {
      observer.disconnect();
      window.removeEventListener('theme-change', updateTheme);
    };
  }, []);

  const config = THEME_COLOR_MAP[themeId] || THEME_COLOR_MAP.red;

  return {
    themeId,
    primary: config.primary,
    secondary: config.secondary,
    rgbaPrimary: (opacity = 1) => `rgba(${config.r}, ${config.g}, ${config.b}, ${opacity})`,
    rgbaSecondary: (opacity = 1) => `rgba(${config.r2}, ${config.g2}, ${config.b2}, ${opacity})`,
  };
}
