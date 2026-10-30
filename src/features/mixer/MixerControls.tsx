import { useEffect, useId, useState, type CSSProperties } from 'react'
import type { PaintColor } from '../../domain/colors'
import { ModalDialog } from './ModalDialog'
import { getColorName, getTextColor, toHexColor, type Language } from './mixerUtils'
import { messages } from '../../i18n/messages'

interface RatioControlProps {
  label: string
  value: number
  onChange: (value: number) => void
  valueText?: string
  trackBackground?: string
}

export function RatioControl({
  label,
  onChange,
  trackBackground,
  value,
  valueText,
}: RatioControlProps) {
  const id = useId()

  return (
    <div className="paint-mix__ratio">
      <label className="paint-mix__label" htmlFor={id}>
        {label}
      </label>
      {valueText && (
        <output className="paint-mix__ratio-value" htmlFor={id}>
          {valueText}
        </output>
      )}
      <div className="paint-mix__ratio-controls">
        <button aria-label={`${label} −`} onClick={() => onChange(value - 1)} type="button">
          −
        </button>
        <input
          aria-valuetext={valueText}
          className={trackBackground ? 'paint-mix__ratio-track' : undefined}
          id={id}
          max="20"
          min="0"
          onChange={(event) => onChange(Number(event.target.value))}
          style={
            trackBackground
              ? ({ '--ratio-track': trackBackground } as CSSProperties)
              : undefined
          }
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

interface ColorCodeProps {
  color: string
  label: string
  language: Language
}

export function ColorCode({ color, label, language }: ColorCodeProps) {
  const [copied, setCopied] = useState(false)
  const t = messages[language]
  const hex = toHexColor(color)

  useEffect(() => {
    if (!copied) {
      return
    }
    const timer = window.setTimeout(() => setCopied(false), 1500)
    return () => window.clearTimeout(timer)
  }, [copied])

  async function copyHex() {
    try {
      await navigator.clipboard.writeText(hex)
      setCopied(true)
    } catch (error) {
      console.warn('Could not copy the color code.', error)
    }
  }

  return (
    <div className="paint-mix__color-code">
      <span>{hex}</span>
      <button aria-label={t.copyColorCode(label)} onClick={() => void copyHex()} type="button">
        <span aria-live="polite">{copied ? t.copied : t.copy}</span>
      </button>
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
    <ModalDialog closeLabel={t.close} onClose={onClose} title={paletteName}>
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
    </ModalDialog>
  )
}
