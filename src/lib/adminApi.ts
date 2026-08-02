import { supabase } from "@/integrations/supabase/client";

const PW_KEY = "sw_admin_pw";

export function setAdminPassword(pw: string) {
  sessionStorage.setItem(PW_KEY, pw);
}

export function getAdminPassword(): string {
  return sessionStorage.getItem(PW_KEY) ?? "";
}

export function clearAdminPassword() {
  sessionStorage.removeItem(PW_KEY);
}

/** Calls the privileged admin edge function. Throws on failure so the UI can surface it. */
export async function adminCall<T = any>(action: string, payload?: unknown): Promise<T> {
  const { data, error } = await supabase.functions.invoke("admin-api", {
    body: { password: getAdminPassword(), action, payload },
  });
  if (error) throw new Error(error.message);
  if (data?.error) throw new Error(data.error);
  return data as T;
}

export async function verifyAdminPassword(pw: string): Promise<boolean> {
  const { data, error } = await supabase.functions.invoke("admin-api", {
    body: { password: pw, action: "verify" },
  });
  return !error && !!data?.ok;
}
