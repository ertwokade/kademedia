import assert from 'node:assert/strict'
import { test } from 'node:test'
import { mapPasswordLoginError } from '../../lib/auth/passwordErrors'
import { parseSupabasePublicConfig } from '../../lib/supabase/publicConfig'

test('Supabase public config rejects missing, placeholder and malformed values', () => {
  assert.deepEqual(parseSupabasePublicConfig(undefined, undefined), {
    valid: false,
    reason: 'missing_url',
  })
  assert.deepEqual(parseSupabasePublicConfig('https://project.supabase.co', ''), {
    valid: false,
    reason: 'missing_anon_key',
  })
  assert.deepEqual(
    parseSupabasePublicConfig('https://YOUR_PROJECT.supabase.co', 'YOUR_SUPABASE_ANON_KEY'),
    { valid: false, reason: 'placeholder' },
  )
  assert.deepEqual(parseSupabasePublicConfig('not-a-url', 'publishable-key'), {
    valid: false,
    reason: 'invalid_url',
  })
})

test('Supabase public config normalizes a valid project origin', () => {
  assert.deepEqual(
    parseSupabasePublicConfig(' https://project.supabase.co/path ', ' publishable-key '),
    {
      valid: true,
      url: 'https://project.supabase.co',
      anonKey: 'publishable-key',
    },
  )
})

test('password login errors distinguish credential rejection, rate limit and outage', () => {
  assert.equal(mapPasswordLoginError({ code: 'invalid_credentials', status: 400 }).status, 401)
  assert.match(
    mapPasswordLoginError({ code: 'email_not_confirmed', status: 400 }).error,
    /doğrulanmamış/,
  )
  assert.equal(mapPasswordLoginError({ code: 'over_request_rate_limit', status: 429 }).status, 429)
  assert.equal(mapPasswordLoginError({ code: 'unexpected_failure', status: 500 }).status, 503)
})
