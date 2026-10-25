import { useState } from 'react'
import type { PaintColor } from '../../domain/colors'
import { getColorName, getTextColor, type Language } from './mixerUtils'
import { messages } from '../../i18n/messages'

interface RatioControlProps {
  label: string
  value: number
  onChange: (value: number) => void
}

export function RatioControl({ label, onChange, value }: RatioControlProps) {
  return (
    <div className="paint-mix__ratio">
      <label className="paint-mix__label" htmlFor={label}>
        {label}
      </label>
      <div className="paint-mix__ratio-controls">
        <button aria-label={`${label} −`} onClick={() => onChange(value - 1)} type="button">
          −
        </button>
        <input
          id={label}
          max="20"
          min="0"
          onChange={(event) => onChange(Number(event.target.value))}
          type="range"
          value={value}
        />
        <button aria-label={`${label} +`} onClick={() => onChange(value + 1)} type="button">
          +
        </button>
      </div>
    </div>
  )
}

interface ColorPaletteDialogProps {
  colors: PaintColor[]
  language: Language
  onClose: () => void
  onSelect: (color: PaintColor) => void
  paletteName: string
  selectedColor: PaintColor
  customColorHex?: string
  onCustomColorHexChange?: (hex: string) => void
  showCustomColorLabel?: boolean
  previewCustomColor?: boolean
}

export function ColorPaletteDialog({
  colors,
  language,
  onClose,
  onSelect,
  paletteName,
  selectedColor,
  customColorHex,
  onCustomColorHexChange,
  showCustomColorLabel = true,
  previewCustomColor = false,
}: ColorPaletteDialogProps) {
  const [localCustomHex, setLocalCustomHex] = useState('#eeeeee')
  const customHex = customColorHex ?? localCustomHex
  const t = messages[language]
  const customName = t.customColor

  function changeCustomHex(hex: string) {
    setLocalCustomHex(hex)
    onCustomColorHexChange?.(hex)
  }

  return (
    <div className="paint-mix__backdrop" onClick={onClose}>
      <section
        aria-label={paletteName}
        aria-modal="true"
        className="paint-mix__dialog"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <div className="paint-mix__dialog-header">
          <h2>{paletteName}</h2>
          <button aria-label={t.close} onClick={onClose} type="button">
            ×
          </button>
        </div>
        <div className="paint-mix__palette-grid">
          {colors.map((color) => (
            <button
              aria-label={getColorName(color, language)}
              aria-pressed={selectedColor.id === color.id}
              className="paint-mix__palette-swatch"
              key={color.id}
              onClick={() => onSelect(color)}
              style={{ backgroundColor: color.hex }}
              title={getColorName(color, language)}
              type="button"
            />
          ))}
        </div>
        <div className="paint-mix__custom-color">
          {showCustomColorLabel && <label htmlFor="custom-color">{customName}</label>}
          <input
            aria-label={customName}
            id="custom-color"
            onChange={(event) => changeCustomHex(event.target.value)}
            type="color"
            value={customHex}
          />
          <button
            onClick={() =>
              onSelect({
                id: `custom-${customHex}`,
                hex: customHex,
                name: customName,
                nameJa: customName,
              })
            }
            style={
              previewCustomColor
                ? { backgroundColor: customHex, color: getTextColor(customHex) }
                : undefined
            }
            type="button"
          >
            {customName}
          </button>
        </div>
      </section>
    </div>
  )
}
