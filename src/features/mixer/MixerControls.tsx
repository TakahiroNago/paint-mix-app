import { useState } from 'react'
import type { PaintColor } from '../../domain/colors'
import { getColorName, type Language } from './mixerUtils'

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
}

export function ColorPaletteDialog({
  colors,
  language,
  onClose,
  onSelect,
  paletteName,
  selectedColor,
}: ColorPaletteDialogProps) {
  const [customHex, setCustomHex] = useState('#eeeeee')
  const customName = language === 'ja' ? 'カスタムカラー' : 'Custom Color'

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
          <button aria-label={language === 'ja' ? '閉じる' : 'Close'} onClick={onClose} type="button">
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
          <label htmlFor="custom-color">{customName}</label>
          <input
            aria-label={customName}
            id="custom-color"
            onChange={(event) => setCustomHex(event.target.value)}
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
            type="button"
          >
            {customName}
          </button>
        </div>
      </section>
    </div>
  )
}
