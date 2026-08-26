import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TechNav from '@/components/TechNav';
import Footer from '@/components/Footer';
import { certificatesList, Certificate } from '@/lib/certificates';
import EbookShowcase from '@/components/EbookShowcase';
import LeetCodeShowcase from '@/components/LeetCodeShowcase';
import ShapeGrid from '@/components/ShapeGrid';
import SEOKeywords from '@/components/SEOKeywords';
import { useThemeColors } from '@/lib/useThemeColors';
import { Search, Award, BookOpen, FileText, Cpu, CheckCircle2, Download, X, ExternalLink, GraduationCap } from 'lucide-react';
import ScrambleText from '@/components/ScrambleText';

interface AchievementItem {
  type: string;
  category: 'patent' | 'award' | 'publication' | 'book' | 'workshop';
  title: string;
  desc: string;
  badge: string;
  date?: string;
}

const achievements: AchievementItem[] = [
  { 
    type: 'PATENT', 
    category: 'patent',
    title: 'Smart Waste Monitoring & Collection Protocol', 
    desc: 'Integrated IoT-based automated waste level detection and smart municipal routing system.',
    badge: 'Patent Filed',
    date: '2025'
  },
  { 
    type: 'AWARD', 
    category: 'award',
    title: 'Inter-College Hackathon Runner Up', 
    desc: 'Secured 2nd prize in an intensive 24-hour rapid prototyping sprint among 20+ competing engineering teams.',
    badge: '2nd Place',
    date: '2024'
  },
  { 
    type: 'PUBLICATION', 
    category: 'publication',
    title: 'Cyber Threat Analysis & Mitigation Vectors', 
    desc: 'Published peer-reviewed technical research paper in the International Journal of Creative Research Thoughts (IJCRT).',
    badge: 'IJCRT Published',
    date: '2024'
  },
  { 
    type: 'AUTHOR', 
    category: 'book',
    title: 'Author of "Python for Beginners"', 
    desc: 'Authored and published a practical technical curriculum guide for foundational programming.',
    badge: 'Published Guide',
    date: '2024'
  },
  { 
    type: 'WORKSHOP', 
    category: 'workshop',
    title: 'Generative AI & Agentic Systems Workshop', 
    desc: 'Delivered a hands-on technical workshop on LLMs and autonomous agents for 50+ aspiring engineers.',
    badge: 'Technical Lead',
    date: '2025'
  },
];

const counters = [
  { label: 'Patents Filed', value: '01', icon: Cpu },
  { label: 'Competitions & Awards', value: '02', icon: Award },
  { label: 'Industry Certifications', value: `${certificatesList.length}+`, icon: CheckCircle2 },
  { label: 'Research Publications', value: '01', icon: FileText },
];

const certCategories = [
  { id: 'all', label: 'All Certifications' },
  { id: 'ai', label: 'AI & Data Science' },
  { id: 'cloud', label: 'Cloud & DevOps' },
  { id: 'dev', label: 'Software & Web' },
];

const AchievementsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const { rgbaPrimary } = useThemeColors();

  const filteredCerts = useMemo(() => {
    return certificatesList.filter(cert => {
      const matchesSearch = cert.name.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      if (selectedCategory === 'all') return true;
      const lower = cert.name.toLowerCase();
      if (selectedCategory === 'ai') return /ai|machine learning|data|python|deep learning|gen ai|prompt/i.test(lower);
      if (selectedCategory === 'cloud') return /aws|cloud|docker|devops|cyber|security|linux/i.test(lower);
      if (selectedCategory === 'dev') return /web|javascript|fullstack|html|tailwind|java|sql/i.test(lower);
      return true;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="relative min-h-screen bg-transparent text-white font-body selection:bg-red-600 selection:text-white overflow-x-hidden">
      <SEOKeywords />
      
      {/* Background Interactive ShapeGrid */}
      <div className="fixed inset-0 z-0 pointer-events-auto opacity-70">
        <ShapeGrid 
          speed={0.4} 
          squareSize={42}
          direction='diagonal'
          borderColor={rgbaPrimary(0.4)}
          hoverFillColor={rgbaPrimary(0.85)}
          shape='square'
          hoverTrailAmount={5}
        />
      </div>

      <TechNav />

      <main className="relative z-10 pt-24 sm:pt-28 pb-20">
        
        {/* ─── Hero Section ─── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 mb-10 sm:mb-16">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
              <span className="text-[10px] sm:text-xs font-mono text-red-500 font-bold uppercase tracking-[0.3em]">
                Verified Credentials & Honors
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-heading font-black text-white uppercase tracking-tight leading-tight">
              <ScrambleText text="Honors & Achievements" speed={0.4} delay={0.1} />
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-white/70 font-sans max-w-3xl leading-relaxed">
              A verified catalog of intellectual property, academic achievements, published research, coding milestones, and industry-certified technical proficiencies.
            </p>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 mt-8 sm:mt-10">
            {counters.map((c, i) => {
              const Icon = c.icon;
              return (
                <div
                  key={i}
                  className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-neutral-950/80 border border-white/10 backdrop-blur-xl flex flex-col items-start justify-between gap-2 shadow-lg"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-red-500">
                    <Icon size={16} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-2xl sm:text-3xl md:text-4xl font-heading font-black text-white leading-none">
                      {c.value}
                    </span>
                    <span className="text-[10px] sm:text-xs font-mono text-white/50 uppercase tracking-wider mt-1">
                      {c.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ─── Major Honors & Milestones ─── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 mb-14 sm:mb-20">
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-heading font-black text-white uppercase tracking-tight">
              Major Milestones
            </h2>
            <span className="text-xs font-mono text-white/40 uppercase tracking-wider">
              IP & Publications
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
            {achievements.map((item, i) => (
              <div
                key={i}
                className="p-5 sm:p-6 rounded-2xl bg-neutral-950/80 border border-white/10 hover:border-red-500/40 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between gap-4 group shadow-xl"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold text-red-400 bg-red-950/40 border border-red-500/30 px-2.5 py-0.5 rounded uppercase tracking-wider">
                      {item.badge}
                    </span>
                    {item.date && (
                      <span className="text-[10px] font-mono text-white/40">
                        {item.date}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-heading font-black text-white group-hover:text-red-400 transition-colors uppercase leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-white/70 font-sans leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/40 group-hover:text-white/80 transition-colors">
                  <span>Verified Credential</span>
                  <span className="group-hover:translate-x-1 transition-transform text-red-500">→</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── E-Book Showcase ─── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 mb-14 sm:mb-20">
          <EbookShowcase />
        </section>

        {/* ─── LeetCode Showcase ─── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 mb-14 sm:mb-20">
          <LeetCodeShowcase />
        </section>

        {/* ─── Verified Certifications Section ─── */}
        <section id="certificates" className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 mb-14 sm:mb-20">
          <div className="flex flex-col gap-4 mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-4">
              <div className="flex flex-col gap-1">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-heading font-black text-white uppercase tracking-tight">
                  Verified Certifications
                </h2>
                <span className="text-xs font-mono text-white/50">
                  Showing {filteredCerts.length} of {certificatesList.length} accredited certificates
                </span>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search certificates..."
                  className="w-full bg-neutral-900/90 border border-white/10 pl-9 pr-4 py-2 text-xs font-sans text-white focus:outline-none focus:border-red-500 transition-colors rounded-xl placeholder:text-white/30"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {certCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-200 ${
                    selectedCategory === cat.id
                      ? 'bg-red-600 text-white font-bold shadow-md'
                      : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Responsive Certificate Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {filteredCerts.map((cert, i) => (
              <div
                key={`${cert.name}-${i}`}
                onClick={() => setSelectedCert(cert)}
                className="group p-2.5 sm:p-3 rounded-xl bg-neutral-950/80 border border-white/10 hover:border-red-500/50 backdrop-blur-md cursor-pointer transition-all duration-300 flex flex-col justify-between gap-2.5 shadow-md hover:shadow-xl hover:-translate-y-1"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-black/60 border border-white/10">
                  <img 
                    src={cert.image} 
                    alt={cert.name} 
                    loading="lazy"
                    className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="flex flex-col gap-1 px-1">
                  <h3 className="text-xs sm:text-sm font-sans font-semibold text-white group-hover:text-red-400 transition-colors line-clamp-2 leading-snug">
                    {cert.name}
                  </h3>
                  <span className="text-[10px] font-mono text-white/40 uppercase">
                    View Certificate ↗
                  </span>
                </div>
              </div>
            ))}
          </div>

          {filteredCerts.length === 0 && (
            <div className="w-full text-center py-16 font-mono text-xs text-white/50 uppercase tracking-wider">
              No certificates match your search query.
            </div>
          )}
        </section>

        {/* ─── Formal Academic Credentials ─── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="p-6 sm:p-8 rounded-2xl bg-neutral-950/90 border border-white/10 backdrop-blur-xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-600/10 border border-red-500/30 text-red-500 flex items-center justify-center shrink-0">
                <GraduationCap size={24} />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-mono uppercase text-red-400 font-bold tracking-wider">
                  Academic Background
                </span>
                <h3 className="text-lg sm:text-xl font-heading font-black text-white uppercase">
                  B.Tech in Artificial Intelligence & Data Science
                </h3>
                <p className="text-xs sm:text-sm text-white/60 font-sans">
                  V.S.B. College of Engineering Technical Campus, Coimbatore
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-white/10 shrink-0">
              <div className="flex flex-col items-start md:items-end">
                <span className="text-lg sm:text-xl font-mono font-bold text-emerald-400">
                  8.53 CGPA
                </span>
                <span className="text-[10px] font-mono text-white/40 uppercase">
                  Current Status: Final Year
                </span>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* ─── High-Resolution Certificate Lightbox Modal ─── */}
      <AnimatePresence>
        {selectedCert && (
          <div 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-6"
            onClick={() => setSelectedCert(null)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-3xl w-full bg-neutral-950 border border-white/15 p-4 sm:p-6 shadow-2xl flex flex-col gap-4 rounded-2xl max-h-[92vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center pb-3 border-b border-white/10">
                <span className="text-xs font-mono text-red-500 font-bold uppercase tracking-wider">
                  Verified Certificate Document
                </span>
                <button 
                  className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                  onClick={() => setSelectedCert(null)}
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>
              
              {/* Modal Image Display */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/70 border border-white/10 rounded-xl flex items-center justify-center p-1">
                <img 
                  src={selectedCert.image} 
                  alt={selectedCert.name} 
                  className="w-full h-full object-contain" 
                />
              </div>

              {/* Modal Footer Controls */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-t border-white/10 pt-3">
                <div className="flex flex-col">
                  <h3 className="font-heading font-bold text-sm sm:text-base uppercase text-white">
                    {selectedCert.name}
                  </h3>
                  <span className="text-[10px] font-mono text-white/50 uppercase">
                    Accredited Technical Achievement
                  </span>
                </div>
                
                <a 
                  href={selectedCert.image} 
                  download 
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-white hover:text-black text-white font-mono text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md w-full sm:w-auto"
                >
                  <Download size={14} />
                  <span>Download Document</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default AchievementsPage;
