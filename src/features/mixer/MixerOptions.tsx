import { useCallback, useEffect, useRef, useState } from 'react'
import type { Language } from './mixerUtils'

interface LicenseCopy {
  title: string
  description: string
  copyright: string
  terms: string
  close: string
}

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
  license: LicenseCopy
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
  license,
}: MixerOptionsProps) {
  const [showOptions, setShowOptions] = useState(false)
  const [showLicense, setShowLicense] = useState(false)
  const closeLicense = useCallback(() => setShowLicense(false), [])

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
          <button
            className="paint-mix__option"
            onClick={() => setShowLicense(true)}
            type="button"
          >
            {license.title}
          </button>
        </section>
      )}
      {showLicense && (
        <LicenseDialog license={license} onClose={closeLicense} />
      )}
    </>
  )
}

interface LicenseDialogProps {
  license: LicenseCopy
  onClose: () => void
}

function LicenseDialog({ license, onClose }: LicenseDialogProps) {
  const closeButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeButton.current?.focus()
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div
      className="paint-mix__backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <section
        aria-labelledby="mixbox-license-title"
        aria-modal="true"
        className="paint-mix__dialog paint-mix__license-dialog"
        role="dialog"
      >
        <div className="paint-mix__dialog-header">
          <h2 id="mixbox-license-title">{license.title}</h2>
          <button
            aria-label={license.close}
            onClick={onClose}
            ref={closeButton}
            type="button"
          >
            ×
          </button>
        </div>
        <p>{license.description}</p>
        <a href="https://scrtwpns.com/mixbox/" rel="noopener noreferrer" target="_blank">
          https://scrtwpns.com/mixbox/
        </a>
        <p>
          <a
            href="https://creativecommons.org/licenses/by-nc/4.0/"
            rel="noopener noreferrer"
            target="_blank"
          >
            CC BY-NC 4.0
          </a>
        </p>
        <hr />
        <p>{license.copyright}</p>
        <p>{license.terms}</p>
      </section>
    </div>
  )
}
