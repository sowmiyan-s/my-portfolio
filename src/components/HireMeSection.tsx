import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import TopographicBackground from './TopographicBackground';
import ScrambleText from './ScrambleText';

const HireMeSection = () => {
    return (
        <section className="relative w-full min-h-[65vh] md:min-h-screen py-16 md:py-24 px-4 sm:px-6 bg-black z-10 flex flex-col items-center justify-center overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                <TopographicBackground />
            </div>

            <div className="relative z-[2] max-w-5xl w-full mx-auto flex flex-col items-center gap-8 md:gap-14 text-center">

                <div className="flex flex-col gap-3 md:gap-4 items-center">
                    <span className="text-[10px] md:text-xs opacity-50 font-mono tracking-[0.4em] uppercase text-white">
                        Open to Opportunities
                    </span>
                    <h2 className="text-4xl sm:text-6xl md:text-8xl lg:text-[7rem] font-heading font-black text-white uppercase tracking-tighter leading-none break-words">
                        Hire Me
                    </h2>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 w-full justify-center max-w-3xl">
                    <motion.a
                        href="mailto:sowmisowmiyan58@gmail.com"
                        whileHover={{ y: -2 }}
                        className="w-full flex-1 px-5 md:px-8 py-4 md:py-5 border border-white/10 bg-white/5 hover:bg-white hover:text-black hover:border-white transition-colors font-heading font-bold uppercase tracking-widest text-xs md:text-sm text-center flex items-center justify-center gap-3 rounded-xl"
                    >
                        <ScrambleText text="Email Direct" triggerOnHover triggerOnView className="text-current" />
                    </motion.a>

                    <motion.a
                        href="https://drive.google.com/file/d/1NmangaAFo0eGT-KAsZi4VWOm6zI-KPk6/view?usp=sharing"
                        target="_blank"
                        rel="noreferrer"
                        whileHover={{ y: -2 }}
                        className="w-full flex-1 px-5 md:px-8 py-4 md:py-5 border border-red-600 bg-red-600 hover:bg-red-700 hover:text-white text-white transition-colors font-heading font-bold uppercase tracking-widest text-xs md:text-sm text-center flex items-center justify-center gap-3 shadow-[0_0_15px_rgba(220,38,38,0.35)] rounded-xl"
                    >
                        <ScrambleText text="View Resume" triggerOnHover triggerOnView className="text-current" />
                    </motion.a>

                    <motion.a
                        href="https://wa.me/919042561295"
                        target="_blank"
                        rel="noreferrer"
                        whileHover={{ y: -2 }}
                        className="w-full flex-1 px-5 md:px-8 py-4 md:py-5 border border-red-600 bg-red-600/10 hover:bg-red-600/20 hover:text-red-400 text-red-500 transition-colors font-heading font-bold uppercase tracking-widest text-xs md:text-sm text-center flex items-center justify-center gap-3 rounded-xl"
                    >
                        <ScrambleText text="WhatsApp" triggerOnHover triggerOnView className="text-current" />
                    </motion.a>
                </div>

                <Link
                    to="/contact"
                    className="text-[10px] md:text-xs font-mono uppercase tracking-[0.4em] text-white/50 hover:text-red-500 transition-colors border-b border-white/10 hover:border-red-500 pb-1"
                >
                    More contact options →
                </Link>
            </div>
        </section>
    );
};

export default HireMeSection;
