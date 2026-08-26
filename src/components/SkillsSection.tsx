import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { getSkillIconUrl, getSkillCategory } from '@/lib/skillIcons';
import { useRealtimeRefetch } from '@/hooks/useRealtimeRefetch';
import { 
  Bot, 
  Code2, 
  Layers, 
  Cloud, 
  Database, 
  Sparkles, 
  Cpu,
  LayoutGrid,
  Box
} from 'lucide-react';

const defaultTech = [
  'Python',
  'TypeScript',
  'React',
  'Next.js',
  'FastAPI',
  'LangChain',
  'CrewAI',
  'PyTorch',
  'Hugging Face',
  'Claude',
  'Ollama',
  'n8n',
  'Tailwind CSS',
  'Docker',
  'AWS',
  'Linux',
  'Git',
  'GitHub',
  'PostgreSQL',
  'MongoDB',
  'MySQL',
  'Supabase',
  'Vercel',
  'Figma',
  'Java',
  'JavaScript',
  'Power BI'
];

const categories = [
  { id: 'all', label: 'All', icon: Layers },
  { id: 'ai', label: 'AI & Agents', icon: Bot },
  { id: 'lang', label: 'Languages', icon: Code2 },
  { id: 'frontend', label: 'Frontend', icon: Sparkles },
  { id: 'cloud', label: 'Cloud & DevOps', icon: Cloud },
  { id: 'data', label: 'Databases', icon: Database },
];

const SKILLS_TO_EXCLUDE = new Set(['llm', 'llms', 'vscode', 'vs code', 'canva', 'gigma']);

/**
 * Robust Skill Icon component with graceful fallback to alternative icons
 */
const SkillIcon = ({ name }: { name: string }) => {
  const [error, setError] = useState(false);
  const iconUrl = getSkillIconUrl(name, true);
  const category = getSkillCategory(name);

  if (!iconUrl || error) {
    switch (category) {
      case 'ai':
        return <Bot className="w-full h-full text-red-400 p-0.5" />;
      case 'lang':
        return <Code2 className="w-full h-full text-blue-400 p-0.5" />;
      case 'frontend':
        return <Sparkles className="w-full h-full text-purple-400 p-0.5" />;
      case 'cloud':
        return <Cloud className="w-full h-full text-amber-400 p-0.5" />;
      case 'data':
        return <Database className="w-full h-full text-emerald-400 p-0.5" />;
      default:
        return <Cpu className="w-full h-full text-red-400 p-0.5" />;
    }
  }

  return (
    <img
      src={iconUrl}
      alt={name}
      loading="lazy"
      onError={() => setError(true)}
      className="w-full h-full object-contain filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]"
    />
  );
};

interface SkillCardProps {
  name: string;
  isCompact?: boolean;
}

const SkillCard: React.FC<SkillCardProps> = ({ name }) => {
  return (
    <div className="group relative flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2 sm:py-2.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-red-500/50 rounded-lg sm:rounded-xl backdrop-blur-md shadow-[0_2px_12px_rgba(0,0,0,0.25)] hover:shadow-[0_4px_22px_rgba(239,68,68,0.2)] transition-all duration-300 select-none shrink-0 cursor-default">
      {/* Icon (scaled for mobile & desktop) */}
      <div className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110">
        <SkillIcon name={name} />
      </div>

      {/* Prominent Skill Name */}
      <span className="text-xs sm:text-sm md:text-base font-sans font-semibold text-white/90 group-hover:text-white transition-colors tracking-tight whitespace-nowrap">
        {name}
      </span>
    </div>
  );
};

const SkillsSection = () => {
    const [tech, setTech] = useState<string[]>(defaultTech);

    const load = useCallback(async () => {
        const { data } = await supabase.from('skills').select('name, category');
        if (data && data.length) {
            const t = data
                .filter((s: any) => s.category === 'tech' && !SKILLS_TO_EXCLUDE.has(s.name.toLowerCase().trim()))
                .map((s: any) => s.name);
            setTech(t.length ? t : defaultTech);
        }
    }, []);

    useEffect(() => { load(); }, [load]);
    useRealtimeRefetch(['skills'], load);

    // Distribute skills evenly across 3 horizontal rows
    const { row1, row2, row3 } = useMemo(() => {
        const r1: string[] = [];
        const r2: string[] = [];
        const r3: string[] = [];

        tech.forEach((skill, idx) => {
            if (idx % 3 === 0) r1.push(skill);
            else if (idx % 3 === 1) r2.push(skill);
            else r3.push(skill);
        });

        // 4x repetition for seamless, infinite gapless loop
        return {
            row1: [...r1, ...r1, ...r1, ...r1],
            row2: [...r2, ...r2, ...r2, ...r2],
            row3: [...r3, ...r3, ...r3, ...r3],
        };
    }, [tech]);

    return (
        <section id="skills" className="relative py-2 sm:py-6 md:py-8 px-2 sm:px-4 bg-transparent z-10 overflow-hidden w-full">
            <div className="max-w-7xl mx-auto flex flex-col gap-1.5 sm:gap-2 mb-3 sm:mb-6 px-2 sm:px-4">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-2">
                    <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                            <span className="text-[9px] sm:text-xs font-mono uppercase tracking-[0.3em] text-red-500 font-bold">
                                Technical Arsenal
                            </span>
                        </div>
                        <h2 className="text-2xl sm:text-4xl md:text-5xl font-heading font-black text-white uppercase tracking-tight">
                            Skills & Stack
                        </h2>
                    </div>

                    <p className="text-[11px] sm:text-xs text-white/60 font-mono leading-relaxed max-w-md md:text-right">
                        Core engineering stack across AI agents, full-stack systems, and distributed cloud services.
                    </p>
                </div>
            </div>

            {/* ─── 3 Horizontal Alternating Marquee Rows ─── */}
            <div className="relative w-full overflow-hidden flex flex-col gap-2.5 sm:gap-4 md:gap-5">
                {/* Mobile-Proportional Left & Right Gradient Fade Overlays */}
                <div className="absolute top-0 bottom-0 left-0 w-8 sm:w-20 md:w-36 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent pointer-events-none z-20" />
                <div className="absolute top-0 bottom-0 right-0 w-8 sm:w-20 md:w-36 bg-gradient-to-l from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent pointer-events-none z-20" />

                {/* Row 1: Left to Right */}
                <div className="flex overflow-hidden w-full">
                    <div 
                        className="animate-marquee-right flex items-center gap-2.5 sm:gap-4"
                        style={{ '--marquee-speed': '42s' } as React.CSSProperties}
                    >
                        {row1.map((name, i) => (
                            <SkillCard key={`r1-${name}-${i}`} name={name} />
                        ))}
                    </div>
                </div>

                {/* Row 2: Right to Left */}
                <div className="flex overflow-hidden w-full">
                    <div 
                        className="animate-marquee-left flex items-center gap-2.5 sm:gap-4"
                        style={{ '--marquee-speed': '38s' } as React.CSSProperties}
                    >
                        {row2.map((name, i) => (
                            <SkillCard key={`r2-${name}-${i}`} name={name} />
                        ))}
                    </div>
                </div>

                {/* Row 3: Left to Right */}
                <div className="flex overflow-hidden w-full">
                    <div 
                        className="animate-marquee-right flex items-center gap-2.5 sm:gap-4"
                        style={{ '--marquee-speed': '45s' } as React.CSSProperties}
                    >
                        {row3.map((name, i) => (
                            <SkillCard key={`r3-${name}-${i}`} name={name} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SkillsSection;
