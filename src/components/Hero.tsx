import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Mail, FileText, MapPin, Briefcase, Sparkles, CheckCircle2 } from 'lucide-react';
import ScrambleText from './ScrambleText';
import UpvoteButton from './UpvoteButton';

const RESUME_URL = "https://drive.google.com/file/d/1NmangaAFo0eGT-KAsZi4VWOm6zI-KPk6/view?usp=sharing";

const Hero = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const isMobile = typeof window !== 'undefined' && (
        window.innerWidth <= 768 ||
        (window.matchMedia && window.matchMedia('(hover: none) and (pointer: coarse)').matches)
    );

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
            detail: { title: "PROFILE_ACCESSED", desc: "WELCOME! SOWMIYAN S — AI & FULL-STACK DEVELOPER." } 
        }));
    };

    return (
        <section id="home" ref={containerRef} className="relative min-h-screen flex items-center justify-start pt-24 md:pt-28 pb-16 px-4 sm:px-8 md:px-16 overflow-hidden z-10 w-full bg-transparent">
            {/* Ambient Background Grid Effect */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:32px_32px]" />
            </div>
            
            <motion.div 
                style={isMobile ? undefined : { y, opacity }} 
                className="max-w-7xl w-full flex flex-col items-start gap-4 sm:gap-6 relative z-20 mt-2 md:mt-8"
            >
                {/* Hero Title Container with Silver Metallic Shimmer across full name */}
                <div className="relative w-full max-w-5xl overflow-visible">
                    <h1 
                        onClick={handleTitleClick}
                        className="relative flex flex-wrap items-baseline text-[clamp(2.5rem,7.5vw,7rem)] font-heading font-black leading-[1.08] uppercase cursor-pointer select-none tracking-tight sm:tracking-normal group"
                        title="Click to interact"
                    >
                        <span className="inline-block silver-shimmer-text drop-shadow-[0_0_35px_rgba(255,255,255,0.4)] transition-transform duration-300 group-hover:scale-[1.01]">
                            <ScrambleText text="SOWMIYAN S" triggerOnView speed={0.4} delay={0.15} />
                        </span>
                    </h1>

                    {/* Location & Upvote Button directly under Name */}
                    <div className="flex flex-wrap items-center gap-3 mt-3 text-xs font-mono">
                        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/15 text-white/80 backdrop-blur-md shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:border-white/30 transition-colors">
                            <MapPin className="w-3.5 h-3.5 text-red-500" />
                            <span>Namakkal, Tamil Nadu</span>
                        </div>

                        <UpvoteButton />
                    </div>
                </div>

                {/* Professional Role Badges */}
                <div className="w-full max-w-4xl flex flex-wrap items-center gap-2 sm:gap-2.5 pt-1">
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-red-950/30 border border-red-500/40 text-red-400 font-mono text-[11px] sm:text-xs font-semibold tracking-wide backdrop-blur-md shadow-[0_0_20px_rgba(239,68,68,0.15)]">
                        <Sparkles className="w-3.5 h-3.5 text-red-400" />
                        <ScrambleText text="AI Engineer" triggerOnView triggerOnHover delay={0.6} />
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/15 text-white/90 font-mono text-[11px] sm:text-xs font-semibold tracking-wide backdrop-blur-md hover:border-white/40 hover:text-white transition-colors">
                        <ScrambleText text="Software Developer" triggerOnView triggerOnHover delay={0.8} />
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/15 text-white/90 font-mono text-[11px] sm:text-xs font-semibold tracking-wide backdrop-blur-md hover:border-white/40 hover:text-white transition-colors">
                        <ScrambleText text="Freelancer" triggerOnView triggerOnHover delay={1.0} />
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/15 text-white/90 font-mono text-[11px] sm:text-xs font-semibold tracking-wide backdrop-blur-md hover:border-white/40 hover:text-white transition-colors">
                        <ScrambleText text="Content Creator" triggerOnView triggerOnHover delay={1.2} />
                    </div>
                </div>

                {/* Simple, Clean Description Card with Silver Shine Screening Sweep */}
                <div className="silver-shine-card w-full max-w-2xl bg-gradient-to-b from-white/[0.07] to-black/60 border border-white/15 hover:border-white/30 rounded-2xl md:rounded-3xl p-4 sm:p-6 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] transition-all duration-300">
                    <p className="relative z-10 text-xs sm:text-sm md:text-base leading-relaxed text-white/90 font-mono font-normal">
                        Final-year B.Tech AI & Data Science student. Building LLM applications, multi-agent systems and production-ready web apps.
                    </p>

                    {/* Action Buttons */}
                    <div className="relative z-10 mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center gap-3">
                        <Link
                            to="/contact"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_25px_rgba(220,38,38,0.6)] transition-all duration-200"
                        >
                            <Mail className="w-3.5 h-3.5" />
                            <span>Contact Me</span>
                        </Link>

                        <Link
                            to="/projects"
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/40 text-white/90 hover:text-white font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200"
                        >
                            <span>Projects</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>

                        <a
                            href={RESUME_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-white/60 hover:text-red-400 font-mono text-xs uppercase tracking-wider transition-colors ml-auto"
                        >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Resume</span>
                        </a>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default Hero;
