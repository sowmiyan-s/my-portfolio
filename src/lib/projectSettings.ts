import { supabase } from "@/integrations/supabase/client";

const LS_HIDDEN_KEY = "sw_hidden_projects";
const LS_FEATURED_KEY = "sw_featured_projects";

export interface FeaturedProject {
  id: number;
  repo_name: string;
  position: number;
}

export function getLocalHiddenIds(): number[] {
  try {
    const raw = localStorage.getItem(LS_HIDDEN_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function setLocalHiddenIds(ids: number[]) {
  try {
    const serialized = JSON.stringify(ids);
    const existing = localStorage.getItem(LS_HIDDEN_KEY);
    if (existing === serialized) return;
    localStorage.setItem(LS_HIDDEN_KEY, serialized);
    window.dispatchEvent(new CustomEvent("portfolio-config-changed"));
  } catch (e) {
    console.warn("Failed to set local hidden ids:", e);
  }
}

export function getLocalFeatured(): FeaturedProject[] {
  try {
    const raw = localStorage.getItem(LS_FEATURED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function setLocalFeatured(featured: FeaturedProject[]) {
  try {
    const serialized = JSON.stringify(featured);
    const existing = localStorage.getItem(LS_FEATURED_KEY);
    if (existing === serialized) return;
    localStorage.setItem(LS_FEATURED_KEY, serialized);
    window.dispatchEvent(new CustomEvent("portfolio-config-changed"));
  } catch (e) {
    console.warn("Failed to set local featured projects:", e);
  }
}

export async function fetchHiddenProjectIds(): Promise<number[]> {
  const local = getLocalHiddenIds();
  try {
    const { data, error } = await supabase.from("hidden_projects").select("github_repo_id");
    if (!error && data) {
      const remoteIds = data.map((r: any) => r.github_repo_id);
      const merged = Array.from(new Set([...local, ...remoteIds]));
      setLocalHiddenIds(merged);
      return merged;
    }
  } catch (err) {
    console.warn("Error fetching remote hidden_projects:", err);
  }
  return local;
}

export async function fetchFeaturedProjects(): Promise<FeaturedProject[]> {
  const local = getLocalFeatured();
  try {
    const { data, error } = await supabase
      .from("featured_projects")
      .select("github_repo_id, repo_name, position")
      .order("position", { ascending: true });
    if (!error && data && data.length > 0) {
      const remote = data.map((r: any) => ({
        id: r.github_repo_id,
        repo_name: r.repo_name,
        position: r.position ?? 0,
      }));
      setLocalFeatured(remote);
      return remote;
    }
  } catch (err) {
    console.warn("Error fetching remote featured_projects:", err);
  }
  return local;
}

export async function toggleHiddenProjectDb(id: number, repoName: string, currentlyHidden: boolean): Promise<number[]> {
  const current = getLocalHiddenIds();
  let next: number[];
  if (currentlyHidden) {
    next = current.filter((hId) => hId !== id);
  } else {
    next = Array.from(new Set([...current, id]));
  }
  setLocalHiddenIds(next);

  try {
    if (currentlyHidden) {
      await supabase.from("hidden_projects").delete().eq("github_repo_id", id);
    } else {
      await supabase.from("hidden_projects").insert({ github_repo_id: id, repo_name: repoName });
    }
  } catch (err) {
    console.warn("Supabase toggleHiddenProject failed, local state preserved:", err);
  }

  return next;
}

export async function setAllHiddenProjectsDb(ids: number[], repoMap: Record<number, string>): Promise<number[]> {
  setLocalHiddenIds(ids);
  try {
    if (ids.length === 0) {
      await supabase.from("hidden_projects").delete().neq("github_repo_id", -1);
    } else {
      const rows = ids.map((id) => ({ github_repo_id: id, repo_name: repoMap[id] || "" }));
      await supabase.from("hidden_projects").upsert(rows, { onConflict: "github_repo_id" });
    }
  } catch (err) {
    console.warn("Supabase setAllHiddenProjects failed, local state preserved:", err);
  }
  return ids;
}

export async function toggleFeaturedProjectDb(repo: { id: number; name: string }, currentFeatured: FeaturedProject[]): Promise<FeaturedProject[]> {
  const exists = currentFeatured.some((f) => f.id === repo.id);
  let next: FeaturedProject[];
  if (exists) {
    next = currentFeatured.filter((f) => f.id !== repo.id);
    setLocalFeatured(next);
    try {
      await supabase.from("featured_projects").delete().eq("github_repo_id", repo.id);
    } catch (err) {
      console.warn("Supabase delete featured failed:", err);
    }
  } else {
    if (currentFeatured.length >= 3) return currentFeatured;
    const position = currentFeatured.length;
    const newItem = { id: repo.id, repo_name: repo.name, position };
    next = [...currentFeatured, newItem];
    setLocalFeatured(next);
    try {
      await supabase.from("featured_projects").insert({ github_repo_id: repo.id, repo_name: repo.name, position });
    } catch (err) {
      console.warn("Supabase insert featured failed:", err);
    }
  }
  return next;
}

export async function updateFeaturedOrderDb(nextFeatured: FeaturedProject[]): Promise<FeaturedProject[]> {
  const withPos = nextFeatured.map((f, i) => ({ ...f, position: i }));
  setLocalFeatured(withPos);
  try {
    await Promise.all(
      withPos.map((f) =>
        supabase.from("featured_projects").update({ position: f.position }).eq("github_repo_id", f.id)
      )
    );
  } catch (err) {
    console.warn("Supabase update featured order failed:", err);
  }
  return withPos;
}
