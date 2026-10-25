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
  return red + 1.4 * green + 0.8 * blue < 450 ? '#fff' : '#6c757d'
}
