import type { MixboxApi } from './mixbox'

export interface TwoColorMix {
  base: string
  withWhite: string
  baseGradient: string
  whiteGradient: string
}

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
