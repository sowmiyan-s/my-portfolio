import React, { useState } from 'react';
import { motion } from 'framer-motion';
import TechNav from '@/components/TechNav';
import Footer from '@/components/Footer';

import PageHero from '@/components/PageHero';
import { certificatesList, Certificate } from '@/lib/certificates';
import EbookShowcase from '@/components/EbookShowcase';
import LeetCodeShowcase from '@/components/LeetCodeShowcase';
import RedCrackPattern from '@/components/RedCrackPattern';
import MarqueeSection from '@/components/MarqueeSection';

const achievements = [
  { type: 'PATENT', title: 'SMART DUSTBIN', desc: 'Integrated IoT-based waste monitoring & automated collection protocol.', icon: '⚙️' },
  { type: 'AWARD', title: 'HACKATHON RUNNER UP', desc: 'Secured 2nd prize in inter-college coding sprint among 20+ teams.', icon: '🏆' },
  { type: 'WORKSHOP', title: 'GEN AI WORKSHOP', desc: 'Orchestrated generative AI technical session for 50+ students.', icon: '🎓' },
  { type: 'BOOK', title: 'BOOK AUTHOR', desc: 'Architected and published "Python for Beginners" technical manual.', icon: '📖' },
  { type: 'PAPER', title: 'CYBER CRIME RESEARCH', desc: 'Research paper published in IJCRT on digital threat vectors.', icon: '📄' },
];

// Certifications are loaded dynamically from certificatesList utility

const counters = [
  { label: 'Patents Filed', value: '1' },
  { label: 'Awards Won', value: '2' },
  { label: 'Certifications', value: `${certificatesList.length}+` },
  { label: 'Papers Published', value: '1' },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const AchievementsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  const filteredCerts = certificatesList.filter(cert => {
    return cert.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="relative min-h-screen bg-transparent text-foreground selection:bg-primary font-body overflow-x-hidden">
      <TechNav />
      <main className="relative z-10">
        <PageHero
          sectionNumber="SERVICE RECORDS"
          title="ACCOLADES & RECORDS"
          subtitle="Patents, awards, publications, and certifications earned along the way."
        />

        {/* Animated Counters */}
        <section className="px-6 py-16">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {counters.map((c, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="glass-strong p-6 flex flex-col gap-2 text-center group hover:border-primary/50 transition-all duration-300"
              >
                <span className="text-3xl md:text-4xl font-heading font-black text-primary">{c.value}</span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{c.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <MarqueeSection />

        {/* Achievements Grid */}
        <section className="px-6 py-16">
          <div className="max-w-7xl mx-auto">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {achievements.map((item, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  whileHover={{ y: -4, borderColor: 'hsl(var(--primary) / 0.5)' }}
                  className="glass-strong p-8 flex flex-col gap-4 group transition-all duration-300 hover:shadow-[0_0_30px_hsl(var(--primary)/0.15)]"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-primary border border-primary/30 px-3 py-1 uppercase tracking-widest">
                      {item.type}
                    </span>
                  </div>
                  <h3 className="text-lg font-heading font-bold uppercase tracking-tight group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs font-mono text-muted-foreground uppercase leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <MarqueeSection />

        {/* eBook Showcase */}
        <EbookShowcase />

        <MarqueeSection />

        {/* LeetCode Showcase */}
        <LeetCodeShowcase />

        <MarqueeSection />

        {/* Certifications */}
        <RedCrackPattern>
          <section className="px-6 py-16 border-t border-foreground/5 relative z-10">
            <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <motion.h2
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-3xl md:text-5xl font-heading font-black uppercase tracking-tighter"
              >
                Certifications
              </motion.h2>

              {/* Search Bar */}
              <div className="relative max-w-xs w-full">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Certificates..."
                  className="w-full bg-black/40 border border-white/10 px-4 py-2 font-mono text-xs text-white focus:outline-none focus:border-red-600 transition-colors uppercase tracking-widest rounded-sm placeholder:opacity-50"
                />
              </div>
            </div>


            {/* Certificates Grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {filteredCerts.map((cert, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  whileHover={{ y: -4 }}
                  onClick={() => setSelectedCert(cert)}
                  className="glass-strong p-3 flex flex-col gap-3 group border border-white/10 hover:border-red-600 transition-all duration-300 cursor-pointer shadow-md rounded-sm animate-in fade-in duration-300"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden border border-white/5 bg-black">
                    <img 
                      src={cert.image} 
                      alt={cert.name} 
                      className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-102 transition-all duration-500" 
                    />
                  </div>
                  <div className="flex flex-col gap-1 text-left px-1 py-1">
                    <h4 className="text-xs font-heading font-black text-white uppercase tracking-tight line-clamp-1 group-hover:text-red-500 transition-colors leading-tight">{cert.name}</h4>
                    <p className="text-[9px] font-mono text-muted-foreground uppercase">VERIFIED RECORD</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {filteredCerts.length === 0 && (
              <div className="w-full text-center py-12 font-mono text-xs text-muted-foreground uppercase tracking-widest">
                No certificates found matching criteria.
              </div>
            )}
          </div>
        </section>
        </RedCrackPattern>

        <MarqueeSection />

        {/* Education */}
        <section className="px-6 py-16 border-t border-foreground/5">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="glass-strong p-10 flex flex-col gap-4"
            >
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Education History</span>
              <h3 className="text-2xl font-heading font-bold uppercase">B.Tech in AI & Data Science</h3>
              <p className="text-sm font-mono text-muted-foreground">V.S.B. College of Engineering, Coimbatore</p>
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-foreground/5">
                <span className="text-primary font-mono text-sm font-bold">CGPA: 8.53</span>
                <span className="text-[10px] text-muted-foreground font-mono">Present Status: Final Year</span>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

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

      <Footer />
    </div>
  );
};

export default AchievementsPage;
