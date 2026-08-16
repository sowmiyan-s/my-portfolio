import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Code, Cpu } from 'lucide-react';
import TechNav from '@/components/TechNav';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import ScrambleText from '@/components/ScrambleText';
import MagicBento from '@/components/MagicBento';
import AcidSquares from '@/components/AcidSquares';

const offeringCards = [
    {
        title: "HIRE ME",
        subtitle: "Full-Time & Internships",
        desc: "Ready to join dynamic engineering teams. Passionate about bringing advanced Generative AI and robust Full-Stack architectures to your codebase.",
        icon: Briefcase,
        color: "text-red-500",
        actionText: "View Resume",
        actionUrl: "https://drive.google.com/file/d/1NmangaAFo0eGT-KAsZi4VWOm6zI-KPk6/view?usp=sharing",
        features: [
            "AI Engineer / Full-Stack",
            "LLM & Multi-Agent systems",
            "Next.js / React / TypeScript",
            "Python / FastAPI / SQL",
            "Namakkal, TN / Relocatable"
        ]
    },
    {
        title: "FREELANCE WORKS",
        subtitle: "Custom MVPs & Apps",
        desc: "Turning your creative ideas into production-ready software. Providing end-to-end frontend/backend solutions, custom AI tools, and integrations.",
        icon: Code,
        color: "text-emerald-400",
        actionText: "Pitch Project",
        actionUrl: "https://wa.me/919042561295?text=Hi%20Sowmiyan,%20I%20have%20a%20freelance%20project%20idea.",
        features: [
            "Custom MVP Development",
            "Generative AI UI / Chatbots",
            "Third-party API Integration",
            "Responsive Web Applications",
            "Maintenance & Handover"
        ]
    },
    {
        title: "TECH SOLUTIONS",
        subtitle: "AI Integrations & Automations",
        desc: "Consulting and building advanced tech solutions like LLM automation workflows, multi-agent frameworks, prompt tuning, and databases.",
        icon: Cpu,
        color: "text-blue-400",
        actionText: "Consult Now",
        actionUrl: "mailto:sowmisowmiyan58@gmail.com?subject=Consulting%20Inquiry%20-%20Tech%20Solutions",
        features: [
            "LLM & RAG Systems",
            "Multi-Agent Frameworks",
            "Vector DB & Embeddings",
            "Performance Tuning",
            "1-on-1 Tech Consulting"
        ]
    }
];

const ContactPage = () => {
    return (
        <div className="relative min-h-screen text-white selection:bg-red-600 overflow-x-hidden bg-[#0a0a0a]">
            {/* Fixed AcidSquares Background */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-85">
                <AcidSquares
                    color1="#ef4444"
                    color2="#f87171"
                    color3="#ffffff"
                    detail="medium"
                    speed={0.5}
                    waveDepth={0.8}
                    zoom={1.3}
                    density={10.0}
                    glow={1.0}
                    exposure={2500}
                    spread={0.3}
                    stepSize={0.002}
                    colorShift={0}
                    contrast={1}
                    brightness={1.0}
                    opacity={0.85}
                    mouseInteraction={true}
                    mouseStrength={0.15}
                    mouseRadius={0.35}
                    blur={0}
                    grain={true}
                    grainIntensity={0.05}
                />
            </div>
            <style dangerouslySetInnerHTML={{ __html: `
                .contact-card-container {
                    --white: hsl(0, 0%, 100%);
                    --black: hsl(0, 0%, 0%);
                    --paragraph: hsl(0, 0%, 83%);
                    --line: hsl(0, 0%, 20%);
                    --primary: hsl(var(--theme-color));

                    position: relative;
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                    padding: 2.25rem 2rem;
                    border-radius: 1.25rem;
                    overflow: hidden;
                    transition: all 0.3s ease;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }

                @media (max-width: 768px) {
                    .contact-card-container {
                        padding: 1.5rem 1.25rem;
                        gap: 1rem;
                        border-radius: 1rem;
                    }
                    .contact-card-container .card__list {
                        gap: 0.5rem;
                    }
                    .contact-card-container .card__list .card__list_item .check {
                        width: 1rem;
                        height: 1rem;
                    }
                    .contact-card-container .card__list .card__list_item .check .check_svg {
                        width: 0.65rem;
                        height: 0.65rem;
                    }
                    .contact-card-container .card__list .card__list_item .list_text {
                        font-size: 0.7rem;
                    }
                    .contact-card-container .button-card {
                        padding: 0.6rem;
                        font-size: 0.75rem;
                    }
                }

                .contact-card-container .card__bg {
                    position: absolute;
                    inset: 1px;
                    border-radius: 1.2rem;
                    background-color: #050505;
                    background-image: 
                        radial-gradient(at 88% 40%, #050505 0px, transparent 85%),
                        radial-gradient(at 49% 30%, #050505 0px, transparent 85%),
                        radial-gradient(at 14% 26%, #050505 0px, transparent 85%),
                        radial-gradient(at 0% 64%, hsla(var(--theme-color), 0.15) 0px, transparent 85%),
                        radial-gradient(at 41% 94%, hsla(var(--theme-color), 0.2) 0px, transparent 85%),
                        radial-gradient(at 100% 99%, hsla(var(--theme-color), 0.25) 0px, transparent 85%);
                    box-shadow: 0px -16px 24px 0px rgba(255, 255, 255, 0.05) inset;
                    z-index: 2;
                    pointer-events: none;
                }

                .contact-card-container:hover {
                    border-color: hsla(var(--theme-color), 0.4);
                    box-shadow: 0px 0px 30px hsla(var(--theme-color), 0.15);
                }

                .contact-card-container .card__border {
                    overflow: hidden;
                    pointer-events: none;
                    position: absolute;
                    z-index: 1;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: calc(100% + 2px);
                    height: calc(100% + 2px);
                    border-radius: 1.25rem;
                    opacity: 0.15;
                    transition: opacity 0.3s ease;
                }

                .contact-card-container:hover .card__border {
                    opacity: 1;
                }

                .contact-card-container .card__border::before {
                    content: "";
                    pointer-events: none;
                    position: absolute;
                    z-index: 2;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    background-image: conic-gradient(
                        transparent,
                        hsl(var(--theme-color)) 10%,
                        transparent 30%
                    );
                    animation: rotate-card-border 6s linear infinite;
                }

                @keyframes rotate-card-border {
                    to {
                        transform: rotate(360deg);
                    }
                }

                .contact-card-container .button-card {
                    cursor: pointer;
                    padding: 0.75rem;
                    width: 100%;
                    background-image: linear-gradient(
                        0deg,
                        hsla(var(--theme-color), 0.9) 0%,
                        hsl(var(--theme-color)) 100%
                    );
                    font-size: 0.8rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    color: var(--white);
                    border: 0;
                    border-radius: 9999px;
                    box-shadow: inset 0 -2px 25px -4px var(--white);
                    transition: transform 0.2s, opacity 0.2s;
                }

                .contact-card-container .button-card:hover {
                    transform: scale(1.02);
                    opacity: 0.95;
                }

                .contact-card-container .line {
                    width: 100%;
                    height: 1px;
                    background-color: var(--line);
                    border: none;
                    margin: 0.5rem 0;
                }

                .contact-card-container .card__list {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                    flex-grow: 1;
                    padding: 0;
                    margin: 0;
                    list-style: none;
                }

                .contact-card-container .card__list .card__list_item {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .contact-card-container .card__list .card__list_item .check {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 1.25rem;
                    height: 1.25rem;
                    background-color: var(--primary);
                    border-radius: 50%;
                    flex-shrink: 0;
                }

                .contact-card-container .card__list .card__list_item .check .check_svg {
                    width: 0.85rem;
                    height: 0.85rem;
                    fill: var(--black) !important;
                    color: var(--black) !important;
                }

                .contact-card-container .card__list .card__list_item .list_text {
                    font-size: 0.8rem;
                    color: var(--white);
                    font-family: monospace;
                }
            `}} />

            <TechNav />

            <main className="relative z-10">
                <PageHero
                    sectionNumber="Contact"
                    title="Get in Touch"
                    subtitle="Available for freelance projects, internships and full-time roles."
                />

                <section className="relative w-full py-20 md:py-28 px-4 sm:px-6 flex flex-col items-center justify-center overflow-hidden">
                    <div className="relative z-10 max-w-6xl w-full mx-auto flex flex-col items-center gap-6">

                        {/* Direct Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full justify-center max-w-2xl mb-12">
                            <motion.a
                                href="mailto:sowmisowmiyan58@gmail.com"
                                whileHover={{ y: -2 }}
                                className="flex-1 px-6 md:px-10 py-4 md:py-5 border border-white/10 bg-white/5 hover:bg-white hover:text-black hover:border-white transition-colors font-heading font-bold uppercase tracking-widest text-xs md:text-sm text-center flex items-center justify-center gap-3 rounded-xl cursor-pointer"
                            >
                                <ScrambleText text="Email Direct" triggerOnHover triggerOnView className="text-current" />
                            </motion.a>

                            <motion.a
                                href="https://wa.me/919042561295"
                                target="_blank"
                                rel="noreferrer"
                                whileHover={{ y: -2 }}
                                className="flex-1 px-6 md:px-10 py-4 md:py-5 border border-red-600 bg-red-600/10 hover:bg-red-600 hover:text-white text-red-500 transition-colors font-heading font-bold uppercase tracking-widest text-xs md:text-sm text-center flex items-center justify-center gap-3 rounded-xl cursor-pointer"
                            >
                                <ScrambleText text="WhatsApp Direct" triggerOnHover triggerOnView className="text-current" />
                            </motion.a>
                        </div>

                        {/* Feature Cards Grid with MagicBento Effect */}
                        <MagicBento 
                            glowColor="239, 68, 68"
                            enableStars={true}
                            enableSpotlight={true}
                            enableBorderGlow={true}
                            enableTilt={true}
                            enableMagnetism={true}
                            clickEffect={true}
                            spotlightRadius={320}
                            particleCount={14}
                            cards={offeringCards.map((card) => ({
                                title: card.title,
                                description: card.desc,
                                label: card.subtitle,
                                color: '#0a0a0a',
                                customContent: (
                                    <div className="flex flex-col justify-between h-full gap-4 relative z-10 w-full">
                                        <div className="flex flex-col gap-3 text-left">
                                            <div className="flex justify-between items-center">
                                                <span className="font-heading text-lg font-black tracking-wider uppercase text-white">
                                                    {card.title}
                                                </span>
                                                <span className="text-[10px] font-mono uppercase tracking-widest text-red-500 bg-red-600/10 border border-red-500/30 px-2.5 py-1 rounded-full">
                                                    {card.subtitle}
                                                </span>
                                            </div>

                                            <p className="font-mono text-xs text-white/70 leading-relaxed min-h-[50px]">
                                                {card.desc}
                                            </p>
                                        </div>

                                        <hr className="border-white/10 my-1" />

                                        <ul className="flex flex-col gap-2 my-auto">
                                            {card.features.map((feat, idx) => (
                                                <li key={idx} className="flex items-center gap-2 text-xs font-mono text-white/80">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                                                    <span>{feat}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        <div className="mt-4">
                                            <a
                                                href={card.actionUrl}
                                                target={card.actionUrl.startsWith('http') ? '_blank' : '_self'}
                                                rel="noreferrer"
                                                className="block w-full text-center py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-heading font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                                            >
                                                {card.actionText} →
                                            </a>
                                        </div>
                                    </div>
                                )
                            }))}
                        />
                    </div>
                </section>


            </main>
            <Footer />
        </div>
    );
};

export default ContactPage;
