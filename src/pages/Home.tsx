import React from 'react';
import Hero from "@/components/Hero";
import TechNav from "@/components/TechNav";
import Footer from "@/components/Footer";
import BlogSection from "@/components/BlogSection";
import SkillsSection from "@/components/SkillsSection";
import HireMeSection from "@/components/HireMeSection";
import ContentCreationSection from "@/components/ContentCreationSection";
import PopularProjectsSlider from "@/components/PopularProjectsSlider";
import GridScan from "@/components/GridScan";
import SEOKeywords from "@/components/SEOKeywords";
import SEO from "@/components/SEO";
import MarqueeSection from "@/components/MarqueeSection";
import { useThemeColors } from "@/lib/useThemeColors";

const Home = () => {
    const { primary } = useThemeColors();

    return (
        <div className="relative min-h-screen bg-transparent text-white selection:bg-red-600 selection:text-white overflow-x-hidden">
            <SEO 
                title="Sowmiyan S — AI Engineer & Full Stack Systems Developer"
                description="Official portfolio of Sowmiyan S. Autonomous AI agents, multi-agent frameworks, production full-stack systems, research publications, and open-source software."
                canonical="https://www.sowmiyan.me/"
                ogType="profile"
            />
            <SEOKeywords />
            <TechNav />
            <main className="relative z-10 w-full">
                <div className="relative w-full z-10 flex items-center min-h-screen">
                    <Hero />
                </div>

                <MarqueeSection />

                <div className="relative w-full z-20">
                    <SkillsSection />
                </div>

                <MarqueeSection />

                <div className="relative w-full z-30">
                    <BlogSection />
                </div>

                <MarqueeSection />

                <div id="popular-projects-slider" className="relative bg-transparent w-full z-40">
                    <PopularProjectsSlider />
                </div>

                <MarqueeSection />

                {/* Bound By Code Section with React Bits GridScan Background */}
                <div className="relative w-full overflow-hidden bg-[#0a0a0a]/80 z-50 py-10 md:py-16">
                    <div className="absolute inset-0 z-0 pointer-events-none opacity-70">
                        <GridScan
                            sensitivity={0.55}
                            lineThickness={1}
                            linesColor="#2F293A"
                            gridScale={0.1}
                            scanColor={primary || "#FF0000"}
                            scanOpacity={0.5}
                            enablePost
                            bloomIntensity={0.6}
                            chromaticAberration={0.002}
                            noiseIntensity={0.01}
                        />
                    </div>
                    <div className="relative z-10 flex items-center justify-center w-full">
                        <ContentCreationSection />
                    </div>
                </div>

                <MarqueeSection />

                <div className="relative w-full z-[60] bg-transparent">
                    <HireMeSection />
                </div>

                <div className="relative z-[70] bg-black w-full">
                    <Footer />
                </div>
            </main>
        </div>
    );
};

export default Home;
