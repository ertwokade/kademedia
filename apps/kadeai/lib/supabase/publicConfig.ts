export type SupabasePublicConfig =
  | { valid: true; url: string; anonKey: string }
  | {
      valid: false
      reason: 'missing_url' | 'missing_anon_key' | 'placeholder' | 'invalid_url' | 'invalid_protocol'
    }

const PLACEHOLDER_PATTERN = /YOUR_(?:PROJECT|SUPABASE)|CHANGE_ME|EXAMPLE/i

export function parseSupabasePublicConfig(
  urlValue: string | undefined,
  anonKeyValue: string | undefined,
): SupabasePublicConfig {
  const url = urlValue?.trim() || ''
  const anonKey = anonKeyValue?.trim() || ''

  if (!url) return { valid: false, reason: 'missing_url' }
  if (!anonKey) return { valid: false, reason: 'missing_anon_key' }
  if (PLACEHOLDER_PATTERN.test(url) || PLACEHOLDER_PATTERN.test(anonKey)) {
    return { valid: false, reason: 'placeholder' }
  }

  try {
    const parsedUrl = new URL(url)
    if (parsedUrl.protocol !== 'https:' && parsedUrl.protocol !== 'http:') {
      return { valid: false, reason: 'invalid_protocol' }
    }
    return { valid: true, url: parsedUrl.origin, anonKey }
  } catch {
    return { valid: false, reason: 'invalid_url' }
  }
}

export function getSupabasePublicConfig() {
  return parseSupabasePublicConfig(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  )
}

export function hasValidSupabasePublicConfig() {
  return getSupabasePublicConfig().valid
}

export function requireSupabasePublicConfig() {
  const config = getSupabasePublicConfig()
  if (!config.valid) {
    throw new Error(`Supabase public yapılandırması geçersiz: ${config.reason}`)
  }
  return config
}
