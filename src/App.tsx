import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "./pages/Home.tsx";
import AchievementsPage from "./pages/AchievementsPage.tsx";
import ProjectsPage from "./pages/ProjectsPage.tsx";
import ContactPage from "./pages/ContactPage.tsx";
import Admin from "./pages/Admin.tsx";
import ProjectDetail from "./pages/ProjectDetail.tsx";
import NotFound from "./pages/NotFound.tsx";
import CustomCursor from "@/components/CustomCursor";
import ErrorBoundary from "@/components/ErrorBoundary";
import SiteLayout from "@/components/layout/SiteLayout";
import PageTransition from "@/components/PageTransition";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
    const location = useLocation();
    return (
        <AnimatePresence mode="wait" initial={false}>
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<PageTransition><Home /></PageTransition>} />
                <Route path="/achievements" element={<PageTransition><AchievementsPage /></PageTransition>} />
                <Route path="/projects" element={<PageTransition><ProjectsPage /></PageTransition>} />

                <Route path="/contact" element={<PageTransition><ContactPage /></PageTransition>} />
                <Route path="/admin" element={<PageTransition><Admin /></PageTransition>} />
                <Route path="/project/:id" element={<PageTransition><ProjectDetail /></PageTransition>} />
                <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
            </Routes>
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
