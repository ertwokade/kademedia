import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { appRoutes, withBasePath } from '@/lib/appConfig'
import { getRateLimitKey, rateLimit, rateLimitHeaders } from '@/lib/rateLimit'
import { mapPasswordLoginError } from '@/lib/auth/passwordErrors'
import { hasValidSupabasePublicConfig } from '@/lib/supabase/publicConfig'

export const dynamic = 'force-dynamic'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function trustedOrigin(request: NextRequest) {
  try {
    return new URL(process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin).origin
  } catch {
    return request.nextUrl.origin
  }
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Geçersiz istek gövdesi.' }, { status: 400 })
  }

  const action = body.action === 'signup' ? 'signup' : 'login'
  const email = String(body.email || '').trim().toLocaleLowerCase('en-US')
  const password = String(body.password || '')
  const displayName = String(body.displayName || '').trim().slice(0, 120)
  const limit = rateLimit(getRateLimitKey(request, `auth-${action}`, email), 5, 10 * 60_000)
  const headers = { ...rateLimitHeaders(limit), 'Cache-Control': 'no-store' }

  if (!limit.allowed) {
    return NextResponse.json({ error: 'Çok fazla deneme yapıldı. Lütfen daha sonra tekrar deneyin.' }, { status: 429, headers })
  }
  if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    return NextResponse.json({ error: 'Geçerli bir e-posta adresi girin.' }, { status: 400, headers })
  }
  if (password.length < 8 || password.length > 128) {
    return NextResponse.json({ error: 'Parola 8–128 karakter arasında olmalıdır.' }, { status: 400, headers })
  }
  if (!hasValidSupabasePublicConfig()) {
    return NextResponse.json({ error: 'Kimlik doğrulama hizmeti kullanılamıyor.' }, { status: 503, headers })
  }

  try {
    const supabase = await createClient()
    if (action === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        console.error('[kadeai/login] signIn reddedildi:', {
          code: (error as { code?: string }).code,
          status: error.status,
        })
        const mapped = mapPasswordLoginError(error)
        return NextResponse.json({ error: mapped.error }, { status: mapped.status, headers })
      }
      return NextResponse.json({ ok: true, next: appRoutes.dashboard }, { headers })
    }

    const callback = `${appRoutes.authCallback}?next=${encodeURIComponent(appRoutes.onboarding)}`
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName || email.split('@')[0] },
        emailRedirectTo: new URL(withBasePath(callback), trustedOrigin(request)).toString(),
      },
    })
    if (error) {
      console.error('[kadeai/signup] kayıt reddedildi:', {
        code: (error as { code?: string }).code,
        status: error.status,
        message: error.message,
      })
      const code = (error as { code?: string }).code
      if (code === 'user_already_exists' || code === 'email_exists' || /already registered|already exists/i.test(error.message)) {
        return NextResponse.json({
          error: 'Bu e-posta ile zaten bir Kade AI hesabı var. "Giriş Yap" sekmesinden giriş yapın.',
        }, { status: 400, headers })
      }
      return NextResponse.json({ error: 'Kayıt işlemi tamamlanamadı. Bilgileri kontrol edip tekrar deneyin.' }, { status: 400, headers })
    }

    return NextResponse.json({
      ok: true,
      next: data.session ? appRoutes.onboarding : null,
      message: 'İşlem tamamlandı. Doğrulama gerekiyorsa e-postanızı kontrol edin.',
    }, { status: data.session ? 200 : 202, headers })
  } catch {
    return NextResponse.json({ error: 'Kimlik doğrulama hizmetine ulaşılamıyor.' }, { status: 503, headers })
  }
}
