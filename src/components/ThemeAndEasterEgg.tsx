import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, ShieldAlert, Terminal, X, RefreshCw, Volume2, VolumeX, Sparkles } from 'lucide-react';

const themes = [
  { id: 'red', name: 'CYBER_RED', color: '#ef4444' },
  { id: 'blue', name: 'COBALT_BLUE', color: '#3b82f6' },
  { id: 'green', name: 'MATRIX_GREEN', color: '#10b981' },
  { id: 'purple', name: 'NEON_PURPLE', color: '#a855f7' },
  { id: 'yellow', name: 'GOLD_ORANGE', color: '#f59e0b' }
];

// Secret themes — NOT in the settings panel, only unlockable via easter eggs
const secretThemes: Record<string, { name: string; color: string }> = {
  neon: { name: 'NEON_PINK', color: '#ec4899' },
  midnight: { name: 'MIDNIGHT_TEAL', color: '#06b6d4' },
  phantom: { name: 'PHANTOM_MODE', color: '#f43f5e' },
};

const CANDIDATE_CODES = ["A4B1", "E9D2", "B6F2", "D1A9", "9F2C", "2C4F", "F3E2", "5A8D", "7C1E", "3F8A", "8D2C", "B6E9"];

const KONAMI_CODE = [
  "arrowup", "arrowup",
  "arrowdown", "arrowdown",
  "arrowleft", "arrowright",
  "arrowleft", "arrowright",
  "b", "a"
];

const RESUME_URL = "https://drive.google.com/file/d/1NmangaAFo0eGT-KAsZi4VWOm6zI-KPk6/view?usp=sharing";

// ─── Audio Helpers ───────────────────────────────────────────────────────────
const playSynthBeep = (freq = 800, duration = 0.08, type: OscillatorType = "sine") => {
  if (typeof window !== 'undefined' && localStorage.getItem('sowmiyan-portfolio-audio-muted') === 'true') return;
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {}
};

const playWinChime = () => {
  [400, 600, 800, 1200].forEach((f, i) =>
    setTimeout(() => playSynthBeep(f, i === 3 ? 0.3 : 0.15, i === 3 ? "sine" : "triangle"), i * 100)
  );
};

const playLoseBuzz = () => {
  setTimeout(() => playSynthBeep(120, 0.25, "sawtooth"), 0);
  setTimeout(() => playSynthBeep(90, 0.35, "sawtooth"), 100);
};

const getMatchCount = (guess: string, target: string) => {
  let count = 0;
  for (let i = 0; i < 4; i++) if (guess[i] === target[i]) count++;
  return count;
};

// ─── Visual Effect: Confetti / Fireworks Particle Explosion ──────────────────
function spawnConfetti(count = 150) {
  const container = document.createElement('div');
  container.style.cssText = 'position:fixed;inset:0;z-index:99999;pointer-events:none;overflow:hidden;';
  document.body.appendChild(container);

  const colors = ['#ef4444', '#3b82f6', '#10b981', '#a855f7', '#f59e0b', '#ec4899', '#06b6d4', '#ffffff', '#facc15', '#fb923c'];
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    const size = Math.random() * 8 + 4;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const startX = 40 + Math.random() * 20; // center-ish
    const driftX = (Math.random() - 0.5) * 200;
    const duration = 1.5 + Math.random() * 2;
    const delay = Math.random() * 0.4;
    const shape = Math.random() > 0.5 ? '50%' : '0';

    particle.style.cssText = `
      position:absolute;
      left:${startX}%;
      top:40%;
      width:${size}px;
      height:${size}px;
      background:${color};
      border-radius:${shape};
      opacity:1;
      animation: confetti-burst ${duration}s ${delay}s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
      --drift-x: ${driftX}px;
      --rotation: ${Math.random() * 720 - 360}deg;
    `;
    container.appendChild(particle);
  }
  setTimeout(() => container.remove(), 4000);
}

// ─── Visual Effect: Matrix Rain ──────────────────────────────────────────────
function startMatrixRain(durationMs = 8000) {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;inset:0;z-index:99998;pointer-events:none;';
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d')!;
  const fontSize = 14;
  const columns = Math.floor(canvas.width / fontSize);
  const drops = new Array(columns).fill(1);
  const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF';

  let animId: number;
  const draw = () => {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#0f0';
    ctx.font = `${fontSize}px monospace`;

    for (let i = 0; i < drops.length; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillStyle = Math.random() > 0.95 ? '#fff' : `hsl(${120 + Math.random() * 20}, 100%, ${40 + Math.random() * 30}%)`;
      ctx.fillText(char, i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
    animId = requestAnimationFrame(draw);
  };

  draw();
  setTimeout(() => {
    cancelAnimationFrame(animId);
    canvas.style.transition = 'opacity 1s';
    canvas.style.opacity = '0';
    setTimeout(() => canvas.remove(), 1000);
  }, durationMs);
}

// ─── Visual Effect: Rainbow Cycling Theme ────────────────────────────────────
let rainbowInterval: ReturnType<typeof setInterval> | null = null;

function startRainbowMode() {
  if (rainbowInterval) return; // already running
  let hue = 0;
  document.documentElement.setAttribute('data-theme', 'rainbow');
  rainbowInterval = setInterval(() => {
    hue = (hue + 2) % 360;
    document.documentElement.style.setProperty('--theme-color', `${hue} 100% 50%`);
  }, 50);
}

function stopRainbowMode() {
  if (rainbowInterval) {
    clearInterval(rainbowInterval);
    rainbowInterval = null;
    document.documentElement.style.removeProperty('--theme-color');
  }
}

// ─── Visual Effect: Gravity Fall ─────────────────────────────────────────────
function triggerGravity() {
  const sections = document.querySelectorAll('section, header, footer, nav');
  sections.forEach((el, i) => {
    const htmlEl = el as HTMLElement;
    htmlEl.style.transition = `transform ${0.5 + i * 0.1}s cubic-bezier(0.55, 0, 1, 0.45)`;
    htmlEl.style.transform = `translateY(${window.innerHeight + 200}px) rotate(${(Math.random() - 0.5) * 30}deg)`;
  });
  setTimeout(() => {
    sections.forEach((el) => {
      const htmlEl = el as HTMLElement;
      htmlEl.style.transition = 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
      htmlEl.style.transform = '';
    });
  }, 2500);
}

// ─── Component ───────────────────────────────────────────────────────────────
const ThemeAndEasterEgg = () => {
  const [panelOpen, setPanelOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState('red');
  const [typedKeysBuffer, setTypedKeysBuffer] = useState("");
  const konamiIndexRef = useRef(0);

  // Hacking Game
  const [gameOpen, setGameOpen] = useState(false);
  const [secretCode, setSecretCode] = useState("");
  const [triesLeft, setTriesLeft] = useState(5);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [log, setLog] = useState<string[]>([]);

  // Alerts & Audio
  const [alert, setAlert] = useState<{ title: string; desc: string } | null>(null);
  const [audioMuted, setAudioMuted] = useState(false);

  // Reward state
  const [phantomUnlocked, setPhantomUnlocked] = useState(false);

  // Load persistent state
  useEffect(() => {
    const saved = localStorage.getItem('sowmiyan-portfolio-theme') || 'red';
    setActiveTheme(saved);
    document.documentElement.setAttribute('data-theme', saved);
    setAudioMuted(localStorage.getItem('sowmiyan-portfolio-audio-muted') === 'true');
    setPhantomUnlocked(localStorage.getItem('sowmiyan-phantom-unlocked') === 'true');
  }, []);

  const showAlert = useCallback((title: string, desc: string) => {
    setAlert({ title, desc });
    const timer = setTimeout(() => setAlert(null), 4000);
    return () => clearTimeout(timer);
  }, []);

  const changeTheme = useCallback((themeId: string) => {
    stopRainbowMode();
    setActiveTheme(themeId);
    localStorage.setItem('sowmiyan-portfolio-theme', themeId);
    document.documentElement.setAttribute('data-theme', themeId);
    const freqs: Record<string, number> = { red: 500, blue: 600, green: 700, purple: 800, yellow: 900, neon: 1000, midnight: 550, phantom: 666 };
    playSynthBeep(freqs[themeId] || 600, 0.08, "triangle");
  }, []);

  const startHackingGame = useCallback(() => {
    const target = CANDIDATE_CODES[Math.floor(Math.random() * CANDIDATE_CODES.length)];
    setSecretCode(target);
    setTriesLeft(5);
    setGameStatus('playing');
    setLog(["INITIALIZING ACCESS OVERRIDE...", "DECRYPT SYSTEM FIREWALL PASSWORD TO GAIN ROOT ACCESS.", "MATCH 4/4 CHARACTERS TO BREACH THE FIREWALL."]);
    setGameOpen(true);
  }, []);

  const handleGuess = useCallback((code: string) => {
    if (gameStatus !== 'playing') return;

    if (code === secretCode) {
      playWinChime();
      setGameStatus('won');
      setLog(prev => [...prev, `> ${code}`, "████ ACCESS GRANTED ████", "FIREWALL OVERRIDDEN. PHANTOM THEME UNLOCKED.", "YOU HAVE EARNED THE RAREST SECRET IN THIS PORTFOLIO."]);

      // Unlock Phantom theme as reward
      localStorage.setItem('sowmiyan-phantom-unlocked', 'true');
      setPhantomUnlocked(true);

      // Spectacular celebration
      setTimeout(() => {
        spawnConfetti(200);
        changeTheme('phantom');
        showAlert("PHANTOM_UNLOCKED", "SECRET 'PHANTOM' THEME ACTIVATED. YOU'VE EARNED THE RAREST REWARD.");
      }, 600);
    } else {
      const matches = getMatchCount(code, secretCode);
      const remaining = triesLeft - 1;
      setTriesLeft(remaining);

      if (remaining <= 0) {
        playLoseBuzz();
        setGameStatus('lost');
        setLog(prev => [...prev, `> ${code}`, "╳ ACCESS DENIED ╳ LOCKOUT ACTIVATED.", `CORRECT KEY WAS: ${secretCode}`]);
      } else {
        playSynthBeep(250, 0.15, "sawtooth");
        setLog(prev => [
          ...prev,
          `> ${code}`,
          `[DENIED] MATCHED: ${matches}/4 CHARACTERS.`,
          `WARNING // ${remaining} ATTEMPTS REMAINING.`
        ]);
      }
    }
  }, [gameStatus, secretCode, triesLeft, changeTheme, showAlert]);

  // ─── Keyboard Listener ───────────────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      // Konami Code → Fireworks + Confetti Explosion
      if (key === KONAMI_CODE[konamiIndexRef.current]) {
        konamiIndexRef.current += 1;
        if (konamiIndexRef.current === KONAMI_CODE.length) {
          // Epic celebration
          [400, 500, 600, 700, 800, 900, 1000, 1200].forEach((f, i) =>
            setTimeout(() => playSynthBeep(f, 0.2, "triangle"), i * 60)
          );
          spawnConfetti(300);
          showAlert("GOD_MODE_ACTIVATED", "KONAMI CODE ACCEPTED. REALITY ENGINE OVERRIDDEN.");
          konamiIndexRef.current = 0;
        }
      } else {
        konamiIndexRef.current = key === KONAMI_CODE[0] ? 1 : 0;
      }

      // Cheat Code Buffer
      if (/^[a-zA-Z]$/.test(e.key) || e.key.startsWith("Arrow")) {
        setTypedKeysBuffer((prev) => {
          const next = (prev + key).slice(-20);

          // ── rainbow: Secret cycling rainbow theme ──
          if (next.endsWith("rainbow")) {
            startRainbowMode();
            spawnConfetti(100);
            showAlert("RAINBOW_OVERRIDE", "SECRET CHROMATIC THEME ENGAGED. CYCLING ALL SPECTRUMS.");
            return "";
          }

          // ── neon: Secret neon pink theme ──
          if (next.endsWith("neon")) {
            changeTheme('neon');
            showAlert("NEON_UNLOCKED", "SECRET NEON PINK THEME ACTIVATED. NOT IN YOUR SETTINGS.");
            return "";
          }

          // ── midnight: Secret midnight teal theme ──
          if (next.endsWith("midnight")) {
            changeTheme('midnight');
            showAlert("MIDNIGHT_UNLOCKED", "SECRET MIDNIGHT TEAL THEME ACTIVATED. DEEP OCEAN MODE.");
            return "";
          }

          // ── matrix: Full-screen Matrix digital rain ──
          if (next.endsWith("matrix")) {
            changeTheme("green");
            startMatrixRain(8000);
            showAlert("MATRIX_INITIATED", "WAKE UP, NEO... THE MATRIX HAS YOU.");
            return "";
          }

          // ── hack: Launch the decryption game ──
          if (next.endsWith("hack")) {
            playSynthBeep(900, 0.2, "sawtooth");
            startHackingGame();
            return "";
          }

          // ── gravity: Everything falls down ──
          if (next.endsWith("gravity")) {
            playSynthBeep(200, 0.5, "sawtooth");
            triggerGravity();
            showAlert("GRAVITY_FAIL", "GRAVITATIONAL ANOMALY DETECTED. STRUCTURAL INTEGRITY COMPROMISED.");
            return "";
          }

          // ── glitch: Dramatic screen distortion ──
          if (next.endsWith("glitch")) {
            playLoseBuzz();
            document.documentElement.classList.add("glitch-filter-active");
            showAlert("SIGNAL_CORRUPTION", "CRITICAL DISPLAY INTERFERENCE. SIGNAL DEGRADING.");
            setTimeout(() => document.documentElement.classList.remove("glitch-filter-active"), 1200);
            return "";
          }

          // ── doabarrelroll: Spin viewport ──
          if (next.endsWith("doabarrelroll")) {
            playSynthBeep(700, 0.4, "triangle");
            document.body.classList.add("animate-barrel-roll");
            showAlert("AXIS_ROTATION", "VIEWPORT ROTATING 360° ON Z-AXIS.");
            setTimeout(() => document.body.classList.remove("animate-barrel-roll"), 1000);
            return "";
          }

          // ── resume: Open resume ──
          if (next.endsWith("resume")) {
            playSynthBeep(800, 0.3, "triangle");
            showAlert("FILE_ACCESSED", "INITIATING DIRECT ACCESS: SOWMIYAN_CV.PDF");
            window.open(RESUME_URL, "_blank");
            return "";
          }

          // ── disco: Rapid color flashing party mode ──
          if (next.endsWith("disco")) {
            let flash = 0;
            const discoColors = ['red', 'blue', 'green', 'purple', 'yellow', 'neon', 'midnight'];
            const discoInterval = setInterval(() => {
              const themeId = discoColors[flash % discoColors.length];
              document.documentElement.setAttribute('data-theme', themeId);
              flash++;
              if (flash > 20) {
                clearInterval(discoInterval);
                changeTheme('red');
              }
            }, 150);
            spawnConfetti(80);
            showAlert("DISCO_MODE", "PARTY PROTOCOL INITIATED. CHROMATIC OVERLOAD.");
            return "";
          }

          // ── sudo: Security rejection ──
          if (next.endsWith("sudo")) {
            playLoseBuzz();
            showAlert("SECURITY_BREACH", "SOWMIYAN IS NOT IN THE SUDOERS FILE. INCIDENT REPORTED.");
            return "";
          }

          // ── cheats: Dump all codes to console ──
          if (next.endsWith("cheats")) {
            playSynthBeep(750, 0.2, "sine");
            console.table({
              "Code": ["hack", "konami", "matrix", "rainbow", "neon", "midnight", "gravity", "glitch", "doabarrelroll", "disco", "resume", "sudo"],
              "Effect": [
                "Decrypt firewall game -> unlocks PHANTOM theme",
                "Massive confetti fireworks explosion",
                "Full-screen Matrix digital rain + green theme",
                "Secret rainbow cycling theme (not in settings)",
                "Secret neon pink theme (not in settings)",
                "Secret midnight teal theme (not in settings)",
                "All sections fall with gravity + bounce back",
                "Dramatic screen signal corruption",
                "Spin the entire page 360",
                "Rapid disco color flash party",
                "Open Sowmiyan's resume",
                "Security rejection message"
              ]
            });
            showAlert("CHEAT_CODES_DUMPED", "ALL SECRET CODES LOGGED TO DEVTOOLS CONSOLE (F12).");
            return "";
          }

          return next;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showAlert, changeTheme, startHackingGame]);

  // ─── Developer Console hack() ──────────────────────────────────────────
  useEffect(() => {
    (window as any).hack = () => {
      console.log("%c[FIREWALL_BYPASS] Initializing decryption...", "color: #ef4444; font-weight: bold;");
      startHackingGame();
      return "Decryption console initialized.";
    };
    return () => { delete (window as any).hack; };
  }, [startHackingGame]);

  // ─── Cross-component event listeners ───────────────────────────────────
  useEffect(() => {
    const handleStatusEgg = () => {
      playSynthBeep(1000, 0.3, "triangle");
      showAlert("IDENTITY_VERIFIED", "SOWMIYAN // ADMIN CLEARANCE CONFIRMED.");
    };
    const handleTriggerHacking = () => startHackingGame();
    const handleHudAlert = (e: Event) => {
      const ce = e as CustomEvent;
      if (ce.detail) showAlert(ce.detail.title, ce.detail.desc);
    };

    window.addEventListener('trigger-status-egg', handleStatusEgg);
    window.addEventListener('trigger-hacking-game', handleTriggerHacking);
    window.addEventListener('trigger-hud-alert', handleHudAlert);
    return () => {
      window.removeEventListener('trigger-status-egg', handleStatusEgg);
      window.removeEventListener('trigger-hacking-game', handleTriggerHacking);
      window.removeEventListener('trigger-hud-alert', handleHudAlert);
    };
  }, [showAlert, startHackingGame]);

  // All themes for panel (base + unlocked secrets)
  const allPanelThemes = [
    ...themes,
    ...(phantomUnlocked ? [{ id: 'phantom', name: 'PHANTOM', color: secretThemes.phantom.color }] : []),
  ];

  return (
    <>
      {/* ── Settings Trigger ── */}
      <div className="fixed bottom-4 left-4 z-40 flex items-center gap-2">
        <button
          onClick={() => { setPanelOpen(!panelOpen); playSynthBeep(650, 0.05, "sine"); }}
          className="w-10 h-10 rounded-full bg-black border border-red-500/30 flex items-center justify-center text-red-500 hover:border-red-500 hover:bg-red-950/20 transition-all shadow-[0_0_12px_rgba(239,68,68,0.2)] focus:outline-none"
          title="System configuration"
        >
          <Settings size={18} className={panelOpen ? 'animate-spin' : ''} />
        </button>

        <AnimatePresence>
          {panelOpen && (
            <motion.div
              initial={{ opacity: 0, x: -20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.95 }}
              className="bg-black/95 border border-red-500/30 p-4 rounded-xl flex flex-col gap-3 shadow-[0_0_20px_rgba(239,68,68,0.25)] backdrop-blur-xl w-60 z-50 text-left pointer-events-auto"
            >
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-[9px] font-mono text-red-500 font-bold uppercase tracking-widest flex items-center gap-1">
                  <ShieldAlert size={10} /> SYS_CONFIG // THEME
                </span>
                <button onClick={() => setPanelOpen(false)} className="text-white/40 hover:text-red-500 transition-colors">
                  <X size={12} />
                </button>
              </div>

              <div className="flex flex-col gap-1.5">
                {allPanelThemes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => changeTheme(theme.id)}
                    className={`flex items-center justify-between px-3 py-1.5 border rounded-md font-mono text-[9px] uppercase tracking-wider transition-all duration-300
                      ${activeTheme === theme.id
                        ? 'border-red-500 bg-red-600/10 text-white font-bold'
                        : 'border-white/5 bg-white/20 text-white/60 hover:border-white/20 hover:text-white'
                      }
                    `}
                  >
                    <span>{theme.name}</span>
                    <span
                      className="w-2 h-2 rounded-full border border-white/25"
                      style={{ backgroundColor: theme.color }}
                    />
                  </button>
                ))}
              </div>

              {/* Launch Game */}
              <button
                onClick={() => { setPanelOpen(false); playSynthBeep(850, 0.1, "sine"); startHackingGame(); }}
                className="mt-1.5 py-1.5 bg-red-600 text-white font-mono text-[8px] font-bold uppercase tracking-widest rounded hover:bg-red-700 transition-colors text-center shadow-[0_0_10px_rgba(239,68,68,0.4)] animate-pulse"
              >
                [ SYSTEM BYPASS ]
              </button>

              {/* Hint */}
              <p className="text-[7px] font-mono text-white/20 text-center uppercase tracking-widest leading-relaxed">
                Type "cheats" anywhere for secrets
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Hacking Game: Playing ── */}
      <AnimatePresence>
        {gameOpen && gameStatus === 'playing' && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4" data-lenis-prevent="true">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-lg w-full bg-[#030303] border border-red-500/40 p-6 md:p-8 shadow-[0_0_30px_rgba(239,68,68,0.3)] flex flex-col max-h-[85vh] rounded-xl overflow-hidden font-mono"
            >
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(239,68,68,0.015)_50%)] bg-[length:100%_4px] pointer-events-none" />

              <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-4 z-10">
                <div className="flex items-center gap-2">
                  <Terminal size={14} className="text-red-500 animate-pulse" />
                  <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider">
                    FIREWALL_DECIPHER // TERMINAL
                  </span>
                </div>
                <button
                  onClick={() => { playSynthBeep(400, 0.08, "sine"); setGameOpen(false); }}
                  className="px-3 py-1 border border-red-600/50 text-[9px] text-red-500 hover:bg-red-600 hover:text-white transition-all uppercase tracking-widest font-bold rounded"
                >
                  Close
                </button>
              </div>

              <div className="flex-grow flex flex-col gap-5 overflow-hidden z-10 text-left">
                <div className="bg-[#050505] border border-white/5 rounded-md p-4 h-36 overflow-y-auto scrollbar-none flex flex-col gap-1 text-[9px] text-red-400/80 leading-relaxed uppercase">
                  {log.map((line, idx) => (
                    <div key={idx} className={line.startsWith(">") ? "text-white font-bold" : line.includes("████") ? "text-green-400 font-bold text-sm animate-pulse" : ""}>
                      {line}
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center text-[10px] text-white/50 uppercase">
                    <span>Attempts remaining:</span>
                    <div className="flex gap-1.5">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <div
                          key={idx}
                          className={`w-2.5 h-2.5 rounded-sm transition-all duration-300
                            ${idx < triesLeft ? 'bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.8)]' : 'bg-white/5 border border-white/10'}
                          `}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {CANDIDATE_CODES.map((code) => (
                      <button
                        key={code}
                        onClick={() => handleGuess(code)}
                        className="py-2.5 bg-white/[0.02] border border-white/5 rounded hover:border-red-500 hover:text-red-500 hover:bg-red-600/5 transition-all text-xs font-bold font-mono tracking-widest text-center"
                      >
                        {code}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reward hint */}
                <div className="text-[8px] text-white/15 text-center uppercase tracking-widest font-mono">
                  ★ Crack the code to unlock the secret PHANTOM theme ★
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Hacking Game: Lockout ── */}
      <AnimatePresence>
        {gameOpen && gameStatus === 'lost' && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4" data-lenis-prevent="true">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-sm w-full bg-[#030303] border border-red-500/40 p-8 shadow-[0_0_30px_rgba(239,68,68,0.3)] flex flex-col items-center text-center rounded-xl overflow-hidden font-mono"
            >
              <div className="w-12 h-12 rounded-full border-2 border-red-500 flex items-center justify-center text-red-500 bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-pulse mb-4">
                X
              </div>
              <h4 className="text-sm font-bold text-red-500 uppercase tracking-widest mb-2">SYSTEM LOCKOUT</h4>
              <p className="text-[10px] text-white/40 uppercase mb-6 leading-relaxed">
                Security block active. Correct code was: {secretCode}.
              </p>
              <button
                onClick={startHackingGame}
                className="w-full py-3 bg-red-600 text-white font-mono text-[9px] font-bold uppercase tracking-widest rounded flex items-center justify-center gap-1.5 hover:bg-red-700 transition-colors shadow-[0_0_10px_rgba(239,68,68,0.4)]"
              >
                <RefreshCw size={10} /> Reboot Console
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Hacking Game: Victory Celebration ── */}
      <AnimatePresence>
        {gameOpen && gameStatus === 'won' && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/98 backdrop-blur-lg p-4" data-lenis-prevent="true">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative max-w-md w-full bg-[#050505] border-2 border-red-500/60 p-8 shadow-[0_0_60px_rgba(239,68,68,0.4)] flex flex-col items-center text-center rounded-2xl overflow-hidden font-mono"
            >
              {/* Animated glow border */}
              <div className="absolute inset-0 rounded-2xl animate-glow-border pointer-events-none" />
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(239,68,68,0.015)_50%)] bg-[length:100%_4px] pointer-events-none" />

              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
              >
                <Sparkles size={56} className="text-red-500 mb-4 filter drop-shadow-[0_0_20px_rgba(239,68,68,0.8)] animate-pulse" />
              </motion.div>

              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-2xl font-heading font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 uppercase tracking-widest mb-2"
              >
                PHANTOM UNLOCKED
              </motion.h3>

              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-[9px] text-red-500/60 uppercase tracking-widest mb-6 font-bold"
              >
                [ ELITE_STATUS // MASTER_HACKER ]
              </motion.span>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-xs text-white/70 leading-relaxed mb-6"
              >
                You cracked the firewall. The secret <span className="text-red-500 font-bold">PHANTOM</span> theme
                is now permanently unlocked in your settings panel. Only those who breach the system earn this.
              </motion.p>

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                onClick={() => {
                  playSynthBeep(500, 0.08, "sine");
                  setGameOpen(false);
                }}
                className="w-full py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white font-mono text-[10px] font-black uppercase tracking-widest rounded-lg hover:from-red-700 hover:to-pink-700 transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)]"
              >
                Accept & Continue
              </motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Floating HUD Alert ── */}
      <AnimatePresence>
        {alert && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-20 left-4 z-[9999] bg-[#070707] border border-red-500/50 px-5 py-3 shadow-[0_0_15px_rgba(239,68,68,0.3)] rounded-md font-mono max-w-sm pointer-events-none text-left"
          >
            <div className="text-[10px] text-red-500 font-bold uppercase tracking-widest mb-1 flex items-center gap-1">
              <ShieldAlert size={10} className="animate-pulse" /> {alert.title}
            </div>
            <div className="text-[9px] text-white/70 uppercase leading-relaxed font-bold">
              {alert.desc}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ThemeAndEasterEgg;
