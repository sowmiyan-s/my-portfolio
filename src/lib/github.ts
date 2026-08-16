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
    id: 1103323258,
    name: 'crewlyze',
    description: 'Open-source Autonomous Multi-Agent Data Analyst Platform powered by CrewAI, FastAPI & Vanilla JS. Transform CSV/Excel datasets into executive PDF reports & custom charts.',
    html_url: 'https://github.com/sowmiyan-s/crewlyze',
    homepage: '',
    stargazers_count: 5,
    language: 'Python',
    updated_at: '2026-07-27T02:20:58Z',
    forks_count: 1
  },
  {
    id: 1259197787,
    name: 'awesome-claude-skills',
    description: 'Production-ready Claude Skills for developers, creators, founders, and AI power users.',
    html_url: 'https://github.com/sowmiyan-s/awesome-claude-skills',
    homepage: '',
    stargazers_count: 3,
    language: 'TypeScript',
    updated_at: '2026-07-10T05:40:39Z',
    forks_count: 0
  },
  {
    id: 1296125389,
    name: 'FIFA-REFEREE',
    description: 'A live AI referee system for computer vision football analysis and automated rule enforcement.',
    html_url: 'https://github.com/sowmiyan-s/FIFA-REFEREE',
    homepage: '',
    stargazers_count: 2,
    language: 'TypeScript',
    updated_at: '2026-07-17T18:17:43Z',
    forks_count: 0
  },
  {
    id: 1090421149,
    name: 'ML-WorkBench',
    description: 'ML Workbench is a powerful Streamlit application designed to streamline machine learning workflows from dataset upload to model deployment.',
    html_url: 'https://github.com/sowmiyan-s/ML-WorkBench',
    homepage: '',
    stargazers_count: 2,
    language: 'Python',
    updated_at: '2026-06-30T17:47:13Z',
    forks_count: 0
  },
  {
    id: 1123627643,
    name: 'Email-Spam-Detection',
    description: 'An advanced machine learning solution designed to classify emails as Spam or Legitimate using Support Vector Machines (SVM).',
    html_url: 'https://github.com/sowmiyan-s/Email-Spam-Detection',
    homepage: '',
    stargazers_count: 1,
    language: 'Python',
    updated_at: '2026-06-30T17:46:43Z',
    forks_count: 0
  },
  {
    id: 1190847541,
    name: 'sowmiyan-s-portfolio',
    description: 'A personalized cyber-themed portfolio website showcasing AI projects, developer skills, and content creation.',
    html_url: 'https://github.com/sowmiyan-s/sowmiyan-s-portfolio',
    homepage: '',
    stargazers_count: 1,
    language: 'TypeScript',
    updated_at: '2026-07-13T18:33:54Z',
    forks_count: 0
  },
  {
    id: 1311605683,
    name: 'discord-promt-bot',
    description: 'Autonomous Discord bot for AI prompt generation, image synthesis, and automated community workflows.',
    html_url: 'https://github.com/sowmiyan-s/discord-promt-bot',
    homepage: '',
    stargazers_count: 2,
    language: 'JavaScript',
    updated_at: '2026-07-25T13:04:30Z',
    forks_count: 0
  }
];

export const fetchRepos = async (): Promise<GitHubRepo[]> => {
  // Read cache first if available
  let cached: GitHubRepo[] = [];
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) cached = JSON.parse(raw);
  } catch {}

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);

  try {
    const response = await fetch(`${API_BASE}/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`GitHub API Notice: ${response.status}. Using fallback repositories dataset.`);
      return cached.length ? cached : fallbackRepos;
    }

    const data: GitHubRepo[] = await response.json();
    if (Array.isArray(data) && data.length > 0) {
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      } catch {}
      return data;
    }
  } catch (error) {
    clearTimeout(timeoutId);
    console.warn("GitHub fetch completed via fallback dataset:", (error as Error).message);
  }

  return cached.length ? cached : fallbackRepos;
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

