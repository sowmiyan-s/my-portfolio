import React, { useEffect, useState, useRef } from 'react';
import { fetchMediumPosts, MediumPost } from '@/lib/medium';
import RadarLoader from './RadarLoader';
import ScrambleText from './ScrambleText';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const fallbackMediumPosts: MediumPost[] = [
    {
        title: "Building Intelligent Autonomous Agents with Antigravity and Claude",
        pubDate: "2026-05-15",
        link: "https://medium.com/@sowmiyan_s_",
        guid: "fallback-1",
        author: "Sowmiyan S",
        thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80",
        description: "A deep dive into building agentic workflows using modern AI tools and local IDE integrations.",
        categories: ["AI & TECH"]
    },
    {
        title: "Vibe Coding: The Next Paradigm Shift in Software Development",
        pubDate: "2026-04-10",
        link: "https://medium.com/@sowmiyan_s_",
        guid: "fallback-2",
        author: "Sowmiyan S",
        thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80",
        description: "Exploring how natural language interfaces and agentic pair programming are transforming engineering.",
        categories: ["VIBE CODING"]
    },
    {
        title: "Mastering Langflow & RAG Systems for Real-World Applications",
        pubDate: "2026-03-01",
        link: "https://medium.com/@sowmiyan_s_",
        guid: "fallback-3",
        author: "Sowmiyan S",
        thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80",
        description: "Step-by-step architectural breakdown of Retrieval-Augmented Generation using vector databases.",
        categories: ["AI ARCHITECTURE"]
    }
];

const BlogSection = () => {
    const [posts, setPosts] = useState<MediumPost[]>([]);
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchMediumPosts();
                setPosts(data.length > 0 ? data : fallbackMediumPosts);
            } catch (e) {
                setPosts(fallbackMediumPosts);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    useEffect(() => {
        if (scrollRef.current && posts.length > 0) {
            const el = scrollRef.current;
            const setWidth = el.scrollWidth / 6;
            if (el.scrollLeft === 0 && setWidth > 0) {
                el.scrollLeft = setWidth * 2;
            }
        }
    }, [posts]);

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

    const stripHtml = (html: string) => {
        try {
            if (typeof DOMParser === 'undefined') return html;
            const doc = new DOMParser().parseFromString(html, 'text/html');
            return doc.body.textContent || "";
        } catch {
            return html;
        }
    };

    if (loading) return (
        <div className="py-32 flex flex-col items-center justify-center gap-6 bg-transparent">
            <RadarLoader />
            <p className="font-mono text-xs uppercase tracking-widest text-white/50 animate-pulse text-center">Loading articles...</p>
        </div>
    );

    const activePosts = posts.length > 0 ? posts : fallbackMediumPosts;
    const duplicatedPosts = [...activePosts, ...activePosts, ...activePosts, ...activePosts, ...activePosts, ...activePosts];
    const durationSeconds = Math.max(activePosts.length * 6, 45);

    return (
        <section id="blog" className="relative py-12 md:py-20 bg-transparent border-y border-white/10 z-10 overflow-hidden">
            <div className="w-full flex flex-col gap-6 md:gap-10">
                <div className="px-4 sm:px-6 flex justify-between items-end border-b border-white/10 pb-4 md:pb-6 max-w-7xl mx-auto w-full flex-wrap gap-4">
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                            <span className="text-[10px] sm:text-xs font-mono text-red-500 font-bold uppercase tracking-[0.3em]">
                                Technical Publications
                            </span>
                        </div>
                        <h2 className="text-2xl sm:text-4xl md:text-5xl font-heading font-black text-white uppercase tracking-tight">
                            <ScrambleText text="Articles & Insights" speed={0.5} delay={0.2} />
                        </h2>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-white/40 hidden sm:inline-block mr-2">
                            Hover to pause · Arrows to browse
                        </span>
                        <button
                            onClick={() => handleScroll('left')}
                            aria-label="Scroll left"
                            className="p-2 sm:p-2.5 border border-white/10 bg-white/5 hover:bg-white/15 hover:border-white/30 text-white/80 transition-colors rounded-lg"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <button
                            onClick={() => handleScroll('right')}
                            aria-label="Scroll right"
                            className="p-2 sm:p-2.5 border border-white/10 bg-white/5 hover:bg-white/15 hover:border-white/30 text-white/80 transition-colors rounded-lg"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>

                <div className="w-full flex overflow-x-auto no-scroll relative group py-2 md:py-4 z-10 scroll-smooth" ref={scrollRef}>
                    <div className="absolute left-0 top-0 bottom-0 w-8 md:w-24 bg-gradient-to-r from-black to-transparent z-20 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-8 md:w-24 bg-gradient-to-l from-black to-transparent z-20 pointer-events-none" />
                    
                    <div 
                        className="animate-youtube-marquee gap-3.5 md:gap-6 px-4"
                        style={{ '--marquee-duration': `${durationSeconds}s` } as React.CSSProperties}
                    >
                        {duplicatedPosts.map((post, i) => (
                            <a 
                                key={i}
                                href={post.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-shrink-0 w-[80vw] max-w-[300px] sm:w-[360px] md:w-[390px] flex flex-col gap-3 md:gap-4 border border-white/10 p-4 md:p-5 bg-neutral-950/80 hover:border-red-500/40 hover:bg-neutral-900/90 transition-all group cursor-pointer rounded-2xl shadow-xl backdrop-blur-md"
                            >
                                <div className="relative aspect-[16/9] w-full overflow-hidden border border-white/10 rounded-xl">
                                    <img 
                                        src={post.thumbnail} 
                                        alt={post.title} 
                                        loading="lazy"
                                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                                    />
                                    <div className="absolute top-2.5 left-2.5 text-[9px] font-mono text-white bg-red-600 px-2.5 py-1 uppercase tracking-wider rounded-md font-bold shadow-md">
                                        {post.categories[0] || 'AI & TECH'}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1.5 md:gap-2 flex-grow mt-1">
                                    <h3 className="text-sm sm:text-base font-heading font-black uppercase leading-snug text-white group-hover:text-red-400 transition-colors line-clamp-2">
                                        {post.title}
                                    </h3>
                                    <p className="text-xs font-sans text-white/70 leading-relaxed line-clamp-2">
                                        {stripHtml(post.description)}
                                    </p>
                                </div>
                                <div className="text-xs font-mono text-red-400 font-semibold uppercase mt-auto tracking-wider pt-3 border-t border-white/10 flex items-center justify-between group-hover:text-white transition-colors">
                                   <span>Read on Medium</span>
                                   <span className="transition-transform group-hover:translate-x-1">→</span>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>

                <div className="flex justify-center pt-2 md:pt-4 px-4 sm:px-6">
                    <a 
                        href="https://medium.com/@sowmiyan_s_" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 border border-white/15 bg-white/5 hover:bg-white/15 hover:border-white/30 text-white font-mono text-xs font-semibold uppercase tracking-wider transition-all rounded-xl shadow-md text-center"
                    >
                        <span>View All Articles on Medium</span>
                        <span>↗</span>
                    </a>
                </div>
            </div>
        </section>
    );
};

export default BlogSection;
