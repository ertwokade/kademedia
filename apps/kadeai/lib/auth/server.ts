import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { hasValidSupabasePublicConfig } from '@/lib/supabase/publicConfig'

export async function getAuthenticatedUser() {
  if (process.env.NODE_ENV !== 'production' && process.env.KADE_DISABLE_AUTH === '1') return null
  if (!hasValidSupabasePublicConfig()) return null
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    return user
  } catch {
    return null
  }
}

export async function hasAuthenticatedUser() {
  if (process.env.NODE_ENV !== 'production' && process.env.KADE_DISABLE_AUTH === '1') return true
  return Boolean(await getAuthenticatedUser())
}

export async function assertAuthenticatedUser() {
  if (process.env.NODE_ENV !== 'production' && process.env.KADE_DISABLE_AUTH === '1') return null
  const user = await getAuthenticatedUser()
  if (!user) throw new Error('Oturum gerekli.')
  return user
}
