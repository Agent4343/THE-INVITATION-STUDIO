import { createClient } from "@supabase/supabase-js";

// Browser client – lazy-initialized to avoid build-time errors
// when environment variables are not yet available.
let _browserClient: ReturnType<typeof createClient> | null = null;

export function getSupabase() {
  if (!_browserClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !anonKey) {
      throw new Error(
        "NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required.",
      );
    }
    _browserClient = createClient(
      url,
      anonKey,
    );
  }
  return _browserClient;
}

// Server client – uses the service-role key for privileged operations.
// Call this inside API routes / server actions only.
export function createServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.",
    );
  }
  return createClient(
    url,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
