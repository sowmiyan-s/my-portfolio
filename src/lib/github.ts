const GITHUB_USERNAME = 'sowmiyan-s';
const API_BASE = 'https://api.github.com';
const CACHE_KEY = 'sw_cached_repos';

export interface GitHubRepo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  homepage: string;
  stargazers_count: number;
  language: string;
  updated_at: string;
  forks_count: number;
}

export const fallbackRepos: GitHubRepo[] = [
  {
    id: 1259197787,
    name: "awesome-claude-skills",
    description: "Production-ready Claude Skills for developers, creators, founders, and AI power users.",
    html_url: "https://github.com/sowmiyan-s/awesome-claude-skills",
    homepage: "",
    stargazers_count: 1,
    language: "TypeScript",
    updated_at: "2026-07-10T05:40:39Z",
    forks_count: 2
  },
  {
    id: 1090437122,
    name: "Blood-Donation-Analysis-Power-BI",
    description: "Comprehensive Power BI analysis and dashboard for blood donation metrics and donor retention.",
    html_url: "https://github.com/sowmiyan-s/Blood-Donation-Analysis-Power-BI",
    homepage: "",
    stargazers_count: 0,
    language: "PowerBI",
    updated_at: "2025-11-05T17:26:31Z",
    forks_count: 0
  },
  {
    id: 930233786,
    name: "boundbycode-promotion-website",
    description: "Promotion and landing page for BoundByCode tech community and events.",
    html_url: "https://github.com/sowmiyan-s/boundbycode-promotion-website",
    homepage: "",
    stargazers_count: 0,
    language: "CSS",
    updated_at: "2026-02-25T17:38:30Z",
    forks_count: 0
  },
  {
    id: 1103323258,
    name: "crewlyze",
    description: "🚀 Open-source Autonomous Multi-Agent Data Analyst Platform powered by CrewAI, FastAPI & Vanilla JS. Transform CSV/Excel datasets into executive PDF reports & custom charts.",
    html_url: "https://github.com/sowmiyan-s/crewlyze",
    homepage: "https://www.npmjs.com/package/crewlyze",
    stargazers_count: 5,
    language: "Python",
    updated_at: "2026-08-18T18:03:56Z",
    forks_count: 2
  },
  {
    id: 1027273319,
    name: "Data-Structures",
    description: "Data Structures and Algorithms for Interview Preparation.",
    html_url: "https://github.com/sowmiyan-s/Data-Structures",
    homepage: "",
    stargazers_count: 1,
    language: "Java",
    updated_at: "2025-07-29T13:47:49Z",
    forks_count: 0
  },
  {
    id: 1311605683,
    name: "discord-promt-bot",
    description: "Autonomous Discord bot for AI prompt generation, image synthesis, and automated community workflows.",
    html_url: "https://github.com/sowmiyan-s/discord-promt-bot",
    homepage: "",
    stargazers_count: 2,
    language: "JavaScript",
    updated_at: "2026-08-03T18:31:30Z",
    forks_count: 0
  },
  {
    id: 886262891,
    name: "DRAGONBALL-OPENCV",
    description: "Computer Vision project leveraging OpenCV for Dragon Ball themed character and gesture tracking.",
    html_url: "https://github.com/sowmiyan-s/DRAGONBALL-OPENCV",
    homepage: "",
    stargazers_count: 0,
    language: "Python",
    updated_at: "2024-11-10T16:15:19Z",
    forks_count: 0
  },
  {
    id: 1123627643,
    name: "Email-Spam-Detection",
    description: "An advanced machine learning solution designed to classify emails as Spam or Ham (Legitimate) with high precision using Support Vector Machines (SVM).",
    html_url: "https://github.com/sowmiyan-s/Email-Spam-Detection",
    homepage: "",
    stargazers_count: 1,
    language: "Python",
    updated_at: "2026-06-30T17:46:43Z",
    forks_count: 0
  },
  {
    id: 758135187,
    name: "emeralz",
    description: "Interactive web showcase and digital product portal.",
    html_url: "https://github.com/sowmiyan-s/emeralz",
    homepage: "https://emeralz.pages.dev/",
    stargazers_count: 0,
    language: "HTML",
    updated_at: "2026-02-25T17:40:04Z",
    forks_count: 0
  },
  {
    id: 1296125389,
    name: "FIFA-REFEREE",
    description: "A live AI referee system for computer vision football analysis and automated rule enforcement.",
    html_url: "https://github.com/sowmiyan-s/FIFA-REFEREE",
    homepage: "https://fifa-referee.vercel.app",
    stargazers_count: 2,
    language: "TypeScript",
    updated_at: "2026-07-17T18:17:43Z",
    forks_count: 0
  },
  {
    id: 1127630641,
    name: "free-for-dev",
    description: "A list of SaaS, PaaS and IaaS offerings that have free tiers of interest to devops and infradev.",
    html_url: "https://github.com/sowmiyan-s/free-for-dev",
    homepage: "https://free-for.dev/",
    stargazers_count: 0,
    language: "Markdown",
    updated_at: "2026-01-04T09:31:17Z",
    forks_count: 0
  },
  {
    id: 1210113778,
    name: "GUADRAILS-RAG-WITH-ENDEE",
    description: "Endee.io – High-performance vector database integration with guardrails for secured RAG pipelines.",
    html_url: "https://github.com/sowmiyan-s/GUADRAILS-RAG-WITH-ENDEE",
    homepage: "https://endee.io",
    stargazers_count: 0,
    language: "Python",
    updated_at: "2026-05-16T03:48:07Z",
    forks_count: 0
  },
  {
    id: 1189549319,
    name: "GUARD-RAG",
    description: "GUARD-RAG is a RAG chatbot tool that runs as a Python package and operates completely offline.",
    html_url: "https://github.com/sowmiyan-s/GUARD-RAG",
    homepage: "https://pypi.org/project/guard-rag/",
    stargazers_count: 0,
    language: "Python",
    updated_at: "2026-08-02T13:13:29Z",
    forks_count: 0
  },
  {
    id: 1103303342,
    name: "Health-Agent",
    description: "Intelligent health diagnostics and insights agent application powered by AI and Streamlit.",
    html_url: "https://github.com/sowmiyan-s/Health-Agent",
    homepage: "https://health-insights-agent.streamlit.app/",
    stargazers_count: 0,
    language: "Python",
    updated_at: "2026-07-10T07:26:41Z",
    forks_count: 0
  },
  {
    id: 905068744,
    name: "IBPFM",
    description: "An award-winning environmental management platform built for Sparkathon '24 (awarded 2nd Place).",
    html_url: "https://github.com/sowmiyan-s/IBPFM",
    homepage: "https://ibpfm.netlify.app/",
    stargazers_count: 0,
    language: "HTML",
    updated_at: "2026-06-30T17:43:59Z",
    forks_count: 0
  },
  {
    id: 1028399658,
    name: "Java-Problem-Solutions",
    description: "Java DSA problems solved and curated for competitive programming.",
    html_url: "https://github.com/sowmiyan-s/Java-Problem-Solutions",
    homepage: "",
    stargazers_count: 1,
    language: "Java",
    updated_at: "2026-06-20T18:16:00Z",
    forks_count: 0
  },
  {
    id: 1132298539,
    name: "leetcode-insight",
    description: "A web application that tracks, analyzes, and ranks developer performance based on LeetCode metrics and contest ratings.",
    html_url: "https://github.com/sowmiyan-s/leetcode-insight",
    homepage: "https://leetcode-validator.netlify.app/",
    stargazers_count: 0,
    language: "TypeScript",
    updated_at: "2026-06-30T17:39:30Z",
    forks_count: 0
  },
  {
    id: 997826626,
    name: "Machine-Learning",
    description: "Comprehensive repository with machine learning algorithms, notebooks, and learning materials.",
    html_url: "https://github.com/sowmiyan-s/Machine-Learning",
    homepage: "",
    stargazers_count: 0,
    language: "Python",
    updated_at: "2025-06-07T10:30:32Z",
    forks_count: 0
  },
  {
    id: 912834842,
    name: "Makeup-Artist-Website",
    description: "Elegant portfolio and booking website crafted for professional makeup artists.",
    html_url: "https://github.com/sowmiyan-s/Makeup-Artist-Website",
    homepage: "",
    stargazers_count: 0,
    language: "CSS",
    updated_at: "2025-01-06T14:01:52Z",
    forks_count: 0
  },
  {
    id: 1090421149,
    name: "ML-WorkBench",
    description: "ML Workbench is a powerful and intuitive Streamlit application designed to streamline machine learning workflows from data upload to model deployment.",
    html_url: "https://github.com/sowmiyan-s/ML-WorkBench",
    homepage: "",
    stargazers_count: 2,
    language: "Python",
    updated_at: "2026-06-30T17:47:13Z",
    forks_count: 0
  },
  {
    id: 1126718165,
    name: "Multi-Agent-Market-Researcher",
    description: "A sophisticated financial and market research system powered by Mistral AI and CrewAI.",
    html_url: "https://github.com/sowmiyan-s/Multi-Agent-Market-Researcher",
    homepage: "",
    stargazers_count: 0,
    language: "Python",
    updated_at: "2026-06-30T17:46:19Z",
    forks_count: 0
  },
  {
    id: 1288512579,
    name: "Natural-status-ml",
    description: "Machine learning model predicting natural climate and ecological state indicators.",
    html_url: "https://github.com/sowmiyan-s/Natural-status-ml",
    homepage: "",
    stargazers_count: 0,
    language: "Python",
    updated_at: "2026-07-03T17:15:02Z",
    forks_count: 0
  },
  {
    id: 1323898538,
    name: "PPE-Detection-and-Management-System",
    description: "AI-driven Personal Protective Equipment (PPE) detection and safety compliance dashboard.",
    html_url: "https://github.com/sowmiyan-s/PPE-Detection-and-Management-System",
    homepage: "",
    stargazers_count: 0,
    language: "TypeScript",
    updated_at: "2026-08-25T17:32:31Z",
    forks_count: 0
  },
  {
    id: 1045689509,
    name: "Python-Problems-Solutions",
    description: "Curated collection of Python DSA algorithms and interview problem solutions.",
    html_url: "https://github.com/sowmiyan-s/Python-Problems-Solutions",
    homepage: "",
    stargazers_count: 0,
    language: "Python",
    updated_at: "2025-08-28T17:20:00Z",
    forks_count: 0
  },
  {
    id: 1342524820,
    name: "resume-radiance",
    description: "Modern AI-enhanced resume builder and portfolio transformer.",
    html_url: "https://github.com/sowmiyan-s/resume-radiance",
    homepage: "https://vsbcetc-resume.vercel.app",
    stargazers_count: 1,
    language: "TypeScript",
    updated_at: "2026-08-27T14:03:13Z",
    forks_count: 0
  },
  {
    id: 1131240617,
    name: "rin-chat-website",
    description: "A fast, private, and elegant AI chat assistant — powered by Mistral AI and Supabase.",
    html_url: "https://github.com/sowmiyan-s/rin-chat-website",
    homepage: "https://rinx-ai.vercel.app",
    stargazers_count: 0,
    language: "TypeScript",
    updated_at: "2026-06-30T17:40:25Z",
    forks_count: 0
  },
  {
    id: 1318362106,
    name: "sowmiyan-s",
    description: "Special GitHub configuration & profile repository for sowmiyan-s.",
    html_url: "https://github.com/sowmiyan-s/sowmiyan-s",
    homepage: "",
    stargazers_count: 0,
    language: "Markdown",
    updated_at: "2026-08-27T13:38:38Z",
    forks_count: 1
  },
  {
    id: 1190847541,
    name: "sowmiyan-s-portfolio",
    description: "A personalized cyber-themed portfolio website showcasing AI projects, developer skills, and content creation.",
    html_url: "https://github.com/sowmiyan-s/sowmiyan-s-portfolio",
    homepage: "https://sowmiyan-s.vercel.app",
    stargazers_count: 1,
    language: "TypeScript",
    updated_at: "2026-08-26T09:51:15Z",
    forks_count: 1
  },
  {
    id: 1347145979,
    name: "sowmiyan-s.github.io",
    description: "GitHub Pages personal root site deployment.",
    html_url: "https://github.com/sowmiyan-s/sowmiyan-s.github.io",
    homepage: "",
    stargazers_count: 0,
    language: "HTML",
    updated_at: "2026-08-26T09:33:23Z",
    forks_count: 0
  },
  {
    id: 1235837149,
    name: "sri-mariamman-tractor-center",
    description: "Modern 3D commercial website built with advanced 3D interactive graphics.",
    html_url: "https://github.com/sowmiyan-s/sri-mariamman-tractor-center",
    homepage: "https://sri-mariamman-tractor-center.vercel.app",
    stargazers_count: 0,
    language: "JavaScript",
    updated_at: "2026-05-23T09:13:18Z",
    forks_count: 0
  },
  {
    id: 1027272885,
    name: "system-design-primer",
    description: "Comprehensive system design patterns, architectures, and scalable distributed system blueprints.",
    html_url: "https://github.com/sowmiyan-s/system-design-primer",
    homepage: "",
    stargazers_count: 1,
    language: "Markdown",
    updated_at: "2025-07-29T13:47:51Z",
    forks_count: 0
  },
  {
    id: 1144379845,
    name: "vyuga26-website",
    description: "A comprehensive, production-ready management system for event registrations, real-time attendance tracking and advanced data reporting.",
    html_url: "https://github.com/sowmiyan-s/vyuga26-website",
    homepage: "https://www.vyuga.net.in/",
    stargazers_count: 0,
    language: "TypeScript",
    updated_at: "2026-06-30T17:41:50Z",
    forks_count: 0
  },
  {
    id: 1228673102,
    name: "We-Share",
    description: "We Share is an open-source desktop app for instant peer-to-peer file transfers with or without a Wi-Fi router.",
    html_url: "https://github.com/sowmiyan-s/We-Share",
    homepage: "https://we-share-app.vercel.app",
    stargazers_count: 0,
    language: "C#",
    updated_at: "2026-07-30T18:39:52Z",
    forks_count: 0
  }
];

// Helper to merge repos ensuring no duplicates and retaining newest data
function mergeRepoLists(primary: GitHubRepo[], secondary: GitHubRepo[]): GitHubRepo[] {
  const map = new Map<string, GitHubRepo>();
  // Add secondary (fallback/cached) first
  for (const r of secondary) {
    map.set(r.name.toLowerCase(), r);
  }
  // Primary (fresh fetch or cached) overwrites
  for (const r of primary) {
    map.set(r.name.toLowerCase(), r);
  }
  return Array.from(map.values()).sort((a, b) => 
    new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );
}

export const clearRepoCache = () => {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch {}
};

export const fetchRepos = async (forceRefresh = false): Promise<GitHubRepo[]> => {
  // Read cache first if available and not forced
  let cached: GitHubRepo[] = [];
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) {
      cached = JSON.parse(raw);
    }
  } catch {}

  // If cached data exists with a good number of repos and not force refreshing, we can return merged cache
  const mergedFallback = mergeRepoLists(cached, fallbackRepos);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 7000);

  try {
    const response = await fetch(`${API_BASE}/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100&type=all`, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/vnd.github.v3+json',
      }
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`GitHub API Notice: ${response.status}. Using comprehensive fallback dataset.`);
      return mergedFallback;
    }

    const data: GitHubRepo[] = await response.json();
    if (Array.isArray(data) && data.length > 0) {
      // Merge live data with all fallback repos to ensure nothing is missed
      const fullList = mergeRepoLists(data, fallbackRepos);
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(fullList));
      } catch {}
      return fullList;
    }
  } catch (error) {
    clearTimeout(timeoutId);
    console.warn("GitHub fetch error, fallback activated:", (error as Error).message);
  }

  return mergedFallback;
};

export const fetchReadme = async (repoName: string): Promise<string> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);
  try {
    const response = await fetch(`https://raw.githubusercontent.com/${GITHUB_USERNAME}/${repoName}/main/README.md`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (!response.ok) {
      const altResponse = await fetch(`https://raw.githubusercontent.com/${GITHUB_USERNAME}/${repoName}/master/README.md`);
      if (!altResponse.ok) return '# No README found for this project.';
      return await altResponse.text();
    }
    return await response.text();
  } catch (error) {
    clearTimeout(timeoutId);
    return '# Error loading README.';
  }
};
