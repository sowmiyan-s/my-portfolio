import { supabase } from "@/integrations/supabase/client";
import { adminCall } from "@/lib/adminApi";

const LS_HIDDEN_KEY = "sw_hidden_projects";
const LS_FEATURED_KEY = "sw_featured_projects";

export interface FeaturedProject {
  id: number;
  repo_name: string;
  position: number;
}

/* --------------------------------- cache --------------------------------- */
/* The database is the single source of truth. localStorage is only an offline
   cache so the first paint is instant — it never overrides remote data.      */

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
    if (localStorage.getItem(key) === serialized) return;
    localStorage.setItem(key, serialized);
    window.dispatchEvent(new CustomEvent("portfolio-config-changed"));
  } catch (e) {
    console.warn("Failed to cache portfolio config:", e);
  }
}

export function getLocalHiddenIds(): number[] {
  return readCache<number[]>(LS_HIDDEN_KEY, []);
}

export function getLocalFeatured(): FeaturedProject[] {
  return readCache<FeaturedProject[]>(LS_FEATURED_KEY, []);
}

/* --------------------------------- reads --------------------------------- */

export async function fetchHiddenProjectIds(): Promise<number[]> {
  try {
    const { data, error } = await supabase.from("hidden_projects").select("github_repo_id");
    if (!error && data) {
      const ids = data.map((r: any) => r.github_repo_id as number);
      writeCache(LS_HIDDEN_KEY, ids);
      return ids;
    }
  } catch (err) {
    console.warn("Error fetching hidden_projects:", err);
  }
  return getLocalHiddenIds();
}

export async function fetchFeaturedProjects(): Promise<FeaturedProject[]> {
  try {
    const { data, error } = await supabase
      .from("featured_projects")
      .select("github_repo_id, repo_name, position")
      .order("position", { ascending: true });
    if (!error && data) {
      const remote = data.map((r: any) => ({
        id: r.github_repo_id as number,
        repo_name: r.repo_name as string,
        position: (r.position ?? 0) as number,
      }));
      writeCache(LS_FEATURED_KEY, remote);
      return remote;
    }
  } catch (err) {
    console.warn("Error fetching featured_projects:", err);
  }
  return getLocalFeatured();
}

/* --------------------------------- writes -------------------------------- */
/* All writes go through the admin edge function (service role + password), so
   the tables stay locked down for anonymous visitors.                        */

async function persistHidden(ids: number[], repoMap: Record<number, string>) {
  await adminCall("set_hidden", {
    rows: ids.map((id) => ({ github_repo_id: id, repo_name: repoMap[id] ?? "" })),
  });
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

export async function toggleFeaturedProjectDb(
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

  return updateFeaturedOrderDb(next);
}

export async function updateFeaturedOrderDb(nextFeatured: FeaturedProject[]): Promise<FeaturedProject[]> {
  const withPos = nextFeatured.map((f, i) => ({ ...f, position: i }));
  await adminCall("set_featured", { items: withPos });
  writeCache(LS_FEATURED_KEY, withPos);
  return withPos;
}
