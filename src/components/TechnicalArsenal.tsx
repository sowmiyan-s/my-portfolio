import React from 'react';

const skills = [
    { title: 'AI & Multi-Agent Systems (CrewAI)', level: 95, status: 'Advanced' },
    { title: 'Python & Java Engineering', level: 90, status: 'Proficient' },
    { title: 'Data Analytics & Power BI', level: 88, status: 'Proficient' },
    { title: 'AWS Cloud & Deployment', level: 82, status: 'Proficient' },
    { title: 'SQL & Database Architecture', level: 92, status: 'Advanced' },
    { title: 'Prompt Engineering & RAG', level: 94, status: 'Advanced' }
];

const TechnicalArsenal = () => {
    return (
        <section id="arsenal" className="relative py-24 px-6 grid-bg-dense border-t border-white/10 z-10">
            <div className="max-w-7xl mx-auto flex flex-col gap-16 relative">
                <div className="flex justify-between items-center py-6 border-y border-white/10 mb-12 bg-stone-900/10 px-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-red-600" />
                    <div className="flex flex-col">
                        <h2 className="text-3xl md:text-5xl font-heading font-bold text-white uppercase tracking-tight">Technical Skills & Expertise</h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {skills.map((skill, i) => (
                        <div key={i} className="flex flex-col gap-4 p-8 border border-white/10 group transition-all duration-300 hover:border-red-600 cursor-default bg-black/40 rounded-xl">
                            <div className="flex justify-between items-start">
                                <span className="text-xs font-mono py-0.5 px-2 border border-red-500/30 text-red-400 bg-red-500/10 rounded">
                                    {skill.status}
                                </span>
                            </div>

                            <div className="flex flex-col gap-4">
                                <h3 className="text-lg font-heading font-bold uppercase tracking-tight text-white">{skill.title}</h3>
                                
                                <div className="w-full h-1.5 bg-white/10 relative rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-red-600 transition-all duration-1000 group-hover:bg-red-500 rounded-full" 
                                        style={{ width: `${skill.level}%` }} 
                                    />
                                </div>
                                <div className="text-right text-xs font-mono text-white/50 -mt-2">
                                    Proficiency: {skill.level}%
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TechnicalArsenal;
