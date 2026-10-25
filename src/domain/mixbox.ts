export interface MixboxApi {
  lerp: (color1: string, color2: string, amount: number) => string
}

declare global {
  interface Window {
    mixbox?: MixboxApi
  }
}

const MIXBOX_SCRIPT_URL = 'https://scrtwpns.com/mixbox.js'
let mixboxRequest: Promise<MixboxApi> | undefined

export function loadMixbox(): Promise<MixboxApi> {
  if (window.mixbox) {
    return Promise.resolve(window.mixbox)
  }
  if (mixboxRequest) {
    return mixboxRequest
  }

  mixboxRequest = new Promise<MixboxApi>((resolve, reject) => {
    let script = document.querySelector<HTMLScriptElement>('script[data-paint-mixbox]')
    if (!script) {
      script = document.createElement('script')
      script.src = MIXBOX_SCRIPT_URL
      script.async = true
      script.dataset.paintMixbox = 'true'
      document.head.append(script)
    }

    const handleLoad = () => {
      script?.removeEventListener('load', handleLoad)
      script?.removeEventListener('error', handleError)
      if (window.mixbox) {
        resolve(window.mixbox)
      } else {
        script?.remove()
        reject(new Error('Mixbox loaded without exposing its API.'))
      }
    }
    const handleError = () => {
      script?.removeEventListener('load', handleLoad)
      script?.removeEventListener('error', handleError)
      script?.remove()
      reject(new Error('Could not load the Mixbox color-mixing library.'))
    }

    script.addEventListener('load', handleLoad, { once: true })
    script.addEventListener('error', handleError, { once: true })
    if (window.mixbox) {
      handleLoad()
    }
  }).catch((error: unknown) => {
    mixboxRequest = undefined
    throw error
  })

  return mixboxRequest
}
