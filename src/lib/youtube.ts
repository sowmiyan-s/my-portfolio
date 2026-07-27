import { supabase } from "@/integrations/supabase/client";

export interface YouTubeVideo {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  published?: string;
  category?: string;
  duration?: string;
}

const CHANNEL_ID = "UCIf9XVT_MbyZpi5v0SrvXRg"; // @bound-by-code
const RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

// Multiple CORS proxies for resilience
const CORS_PROXIES = [
  "https://api.allorigins.win/raw?url=",
  "https://corsproxy.io/?",
  "https://api.codetabs.com/v1/proxy?chrome=true&url="
];

export const fallbackVideos: YouTubeVideo[] = [
  {
    id: "-IWJKd8OfUE",
    title: "Hermes Agent Explained | Complete Setup, Website Builder & Discord Integration",
    url: "https://www.youtube.com/watch?v=-IWJKd8OfUE",
    thumbnail: "https://i.ytimg.com/vi/-IWJKd8OfUE/hqdefault.jpg",
    category: "AI TOOLS",
    duration: "WATCH"
  },
  {
    id: "OBDyu3Q0IlE",
    title: "You’re Using Claude AI WRONG! 😱 Build Stunning Websites with Claude Skills + Antigravity (Tamil)",
    url: "https://www.youtube.com/watch?v=OBDyu3Q0IlE",
    thumbnail: "https://i.ytimg.com/vi/OBDyu3Q0IlE/hqdefault.jpg",
    category: "AI TOOLS",
    duration: "WATCH"
  },
  {
    id: "XQ0P4LA_4Ac",
    title: "Google Antigravity Explained 🔥 IDE vs 2.0 vs CLI in Tamil #geminiai #vibecoding",
    url: "https://www.youtube.com/watch?v=XQ0P4LA_4Ac",
    thumbnail: "https://i.ytimg.com/vi/XQ0P4LA_4Ac/hqdefault.jpg",
    category: "AI IDE",
    duration: "WATCH"
  },
  {
    id: "ZsgjazGRQTY",
    title: "Escape Vibe Coding Platform Restrictions — GitHub Integration || Tamil #vibecoding",
    url: "https://www.youtube.com/watch?v=ZsgjazGRQTY",
    thumbnail: "https://i.ytimg.com/vi/ZsgjazGRQTY/hqdefault.jpg",
    category: "WORKFLOW",
    duration: "WATCH"
  },
  {
    id: "VBFx-VX8B3M",
    title: "🚀 1-Day Workshop: Bring Your Website Online with AI 🌐 | Free Learning 🎓",
    url: "https://www.youtube.com/watch?v=VBFx-VX8B3M",
    thumbnail: "https://i.ytimg.com/vi/VBFx-VX8B3M/hqdefault.jpg",
    category: "TUTORIAL",
    duration: "WATCH"
  },
  {
    id: "FHUAV1ab9PM",
    title: "Ai with RAG model #chatgpt #aidev #openai #boundbycode",
    url: "https://www.youtube.com/watch?v=FHUAV1ab9PM",
    thumbnail: "https://i.ytimg.com/vi/FHUAV1ab9PM/hqdefault.jpg",
    category: "AI TOOLS",
    duration: "WATCH"
  },
  {
    id: "GvURQYzIv0U",
    title: "🚀 GPT-5 Is Here: The Most Powerful AI Ever Built (Full Breakdown)",
    url: "https://www.youtube.com/watch?v=GvURQYzIv0U",
    thumbnail: "https://i.ytimg.com/vi/GvURQYzIv0U/hqdefault.jpg",
    category: "AI TOOLS",
    duration: "WATCH"
  },
  {
    id: "jElK3HP0Ako",
    title: "How to get gemini pro for free | 100% working trick | #tamil | bound by code",
    url: "https://www.youtube.com/watch?v=jElK3HP0Ako",
    thumbnail: "https://i.ytimg.com/vi/jElK3HP0Ako/hqdefault.jpg",
    category: "TUTORIAL",
    duration: "WATCH"
  },
  {
    id: "hYieCwUjOyQ",
    title: "🔥 Top 10 Best DSA Practice Websites in 2025 | From Beginner to Pro 🔥",
    url: "https://www.youtube.com/watch?v=hYieCwUjOyQ",
    thumbnail: "https://i.ytimg.com/vi/hYieCwUjOyQ/hqdefault.jpg",
    category: "TUTORIAL",
    duration: "WATCH"
  },
  {
    id: "c2HkKfruIrI",
    title: "Learn langflow in 30s #ai #langflow #aitool #tech",
    url: "https://www.youtube.com/watch?v=c2HkKfruIrI",
    thumbnail: "https://i.ytimg.com/vi/c2HkKfruIrI/hqdefault.jpg",
    category: "AI TOOLS",
    duration: "WATCH"
  }
];

function determineCategory(title: string): string {
  const uppercaseTitle = title.toUpperCase();
  if (
    uppercaseTitle.includes("AI") ||
    uppercaseTitle.includes("COPILOT") ||
    uppercaseTitle.includes("CURSOR") ||
    uppercaseTitle.includes("ANTIGRAVITY") ||
    uppercaseTitle.includes("GEMINI") ||
    uppercaseTitle.includes("CLAUDE") ||
    uppercaseTitle.includes("HERMES") ||
    uppercaseTitle.includes("GPT")
  ) {
    return uppercaseTitle.includes("IDE") ? "AI IDE" : "AI TOOLS";
  } else if (
    uppercaseTitle.includes("OPEN SOURCE") ||
    uppercaseTitle.includes("GITHUB") ||
    uppercaseTitle.includes("GIT")
  ) {
    return "OPEN SOURCE";
  } else if (
    uppercaseTitle.includes("TUTORIAL") ||
    uppercaseTitle.includes("HOW TO") ||
    uppercaseTitle.includes("GUIDE") ||
    uppercaseTitle.includes("VIBE CODING") ||
    uppercaseTitle.includes("WORKSHOP")
  ) {
    return "TUTORIAL";
  } else if (uppercaseTitle.includes("WORKFLOW")) {
    return "WORKFLOW";
  }
  return "TECH";
}

function parseYouTubeFeedXml(xml: string): YouTubeVideo[] {
  try {
    if (typeof DOMParser === 'undefined') return [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, "application/xml");
    const entries = Array.from(doc.getElementsByTagName("entry"));

    return entries
      .map((entry) => {
        const ns = "http://www.youtube.com/xml/schemas/2015";
        const idNode =
          entry.getElementsByTagNameNS(ns, "videoId")[0] ??
          entry.getElementsByTagName("yt:videoId")[0];
        const id = idNode?.textContent?.trim() ?? "";
        const title = entry.querySelector("title")?.textContent?.trim() ?? "Untitled";
        const published = entry.querySelector("published")?.textContent?.trim() ?? "";

        return {
          id,
          title,
          url: `https://www.youtube.com/watch?v=${id}`,
          thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
          published,
          category: determineCategory(title),
          duration: "WATCH"
        };
      })
      .filter((video) => Boolean(video.id));
  } catch (e) {
    console.warn("Error parsing YouTube XML feed:", e);
    return [];
  }
}

/** Utility to deduplicate and combine video lists */
function mergeWithFallbacks(primaryList: YouTubeVideo[]): YouTubeVideo[] {
  const seenIds = new Set(primaryList.map(v => v.id));
  const merged = [...primaryList];
  for (const fb of fallbackVideos) {
    if (!seenIds.has(fb.id)) {
      seenIds.add(fb.id);
      merged.push(fb);
    }
  }
  return merged;
}

async function fetchFromRss2Json(): Promise<YouTubeVideo[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2000);

  try {
    const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error(`rss2json status ${res.status}`);
    const data = await res.json();
    if (data.status === "ok" && Array.isArray(data.items) && data.items.length > 0) {
      return data.items.map((item: any) => {
        let videoId = "";
        if (item.guid && item.guid.includes("yt:video:")) {
          videoId = item.guid.split("yt:video:")[1];
        } else if (item.link) {
          const match = item.link.match(/v=([a-zA-Z0-9_-]+)/);
          if (match) videoId = match[1];
        }

        const rawTitle = item.title || "Untitled";
        const title = rawTitle
          .replace(/&amp;/g, "&")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'");

        return {
          id: videoId,
          title,
          url: item.link || `https://www.youtube.com/watch?v=${videoId}`,
          thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
          published: item.pubDate || "",
          category: determineCategory(title),
          duration: "WATCH"
        };
      }).filter((v: YouTubeVideo) => Boolean(v.id));
    }
  } catch (err) {
    clearTimeout(timeoutId);
    console.warn("rss2json fetch completed via fallback:", (err as Error).message);
  }
  return [];
}

async function fetchYouTubeFeedViaProxy(): Promise<YouTubeVideo[]> {
  for (const proxy of CORS_PROXIES) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);

    try {
      const response = await fetch(`${proxy}${encodeURIComponent(RSS_URL)}`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (!response.ok) throw new Error(`Proxy status: ${response.status}`);
      const xml = await response.text();
      if (xml && xml.includes("<feed")) {
        const parsed = parseYouTubeFeedXml(xml);
        if (parsed.length > 0) return parsed;
      }
    } catch (err) {
      clearTimeout(timeoutId);
    }
  }
  return [];
}

// In-memory cache to eliminate duplicate network cascades
let cachedVideos: YouTubeVideo[] | null = null;
let pendingFetchPromise: Promise<YouTubeVideo[]> | null = null;

/**
 * Fetches the latest videos from the official @bound-by-code YouTube channel (UCIf9XVT_MbyZpi5v0SrvXRg).
 * Order of operation:
 * 1. Return in-memory cached results if available
 * 2. Deduplicate simultaneous caller promises
 * 3. Live RSS-to-JSON API (fast 2s timeout)
 * 4. Supabase edge function (fast 2s race timeout)
 * 5. CORS proxy fallbacks (fast 1.5s timeout per proxy)
 * 6. Static fallback list of verified videos from @bound-by-code
 */
export const fetchChannelVideos = async (forceRefresh = false): Promise<YouTubeVideo[]> => {
  if (!forceRefresh && cachedVideos && cachedVideos.length > 0) {
    return cachedVideos;
  }

  if (!forceRefresh && pendingFetchPromise) {
    return pendingFetchPromise;
  }

  pendingFetchPromise = (async () => {
    try {
      // 1. Try live RSS-to-JSON fetch first
      const liveVideos = await fetchFromRss2Json();
      if (liveVideos.length > 0) {
        cachedVideos = mergeWithFallbacks(liveVideos);
        return cachedVideos;
      }

      // 2. Try Supabase edge function with timeout safeguard
      try {
        const supabasePromise = supabase.functions.invoke("youtube-feed");
        const timeoutPromise = new Promise<{ data: null; error: Error }>((resolve) =>
          setTimeout(() => resolve({ data: null, error: new Error("Supabase timeout") }), 2000)
        );
        const { data, error } = await Promise.race([supabasePromise, timeoutPromise]);
        if (!error && data?.videos && data.videos.length > 0) {
          cachedVideos = mergeWithFallbacks(data.videos as YouTubeVideo[]);
          return cachedVideos;
        }
      } catch (err) {
        // Silent catch for Supabase fallback
      }

      // 3. Try CORS proxy XML fallbacks
      const proxyVideos = await fetchYouTubeFeedViaProxy();
      if (proxyVideos.length > 0) {
        cachedVideos = mergeWithFallbacks(proxyVideos);
        return cachedVideos;
      }
    } catch (e) {
      console.warn("YouTube fetch encountered error, using static fallbacks:", e);
    } finally {
      pendingFetchPromise = null;
    }

    // 4. Return static fallback list of real channel videos
    cachedVideos = fallbackVideos;
    return fallbackVideos;
  })();

  return pendingFetchPromise;
};


