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

  const isMobile = typeof window !== 'undefined' && (
    window.innerWidth <= 768 ||
    (window.matchMedia && window.matchMedia('(hover: none) and (pointer: coarse)').matches)
  );

  return (
    <section className="relative w-full overflow-hidden bg-transparent py-4 md:py-8">
      {/* Section Header */}
      <div className="max-w-[95vw] mx-auto px-2 sm:px-4 mb-4 md:mb-6 flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
          <span className="text-[10px] md:text-xs font-mono text-red-500 font-bold uppercase tracking-[0.3em] md:tracking-[0.5em]">
            FEATURED PROJECTS
          </span>
        </div>
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-heading font-black text-white uppercase tracking-tight leading-none">
          <ScrambleText text="Popular Projects" />
        </h2>
      </div>

      <div className="max-w-[95vw] mx-auto px-2 sm:px-4">
        {/* Main Showcase Container */}
        <div className="relative w-full border border-white/10 hover:border-white/20 bg-neutral-950/90 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl transition-all duration-300">
          
          {/* Top Continuous Progress Bar */}
          <div className="w-full h-[3px] bg-white/5 relative z-40">
            <motion.div 
              key={currentIndex}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 10, ease: "linear" }}
              className="h-full bg-red-600 shadow-[0_0_15px_#FF0000]"
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, x: isMobile ? 0 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isMobile ? 0 : -20 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-1 lg:grid-cols-12 min-h-[380px] md:min-h-[460px] w-full"
            >
              {/* ─── LEFT: Full-Width Aspect Ratio Media Preview (lg:col-span-7) ─── */}
              <div className="lg:col-span-7 relative w-full h-[240px] sm:h-[320px] md:h-[400px] lg:h-full min-h-[260px] lg:min-h-[460px] bg-[#0d1117] overflow-hidden group flex items-center justify-center border-b lg:border-b-0 lg:border-r border-white/10">
                <img 
                  src={imageUrl} 
                  alt={current.name} 
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                  }}
                />
                
                {/* Subtle Gradient Shade for Contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                {/* Status Badges on Media */}
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex items-center gap-2 z-10">
                  <span className="bg-red-600 text-white font-mono text-[9px] sm:text-[11px] px-2.5 py-1 uppercase tracking-widest font-bold rounded shadow-md">
                    PROJECT {String(currentIndex + 1).padStart(2, '0')} / {String(featuredProjects.length).padStart(2, '0')}
                  </span>
                  {current.language && (
                    <span className="bg-black/80 backdrop-blur-md border border-white/15 text-white/90 font-mono text-[9px] sm:text-[10px] px-2.5 py-1 rounded font-bold uppercase">
                      {current.language}
                    </span>
                  )}
                </div>
              </div>

              {/* ─── RIGHT: Clear Project Intelligence & Details Panel (lg:col-span-5) ─── */}
              <div className="lg:col-span-5 p-5 sm:p-7 md:p-8 flex flex-col justify-between gap-6 bg-gradient-to-b from-neutral-900/60 to-black/90">
                <div className="flex flex-col gap-4">
                  {/* Category / Star Stat */}
                  <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
                    <span className="text-xs font-mono text-red-500 font-bold uppercase tracking-wider">
                      OPEN SOURCE PROJECT
                    </span>

                    <div className="flex items-center gap-2">
                      {current.stargazers_count > 0 && (
                        <span className="text-xs font-mono text-white/90 bg-white/10 border border-white/15 px-2.5 py-1 rounded-full flex items-center gap-1 font-bold">
                          ★ {current.stargazers_count}
                        </span>
                      )}
                      {/* @ts-ignore */}
                      {current.forks_count > 0 && (
                        <span className="text-xs font-mono text-white/70 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full flex items-center gap-1">
                          ⑂ {current.forks_count}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Project Title */}
                  <div className="flex flex-col gap-1.5">
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-heading font-black text-white uppercase tracking-tight leading-tight">
                      {current.name.replace(/-/g, ' ')}
                    </h3>
                  </div>

                  {/* Project Description */}
                  <p className="text-xs sm:text-sm text-white/75 font-sans leading-relaxed">
                    {current.description || "Open-source software application built for high performance and modern developer workflows."}
                  </p>

                  {/* Tech Specs Grid */}
                  <div className="grid grid-cols-2 gap-2.5 pt-2">
                    <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col gap-0.5">
                      <span className="text-[10px] font-mono uppercase text-white/40 tracking-wider">Primary Language</span>
                      <span className="text-xs sm:text-sm font-mono font-bold text-red-400 uppercase">
                        {current.language || 'Multi-Stack'}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col gap-0.5">
                      <span className="text-[10px] font-mono uppercase text-white/40 tracking-wider">Visibility</span>
                      <span className="text-xs sm:text-sm font-mono font-bold text-white/90">
                        Public Repository
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Controls & Call to Action */}
                <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between gap-3">
                    <a 
                      href={current.html_url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-red-600 hover:bg-white hover:text-black transition-all duration-200 text-white font-bold text-xs font-mono uppercase tracking-wider rounded-xl shadow-lg group/btn"
                    >
                      <Github size={15} />
                      <span>View Repository</span>
                      <ChevronRight size={14} className="transition-transform group-hover/btn:translate-x-1" />
                    </a>

                    {/* Prev / Next Slide Arrows */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button 
                        onClick={prevSlide}
                        className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/30 text-white flex items-center justify-center transition-all text-base font-bold"
                        aria-label="Previous Slide"
                      >
                        ‹
                      </button>
                      <button 
                        onClick={nextSlide}
                        className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/30 text-white flex items-center justify-center transition-all text-base font-bold"
                        aria-label="Next Slide"
                      >
                        ›
                      </button>
                    </div>
                  </div>

                  {/* Dot Indicators */}
                  <div className="flex items-center justify-center gap-1.5 mt-1">
                    {featuredProjects.map((_, idx) => (
                      <button
                        key={`dot-${idx}`}
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          currentIndex === idx ? 'w-6 bg-red-500' : 'w-1.5 bg-white/20 hover:bg-white/40'
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default ProjectSlideshow;
