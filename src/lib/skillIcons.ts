/**
 * Map of skill name (lowercased) -> Simple Icons CDN slug.
 * Uses https://cdn.simpleicons.org which serves official brand SVGs in vibrant brand colors.
 */
const map: Record<string, string> = {
  // languages
  python: "python",
  java: "openjdk",
  "java script": "javascript",
  javascript: "javascript",
  js: "javascript",
  typescript: "typescript",
  ts: "typescript",
  html: "html5",
  html5: "html5",
  css: "css3",
  css3: "css3",
  sql: "mysql",

  // AI / ML & Agents
  ai: "openai",
  llm: "openai",
  llms: "openai",
  rag: "openai",
  openai: "openai",
  "fine-tune": "huggingface",
  langchain: "langchain",
  langflow: "langchain",
  crewai: "openai",
  mcp: "anthropic",
  "hugging face": "huggingface",
  huggingface: "huggingface",
  tensorflow: "tensorflow",
  pytorch: "pytorch",
  claude: "anthropic",
  ollama: "ollama",
  fastapi: "fastapi",
  n8n: "n8n",

  // web & frontend
  react: "react",
  "react.js": "react",
  reactjs: "react",
  "next.js": "nextdotjs",
  nextjs: "nextdotjs",
  "node.js": "nodedotjs",
  nodejs: "nodedotjs",
  node: "nodedotjs",
  "node js": "nodedotjs",
  vite: "vite",
  tailwind: "tailwindcss",
  "tailwind css": "tailwindcss",
  tailwindcss: "tailwindcss",
  bootstrap: "bootstrap",

  // data & databases
  mongodb: "mongodb",
  "mongo db": "mongodb",
  mongo: "mongodb",
  mysql: "mysql",
  postgresql: "postgresql",
  postgres: "postgresql",
  supabase: "supabase",
  pandas: "pandas",
  "power bi": "powerbi",
  powerbi: "powerbi",

  // cloud / infra & devops
  aws: "amazonwebservices",
  "amazon(aws)": "amazonwebservices",
  amazon: "amazonwebservices",
  vercel: "vercel",
  netlify: "netlify",
  docker: "docker",
  linux: "linux",
  ubuntu: "ubuntu",

  // tools & design
  vscode: "visualstudiocode",
  "vs code": "visualstudiocode",
  figma: "figma",
  git: "git",
  github: "github",
  postman: "postman",
};

export function getSkillCategory(name: string): 'ai' | 'lang' | 'frontend' | 'cloud' | 'data' {
  const k = name.trim().toLowerCase();
  if (/langchain|crewai|hugging|claude|ollama|n8n|ai|llm|rag|openai|fastapi|pytorch|tensorflow/i.test(k)) return 'ai';
  if (/python|java|typescript|javascript|html|css|sql/i.test(k)) return 'lang';
  if (/react|vite|tailwind|figma|next|bootstrap/i.test(k)) return 'frontend';
  if (/aws|docker|linux|vercel|netlify|git|github|ubuntu/i.test(k)) return 'cloud';
  if (/mongo|mysql|postgres|supabase|pandas|power/i.test(k)) return 'data';
  return 'ai';
}

const BLACK_OR_DARK_ICONS = new Set([
  "nextdotjs",
  "vercel",
  "github",
  "ollama",
  "anthropic",
  "linux",
  "apple",
  "openai",
  "shadcnui",
  "express",
  "flask",
  "crewai",
  "n8n"
]);

export function getSkillIconUrl(name: string, colored: boolean = true): string | null {
  const key = name.trim().toLowerCase();
  const slug = map[key] ?? map[key.replace(/[._-]/g, " ")];
  if (!slug) return null;
  
  // If colored is requested but the brand's official icon is black/dark, serve in white for high visibility
  if (colored && BLACK_OR_DARK_ICONS.has(slug)) {
    return `https://cdn.simpleicons.org/${slug}/ffffff`;
  }

  return colored 
    ? `https://cdn.simpleicons.org/${slug}`
    : `https://cdn.simpleicons.org/${slug}/ffffff`;
}

