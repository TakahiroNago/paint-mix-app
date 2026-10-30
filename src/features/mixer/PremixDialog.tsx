import { useMemo } from 'react'
import { MIXABLE_PIGMENTS, TITANIUM_WHITE, type PaintColor } from '../../domain/colors'
import type { MixboxApi } from '../../domain/mixbox'
import { ModalDialog } from './ModalDialog'
import { getColorName, getHueOrderFromYellow, type Language } from './mixerUtils'
import { messages } from '../../i18n/messages'

interface PremixDialogProps {
  mixbox: MixboxApi
  language: Language
  onSelect: (first: PaintColor, second: PaintColor) => void
  onClose: () => void
}

export function PremixDialog({ language, mixbox, onClose, onSelect }: PremixDialogProps) {
  const t = messages[language]

  const pairs = useMemo(() => {
    const result: Array<{ first: PaintColor; second: PaintColor; color: string }> = []
    for (let firstIndex = 0; firstIndex < MIXABLE_PIGMENTS.length; firstIndex += 1) {
      for (let secondIndex = firstIndex + 1; secondIndex < MIXABLE_PIGMENTS.length; secondIndex += 1) {
        const first = MIXABLE_PIGMENTS[firstIndex]
        const second = MIXABLE_PIGMENTS[secondIndex]
        result.push({ first, second, color: mixbox.mix([first.hex, second.hex], [1, 1]) })
      }
    }
    for (const pigment of MIXABLE_PIGMENTS) {
      result.push({
        first: pigment,
        second: TITANIUM_WHITE,
        color: mixbox.mix([pigment.hex, TITANIUM_WHITE.hex], [1, 1]),
      })
    }
    return result.sort(
      (firstPair, secondPair) =>
        getHueOrderFromYellow(firstPair.color) - getHueOrderFromYellow(secondPair.color),
    )
  }, [mixbox])

  return (
    <ModalDialog className="premix" closeLabel={t.close} onClose={onClose} title={t.premixTitle}>
      <div className="premix__grid">
        {pairs.map(({ first, second, color }) => {
          const name = `${getColorName(first, language)} + ${getColorName(second, language)}`
          return (
            <button
              aria-label={name}
              className="premix__swatch"
              key={`${first.id}-${second.id}`}
              onClick={() => onSelect(first, second)}
              style={{ backgroundColor: color }}
              title={name}
              type="button"
            />
          )
        })}
      </div>
    </ModalDialog>
  )
}
