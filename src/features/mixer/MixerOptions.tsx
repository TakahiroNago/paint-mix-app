import { useState } from 'react'
import type { Language } from './mixerUtils'

interface MixerOptionsProps {
  language: Language
  onLanguageChange: (language: Language) => void
  optionsLabel: string
  colorNamesLabel: string
  showNames: boolean
  onToggleNames: () => void
  modeLabel: string
  modeActive: boolean
  onToggleMode: () => void
}

export function MixerOptions({
  language,
  onLanguageChange,
  optionsLabel,
  colorNamesLabel,
  showNames,
  onToggleNames,
  modeLabel,
  modeActive,
  onToggleMode,
}: MixerOptionsProps) {
  const [showOptions, setShowOptions] = useState(false)

  return (
    <>
      <button
        aria-expanded={showOptions}
        aria-label={optionsLabel}
        className="paint-mix__menu-button"
        onClick={() => setShowOptions((open) => !open)}
        type="button"
      >
        ☰
      </button>
      {showOptions && (
        <section aria-label={optionsLabel} className="paint-mix__options">
          <h2>{optionsLabel}</h2>
          <button
            aria-pressed={modeActive}
            className={modeActive ? 'paint-mix__option is-active' : 'paint-mix__option'}
            onClick={onToggleMode}
            type="button"
          >
            {modeLabel}
          </button>
          <button
            aria-pressed={showNames}
            className={showNames ? 'paint-mix__option is-active' : 'paint-mix__option'}
            onClick={onToggleNames}
            type="button"
          >
            {colorNamesLabel}
          </button>
          <div className="paint-mix__languages">
            <button
              aria-pressed={language === 'en'}
              onClick={() => onLanguageChange('en')}
              type="button"
            >
              English
            </button>
            <button
              aria-pressed={language === 'ja'}
              onClick={() => onLanguageChange('ja')}
              type="button"
            >
              日本語
            </button>
          </div>
        </section>
      )}
    </>
  )
}
