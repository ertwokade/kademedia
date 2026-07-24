type SupabaseAuthErrorLike = {
  code?: string
  status?: number
  message?: string
}

export type PasswordLoginErrorResponse = {
  status: 401 | 429 | 503
  error: string
}

const INVALID_CREDENTIALS_MESSAGE =
  'E-posta veya parola hatalı. Kade AI hesabınız yoksa önce "Kayıt Ol" sekmesinden oluşturun (Kade AI girişi, ana sitedeki hesabınızdan ayrıdır).'

export function mapPasswordLoginError(error: SupabaseAuthErrorLike): PasswordLoginErrorResponse {
  const code = error.code || ''
  const message = error.message || ''

  if (code === 'email_not_confirmed' || /email not confirmed/i.test(message)) {
    return {
      status: 401,
      error: 'E-posta adresiniz henüz doğrulanmamış. Kayıt sırasında gönderilen doğrulama bağlantısına tıklayın veya kayıt ekranından tekrar deneyin.',
    }
  }

  if (error.status === 429 || /rate.?limit|over_request_rate_limit/i.test(code)) {
    return {
      status: 429,
      error: 'Çok fazla giriş isteği yapıldı. Lütfen daha sonra tekrar deneyin.',
    }
  }

  if ((error.status && error.status >= 500) || /request_timeout|unexpected_failure/i.test(code)) {
    return {
      status: 503,
      error: 'Kimlik doğrulama hizmetine geçici olarak ulaşılamıyor. Lütfen daha sonra tekrar deneyin.',
    }
  }

  return { status: 401, error: INVALID_CREDENTIALS_MESSAGE }
}
