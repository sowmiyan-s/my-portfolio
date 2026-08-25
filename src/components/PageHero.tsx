import React from 'react';
import { motion } from 'framer-motion';
import ScrambleText from './ScrambleText';

interface PageHeroProps {
  sectionNumber: string;
  title: string;
  subtitle?: string;
}

const PageHero: React.FC<PageHeroProps> = ({ sectionNumber, title, subtitle }) => {
  return (
    <section className="relative px-4 sm:px-6 pt-24 sm:pt-32 pb-10 sm:pb-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-4 sm:gap-6 border-b border-primary/30 pb-8 sm:pb-12">
          <span className="text-[10px] sm:text-xs opacity-50 font-mono italic tracking-widest block">
            <ScrambleText text={sectionNumber} delay={0.1} />
          </span>

          <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-heading font-black text-foreground uppercase tracking-tight break-words leading-tight">
            <ScrambleText text={title} speed={0.5} delay={0.3} />
          </h1>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="w-48 h-1 bg-primary shadow-[0_0_15px_hsl(var(--primary)/0.8)] origin-left"
          />

          {subtitle && (
            <p className="text-sm font-mono text-muted-foreground/60 max-w-xl uppercase tracking-wider">
              <ScrambleText text={subtitle} speed={0.4} delay={0.8} />
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default PageHero;
