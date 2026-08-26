import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import CyberBackground from '@/components/CyberBackground';
import TechNav from '@/components/TechNav';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      <CyberBackground />
      <TechNav />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6">
        <div className="text-center flex flex-col items-center gap-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <h1 className="text-[10rem] md:text-[16rem] font-heading font-black text-primary/10 leading-none select-none glitch-404">
              404
            </h1>
            <span className="absolute inset-0 flex items-center justify-center text-[10rem] md:text-[16rem] font-heading font-black text-primary leading-none select-none opacity-80 glitch-404-overlay">
              404
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-col gap-4 items-center"
          >
            <span className="text-xs font-mono text-primary uppercase tracking-[0.5em]">[ SIGNAL LOST ]</span>
            <p className="text-sm font-mono text-muted-foreground max-w-md">
              The requested route <span className="text-primary">{location.pathname}</span> does not exist in this system.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Link
              to="/"
              className="inline-block px-10 py-4 bg-primary text-primary-foreground text-xs font-mono font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-[0_0_30px_hsl(var(--primary)/0.3)] rounded-full"
            >
              Back to Home
            </Link>
          </motion.div>

          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="text-[10px] font-mono uppercase tracking-widest"
          >
            ERR::ROUTE_NOT_FOUND // STATUS: 404
          </motion.span>
        </div>
      </div>

      <style>{`
        @keyframes glitch-shift {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(2px, -2px); }
          60% { transform: translate(-1px, -1px); }
          80% { transform: translate(1px, 1px); }
        }
        .glitch-404-overlay {
          animation: glitch-shift 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default NotFound;
