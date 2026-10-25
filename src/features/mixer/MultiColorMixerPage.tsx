import { useEffect, useMemo, useState } from 'react'
import {
  MULTI_COLOR_DEFAULTS,
  PAINT_COLORS,
  type PaintColor,
} from '../../domain/colors'
import { loadMixbox, type MixboxApi } from '../../domain/mixbox'
import {
  calculateMultiColorMix,
  type MultiColorRatios,
} from '../../domain/mixing'
import { ColorPaletteDialog, RatioControl } from './MixerControls'
import { MixerOptions } from './MixerOptions'
import { GuideHint } from './GuideHint'
import { getColorName, getTextColor, sortColorsByHue, type Language } from './mixerUtils'
import { useMixerPreferences } from './useMixerPreferences'
import { useMixerGuide } from './useMixerGuide'
import { messages } from '../../i18n/messages'
import './MultiColorMixerPage.css'

const CUSTOM_COLOR_STORAGE_KEY = 'twoColorCustomColor'

function readCustomColorHex(): string {
  try {
    const savedColor = window.localStorage.getItem(CUSTOM_COLOR_STORAGE_KEY)
    if (savedColor && /^#[\da-f]{6}$/i.test(savedColor)) {
      return savedColor
    }
  } catch (error) {
    console.warn('Could not read the saved custom color.', error)
  }

  return '#eeeeee'
}

function MultiColorMixerPage() {
  const { language, showNames, changeLanguage, toggleNames } = useMixerPreferences()
  const [colors, setColors] = useState<[PaintColor, PaintColor, PaintColor, PaintColor, PaintColor]>(
    MULTI_COLOR_DEFAULTS,
  )
  const [ratios, setRatios] = useState<MultiColorRatios>([10, 10, 10, 10, 10])
  const [customColorHex, setCustomColorHex] = useState(readCustomColorHex)
  const [breakDown, setBreakDown] = useState(false)
  const [paletteTarget, setPaletteTarget] = useState<number | null>(null)
  const [mixbox, setMixbox] = useState<MixboxApi | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const { visibleStep, markColorsTouched, markRatiosTouched, dismissCurrentStep } =
    useMixerGuide({ hasResultStep: false })
  const t = messages[language]
  const multiColor = t.multiColor

  const mix = useMemo(
    () =>
      mixbox
        ? calculateMultiColorMix(
            mixbox,
            [colors[0].hex, colors[1].hex, colors[2].hex, colors[3].hex, colors[4].hex],
            ratios,
          )
        : null,
    [mixbox, colors, ratios],
  )

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

  function updateRatio(index: number, value: number) {
    const nextValue = Math.max(0, Math.min(20, value))
    setRatios((current) => {
      const next: MultiColorRatios = [...current]
      next[index] = nextValue
      return next
    })
  }

  function updateCustomColorHex(hex: string) {
    setCustomColorHex(hex)
    try {
      window.localStorage.setItem(CUSTOM_COLOR_STORAGE_KEY, hex)
    } catch (error) {
      console.error('Could not save the custom color.', error)
    }
  }

  const colorSlots = colors.slice(0, 4)
  const activeColorSlots = colorSlots
    .map((color, index) => ({ color, index }))
    .filter(({ index }) => ratios[index] > 0)

  return (
    <main className="paint-mix paint-mix--multi">
      <header className="paint-mix__header">
        <a aria-label={multiColor.back} className="paint-mix__back-link" href="/">
          ←
        </a>
        <h1 className="paint-mix__title">
          <span className="paint-mix__title-p">P</span>aint
          <span className="paint-mix__title-m">M</span>ix
          <span aria-hidden="true"> 🎨</span>
        </h1>
        <MixerOptions
          colorNamesLabel={t.colorNames}
          language={language}
          license={{
            title: t.licenseTitle,
            description: t.licenseDescription,
            copyright: t.licenseCopyright,
            terms: t.licenseTerms,
            close: t.close,
          }}
          modeActive={breakDown}
          modeLabel={multiColor.breakDown}
          onLanguageChange={changeLanguage}
          onToggleMode={() => setBreakDown((enabled) => !enabled)}
          onToggleNames={toggleNames}
          optionsLabel={t.options}
          showNames={showNames}
        />
      </header>

      <section aria-label={t.title} className="paint-mix__panel">
        <div className="multi-mix__color-grid">
          {colorSlots.map((color, index) => (
            <div className="multi-mix__color-slot" key={index}>
              <span className="paint-mix__label">{t.color(index)}</span>
              <button
                aria-label={`${t.chooseColor(index)}: ${getColorName(color, language)}`}
                className="paint-mix__color-swatch"
                onClick={() => {
                  markColorsTouched()
                  setPaletteTarget(index)
                }}
                style={{ backgroundColor: color.hex, color: getTextColor(color.hex) }}
                type="button"
              >
                {showNames ? getColorName(color, language) : ''}
              </button>
              <RatioControl
                label={multiColor.ratio(index)}
                onChange={(value) => {
                  markRatiosTouched()
                  updateRatio(index, value)
                }}
                value={ratios[index]}
              />
            </div>
          ))}
        </div>
        {visibleStep === 'colors' && (
          <GuideHint language={language} onDismiss={dismissCurrentStep} step={visibleStep} />
        )}
        {visibleStep === 'ratio' && (
          <GuideHint language={language} onDismiss={dismissCurrentStep} step={visibleStep} />
        )}

        <div aria-label={t.title} className="multi-mix__equation">
          {breakDown ? (
            <BreakdownDisplay colors={colorSlots} language={language} ratios={ratios} />
          ) : (
            <>
              {activeColorSlots.map(({ color, index }, visibleIndex) => (
                <span className="multi-mix__equation-part" key={color.id}>
                  {visibleIndex > 0 && (
                    <span aria-hidden="true" className="multi-mix__equation-plus">
                      +
                    </span>
                  )}
                  <span
                    aria-label={getColorName(color, language)}
                    className="multi-mix__source-dot"
                    style={{
                      backgroundColor: color.hex,
                      width: getSourceDotSize(ratios[index]),
                      height: getSourceDotSize(ratios[index]),
                    }}
                  />
                  </span>
              ))}
              {mix && mix.baseTotal > 0 && <span aria-hidden="true">=</span>}
              <span
                aria-label={multiColor.fourColorResult}
                className="multi-mix__base-result"
                style={{ backgroundColor: mix?.base ?? '#ddd' }}
              />
            </>
          )}
        </div>

        <div className="multi-mix__fifth-row">
          <span aria-hidden="true" className="multi-mix__operator">+</span>
          <div className="multi-mix__fifth-color">
            <span className="paint-mix__label">{t.color(4)}</span>
            <button
              aria-label={`${t.chooseColor(4)}: ${getColorName(colors[4], language)}`}
              className="paint-mix__color-swatch"
              onClick={() => {
                markColorsTouched()
                setPaletteTarget(4)
              }}
              style={{ backgroundColor: colors[4].hex, color: getTextColor(colors[4].hex) }}
              type="button"
            >
              {showNames ? getColorName(colors[4], language) : ''}
            </button>
            <RatioControl
              label={multiColor.fifthRatio}
              onChange={(value) => {
                markRatiosTouched()
                updateRatio(4, value)
              }}
              value={ratios[4]}
            />
          </div>
          <span aria-hidden="true" className="multi-mix__operator">=</span>
          <div
            aria-label={multiColor.finalResult}
            className="multi-mix__final-result"
            style={{ backgroundColor: mix?.withFifthColor ?? '#ddd' }}
          />
        </div>

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

        <a className="paint-mix__more-link" href="/">
          {multiColor.back}
        </a>
      </section>

      <footer className="paint-mix__footer">
        <a href="/contact">{t.contact}</a>
      </footer>

      {paletteTarget !== null && (
        <ColorPaletteDialog
          colors={sortColorsByHue(PAINT_COLORS)}
          language={language}
          onClose={() => setPaletteTarget(null)}
          onSelect={(color) => {
            setColors((current) => {
              const next: [PaintColor, PaintColor, PaintColor, PaintColor, PaintColor] = [...current]
              next[paletteTarget] = color
              return next
            })
            setPaletteTarget(null)
          }}
          paletteName={t.palette(paletteTarget)}
          selectedColor={colors[paletteTarget]}
          customColorHex={customColorHex}
          onCustomColorHexChange={updateCustomColorHex}
          previewCustomColor
          showCustomColorLabel={false}
        />
      )}
    </main>
  )
}

interface BreakdownDisplayProps {
  colors: PaintColor[]
  language: Language
  ratios: MultiColorRatios
}

function BreakdownDisplay({ colors, language, ratios }: BreakdownDisplayProps) {
  const units = colors.flatMap((color, index) =>
    Array.from({ length: ratios[index] }, (_, unitIndex) => ({
      id: `${color.id}-${unitIndex}`,
      hex: color.hex,
    })),
  )

  return (
    <div
      aria-label={messages[language].multiColor.breakdown}
      className="multi-mix__breakdown"
    >
      {units.map((unit) => (
        <span className="multi-mix__breakdown-unit" key={unit.id} style={{ backgroundColor: unit.hex }} />
      ))}
    </div>
  )
}

function getSourceDotSize(ratio: number): number {
  return Math.floor(Math.sqrt(62.5 * ratio))
}

export default MultiColorMixerPage
