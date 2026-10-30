import { useEffect, useRef, useState } from 'react'
import type { Language } from '../../i18n/messages'
import { messages } from '../../i18n/messages'

interface SiteMenuProps {
  language: Language
  onLanguageChange: (language: Language) => void
}

export function SiteMenu({ language, onLanguageChange }: SiteMenuProps) {
  const [showOptions, setShowOptions] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLElement>(null)
  const t = messages[language]

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
    <div className="site-menu">
      <button
        aria-expanded={showOptions}
        aria-label={t.options}
        className="site-menu__button"
        onClick={() => setShowOptions((open) => !open)}
        ref={buttonRef}
        type="button"
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>
      {showOptions && (
        <section aria-label={t.options} className="site-menu__panel" ref={panelRef}>
          <h2>{t.language}</h2>
          <div className="site-menu__languages">
            <button
              aria-pressed={language === 'ja'}
              onClick={() => onLanguageChange('ja')}
              type="button"
            >
              日本語
            </button>
            <button
              aria-pressed={language === 'en'}
              onClick={() => onLanguageChange('en')}
              type="button"
            >
              English
            </button>
          </div>
        </section>
      )}
    </div>
  )
}
