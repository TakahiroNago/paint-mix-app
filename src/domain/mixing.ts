import type { MixboxApi } from './mixbox'

export interface TwoColorMix {
  base: string
  withWhite: string
  baseGradient: string
  whiteGradient: string
}

export interface MultiColorMix {
  firstPair: string
  secondPair: string
  base: string
  withFifthColor: string
  baseTotal: number
}

export type MultiColorValues = [
  color1: string,
  color2: string,
  color3: string,
  color4: string,
  color5: string,
]

export type MultiColorRatios = [
  ratio1: number,
  ratio2: number,
  ratio3: number,
  ratio4: number,
  ratio5: number,
]

export function calculateTwoColorMix(
  mixbox: MixboxApi,
  color1: string,
  color2: string,
  colorRatio: number,
  white: string,
  whiteRatio: number,
): TwoColorMix {
  const ratio = colorRatio / 20
  const whiteMixRatio = whiteRatio / 20
  const base = mixbox.lerp(color1, color2, ratio)
  const withWhite = mixbox.lerp(base, white, whiteMixRatio)

  return {
    base,
    withWhite,
    baseGradient: createGradient(mixbox, color1, color2, base, ratio),
    whiteGradient: createGradient(mixbox, base, white, withWhite, whiteMixRatio),
  }
}

export function calculateMultiColorMix(
  mixbox: MixboxApi,
  colors: MultiColorValues,
  ratios: MultiColorRatios,
): MultiColorMix {
  const firstPairTotal = ratios[0] + ratios[1]
  const secondPairTotal = ratios[2] + ratios[3]
  const baseTotal = firstPairTotal + secondPairTotal
  const firstPair =
    firstPairTotal === 0
      ? colors[0]
      : mixbox.lerp(colors[0], colors[1], ratios[1] / firstPairTotal)
  const secondPair =
    secondPairTotal === 0
      ? colors[2]
      : mixbox.lerp(colors[2], colors[3], ratios[3] / secondPairTotal)
  const base =
    baseTotal === 0
      ? '#999999'
      : mixbox.lerp(firstPair, secondPair, secondPairTotal / baseTotal)
  const withFifthColor =
    baseTotal === 0
      ? ratios[4] === 0
        ? '#999999'
        : colors[4]
      : mixbox.lerp(base, colors[4], ratios[4] / 20)

  return { firstPair, secondPair, base, withFifthColor, baseTotal }
}

export function createMixTrack(mixbox: MixboxApi, color1: string, color2: string): string {
  const stops = [0, 0.25, 0.5, 0.75, 1].map((amount) =>
    amount === 0 ? color1 : amount === 1 ? color2 : mixbox.lerp(color1, color2, amount),
  )

  return `linear-gradient(to right, ${stops.join(', ')})`
}

function createGradient(
  mixbox: MixboxApi,
  color1: string,
  color2: string,
  mixed: string,
  ratio: number,
): string {
  const mixed25 = mixbox.lerp(color1, color2, ratio / 2)
  const mixed75 = mixbox.lerp(color1, color2, ratio / 2 + 0.5)

  return `linear-gradient(to right, ${color1}, ${mixed25} ${20 * ratio}%, ${mixed} ${40 * ratio}%, ${mixed} ${40 * ratio + 60}%, ${mixed75} ${20 * ratio + 80}%, ${color2})`
}
