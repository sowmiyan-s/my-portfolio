import React, { useCallback, useEffect, useState, useMemo, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useRealtimeRefetch } from '@/hooks/useRealtimeRefetch';

/* ─── Icon Map ─── */
const SKILL_ICON_MAP: Record<string, string> = {
  python: 'python', typescript: 'typescript', javascript: 'javascript', java: 'java',
  react: 'react', nextjs: 'nextjs', 'next.js': 'nextjs', fastapi: 'fastapi',
  tailwindcss: 'tailwindcss', 'tailwind css': 'tailwindcss', pytorch: 'pytorch',
  langchain: 'langchain', huggingface: 'huggingface', 'hugging face': 'huggingface',
  claude: 'claude', ollama: 'ollama', n8n: 'n8n', postgresql: 'postgresql',
  mongodb: 'mongodb', mysql: 'mysql', supabase: 'supabase', docker: 'docker',
  aws: 'aws', linux: 'linux', git: 'git', github: 'github', vercel: 'vercel',
  figma: 'figma', powerbi: 'powerbi', 'power bi': 'powerbi', crewai: 'crewai',
};
const SKILLS_TO_EXCLUDE = new Set(['llm', 'llms', 'vscode', 'vs code', 'canva', 'gigma']);

const getSlug = (name: string) => SKILL_ICON_MAP[name.trim().toLowerCase()] || 'github';

/* ─── Category Data ─── */
interface SkillData { name: string; note?: string; }
interface CategoryData {
  id: string; label: string; tagline: string; emoji: string;
  accentColor: string; accentGlow: string;
  skills: SkillData[];
}

const BASE_CATEGORIES: CategoryData[] = [
  {
    id: 'ai', label: 'AI & Machine Learning', tagline: 'Building autonomous agents, training models, and orchestrating LLM workflows at production scale',
    emoji: '🧠', accentColor: 'rgba(239, 68, 68, 0.9)', accentGlow: 'rgba(239, 68, 68, 0.15)',
    skills: [
      { name: 'LangChain', note: 'Agent Framework' }, { name: 'CrewAI', note: 'Multi-Agent' },
      { name: 'PyTorch', note: 'Deep Learning' }, { name: 'Hugging Face', note: 'Model Hub' },
      { name: 'Claude', note: 'LLM API' }, { name: 'Ollama', note: 'Local Inference' },
      { name: 'FastAPI', note: 'ML Serving' }, { name: 'n8n', note: 'Automation' },
    ],
  },
  {
    id: 'languages', label: 'Languages', tagline: 'Core languages I think and build in',
    emoji: '⌨️', accentColor: 'rgba(59, 130, 246, 0.9)', accentGlow: 'rgba(59, 130, 246, 0.12)',
    skills: [
      { name: 'Python', note: 'Primary' }, { name: 'TypeScript', note: 'Full-Stack' },
      { name: 'JavaScript', note: 'Web' }, { name: 'Java', note: 'Enterprise' },
    ],
  },
  {
    id: 'backend', label: 'Backend & Data', tagline: 'APIs, databases, and server architecture',
    emoji: '⚙️', accentColor: 'rgba(16, 185, 129, 0.9)', accentGlow: 'rgba(16, 185, 129, 0.12)',
    skills: [
      { name: 'FastAPI', note: 'REST' }, { name: 'PostgreSQL', note: 'SQL' },
      { name: 'Supabase', note: 'BaaS' }, { name: 'MongoDB', note: 'NoSQL' },
      { name: 'MySQL', note: 'SQL' },
    ],
  },
  {
    id: 'frontend', label: 'Frontend & Design', tagline: 'Interfaces that feel alive',
    emoji: '🎨', accentColor: 'rgba(168, 85, 247, 0.9)', accentGlow: 'rgba(168, 85, 247, 0.12)',
    skills: [
      { name: 'React', note: 'UI Library' }, { name: 'Next.js', note: 'Framework' },
      { name: 'Tailwind CSS', note: 'Utility CSS' }, { name: 'Figma', note: 'Design' },
    ],
  },
  {
    id: 'devops', label: 'DevOps & Cloud', tagline: 'Deploy, scale, and ship with confidence',
    emoji: '☁️', accentColor: 'rgba(245, 158, 11, 0.9)', accentGlow: 'rgba(245, 158, 11, 0.12)',
    skills: [
      { name: 'AWS', note: 'Cloud' }, { name: 'Docker', note: 'Containers' },
      { name: 'Linux', note: 'Systems' }, { name: 'Git', note: 'VCS' },
      { name: 'GitHub', note: 'Platform' }, { name: 'Vercel', note: 'Edge' },
      { name: 'Power BI', note: 'Analytics' },
    ],
  },
];

/* ─── Skill Chip ─── */
const SkillChip: React.FC<{ skill: SkillData; accent: string; delay: number }> = ({ skill, accent, delay }) => {
  const slug = getSlug(skill.name);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="bento-skill-chip"
    >
      <div className="bento-skill-icon-box" style={{ borderColor: accent.replace(/[\d.]+\)$/, '0.15)') }}>
        <img src={`/tech-icons/${slug}.svg`} alt={skill.name} loading="lazy" className="w-5 h-5 sm:w-6 sm:h-6 object-contain" />
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-[13px] sm:text-sm font-semibold text-white/90 leading-tight truncate">{skill.name}</span>
        {skill.note && <span className="text-[9px] sm:text-[10px] text-white/35 font-mono uppercase tracking-wider leading-none truncate">{skill.note}</span>}
      </div>
    </motion.div>
  );
};

/* ─── Bento Category Card ─── */
const BentoCard: React.FC<{ cat: CategoryData; index: number; isHero?: boolean }> = ({ cat, index, isHero }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mouse-x', `${x}%`);
    card.style.setProperty('--mouse-y', `${y}%`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`bento-card ${isHero ? 'bento-card-hero' : ''}`}
      style={{
        '--card-accent': cat.accentColor,
        '--card-glow': cat.accentGlow,
      } as React.CSSProperties}
    >
      {/* Radial follow-cursor glow */}
      <div className="bento-card-spotlight" />

      {/* Top accent edge */}
      <div className="bento-card-accent-edge" style={{ background: `linear-gradient(90deg, transparent, ${cat.accentColor}, transparent)` }} />

      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4 sm:mb-5">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 mb-2">
            <span className="text-lg sm:text-xl">{cat.emoji}</span>
            <h3 className="text-base sm:text-lg font-heading font-bold text-white tracking-tight truncate">
              {cat.label}
            </h3>
          </div>
          <p className="text-[11px] sm:text-xs text-white/40 leading-relaxed font-sans line-clamp-2">
            {cat.tagline}
          </p>
        </div>
        <div
          className="flex items-center justify-center w-8 h-8 rounded-lg text-[11px] font-mono font-bold shrink-0"
          style={{ background: cat.accentGlow, color: cat.accentColor }}
        >
          {cat.skills.length}
        </div>
      </div>

      {/* Skills */}
      <div className={`flex flex-wrap gap-2 ${isHero ? 'sm:gap-2.5' : ''}`}>
        {cat.skills.map((skill, i) => (
          <SkillChip key={skill.name} skill={skill} accent={cat.accentColor} delay={index * 0.1 + i * 0.04} />
        ))}
      </div>
    </motion.div>
  );
};

/* ─── Main Section ─── */
const SkillsSection: React.FC = () => {
  const [customSkills, setCustomSkills] = useState<string[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  const load = useCallback(async () => {
    try {
      const { data } = await supabase.from('skills').select('name, category');
      if (data && data.length) {
        const t = data
          .filter((s: any) => s.category === 'tech' && !SKILLS_TO_EXCLUDE.has(s.name.toLowerCase().trim()))
          .map((s: any) => s.name);
        if (t.length) setCustomSkills(t);
      }
    } catch { /* fallback */ }
  }, []);

  useEffect(() => { load(); }, [load]);
  useRealtimeRefetch(['skills'], load);

  const categories = useMemo(() => {
    if (!customSkills.length) return BASE_CATEGORIES;
    return BASE_CATEGORIES.map((cat) => {
      const matching = customSkills.filter((skill) => {
        const k = skill.toLowerCase();
        if (cat.id === 'ai' && /langchain|crewai|pytorch|hugging|claude|ollama|n8n/i.test(k)) return true;
        if (cat.id === 'languages' && /python|java|typescript|javascript|c\+\+/i.test(k)) return true;
        if (cat.id === 'backend' && /postgres|mongo|mysql|supabase|fastapi/i.test(k)) return true;
        if (cat.id === 'frontend' && /react|next|tailwind|figma/i.test(k)) return true;
        if (cat.id === 'devops' && /docker|aws|linux|git|vercel|power/i.test(k)) return true;
        return false;
      });
      const existingNames = new Set(cat.skills.map(s => s.name.toLowerCase()));
      const newSkills = matching.filter(s => !existingNames.has(s.toLowerCase())).map(s => ({ name: s }));
      return { ...cat, skills: [...cat.skills, ...newSkills] };
    });
  }, [customSkills]);

  const totalSkills = categories.reduce((sum, c) => sum + c.skills.length, 0);

  return (
    <section id="skills" ref={sectionRef} className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-12 sm:mb-16"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.2em] text-white/50">
            {totalSkills} Technologies
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black text-white tracking-tight leading-[1.1] mb-3">
          What I Work With
        </h2>
        <p className="text-sm sm:text-base text-white/35 font-sans max-w-lg mx-auto leading-relaxed">
          The tools, languages, and platforms I use to build production systems.
        </p>
      </motion.div>

      {/* Bento Grid */}
      <div className="bento-grid">
        {categories.map((cat, idx) => (
          <BentoCard key={cat.id} cat={cat} index={idx} isHero={idx === 0} />
        ))}
      </div>
    </section>
  );
};

export default SkillsSection;
