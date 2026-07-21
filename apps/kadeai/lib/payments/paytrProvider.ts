import type { PaymentCheckout, PaymentProvider, VerifiedPaymentEvent } from './types'
import { verifyPaytrCallback } from './paytr'

/**
   * PayTR odeme saglayicisi (iFrame API).
   *
   * createCheckout: kullaniciyi, PayTR'dan alinan iframe_token'i gomen
   * dahili yonlendirme sayfasina gonderir (`/api/payments/paytr/redirect`).
   * Gercek get-token istegi ve form uretimi redirect route'ta yapilir --
   * boylece merchant_key/merchant_salt istemciye asla sizmaz.
   *
   * verifyWebhook: PayTR bildirimini (callback) hash imzasiyla dogrular.
   *
   * Gerekli env: PAYTR_MERCHANT_ID, PAYTR_MERCHANT_KEY, PAYTR_MERCHANT_SALT
   */
export class PaytrPaymentProvider implements PaymentProvider {
    readonly name = 'paytr' as const

  private credentials() {
        const merchantId = process.env.PAYTR_MERCHANT_ID?.trim()
        const merchantKey = process.env.PAYTR_MERCHANT_KEY?.trim()
        const merchantSalt = process.env.PAYTR_MERCHANT_SALT?.trim()
        if (!merchantId || !merchantKey || !merchantSalt) {
                throw new Error('PayTR kimlik bilgileri (PAYTR_MERCHANT_ID/KEY/SALT) eksik.')
        }
        return { merchantId, merchantKey, merchantSalt }
  }

  async createCheckout(input: PaymentCheckout): Promise<{ checkoutUrl: string; externalId: string }> {
        // Kimlik bilgilerinin varligini burada da dogrula ki eksikse checkout hemen 503 donsun.
      this.credentials()
        const checkoutUrl = `/api/payments/paytr/redirect?order=${encodeURIComponent(input.orderId)}`
        return { checkoutUrl, externalId: input.orderId }
  }

  verifyWebhook(rawBody: string, _signature: string): VerifiedPaymentEvent {
        void _signature // PayTR hash'i govde icindedir (bkz. verifyPaytrCallback)
      const { merchantKey, merchantSalt } = this.credentials()
        const callback = verifyPaytrCallback(rawBody, { merchantKey, merchantSalt })
        return {
                eventId: `paytr_${callback.orderId}_${callback.status}`,
                orderId: callback.orderId,
                status: callback.status,
        }
  }
}
