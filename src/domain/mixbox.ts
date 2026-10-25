import mixbox from 'mixbox'

export interface MixboxApi {
  lerp: (color1: string, color2: string, amount: number) => string
}

const mixboxApi: MixboxApi = {
  lerp: (color1, color2, amount) => mixbox.lerp(color1, color2, amount),
}

export function loadMixbox(): Promise<MixboxApi> {
  return Promise.resolve(mixboxApi)
}
