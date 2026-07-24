import { createClient } from '@supabase/supabase-js'
import { requireSupabasePublicConfig } from '@/lib/supabase/publicConfig'

export function createAdminClient() {
  const config = requireSupabasePublicConfig()
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  if (!serviceRole) throw new Error('Sunucu veritabanı yönetim anahtarı yapılandırılmamış.')
  return createClient(config.url, serviceRole, { auth: { autoRefreshToken: false, persistSession: false } })
}
