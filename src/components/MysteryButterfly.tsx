import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, ExternalLink, Sparkles } from 'lucide-react';

const UDEMY_URL = "https://www.udemy.com/course/master-generative-ai-without-the-tech-overload/?couponCode=UPVOTERS";

const randomPos = () => ({
  x: Math.random() * (window.innerWidth - 80) + 40,
  y: Math.random() * (window.innerHeight - 80) + 40,
});

/** Small SVG butterfly — theme-colored via currentColor */
const ButterflyIcon = ({ size = 23 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 12C10 8 4 4 3 8C2 12 6 14 12 12Z" fill="currentColor" opacity="0.7" />
    <path d="M12 12C10 14 6 20 3 17C0 14 6 12 12 12Z" fill="currentColor" opacity="0.5" />
    <path d="M12 12C14 8 20 4 21 8C22 12 18 14 12 12Z" fill="currentColor" opacity="0.7" />
    <path d="M12 12C14 14 18 20 21 17C24 14 18 12 12 12Z" fill="currentColor" opacity="0.5" />
    <ellipse cx="12" cy="12" rx="0.6" ry="3" fill="currentColor" opacity="0.9" />
    <line x1="12" y1="9" x2="10" y2="6" stroke="currentColor" strokeWidth="0.4" opacity="0.6" />
    <line x1="12" y1="9" x2="14" y2="6" stroke="currentColor" strokeWidth="0.4" opacity="0.6" />
    <circle cx="10" cy="6" r="0.4" fill="currentColor" opacity="0.5" />
    <circle cx="14" cy="6" r="0.4" fill="currentColor" opacity="0.5" />
  </svg>
);

/** Spawn sparkle particles around the caught position */
function spawnCatchSparkles() {
  // Confetti paper animation removed for clean human-centered design
}

const MysteryButterfly = () => {
  const [pos, setPos] = useState(randomPos);
  const [showReward, setShowReward] = useState(false);
  const [caught, setCaught] = useState(false);
  const [visible, setVisible] = useState(false);
  const moveTimeout = useRef<ReturnType<typeof setTimeout>>();
  const appearTimeout = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (localStorage.getItem('sowmiyan-butterfly-caught') === 'true') {
      setCaught(true);
      return;
    }
    const delay = 15000 + Math.random() * 25000;
    appearTimeout.current = setTimeout(() => setVisible(true), delay);
    return () => { if (appearTimeout.current) clearTimeout(appearTimeout.current); };
  }, []);

  const scheduleMove = useCallback(() => {
    if (caught) return;
    const delay = 2000 + Math.random() * 2000;
    moveTimeout.current = setTimeout(() => {
      setPos(randomPos());
      scheduleMove();
    }, delay);
  }, [caught]);

  useEffect(() => {
    if (visible && !caught) scheduleMove();
    return () => { if (moveTimeout.current) clearTimeout(moveTimeout.current); };
  }, [visible, caught, scheduleMove]);

  const handleCatch = () => {
    if (caught) return;
    setCaught(true);
    setShowReward(true);
    localStorage.setItem('sowmiyan-butterfly-caught', 'true');

    spawnCatchSparkles();

    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      [523.25, 659.25, 783.99, 1046.50, 1318.51].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
        gain.gain.setValueAtTime(0.04, ctx.currentTime + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.12 + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.12);
        osc.stop(ctx.currentTime + i * 0.12 + 0.4);
      });
    } catch {}

    window.dispatchEvent(
      new CustomEvent("trigger-hud-alert", {
        detail: { title: "MYSTERY_CAUGHT", desc: "YOU CAUGHT THE MYSTERY BUTTERFLY! A SECRET REWARD AWAITS." },
      })
    );
  };

  if (caught && !showReward) return null;

  return (
    <>
      {/* ── Flying Butterfly ── */}
      <AnimatePresence>
        {visible && !caught && (
          <motion.button
            onClick={handleCatch}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0.6, 1, 0.6],
              scale: 1,
              x: pos.x,
              y: pos.y,
            }}
            exit={{ opacity: 0, scale: 0, transition: { duration: 0.3 } }}
            transition={{
              x: { type: "spring", stiffness: 30, damping: 15, mass: 0.8 },
              y: { type: "spring", stiffness: 30, damping: 15, mass: 0.8 },
              opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" },
              scale: { type: "spring", stiffness: 200, damping: 15 },
            }}
            className="fixed z-[60] text-red-500 hover:text-red-400 transition-colors focus:outline-none group"
            style={{ top: 0, left: 0, cursor: 'pointer' }}
            aria-label="Catch the mystery butterfly"
          >
            <div className="relative butterfly-float">
              <div className="absolute inset-0 rounded-full bg-red-500/20 blur-lg scale-150 group-hover:bg-red-500/40 transition-all" />
              <div className="butterfly-wings relative z-10">
                <ButterflyIcon size={23} />
              </div>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-red-500/60 animate-ping" />
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Reward Modal ── */}
      <AnimatePresence>
        {showReward && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4" data-lenis-prevent="true">
            <motion.div
              initial={{ scale: 0.6, opacity: 0, rotateX: 15 }}
              animate={{ scale: 1, opacity: 1, rotateX: 0 }}
              exit={{ scale: 0.6, opacity: 0, rotateX: -15 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="relative max-w-md w-full overflow-hidden rounded-2xl"
            >
              {/* Animated gradient border wrapper */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-500 via-pink-500 to-purple-600 p-[1px] animate-glow-border">
                <div className="absolute inset-[1px] rounded-2xl bg-[#080808]" />
              </div>

              <div className="relative z-10 bg-[#080808] rounded-2xl overflow-hidden">
                {/* Top hero gradient band */}
                <div className="relative h-32 bg-gradient-to-br from-red-600/30 via-pink-600/20 to-purple-600/30 flex items-center justify-center overflow-hidden">
                  {/* Animated floating particles in hero */}
                  <div className="absolute inset-0">
                    {[...Array(12)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 rounded-full bg-white/30"
                        initial={{ x: Math.random() * 400, y: Math.random() * 128 }}
                        animate={{
                          y: [Math.random() * 128, Math.random() * 128],
                          x: [Math.random() * 400, Math.random() * 400],
                          opacity: [0.2, 0.6, 0.2],
                        }}
                        transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, ease: "easeInOut" }}
                      />
                    ))}
                  </div>

                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.3 }}
                    className="relative"
                  >
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500/20 to-pink-500/20 border border-white/10 flex items-center justify-center backdrop-blur-sm shadow-[0_0_40px_rgba(239,68,68,0.3)]">
                      <Gift size={32} className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                    </div>
                    {/* Orbiting sparkle */}
                    <motion.div
                      className="absolute -top-1 -right-1"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles size={14} className="text-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.8)]" />
                    </motion.div>
                  </motion.div>
                </div>

                {/* Content */}
                <div className="px-8 pb-8 pt-6 flex flex-col items-center text-center">
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-xl font-heading font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-pink-400 to-purple-400 uppercase tracking-wider mb-1"
                  >
                    Mystery Caught!
                  </motion.h3>

                  <motion.div
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ delay: 0.5 }}
                    className="h-[1px] w-24 bg-gradient-to-r from-transparent via-red-500/50 to-transparent mb-4"
                  />

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.55 }}
                    className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-mono font-bold mb-5"
                  >
                    You found the hidden butterfly
                  </motion.p>

                  {/* Course Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.65 }}
                    className="w-full bg-gradient-to-br from-white/[0.04] to-white/[0.02] border border-white/10 rounded-xl p-5 mb-6 text-left hover:border-white/20 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[8px] font-mono font-bold text-red-500 uppercase tracking-widest px-2 py-0.5 bg-red-500/10 border border-red-500/20 rounded-full">
                        FREE COURSE
                      </span>
                      <span className="text-[8px] font-mono text-green-400 uppercase tracking-widest">
                        ✓ COUPON APPLIED
                      </span>
                    </div>
                    <h4 className="text-sm text-white font-heading font-bold leading-snug mb-2">
                      Master Generative AI Without the Tech Overload
                    </h4>
                    <p className="text-[10px] text-white/40 leading-relaxed font-mono">
                      A complete course on Generative AI — yours completely free as a reward for your curiosity.
                    </p>
                  </motion.div>

                  {/* CTA Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.85 }}
                    className="w-full flex flex-col gap-2.5"
                  >
                    <a
                      href={UDEMY_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 text-white font-mono text-[11px] font-black uppercase tracking-widest rounded-xl hover:shadow-[0_0_30px_rgba(220,38,38,0.4)] transition-all flex items-center justify-center gap-2 group/btn"
                    >
                      <ExternalLink size={14} className="group-hover/btn:rotate-12 transition-transform" />
                      Claim Free Course
                    </a>
                    <button
                      onClick={() => setShowReward(false)}
                      className="w-full py-2.5 border border-white/10 text-white/40 font-mono text-[9px] uppercase tracking-widest rounded-xl hover:border-white/25 hover:text-white/60 transition-all"
                    >
                      Maybe Later
                    </button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MysteryButterfly;
