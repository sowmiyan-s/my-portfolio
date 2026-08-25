import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchRepos, GitHubRepo } from '@/lib/github';
import { fetchHiddenProjectIds, fetchPageFeaturedProjects } from '@/lib/projectSettings';
import { Github, ChevronRight } from 'lucide-react';
import ScrambleText from './ScrambleText';

const ProjectSlideshow = () => {
  const [featuredProjects, setFeaturedProjects] = useState<GitHubRepo[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [data, featured, hiddenIds] = await Promise.all([
        fetchRepos(),
        fetchPageFeaturedProjects(),
        fetchHiddenProjectIds(),
      ]);

      const featuredIds = featured.map((f) => f.id);
      const visibleRepos = data.filter(repo => !hiddenIds.includes(repo.id));

      let filtered = visibleRepos.filter(repo => featuredIds.includes(repo.id));
      if (!filtered.length) {
        filtered = visibleRepos
          .sort((a, b) => b.stargazers_count - a.stargazers_count)
          .slice(0, 5);
      }

      setFeaturedProjects(filtered);
    } catch (err) {
      console.error("Failed to fetch featured projects:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    window.addEventListener('portfolio-config-changed', load);
    return () => window.removeEventListener('portfolio-config-changed', load);
  }, [load]);


  useEffect(() => {
    if (featuredProjects.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredProjects.length);
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [featuredProjects]);

  if (loading) return null;
  if (featuredProjects.length === 0) return null;

  const current = featuredProjects[currentIndex];
  const imageUrl = `https://opengraph.githubassets.com/1/sowmiyan-s/${current.name}`;

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % featuredProjects.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + featuredProjects.length) % featuredProjects.length);

  return (
    <section className="relative w-full overflow-hidden bg-transparent">
      {/* Section Header (Fixed at top of slideshow area) */}
      <div className="relative px-5 md:px-16 pt-2 pb-2 flex flex-col gap-2 bg-transparent mt-4 mb-4">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-red-600 rounded-full" />
          <span className="text-[10px] md:text-xs font-mono text-red-600 font-bold uppercase tracking-[0.4em] md:tracking-[0.6em]">FEATURED PROJECTS</span>
        </div>
        <h2 className="text-4xl md:text-8xl font-heading font-black text-white uppercase tracking-tighter leading-none">
          <ScrambleText text="Popular Projects" />
        </h2>
      </div>

      <div className="relative min-h-[520px] sm:min-h-[560px] md:h-screen bg-transparent border-y border-white/5 group">
        {/* Top Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-[3px] bg-white/5 z-40">
          <motion.div 
            key={currentIndex}
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 10, ease: "linear" }}
            className="h-full bg-red-600 shadow-[0_0_15px_#FF0000]"
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            {/* Background Visual (Full Size) */}
            <div className="absolute inset-0 bg-[#0a0a0a]">
              <img 
                src={imageUrl} 
                alt="Project Backdrop" 
                className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-75 transition-all duration-1000 group-hover:scale-105"
              />
              
              {/* Complex Tactical Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20 z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60 z-10" />
              <div className="absolute inset-0 opacity-10 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_2px] z-20" />
            </div>

            {/* Content Overlay (Bottom-Pinned) */}
            <div className="absolute inset-x-0 bottom-0 z-30 p-4 sm:p-6 md:p-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-4 md:gap-10">
              <div className="flex flex-col gap-2.5 sm:gap-4 md:gap-6 max-w-2xl w-full">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-600 rounded-full shadow-[0_0_10px_#FF0000]" />
                  <span className="text-[10px] font-mono text-red-500 font-bold uppercase tracking-[0.4em] sm:tracking-[0.6em]">
                    PROJECT 0{currentIndex + 1}
                  </span>
                </div>
                
                <h3 className="text-2xl sm:text-4xl md:text-7xl font-heading font-black text-white uppercase tracking-tight leading-tight break-words drop-shadow-[0_2px_15px_rgba(0,0,0,0.9)]">
                   {current.name.replace(/-/g, ' ')}
                </h3>
                
                <p className="text-white text-[11px] sm:text-xs md:text-sm font-mono leading-relaxed uppercase tracking-wider line-clamp-2 max-w-xl border-l-4 border-red-600 pl-3 sm:pl-4 bg-black/80 backdrop-blur-md p-3 sm:p-4 md:p-5 border border-white/20 shadow-xl rounded-lg">
                  {current.description || "No description available."}
                </p>

                <div className="flex items-center gap-4 sm:gap-6 bg-black/85 backdrop-blur-md px-3 sm:px-4 py-2 border border-white/20 rounded-lg shadow-lg w-fit">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[8px] font-mono text-red-400 font-bold uppercase tracking-widest leading-none">Stars</span>
                    <span className="text-xs sm:text-sm font-heading font-black text-white leading-none">{current.stargazers_count}</span>
                  </div>
                  <div className="w-px h-5 sm:h-6 bg-white/20" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[8px] font-mono text-red-400 font-bold uppercase tracking-widest leading-none">Language</span>
                    <span className="text-xs sm:text-sm font-heading font-black text-white leading-none">{current.language || 'SYSTEM'}</span>
                  </div>
                </div>
              </div>

              {/* Action & Nav Section */}
              <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-4 md:gap-10 w-full md:w-auto">
                <a 
                  href={current.html_url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-2 px-5 py-3 bg-red-600 border border-red-500 hover:bg-white hover:text-black transition-all text-white font-bold text-xs font-heading uppercase tracking-[0.3em] md:tracking-[0.4em] shadow-lg rounded-lg"
                >
                  <Github size={14} />
                  <span className="hidden md:inline">VIEW REPOSITORY</span>
                  <span className="md:hidden">REPO</span>
                </a>

                <div className="flex items-center gap-3 md:gap-8">
                  <div className="flex gap-1.5 md:gap-2">
                    {featuredProjects.map((_, i) => (
                      <button 
                        key={i} 
                        onClick={() => setCurrentIndex(i)}
                        className={`h-1 transition-all duration-500 rounded-full ${i === currentIndex ? 'w-8 md:w-10 bg-red-600 shadow-[0_0_10px_#FF0000]' : 'w-2 bg-white/10 hover:bg-white/30'}`}
                      />
                    ))}
                  </div>
                  
                  <button 
                    onClick={nextSlide}
                    className="p-2 md:p-2.5 bg-white/5 border border-white/10 text-white/30 hover:border-red-600 hover:text-red-500 transition-all rounded-lg"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Global Tactical Grid Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-tactical-grid" />
      </div>
    </section>
  );
};

export default ProjectSlideshow;
