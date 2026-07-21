import { NextRequest, NextResponse } from 'next/server'
import { assertAuthenticatedUser } from '@/lib/auth/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getPaymentProduct } from '@/lib/payments/catalog'
import { fetchPaytrIframeToken, PAYTR_IFRAME_BASE_URL } from '@/lib/payments/paytr'
import { getRateLimitKey, rateLimit, rateLimitHeaders } from '@/lib/rateLimit'
import { captureApiError } from '@/lib/observability/server'
import { escapeHtml } from '@/lib/security/escape'

export const dynamic = 'force-dynamic'

function getClientIp(request: NextRequest): string {
    const forwarded =
          request.headers.get('x-vercel-forwarded-for') ||
          request.headers.get('cf-connecting-ip') ||
          request.headers.get('x-real-ip') ||
          request.headers.get('x-forwarded-for') ||
          '127.0.0.1'
    return forwarded.split(',')[0].trim().slice(0, 39) || '127.0.0.1'
}

/**
 * Kullaniciyi PayTR'a yonlendirir: sunucu tarafinda get-token istegi atip
 * donen iframe_token'i gomen bir sayfa doner (bkz. PayTR iFrame API STEP 1).
 * 15 dk gecerli kisiye ozel teklifler burada sure kontrolunden gecer --
 * suresi dolan siparis icin odeme sayfasi ACILMAZ.
 */
export async function GET(request: NextRequest) {
    const limit = rateLimit(getRateLimitKey(request, 'paytr-redirect'), 10, 60_000)
    if (!limit.allowed) {
          return NextResponse.json({ error: 'Cok fazla istek.' }, { status: 429, headers: rateLimitHeaders(limit) })
    }

  const user = await assertAuthenticatedUser()
    if (!user) return NextResponse.json({ error: 'Oturum gerekli.' }, { status: 401 })

  const orderId = request.nextUrl.searchParams.get('order') || ''
    if (!/^[0-9a-f-]{36}$/i.test(orderId)) {
          return NextResponse.json({ error: 'Gecersiz siparis.' }, { status: 400 })
    }

  try {
        const merchantId = process.env.PAYTR_MERCHANT_ID?.trim()
        const merchantKey = process.env.PAYTR_MERCHANT_KEY?.trim()
        const merchantSalt = process.env.PAYTR_MERCHANT_SALT?.trim()
        if (!merchantId || !merchantKey || !merchantSalt) {
                return htmlMessage('Odeme saglayicisi yapilandirilmamis.', 503)
        }

      const admin = createAdminClient()
        const { data: order } = await admin
          .from('payment_orders')
          .select('id, user_id, product_id, amount_minor, currency, status, expires_at')
          .eq('id', orderId)
          .eq('provider', 'paytr')
          .maybeSingle()

      if (!order || order.user_id !== user.id) {
              return NextResponse.json({ error: 'Siparis bulunamadi.' }, { status: 404 })
      }
        if (order.status !== 'pending') {
                return htmlMessage('Bu siparis zaten sonuclanmis.', 409)
        }
        if (order.expires_at && new Date(order.expires_at).getTime() < Date.now()) {
                await admin.from('payment_orders')
                  .update({ status: 'cancelled', updated_at: new Date().toISOString() })
                  .eq('id', order.id)
                return htmlMessage('Bu teklifin suresi (15 dk) doldu. Lutfen yeni bir teklif olusturun.', 410)
        }

      const product = getPaymentProduct(order.product_id)
        const productName = product?.name ?? 'KadeAI Paketi'
        const appUrl = (process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin).replace(/\/$/, '')

      const { iframeToken } = await fetchPaytrIframeToken(
        {
                  orderId: order.id,
                  userIp: getClientIp(request),
                  email: user.email || '',
                  paymentAmountMinor: order.amount_minor,
                  basket: [{ name: productName, price: (order.amount_minor / 100).toFixed(2), qty: 1 }],
                  userName: user.email?.split('@')[0] || 'Musteri',
                  userAddress: '-',
                  userPhone: '',
                  merchantOkUrl: `${appUrl}/kadeai`,
                  merchantFailUrl: `${appUrl}/kadeai`,
                  testMode: process.env.PAYTR_TEST_MODE === '1' ? 1 : 0,
        },
        { merchantId, merchantKey, merchantSalt },
            )

      const body = `<!doctype html><html lang="tr"><head><meta charset="utf-8">
      <title>Odemeye yonlendiriliyorsunuz...</title>
      <script src="https://www.paytr.com/js/iframeResizer.min.js"></script>
      </head>
      <body style="font-family:sans-serif;background:#09090b;color:#e4e4e7;margin:0">
      <div style="max-width:640px;margin:2rem auto;text-align:center">
      <p>Guvenli odeme sayfasi yukleniyor...</p>
      <iframe src="${escapeHtml(PAYTR_IFRAME_BASE_URL)}/${escapeHtml(iframeToken)}" id="paytriframe" frameborder="0" scrolling="no" style="width:100%;border:0"></iframe>
      </div>
      <script>iFrameResize({}, '#paytriframe');</script>
      </body></html>`

      return new NextResponse(body, {
              status: 200,
              headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
      })
  } catch (error) {
        captureApiError(error, '/api/payments/paytr/redirect')
        return NextResponse.json({ error: 'Odeme baslatilamadi.' }, { status: 500 })
  }
}

function htmlMessage(message: string, status: number) {
    const body = `<!doctype html><html lang="tr"><head><meta charset="utf-8"><title>KadeAI</title></head>
    <body style="font-family:sans-serif;background:#09090b;color:#e4e4e7;display:flex;align-items:center;justify-content:center;height:100vh">
    <p style="max-width:32rem;text-align:center">${message}</p></body></html>`
    return new NextResponse(body, {
          status,
          headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
    })
}
