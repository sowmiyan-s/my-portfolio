import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import ScrambleText from './ScrambleText';
import UpvoteButton from './UpvoteButton';

const Hero = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
    const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

    const handleTitleClick = () => {
        try {
            const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            osc.frequency.setValueAtTime(800, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.4);
            gainNode.gain.setValueAtTime(0.04, audioCtx.currentTime);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.4);
        } catch(e){}

        window.dispatchEvent(new CustomEvent('trigger-hud-alert', { 
            detail: { title: "SYSTEM_ACCESS", desc: "MAIN IDENTITY SCRAMBLED // WELCOME SYSTEM OPERATOR." } 
        }));
    };

    return (
        <section id="home" ref={containerRef} className="relative min-h-screen flex items-center justify-start pt-20 pb-12 px-4 md:px-16 overflow-hidden z-10 w-full bg-transparent">
            {/* Background: scanlines */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                {/* Animated Scanlines */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,4px_100%]" />
            </div>
            
            <motion.div style={{ y, opacity }} className="max-w-7xl w-full flex flex-col items-start gap-8 md:gap-12 relative z-20 mt-12 md:mt-16">
                <div className="flex flex-col items-start gap-4 md:gap-6 w-full text-left">
                    <div className="relative w-fit inline-block overflow-hidden">
                        <h1 
                            onClick={handleTitleClick}
                            className="inline-block text-[clamp(2rem,7vw,8rem)] font-heading font-black leading-[1] tracking-tighter text-white uppercase whitespace-nowrap drop-shadow-[0_0_25px_rgba(255,255,255,0.3)] cursor-pointer select-none"
                        >
                            <ScrambleText text="SOWMIYAN S" triggerOnView speed={0.5} delay={0.2} />
                        </h1>
                    </div>

                    <UpvoteButton />

                    
                    <div className="flex flex-wrap justify-start items-center gap-2 md:gap-3 text-[10px] md:text-sm font-mono uppercase tracking-[0.1em] md:tracking-[0.25em] text-red-500 font-bold border border-white/10 bg-white/5 shadow-[0_0_20px_rgba(255,0,0,0.1)] rounded-2xl md:rounded-3xl px-4 py-2 md:px-6 md:py-3 max-w-[85vw] sm:max-w-full">
                        <ScrambleText text="AI Engineer" triggerOnView triggerOnHover delay={0.8} />
                        <span className="text-white/20 font-light">•</span>
                        <ScrambleText text="Software Developer" triggerOnView triggerOnHover delay={1.0} />
                        <span className="text-white/20 font-light">•</span>
                        <ScrambleText text="Freelancer" triggerOnView triggerOnHover delay={1.2} />
                        <span className="text-white/20 font-light">•</span>
                        <ScrambleText text="Content Creator" triggerOnView triggerOnHover delay={1.4} />
                    </div>
 
                    <div className="text-xs md:text-base leading-relaxed font-mono mt-2 max-w-xl md:max-w-2xl text-white/90 border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.08)] rounded-2xl md:rounded-3xl p-4 md:p-5 max-w-[90vw] sm:max-w-full">
                        <ScrambleText
                          text="Final-year B.Tech AI & Data Science student. Building LLM applications, multi-agent systems and production-ready web apps."
                          triggerOnView
                          speed={0.2}
                          delay={1.6}
                        />
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default Hero;
