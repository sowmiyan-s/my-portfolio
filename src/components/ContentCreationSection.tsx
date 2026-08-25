import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { fetchChannelVideos, YouTubeVideo } from '@/lib/youtube';
import ScrambleText from './ScrambleText';
import { Instagram, Youtube, Linkedin, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';

const socialIcons: Record<string, any> = {
    Instagram: Instagram,
    YouTube: Youtube,
    LinkedIn: Linkedin
};

const ContentCreationSection = () => {
    const links = [
        { name: "Instagram", url: "https://instagram.com/sowmiyan.s_", desc: "Studio Logs" },
        { name: "YouTube", url: "https://youtube.com/@bound-by-code", desc: "Bound By Code Channel" },
        { name: "LinkedIn", url: "https://linkedin.com/in/sowmiyan-s", desc: "Professional Network" }
    ];

    const [videos, setVideos] = useState<YouTubeVideo[]>([]);
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        (async () => {
            try {
                const fetched = await fetchChannelVideos();
                setVideos(fetched);
            } catch (err) {
                console.warn("Failed to load channel videos:", err);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    useEffect(() => {
        if (scrollRef.current && videos.length > 0) {
            const el = scrollRef.current;
            const setWidth = el.scrollWidth / 6;
            if (el.scrollLeft === 0 && setWidth > 0) {
                el.scrollLeft = setWidth * 2;
            }
        }
    }, [videos]);

    const handleScroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const el = scrollRef.current;
            const { scrollLeft, clientWidth, scrollWidth } = el;
            const scrollAmount = clientWidth * 0.75;
            const setWidth = scrollWidth / 6;

            if (direction === 'right') {
                let currentPos = scrollLeft;
                if (currentPos + scrollAmount >= setWidth * 4) {
                    currentPos = currentPos - (setWidth * 2);
                    el.scrollLeft = currentPos;
                }
                el.scrollTo({
                    left: currentPos + scrollAmount,
                    behavior: 'smooth'
                });
            } else {
                let currentPos = scrollLeft;
                if (currentPos - scrollAmount <= setWidth) {
                    currentPos = currentPos + (setWidth * 2);
                    el.scrollLeft = currentPos;
                }
                el.scrollTo({
                    left: currentPos - scrollAmount,
                    behavior: 'smooth'
                });
            }
        }
    };

    const duplicated = videos.length ? [...videos, ...videos, ...videos, ...videos, ...videos, ...videos] : [];
    const durationSeconds = Math.max(videos.length * 6, 45);

    return (
        <section className="relative py-12 md:py-20 bg-transparent z-10 overflow-hidden w-full">
            <div className="flex flex-col gap-8 md:gap-12 items-center w-full">
                <div className="flex flex-col gap-4 md:gap-6 w-full max-w-7xl mx-auto px-4 sm:px-6 items-center text-center relative z-10">
                    <h2 className="text-4xl sm:text-6xl md:text-8xl font-heading font-black text-white uppercase tracking-tighter leading-none">
                        <ScrambleText text="Bound By Code" triggerOnView speed={0.22} />
                    </h2>
                    <p className="font-mono text-xs sm:text-sm text-white/80 max-w-xl">
                        <ScrambleText text="Tamil-language AI, vibe-coding and developer tutorials." triggerOnView speed={0.2} />
                    </p>
                </div>

                {loading ? (
                    <div className="w-full flex overflow-hidden py-4 justify-center">
                        <div className="flex gap-4 md:gap-6 px-4 animate-pulse">
                            {[1, 2, 3].map((n) => (
                                <div key={n} className="w-[260px] sm:w-[320px] md:w-[380px] flex flex-col gap-3 border border-white/5 bg-black/40 p-4 rounded-xl">
                                    <div className="aspect-[16/9] bg-white/5 rounded-lg" />
                                    <div className="h-4 bg-white/5 w-3/4" />
                                </div>
                            ))}
                        </div>
                    </div>
                ) : videos.length === 0 ? (
                    <div className="w-full flex justify-center items-center py-16 border border-white/10 bg-black/60 text-xs font-mono text-white/50 uppercase tracking-widest">
                        No videos available right now
                    </div>
                ) : (
                    <div className="w-full flex flex-col gap-4 relative z-10">
                        {/* Scroll Controls bar */}
                        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 flex items-center justify-between">
                            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/50">
                                Swipe or Use Arrows ({videos.length} Videos)
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleScroll('left')}
                                    aria-label="Scroll left"
                                    className="p-2 border border-white/10 bg-black/60 hover:border-red-500 hover:text-red-500 text-white/70 transition-colors rounded-sm"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <button
                                    onClick={() => handleScroll('right')}
                                    aria-label="Scroll right"
                                    className="p-2 border border-white/10 bg-black/60 hover:border-red-500 hover:text-red-500 text-white/70 transition-colors rounded-sm"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Interactive Marquee Container */}
                        <div className="w-full flex overflow-x-auto no-scroll relative group py-2 md:py-4 z-10 scroll-smooth" ref={scrollRef}>
                            <div className="absolute left-0 top-0 bottom-0 w-8 md:w-24 bg-gradient-to-r from-black to-transparent z-20 pointer-events-none" />
                            <div className="absolute right-0 top-0 bottom-0 w-8 md:w-24 bg-gradient-to-l from-black to-transparent z-20 pointer-events-none" />

                            <div
                                className="animate-youtube-marquee gap-3.5 md:gap-6 px-4"
                                style={{ '--marquee-duration': `${durationSeconds}s` } as React.CSSProperties}
                            >
                                {duplicated.map((video, idx) => (
                                    <a
                                        key={`${video.id}-${idx}`}
                                        href={video.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-shrink-0 w-[80vw] max-w-[300px] sm:w-[340px] md:w-[380px] flex flex-col gap-3 border border-white/10 bg-neutral-950/80 p-4 hover:border-red-600 hover:bg-neutral-950 transition-all group/card rounded-xl shadow-lg"
                                    >
                                        <div className="relative aspect-[16/9] w-full overflow-hidden border border-white/10 rounded-lg">
                                            <img
                                                src={video.thumbnail}
                                                alt={video.title}
                                                loading="lazy"
                                                className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-700"
                                            />
                                        </div>
                                        <h3 className="text-xs md:text-sm font-heading font-black uppercase leading-tight group-hover/card:text-red-500 transition-colors line-clamp-2">
                                            {video.title}
                                        </h3>
                                        <div className="text-[10px] font-mono text-red-500 uppercase mt-auto tracking-widest flex items-center justify-between">
                                            <span>Watch on YouTube</span>
                                            <span>↗</span>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                <div className="w-full px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 relative z-10 max-w-5xl mx-auto">
                    {links.map((link, i) => {
                        const Icon = socialIcons[link.name] || ExternalLink;
                        return (
                            <motion.a
                                key={i}
                                href={link.url}
                                target="_blank"
                                rel="noreferrer"
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.08, duration: 0.4 }}
                                viewport={{ once: true }}
                                className="group relative p-5 md:p-8 border border-white/10 bg-neutral-950/60 backdrop-blur-md rounded-2xl overflow-hidden hover:border-red-500 transition-all duration-300 flex flex-col items-center text-center gap-3 md:gap-4 hover:shadow-[0_0_30px_rgba(239,68,68,0.1)] group/btn"
                            >
                                {/* Futuristic corner decorations */}
                                <span className="absolute top-2 left-2 w-1.5 h-1.5 border-t border-l border-white/30 group-hover:border-red-500 transition-colors" />
                                <span className="absolute top-2 right-2 w-1.5 h-1.5 border-t border-r border-white/30 group-hover:border-red-500 transition-colors" />
                                <span className="absolute bottom-2 left-2 w-1.5 h-1.5 border-b border-l border-white/30 group-hover:border-red-500 transition-colors" />
                                <span className="absolute bottom-2 right-2 w-1.5 h-1.5 border-b border-r border-white/30 group-hover:border-red-500 transition-colors" />
                                
                                {/* Background scanline effect */}
                                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%] opacity-0 group-hover:opacity-40 transition-opacity pointer-events-none" />

                                {/* Social Icon with animated ring */}
                                <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/70 group-hover:text-red-500 group-hover:border-red-500/50 group-hover:scale-110 transition-all duration-300">
                                    <Icon size={18} />
                                    <div className="absolute inset-0 rounded-full border border-transparent group-hover:border-red-500/20 group-hover:animate-ping opacity-60" />
                                </div>

                                <div className="flex flex-col gap-1 z-10">
                                    <h3 className="font-heading uppercase tracking-[0.2em] text-base md:text-lg font-black text-white group-hover:text-red-500 transition-colors">
                                        {link.name}
                                    </h3>
                                    <p className="font-mono text-[9px] opacity-50 uppercase tracking-widest text-white/70 group-hover:opacity-80 transition-opacity">
                                        {link.desc}
                                    </p>
                                </div>
                            </motion.a>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default ContentCreationSection;
