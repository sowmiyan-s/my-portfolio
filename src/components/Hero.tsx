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
        <section id="home" ref={containerRef} className="relative min-h-[90vh] md:min-h-screen flex items-center justify-start pt-24 md:pt-28 pb-12 sm:pb-16 px-4 sm:px-8 md:px-12 overflow-hidden z-10 w-full bg-transparent">
            {/* Hero-Only Photo: Brought to front with full clarity, framed on right, fading out on scroll */}
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
                    className="w-full h-full object-cover object-[70%_center] md:object-right opacity-100 select-none"
                />

                {/* Soft left gradient to ensure text contrast while keeping photo prominent */}
                <div className="absolute inset-y-0 left-0 w-full md:w-3/5 bg-gradient-to-r from-black/85 via-black/40 to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-black/20 md:hidden pointer-events-none" />

                {/* Seamless Bottom Fade to merge cleanly with the scrolling sections */}
                <div className="absolute bottom-0 inset-x-0 h-32 md:h-44 bg-gradient-to-t from-[#070709] via-[#070709]/75 to-transparent pointer-events-none" />
            </motion.div>
            
            <motion.div 
                style={isMobile ? undefined : { y, opacity }} 
                className="max-w-5xl w-full flex flex-col items-start gap-4 sm:gap-6 relative z-20 mt-2 md:mt-6"
            >
                {/* Identity & Status */}
                <div className="flex flex-wrap items-center gap-3">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/80 text-xs font-mono">
                        <MapPin className="w-3.5 h-3.5 text-red-500" />
                        <span>Namakkal, Tamil Nadu</span>
                    </div>

                    <UpvoteButton />
                </div>

                {/* Hero Title */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-[clamp(2.5rem,7vw,5.8rem)] font-heading font-black leading-[1.05] uppercase tracking-tight text-white select-none">
                        <ScrambleText text="SOWMIYAN S" triggerOnView speed={0.4} delay={0.1} />
                    </h1>
                    
                    <p className="text-sm sm:text-base md:text-lg font-mono text-red-500 font-bold uppercase tracking-wider">
                        AI Engineer & Full-Stack Developer
                    </p>
                </div>

                {/* Grounded Bio & Editorial Statement */}
                <div className="w-full max-w-2xl bg-neutral-950/80 border border-white/10 rounded-2xl p-5 sm:p-7 backdrop-blur-xl shadow-xl flex flex-col gap-4">
                    <p className="text-sm sm:text-base leading-relaxed text-white/85 font-sans">
                        Final-year B.Tech AI & Data Science engineer building autonomous AI agents, multi-agent workflows, and production-grade full-stack web platforms with a focus on real-world engineering and performance.
                    </p>

                    {/* Action Hub CTAs */}
                    <div className="pt-3 border-t border-white/10 flex flex-wrap items-center gap-3">
                        <Link
                            to="/projects"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-white hover:text-black text-white font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-md"
                        >
                            <span>Explore Projects</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>

                        <Link
                            to="/contact"
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/15 text-white/90 font-mono text-xs font-semibold uppercase tracking-wider transition-all duration-200"
                        >
                            <Mail className="w-3.5 h-3.5" />
                            <span>Contact</span>
                        </Link>

                        <a
                            href={RESUME_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-white/60 hover:text-red-400 font-mono text-xs uppercase tracking-wider transition-colors ml-auto"
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
