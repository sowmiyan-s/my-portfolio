import React, { useEffect } from 'react';
import CyberBackground from "@/components/CyberBackground";
import TechNav from "@/components/TechNav";
import Hero from "@/components/Hero";
import AchievementsSection from "@/components/AchievementsSection";
import WorkGrid from "@/components/WorkGrid";
import TechnicalArsenal from "@/components/TechnicalArsenal";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";

const Index = () => {
    return (
        <div className="relative min-h-screen bg-black text-white selection:bg-red-600 selection:text-white no-scroll md:overflow-visible">
            <CyberBackground />
            <TechNav />
            <main className="relative z-10 font-body">
                <Hero />
                <AchievementsSection />
                <WorkGrid />
                <TechnicalArsenal />
                <Footer />
            </main>
        </div>
    );
};

export default Index;
