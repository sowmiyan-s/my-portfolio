import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchRepos, GitHubRepo } from '@/lib/github';
import { fetchHiddenProjectIds, fetchHomeFeaturedProjects } from '@/lib/projectSettings';
import { formatRepoName } from '@/lib/formatRepo';
import { useNavigate } from 'react-router-dom';
import { useRealtimeRefetch } from '@/hooks/useRealtimeRefetch';
import { Github, Star } from 'lucide-react';
import Galaxy from './Galaxy';

const socialImg = (repo: string) =>
    `https://opengraph.githubassets.com/1/sowmiyan-s/${repo}`;

const PopularProjectsSlider = () => {
    const [projects, setProjects] = useState<GitHubRepo[]>([]);
    const [loading, setLoading] = useState(true);
    const [index, setIndex] = useState(0);
    const navigate = useNavigate();

    const isMobile = typeof window !== 'undefined' && (
        window.innerWidth <= 768 ||
        (window.matchMedia && window.matchMedia('(hover: none) and (pointer: coarse)').matches)
    );

    const load = useCallback(async () => {
        try {
            const [repos, hidden, featured] = await Promise.all([
                fetchRepos(),
                fetchHiddenProjectIds(),
                fetchHomeFeaturedProjects(),
            ]);
            const featuredIds = featured.map(f => f.id);
            const visible = repos.filter(r => !hidden.includes(r.id));

            let final: GitHubRepo[];
            if (featuredIds.length) {
                final = featuredIds
                    .map((id: number) => visible.find(r => r.id === id))
                    .filter(Boolean) as GitHubRepo[];
            } else {
                final = [...visible]
                    .sort((a, b) => b.stargazers_count - a.stargazers_count)
                    .slice(0, 3);
            }
            setProjects(final);
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

    useEffect(() => {
        if (projects.length < 2) return;
        const t = setInterval(() => setIndex(i => (i + 1) % projects.length), 6000);
        return () => clearInterval(t);
    }, [projects.length]);

    if (loading) {
        return (
            <section className="w-full py-16 flex items-center justify-center">
                <p className="text-[10px] font-mono tracking-[0.5em] text-red-500 animate-pulse uppercase">Loading Featured Projects</p>
            </section>
        );
    }

    if (!projects.length) return null;

    const current = projects[index];

    return (
        <section id="popular-projects" className="relative w-full py-8 md:py-24 bg-transparent overflow-hidden">
            {/* Starfield Background Pattern (Desktop only for 60fps mobile performance) */}
            {!isMobile && (
                <div className="absolute inset-0 z-0 pointer-events-none opacity-25">
                    <Galaxy 
                        transparent={true}
                        mouseRepulsion={false}
                        mouseInteraction={false}
                        density={0.8}
                        glowIntensity={0.2}
                        saturation={0.5}
                        hueShift={350}
                        starSpeed={0.2}
                        twinkleIntensity={0.2}
                    />
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col gap-5 md:gap-10 relative z-10">
                <div className="flex items-end justify-between flex-wrap gap-3 border-b border-white/10 pb-3 md:pb-6">
                    <div className="flex flex-col gap-1 md:gap-2">
                        <span className="text-[9px] md:text-[10px] font-mono text-red-500 uppercase tracking-[0.4em]">Featured</span>
                        <h2 className="text-2xl sm:text-4xl md:text-6xl font-heading font-black text-white uppercase tracking-tighter">Popular Projects</h2>
                    </div>
                    <div className="flex gap-1.5 md:gap-2">
                        {projects.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setIndex(i)}
                                aria-label={`Slide ${i + 1}`}
                                className={`h-1 transition-all ${i === index ? 'w-8 sm:w-10 bg-red-600' : 'w-4 sm:w-5 bg-white/20 hover:bg-white/40'}`}
                            />
                        ))}
                    </div>
                </div>

                <motion.div
                    key={current.id}
                    initial={{ opacity: 0, y: isMobile ? 5 : 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: isMobile ? 0.25 : 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="relative w-full border border-white/15 bg-neutral-950/90 rounded-2xl overflow-hidden group shadow-2xl flex flex-col"
                >
                    {/* Full-width GitHub OpenGraph Image (Edge-to-edge seamless fit) */}
                    <div className="relative w-full aspect-[16/9] sm:aspect-[1200/630] bg-[#0d1117] overflow-hidden border-b border-white/10">
                        <img
                            src={socialImg(current.name)}
                            alt={formatRepoName(current.name)}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-500"
                            onError={(e) => {
                                (e.currentTarget as HTMLImageElement).style.display = 'none';
                            }}
                        />
                        <div className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4 bg-red-600 text-white font-mono text-[8px] sm:text-[9px] px-2 py-0.5 sm:px-2.5 sm:py-1 uppercase tracking-widest font-bold rounded shadow-md">
                            PROJECT {String(index + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
                        </div>
                    </div>

                    {/* Project Information & Controls Bar */}
                    <div className="p-3.5 sm:p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6 bg-black/80 backdrop-blur-md">
                        <div className="flex flex-col gap-1.5 sm:gap-2 max-w-2xl w-full">
                            <h3 className="text-base sm:text-2xl md:text-3xl font-heading font-black text-white uppercase tracking-tight group-hover:text-red-500 transition-colors">
                                {formatRepoName(current.name)}
                            </h3>
                            <p className="text-[11px] sm:text-xs md:text-sm text-white/80 font-mono leading-relaxed line-clamp-2 sm:line-clamp-3">
                                {current.description || 'No description available for this project.'}
                            </p>
                            <div className="flex flex-wrap gap-1.5 sm:gap-2 text-[9px] sm:text-[10px] font-mono mt-0.5">
                                {current.language && (
                                    <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 border border-white/15 bg-white/5 text-white/90 uppercase tracking-wider rounded-md">{current.language}</span>
                                )}
                                {current.stargazers_count > 0 && (
                                    <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 border border-white/15 bg-white/5 text-white/90 flex items-center gap-1 rounded-md">
                                        <Star size={10} className="text-yellow-400 fill-yellow-400" /> {current.stargazers_count}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-row items-center gap-2 sm:gap-3 w-full md:w-auto shrink-0 pt-1 md:pt-0">
                            <a
                                href={current.html_url}
                                target="_blank"
                                rel="noreferrer"
                                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 sm:px-5 sm:py-2.5 bg-red-600 text-white hover:bg-white hover:text-black transition-all font-heading text-[11px] sm:text-xs uppercase tracking-wider rounded-full font-bold shadow-md"
                            >
                                <Github size={13} />
                                <span>GitHub</span>
                            </a>
                            <button
                                onClick={() => navigate(`/project/${current.name}`)}
                                className="flex-1 sm:flex-initial px-3.5 py-2 sm:px-5 sm:py-2.5 border border-white/20 hover:border-red-600 hover:text-red-500 transition-colors bg-white/5 font-heading text-[11px] sm:text-xs uppercase tracking-wider rounded-full text-center"
                            >
                                Details →
                            </button>
                        </div>
                    </div>
                </motion.div>

                <div className="flex justify-end">
                    <button
                        onClick={() => navigate('/projects')}
                        className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.2em] text-white/60 hover:text-red-500 transition-colors border-b border-white/10 hover:border-red-500 pb-0.5"
                    >
                        View all projects →
                    </button>
                </div>
            </div>
        </section>
    );
};

export default PopularProjectsSlider;
