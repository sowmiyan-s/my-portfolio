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
        <div className="py-40 flex flex-col items-center justify-center gap-12 bg-black border-y border-white/5">
            <RadarLoader />
            <p className="font-mono text-[10px] uppercase tracking-[1em] text-red-600 animate-pulse text-center">Interpreting_Global_Feeds</p>
        </div>
    );

    const activePosts = posts.length > 0 ? posts : fallbackMediumPosts;
    const duplicatedPosts = [...activePosts, ...activePosts, ...activePosts, ...activePosts, ...activePosts, ...activePosts];
    const durationSeconds = Math.max(activePosts.length * 6, 45);

    return (
        <section id="blog" className="relative py-32 bg-transparent border-y border-white/10 z-10 overflow-hidden">
            <div className="w-full flex flex-col gap-12">
                <div className="px-6 flex justify-between items-end border-b border-white/20 pb-8 max-w-7xl mx-auto w-full flex-wrap gap-4">
                    <div className="flex flex-col gap-2">
                        <span className="text-[10px] font-mono text-red-500 uppercase tracking-[0.4em]">Written Insights</span>
                        <h2 className="text-4xl md:text-6xl font-heading font-black text-white uppercase tracking-tighter flex">
                            <ScrambleText text="My Articles" speed={0.5} delay={0.2} />
                        </h2>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 hidden sm:inline-block mr-2">
                            Hover to Pause · Arrows to Browse
                        </span>
                        <button
                            onClick={() => handleScroll('left')}
                            aria-label="Scroll left"
                            className="p-2.5 border border-white/10 bg-black/60 hover:border-red-500 hover:text-red-500 text-white/70 transition-colors rounded-sm"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <button
                            onClick={() => handleScroll('right')}
                            aria-label="Scroll right"
                            className="p-2.5 border border-white/10 bg-black/60 hover:border-red-500 hover:text-red-500 text-white/70 transition-colors rounded-sm"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>

                <div className="w-full flex overflow-x-auto no-scroll relative group py-4 z-10 scroll-smooth" ref={scrollRef}>
                    <div className="absolute left-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-r from-black to-transparent z-20 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-l from-black to-transparent z-20 pointer-events-none" />
                    
                    <div 
                        className="animate-youtube-marquee gap-4 md:gap-8 px-4"
                        style={{ '--marquee-duration': `${durationSeconds}s` } as React.CSSProperties}
                    >
                        {duplicatedPosts.map((post, i) => (
                            <a 
                                key={i}
                                href={post.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-shrink-0 w-[280px] md:w-[400px] flex flex-col gap-4 border border-white/10 p-5 bg-black/60 hover:border-red-600 hover:bg-neutral-950 transition-all group cursor-pointer rounded-xl shadow-lg"
                            >
                                <div className="relative aspect-[16/9] w-full overflow-hidden border border-white/10 rounded-lg">
                                    <img 
                                        src={post.thumbnail} 
                                        alt={post.title} 
                                        loading="lazy"
                                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                                    />
                                    <div className="absolute top-2 left-2 text-[8px] font-mono text-white bg-red-600 px-2.5 py-1 uppercase tracking-widest rounded-sm font-bold shadow-md">
                                        {post.categories[0] || 'ARTICLE'}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 flex-grow mt-2">
                                    <h3 className="text-xs md:text-sm font-heading font-black uppercase leading-[1.3] group-hover:text-red-500 transition-colors line-clamp-2">
                                        {post.title}
                                    </h3>
                                    <p className="text-[10px] font-mono text-white/70 leading-relaxed line-clamp-2">
                                        {stripHtml(post.description)}
                                    </p>
                                </div>
                                <div className="text-[9px] font-mono text-red-500 uppercase mt-auto tracking-widest bg-red-600/10 px-3 py-1.5 flex items-center justify-between border border-red-600/20 group-hover:bg-red-600 group-hover:text-white transition-colors rounded-sm">
                                   <span>READ_ARTICLE</span>
                                   <span>↗</span>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>

                <div className="flex justify-center pt-4 px-6">
                    <a 
                        href="https://medium.com/@sowmiyan_s_" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-10 py-3.5 border border-red-600 text-xs font-mono font-bold uppercase tracking-[0.2em] bg-red-600/10 hover:bg-red-600 hover:text-white transition-all text-red-500 group flex gap-3 items-center rounded-sm shadow-lg"
                    >
                        <span>Access Medium Profile</span>
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </a>
                </div>
            </div>
        </section>
    );
};

export default BlogSection;
