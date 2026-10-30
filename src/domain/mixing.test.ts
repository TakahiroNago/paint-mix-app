import { describe, expect, it, vi } from 'vitest'
import type { MixboxApi } from './mixbox'
import { calculateMix, createMixTrack, createRecipe } from './mixing'

function createMixboxMock() {
  const mix = vi.fn(
    (colors: string[], weights: number[]) =>
      `mix(${colors.map((color, index) => `${color}*${weights[index]}`).join(',')})`,
  )
  return { api: { mix } satisfies MixboxApi, mix }
}

describe('calculateMix', () => {
  it('mixes the paints by weight, then mixes the result with white', () => {
    const { api } = createMixboxMock()

    const result = calculateMix(api, ['yellow', 'blue'], [15, 5], 'white', 15)

    expect(result.base).toBe('mix(yellow*15,blue*5)')
    expect(result.final).toBe('mix(mix(yellow*15,blue*5)*5,white*15)')
  })

  it('skips the white mix when no white is added', () => {
    const { api, mix } = createMixboxMock()

    const result = calculateMix(api, ['c1', 'c2', 'c3', 'c4'], [5, 5, 0, 5], 'white', 0)

    expect(result.final).toBe(result.base)
    expect(mix).toHaveBeenCalledTimes(1)
  })

  it('uses gray as the base when every weight is zero', () => {
    const { api, mix } = createMixboxMock()

    const result = calculateMix(api, ['c1', 'c2'], [0, 0], 'white', 0)

    expect(result).toEqual({ base: '#999999', final: '#999999' })
    expect(mix).not.toHaveBeenCalled()
  })
})

describe('createRecipe', () => {
  it('reduces the paint and white amounts to whole numbers', () => {
    expect(createRecipe([10, 10], 10)).toEqual({ parts: [1, 1], white: 2 })
    expect(createRecipe([13, 7], 0)).toEqual({ parts: [13, 7], white: 0 })
    expect(createRecipe([5, 5, 5, 5], 10)).toEqual({ parts: [1, 1, 1, 1], white: 4 })
  })

  it('keeps zero-weight paints in their slots', () => {
    expect(createRecipe([4, 0, 2, 0], 0)).toEqual({ parts: [2, 0, 1, 0], white: 0 })
  })

  it('handles white-only and empty mixes', () => {
    expect(createRecipe([10, 10], 20)).toEqual({ parts: [0, 0], white: 1 })
    expect(createRecipe([0, 0], 5)).toEqual({ parts: [0, 0], white: 1 })
  })
})

describe('createMixTrack', () => {
  it('builds a gradient from pigment mixes between the two colors', () => {
    const { api } = createMixboxMock()

    expect(createMixTrack(api, 'yellow', 'blue')).toBe(
      'linear-gradient(to right, yellow, mix(yellow*3,blue*1), mix(yellow*2,blue*2), mix(yellow*1,blue*3), blue)',
    )
  })
})
