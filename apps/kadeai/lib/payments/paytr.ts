import { createHmac , timingSafeEqual} from 'node:crypto'

/**
   * PayTR iFrame API yardimcilari.
   *
   * Akis: sunucu, get-token istegini PayTR'a POST eder ve donen iframe_token'i
   * kullanarak istemciye gomulu bir <iframe> doner (bkz. redirect route).
   *
   * paytr_token (STEP 1): base64( HMAC_SHA256(
   *   merchant_id + user_ip + merchant_oid + email + payment_amount + user_basket +
   *   no_installment + max_installment + currency + test_mode + merchant_salt, merchant_key) )
   *
   * hash (STEP 2 - callback): base64( HMAC_SHA256(
   *   merchant_oid + merchant_salt + status + total_amount, merchant_key) )
   */

const PAYTR_TOKEN_URL = 'https://www.paytr.com/odeme/api/get-token'
export const PAYTR_IFRAME_BASE_URL = 'https://www.paytr.com/odeme/guvenli'

export interface PaytrCredentials {
    merchantId: string
    merchantKey: string
    merchantSalt: string
}

export interface PaytrBasketItem {
    name: string
    price: string
    qty: number
}

export interface PaytrTokenRequestInput {
    orderId: string
    userIp: string
    email: string
    paymentAmountMinor: number
    basket: PaytrBasketItem[]
    userName: string
    userAddress: string
    userPhone: string
    merchantOkUrl: string
    merchantFailUrl: string
    currency?: 'TL' | 'USD' | 'EUR' | 'GBP' | 'RUB'
    testMode?: 0 | 1
    noInstallment?: 0 | 1
    maxInstallment?: number
    timeoutLimitMinutes?: number
    lang?: 'tr' | 'en'
}

function paytrTokenSignature(
    merchantId: string,
    userIp: string,
    orderId: string,
    email: string,
    paymentAmount: string,
    userBasketB64: string,
    noInstallment: string,
    maxInstallment: string,
    currency: string,
    testMode: string,
    creds: PaytrCredentials,
  ): string {
    const hashStr = `${merchantId}${userIp}${orderId}${email}${paymentAmount}${userBasketB64}${noInstallment}${maxInstallment}${currency}${testMode}`
    return createHmac('sha256', creds.merchantKey).update(hashStr + creds.merchantSalt).digest('base64')
}

export function buildPaytrTokenRequest(
    input: PaytrTokenRequestInput,
    creds: PaytrCredentials,
  ): Record<string, string> {
    const currency = input.currency ?? 'TL'
    const testMode = String(input.testMode ?? 0)
    const noInstallment = String(input.noInstallment ?? 0)
    const maxInstallment = String(input.maxInstallment ?? 0)
    const paymentAmount = String(Math.round(input.paymentAmountMinor))
    const userBasketB64 = Buffer.from(
          JSON.stringify(input.basket.map((item) => [item.name, item.price, item.qty])),
        ).toString('base64')

  const paytrToken = paytrTokenSignature(
        creds.merchantId,
        input.userIp,
        input.orderId,
        input.email,
        paymentAmount,
        userBasketB64,
        noInstallment,
        maxInstallment,
        currency,
        testMode,
        creds,
      )

  return {
        merchant_id: creds.merchantId,
        user_ip: input.userIp,
        merchant_oid: input.orderId,
        email: input.email,
        payment_amount: paymentAmount,
        paytr_token: paytrToken,
        user_basket: userBasketB64,
        debug_on: '0',
        no_installment: noInstallment,
        max_installment: maxInstallment,
        user_name: input.userName,
        user_address: input.userAddress,
        user_phone: input.userPhone,
        merchant_ok_url: input.merchantOkUrl,
        merchant_fail_url: input.merchantFailUrl,
        timeout_limit: String(input.timeoutLimitMinutes ?? 30),
        currency,
        test_mode: testMode,
        lang: input.lang ?? 'tr',
  }
}

export interface PaytrTokenResult {
    iframeToken: string
}

/** PayTR'in get-token servisine sunucu-tarafli istek atar. */
export async function fetchPaytrIframeToken(
    input: PaytrTokenRequestInput,
    creds: PaytrCredentials,
  ): Promise<PaytrTokenResult> {
    const fields = buildPaytrTokenRequest(input, creds)
    const response = await fetch(PAYTR_TOKEN_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(fields).toString(),
          cache: 'no-store',
    })
    if (!response.ok) throw new Error(`PayTR get-token istegi basarisiz (HTTP ${response.status}).`)
    const data = (await response.json()) as { status?: string; token?: string; reason?: string }
    if (data.status !== 'success' || !data.token) {
          throw new Error(`PayTR get-token reddedildi: ${data.reason || 'bilinmeyen hata'}`)
    }
    return { iframeToken: data.token }
}

export interface PaytrCallback {
    orderId: string
    status: 'paid' | 'failed'
    totalAmount: string
}

/**
 * PayTR bildirim (callback) govdesini (form-encoded) dogrular.
 * Imza (hash) dogrulanmazsa hata firlatir.
 *
 * ONEMLI: PayTR bu endpoint'ten duz metin "OK" yaniti bekler (JSON degil).
 * Yanlis/eksik yanit verilirse PayTR bildirimi tekrar tekrar gonderir ve
 * islem panelde "Devam Ediyor" gorunur.
 */
export function verifyPaytrCallback(
    rawBody: string,
    creds: Pick<PaytrCredentials, 'merchantKey' | 'merchantSalt'>,
  ): PaytrCallback {
    const params = new URLSearchParams(rawBody)
    const orderId = params.get('merchant_oid') ?? ''
    const status = params.get('status') ?? ''
    const totalAmount = params.get('total_amount') ?? ''
    const received = params.get('hash') ?? ''

  if (!orderId || !status || !received) {
        throw new Error('PayTR bildirimi: eksik alan.')
  }

  const expected = createHmac('sha256', creds.merchantKey)
      .update(`${orderId}${creds.merchantSalt}${status}${totalAmount}`)
      .digest('base64')

  const a = Buffer.from(expected)
    const b = Buffer.from(received)
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
          throw new Error('PayTR bildirimi: hash dogrulanamadi.')
    }

  return {
        orderId,
        status: status === 'success' ? 'paid' : 'failed',
        totalAmount,
  }
}
