import { ReactNode, Suspense, lazy } from 'react';
import SmoothScroll from '@/components/SmoothScroll';
import HUDOverlay from '@/components/HUDOverlay';
import ThemeAndEasterEgg from '@/components/ThemeAndEasterEgg';
import MysteryButterfly from '@/components/MysteryButterfly';
import GradualBlur from '@/components/GradualBlur';
import CouncilCursor from '@/components/CouncilCursor';

const SiteLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <CouncilCursor size={38} />
      <SmoothScroll />
      <HUDOverlay />
      <ThemeAndEasterEgg />
      <MysteryButterfly />



      <main id="main-content" className="relative z-10 w-full min-h-screen">
        {children}
      </main>
    </>
  );
};

export default SiteLayout;

