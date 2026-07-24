import { createBrowserClient } from '@supabase/ssr'
import { requireSupabasePublicConfig } from '@/lib/supabase/publicConfig'

export function createClient() {
  const config = requireSupabasePublicConfig()
  return createBrowserClient(
    config.url,
    config.anonKey,
  )
}
