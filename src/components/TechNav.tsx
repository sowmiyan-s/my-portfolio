import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import ScrambleText from './ScrambleText';

const RESUME_URL = "https://drive.google.com/file/d/1NmangaAFo0eGT-KAsZi4VWOm6zI-KPk6/view?usp=sharing";

const navItems = [
    { to: '/', label: 'Home' },
    { to: '/achievements', label: 'Achievements' },
    { to: '/projects', label: 'Projects' },
    { to: '/contact', label: 'Contact' },
];

const TechNav = () => {
    const location = useLocation();
    const [open, setOpen] = useState(false);
    const [clickCount, setClickCount] = useState(0);

    const handleStatusClick = () => {
        const next = clickCount + 1;
        setClickCount(next);
        if (next >= 3) {
            window.dispatchEvent(new CustomEvent('trigger-status-egg'));
            setClickCount(0);
        }
        // Auto reset click count
        const timer = setTimeout(() => setClickCount(0), 1500);
        return () => clearTimeout(timer);
    };

    const isActive = (path: string) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    return (
        <nav className="fixed top-0 left-0 w-full z-50 px-3 sm:px-6 py-3 sm:py-4 flex justify-center pointer-events-none">
            <div className="max-w-7xl w-full bg-black/85 border border-red-500/30 backdrop-blur-xl pointer-events-auto px-4 md:px-8 py-2.5 md:py-3 flex items-center justify-between rounded-full">
                {/* Left placeholder desktop */}
                <div className="hidden lg:flex lg:flex-1" />

                {/* Center links (desktop) */}
                <div className="hidden md:flex items-center gap-4 md:gap-8 text-xs md:text-sm font-heading font-black uppercase tracking-widest">
                    {navItems.map(item => (
                        <Link
                            key={item.to}
                            to={item.to}
                            className={`relative py-1 transition-all font-bold ${isActive(item.to) ? 'text-red-500' : 'text-white/80 hover:text-red-500'}`}
                        >
                            <ScrambleText text={item.label} triggerOnHover />
                            {isActive(item.to) && (
                                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-red-600 rounded-full shadow-[0_0_8px_#FF0000]" />
                            )}
                        </Link>
                    ))}
                </div>

                {/* Mobile: brand + hamburger */}
                <span 
                    onClick={handleStatusClick}
                    className="md:hidden text-white font-heading font-black text-sm tracking-widest cursor-pointer select-none"
                >
                    SOWMIYAN<span className="text-red-600">.S</span>
                </span>
                <button
                    onClick={() => setOpen(v => !v)}
                    className="md:hidden text-white p-2 pointer-events-auto"
                    aria-label="Toggle navigation"
                >
                    {open ? <X size={18} /> : <Menu size={18} />}
                </button>

                {/* Right: resume (desktop) */}
                <div className="hidden lg:flex items-center gap-6 lg:flex-1 justify-end">
                    <a
                        href={RESUME_URL}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-1.5 bg-red-600/20 border border-red-600/50 text-red-400 hover:bg-red-600 hover:text-white transition-all text-[9px] font-heading font-black rounded-lg"
                    >
                        <ScrambleText text="RESUME" triggerOnHover />
                    </a>
                </div>
            </div>

            {/* Mobile dropdown */}
            {open && (
                <>
                    <div 
                        className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 pointer-events-auto"
                        onClick={() => setOpen(false)}
                    />
                    <div className="md:hidden absolute top-full left-3 right-3 mt-2 bg-black/95 border border-red-500/30 backdrop-blur-2xl pointer-events-auto p-5 flex flex-col gap-2 rounded-2xl z-50 shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
                        {navItems.map(item => (
                            <Link
                                key={item.to}
                                to={item.to}
                                onClick={() => setOpen(false)}
                                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-heading font-black uppercase tracking-widest transition-colors ${
                                    isActive(item.to) 
                                        ? 'text-red-500 bg-red-500/10 border border-red-500/30' 
                                        : 'text-white/80 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <span>{item.label}</span>
                                {isActive(item.to) && (
                                    <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
                                )}
                            </Link>
                        ))}
                        <a
                            href={RESUME_URL}
                            target="_blank"
                            rel="noreferrer"
                            onClick={() => setOpen(false)}
                            className="mt-2 px-4 py-3.5 bg-red-600 hover:bg-red-700 text-white text-center text-xs font-heading font-black uppercase tracking-widest rounded-xl transition-colors shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                        >
                            Download Resume
                        </a>
                    </div>
                </>
            )}
        </nav>
    );
};

export default TechNav;
