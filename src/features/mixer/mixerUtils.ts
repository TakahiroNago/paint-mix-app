import type { PaintColor } from '../../domain/colors'
import type { Language } from '../../i18n/messages'

export type { Language } from '../../i18n/messages'

export function getColorName(color: PaintColor, language: Language): string {
  return language === 'ja' ? color.nameJa : color.name
}

export function getTextColor(hex: string): string {
  const red = Number.parseInt(hex.slice(1, 3), 16)
  const green = Number.parseInt(hex.slice(3, 5), 16)
  const blue = Number.parseInt(hex.slice(5, 7), 16)
  return red + 1.4 * green + 0.8 * blue < 450 ? '#fff' : '#1d1d1f'
}

function parseRgb(color: string): [number, number, number] | null {
  const hexMatch = /^#([\da-f]{3}|[\da-f]{6})$/i.exec(color)
  if (hexMatch) {
    const value =
      hexMatch[1].length === 3
        ? hexMatch[1].split('').map((channel) => channel + channel).join('')
        : hexMatch[1]
    return [
      Number.parseInt(value.slice(0, 2), 16),
      Number.parseInt(value.slice(2, 4), 16),
      Number.parseInt(value.slice(4, 6), 16),
    ]
  }

  const rgbMatch = /^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/i.exec(color)
  if (rgbMatch) {
    return [Number(rgbMatch[1]), Number(rgbMatch[2]), Number(rgbMatch[3])]
  }

  return null
}

export function getColorHue(color: string): number {
  const rgb = parseRgb(String(color))
  if (!rgb) {
    throw new Error(`Unsupported color format for hue sorting: ${color}`)
  }

  const [red, green, blue] = rgb.map((channel) => channel / 255)

  const maximum = Math.max(red, green, blue)
  const minimum = Math.min(red, green, blue)
  const delta = maximum - minimum
  if (delta === 0) {
    return 0
  }

  const hue =
    maximum === red
      ? ((green - blue) / delta) % 6
      : maximum === green
        ? (blue - red) / delta + 2
        : (red - green) / delta + 4

  return (hue * 60 + 360) % 360
}

export function getHueOrderFromYellow(color: string): number {
  return (getColorHue(color) - 47 + 360) % 360
}

export function sortColorsByHue<T extends Pick<PaintColor, 'hex'>>(colors: T[]): T[] {
  return [...colors].sort(
    (firstColor, secondColor) =>
      getHueOrderFromYellow(firstColor.hex) - getHueOrderFromYellow(secondColor.hex),
  )
}
