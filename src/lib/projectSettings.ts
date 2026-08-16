import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import { adminCall } from "@/lib/adminApi";

const LS_HIDDEN_KEY = "sw_hidden_projects";
const LS_HOME_FEATURED_KEY = "sw_home_featured_projects";
const LS_PAGE_FEATURED_KEY = "sw_page_featured_projects";
const LS_FEATURED_KEY = LS_HOME_FEATURED_KEY;

export interface FeaturedProject {
  id: number;
  repo_name: string;
  position: number;
}

/* --------------------------------- cache --------------------------------- */
function readCache<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeCache(key: string, value: unknown) {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
    window.dispatchEvent(new CustomEvent("portfolio-config-changed"));
  } catch (e) {
    console.warn("Failed to cache portfolio config:", e);
  }
}

export function getLocalHiddenIds(): number[] {
  return readCache<number[]>(LS_HIDDEN_KEY, []);
}

export function getLocalHomeFeatured(): FeaturedProject[] {
  return readCache<FeaturedProject[]>(LS_HOME_FEATURED_KEY, []);
}

export function getLocalPageFeatured(): FeaturedProject[] {
  return readCache<FeaturedProject[]>(LS_PAGE_FEATURED_KEY, []);
}

export function getLocalFeatured(): FeaturedProject[] {
  return getLocalHomeFeatured();
}

/* --------------------------------- reads --------------------------------- */

export async function fetchHiddenProjectIds(): Promise<number[]> {
  if (!isSupabaseConfigured) {
    return getLocalHiddenIds();
  }
  try {
    const { data, error } = await supabase.from("hidden_projects").select("github_repo_id");
    if (!error && data && Array.isArray(data)) {
      const ids = data.map((r: any) => r.github_repo_id as number);
      if (ids.length > 0 || getLocalHiddenIds().length === 0) {
        writeCache(LS_HIDDEN_KEY, ids);
        return ids;
      }
    }
  } catch (err) {
    console.warn("Error fetching hidden_projects:", err);
  }
  return getLocalHiddenIds();
}

export async function fetchHomeFeaturedProjects(): Promise<FeaturedProject[]> {
  if (!isSupabaseConfigured) {
    return getLocalHomeFeatured();
  }
  try {
    const { data, error } = await supabase
      .from("featured_projects")
      .select("github_repo_id, repo_name, position")
      .order("position", { ascending: true });
    if (!error && data && Array.isArray(data)) {
      const remote = data.map((r: any) => ({
        id: r.github_repo_id as number,
        repo_name: r.repo_name as string,
        position: (r.position ?? 0) as number,
      })).slice(0, 3);
      if (remote.length > 0 || getLocalHomeFeatured().length === 0) {
        writeCache(LS_HOME_FEATURED_KEY, remote);
        return remote;
      }
    }
  } catch (err) {
    console.warn("Error fetching home featured_projects:", err);
  }
  return getLocalHomeFeatured();
}

export async function fetchPageFeaturedProjects(): Promise<FeaturedProject[]> {
  if (!isSupabaseConfigured) {
    return getLocalPageFeatured();
  }
  try {
    const { data, error } = await supabase
      .from("featured_projects")
      .select("github_repo_id, repo_name, position")
      .order("position", { ascending: true });
    if (!error && data && Array.isArray(data)) {
      const remote = data.map((r: any) => ({
        id: r.github_repo_id as number,
        repo_name: r.repo_name as string,
        position: (r.position ?? 0) as number,
      })).slice(0, 5);
      if (remote.length > 0 || getLocalPageFeatured().length === 0) {
        writeCache(LS_PAGE_FEATURED_KEY, remote);
        return remote;
      }
    }
  } catch (err) {
    console.warn("Error fetching page featured_projects:", err);
  }
  return getLocalPageFeatured();
}

export async function fetchFeaturedProjects(): Promise<FeaturedProject[]> {
  return fetchHomeFeaturedProjects();
}

/* --------------------------------- writes -------------------------------- */

async function persistHidden(ids: number[], repoMap: Record<number, string>) {
  try {
    await adminCall("set_hidden", {
      rows: ids.map((id) => ({ github_repo_id: id, repo_name: repoMap[id] ?? "" })),
    });
  } catch (err) {
    console.info("Supabase adminCall skipped/failed, using direct local code storage:", (err as Error).message);
  }
  writeCache(LS_HIDDEN_KEY, ids);
}

export async function toggleHiddenProjectDb(
  id: number,
  repoName: string,
  currentlyHidden: boolean,
  currentHidden?: number[],
): Promise<number[]> {
  const current = currentHidden ?? (await fetchHiddenProjectIds());
  const next = currentlyHidden
    ? current.filter((hId) => hId !== id)
    : Array.from(new Set([...current, id]));

  const repoMap: Record<number, string> = { [id]: repoName };
  await persistHidden(next, repoMap);
  return next;
}

export async function setAllHiddenProjectsDb(
  ids: number[],
  repoMap: Record<number, string>,
): Promise<number[]> {
  await persistHidden(ids, repoMap);
  return ids;
}

export async function toggleHomeFeaturedProjectDb(
  repo: { id: number; name: string },
  currentFeatured: FeaturedProject[],
): Promise<FeaturedProject[]> {
  const exists = currentFeatured.some((f) => f.id === repo.id);
  let next: FeaturedProject[];

  if (exists) {
    next = currentFeatured.filter((f) => f.id !== repo.id);
  } else {
    if (currentFeatured.length >= 3) return currentFeatured;
    next = [...currentFeatured, { id: repo.id, repo_name: repo.name, position: currentFeatured.length }];
  }

  return updateHomeFeaturedOrderDb(next);
}

export async function togglePageFeaturedProjectDb(
  repo: { id: number; name: string },
  currentFeatured: FeaturedProject[],
): Promise<FeaturedProject[]> {
  const exists = currentFeatured.some((f) => f.id === repo.id);
  let next: FeaturedProject[];

  if (exists) {
    next = currentFeatured.filter((f) => f.id !== repo.id);
  } else {
    if (currentFeatured.length >= 5) return currentFeatured;
    next = [...currentFeatured, { id: repo.id, repo_name: repo.name, position: currentFeatured.length }];
  }

  return updatePageFeaturedOrderDb(next);
}

export async function updateHomeFeaturedOrderDb(nextFeatured: FeaturedProject[]): Promise<FeaturedProject[]> {
  const withPos = nextFeatured.map((f, i) => ({ ...f, position: i }));
  try {
    await adminCall("set_featured", { items: withPos });
  } catch (err) {
    console.info("Supabase adminCall skipped/failed, using direct local code storage:", (err as Error).message);
  }
  writeCache(LS_HOME_FEATURED_KEY, withPos);
  return withPos;
}

export async function updatePageFeaturedOrderDb(nextFeatured: FeaturedProject[]): Promise<FeaturedProject[]> {
  const withPos = nextFeatured.map((f, i) => ({ ...f, position: i }));
  try {
    await adminCall("set_featured", { items: withPos });
  } catch (err) {
    console.info("Supabase adminCall skipped/failed, using direct local code storage:", (err as Error).message);
  }
  writeCache(LS_PAGE_FEATURED_KEY, withPos);
  return withPos;
}

export async function toggleFeaturedProjectDb(
  repo: { id: number; name: string },
  currentFeatured: FeaturedProject[],
): Promise<FeaturedProject[]> {
  return toggleHomeFeaturedProjectDb(repo, currentFeatured);
}

export async function updateFeaturedOrderDb(nextFeatured: FeaturedProject[]): Promise<FeaturedProject[]> {
  return updateHomeFeaturedOrderDb(nextFeatured);
}
