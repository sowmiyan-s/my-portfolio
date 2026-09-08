import React, { useCallback, useEffect, useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchRepos, fallbackRepos, GitHubRepo } from '@/lib/github';
import { fetchHiddenProjectIds } from '@/lib/projectSettings';
import { formatRepoName } from '@/lib/formatRepo';
import { useNavigate } from 'react-router-dom';
import { useRealtimeRefetch } from '@/hooks/useRealtimeRefetch';
import { Github, Star, GitFork } from 'lucide-react';
import AccordionGallery from './AccordionGallery';

const socialImg = (repo: string) =>
    `https://opengraph.githubassets.com/1/sowmiyan-s/${repo}`;

// Strictly show only 3 slides in exact order:
// 1. crewlyze
// 2. guardrag (GUARD-RAG)
// 3. we share (We-Share)
const TARGET_PROJECT_KEYS = ['crewlyze', 'guardrag', 'weshare'] as const;

const normalizeRepoKey = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]/g, '');

const PopularProjectsSlider = () => {
    const [projects, setProjects] = useState<GitHubRepo[]>([]);
    const [loading, setLoading] = useState(true);
    const [index, setIndex] = useState(0);
    const navigate = useNavigate();
    const touchStartX = useRef<number | null>(null);

    const load = useCallback(async () => {
        try {
            const [repos, hidden] = await Promise.all([
                fetchRepos(),
                fetchHiddenProjectIds(),
            ]);
            const visible = repos.filter(r => !hidden.includes(r.id));

            // Map strictly to the 3 target projects in specified order
            const matched: GitHubRepo[] = TARGET_PROJECT_KEYS.map((key) => {
                return (
                    visible.find((r) => normalizeRepoKey(r.name) === key) ||
                    repos.find((r) => normalizeRepoKey(r.name) === key) ||
                    fallbackRepos.find((r) => normalizeRepoKey(r.name) === key)
                );
            }).filter(Boolean) as GitHubRepo[];

            setProjects(matched);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
        window.addEventListener('portfolio-config-changed', load);
        return () => window.removeEventListener('portfolio-config-changed', load);
    }, [load]);
    useRealtimeRefetch(['hidden_projects', 'featured_projects'], load);

    // Auto-advance every 6 seconds on mobile
    useEffect(() => {
        if (projects.length < 2) return;
        const timer = setInterval(() => {
            setIndex((i) => (i + 1) % projects.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [projects.length]);

    // Touch swipe handlers for mobile
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };
    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX.current === null) return;
        const diff = touchStartX.current - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) {
            if (diff > 0) {
                setIndex((i) => (i + 1) % projects.length);
            } else {
                setIndex((i) => (i - 1 + projects.length) % projects.length);
            }
        }
        touchStartX.current = null;
    };

    // Exactly 3 gallery items for the React Bits AccordionGallery
    const galleryItems = useMemo(() => {
        return projects.map((p) => ({
            image: socialImg(p.name),
            label: formatRepoName(p.name),
            link: `/project/${p.name}`,
            alt: formatRepoName(p.name),
            description: p.description,
            language: p.language,
            stars: p.stargazers_count,
            raw: p,
        }));
    }, [projects]);

    if (loading) {
        return (
            <section className="w-full py-16 flex items-center justify-center">
                <p className="text-[10px] font-mono tracking-[0.5em] text-red-500 animate-pulse uppercase">
                    Loading Featured Projects
                </p>
            </section>
        );
    }

    if (!projects.length) return null;

    const current = projects[index] || projects[0];

    return (
        <section
            id="popular-projects"
            className="relative w-full py-8 md:py-20 bg-transparent overflow-hidden"
        >
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[350px] sm:h-[450px] bg-red-600/[0.08] blur-[140px] rounded-full pointer-events-none" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col gap-6 md:gap-8 relative z-10">
                {/* Section Header */}
                <div className="flex items-end justify-between flex-wrap gap-4 border-b border-white/10 pb-4 md:pb-6">
                    <div className="flex flex-col gap-1 md:gap-2">
                        <span className="text-[9px] md:text-[10px] font-mono text-red-500 uppercase tracking-[0.4em]">
                            Featured
                        </span>
                        <h2 className="text-2xl sm:text-4xl md:text-5xl font-heading font-black text-white uppercase tracking-tighter">
                            Popular Projects
                        </h2>
                    </div>

                    <div className="flex items-center flex-wrap gap-3 sm:gap-4">
                        {/* 3 Interactive Project Selector Tabs */}
                        <div className="flex items-center gap-1.5 sm:gap-2">
                            {projects.map((p, i) => (
                                <button
                                    key={p.name}
                                    onClick={() => setIndex(i)}
                                    className={`flex items-center gap-1 sm:gap-1.5 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full font-mono text-[10px] sm:text-xs uppercase tracking-wider transition-all duration-300 ${
                                        i === index
                                            ? 'bg-red-600 text-white font-bold shadow-lg shadow-red-600/30'
                                            : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/10'
                                    }`}
                                >
                                    <span className="text-[9px] opacity-75">0{i + 1}</span>
                                    <span>{formatRepoName(p.name)}</span>
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => navigate('/projects')}
                            className="hidden sm:inline-block text-[11px] sm:text-xs font-mono uppercase tracking-[0.2em] text-white/60 hover:text-red-500 transition-colors border-b border-white/10 hover:border-red-500 pb-0.5"
                        >
                            View all projects →
                        </button>
                    </div>
                </div>

                {/* MOBILE VIEW (Older layout: Full-width Edge-to-Edge Card with slide animation) */}
                <div className="block md:hidden w-full">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={current.id || current.name}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                            className="relative w-full border border-white/15 bg-neutral-950/90 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
                            onTouchStart={handleTouchStart}
                            onTouchEnd={handleTouchEnd}
                        >
                            {/* Full-width GitHub OpenGraph Image (1200:630 Exact Fit) */}
                            <div className="relative w-full aspect-[1200/630] bg-[#0d1117] overflow-hidden border-b border-white/10 flex items-center justify-center">
                                <img
                                    src={socialImg(current.name)}
                                    alt={formatRepoName(current.name)}
                                    loading="eager"
                                    className="w-full h-full object-contain"
                                    onError={(e) => {
                                        (e.currentTarget as HTMLImageElement).src = '/og-image.png';
                                    }}
                                />
                                <div className="absolute top-2.5 left-2.5 bg-red-600 text-white font-mono text-[9px] px-2.5 py-1 uppercase tracking-widest font-bold rounded shadow-md">
                                    PROJECT {String(index + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
                                </div>
                            </div>

                            {/* Project Information & Controls Bar */}
                            <div className="p-4 flex flex-col gap-3.5 bg-black/80 backdrop-blur-md">
                                <div className="flex flex-col gap-1.5">
                                    <h3 className="text-xl font-heading font-black text-white uppercase tracking-tight">
                                        {formatRepoName(current.name)}
                                    </h3>
                                    <p className="text-xs text-white/80 font-mono leading-relaxed line-clamp-3">
                                        {current.description || 'No description available for this project.'}
                                    </p>
                                    <div className="flex flex-wrap gap-2 text-[10px] font-mono mt-1">
                                        {current.language && (
                                            <span className="px-2.5 py-0.5 border border-white/15 bg-white/5 text-white/90 uppercase tracking-wider rounded-md">
                                                {current.language}
                                            </span>
                                        )}
                                        {current.stargazers_count > 0 && (
                                            <span className="px-2.5 py-0.5 border border-white/15 bg-white/5 text-white/90 flex items-center gap-1 rounded-md">
                                                <Star size={10} className="text-yellow-400 fill-yellow-400" /> {current.stargazers_count}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-row items-center gap-2.5 w-full pt-1">
                                    <a
                                        href={current.html_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-red-600 text-white hover:bg-white hover:text-black transition-all font-heading text-xs uppercase tracking-wider rounded-full font-bold shadow-md"
                                    >
                                        <Github size={13} />
                                        <span>GitHub</span>
                                    </a>
                                    <button
                                        onClick={() => navigate(`/project/${current.name}`)}
                                        className="flex-1 px-4 py-2.5 border border-white/20 hover:border-red-600 hover:text-red-500 transition-colors bg-white/5 font-heading text-xs uppercase tracking-wider rounded-full text-center"
                                    >
                                        Details →
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* DESKTOP VIEW: React Bits AccordionGallery with 3 Slides */}
                <div className="hidden md:flex flex-col gap-6 w-full">
                    {/* React Bits AccordionGallery Component */}
                    <div className="w-full">
                        <AccordionGallery
                            items={galleryItems}
                            defaultIndex={index}
                            accentColor="#ef4444"
                            overlayColor="#060010"
                            textColor="#ffffff"
                            height={460}
                            gap={12}
                            radius={16}
                            expandRatio={0.52}
                            trigger="hover"
                            grayscale={true}
                            showLabels={true}
                            parallax={0.5}
                            tilt={8}
                            duration={0.6}
                            ease="power3.out"
                            onActiveChange={(i) => setIndex(i)}
                            onItemClick={(item) => navigate(item.link || `/project/${item.label}`)}
                        />
                    </div>

                    {/* Active Project Information & Action Bar */}
                    {current && (
                        <div className="p-5 sm:p-6 border border-white/15 bg-neutral-950/85 backdrop-blur-md rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-2xl transition-all">
                            <div className="flex flex-col gap-2 max-w-2xl w-full">
                                <div className="flex items-center gap-2.5">
                                    <span className="bg-red-600 text-white font-mono text-[9px] px-2.5 py-0.5 uppercase tracking-widest font-bold rounded shadow-sm">
                                        PROJECT {String(index + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
                                    </span>
                                    <h3 className="text-xl sm:text-2xl font-heading font-black text-white uppercase tracking-tight">
                                        {formatRepoName(current.name)}
                                    </h3>
                                </div>
                                <p className="text-xs sm:text-sm text-white/80 font-mono leading-relaxed line-clamp-2">
                                    {current.description || 'No description available for this project.'}
                                </p>
                                <div className="flex flex-wrap gap-2 text-[10px] font-mono mt-0.5">
                                    {current.language && (
                                        <span className="px-2.5 py-0.5 border border-white/15 bg-white/5 text-white/90 uppercase tracking-wider rounded-md">
                                            {current.language}
                                        </span>
                                    )}
                                    {current.stargazers_count > 0 && (
                                        <span className="px-2.5 py-0.5 border border-white/15 bg-white/5 text-white/90 flex items-center gap-1 rounded-md">
                                            <Star size={11} className="text-yellow-400 fill-yellow-400" /> {current.stargazers_count}
                                        </span>
                                    )}
                                    {current.forks_count > 0 && (
                                        <span className="px-2.5 py-0.5 border border-white/15 bg-white/5 text-white/70 flex items-center gap-1 rounded-md">
                                            <GitFork size={11} className="text-white/60" /> {current.forks_count}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-row items-center gap-3 shrink-0">
                                <a
                                    href={current.html_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center justify-center gap-1.5 px-5 py-2.5 bg-red-600 text-white hover:bg-white hover:text-black transition-all font-heading text-xs uppercase tracking-wider rounded-full font-bold shadow-md shadow-red-600/25 hover:scale-105"
                                >
                                    <Github size={14} />
                                    <span>GitHub</span>
                                </a>
                                <button
                                    onClick={() => navigate(`/project/${current.name}`)}
                                    className="px-5 py-2.5 border border-white/20 hover:border-red-600 hover:text-red-500 transition-colors bg-white/5 font-heading text-xs uppercase tracking-wider rounded-full text-center hover:scale-105"
                                >
                                    Details →
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Mobile View All Link */}
                <div className="flex sm:hidden justify-end pt-1">
                    <button
                        onClick={() => navigate('/projects')}
                        className="text-[11px] font-mono uppercase tracking-[0.2em] text-white/60 hover:text-red-500 transition-colors border-b border-white/10 hover:border-red-500 pb-0.5"
                    >
                        View all projects →
                    </button>
                </div>
            </div>
        </section>
    );
};

export default PopularProjectsSlider;
