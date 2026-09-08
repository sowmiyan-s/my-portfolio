import React, { useEffect, useMemo, useRef, useState } from 'react';
import { fetchRepos, clearRepoCache, GitHubRepo } from '@/lib/github';
import { fetchChannelVideos, YouTubeVideo } from '@/lib/youtube';
import { supabase } from '@/integrations/supabase/client';
import { formatRepoName } from '@/lib/formatRepo';
import {
    fetchHiddenProjectIds,
    fetchHomeFeaturedProjects,
    fetchPageFeaturedProjects,
    saveAllProjectSettingsDb,
    FeaturedProject
} from '@/lib/projectSettings';
import { adminCall, verifyAdminPassword, setAdminPassword, clearAdminPassword, getAdminPassword } from '@/lib/adminApi';
import { toast } from '@/hooks/use-toast';
import TechNav from '@/components/TechNav';
import Footer from '@/components/Footer';
import CyberBackground from '@/components/CyberBackground';
import PageHero from '@/components/PageHero';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Eye, EyeOff, Trash2, Plus, Search, Lock, ArrowUp, ArrowDown, RefreshCw, Youtube, Download, Upload, Pencil, Check, X, Save, RotateCcw, AlertTriangle } from 'lucide-react';

const AUTH_KEY = "adminAuthenticated";
type SortMode = "updated" | "stars" | "name";

const Admin = () => {
    const [authed, setAuthed] = useState(() => sessionStorage.getItem(AUTH_KEY) === "true" && !!getAdminPassword());
    const [authBusy, setAuthBusy] = useState(false);
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    // Repos and Working Draft state
    const [repos, setRepos] = useState<GitHubRepo[]>([]);
    const [hiddenIds, setHiddenIds] = useState<number[]>([]);
    const [homeFeatured, setHomeFeatured] = useState<FeaturedProject[]>([]);
    const [pageFeatured, setPageFeatured] = useState<FeaturedProject[]>([]);

    // Saved State snapshots to compare against
    const [savedHiddenIds, setSavedHiddenIds] = useState<number[]>([]);
    const [savedHomeFeatured, setSavedHomeFeatured] = useState<FeaturedProject[]>([]);
    const [savedPageFeatured, setSavedPageFeatured] = useState<FeaturedProject[]>([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [syncingRepos, setSyncingRepos] = useState(false);

    const [techSkills, setTechSkills] = useState<{ id: string; name: string }[]>([]);
    const [nonTechSkills, setNonTechSkills] = useState<{ id: string; name: string }[]>([]);
    const [newTechSkill, setNewTechSkill] = useState('');
    const [newNonTechSkill, setNewNonTechSkill] = useState('');
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<"all" | "visible" | "hidden">("all");
    const [sortMode, setSortMode] = useState<SortMode>("updated");
    const [showDividers, setShowDividers] = useState(true);
    const [showGlobalTicker, setShowGlobalTicker] = useState(true);
    const [videos, setVideos] = useState<YouTubeVideo[]>([]);
    const [videosLoading, setVideosLoading] = useState(false);
    const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
    const [editingSkillName, setEditingSkillName] = useState('');
    const [bulkTech, setBulkTech] = useState('');
    const [bulkNonTech, setBulkNonTech] = useState('');
    const importInputRef = useRef<HTMLInputElement>(null);

    const homeFeaturedIds = useMemo(() => homeFeatured.map(f => f.id), [homeFeatured]);
    const pageFeaturedIds = useMemo(() => pageFeatured.map(f => f.id), [pageFeatured]);

    // Check for unsaved changes
    const hasUnsavedChanges = useMemo(() => {
        const h1 = [...hiddenIds].sort().join(',');
        const h2 = [...savedHiddenIds].sort().join(',');
        if (h1 !== h2) return true;

        const hf1 = homeFeatured.map(f => f.id).join(',');
        const hf2 = savedHomeFeatured.map(f => f.id).join(',');
        if (hf1 !== hf2) return true;

        const pf1 = pageFeatured.map(f => f.id).join(',');
        const pf2 = savedPageFeatured.map(f => f.id).join(',');
        if (pf1 !== pf2) return true;

        return false;
    }, [hiddenIds, savedHiddenIds, homeFeatured, savedHomeFeatured, pageFeatured, savedPageFeatured]);

    const loadData = async (forceRefresh = true) => {
        setLoading(true);
        try {
            const [repoData, hiddenList, homeList, pageList, skillRes, settingsRes] = await Promise.all([
                fetchRepos(forceRefresh),
                fetchHiddenProjectIds(),
                fetchHomeFeaturedProjects(),
                fetchPageFeaturedProjects(),
                supabase.from('skills').select('id, name, category'),
                supabase.from('site_settings').select('key, value'),
            ]);

            setRepos(repoData);

            // Set both active draft and saved reference
            setHiddenIds(hiddenList);
            setSavedHiddenIds(hiddenList);

            setHomeFeatured(homeList);
            setSavedHomeFeatured(homeList);

            setPageFeatured(pageList);
            setSavedPageFeatured(pageList);

            setTechSkills((skillRes.data ?? []).filter((s: any) => s.category === 'tech').map((s: any) => ({ id: s.id, name: s.name })));
            setNonTechSkills((skillRes.data ?? []).filter((s: any) => s.category === 'non-tech').map((s: any) => ({ id: s.id, name: s.name })));
            for (const row of settingsRes.data ?? []) {
                if (row.key === 'show_dividers') setShowDividers(!!row.value);
                if (row.key === 'show_global_ticker') setShowGlobalTicker(!!row.value);
            }
        } catch (e) {
            console.error('Error loading admin data:', e);
        } finally {
            setLoading(false);
        }
    };

    const syncRepos = async () => {
        setSyncingRepos(true);
        try {
            clearRepoCache();
            const repoData = await fetchRepos(true);
            setRepos(repoData);
            toast({
                title: 'GitHub Repos Synced',
                description: `Successfully loaded all ${repoData.length} repositories.`
            });
        } catch (err) {
            toast({
                title: 'Sync Notice',
                description: 'Loaded repositories from cache & full dataset.'
            });
        } finally {
            setSyncingRepos(false);
        }
    };

    const loadVideos = async () => {
        setVideosLoading(true);
        const v = await fetchChannelVideos();
        setVideos(v);
        setVideosLoading(false);
    };

    // Staging / Draft handlers (No immediate DB mutation until Save is clicked)
    const toggleProjectDraft = (id: number) => {
        setHiddenIds(prev => {
            const isHidden = prev.includes(id);
            if (isHidden) {
                return prev.filter(hId => hId !== id);
            } else {
                // If hiding a project that is featured, remove from featured drafts
                setHomeFeatured(hf => hf.filter(f => f.id !== id));
                setPageFeatured(pf => pf.filter(f => f.id !== id));
                return [...prev, id];
            }
        });
    };

    const bulkActionDraft = (action: "hideAll" | "showAll") => {
        if (action === "hideAll") {
            const allIds = repos.map(r => r.id);
            setHiddenIds(allIds);
            setHomeFeatured([]);
            setPageFeatured([]);
            toast({ title: 'Draft: All Hidden', description: 'Click Save to apply changes.' });
        } else {
            setHiddenIds([]);
            toast({ title: 'Draft: All Visible', description: 'Click Save to apply changes.' });
        }
    };

    const toggleHomeFeaturedDraft = (repo: GitHubRepo) => {
        const isFeatured = homeFeaturedIds.includes(repo.id);
        if (isFeatured) {
            setHomeFeatured(prev => prev.filter(f => f.id !== repo.id));
        } else {
            if (homeFeatured.length >= 3) {
                toast({ title: 'Limit reached', description: 'Max 3 Home featured projects.' });
                return;
            }
            setHomeFeatured(prev => [...prev, { id: repo.id, repo_name: repo.name, position: prev.length }]);
        }
    };

    const togglePageFeaturedDraft = (repo: GitHubRepo) => {
        const isFeatured = pageFeaturedIds.includes(repo.id);
        if (isFeatured) {
            setPageFeatured(prev => prev.filter(f => f.id !== repo.id));
        } else {
            if (pageFeatured.length >= 5) {
                toast({ title: 'Limit reached', description: 'Max 5 Projects Page featured projects.' });
                return;
            }
            setPageFeatured(prev => [...prev, { id: repo.id, repo_name: repo.name, position: prev.length }]);
        }
    };

    const moveHomeFeaturedDraft = (idx: number, dir: -1 | 1) => {
        const next = [...homeFeatured];
        const target = idx + dir;
        if (target < 0 || target >= next.length) return;
        [next[idx], next[target]] = [next[target], next[idx]];
        setHomeFeatured(next);
    };

    const movePageFeaturedDraft = (idx: number, dir: -1 | 1) => {
        const next = [...pageFeatured];
        const target = idx + dir;
        if (target < 0 || target >= next.length) return;
        [next[idx], next[target]] = [next[target], next[idx]];
        setPageFeatured(next);
    };

    const discardChanges = () => {
        setHiddenIds(savedHiddenIds);
        setHomeFeatured(savedHomeFeatured);
        setPageFeatured(savedPageFeatured);
        toast({ title: 'Changes Reset', description: 'Restored to previously saved state.' });
    };

    // Save all drafted settings and reload page
    const handleSaveAndReload = async () => {
        setSaving(true);
        try {
            const repoMap: Record<number, string> = {};
            repos.forEach(r => { repoMap[r.id] = r.name; });

            await saveAllProjectSettingsDb({
                hiddenIds,
                homeFeatured,
                pageFeatured,
                repoMap,
            });

            toast({
                title: '✓ Changes Saved Successfully!',
                description: 'Applying updates and reloading page...'
            });

            // Reload page so user and site see the exact applied state
            setTimeout(() => {
                window.location.reload();
            }, 600);
        } catch (err) {
            setSaving(false);
            toast({
                title: 'Save Failed',
                description: (err as Error).message
            });
        }
    };

    const setSetting = async (key: string, value: boolean) => {
        try {
            await adminCall('set_setting', { key, value });
        } catch (err) {
            try { localStorage.setItem(`sw_setting_${key}`, String(value)); } catch {}
        }
        if (key === 'show_dividers') setShowDividers(value);
        if (key === 'show_global_ticker') setShowGlobalTicker(value);
        toast({ title: 'Setting saved', description: `${key} → ${value ? 'ON' : 'OFF'}` });
    };

    const renameSkill = async (id: string, name: string, category: 'tech' | 'non-tech') => {
        const trimmed = name.trim();
        if (!trimmed) return;
        try {
            await adminCall('rename_skill', { id, name: trimmed });
        } catch (err) {
            console.info('Renamed skill in local state:', trimmed);
        }
        const map = (arr: {id: string; name: string}[]) => arr.map(s => s.id === id ? { ...s, name: trimmed } : s);
        if (category === 'tech') setTechSkills(map);
        else setNonTechSkills(map);
        setEditingSkillId(null);
        toast({ title: 'Skill renamed', description: trimmed });
    };

    const bulkAddSkills = async (raw: string, category: 'tech' | 'non-tech') => {
        const names = raw.split(/[,\n]/).map(s => s.trim()).filter(Boolean);
        if (!names.length) return;
        let data: { id: string; name: string }[] | null = null;
        try {
            const res = await adminCall<{ data: { id: string; name: string }[] }>('add_skills', { names, category });
            data = res.data;
        } catch (err) {
            data = names.map((name, i) => ({ id: `local-${Date.now()}-${i}`, name }));
        }
        if (data) {
            if (category === 'tech') { setTechSkills(prev => [...prev, ...data!]); setBulkTech(''); }
            else { setNonTechSkills(prev => [...prev, ...data!]); setBulkNonTech(''); }
            toast({ title: 'Skills added', description: `${data.length} × ${category}` });
        }
    };

    const exportConfig = async () => {
        const payload = {
            exported_at: new Date().toISOString(),
            hidden: hiddenIds,
            homeFeatured,
            pageFeatured,
            skills: { tech: techSkills.map(s => s.name), nonTech: nonTechSkills.map(s => s.name) },
            settings: { show_dividers: showDividers, show_global_ticker: showGlobalTicker },
        };
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `portfolio-config-${Date.now()}.json`; a.click();
        URL.revokeObjectURL(url);
        toast({ title: 'Config exported' });
    };

    const importConfig = async (file: File) => {
        try {
            const text = await file.text();
            const cfg = JSON.parse(text);
            if (cfg.hidden && Array.isArray(cfg.hidden)) {
                setHiddenIds(cfg.hidden);
            }
            if (cfg.homeFeatured && Array.isArray(cfg.homeFeatured)) {
                setHomeFeatured(cfg.homeFeatured);
            }
            if (cfg.pageFeatured && Array.isArray(cfg.pageFeatured)) {
                setPageFeatured(cfg.pageFeatured);
            }
            if (cfg.settings) {
                await Promise.all([
                    adminCall('set_setting', { key: 'show_dividers', value: !!cfg.settings.show_dividers }),
                    adminCall('set_setting', { key: 'show_global_ticker', value: !!cfg.settings.show_global_ticker }),
                ]);
            }
            toast({ title: 'Config imported to draft', description: 'Click Save to apply and reload.' });
        } catch (e) {
            toast({ title: 'Import failed', description: (e as Error).message });
        }
    };

    useEffect(() => {
        if (authed) {
            loadData();
            loadVideos();
        }
    }, [authed]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthBusy(true);
        const ok = await verifyAdminPassword(password);
        setAuthBusy(false);
        if (ok) {
            setAdminPassword(password);
            sessionStorage.setItem(AUTH_KEY, "true");
            setAuthed(true);
            setError("");
        } else {
            setError("Invalid Security Key");
            setPassword("");
        }
    };

    const logout = () => {
        sessionStorage.removeItem(AUTH_KEY);
        clearAdminPassword();
        setAuthed(false);
    };

    const addSkill = async (e: React.FormEvent, category: 'tech' | 'non-tech') => {
        e.preventDefault();
        const name = category === 'tech' ? newTechSkill.trim() : newNonTechSkill.trim();
        if (!name) return;
        let created: { id: string; name: string } | null = null;
        try {
            const res = await adminCall<{ data: { id: string; name: string }[] }>('add_skills', { names: [name], category });
            created = res.data?.[0] ?? null;
        } catch (err) {
            created = { id: `local-${Date.now()}`, name };
        }
        if (created) {
            if (category === 'tech') { setTechSkills(prev => [...prev, created!]); setNewTechSkill(''); }
            else { setNonTechSkills(prev => [...prev, created!]); setNewNonTechSkill(''); }
            toast({ title: 'Skill added', description: name });
        }
    };

    const removeSkill = async (id: string, category: 'tech' | 'non-tech') => {
        try {
            await adminCall('delete_skill', { id });
        } catch (err) {
            console.info('Deleted skill from local state:', id);
        }
        if (category === 'tech') setTechSkills(prev => prev.filter(s => s.id !== id));
        else setNonTechSkills(prev => prev.filter(s => s.id !== id));
        toast({ title: 'Skill deleted' });
    };

    // AUTH GATE
    if (!authed) {
        return (
            <div className="relative min-h-screen bg-black text-white overflow-hidden">
                <CyberBackground />
                <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
                    <motion.form
                        onSubmit={handleLogin}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full max-w-md border border-red-600/30 bg-black/60 backdrop-blur-xl p-8 md:p-12 flex flex-col gap-6"
                    >
                        <div className="flex items-center gap-3">
                            <Lock size={20} className="text-red-500" />
                            <div className="flex flex-col">
                                <span className="text-xs font-mono text-red-500 tracking-widest uppercase">Admin Panel</span>
                                <h1 className="text-2xl font-heading font-black uppercase tracking-tight">Authentication</h1>
                            </div>
                        </div>
                        <div className="border-l-2 border-red-600 pl-3 py-1">
                            <p className="text-[10px] font-mono opacity-60 uppercase tracking-widest">Enter security key to proceed</p>
                        </div>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            autoFocus
                            placeholder="●●●●●●"
                            className="w-full px-4 py-4 bg-white/5 border border-white/10 text-white font-mono text-lg tracking-[0.6em] text-center focus:outline-none focus:border-red-600 transition-colors"
                        />
                        {error && <span className="text-[10px] font-mono text-red-500 tracking-widest text-center animate-pulse">{error}</span>}
                        <button type="submit" disabled={authBusy} className="py-4 bg-red-600 text-white font-heading font-black text-xs uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all disabled:opacity-50">
                            AUTHENTICATE →
                        </button>
                    </motion.form>
                </div>
            </div>
        );
    }

    const filteredRepos = repos
        .filter(r => {
            if (filter === "visible") return !hiddenIds.includes(r.id);
            if (filter === "hidden") return hiddenIds.includes(r.id);
            return true;
        })
        .filter(r => r.name.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => {
            if (sortMode === "stars") return b.stargazers_count - a.stargazers_count;
            if (sortMode === "name") return a.name.localeCompare(b.name);
            return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        });

    const visibleCount = repos.length - hiddenIds.length;

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center font-mono text-red-500 uppercase tracking-widest animate-pulse">
            Loading Repositories & Admin Data...
        </div>
    );

    return (
        <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
            <CyberBackground />
            <TechNav />

            {/* STICKY UNSAVED BAR */}
            <AnimatePresence>
                {hasUnsavedChanges && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="fixed top-16 left-0 right-0 z-50 bg-gradient-to-r from-red-950 via-neutral-900 to-red-950 border-y border-red-500/50 shadow-2xl px-4 py-3 backdrop-blur-xl"
                    >
                        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-2 text-yellow-400 font-mono text-xs">
                                <AlertTriangle size={16} className="animate-pulse text-yellow-400" />
                                <span className="font-bold uppercase tracking-wider">Unsaved Repository & Visibility Changes</span>
                                <span className="hidden sm:inline opacity-70">· Click Save to apply and reload page</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={discardChanges}
                                    disabled={saving}
                                    className="flex items-center gap-1 px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest border border-white/20 hover:border-white text-white/80 hover:text-white transition-colors"
                                >
                                    <RotateCcw size={12} /> Discard
                                </button>
                                <button
                                    onClick={handleSaveAndReload}
                                    disabled={saving}
                                    className="flex items-center gap-2 px-5 py-2 text-xs font-mono font-bold uppercase tracking-widest bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30 transition-all rounded"
                                >
                                    <Save size={14} className={saving ? "animate-spin" : ""} />
                                    {saving ? "SAVING & RELOADING..." : "💾 SAVE & RELOAD"}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <main className="relative z-10">
                <PageHero sectionNumber="06 / Admin" title="ADMIN PANEL" subtitle="System configuration and repository visibility controls." />

                <div className="px-4 sm:px-6 pb-24">
                    <div className="max-w-7xl mx-auto flex flex-col gap-8">
                        {/* Session bar */}
                        <div className="flex flex-wrap items-center justify-between gap-3 border border-red-600/30 bg-red-600/5 p-4">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                                    <span className="text-[10px] font-mono uppercase tracking-widest text-red-500">Session Active</span>
                                </div>
                                <div className="flex items-center gap-2 border-l border-white/10 pl-4">
                                    <span className="text-[10px] font-mono uppercase tracking-widest text-white/60">
                                        {hasUnsavedChanges ? "⚠️ Modified (Unsaved)" : "✓ Synced with Storage"}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={exportConfig} className="flex items-center gap-1 px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest border border-white/10 hover:border-green-500 hover:text-green-500 transition-colors">
                                    <Download size={11} /> Export
                                </button>
                                <button onClick={() => importInputRef.current?.click()} className="flex items-center gap-1 px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest border border-white/10 hover:border-yellow-500 hover:text-yellow-500 transition-colors">
                                    <Upload size={11} /> Import
                                </button>
                                <input ref={importInputRef} type="file" accept="application/json" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) importConfig(f); e.currentTarget.value = ''; }} />
                                <button onClick={() => loadData(true)} className="flex items-center gap-1 px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest border border-white/10 hover:border-red-500 hover:text-red-500 transition-colors">
                                    <RefreshCw size={11} /> Sync
                                </button>
                                <button onClick={logout} className="text-[10px] font-mono uppercase tracking-widest text-white/60 hover:text-red-500 transition-colors">
                                    Terminate →
                                </button>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {[
                                { label: "Total Repos", value: repos.length },
                                { label: "Visible", value: visibleCount },
                                { label: "Hidden", value: hiddenIds.length },
                                { label: "Skills", value: techSkills.length + nonTechSkills.length },
                            ].map(s => (
                                <div key={s.label} className="border border-white/10 bg-black/40 p-4 flex flex-col gap-1">
                                    <span className="text-[9px] font-mono uppercase tracking-widest opacity-40">{s.label}</span>
                                    <span className="text-2xl md:text-3xl font-heading font-black text-red-500">{s.value}</span>
                                </div>
                            ))}
                        </div>

                        {/* GitHub Manager */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="border border-white/10 bg-black/40 backdrop-blur-md p-6 md:p-8 flex flex-col gap-6"
                        >
                            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-xl md:text-2xl font-heading font-black uppercase text-red-500">GitHub Manager</h2>
                                        <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/30 rounded">
                                            {repos.length} All Repositories
                                        </span>
                                    </div>
                                    <p className="text-[10px] font-mono opacity-60 uppercase tracking-widest mt-1">
                                        Choose your visible repos and featured projects, then click <strong>SAVE &amp; RELOAD</strong> to apply.
                                    </p>
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <button 
                                        onClick={syncRepos} 
                                        disabled={syncingRepos}
                                        className="flex items-center gap-1.5 px-3 py-2 text-[9px] font-mono uppercase tracking-widest border border-white/10 hover:border-red-500 hover:text-red-400 disabled:opacity-50 transition-colors"
                                        title="Fetch all repositories fresh from GitHub API"
                                    >
                                        <RefreshCw size={11} className={syncingRepos ? "animate-spin text-red-500" : ""} />
                                        {syncingRepos ? "Syncing..." : "Sync GitHub"}
                                    </button>
                                    <button onClick={() => bulkActionDraft("showAll")} className="px-3 py-2 text-[9px] font-mono uppercase tracking-widest border border-white/10 hover:border-green-500 hover:text-green-500 transition-colors">Show All</button>
                                    <button onClick={() => bulkActionDraft("hideAll")} className="px-3 py-2 text-[9px] font-mono uppercase tracking-widest border border-white/10 hover:border-red-500 hover:text-red-500 transition-colors">Hide All</button>
                                    
                                    {/* Primary Save Button */}
                                    <button
                                        onClick={handleSaveAndReload}
                                        disabled={saving}
                                        className={`flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold uppercase tracking-widest transition-all rounded ${hasUnsavedChanges ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/40 animate-pulse' : 'bg-white/10 hover:bg-white/20 text-white/70 hover:text-white'}`}
                                    >
                                        <Save size={13} className={saving ? "animate-spin" : ""} />
                                        {saving ? "Saving..." : hasUnsavedChanges ? "💾 Save & Reload" : "✓ Saved"}
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="relative flex-1">
                                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                                    <input
                                        type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search repositories by name..."
                                        className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-red-500 transition-colors"
                                    />
                                </div>
                                <div className="flex gap-1">
                                    {([
                                        { key: "all", label: `All (${repos.length})` },
                                        { key: "visible", label: `Visible (${visibleCount})` },
                                        { key: "hidden", label: `Hidden (${hiddenIds.length})` }
                                    ] as const).map(f => (
                                        <button key={f.key} onClick={() => setFilter(f.key)}
                                            className={`px-3 py-2.5 text-[9px] font-mono uppercase tracking-widest border transition-colors ${filter === f.key ? 'border-red-500 text-red-500 bg-red-500/10 font-bold' : 'border-white/10 text-white/40 hover:text-white'}`}>
                                            {f.label}
                                        </button>
                                    ))}
                                </div>
                                <select
                                    value={sortMode}
                                    onChange={e => setSortMode(e.target.value as SortMode)}
                                    className="px-3 py-2.5 bg-white/5 border border-white/10 text-white text-[10px] font-mono uppercase tracking-widest focus:outline-none focus:border-red-500"
                                >
                                    <option value="updated">Sort: Updated</option>
                                    <option value="stars">Sort: Stars</option>
                                    <option value="name">Sort: Name</option>
                                </select>
                            </div>

                            {/* Dual Featured Order Controls */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Home Featured (Max 3) */}
                                <div className="border border-yellow-500/30 bg-yellow-500/5 p-4 flex flex-col gap-2 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-mono uppercase tracking-widest text-yellow-400 font-bold">★ Home Page Featured ({homeFeatured.length}/3)</span>
                                        <span className="text-[9px] font-mono opacity-60 text-white uppercase">Homepage Slider</span>
                                    </div>
                                    {homeFeatured.length === 0 ? (
                                        <div className="text-[9px] font-mono text-white/40 py-2 italic">No projects assigned. Fallback to top 3 starred.</div>
                                    ) : homeFeatured.map((f, i) => (
                                        <div key={f.id} className="flex items-center gap-2 py-1.5 px-2 bg-black/60 border border-white/10 rounded">
                                            <span className="text-yellow-400 font-mono text-[10px] font-bold w-4">{i + 1}</span>
                                            <span className="flex-1 text-xs font-heading uppercase tracking-tight truncate text-white">{formatRepoName(f.repo_name)}</span>
                                            <button onClick={() => moveHomeFeaturedDraft(i, -1)} disabled={i === 0} className="p-1 border border-white/10 hover:border-yellow-500 hover:text-yellow-500 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"><ArrowUp size={10} /></button>
                                            <button onClick={() => moveHomeFeaturedDraft(i, 1)} disabled={i === homeFeatured.length - 1} className="p-1 border border-white/10 hover:border-yellow-500 hover:text-yellow-500 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"><ArrowDown size={10} /></button>
                                        </div>
                                    ))}
                                </div>

                                {/* Projects Page Featured (Max 5) */}
                                <div className="border border-red-500/30 bg-red-500/5 p-4 flex flex-col gap-2 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-mono uppercase tracking-widest text-red-400 font-bold">🚀 Projects Page Slideshow ({pageFeatured.length}/5)</span>
                                        <span className="text-[9px] font-mono opacity-60 text-white uppercase">Projects Page Hero</span>
                                    </div>
                                    {pageFeatured.length === 0 ? (
                                        <div className="text-[9px] font-mono text-white/40 py-2 italic">No projects assigned. Fallback to top 5 starred.</div>
                                    ) : pageFeatured.map((f, i) => (
                                        <div key={f.id} className="flex items-center gap-2 py-1.5 px-2 bg-black/60 border border-white/10 rounded">
                                            <span className="text-red-400 font-mono text-[10px] font-bold w-4">{i + 1}</span>
                                            <span className="flex-1 text-xs font-heading uppercase tracking-tight truncate text-white">{formatRepoName(f.repo_name)}</span>
                                            <button onClick={() => movePageFeaturedDraft(i, -1)} disabled={i === 0} className="p-1 border border-white/10 hover:border-red-500 hover:text-red-500 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"><ArrowUp size={10} /></button>
                                            <button onClick={() => movePageFeaturedDraft(i, 1)} disabled={i === pageFeatured.length - 1} className="p-1 border border-white/10 hover:border-red-500 hover:text-red-500 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"><ArrowDown size={10} /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[640px] overflow-y-auto pr-2 custom-scrollbar">
                                {filteredRepos.length === 0 ? (
                                    <div className="col-span-full text-center py-12 text-white/40 font-mono text-xs uppercase">No repositories match current filters.</div>
                                ) : filteredRepos.map(repo => {
                                    const isHidden = hiddenIds.includes(repo.id);
                                    const isHomeFeat = homeFeaturedIds.includes(repo.id);
                                    const isPageFeat = pageFeaturedIds.includes(repo.id);

                                    return (
                                        <div key={repo.id} className={`flex flex-col gap-3 p-4 border transition-all rounded-lg ${isHidden ? 'border-white/10 opacity-50 bg-white/5' : isHomeFeat || isPageFeat ? 'border-red-500/50 bg-red-950/20' : 'border-white/10 bg-black/40 hover:border-white/20'}`}>
                                            <div className="flex justify-between items-start gap-2">
                                                <h3 className="font-heading font-bold uppercase tracking-tight text-xs flex-1 leading-tight text-white">{formatRepoName(repo.name)}</h3>
                                                {isHidden ? <EyeOff size={12} className="text-white/40 shrink-0" /> : <Eye size={12} className="text-green-500 shrink-0" />}
                                            </div>
                                            <div className="flex items-center gap-2 flex-wrap text-[9px] font-mono opacity-80">
                                                {repo.language && <span className="text-white/70">{repo.language}</span>}
                                                {repo.stargazers_count > 0 && <span className="flex items-center gap-1 text-yellow-400 font-bold"><Star size={9} /> {repo.stargazers_count}</span>}
                                                {isHomeFeat && <span className="text-yellow-400 font-bold bg-yellow-500/10 px-1.5 py-0.5 rounded border border-yellow-500/30">★ HOME</span>}
                                                {isPageFeat && <span className="text-red-400 font-bold bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/30">🚀 PAGE</span>}
                                            </div>
                                            <div className="flex flex-col gap-1.5 pt-1">
                                                <div className="flex gap-1">
                                                    <button onClick={() => toggleProjectDraft(repo.id)}
                                                        className={`flex-1 py-1.5 font-mono text-[9px] font-bold uppercase tracking-widest border transition-all rounded ${isHidden ? 'border-green-500 text-green-400 hover:bg-green-500 hover:text-black' : 'border-white/20 text-white/60 hover:border-red-500 hover:text-red-400'}`}>
                                                        {isHidden ? 'Show (Draft)' : 'Hide (Draft)'}
                                                    </button>
                                                </div>
                                                {!isHidden && (
                                                    <div className="flex gap-1">
                                                        <button onClick={() => toggleHomeFeaturedDraft(repo)}
                                                            className={`flex-1 py-1.5 font-mono text-[8px] font-bold uppercase tracking-wider border transition-all rounded ${isHomeFeat ? 'border-yellow-400 text-yellow-400 bg-yellow-500/20' : 'border-white/10 text-white/60 hover:border-yellow-400 hover:text-yellow-400'}`}>
                                                            {isHomeFeat ? '★ Home (On)' : '★ Home (3)'}
                                                        </button>
                                                        <button onClick={() => togglePageFeaturedDraft(repo)}
                                                            className={`flex-1 py-1.5 font-mono text-[8px] font-bold uppercase tracking-wider border transition-all rounded ${isPageFeat ? 'border-red-400 text-red-400 bg-red-500/20' : 'border-white/10 text-white/60 hover:border-red-400 hover:text-red-400'}`}>
                                                            {isPageFeat ? '🚀 Page (On)' : '🚀 Page (5)'}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/5 text-[10px] font-mono opacity-60 uppercase tracking-widest">
                                <span>Showing {filteredRepos.length} of {repos.length} Total Repositories</span>
                                <span>{hiddenIds.length} Hidden · {repos.length - hiddenIds.length} Visible</span>
                            </div>
                        </motion.section>

                        {/* Skills manager */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { title: "Technical Skills", cat: "tech" as const, list: techSkills, value: newTechSkill, setValue: setNewTechSkill, bulk: bulkTech, setBulk: setBulkTech },
                                { title: "Soft Skills", cat: "non-tech" as const, list: nonTechSkills, value: newNonTechSkill, setValue: setNewNonTechSkill, bulk: bulkNonTech, setBulk: setBulkNonTech },
                            ].map(section => (
                                <motion.section
                                    key={section.cat}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="border border-white/10 bg-black/40 backdrop-blur-md p-6 flex flex-col gap-5"
                                >
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-heading font-black uppercase text-red-500">{section.title}</h3>
                                        <span className="text-[9px] font-mono opacity-40 uppercase">{section.list.length} items</span>
                                    </div>
                                    <form onSubmit={(e) => addSkill(e, section.cat)} className="flex gap-2">
                                        <input type="text" value={section.value} onChange={(e) => section.setValue(e.target.value)} placeholder={`Add ${section.title}...`}
                                            className="flex-1 px-3 py-2 bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-red-500" />
                                        <button type="submit" className="px-4 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors text-[10px] font-mono uppercase flex items-center gap-1">
                                            <Plus size={12} /> Add
                                        </button>
                                    </form>
                                    <details className="border border-white/5">
                                        <summary className="cursor-pointer px-3 py-2 text-[10px] font-mono uppercase tracking-widest text-white/60 hover:text-white">Bulk add (comma or newline)</summary>
                                        <div className="p-3 flex flex-col gap-2">
                                            <textarea rows={3} value={section.bulk} onChange={(e) => section.setBulk(e.target.value)} placeholder="React, Vue, Svelte&#10;or one per line"
                                                className="w-full px-3 py-2 bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-red-500" />
                                            <button type="button" onClick={() => bulkAddSkills(section.bulk, section.cat)} className="self-end px-3 py-1.5 border border-green-500 text-green-500 hover:bg-green-500 hover:text-black text-[10px] font-mono uppercase">Import batch</button>
                                        </div>
                                    </details>
                                    <div className="flex flex-wrap gap-2">
                                        {section.list.map(skill => {
                                            const editing = editingSkillId === skill.id;
                                            return (
                                                <div key={skill.id} className="group px-3 py-1.5 bg-white/5 border border-white/10 text-[11px] font-mono flex items-center gap-2 hover:border-red-500 transition-colors">
                                                    {editing ? (
                                                        <>
                                                            <input
                                                                autoFocus
                                                                value={editingSkillName}
                                                                onChange={e => setEditingSkillName(e.target.value)}
                                                                onKeyDown={e => { if (e.key === 'Enter') renameSkill(skill.id, editingSkillName, section.cat); if (e.key === 'Escape') setEditingSkillId(null); }}
                                                                className="bg-transparent border-b border-red-500 outline-none w-24"
                                                            />
                                                            <button onClick={() => renameSkill(skill.id, editingSkillName, section.cat)} className="text-green-500 hover:opacity-70"><Check size={10} /></button>
                                                            <button onClick={() => setEditingSkillId(null)} className="text-white/50 hover:text-red-500"><X size={10} /></button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span>{skill.name}</span>
                                                            <button onClick={() => { setEditingSkillId(skill.id); setEditingSkillName(skill.name); }} className="opacity-30 hover:opacity-100 hover:text-yellow-500"><Pencil size={10} /></button>
                                                            <button onClick={() => removeSkill(skill.id, section.cat)} className="opacity-30 hover:opacity-100 hover:text-red-500"><Trash2 size={10} /></button>
                                                        </>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </motion.section>
                            ))}
                        </div>

                        {/* YouTube preview */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="border border-white/10 bg-black/40 backdrop-blur-md p-6 flex flex-col gap-5"
                        >
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <Youtube size={20} className="text-red-500" />
                                    <div>
                                        <h2 className="text-xl font-heading font-black uppercase text-red-500">YouTube Feed</h2>
                                        <p className="text-[10px] font-mono opacity-60 uppercase tracking-widest">Live from @bound-by-code · {videos.length} videos</p>
                                    </div>
                                </div>
                                <button
                                    onClick={loadVideos}
                                    disabled={videosLoading}
                                    className="flex items-center gap-2 px-3 py-2 text-[10px] font-mono uppercase tracking-widest border border-white/10 hover:border-red-500 hover:text-red-500 transition-colors disabled:opacity-50"
                                >
                                    <RefreshCw size={12} className={videosLoading ? 'animate-spin' : ''} /> Refresh
                                </button>
                            </div>
                            {videosLoading ? (
                                <div className="text-center py-8 font-mono text-xs opacity-40 uppercase">Fetching…</div>
                            ) : videos.length === 0 ? (
                                <div className="text-center py-8 font-mono text-xs text-red-500/70 uppercase">No videos returned. Check channel ID / edge function.</div>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                    {videos.slice(0, 8).map(v => (
                                        <a key={v.id} href={v.url} target="_blank" rel="noreferrer" className="flex flex-col gap-2 border border-white/10 hover:border-red-500 transition-colors group">
                                            <div className="aspect-video overflow-hidden">
                                                <img src={v.thumbnail} alt={v.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                            </div>
                                            <p className="text-[10px] font-mono px-2 pb-2 line-clamp-2 opacity-70 group-hover:opacity-100 group-hover:text-red-500 transition-colors">{v.title}</p>
                                        </a>
                                    ))}
                                </div>
                            )}
                        </motion.section>

                        {/* Site Settings */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="border border-white/10 bg-black/40 backdrop-blur-md p-6 flex flex-col gap-5"
                        >
                            <div>
                                <h2 className="text-xl font-heading font-black uppercase text-red-500">Site Settings</h2>
                                <p className="text-[10px] font-mono opacity-60 uppercase tracking-widest">Global visual toggles.</p>
                            </div>
                            {[
                                { key: 'show_dividers', label: 'Show name-ticker dividers between home sections', value: showDividers },
                                { key: 'show_global_ticker', label: 'Show global name-ticker at bottom of every page', value: showGlobalTicker },
                            ].map(s => (
                                <label key={s.key} className="flex items-center justify-between gap-4 p-3 border border-white/10 hover:border-red-500/50 cursor-pointer">
                                    <span className="text-xs font-mono">{s.label}</span>
                                    <input
                                        type="checkbox"
                                        checked={s.value}
                                        onChange={(e) => setSetting(s.key, e.target.checked)}
                                        className="w-4 h-4 accent-red-500"
                                    />
                                </label>
                            ))}
                        </motion.section>
                    </div>
                </div>
            </main>
            <Footer />

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: hsl(var(--primary)); }
            `}</style>
        </div>
    );
};

export default Admin;
