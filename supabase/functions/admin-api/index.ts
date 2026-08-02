// Edge function: privileged admin writes. Password-gated, executes with the service role
// so the public tables can keep strict RLS (no anonymous writes).
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "method not allowed" }, 405);

  try {
    const body = await req.json().catch(() => ({}));
    const { password, action, payload } = body ?? {};

    if (typeof password !== "string" || password !== Deno.env.get("ADMIN_PASSWORD")) {
      return json({ error: "unauthorized" }, 401);
    }
    if (typeof action !== "string") return json({ error: "missing action" }, 400);

    switch (action) {
      case "verify":
        return json({ ok: true });

      case "set_hidden": {
        const rows = Array.isArray(payload?.rows) ? payload.rows : [];
        const ids = rows.map((r: { github_repo_id: number }) => Number(r.github_repo_id)).filter(Number.isFinite);
        if (ids.length === 0) {
          await supabase.from("hidden_projects").delete().neq("github_repo_id", -1);
        } else {
          await supabase.from("hidden_projects").delete().not("github_repo_id", "in", `(${ids.join(",")})`);
          await supabase.from("hidden_projects").upsert(
            rows.map((r: { github_repo_id: number; repo_name?: string }) => ({
              github_repo_id: Number(r.github_repo_id),
              repo_name: r.repo_name ?? "",
            })),
            { onConflict: "github_repo_id" },
          );
        }
        break;
      }

      case "set_featured": {
        const items = Array.isArray(payload?.items) ? payload.items : [];
        await supabase.from("featured_projects").delete().neq("github_repo_id", -1);
        if (items.length) {
          await supabase.from("featured_projects").insert(
            items.slice(0, 3).map((f: { id: number; repo_name: string }, i: number) => ({
              github_repo_id: Number(f.id),
              repo_name: f.repo_name ?? "",
              position: i,
            })),
          );
        }
        break;
      }

      case "add_skills": {
        const names: string[] = (payload?.names ?? []).map((n: string) => String(n).trim()).filter(Boolean);
        const category = payload?.category === "non-tech" ? "non-tech" : "tech";
        if (!names.length) return json({ error: "no skills" }, 400);
        const { data, error } = await supabase
          .from("skills")
          .insert(names.map((name) => ({ name, category })))
          .select("id, name, category");
        if (error) throw error;
        return json({ ok: true, data });
      }

      case "rename_skill": {
        const { error } = await supabase
          .from("skills")
          .update({ name: String(payload?.name ?? "").trim() })
          .eq("id", payload?.id);
        if (error) throw error;
        break;
      }

      case "delete_skill": {
        const { error } = await supabase.from("skills").delete().eq("id", payload?.id);
        if (error) throw error;
        break;
      }

      case "set_setting": {
        const key = String(payload?.key ?? "");
        if (!key) return json({ error: "missing key" }, 400);
        const { error } = await supabase
          .from("site_settings")
          .upsert({ key, value: payload?.value, updated_at: new Date().toISOString() }, { onConflict: "key" });
        if (error) throw error;
        break;
      }

      default:
        return json({ error: `unknown action: ${action}` }, 400);
    }

    return json({ ok: true });
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});
