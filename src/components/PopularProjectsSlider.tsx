import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchRepos, GitHubRepo } from '@/lib/github';
import { fetchHiddenProjectIds, fetchFeaturedProjects } from '@/lib/projectSettings';
import { formatRepoName } from '@/lib/formatRepo';
import { useNavigate } from 'react-router-dom';
import { useRealtimeRefetch } from '@/hooks/useRealtimeRefetch';
import { Github, Star } from 'lucide-react';

const socialImg = (repo: string) =>
    `https://opengraph.githubassets.com/1/sowmiyan-s/${repo}`;

const PopularProjectsSlider = () => {
    const [projects, setProjects] = useState<GitHubRepo[]>([]);
    const [loading, setLoading] = useState(true);
    const [index, setIndex] = useState(0);
    const navigate = useNavigate();

    const load = useCallback(async () => {
        try {
            const [repos, hidden, featured] = await Promise.all([
                fetchRepos(),
                fetchHiddenProjectIds(),
                fetchFeaturedProjects(),
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
            <section className="w-full py-24 flex items-center justify-center">
                <p className="text-[10px] font-mono tracking-[0.5em] text-red-500 animate-pulse uppercase">Loading Featured Projects</p>
            </section>
        );
    }

    if (!projects.length) return null;

    const current = projects[index];

    return (
        <section id="popular-projects" className="relative w-full py-20 md:py-28 bg-transparent overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col gap-10">
                <div className="flex items-end justify-between flex-wrap gap-4 border-b border-white/10 pb-6">
                    <div className="flex flex-col gap-2">
                        <span className="text-[10px] font-mono text-red-500 uppercase tracking-[0.4em]">Featured</span>
                        <h2 className="text-4xl md:text-6xl font-heading font-black text-white uppercase tracking-tighter">Popular Projects</h2>
                    </div>
                    <div className="flex gap-2">
                        {projects.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setIndex(i)}
                                aria-label={`Slide ${i + 1}`}
                                className={`h-1 transition-all ${i === index ? 'w-10 bg-red-600' : 'w-5 bg-white/20 hover:bg-white/40'}`}
                            />
                        ))}
                    </div>
                </div>

                <motion.div
                    key={current.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="relative w-full border border-white/10 bg-neutral-950 rounded-xl overflow-hidden group shadow-2xl flex flex-col"
                >
                    {/* Full-width GitHub OpenGraph Image (Shows entire card left-to-right without clipping) */}
                    <div className="relative w-full aspect-[2/1] sm:aspect-[21/9] bg-black overflow-hidden border-b border-white/10 flex items-center justify-center">
                        <img
                            src={socialImg(current.name)}
                            alt={formatRepoName(current.name)}
                            loading="lazy"
                            className="w-full h-full object-contain md:object-cover group-hover:scale-[1.01] transition-transform duration-700"
                            onError={(e) => {
                                (e.currentTarget as HTMLImageElement).style.display = 'none';
                            }}
                        />
                        <div className="absolute top-4 left-4 bg-red-600 text-white font-mono text-[9px] px-3 py-1 uppercase tracking-widest font-bold rounded-sm shadow-md">
                            FEATURED PROJECT {String(index + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
                        </div>
                    </div>

                    {/* Project Information & Controls Bar */}
                    <div className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-black/80 backdrop-blur-md">
                        <div className="flex flex-col gap-2 max-w-2xl">
                            <h3 className="text-2xl md:text-4xl font-heading font-black text-white uppercase tracking-tight group-hover:text-red-500 transition-colors">
                                {formatRepoName(current.name)}
                            </h3>
                            <p className="text-xs md:text-sm text-white/80 font-mono leading-relaxed">
                                {current.description || 'No description available for this project.'}
                            </p>
                            <div className="flex flex-wrap gap-2 text-[10px] font-mono mt-1">
                                {current.language && (
                                    <span className="px-2.5 py-1 border border-white/20 bg-white/5 text-white/90 uppercase tracking-widest rounded-sm">{current.language}</span>
                                )}
                                {current.stargazers_count > 0 && (
                                    <span className="px-2.5 py-1 border border-white/20 bg-white/5 text-white/90 flex items-center gap-1 rounded-sm">
                                        <Star size={10} className="text-yellow-400 fill-yellow-400" /> {current.stargazers_count}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 shrink-0">
                            <a
                                href={current.html_url}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 px-5 py-3 bg-red-600 text-white hover:bg-white hover:text-black transition-all font-heading text-xs uppercase tracking-widest rounded-sm font-bold shadow-lg"
                            >
                                <Github size={14} />
                                View on GitHub
                            </a>
                            <button
                                onClick={() => navigate(`/project/${current.name}`)}
                                className="px-5 py-3 border border-white/20 hover:border-red-600 hover:text-red-500 transition-colors bg-white/5 font-heading text-xs uppercase tracking-widest rounded-sm"
                            >
                                Details →
                            </button>
                        </div>
                    </div>
                </motion.div>

                <div className="flex justify-end">
                    <button
                        onClick={() => navigate('/projects')}
                        className="text-xs font-mono uppercase tracking-[0.3em] text-white/60 hover:text-red-500 transition-colors border-b border-white/10 hover:border-red-500 pb-1"
                    >
                        View all projects →
                    </button>
                </div>
            </div>
        </section>
    );
};

export default PopularProjectsSlider;
