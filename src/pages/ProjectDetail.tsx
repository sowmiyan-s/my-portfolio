import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchReadme } from '@/lib/github';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { motion } from 'framer-motion';
import TechNav from '@/components/TechNav';
import Footer from '@/components/Footer';
import { ArrowLeft, Github, ExternalLink, BookOpen } from 'lucide-react';
import SEOKeywords from '@/components/SEOKeywords';
import SEO from '@/components/SEO';

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [readme, setReadme] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (id) {
        const data = await fetchReadme(id);
        setReadme(data);
        setLoading(false);
      }
    };
    load();
    window.scrollTo(0, 0);
  }, [id]);

  const formattedTitle = id ? id.replace(/[-_]/g, ' ') : 'Project';

  if (loading) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-3">
      <div className="w-8 h-8 rounded-full border-2 border-red-500/20 border-t-red-500 animate-spin" />
      <span className="font-mono text-xs text-white/60 tracking-widest uppercase">Loading Project Documentation...</span>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-transparent text-white overflow-x-hidden">
      <SEO 
        title={`${formattedTitle} — Technical Repository & Documentation | Sowmiyan S`}
        description={`Technical architecture, implementation details, and documentation for ${formattedTitle} open-source project by Sowmiyan S.`}
        canonical={`https://sowmiyan-s.vercel.app/project/${id || ''}`}
        ogType="article"
      />
      <SEOKeywords />
      <TechNav />

      <main className="relative z-10 pt-28 md:pt-36 pb-20 px-4 sm:px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl mx-auto flex flex-col gap-6"
        >
          {/* Breadcrumb Navigation */}
          <div>
            <Link 
              to="/projects" 
              className="inline-flex items-center gap-2 text-xs font-mono text-white/70 hover:text-red-500 transition-colors uppercase tracking-wider py-1"
            >
              <ArrowLeft size={14} />
              <span>Back to All Projects</span>
            </Link>
          </div>

          {/* Project Header */}
          <div className="flex flex-col gap-3 pb-6 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              <span className="text-[10px] font-mono text-red-500 uppercase tracking-[0.3em] font-bold">
                Repository Documentation
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-heading font-black text-white uppercase tracking-tight leading-tight">
              {formattedTitle}
            </h1>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={`https://github.com/sowmiyan-s/${id}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold uppercase tracking-wider rounded-full shadow-[0_0_15px_rgba(220,38,38,0.3)] transition-all"
              >
                <Github size={14} />
                <span>View on GitHub</span>
              </a>
            </div>
          </div>

          {/* Readme Content Container */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="prose prose-invert prose-red max-w-none bg-neutral-950/80 border border-white/10 rounded-2xl p-5 sm:p-8 md:p-10 backdrop-blur-xl shadow-2xl overflow-x-auto text-sm leading-relaxed font-sans"
          >
            <ReactMarkdown rehypePlugins={[rehypeRaw]}>{readme}</ReactMarkdown>
          </motion.article>

          {/* Bottom Action Card */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 py-6 border-t border-white/10">
            <div className="flex flex-col gap-1 text-center sm:text-left">
              <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest">Source Repository</span>
              <span className="text-xs font-heading font-bold text-white uppercase tracking-wider">{id}</span>
            </div>

            <a
              href={`https://github.com/sowmiyan-s/${id}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-red-500/50 text-white font-mono text-xs uppercase tracking-wider rounded-full transition-all"
            >
              <span>Explore Code on GitHub</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default ProjectDetail;
