import React, { Suspense, lazy } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "@/components/ErrorBoundary";
import SiteLayout from "@/components/layout/SiteLayout";
import PageTransition from "@/components/PageTransition";

// Lazy-loaded pages for high performance and fast initial load
const Home = lazy(() => import("./pages/Home.tsx"));
const AchievementsPage = lazy(() => import("./pages/AchievementsPage.tsx"));
const ProjectsPage = lazy(() => import("./pages/ProjectsPage.tsx"));
const ContactPage = lazy(() => import("./pages/ContactPage.tsx"));
const Admin = lazy(() => import("./pages/Admin.tsx"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

const queryClient = new QueryClient();

const PageLoader = () => (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 bg-transparent">
        <div className="w-8 h-8 rounded-full border-2 border-red-600/30 border-t-red-600 animate-spin" />
        <span className="text-[10px] font-mono uppercase tracking-widest text-red-500/80 animate-pulse">
            INITIALIZING CORE...
        </span>
    </div>
);

const AnimatedRoutes = () => {
    const location = useLocation();
    return (
        <AnimatePresence mode="wait" initial={false}>
            <Suspense fallback={<PageLoader />}>
                <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<PageTransition><Home /></PageTransition>} />
                    <Route path="/achievements" element={<PageTransition><AchievementsPage /></PageTransition>} />
                    <Route path="/projects" element={<PageTransition><ProjectsPage /></PageTransition>} />
                    <Route path="/contact" element={<PageTransition><ContactPage /></PageTransition>} />
                    <Route path="/admin" element={<PageTransition><Admin /></PageTransition>} />
                    <Route path="/project/:id" element={<PageTransition><ProjectDetail /></PageTransition>} />
                    <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
                </Routes>
            </Suspense>
        </AnimatePresence>
    );
};

const App = () => (
    <QueryClientProvider client={queryClient}>
        <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
                <ErrorBoundary>
                    <SiteLayout>
                        <AnimatedRoutes />
                    </SiteLayout>
                </ErrorBoundary>
            </BrowserRouter>
        </TooltipProvider>
    </QueryClientProvider>
);

export default App;
