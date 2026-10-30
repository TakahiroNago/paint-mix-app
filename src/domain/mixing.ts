import type { MixboxApi } from './mixbox'

/** Sliders move in 5% steps: a value of 20 means 100%. */
export const RATIO_STEPS = 20

const EMPTY_MIX_COLOR = '#999999'

export interface MixResult {
  base: string
  final: string
}

export interface Recipe {
  parts: number[]
  white: number
}

export function toPercent(value: number): number {
  return Math.round((value / RATIO_STEPS) * 100)
}

export function calculateMix(
  mixbox: MixboxApi,
  colors: string[],
  weights: number[],
  white: string,
  whiteRatio: number,
): MixResult {
  const total = weights.reduce((sum, weight) => sum + weight, 0)
  const base = total === 0 ? EMPTY_MIX_COLOR : mixbox.mix(colors, weights)
  const final =
    whiteRatio === 0 ? base : mixbox.mix([base, white], [RATIO_STEPS - whiteRatio, whiteRatio])

  return { base, final }
}

function greatestCommonDivisor(first: number, second: number): number {
  return second === 0 ? first : greatestCommonDivisor(second, first % second)
}

/** Converts slider values into the smallest whole-number paint ratio, including white. */
export function createRecipe(weights: number[], whiteRatio: number): Recipe {
  const total = weights.reduce((sum, weight) => sum + weight, 0)
  if (total === 0) {
    return { parts: weights.map(() => 0), white: whiteRatio > 0 ? 1 : 0 }
  }

  const parts = weights.map((weight) => weight * (RATIO_STEPS - whiteRatio))
  const white = whiteRatio * total
  const divisor = [...parts, white].reduce(greatestCommonDivisor, 0)

  return { parts: parts.map((part) => part / divisor), white: white / divisor }
}

/** A slider track that previews the pigment mix between two colors. */
export function createMixTrack(mixbox: MixboxApi, color1: string, color2: string): string {
  const stops = [0, 1, 2, 3, 4].map((step) =>
    step === 0 ? color1 : step === 4 ? color2 : mixbox.mix([color1, color2], [4 - step, step]),
  )

  return `linear-gradient(to right, ${stops.join(', ')})`
}
