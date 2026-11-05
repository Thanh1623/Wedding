import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type RsvpRow = {
  id: string;
  name: string;
  attendance: "yes" | "no";
  guests: number;
  message: string;
  created_at: string;
};

export function supabaseAdmin(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
