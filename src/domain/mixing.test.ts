import { describe, expect, it, vi } from 'vitest'
import type { MixboxApi } from './mixbox'
import {
  calculateMultiColorMix,
  calculateTwoColorMix,
  type MultiColorRatios,
  type MultiColorValues,
} from './mixing'

function createMixboxMock() {
  const lerp = vi.fn(
    (color1: string, color2: string, amount: number) =>
      `mix(${color1},${color2},${amount})`,
  )
  return { api: { lerp } satisfies MixboxApi, lerp }
}

describe('calculateTwoColorMix', () => {
  it('preserves the sequential mix ratios and derives both gradients', () => {
    const { api, lerp } = createMixboxMock()

    const result = calculateTwoColorMix(api, 'yellow', 'blue', 5, 'white', 15)

    expect(result.base).toBe('mix(yellow,blue,0.25)')
    expect(result.withWhite).toBe('mix(mix(yellow,blue,0.25),white,0.75)')
    expect(result.baseGradient).toContain('linear-gradient(to right, yellow')
    expect(result.baseGradient).toContain('blue)')
    expect(result.whiteGradient).toContain('linear-gradient(to right, mix(yellow,blue,0.25)')
    expect(result.whiteGradient).toContain('white)')
    expect(lerp.mock.calls.map(([, , amount]) => amount)).toEqual([
      0.25,
      0.75,
      0.125,
      0.625,
      0.375,
      0.875,
    ])
  })

  it('supports endpoint ratios without changing their direction', () => {
    const { api, lerp } = createMixboxMock()

    const result = calculateTwoColorMix(api, 'yellow', 'blue', 0, 'white', 20)

    expect(result.base).toBe('mix(yellow,blue,0)')
    expect(result.withWhite).toBe('mix(mix(yellow,blue,0),white,1)')
    expect(lerp.mock.calls[0]).toEqual(['yellow', 'blue', 0])
    expect(lerp.mock.calls[1]).toEqual([result.base, 'white', 1])
  })
})

describe('calculateMultiColorMix', () => {
  const colors: MultiColorValues = ['c1', 'c2', 'c3', 'c4', 'white']

  it('mixes two pairs, combines those results, then adds the fifth color', () => {
    const { api, lerp } = createMixboxMock()

    const result = calculateMultiColorMix(api, colors, [10, 10, 10, 10, 10])

    expect(result.firstPair).toBe('mix(c1,c2,0.5)')
    expect(result.secondPair).toBe('mix(c3,c4,0.5)')
    expect(result.base).toBe('mix(mix(c1,c2,0.5),mix(c3,c4,0.5),0.5)')
    expect(result.withFifthColor).toBe(`mix(${result.base},white,0.5)`)
    expect(result.baseTotal).toBe(40)
    expect(lerp.mock.calls.map(([, , amount]) => amount)).toEqual([0.5, 0.5, 0.5, 0.5])
  })

  it('weights a pair using its relative amounts before combining pairs', () => {
    const { api, lerp } = createMixboxMock()

    const ratios: MultiColorRatios = [0, 5, 0, 5, 20]
    const result = calculateMultiColorMix(api, colors, ratios)

    expect(result.firstPair).toBe('mix(c1,c2,1)')
    expect(result.secondPair).toBe('mix(c3,c4,1)')
    expect(lerp.mock.calls[2]).toEqual([result.firstPair, result.secondPair, 0.5])
    expect(lerp.mock.calls[3]).toEqual([result.base, 'white', 1])
    expect(result.baseTotal).toBe(10)
    expect(lerp.mock.calls.every(([, , amount]) => Number.isFinite(amount))).toBe(true)
  })

  it('uses the fifth color directly when the first four ratios are zero', () => {
    const { api, lerp } = createMixboxMock()

    const result = calculateMultiColorMix(api, colors, [0, 0, 0, 0, 20])

    expect(result.base).toBe('#999999')
    expect(result.withFifthColor).toBe('white')
    expect(result.baseTotal).toBe(0)
    expect(lerp).not.toHaveBeenCalled()
  })

  it('returns gray when every ratio is zero', () => {
    const { api, lerp } = createMixboxMock()

    const result = calculateMultiColorMix(api, colors, [0, 0, 0, 0, 0])

    expect(result.base).toBe('#999999')
    expect(result.withFifthColor).toBe('#999999')
    expect(lerp).not.toHaveBeenCalled()
  })
})
