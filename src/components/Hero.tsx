import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Mail, FileText, MapPin } from 'lucide-react';
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

    const y = useTransform(scrollYProgress, [0, 1], [0, 100]);
    const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
    const bgOpacity = useTransform(scrollYProgress, [0, 0.85, 1], [1, 0.4, 0]);
    const bgY = useTransform(scrollYProgress, [0, 1], [0, 50]);
    const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.04]);

    return (
        <section 
            id="home" 
            ref={containerRef} 
            className="relative min-h-[92vh] md:min-h-screen flex items-center justify-start pt-20 sm:pt-24 md:pt-28 pb-10 sm:pb-16 px-4 sm:px-8 md:px-12 overflow-hidden z-10 w-full bg-transparent"
        >
            {/* Full-bleed Hero Photo Background on all devices */}
            <motion.div 
                className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none"
                style={isMobile ? undefined : { opacity: bgOpacity }}
            >
                <motion.img
                    src="/bg-image.png"
                    alt="Sowmiyan S Hero"
                    aria-hidden="true"
                    decoding="async"
                    style={isMobile ? undefined : { y: bgY, scale: bgScale }}
                    className="w-full h-full object-cover object-[74%_18%] md:object-right opacity-100 select-none"
                />

                {/* Left gradient: soft on mobile so photo remains vibrant, wider on desktop */}
                <div className="absolute inset-y-0 left-0 w-full md:w-3/5 bg-gradient-to-r from-black/60 via-black/20 to-transparent md:from-black/85 md:via-black/40 pointer-events-none" />

                {/* Seamless Bottom Fade to merge into the next section */}
                <div className="absolute bottom-0 inset-x-0 h-28 md:h-44 bg-gradient-to-t from-[#070709] via-[#070709]/70 to-transparent pointer-events-none" />
            </motion.div>
            
            {/* Hero Content Container */}
            <motion.div 
                style={isMobile ? undefined : { y, opacity }} 
                className="max-w-5xl w-full min-h-[80vh] md:min-h-0 flex flex-col justify-between md:justify-start items-start gap-4 sm:gap-6 relative z-20 mt-1 md:mt-6"
            >
                {/* Top Section: Badges & Headings */}
                <div className="flex flex-col items-start gap-3 sm:gap-4">
                    {/* Identity & Status Badges */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-black/60 border border-white/15 text-white/85 text-[11px] sm:text-xs font-mono backdrop-blur-md">
                            <MapPin className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-red-500" />
                            <span>Namakkal, Tamil Nadu</span>
                        </div>

                        <UpvoteButton />
                    </div>

                    {/* Hero Title */}
                    <div className="flex flex-col gap-1 sm:gap-2">
                        <h1 className="text-[clamp(2.3rem,8vw,5.8rem)] font-heading font-black leading-[1.05] uppercase tracking-tight text-white select-none drop-shadow-lg">
                            <ScrambleText text="SOWMIYAN S" triggerOnView speed={0.4} delay={0.1} />
                        </h1>
                        
                        <p className="text-xs sm:text-base md:text-lg font-mono text-red-500 font-bold uppercase tracking-wider drop-shadow-md">
                            AI Engineer & Full-Stack Developer
                        </p>
                    </div>
                </div>

                {/* Compact Glass Bio Card (Small on mobile to keep photo visible in background) */}
                <div className="w-full max-w-xl md:max-w-2xl bg-neutral-950/65 md:bg-neutral-950/80 border border-white/10 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 md:p-7 backdrop-blur-md shadow-2xl flex flex-col gap-3 sm:gap-4">
                    <p className="text-xs sm:text-sm md:text-base leading-relaxed text-white/90 font-sans">
                        Final-year B.Tech AI & Data Science engineer building autonomous AI agents, multi-agent workflows, and production-grade full-stack web platforms with a focus on real-world engineering and performance.
                    </p>

                    {/* Action Hub CTAs - Compact on mobile */}
                    <div className="pt-2.5 sm:pt-3 border-t border-white/10 flex flex-wrap items-center gap-2 sm:gap-3">
                        <Link
                            to="/projects"
                            className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl bg-red-600 hover:bg-white hover:text-black text-white font-mono text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-md active:scale-95"
                        >
                            <span>Explore Projects</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>

                        <Link
                            to="/contact"
                            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl bg-white/5 hover:bg-white/15 border border-white/15 text-white/90 font-mono text-[11px] sm:text-xs font-semibold uppercase tracking-wider transition-all duration-200 active:scale-95"
                        >
                            <Mail className="w-3.5 h-3.5" />
                            <span>Contact</span>
                        </Link>

                        <a
                            href={RESUME_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-white/60 hover:text-red-400 font-mono text-[11px] sm:text-xs uppercase tracking-wider transition-colors ml-auto"
                        >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Resume ↗</span>
                        </a>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default Hero;
