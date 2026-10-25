import { useEffect, useMemo, useState } from 'react'
import {
  DEFAULT_COLORS,
  MIXABLE_PIGMENTS,
  PAINT_COLORS,
  TITANIUM_WHITE,
  type PaintColor,
} from '../../domain/colors'
import { loadMixbox, type MixboxApi } from '../../domain/mixbox'
import { calculateTwoColorMix } from '../../domain/mixing'
import './TwoColorMixerPage.css'

type Language = 'en' | 'ja'
type PaletteTarget = 0 | 1

interface Messages {
  title: string
  options: string
  color: (index: number) => string
  chooseColor: (index: number) => string
  mixRatio: string
  mixWithWhite: string
  mixedColor: string
  gradient: string
  colorNames: string
  palette: (index: number) => string
  close: string
  loading: string
  loadError: string
  retry: string
  license: string
}

const messages: Record<Language, Messages> = {
  en: {
    title: 'PaintMix',
    options: 'Options',
    color: (index: number) => `Color ${index + 1}`,
    chooseColor: (index: number) => `Select Color ${index + 1}`,
    mixRatio: 'Mix Ratio',
    mixWithWhite: 'Mix with White',
    mixedColor: 'Select from Mixed Colors',
    gradient: 'Gradient',
    colorNames: 'Color Names',
    palette: (index: number) => `Palette ${index + 1}`,
    close: 'Close',
    loading: 'Loading color-mixing engine…',
    loadError: 'The color-mixing engine could not be loaded. Check your connection and retry.',
    retry: 'Retry',
    license: 'Mixbox is provided under the CC BY-NC 4.0 license for non-commercial use only.',
  },
  ja: {
    title: 'PaintMix',
    options: 'オプション',
    color: (index: number) => `色${index + 1}`,
    chooseColor: (index: number) => `色${index + 1}を選択`,
    mixRatio: '混合比',
    mixWithWhite: '白を混ぜる',
    mixedColor: '混色から選択',
    gradient: 'グラデーション',
    colorNames: '色名',
    palette: (index: number) => `パレット${index + 1}`,
    close: '閉じる',
    loading: '混色エンジンを読み込んでいます…',
    loadError: '混色エンジンを読み込めませんでした。接続を確認して再試行してください。',
    retry: '再試行',
    license: 'MixboxはCC BY-NC 4.0ライセンスにより非営利目的のみで提供されています。',
  },
}

function getInitialLanguage(): Language {
  try {
    const savedLanguage = window.localStorage.getItem('lang')
    if (savedLanguage === 'en' || savedLanguage === 'ja') {
      return savedLanguage
    }
  } catch (error) {
    console.warn('Could not read the saved language preference.', error)
  }

  return navigator.language.toLowerCase().startsWith('ja') ? 'ja' : 'en'
}

function getInitialNameVisibility(): boolean {
  try {
    return window.localStorage.getItem('nameDisp') !== 'false'
  } catch (error) {
    console.warn('Could not read the saved color-name preference.', error)
    return true
  }
}

function getColorName(color: PaintColor, language: Language): string {
  return language === 'ja' ? color.nameJa : color.name
}

function getTextColor(hex: string): string {
  const red = Number.parseInt(hex.slice(1, 3), 16)
  const green = Number.parseInt(hex.slice(3, 5), 16)
  const blue = Number.parseInt(hex.slice(5, 7), 16)
  return red + 1.4 * green + 0.8 * blue < 450 ? '#fff' : '#6c757d'
}

function TwoColorMixerPage() {
  const [language, setLanguage] = useState<Language>(getInitialLanguage)
  const [showNames, setShowNames] = useState(getInitialNameVisibility)
  const [colors, setColors] = useState<[PaintColor, PaintColor]>(DEFAULT_COLORS)
  const [colorRatio, setColorRatio] = useState(10)
  const [whiteRatio, setWhiteRatio] = useState(10)
  const [gradient, setGradient] = useState(false)
  const [mixbox, setMixbox] = useState<MixboxApi | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [paletteTarget, setPaletteTarget] = useState<PaletteTarget | null>(null)
  const [showMixedColors, setShowMixedColors] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const t = messages[language]

  const mix = useMemo(
    () =>
      mixbox
        ? calculateTwoColorMix(
            mixbox,
            colors[0].hex,
            colors[1].hex,
            colorRatio,
            TITANIUM_WHITE.hex,
            whiteRatio,
          )
        : null,
    [mixbox, colors, colorRatio, whiteRatio],
  )

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  useEffect(() => {
    let active = true
    void loadMixbox().then(
      (api) => {
        if (active) {
          setMixbox(api)
          setLoadError(null)
        }
      },
      (error: unknown) => {
        if (active) {
          setLoadError(error instanceof Error ? error.message : String(error))
        }
      },
    )
    return () => {
      active = false
    }
  }, [])

  function changeLanguage(nextLanguage: Language) {
    setLanguage(nextLanguage)
    try {
      window.localStorage.setItem('lang', nextLanguage)
    } catch (error) {
      console.error('Could not save the language preference.', error)
    }
  }

  function toggleNames() {
    const nextVisibility = !showNames
    setShowNames(nextVisibility)
    try {
      window.localStorage.setItem('nameDisp', String(nextVisibility))
    } catch (error) {
      console.error('Could not save the color-name preference.', error)
    }
  }

  function updateRatio(setter: (value: number) => void, value: number) {
    setter(Math.max(0, Math.min(20, value)))
  }

  function chooseMixedColors(first: PaintColor, second: PaintColor) {
    setColors([first, second])
    setColorRatio(10)
    setShowMixedColors(false)
  }

  const mixedColorPairs = useMemo(() => {
    if (!mixbox) {
      return []
    }

    const pairs: Array<{ first: PaintColor; second: PaintColor; color: string }> = []
    for (let firstIndex = 0; firstIndex < MIXABLE_PIGMENTS.length; firstIndex += 1) {
      for (let secondIndex = firstIndex + 1; secondIndex < MIXABLE_PIGMENTS.length; secondIndex += 1) {
        const first = MIXABLE_PIGMENTS[firstIndex]
        const second = MIXABLE_PIGMENTS[secondIndex]
        pairs.push({ first, second, color: mixbox.lerp(first.hex, second.hex, 0.5) })
      }
    }
    for (const pigment of MIXABLE_PIGMENTS) {
      pairs.push({ first: pigment, second: TITANIUM_WHITE, color: mixbox.lerp(pigment.hex, TITANIUM_WHITE.hex, 0.5) })
    }
    return pairs
  }, [mixbox])

  return (
    <main className="paint-mix">
      <header className="paint-mix__header">
        <h1 className="paint-mix__title">
          <span className="paint-mix__title-p">P</span>aint
          <span className="paint-mix__title-m">M</span>ix
          <span aria-hidden="true"> 🎨</span>
        </h1>
        <button
          aria-expanded={showOptions}
          aria-label={t.options}
          className="paint-mix__menu-button"
          onClick={() => setShowOptions((open) => !open)}
          type="button"
        >
          ☰
        </button>
      </header>

      {showOptions && (
        <section aria-label={t.options} className="paint-mix__options">
          <h2>{t.options}</h2>
          <button
            aria-pressed={gradient}
            className={gradient ? 'paint-mix__option is-active' : 'paint-mix__option'}
            onClick={() => setGradient((enabled) => !enabled)}
            type="button"
          >
            {t.gradient}
          </button>
          <button
            aria-pressed={showNames}
            className={showNames ? 'paint-mix__option is-active' : 'paint-mix__option'}
            onClick={toggleNames}
            type="button"
          >
            {t.colorNames}
          </button>
          <div className="paint-mix__languages">
            <button aria-pressed={language === 'en'} onClick={() => changeLanguage('en')} type="button">
              English
            </button>
            <button aria-pressed={language === 'ja'} onClick={() => changeLanguage('ja')} type="button">
              日本語
            </button>
          </div>
        </section>
      )}

      <section aria-label={t.title} className="paint-mix__panel">
        <div className="paint-mix__color-row">
          {colors.map((color, index) => (
            <div className="paint-mix__color-column" key={index}>
              <span className="paint-mix__label">{t.color(index)}</span>
              <button
                aria-label={`${t.chooseColor(index)}: ${getColorName(color, language)}`}
                className="paint-mix__color-swatch"
                onClick={() => setPaletteTarget(index as PaletteTarget)}
                style={{ backgroundColor: color.hex, color: getTextColor(color.hex) }}
                type="button"
              >
                {showNames ? getColorName(color, language) : ''}
              </button>
            </div>
          ))}
        </div>

        <RatioControl
          label={t.mixRatio}
          onChange={(value) => updateRatio(setColorRatio, value)}
          value={colorRatio}
        />

        <button
          aria-label={t.mixedColor}
          className="paint-mix__result"
          disabled={!mix}
          onClick={() => setShowMixedColors(true)}
          style={{ background: mix ? (gradient ? mix.baseGradient : mix.base) : '#ddd' }}
          type="button"
        >
          {mix && `# ${getColorName(colors[0], language)} + ${getColorName(colors[1], language)}`}
        </button>

        <RatioControl
          label={t.mixWithWhite}
          onChange={(value) => updateRatio(setWhiteRatio, value)}
          value={whiteRatio}
        />

        <div
          aria-label={t.mixWithWhite}
          className="paint-mix__result paint-mix__result--white"
          style={{ background: mix ? (gradient ? mix.whiteGradient : mix.withWhite) : '#ddd' }}
        />

        {!mix && !loadError && <p className="paint-mix__status">{t.loading}</p>}
        {loadError && (
          <div className="paint-mix__error" role="alert">
            <p>{t.loadError}</p>
            <small>{loadError}</small>
            <button
              onClick={() => {
                setLoadError(null)
                void loadMixbox().then(
                  setMixbox,
                  (error: unknown) =>
                    setLoadError(error instanceof Error ? error.message : String(error)),
                )
              }}
              type="button"
            >
              {t.retry}
            </button>
          </div>
        )}
      </section>

      <footer className="paint-mix__footer">
        <p>{t.license}</p>
        <a href="https://scrtwpns.com/mixbox/" rel="noreferrer" target="_blank">
          Mixbox
        </a>
      </footer>

      {paletteTarget !== null && (
        <ColorPaletteDialog
          colors={PAINT_COLORS}
          language={language}
          onClose={() => setPaletteTarget(null)}
          onSelect={(color) => {
            setColors((current) => {
              const next: [PaintColor, PaintColor] = [...current]
              next[paletteTarget] = color
              return next
            })
            setPaletteTarget(null)
          }}
          paletteName={t.palette(paletteTarget)}
          selectedColor={colors[paletteTarget]}
        />
      )}

      {showMixedColors && (
        <div className="paint-mix__backdrop" onClick={() => setShowMixedColors(false)}>
          <section
            aria-label={t.mixedColor}
            aria-modal="true"
            className="paint-mix__dialog paint-mix__dialog--mixed"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <div className="paint-mix__dialog-header">
              <h2>{t.mixedColor}</h2>
              <button aria-label={t.close} onClick={() => setShowMixedColors(false)} type="button">
                ×
              </button>
            </div>
            <div className="paint-mix__mixed-grid">
              {mixedColorPairs.map(({ first, second, color }, index) => (
                <button
                  aria-label={`${getColorName(first, language)} + ${getColorName(second, language)}`}
                  className="paint-mix__mixed-swatch"
                  key={`${first.id}-${second.id}`}
                  onClick={() => chooseMixedColors(first, second)}
                  style={{ backgroundColor: color }}
                  title={`${getColorName(first, language)} + ${getColorName(second, language)}`}
                  type="button"
                >
                  <span>{index + 1}</span>
                </button>
              ))}
            </div>
          </section>
        </div>
      )}
    </main>
  )
}

interface RatioControlProps {
  label: string
  value: number
  onChange: (value: number) => void
}

function RatioControl({ label, onChange, value }: RatioControlProps) {
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

function ColorPaletteDialog({
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

export default TwoColorMixerPage
