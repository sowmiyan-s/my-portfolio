// Edge function: manage site upvotes. Allows one vote per voter_id per 24 hours.
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
};

const COOLDOWN_24H_MS = 24 * 60 * 60 * 1000;

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const isUuid = (s: unknown): s is string =>
  typeof s === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

async function getState(voterId?: string) {
  const { count } = await supabase
    .from("site_votes")
    .select("*", { count: "exact", head: true });

  let hasVoted = false;
  let lastVoteTime: number | null = null;

  if (voterId) {
    const { data } = await supabase
      .from("site_votes")
      .select("created_at")
      .eq("voter_id", voterId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (data?.created_at) {
      const voteTime = new Date(data.created_at).getTime();
      lastVoteTime = voteTime;
      if (Date.now() - voteTime < COOLDOWN_24H_MS) {
        hasVoted = true;
      }
    }
  }

  return { count: count ?? 0, hasVoted, lastVoteTime };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const url = new URL(req.url);

    if (req.method === "GET") {
      const voterId = url.searchParams.get("voter_id") ?? undefined;
      if (voterId && !isUuid(voterId)) return json({ error: "invalid voter_id" }, 400);
      return json(await getState(voterId));
    }

    const body = await req.json().catch(() => ({}));
    const voterId = body?.voter_id;
    if (!isUuid(voterId)) return json({ error: "invalid voter_id" }, 400);

    if (req.method === "POST") {
      const currentState = await getState(voterId);
      if (currentState.hasVoted) {
        const timePassed = Date.now() - (currentState.lastVoteTime || 0);
        const remainingMs = Math.max(0, COOLDOWN_24H_MS - timePassed);
        return json(
          {
            error: "cooldown_active",
            message: "You can only upvote once every 24 hours.",
            remainingMs,
            ...currentState,
          },
          429
        );
      }

      await supabase.from("site_votes").insert({
        voter_id: voterId,
        created_at: new Date().toISOString(),
      });

      return json(await getState(voterId));
    }

    if (req.method === "DELETE") {
      await supabase.from("site_votes").delete().eq("voter_id", voterId);
      return json(await getState(voterId));
    }

    return json({ error: "method not allowed" }, 405);
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});
