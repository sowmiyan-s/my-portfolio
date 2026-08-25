import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { getSkillIconUrl } from '@/lib/skillIcons';
import { useRealtimeRefetch } from '@/hooks/useRealtimeRefetch';
import { Users, MessageSquare, Target, Brain, Presentation, Handshake } from 'lucide-react';

const defaultTech = [
  'Python',
  'Java',
  'SQL',
  'LangChain',
  'CrewAI',
  'Hugging Face',
  'MongoDB',
  'MySQL',
  'AWS',
  'Vercel',
  'Netlify',
  'Docker',
  'Linux',
  'Tailwind CSS',
  'React',
  'Vite',
  'Figma',
  'Claude',
  'Git',
  'GitHub',
  'Ollama',
  'n8n',
  'Power BI',
];

const softIconMap: Record<string, any> = {};

const SKILLS_TO_EXCLUDE = new Set(['llm', 'llms', 'vscode', 'vs code', 'canva', 'gigma']);

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


    const isMobile = typeof window !== 'undefined' && (
        window.innerWidth <= 768 ||
        (window.matchMedia && window.matchMedia('(hover: none) and (pointer: coarse)').matches)
    );

    return (
        <section className="relative py-10 md:py-16 px-4 sm:px-6 bg-transparent z-10 overflow-hidden">
            <div className="max-w-7xl mx-auto flex flex-col gap-6 md:gap-8">
                <div className="flex flex-col gap-2 md:gap-3 border-l-2 border-red-600 pl-4">
                    <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-red-500">02 // Capability Matrix</span>
                    <h2 className="text-3xl sm:text-4xl md:text-6xl font-heading font-black text-white uppercase tracking-tighter">Skills</h2>
                </div>

                <div className="grid gap-6">
                    <div className="grid gap-4">
                        <p className="max-w-3xl text-xs md:text-base text-white/70 leading-relaxed font-mono">
                            A practical toolkit for AI product engineering, modern deployment, and visual design. These are the skills I lean on to build fast, functional and production-ready work.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3">
                        {tech.map((name, i) => {
                            const icon = getSkillIconUrl(name);
                            return (
                                <motion.div
                                    key={`tech-${name}-${i}`}
                                    initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 20 }}
                                    whileInView={isMobile ? undefined : { opacity: 1, y: 0 }}
                                    transition={isMobile ? undefined : { duration: 0.4, delay: i * 0.02 }}
                                    viewport={{ once: true }}
                                    className="group flex flex-col items-center justify-center gap-1.5 md:gap-3 p-3 md:p-4 border border-white/10 bg-neutral-950/60 rounded-xl md:rounded-2xl text-center shadow-[0_10px_30px_rgba(0,0,0,0.4)] transition-all duration-300 hover:-translate-y-1 hover:border-red-500 hover:shadow-[0_15px_30px_rgba(255,0,0,0.15)]"
                                    title={name}
                                >
                                    {icon ? (
                                        <img
                                            src={icon}
                                            alt={name}
                                            loading="lazy"
                                            className="w-5 h-5 md:w-6 md:h-6 object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                                        />
                                    ) : (
                                        <div className="w-5 h-5 md:w-6 md:h-6 flex items-center justify-center font-mono text-[9px] md:text-[10px] text-white/70 border border-white/10 rounded-full">
                                            {name.slice(0, 2).toUpperCase()}
                                        </div>
                                    )}
                                    <span className="text-[10px] md:text-xs font-mono text-white/75 group-hover:text-white leading-tight tracking-tight">
                                        {name}
                                    </span>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SkillsSection;
