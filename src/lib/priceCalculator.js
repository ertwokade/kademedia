const NUMBER_KEYS = [
  'base',
  'perPlatform',
  'perPost',
  'perReel',
  'adsFlat',
  'reportBiweekly',
  'reportWeekly',
]

function nonNegativeNumber(value) {
  const number = Number(value)
  return Number.isFinite(number) && number > 0 ? number : 0
}

export function normalizePriceCoefficients(input = {}) {
  return Object.fromEntries(NUMBER_KEYS.map((key) => [key, nonNegativeNumber(input[key])]))
}

export function calculateEstimatedMonthlyPrice(coefficients, selection) {
  const rates = normalizePriceCoefficients(coefficients)
  const platforms = Math.min(12, Math.floor(nonNegativeNumber(selection?.platforms)))
  const posts = Math.min(200, Math.floor(nonNegativeNumber(selection?.posts)))
  const reels = Math.min(100, Math.floor(nonNegativeNumber(selection?.reels)))
  const reportCost = selection?.reporting === 'weekly'
    ? rates.reportWeekly
    : selection?.reporting === 'biweekly'
      ? rates.reportBiweekly
      : 0

  return Math.round(
    rates.base
      + platforms * rates.perPlatform
      + posts * rates.perPost
      + reels * rates.perReel
      + (selection?.ads ? rates.adsFlat : 0)
      + reportCost,
  )
}
