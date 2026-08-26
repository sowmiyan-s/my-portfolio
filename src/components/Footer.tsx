import React from 'react';
import { Mail, MapPin, Linkedin, Instagram, Phone, PenTool, Twitter, Youtube } from 'lucide-react';
import ScrambleText from './ScrambleText';
import MarqueeSection from './MarqueeSection';

const Footer = () => {
    return (
        <>
            <MarqueeSection />
            <footer id="contact" className="relative py-16 px-6 cross-bg border-t border-white/10 z-10 overflow-hidden bg-black text-white">
            <div className="absolute top-0 right-0 w-64 h-64 border border-white/10 -translate-y-1/2 translate-x-1/2 rotate-45 pointer-events-none opacity-20" />

            <div className="max-w-7xl mx-auto flex flex-col gap-12 relative">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-12 border-t border-white/10 pt-12">
                    <div className="flex flex-col gap-4">
                        <span className="text-[10px] font-mono opacity-40 uppercase tracking-widest text-red-600">
                            <ScrambleText text="Location" triggerOnHover />
                        </span>
                        <div className="flex items-start gap-3 opacity-80 hover:opacity-100 transition-opacity">
                            <MapPin size={14} className="mt-1 flex-shrink-0 text-red-600" />
                            <p className="text-xs font-mono tracking-tight leading-relaxed">
                                Kandampalayam, Tiruchengode<br/>
                                Namakkal, Tamil Nadu — 637203
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <span className="text-[10px] font-mono opacity-40 uppercase tracking-widest text-red-600">
                            <ScrambleText text="Contact Me" triggerOnHover />
                        </span>
                        <div className="flex flex-col gap-3">
                            <a href="mailto:sowmisowmiyan58@gmail.com" className="flex items-center gap-3 text-xs font-mono transition-colors hover:text-red-600 uppercase">
                                <Mail size={14} className="text-red-600" /> <ScrambleText text="Email" triggerOnView speed={0.16} className="text-current" />
                            </a>
                            <a href="https://wa.me/919042561295" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-xs font-mono transition-colors hover:text-red-600 uppercase">
                                <Phone size={14} className="text-red-600" /> <ScrambleText text="WhatsApp" triggerOnView speed={0.16} className="text-current" />
                            </a>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <span className="text-[10px] font-mono opacity-40 uppercase tracking-widest text-red-600">
                            <ScrambleText text="Social Media" triggerOnHover />
                        </span>
                        <div className="flex flex-col gap-3">
                            <a href="https://linkedin.com/in/sowmiyan-s" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-xs font-mono transition-colors hover:text-red-600 uppercase">
                                <Linkedin size={14} className="text-red-600" /> <ScrambleText text="LinkedIn" triggerOnView speed={0.18} className="text-current" />
                            </a>
                            <a href="https://youtube.com/@bound-by-code" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-xs font-mono transition-colors hover:text-red-600 uppercase">
                                <Youtube size={14} className="text-red-600" /> <ScrambleText text="YouTube" triggerOnView speed={0.18} className="text-current" />
                            </a>
                            <a href="https://instagram.com/sowmiyan.s_" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-xs font-mono transition-colors hover:text-red-600 uppercase">
                                <Instagram size={14} className="text-red-600" /> <ScrambleText text="Instagram" triggerOnView speed={0.18} className="text-current" />
                            </a>
                            <a href="https://twitter.com/sowmiyan_s" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-xs font-mono transition-colors hover:text-red-600 uppercase">
                                <Twitter size={14} className="text-red-600" /> <ScrambleText text="X (Twitter)" triggerOnView speed={0.18} className="text-current" />
                            </a>
                            <a href="https://medium.com/@sowmiyan_s_" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-xs font-mono transition-colors hover:text-red-600 uppercase">
                                <PenTool size={14} className="text-red-600" /> <ScrambleText text="Medium" triggerOnView speed={0.18} className="text-current" />
                            </a>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 md:text-right md:items-end">
                        <span className="text-[10px] font-mono opacity-40 uppercase tracking-widest text-red-600">
                            <ScrambleText text="About" triggerOnHover />
                        </span>
                        <p className="text-xs font-mono opacity-70 leading-relaxed">
                            <ScrambleText text="Building intelligent systems & modern web applications." triggerOnView speed={0.15} />
                        </p>
                        <span className="text-[10px] font-mono opacity-50 tracking-widest uppercase mt-auto">
                            © 2026 Sowmiyan S. All rights reserved.
                        </span>
                    </div>
                </div>
            </div>

            <div className="absolute left-6 bottom-6 flex items-center gap-3 group cursor-pointer transition-colors" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
                <div className="w-8 h-[1px] bg-red-600 group-hover:w-14 transition-all duration-300" />
                <span className="text-[10px] font-mono uppercase opacity-50 group-hover:opacity-100 transition-opacity">Back to Top ↑</span>
            </div>
        </footer>
        </>
    );
};

export default Footer;
