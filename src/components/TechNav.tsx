import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import GlassSurface from './GlassSurface';

const RESUME_URL = "https://drive.google.com/file/d/1NmangaAFo0eGT-KAsZi4VWOm6zI-KPk6/view?usp=sharing";

const navItems = [
    { to: '/', label: 'Home' },
    { to: '/projects', label: 'Projects' },
    { to: '/achievements', label: 'Achievements' },
    { to: '/contact', label: 'Contact' },
];

const TechNav = () => {
    const location = useLocation();
    const [open, setOpen] = useState(false);

    const isActive = (path: string) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    return (
        <nav className="fixed top-0 left-0 w-full z-50 px-3 sm:px-6 py-3 sm:py-4 flex justify-center pointer-events-none">
            {/* Desktop Navbar: Powered by React Bits <GlassSurface /> */}
            <div className="hidden md:block max-w-3xl w-full pointer-events-auto">
                <GlassSurface
                    width="100%"
                    height={54}
                    borderRadius={9999}
                    borderWidth={0.06}
                    brightness={45}
                    backgroundOpacity={0.25}
                    saturation={1.4}
                    distortionScale={-100}
                    redOffset={0}
                    greenOffset={8}
                    blueOffset={16}
                    className="border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
                >
                    <div className="w-full px-4 sm:px-7 flex items-center justify-between">
                        {/* Center links (desktop) */}
                        <div className="flex items-center gap-6 text-xs font-mono font-medium uppercase tracking-wider">
                            {navItems.map(item => (
                                <Link
                                    key={item.to}
                                    to={item.to}
                                    className={`relative py-1 transition-colors ${
                                        isActive(item.to) 
                                            ? 'text-red-500 font-bold' 
                                            : 'text-white/70 hover:text-white'
                                    }`}
                                >
                                    <span>{item.label}</span>
                                    {isActive(item.to) && (
                                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-red-600 rounded-full shadow-[0_0_8px_#ef4444]" />
                                    )}
                                </Link>
                            ))}
                        </div>

                        {/* Right: Resume button (desktop) */}
                        <div className="flex items-center gap-3">
                            <a
                                href={RESUME_URL}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white/5 hover:bg-red-600 text-white/90 hover:text-white border border-white/15 hover:border-red-500 transition-all text-[11px] font-mono font-semibold uppercase tracking-wider rounded-full shadow-sm hover:scale-105"
                            >
                                <span>Resume</span>
                                <ArrowUpRight size={12} />
                            </a>
                        </div>
                    </div>
                </GlassSurface>
            </div>

            {/* Mobile Navbar: Standard Clean Mobile Pill (GlassSurface desktop only) */}
            <div className="md:hidden max-w-lg w-full bg-neutral-950/80 border border-white/15 backdrop-blur-xl pointer-events-auto px-5 py-2.5 flex items-center justify-between rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                <span className="text-xs font-mono font-bold text-red-500 uppercase tracking-widest">
                    Sowmiyan S
                </span>
                <button
                    onClick={() => setOpen(v => !v)}
                    className="text-white/90 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors pointer-events-auto"
                    aria-label="Toggle navigation menu"
                >
                    {open ? <X size={18} /> : <Menu size={18} />}
                </button>
            </div>

            {/* Simple, Clean Mobile Dropdown Menu */}
            {open && (
                <>
                    <div 
                        className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 pointer-events-auto"
                        onClick={() => setOpen(false)}
                    />
                    <div className="md:hidden absolute top-full left-3 right-3 mt-2 bg-neutral-950/95 border border-white/15 backdrop-blur-2xl pointer-events-auto p-3 flex flex-col gap-1 rounded-2xl z-50 shadow-2xl">
                        {navItems.map(item => (
                            <Link
                                key={item.to}
                                to={item.to}
                                onClick={() => setOpen(false)}
                                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-colors ${
                                    isActive(item.to) 
                                        ? 'text-red-500 bg-red-500/10 font-bold' 
                                        : 'text-white/80 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <span>{item.label}</span>
                                {isActive(item.to) && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                )}
                            </Link>
                        ))}
                        
                        <div className="pt-2 mt-1 border-t border-white/10">
                            <a
                                href={RESUME_URL}
                                target="_blank"
                                rel="noreferrer"
                                onClick={() => setOpen(false)}
                                className="flex items-center justify-center gap-1.5 w-full py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold uppercase tracking-wider rounded-xl transition-colors shadow-md"
                            >
                                <span>View Resume</span>
                                <ArrowUpRight size={13} />
                            </a>
                        </div>
                    </div>
                </>
            )}
        </nav>
    );
};

export default TechNav;
