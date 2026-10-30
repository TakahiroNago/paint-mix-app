import mixbox from 'mixbox'

export interface MixboxApi {
  /** Mixes paint colors by weight and returns an uppercase hex color. */
  mix: (colors: string[], weights: number[]) => string
}

function toHex(rgb: number[]): string {
  return `#${rgb.map((channel) => channel.toString(16).padStart(2, '0')).join('')}`.toUpperCase()
}

const mixboxApi: MixboxApi = {
  mix: (colors, weights) => {
    const total = weights.reduce((sum, weight) => sum + weight, 0)
    const latent = new Array<number>(mixbox.LATENT_SIZE).fill(0)
    colors.forEach((color, index) => {
      const share = weights[index] / total
      mixbox.rgbToLatent(color).forEach((value, channel) => {
        latent[channel] += value * share
      })
    })
    return toHex(mixbox.latentToRgb(latent))
  },
}

export function loadMixbox(): Promise<MixboxApi> {
  return Promise.resolve(mixboxApi)
}
