import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { supabaseCookieOptions } from '@/lib/supabase/cookieOptions'
import { requireSupabasePublicConfig } from '@/lib/supabase/publicConfig'

export async function createClient() {
  const cookieStore = await cookies()
  const config = requireSupabasePublicConfig()
  return createServerClient(
    config.url,
    config.anonKey,
    {
      cookieOptions: supabaseCookieOptions,
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (toSet) => {
          try {
            toSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {}
        },
      },
    }
  )
}
