import { ReactNode, Suspense, lazy } from 'react';
import SmoothScroll from '@/components/SmoothScroll';
import HUDOverlay from '@/components/HUDOverlay';
import ThemeAndEasterEgg from '@/components/ThemeAndEasterEgg';
import MysteryButterfly from '@/components/MysteryButterfly';
import GradualBlur from '@/components/GradualBlur';
import TargetCursor from '@/components/TargetCursor';

// Lazy-load heavy background layers so first paint is HTML, not WebGL.
const CyberBackground = lazy(() => import('@/components/CyberBackground'));
const ImageBackground = lazy(() => import('@/components/ImageBackground'));

/**
 * Persistent app shell. Mounted once above <Routes>, so switching pages
 * never remounts the WebGL canvas or image background.
 */
const SiteLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <TargetCursor 
        spinDuration={2}
        hideDefaultCursor={true}
        parallaxOn={true}
        cursorColor="#ef4444"
        cursorColorOnTarget="#ffffff"
      />
      <SmoothScroll />
      <Suspense fallback={null}>
        <CyberBackground />
        <ImageBackground />
      </Suspense>
      <HUDOverlay />
      <ThemeAndEasterEgg />
      <MysteryButterfly />



      <div className="relative z-10 w-full min-h-screen">
        {children}
      </div>
    </>
  );
};

export default SiteLayout;

