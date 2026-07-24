import assert from 'node:assert/strict'
import { test } from 'node:test'
import { calculateEstimatedMonthlyPrice, normalizePriceCoefficients } from '../../src/lib/priceCalculator.js'

test('price calculator uses only normalized server-managed coefficients', () => {
  const coefficients = {
    base: 3000,
    perPlatform: 1800,
    perPost: 300,
    perReel: 1500,
    adsFlat: 4500,
    reportBiweekly: 1500,
    reportWeekly: 3000,
  }

  assert.equal(calculateEstimatedMonthlyPrice(coefficients, {
    platforms: 2,
    posts: 12,
    reels: 4,
    ads: true,
    reporting: 'biweekly',
  }), 22200)
})

test('price calculator rejects negative and non-finite coefficient values', () => {
  assert.deepEqual(normalizePriceCoefficients({
    base: -1,
    perPlatform: 'invalid',
    perPost: Number.POSITIVE_INFINITY,
    perReel: 500,
  }), {
    base: 0,
    perPlatform: 0,
    perPost: 0,
    perReel: 500,
    adsFlat: 0,
    reportBiweekly: 0,
    reportWeekly: 0,
  })
})
