import type { CSSProperties } from 'react'
import { RATIO_STEPS } from '../../domain/mixing'

interface StepSliderProps {
  label: string
  value: number
  valueText: string
  onChange: (value: number) => void
  trackBackground: string
  thumbColor?: string
  thin?: boolean
}

export function StepSlider({
  label,
  onChange,
  thin = false,
  thumbColor = '#fff',
  trackBackground,
  value,
  valueText,
}: StepSliderProps) {
  function change(nextValue: number) {
    onChange(Math.max(0, Math.min(RATIO_STEPS, nextValue)))
  }

  return (
    <div
      className={thin ? 'step-slider step-slider--thin' : 'step-slider'}
      style={{ '--track': trackBackground, '--thumb': thumbColor } as CSSProperties}
    >
      <button
        aria-label={`${label} −`}
        className="step-slider__button"
        onClick={() => change(value - 1)}
        type="button"
      >
        −
      </button>
      <input
        aria-label={label}
        aria-valuetext={valueText}
        className="step-slider__input"
        max={RATIO_STEPS}
        min="0"
        onChange={(event) => change(Number(event.target.value))}
        step="1"
        type="range"
        value={value}
      />
      <button
        aria-label={`${label} +`}
        className="step-slider__button"
        onClick={() => change(value + 1)}
        type="button"
      >
        ＋
      </button>
    </div>
  )
}
