declare module 'mixbox' {
  type RgbArray = [number, number, number]

  const mixbox: {
    LATENT_SIZE: number
    rgbToLatent: (color: string) => number[]
    latentToRgb: (latent: number[]) => RgbArray
  }

  export default mixbox
}
