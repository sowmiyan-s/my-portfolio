import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { certificatesList, Certificate } from '@/lib/certificates';

const achievements = [
    { type: 'PATENT', title: 'SMART DUSTBIN (IOT-01)', desc: 'IoT waste monitoring & automated collection protocol.', hash: 'PAT-7729-AX' },
    { type: 'AWARD', title: 'HACKATHON // RUNNER UP', desc: 'Secured 2nd prize in inter-college coding sprint.', hash: 'AWD-9104-BR' },
    { type: 'WORKSHOP', title: 'INTEL_LEAD // GEN AI', desc: 'Generative AI technical session for 50+ students.', hash: 'WKS-2231-LD' },
    { type: 'BOOK', title: 'CORE_DOCS // AUTHOR', desc: 'Published "Python for Beginners" technical manual.', hash: 'PUB-1102-BK' },
    { type: 'PAPER', title: 'OSINT_RSCH // CYBER CRIME', desc: 'Research paper published in IJCRT (Threat Vectors).', hash: 'RSR-5541-IJ' }
];

const AchievementsSection = () => {
    const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

    return (
        <section id="achievements" className="relative py-24 px-6 grid-bg border-t border-white/10 z-10">
            <div className="max-w-7xl mx-auto flex flex-col gap-12">
                <div className="flex justify-between items-center py-6 border-y border-white/10 mb-8 bg-black/40 px-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-red-600" />
                    <div className="flex flex-col">
                        <span className="text-[10px] opacity-40 font-mono tracking-[0.5em]">02 // SERVICE RECORDS</span>
                        <h2 className="text-4xl md:text-6xl font-heading font-black text-white uppercase tracking-tight">ACCOLADES AND RECORDS</h2>
                    </div>
                </div>
                <div className="w-full h-1 bg-red-600 mt-2" />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Achievements List */}
                    <div className="flex flex-col gap-4">
                        {achievements.map((item, i) => (
                            <div key={i} className="flex items-center gap-6 p-4 border border-white/5 hover:border-red-600/50 transition-all bg-black/20 group">
                                <span className="text-[10px] font-mono text-red-600 border border-red-600/30 px-2 py-1 w-20 text-center">
                                    {item.type}
                                </span>
                                <div className="flex flex-col flex-1">
                                    <h3 className="text-sm font-heading font-bold uppercase group-hover:text-red-600 transition-colors">{item.title}</h3>
                                    <p className="text-[10px] font-mono opacity-40 uppercase">{item.desc}</p>
                                </div>
                                <span className="text-[8px] font-mono opacity-20 group-hover:opacity-40">{item.hash}</span>
                            </div>
                        ))}
                    </div>

                    {/* Certifications & Education */}
                    <div className="flex flex-col gap-12">
                        <div className="flex flex-col gap-6">
                            <div className="flex justify-between items-center border-l-2 border-red-600 pl-4 pr-2">
                                <span className="text-xs font-mono opacity-40 uppercase tracking-widest">Validated_Certifications</span>
                                <Link 
                                    to="/achievements" 
                                    className="text-[10px] font-mono text-red-500 hover:text-white uppercase tracking-wider transition-colors flex items-center gap-1 font-bold"
                                >
                                    View All ({certificatesList.length}) →
                                </Link>
                            </div>
                            
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {certificatesList.slice(0, 6).map((cert, i) => (
                                    <div 
                                        key={i} 
                                        onClick={() => setSelectedCert(cert)}
                                        className="relative aspect-[4/3] border border-white/10 bg-black/40 hover:border-red-600 transition-all cursor-pointer overflow-hidden group shadow-md rounded-sm"
                                    >
                                        <img 
                                            src={cert.image} 
                                            alt={cert.name} 
                                            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" 
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
                                        <div className="absolute bottom-2 left-2 right-2 flex flex-col pointer-events-none">
                                            <span className="text-[10px] font-heading font-black text-white uppercase tracking-tight line-clamp-1 leading-tight">{cert.name}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 border-t border-white/10 pt-8">
                            <span className="text-xs font-mono opacity-40 uppercase tracking-widest">Education_History</span>
                            <div className="flex flex-col gap-1">
                                <h3 className="font-heading font-bold uppercase text-lg">B.Tech in AI & DS</h3>
                                <p className="text-xs font-mono opacity-60">V.S.B. College of Engineering, Coimbatore</p>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-red-600 font-mono text-xs">CGPA: 8.53</span>
                                    <span className="text-[10px] opacity-20 font-mono">Present Status: Final Year</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Certificate Modal Lightbox */}
            {selectedCert && (
                <div 
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
                    onClick={() => setSelectedCert(null)}
                >
                    <div 
                        className="relative max-w-4xl w-full bg-neutral-950 border border-white/10 p-4 md:p-6 shadow-2xl flex flex-col gap-4 rounded-sm animate-in fade-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button 
                            className="absolute -top-10 right-0 text-white hover:text-red-500 font-mono text-xs uppercase tracking-widest flex items-center gap-2"
                            onClick={() => setSelectedCert(null)}
                        >
                            [ Close X ]
                        </button>
                        <div className="relative aspect-[4/3] w-full overflow-hidden border border-white/5 bg-black">
                            <img 
                                src={selectedCert.image} 
                                alt={selectedCert.name} 
                                className="w-full h-full object-contain" 
                            />
                        </div>
                        <div className="flex justify-between items-center border-t border-white/5 pt-4 mt-2">
                            <div className="flex flex-col gap-1 text-left">
                                <h3 className="font-heading font-bold text-lg uppercase tracking-tight text-white">{selectedCert.name}</h3>
                                <p className="text-xs font-mono text-muted-foreground uppercase">RECORDED CERTIFICATE</p>
                            </div>
                            <a 
                                href={selectedCert.image} 
                                download 
                                className="px-4 py-2 border border-red-600 text-[10px] font-mono text-red-500 hover:bg-red-600 hover:text-white transition-all uppercase tracking-widest font-bold rounded-sm shrink-0"
                            >
                                Download Record
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default AchievementsSection;
