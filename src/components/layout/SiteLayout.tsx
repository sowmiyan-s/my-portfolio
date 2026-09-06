import { ReactNode } from 'react';
import SmoothScroll from '@/components/SmoothScroll';
import ThemeAndEasterEgg from '@/components/ThemeAndEasterEgg';
import MysteryButterfly from '@/components/MysteryButterfly';
import CouncilCursor from '@/components/CouncilCursor';

const SiteLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <CouncilCursor size={38} />
      <SmoothScroll />
      <ThemeAndEasterEgg />
      <MysteryButterfly />



      <main id="main-content" className="relative z-10 w-full min-h-screen">
        {children}
      </main>
    </>
  );
};

export default SiteLayout;

