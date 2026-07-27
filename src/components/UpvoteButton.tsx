import { useCallback, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useRealtimeRefetch } from "@/hooks/useRealtimeRefetch";
import { toast } from "@/hooks/use-toast";

const COOKIE_VOTER = "sw_voter";
const COOKIE_VOTE_TIME = "sw_last_vote_time";
const LS_KEY = "sw_voter_id";
const LS_VOTE_STATE = "sw_voter_has_voted";
const LS_COUNT_KEY = "sw_local_vote_count";
const LS_LAST_VOTE_TIME = "sw_last_vote_timestamp";
const COOLDOWN_24H_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

function readVoterId(): string {
  const fromCookie = typeof document !== "undefined"
    ? document.cookie
        .split("; ")
        .find((r) => r.startsWith(COOKIE_VOTER + "="))
        ?.split("=")[1]
    : "";
  return fromCookie || localStorage.getItem(LS_KEY) || "";
}

function ensureVoterId(): string {
  let id = readVoterId();
  if (!id) {
    id = crypto.randomUUID();
    const oneYear = 60 * 60 * 24 * 365;
    if (typeof document !== "undefined") {
      document.cookie = `${COOKIE_VOTER}=${id}; path=/; max-age=${oneYear}; SameSite=Lax`;
    }
    localStorage.setItem(LS_KEY, id);
  }
  return id;
}

function getLastVoteTime(): number {
  let time = 0;
  try {
    const lsTime = localStorage.getItem(LS_LAST_VOTE_TIME);
    if (lsTime) time = parseInt(lsTime, 10) || 0;
  } catch {}

  if (!time && typeof document !== "undefined") {
    const cookieTime = document.cookie
      .split("; ")
      .find((r) => r.startsWith(COOKIE_VOTE_TIME + "="))
      ?.split("=")[1];
    if (cookieTime) time = parseInt(cookieTime, 10) || 0;
  }
  return time;
}

function recordVoteTime(timestamp: number) {
  try {
    localStorage.setItem(LS_LAST_VOTE_TIME, timestamp.toString());
    const oneDayInSec = 60 * 60 * 24;
    if (typeof document !== "undefined") {
      document.cookie = `${COOKIE_VOTE_TIME}=${timestamp}; path=/; max-age=${oneDayInSec}; SameSite=Lax`;
    }
  } catch {}
}

/** Read the exact vote count from database (source of truth) */
async function fetchRemoteCount(): Promise<number> {
  // Try Edge Function first
  try {
    const { data } = await supabase.functions.invoke("vote", {
      method: "GET" as any,
    } as any);
    if (data && typeof data.count === "number") return data.count;
  } catch { /* fall through */ }

  // Direct table fallback
  try {
    const { count: c } = await supabase.from("site_votes").select("*", { count: "exact", head: true });
    if (typeof c === "number") return c;
  } catch { /* fall through */ }

  return -1; // signals "could not reach DB"
}

const UpvoteButton = () => {
  const [count, setCount] = useState<number>(() => {
    const cached = localStorage.getItem(LS_COUNT_KEY);
    return cached ? parseInt(cached, 10) || 0 : 0;
  });

  const [voted, setVoted] = useState<boolean>(() => {
    const lastVoteTime = getLastVoteTime();
    return lastVoteTime > 0 && (Date.now() - lastVoteTime) < COOLDOWN_24H_MS;
  });

  const [busy, setBusy] = useState(false);
  const [popKey, setPopKey] = useState(0);
  const reduce = useReducedMotion();

  const refresh = useCallback(async () => {
    const lastVoteTime = getLastVoteTime();
    const isWithin24h = lastVoteTime > 0 && (Date.now() - lastVoteTime) < COOLDOWN_24H_MS;

    const remoteCount = await fetchRemoteCount();

    if (remoteCount >= 0) {
      // DB is reachable — use its count as the source of truth
      setCount(remoteCount);
      localStorage.setItem(LS_COUNT_KEY, remoteCount.toString());
    }
    // If DB unreachable (remoteCount === -1), keep showing the cached local count

    setVoted(isWithin24h);
    localStorage.setItem(LS_VOTE_STATE, isWithin24h ? "true" : "false");
  }, []);

  useEffect(() => {
    refresh();

    const handleVoteChange = (e: CustomEvent) => {
      if (e.detail) {
        if (typeof e.detail.count === "number") {
          setCount(e.detail.count);
          localStorage.setItem(LS_COUNT_KEY, String(e.detail.count));
        }
        if (typeof e.detail.voted === "boolean") setVoted(e.detail.voted);
      } else {
        refresh();
      }
    };

    window.addEventListener("site-vote-changed" as any, handleVoteChange);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("site-vote-changed" as any, handleVoteChange);
      window.removeEventListener("storage", refresh);
    };
  }, [refresh]);

  useRealtimeRefetch(["site_votes"], refresh);

  const toggle = async () => {
    if (busy) return;

    const lastVoteTime = getLastVoteTime();
    const timePassed = Date.now() - lastVoteTime;
    const isCooldownActive = lastVoteTime > 0 && timePassed < COOLDOWN_24H_MS;

    // Strict 24-hour rate limit check
    if (isCooldownActive) {
      const remainingMs = COOLDOWN_24H_MS - timePassed;
      const remainingHours = Math.floor(remainingMs / (1000 * 60 * 60));
      const remainingMins = Math.ceil((remainingMs % (1000 * 60 * 60)) / (1000 * 60));

      toast({
        title: "24-Hour Upvote Limit",
        description: `You can only upvote once every 24 hours. Next vote available in ${remainingHours}h ${remainingMins}m.`,
      });

      window.dispatchEvent(
        new CustomEvent("trigger-hud-alert", {
          detail: {
            title: "24H_LIMIT_ACTIVE",
            desc: `UPVOTE COOLDOWN ACTIVE. TRY AGAIN IN ${remainingHours}H ${remainingMins}M.`,
          },
        })
      );
      return;
    }

    setBusy(true);
    const voterId = ensureVoterId();
    const now = Date.now();

    // Audio feedback
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      osc.frequency.setValueAtTime(500, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1000, audioCtx.currentTime + 0.15);
      gainNode.gain.setValueAtTime(0.03, audioCtx.currentTime);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch (e) {}

    window.dispatchEvent(
      new CustomEvent("trigger-hud-alert", {
        detail: {
          title: "NETWORK_BOOST",
          desc: "MAIN ENCRYPTION SCORE NOMINATED (+1 UPVOTE).",
        },
      })
    );

    // Optimistic: show +1 immediately, mark voted, record cooldown timestamp
    const optimisticCount = count + 1;
    setVoted(true);
    setCount(optimisticCount);
    setPopKey((k) => k + 1);
    recordVoteTime(now);
    localStorage.setItem(LS_VOTE_STATE, "true");
    localStorage.setItem(LS_COUNT_KEY, optimisticCount.toString());

    window.dispatchEvent(
      new CustomEvent("site-vote-changed", {
        detail: { count: optimisticCount, voted: true },
      })
    );

    // Write to database and then sync count from the authoritative source
    try {
      const { data, error } = await supabase.functions.invoke("vote", {
        method: "POST",
        body: { voter_id: voterId },
      } as any);

      if (!error && data && typeof data.count === "number") {
        // Edge Function returned the real DB count — use it
        setCount(data.count);
        localStorage.setItem(LS_COUNT_KEY, data.count.toString());
        window.dispatchEvent(
          new CustomEvent("site-vote-changed", { detail: { count: data.count, voted: true } })
        );
      } else {
        // Edge Function unavailable — direct DB insert + re-read exact count
        await supabase.from("site_votes").upsert({ voter_id: voterId }, { onConflict: "voter_id" });
        const dbCount = await fetchRemoteCount();
        if (dbCount >= 0) {
          setCount(dbCount);
          localStorage.setItem(LS_COUNT_KEY, dbCount.toString());
          window.dispatchEvent(
            new CustomEvent("site-vote-changed", { detail: { count: dbCount, voted: true } })
          );
        }
      }
    } catch (err) {
      console.warn("Vote write notice:", err);
      try {
        await supabase.from("site_votes").upsert({ voter_id: voterId }, { onConflict: "voter_id" });
        const dbCount = await fetchRemoteCount();
        if (dbCount >= 0) {
          setCount(dbCount);
          localStorage.setItem(LS_COUNT_KEY, dbCount.toString());
        }
      } catch (dbErr) {
        console.warn("Direct DB fallback:", dbErr);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <motion.button
      type="button"
      onClick={toggle}
      disabled={busy}
      aria-pressed={voted}
      aria-label={voted ? "Upvoted (24h cooldown active)" : "Upvote Sowmiyan"}
      whileHover={reduce ? undefined : { scale: 1.05 }}
      whileTap={reduce ? undefined : { scale: 0.94 }}
      className={`group inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 border font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] rounded-full transition-colors select-none ${
        voted
          ? "bg-red-600 border-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)]"
          : "bg-white/5 border-white/20 text-white/90 hover:border-red-500 hover:text-red-400"
      }`}
    >
      <motion.span
        key={popKey}
        initial={reduce ? false : { scale: 0.6, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 15 }}
        aria-hidden
      >
        ▲
      </motion.span>
      <span className="font-bold tabular-nums">{count.toLocaleString()}</span>
      <span className="hidden md:inline text-white/40 group-hover:text-current transition-colors">
        {voted ? "Voted" : "Upvote"}
      </span>
    </motion.button>
  );
};

export default UpvoteButton;

