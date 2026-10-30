import type { PaintColor } from '../../domain/colors'
import { ModalDialog } from './ModalDialog'
import { getColorName, getTextColor, type Language } from './mixerUtils'
import { messages } from '../../i18n/messages'

interface PaintPickerProps {
  colors: PaintColor[]
  language: Language
  selectedColor: PaintColor
  customColorHex: string
  onCustomColorHexChange: (hex: string) => void
  onSelect: (color: PaintColor) => void
  onClose: () => void
}

export function PaintPicker({
  colors,
  customColorHex,
  language,
  onClose,
  onCustomColorHexChange,
  onSelect,
  selectedColor,
}: PaintPickerProps) {
  const t = messages[language]

  return (
    <ModalDialog className="paint-picker" closeLabel={t.close} onClose={onClose} title={t.choosePaint}>
      <div className="paint-picker__grid">
        {colors.map((color) => (
          <button
            aria-pressed={selectedColor.id === color.id}
            className="paint-picker__paint"
            key={color.id}
            onClick={() => onSelect(color)}
            type="button"
          >
            <span className="paint-picker__swatch" style={{ backgroundColor: color.hex }} />
            <span className="paint-picker__name">{getColorName(color, language)}</span>
          </button>
        ))}
      </div>
      <div className="paint-picker__custom">
        <input
          aria-label={t.customColor}
          onChange={(event) => onCustomColorHexChange(event.target.value)}
          type="color"
          value={customColorHex}
        />
        <span>{t.customColor}</span>
        <button
          className="paint-picker__use-custom"
          onClick={() =>
            onSelect({
              id: `custom-${customColorHex}`,
              hex: customColorHex,
              name: messages.en.customColor,
              nameJa: messages.ja.customColor,
            })
          }
          style={{ backgroundColor: customColorHex, color: getTextColor(customColorHex) }}
          type="button"
        >
          {t.useCustomColor}
        </button>
      </div>
    </ModalDialog>
  )
}
