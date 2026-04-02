import { createClient } from "@supabase/supabase-js";

// Browser client – lazy-initialized to avoid build-time errors
// when environment variables are not yet available.
let _browserClient: ReturnType<typeof createClient> | null = null;

export function getSupabase() {
  if (!_browserClient) {
    _browserClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
  }
  return _browserClient;
}

// Server client – uses the service-role key for privileged operations.
// Call this inside API routes / server actions only.
export function createServerSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
