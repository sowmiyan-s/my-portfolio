import React, { useCallback, useEffect, useState } from 'react';
import { fetchRepos, GitHubRepo } from '@/lib/github';
import { fetchHiddenProjectIds } from '@/lib/projectSettings';
import { formatRepoName } from '@/lib/formatRepo';
import { useNavigate } from 'react-router-dom';
import { useRealtimeRefetch } from '@/hooks/useRealtimeRefetch';
import RadarLoader from './RadarLoader';

const WorkGrid = () => {
    const [projects, setProjects] = useState<GitHubRepo[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const load = useCallback(async () => {
        const [data, hidden] = await Promise.all([
            fetchRepos(),
            fetchHiddenProjectIds(),
        ]);
        const filtered = data.filter(repo => !hidden.includes(repo.id));
        setProjects(filtered.slice(0, 6));
        setLoading(false);
    }, []);

    useEffect(() => {
        load();
        window.addEventListener('portfolio-config-changed', load);
        return () => window.removeEventListener('portfolio-config-changed', load);
    }, [load]);
    useRealtimeRefetch(['hidden_projects'], load);



    if (loading) return (
        <div className="py-40 flex flex-col items-center justify-center gap-12 border-y border-white/5 bg-black/20">
            <RadarLoader />
            <p className="font-mono text-[10px] uppercase tracking-[1em] text-red-600 animate-pulse text-center">Synchronizing_Project_Nodes</p>
        </div>
    );

    return (
        <section id="projects" className="relative py-24 px-6 dot-bg border-t border-white/10 z-10">
            <div className="max-w-7xl mx-auto flex flex-col gap-12">
                <div className="flex justify-between items-end border-b border-white/20 pb-4">
                    <div className="flex flex-col">
                        <span className="text-xs opacity-40 font-mono italic">03 / PROJECT_GATEWAY</span>
                        <h2 className="text-4xl md:text-5xl font-heading font-bold text-white uppercase tracking-tighter">DATASET_COLLECTION</h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 border border-white/10">
                    {projects.map((repo, i) => (
                        <div 
                            key={repo.id} 
                            onClick={() => navigate(`/project/${repo.name}`)}
                            className="bg-black p-8 group transition-all duration-300 hover:bg-red-900/10 cursor-pointer overflow-hidden relative border-r border-b border-white/5"
                        >
                            <div className="absolute top-0 right-0 w-full h-full opacity-0 group-hover:opacity-10 grid-bg-dense pointer-events-none transition-opacity" />
                            
                            <div className="flex justify-between items-start mb-12 relative z-10">
                                <div className="flex flex-col">
                                    <span className="text-xs font-mono text-stone-600 mb-1 leading-none">{String(i + 1).padStart(2, '0')}</span>
                                    <h3 className="text-xl font-heading font-bold uppercase transition-all tracking-tight group-hover:text-red-600">{formatRepoName(repo.name)}</h3>
                                </div>
                                <div className="flex flex-col text-right">
                                     <span className="text-[8px] font-mono opacity-20 uppercase">Core_Lang</span>
                                     <span className="text-[10px] font-mono text-red-600 font-bold">{repo.language || 'DATA'}</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4 relative z-10">
                                <p className="text-xs font-mono opacity-40 leading-relaxed min-h-[48px] line-clamp-3">
                                    {repo.description || 'ARCHY_RECORD: DATASET_DESCRIPTION_MISSING_IN_ORIGIN_SOURCE.'}
                                </p>
                                <div className="flex justify-between items-end opacity-0 group-hover:opacity-100 transition-all pt-4">
                                     <div className="flex gap-1">
                                        {[...Array(3)].map((_, j) => <div key={j} className="w-1 h-1 bg-red-600" />)}
                                     </div>
                                     <span className="text-[8px] font-mono text-red-600 tracking-widest">DECRYPT_README</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WorkGrid;
