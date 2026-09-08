import { useCallback, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const COOKIE_VOTE_STATE = "sw_voter_has_voted";
const COOKIE_COUNT = "sw_vote_count";
const LS_VOTE_STATE = "sw_voter_has_voted";
const LS_COUNT_KEY = "sw_local_vote_count";
const BASE_COUNT = 1;

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="));
  return match ? match.split("=")[1] : null;
}

function writeCookie(name: string, value: string, days = 365) {
  if (typeof document === "undefined") return;
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

function getStoredVoteState(): boolean {
  try {
    const ls = localStorage.getItem(LS_VOTE_STATE);
    if (ls !== null) return ls === "true";
  } catch {}
  const cookie = readCookie(COOKIE_VOTE_STATE);
  return cookie === "true";
}

function getStoredVoteCount(): number {
  try {
    const ls = localStorage.getItem(LS_COUNT_KEY);
    if (ls !== null) {
      const parsed = parseInt(ls, 10);
      if (!isNaN(parsed) && parsed >= 0) return parsed;
    }
  } catch {}
  const cookie = readCookie(COOKIE_COUNT);
  if (cookie) {
    const parsed = parseInt(cookie, 10);
    if (!isNaN(parsed) && parsed >= 0) return parsed;
  }
  return BASE_COUNT;
}

function saveVoteData(count: number, voted: boolean) {
  try {
    localStorage.setItem(LS_COUNT_KEY, count.toString());
    localStorage.setItem(LS_VOTE_STATE, voted ? "true" : "false");
  } catch {}
  writeCookie(COOKIE_COUNT, count.toString());
  writeCookie(COOKIE_VOTE_STATE, voted ? "true" : "false");
}

function playVoteSound(isUpvote: boolean) {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    if (isUpvote) {
      osc.frequency.setValueAtTime(440, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15);
      gainNode.gain.setValueAtTime(0.04, audioCtx.currentTime);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.25);
    } else {
      osc.frequency.setValueAtTime(660, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(330, audioCtx.currentTime + 0.15);
      gainNode.gain.setValueAtTime(0.03, audioCtx.currentTime);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.2);
    }
  } catch {}
}

const UpvoteButton = () => {
  const [count, setCount] = useState<number>(() => getStoredVoteCount());
  const [voted, setVoted] = useState<boolean>(() => getStoredVoteState());
  const [popKey, setPopKey] = useState(0);
  const reduce = useReducedMotion();

  const syncState = useCallback(() => {
    const storedCount = getStoredVoteCount();
    const storedVoted = getStoredVoteState();
    setCount(storedCount);
    setVoted(storedVoted);
  }, []);

  useEffect(() => {
    // Cross-tab synchronization via BroadcastChannel
    let channel: BroadcastChannel | null = null;
    try {
      if (typeof BroadcastChannel !== "undefined") {
        channel = new BroadcastChannel("sw_vote_channel");
        channel.onmessage = (event) => {
          if (event.data) {
            if (typeof event.data.count === "number") setCount(event.data.count);
            if (typeof event.data.voted === "boolean") setVoted(event.data.voted);
          }
        };
      }
    } catch {}

    const handleVoteChange = (e: CustomEvent) => {
      if (e.detail) {
        if (typeof e.detail.count === "number") setCount(e.detail.count);
        if (typeof e.detail.voted === "boolean") setVoted(e.detail.voted);
      } else {
        syncState();
      }
    };

    window.addEventListener("site-vote-changed" as any, handleVoteChange);
    window.addEventListener("storage", syncState);

    return () => {
      window.removeEventListener("site-vote-changed" as any, handleVoteChange);
      window.removeEventListener("storage", syncState);
      if (channel) channel.close();
    };
  }, [syncState]);

  const toggle = () => {
    const isCurrentlyVoted = voted;

    if (!isCurrentlyVoted) {
      // 1. Upvote (+1)
      const newCount = count + 1;
      setCount(newCount);
      setVoted(true);
      setPopKey((k) => k + 1);
      saveVoteData(newCount, true);

      playVoteSound(true);

      window.dispatchEvent(
        new CustomEvent("trigger-hud-alert", {
          detail: {
            title: "NETWORK_BOOST",
            desc: "MAIN ENCRYPTION SCORE NOMINATED (+1 UPVOTE).",
          },
        })
      );

      window.dispatchEvent(
        new CustomEvent("site-vote-changed", {
          detail: { count: newCount, voted: true },
        })
      );

      try {
        if (typeof BroadcastChannel !== "undefined") {
          const channel = new BroadcastChannel("sw_vote_channel");
          channel.postMessage({ count: newCount, voted: true });
          channel.close();
        }
      } catch {}
    } else {
      // 2. Unvote (-1)
      const newCount = Math.max(0, count - 1);
      setCount(newCount);
      setVoted(false);
      setPopKey((k) => k + 1);
      saveVoteData(newCount, false);

      playVoteSound(false);

      window.dispatchEvent(
        new CustomEvent("trigger-hud-alert", {
          detail: {
            title: "VOTE_WITHDRAWN",
            desc: "MAIN ENCRYPTION SCORE NOMINATION REMOVED (-1 UPVOTE).",
          },
        })
      );

      window.dispatchEvent(
        new CustomEvent("site-vote-changed", {
          detail: { count: newCount, voted: false },
        })
      );

      try {
        if (typeof BroadcastChannel !== "undefined") {
          const channel = new BroadcastChannel("sw_vote_channel");
          channel.postMessage({ count: newCount, voted: false });
          channel.close();
        }
      } catch {}
    }
  };

  return (
    <motion.button
      type="button"
      onClick={toggle}
      aria-pressed={voted}
      aria-label={voted ? "Remove upvote" : "Upvote Sowmiyan"}
      title={voted ? "Click to remove your upvote" : "Click to upvote"}
      whileHover={reduce ? undefined : { scale: 1.05 }}
      whileTap={reduce ? undefined : { scale: 0.94 }}
      className={`group inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 border font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] rounded-full transition-all duration-200 select-none cursor-pointer ${
        voted
          ? "bg-red-600 border-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.5)]"
          : "bg-white/5 border-white/20 text-white/90 hover:border-red-500 hover:text-red-400 hover:bg-red-500/10"
      }`}
    >
      <motion.span
        key={popKey}
        initial={reduce ? false : { scale: 0.6, rotate: voted ? 0 : -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 15 }}
        aria-hidden
        className={voted ? "text-white" : "text-red-500 group-hover:scale-110 transition-transform"}
      >
        ▲
      </motion.span>
      <span className="font-bold tabular-nums">{count.toLocaleString()}</span>
      <span className="hidden md:inline text-white/50 group-hover:text-current transition-colors">
        {voted ? "Voted" : "Upvote"}
      </span>
    </motion.button>
  );
};

export default UpvoteButton;
