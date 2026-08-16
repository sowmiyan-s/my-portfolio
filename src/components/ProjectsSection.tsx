import { useCallback, useEffect, useState, useRef } from "react";
import { useRealtimeRefetch } from "@/hooks/useRealtimeRefetch";

import { motion, useScroll, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { Github, Star, GitFork, Terminal } from "lucide-react";
import { fetchRepos } from "@/lib/github";
import { fetchHiddenProjectIds } from "@/lib/projectSettings";
import { formatRepoName } from "@/lib/formatRepo";
import RadarLoader from "./RadarLoader";
import ScrambleText from "./ScrambleText";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";


const parseInlineMarkdown = (text: string): string => {
  let html = text;
  // Bold **text**
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  // Italic *text*
  html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");
  // Inline code `code`
  html = html.replace(/`(.*?)`/g, "<code class='bg-white/5 px-1.5 py-0.5 rounded text-red-400 font-mono'>$1</code>");
  // Links [text](url)
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, "<a href='$2' target='_blank' class='text-red-500 hover:underline'>$1</a>");
  return html;
};

const renderHtmlTable = (headers: string[], rows: string[][]): string => {
  let html = `<div class="overflow-x-auto my-6 border border-white/10 rounded-lg bg-black/40"><table class="min-w-full divide-y divide-white/10 text-xs">`;
  
  // Headers
  html += `<thead class="bg-white/5 font-mono text-[9px] uppercase tracking-wider text-red-500"><tr>`;
  headers.forEach(header => {
    html += `<th class="px-4 py-3 text-left font-bold border-b border-white/10">${parseInlineMarkdown(header)}</th>`;
  });
  html += `</tr></thead>`;
  
  // Body
  html += `<tbody class="divide-y divide-white/5">`;
  rows.forEach((row, rowIdx) => {
    html += `<tr class="${rowIdx % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.01]'}">`;
    for (let c = 0; c < headers.length; c++) {
      const cellContent = parseInlineMarkdown(row[c] || "");
      html += `<td class="px-4 py-2 text-white/70">${cellContent}</td>`;
    }
    html += `</tr>`;
  });
  html += `</tbody></table></div>`;
  
  return html;
};

const convertMarkdownTablesToHtml = (markdown: string): string => {
  const lines = markdown.split("\n");
  const processedLines: string[] = [];
  let inTable = false;
  let tableHeaders: string[] = [];
  let tableRows: string[][] = [];

  const isSeparatorRow = (line: string): boolean => {
    const trimmed = line.trim();
    return trimmed.startsWith("|") && trimmed.endsWith("|") && /^[|:\-\s]+$/.test(trimmed);
  };

  const isTableLine = (line: string): boolean => {
    const trimmed = line.trim();
    return trimmed.startsWith("|") && trimmed.endsWith("|");
  };

  const parseCells = (line: string): string[] => {
    const trimmed = line.trim();
    const content = trimmed.slice(1, -1);
    const cells = content.split(/(?<!\\)\|/);
    return cells.map(c => c.trim().replace(/\\\|/g, "|"));
  };

  for (let i = 0; i < lines.length; i++) {
    const currentLine = lines[i];

    if (!inTable) {
      if (isTableLine(currentLine) && i + 1 < lines.length && isSeparatorRow(lines[i + 1])) {
        inTable = true;
        tableHeaders = parseCells(currentLine);
        tableRows = [];
        i++; // Skip the separator row
      } else {
        processedLines.push(currentLine);
      }
    } else {
      if (isTableLine(currentLine)) {
        tableRows.push(parseCells(currentLine));
      } else {
        processedLines.push(renderHtmlTable(tableHeaders, tableRows));
        inTable = false;
        processedLines.push(currentLine);
      }
    }
  }

  if (inTable) {
    processedLines.push(renderHtmlTable(tableHeaders, tableRows));
  }

  return processedLines.join("\n");
};

const ProjectCard = ({ project, index, side, onClick }: { project: any, index: number, side: "left" | "right", onClick: () => void }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Track scroll position of this card relative to viewport
  const { scrollYProgress: cardScroll } = useScroll({
    target: cardRef,
    offset: ["start end", "center center"]
  });

  const smoothProgress = useSpring(cardScroll, { stiffness: 80, damping: 20 });

  // Animating the red filling height
  const fillHeight = useTransform(smoothProgress, [0.1, 0.8], ["0%", "100%"]);
  
  // Glowing box-shadow red glow
  const borderGlow = useTransform(
    smoothProgress,
    [0.3, 0.8],
    [
      "0 0 0px rgba(239, 68, 68, 0)",
      "0 15px 40px rgba(239, 68, 68, 0.3)"
    ]
  );

  // Border color transitions
  const borderColor = useTransform(
    smoothProgress,
    [0.2, 0.8],
    ["rgba(255, 255, 255, 0.08)", "rgba(239, 68, 68, 0.85)"]
  );

  const formattedIndex = (index + 1).toString().padStart(2, '0');

  // Asymmetric sci-fi corner cuts (chamfers)
  const clipPathStyle = side === "left"
    ? "polygon(0% 0%, calc(100% - 20px) 0%, 100% 20px, 100% 100%, 20px 100%, 0% calc(100% - 20px))"
    : "polygon(20px 0%, 100% 0%, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0% 100%, 0% 20px)";

  return (
    <motion.div
      ref={cardRef}
      onClick={onClick}
      style={{
        boxShadow: borderGlow,
        borderColor: borderColor,
        clipPath: clipPathStyle
      }}
      className="relative w-full max-w-lg p-[1.5px] bg-white/10 overflow-hidden transition-all duration-300 group cursor-pointer"
    >
      {/* Inner Clipped Dark Container */}
      <div 
        style={{ clipPath: clipPathStyle }}
        className="w-full h-full bg-[#050505]/95 p-6 md:p-8 relative overflow-hidden flex flex-col z-10"
      >
        {/* Connection Dot (Desktop) */}
        <div
          id={`dot-${index}`}
          className={`absolute w-3.5 h-3.5 rounded-full bg-black border-4 border-red-500 z-30 shadow-[0_0_10px_rgba(239,68,68,0.8)] hidden md:block
            ${side === "left" ? "right-[-7px] top-1/2 -translate-y-1/2" : "left-[-7px] top-1/2 -translate-y-1/2"}
          `}
        />

        {/* Red Fill Layer */}
        <motion.div
          style={{ height: fillHeight }}
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-red-950 via-red-800 to-red-600/90 origin-bottom z-0 pointer-events-none"
        />

        {/* Card Content */}
        <div className="relative z-10 flex flex-col h-full text-white">
          
          {/* Top Header Row: System Index and Status */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Terminal size={10} className="text-red-500" />
              <span className="text-[10px] font-mono text-red-500 font-bold uppercase tracking-wider">
                NODE_{formattedIndex}
              </span>
            </div>
            <span className="text-[9px] font-mono tracking-widest text-white/30 uppercase bg-white/5 border border-white/10 px-2 py-0.5 rounded-md group-hover:bg-red-500/20 group-hover:border-red-500/30 group-hover:text-red-200 transition-all duration-500">
              {project.date}
            </span>
          </div>

          {/* Project Title (Scramble on scroll/view) */}
          <h3 className="text-2xl md:text-3xl font-heading font-black uppercase tracking-tighter mb-4 leading-none text-white group-hover:text-red-400 transition-colors duration-300">
            <ScrambleText text={project.title} triggerOnView />
          </h3>

          {/* Sci-Fi Monospace Typewriter Diagnostic Readouts */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 font-mono text-[10px] text-white/80 uppercase mb-4 border-l-2 border-red-600 pl-3 bg-black/60 p-2.5 rounded-lg border border-white/10">
            <div className="flex justify-between"><span>[STATUS]</span> <span className="text-red-500 font-bold">DEPLOYED</span></div>
            <div className="flex justify-between"><span>[LANGUAGE]</span> <span className="text-white font-bold">{project.tech[0] || 'N/A'}</span></div>
            <div className="flex justify-between"><span>[STARS]</span> <span className="text-yellow-400 font-bold">{project.stars.toString().padStart(3, '0')}</span></div>
            <div className="flex justify-between"><span>[FORKS]</span> <span className="text-white font-bold">{project.forks.toString().padStart(3, '0')}</span></div>
          </div>

          {/* Description */}
          <p className="text-white text-xs md:text-sm leading-relaxed mb-6 font-normal group-hover:text-white transition-colors duration-300">
            {project.description}
          </p>

          {/* Tech tags and social stats */}
          <div className="mt-auto flex flex-col gap-4">
            {/* Tech tags */}
            <div className="flex flex-wrap gap-1.5">
              {project.tech.map((t: string) => (
                <span
                  key={t}
                  className="text-[10px] px-2.5 py-1 bg-red-600/10 border border-red-500/30 rounded-md font-mono text-red-400 font-bold uppercase tracking-widest group-hover:bg-red-600 group-hover:text-white transition-all duration-300"
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Footer link */}
            <div className="flex items-center justify-between border-t border-white/10 pt-4 group-hover:border-red-500/30 transition-colors duration-300">
              <span className="text-[10px] font-mono text-white/60 font-bold group-hover:text-red-400 transition-colors">
                MAINFRAME_CONNECTED // YES
              </span>

              {/* Github Link */}
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center justify-center px-3 py-1.5 rounded-lg bg-red-600 border border-red-500 text-white font-bold hover:bg-white hover:text-black transition-all shadow-lg text-[10px] tracking-wider"
              >
                <Github size={13} className="mr-1.5" /> REPO
              </a>
            </div>
          </div>

        </div>

        {/* Decorative Grid Patterns */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] group-hover:opacity-[0.07] bg-tactical-grid z-0 transition-opacity duration-500" />
        
        {/* Scanning Scanline Effect */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(239,68,68,0.05)_50%)] bg-[length:100%_4px] pointer-events-none z-0" />
        <motion.div
          className="absolute left-0 right-0 h-[2px] bg-red-500/40 shadow-[0_0_8px_#ef4444] pointer-events-none z-0"
          animate={{
            top: ["0%", "100%", "0%"]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Corner Brackets */}
        <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t border-l border-white/10 group-hover:border-red-500/40 pointer-events-none transition-colors" />
        <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t border-r border-white/10 group-hover:border-red-500/40 pointer-events-none transition-colors" />
        <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b border-l border-white/10 group-hover:border-red-500/40 pointer-events-none transition-colors" />
        <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b border-r border-white/10 group-hover:border-red-500/40 pointer-events-none transition-colors" />
      </div>
    </motion.div>
  );
};

const ProjectsSection = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dotPoints, setDotPoints] = useState<{ x: number; y: number }[]>([]);
  
  // Modal states for Decoded Markdown README
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [readmeText, setReadmeText] = useState("");
  const [loadingReadme, setLoadingReadme] = useState(false);
  const [readmeBaseUrl, setReadmeBaseUrl] = useState("");
  const [repoRootUrl, setRepoRootUrl] = useState("");
  
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [junctionClicks, setJunctionClicks] = useState<Record<number, number>>({});
  const handleJunctionClick = (idx: number) => {
    const count = (junctionClicks[idx] || 0) + 1;
    setJunctionClicks(prev => ({ ...prev, [idx]: count }));
    
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      osc.frequency.setValueAtTime(800 + (count * 150), audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.02, audioCtx.currentTime);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);
    } catch(e){}

    if (count >= 5) {
      window.dispatchEvent(new CustomEvent('trigger-hacking-game'));
      setJunctionClicks(prev => ({ ...prev, [idx]: 0 }));
    }
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [data, hiddenIds] = await Promise.all([
        fetchRepos(),
        fetchHiddenProjectIds(),
      ]);
      const visible = data.filter((r) => !hiddenIds.includes(r.id));

      const formatted = visible
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
        .map(repo => {
          const dateObj = new Date(repo.updated_at);
          const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
          const year = dateObj.getFullYear().toString();

          return {
            id: repo.id,
            year,
            name: repo.name,
            title: formatRepoName(repo.name),
            date: `${months[dateObj.getMonth()]} ${year}`,
            description: repo.description || "No description provided.",
            tech: repo.language ? [repo.language] : ['System'],
            github: repo.html_url,
            stars: repo.stargazers_count,
            forks: repo.forks_count
          };
        });

      setProjects(formatted);
    } catch (err) {
      console.error("Failed to load projects:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    window.addEventListener("portfolio-config-changed", load);
    return () => window.removeEventListener("portfolio-config-changed", load);
  }, [load]);
  useRealtimeRefetch(['hidden_projects'], load);


  // Measure dot locations relative to parent container
  const updateDots = useCallback(() => {
    if (!containerRef.current || projects.length === 0) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const points: { x: number; y: number }[] = [];

    // 1. Top starting point
    const startEl = document.getElementById("dot-start");
    if (startEl) {
      const rect = startEl.getBoundingClientRect();
      points.push({
        x: rect.left - containerRect.left + rect.width / 2,
        y: rect.top - containerRect.top + rect.height / 2,
      });
    }

    // 2. Middle points (along timeline nodes)
    projects.forEach((_, index) => {
      const isMobile = window.innerWidth < 768;
      const elId = isMobile ? `dot-mobile-${index}` : `dot-${index}`;
      const el = document.getElementById(elId);
      if (el) {
        const rect = el.getBoundingClientRect();
        points.push({
          x: rect.left - containerRect.left + rect.width / 2,
          y: rect.top - containerRect.top + rect.height / 2,
        });
      }
    });

    // 3. Bottom ending point
    const endEl = document.getElementById("dot-end");
    if (endEl) {
      const rect = endEl.getBoundingClientRect();
      points.push({
        x: rect.left - containerRect.left + rect.width / 2,
        y: rect.top - containerRect.top + rect.height / 2,
      });
    }

    setDotPoints(points);
  }, [projects]);

  // Handle window resizing and document load to redraw paths
  useEffect(() => {
    if (loading || projects.length === 0) return;

    const timer = setTimeout(() => {
      updateDots();
    }, 150);

    window.addEventListener("resize", updateDots);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateDots);
    };
  }, [loading, projects, updateDots]);

  // Construct 90-degree stepped stepped circuit path
  const generatePath = () => {
    if (dotPoints.length < 2) return "";
    let pathD = `M ${dotPoints[0].x} ${dotPoints[0].y}`;
    for (let i = 0; i < dotPoints.length - 1; i++) {
      const p1 = dotPoints[i];
      const p2 = dotPoints[i + 1];
      const dy = p2.y - p1.y;
      
      const midY = p1.y + dy * 0.5;
      // Sharp stepped lines representing PCB layout traces
      pathD += ` L ${p1.x} ${midY} L ${p2.x} ${midY} L ${p2.x} ${p2.y}`;
    }
    return pathD;
  };

  const pathD = generatePath();

  // Scroll tracking for drawing line progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const springPathLength = useSpring(scrollYProgress, { stiffness: 45, damping: 15 });

  // Generate copper pads coordinates for the circuit trace bends
  const getCircuitPads = () => {
    const pads: { x: number; y: number }[] = [];
    for (let i = 0; i < dotPoints.length - 1; i++) {
      const p1 = dotPoints[i];
      const p2 = dotPoints[i + 1];
      const dy = p2.y - p1.y;
      const midY = p1.y + dy * 0.5;
      pads.push({ x: p1.x, y: midY });
      pads.push({ x: p2.x, y: midY });
    }
    return pads;
  };

  const pads = getCircuitPads();

  // Fetches README file details from GitHub API when card is clicked
  const openProjectModal = async (project: any) => {
    setSelectedProject(project);
    setReadmeText("");
    setLoadingReadme(true);
    setReadmeBaseUrl("");
    setRepoRootUrl("");
    try {
      const readmeRes = await fetch(`https://api.github.com/repos/sowmiyan-s/${project.name}/readme`);
      if (readmeRes.ok) {
        const readmeData = await readmeRes.json();
        if (readmeData.download_url) {
          const downloadUrl = readmeData.download_url;
          
          // Get directory containing README
          const lastSlashIdx = downloadUrl.lastIndexOf("/");
          const dirUrl = downloadUrl.substring(0, lastSlashIdx + 1);
          setReadmeBaseUrl(dirUrl);

          // Get repo root raw URL
          const parts = downloadUrl.split("/");
          const branch = parts[5] || "main";
          const rootUrl = `https://raw.githubusercontent.com/sowmiyan-s/${project.name}/${branch}/`;
          setRepoRootUrl(rootUrl);

          const rawRes = await fetch(downloadUrl);
          if (rawRes.ok) {
            const rawText = await rawRes.text();
            setReadmeText(convertMarkdownTablesToHtml(rawText));
          } else {
            setReadmeText("# Decrypt Error\nFailed to download raw README content.");
          }
        } else {
          setReadmeText("# Decrypt Error\nREADME download source could not be resolved.");
        }
      } else {
        setReadmeText(convertMarkdownTablesToHtml(`# ${project.title}\n\n${project.description}\n\n*No README.md document found in the repository.*`));
      }
    } catch (e) {
      console.error(e);
      setReadmeText("# Connection Error\nCould not fetch README database from GitHub API.");
    } finally {
      setLoadingReadme(false);
    }
  };

  // Custom renderer for ReactMarkdown to resolve relative images/gifs using absolute paths
  const customRenderers = {
    img: ({ src, alt, ...props }: any) => {
      if (!src) return null;
      const isAbsolute = src.startsWith("http://") || src.startsWith("https://") || src.startsWith("data:");
      if (!isAbsolute) {
        let resolved = src;
        if (src.startsWith("/")) {
          // Root relative (e.g. /docs/img.png)
          resolved = `${repoRootUrl}${src.substring(1)}`;
        } else {
          // Folder relative (e.g. ./img.png or docs/img.png)
          const cleanSrc = src.startsWith("./") ? src.substring(2) : src;
          resolved = `${readmeBaseUrl}${cleanSrc}`;
        }
        return <img src={resolved} alt={alt} className="max-w-full h-auto rounded-lg my-4 border border-white/10 bg-black/40" {...props} />;
      }
      return <img src={src} alt={alt} className="max-w-full h-auto rounded-lg my-4 border border-white/10 bg-black/40" {...props} />;
    }
  };

  return (
    <section id="projects-list" className="py-20 bg-transparent relative z-10">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col gap-4 mb-16">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 bg-red-600 rounded-full animate-ping" />
            <span className="text-xs font-mono text-red-600 font-bold uppercase tracking-[0.6em]">PROJECT PORTFOLIO</span>
          </div>
          <h2 className="text-4xl md:text-8xl font-heading font-black text-white uppercase tracking-tighter leading-none">
            <ScrambleText text="All Projects" />
          </h2>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-60 gap-12">
            <RadarLoader />
            <p className="font-mono text-[10px] uppercase tracking-[1em] text-red-600 animate-pulse text-center">Reconstructing Timeline Axis</p>
          </div>
        ) : projects.length > 0 ? (
          <div ref={containerRef} className="relative w-full py-12">
            
            {/* Start Dot */}
            <div id="dot-start" className="absolute top-0 md:left-1/2 md:-translate-x-1/2 left-6 w-2 h-2 opacity-0" />

            {/* SVG Stepped Circuit Canvas */}
            {pathD && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
                {/* Background Trace Track */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.05)"
                  strokeWidth={2}
                  strokeLinecap="square"
                />
                {/* Animated Scroll-drawn Active Circuit Trace */}
                <motion.path
                  d={pathD}
                  fill="none"
                  strokeWidth={2.5}
                  strokeLinecap="square"
                  style={{ pathLength: springPathLength }}
                  className="stroke-red-500 drop-shadow-[0_0_6px_rgba(239,68,68,0.7)]"
                />

                {/* Circuit Copper Pads (stepped bends) */}
                {pads.map((pad, idx) => (
                  <g key={`pad-${idx}`}>
                    <rect
                      x={pad.x - 3.5}
                      y={pad.y - 3.5}
                      width={7}
                      height={7}
                      fill="none"
                      strokeWidth={1}
                      className="stroke-red-500 opacity-40"
                    />
                    <rect
                      x={pad.x - 1}
                      y={pad.y - 1}
                      width={2}
                      height={2}
                      className="fill-red-500 opacity-70 animate-pulse"
                    />
                  </g>
                ))}

                {/* Pulsing Active Junction Nodes */}
                {dotPoints.map((pt, i) => {
                  if (i === 0 || i === dotPoints.length - 1) return null;
                  return (
                    <g key={`junction-${i}`}>
                      {/* Outer Ring Ping */}
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={12}
                        className="fill-red-500 opacity-[0.05] animate-ping"
                        style={{ transformOrigin: `${pt.x}px ${pt.y}px`, animationDuration: '4.5s' }}
                      />
                      {/* Technical Crosshairs */}
                      <line x1={pt.x - 6} y1={pt.y} x2={pt.x + 6} y2={pt.y} strokeWidth={0.8} className="stroke-red-500 opacity-25" />
                      <line x1={pt.x} y1={pt.y - 6} x2={pt.x} y2={pt.y + 6} strokeWidth={0.8} className="stroke-red-500 opacity-25" />
                      {/* Core Junction Node */}
                      <rect
                        x={pt.x - 2.5}
                        y={pt.y - 2.5}
                        width={5}
                        height={5}
                        className="fill-red-500 animate-pulse cursor-pointer pointer-events-auto"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleJunctionClick(i);
                        }}
                      />
                    </g>
                  );
                })}
              </svg>
            )}

            {/* Projects Alternating Grid */}
            <div className="relative z-10 flex flex-col gap-24 md:gap-36">
              {projects.map((project, index) => {
                const isEven = index % 2 === 0;
                return (
                  <div
                    key={project.id}
                    className="grid grid-cols-1 md:grid-cols-[1fr_100px_1fr] items-center relative w-full"
                  >
                    {/* Left Column */}
                    <div className="flex justify-end pl-12 md:pl-0 md:pr-12 order-2 md:order-1 w-full relative">
                      {isEven ? (
                        <div className="relative w-full flex justify-end">
                          <ProjectCard project={project} index={index} side="left" onClick={() => openProjectModal(project)} />
                        </div>
                      ) : (
                        <div className="hidden md:flex flex-col items-end pr-8 self-center text-right w-full font-mono text-[10px] text-white/30 tracking-widest leading-relaxed">
                          <div className="flex items-center gap-1.5 text-red-500/80 mb-1 font-bold">
                            <span className="w-1 h-1 bg-red-500 rounded-full animate-pulse" />
                            [RELEASED]
                          </div>
                          <span>SYS_TIME // {project.date}</span>
                        </div>
                      )}
                    </div>

                    {/* Middle Space */}
                    <div className="hidden md:block order-2" />

                    {/* Right Column */}
                    <div className="flex justify-start pl-12 md:pl-12 order-1 md:order-3 w-full relative">
                      {!isEven ? (
                        <div className="relative w-full flex justify-start">
                          <ProjectCard project={project} index={index} side="right" onClick={() => openProjectModal(project)} />
                        </div>
                      ) : (
                        <div className="hidden md:flex flex-col items-start pl-8 self-center text-left w-full font-mono text-[10px] text-white/30 tracking-widest leading-relaxed">
                          <div className="flex items-center gap-1.5 text-red-500/80 mb-1 font-bold">
                            <span className="w-1 h-1 bg-red-500 rounded-full animate-pulse" />
                            [RELEASED]
                          </div>
                          <span>SYS_TIME // {project.date}</span>
                        </div>
                      )}
                    </div>

                    {/* Mobile Dot Element */}
                    <div
                      id={`dot-mobile-${index}`}
                      className="absolute left-6 top-6 w-3.5 h-3.5 rounded-full bg-black border-4 border-red-500 z-30 shadow-[0_0_10px_rgba(239,68,68,0.8)] block md:hidden"
                    />
                  </div>
                );
              })}
            </div>

            {/* End Dot */}
            <div id="dot-end" className="absolute bottom-0 md:left-1/2 md:-translate-x-1/2 left-6 w-2 h-2 opacity-0" />
          </div>
        ) : (
          <div className="text-center py-40 border-2 border-dashed border-white/10 rounded-[3rem] bg-white/[0.01]">
            <p className="font-mono text-xl text-red-600 uppercase tracking-widest mb-3 font-black">Timeline Axis Offline</p>
            <p className="text-[10px] text-white/30 uppercase tracking-[0.5em]">No significant events found in the public repository archive.</p>
          </div>
        )}
      </div>

      {/* Decoded README Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div 
            onClick={() => setSelectedProject(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              data-lenis-prevent="true"
              className="relative max-w-4xl w-full bg-[#050505] border border-red-500/30 p-6 md:p-8 shadow-2xl flex flex-col max-h-[85vh] rounded-xl overflow-hidden"
            >
              {/* Scanline Sweep in Modal */}
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(239,68,68,0.01)_50%)] bg-[length:100%_4px] pointer-events-none" />

              {/* Modal Header */}
              <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-6 z-10">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-mono text-red-500 font-bold uppercase tracking-widest">
                    MAINFRAME_DECRYPT // {selectedProject.name}
                  </span>
                  <h3 className="font-heading font-black text-xl md:text-2xl uppercase tracking-tight text-white leading-none">
                    {selectedProject.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="px-4 py-2 border border-red-600 text-[10px] font-mono text-red-500 hover:bg-red-600 hover:text-white transition-all uppercase tracking-widest font-bold rounded-md"
                >
                  [ Close X ]
                </button>
              </div>

              {/* Modal Body / Markdown Content */}
              <div 
                data-lenis-prevent="true"
                className="flex-grow overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-red-600/30 scrollbar-track-transparent z-10 text-left"
              >
                {loadingReadme ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <div className="w-8 h-8 rounded-full border-4 border-red-500/20 border-t-red-600 animate-spin" />
                    <p className="font-mono text-[9px] uppercase tracking-widest text-red-500 animate-pulse">
                      Decrypting project database...
                    </p>
                  </div>
                ) : (
                  <div className="prose prose-invert max-w-none text-white/80 font-sans prose-pre:bg-neutral-950 prose-pre:border prose-pre:border-white/10 prose-headings:text-white prose-headings:font-heading prose-headings:uppercase prose-headings:tracking-tight prose-a:text-red-500 hover:prose-a:text-red-400 prose-code:text-red-400 prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:before:content-none prose-code:after:content-none">
                    <ReactMarkdown rehypePlugins={[rehypeRaw]} components={customRenderers}>
                      {readmeText}
                    </ReactMarkdown>
                  </div>
                )}
              </div>

              {/* Modal Footer Info */}
              <div className="flex justify-between items-center border-t border-white/5 pt-4 mt-6 text-[8px] font-mono text-white/20 z-10">
                <span>RECON_AXIS_STATE // DECRYPTED_OK</span>
                <span>DECRYPTED_AT // {new Date().toLocaleTimeString()}</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ProjectsSection;
