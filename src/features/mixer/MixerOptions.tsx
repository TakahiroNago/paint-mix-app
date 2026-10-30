import { useEffect, useRef, useState } from 'react'
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
  const buttonRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!showOptions) {
      return
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setShowOptions(false)
        buttonRef.current?.focus()
      }
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node
      if (!buttonRef.current?.contains(target) && !panelRef.current?.contains(target)) {
        setShowOptions(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('pointerdown', handlePointerDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [showOptions])

  return (
    <>
      <button
        aria-expanded={showOptions}
        aria-label={optionsLabel}
        className="paint-mix__menu-button"
        onClick={() => setShowOptions((open) => !open)}
        ref={buttonRef}
        type="button"
      >
        ☰
      </button>
      {showOptions && (
        <section aria-label={optionsLabel} className="paint-mix__options" ref={panelRef}>
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
