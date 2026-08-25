import React from 'react';
import Hero from "@/components/Hero";
import TechNav from "@/components/TechNav";
import Footer from "@/components/Footer";
import BlogSection from "@/components/BlogSection";
import SkillsSection from "@/components/SkillsSection";
import HireMeSection from "@/components/HireMeSection";
import ContentCreationSection from "@/components/ContentCreationSection";
import PopularProjectsSlider from "@/components/PopularProjectsSlider";
import Pattern from "@/components/Pattern";
import SEOKeywords from "@/components/SEOKeywords";
import MarqueeSection from "@/components/MarqueeSection";

const Home = () => {
    return (
        <div className="relative min-h-screen bg-transparent text-white selection:bg-red-600 selection:text-white overflow-x-hidden">
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

                <Pattern>
                    <div className="relative bg-transparent flex items-center justify-center w-full z-50 py-10 md:py-16">
                        <ContentCreationSection />
                    </div>
                </Pattern>

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
