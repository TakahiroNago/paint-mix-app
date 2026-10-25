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
import { ColorPaletteDialog, RatioControl } from './MixerControls'
import { MixerOptions } from './MixerOptions'
import { GuideHint } from './GuideHint'
import { getColorName, getTextColor } from './mixerUtils'
import { useMixerGuide } from './useMixerGuide'
import { useMixerPreferences } from './useMixerPreferences'
import { messages } from '../../i18n/messages'
import './TwoColorMixerPage.css'

type PaletteTarget = number

export function TwoColorMixerPage() {
  const { language, showNames, changeLanguage, toggleNames } = useMixerPreferences()
  const [colors, setColors] = useState<[PaintColor, PaintColor]>(DEFAULT_COLORS)
  const [colorRatio, setColorRatio] = useState(10)
  const [whiteRatio, setWhiteRatio] = useState(10)
  const [gradient, setGradient] = useState(false)
  const [mixbox, setMixbox] = useState<MixboxApi | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [paletteTarget, setPaletteTarget] = useState<PaletteTarget | null>(null)
  const [showMixedColors, setShowMixedColors] = useState(false)
  const {
    visibleStep,
    markColorsTouched,
    markRatiosTouched,
    markResultTouched,
    dismissCurrentStep,
  } = useMixerGuide({ hasResultStep: true })
  const t = messages[language]
  const twoColor = t.twoColor

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
          modeActive={gradient}
          modeLabel={twoColor.gradient}
          onLanguageChange={changeLanguage}
          onToggleMode={() => setGradient((enabled) => !enabled)}
          onToggleNames={toggleNames}
          optionsLabel={t.options}
          showNames={showNames}
        />
      </header>

      <section aria-label={t.title} className="paint-mix__panel">
        <div className="paint-mix__color-row">
          {colors.map((color, index) => (
            <div className="paint-mix__color-column" key={index}>
              <span className="paint-mix__label">{t.color(index)}</span>
              <button
                aria-label={`${t.chooseColor(index)}: ${getColorName(color, language)}`}
                className="paint-mix__color-swatch"
                onClick={() => {
                  markColorsTouched()
                  setPaletteTarget(index as PaletteTarget)
                }}
                style={{ backgroundColor: color.hex, color: getTextColor(color.hex) }}
                type="button"
              >
                {showNames ? getColorName(color, language) : ''}
              </button>
            </div>
          ))}
        </div>
        {visibleStep === 'colors' && (
          <GuideHint language={language} onDismiss={dismissCurrentStep} step={visibleStep} />
        )}

        <RatioControl
          label={twoColor.mixRatio}
          onChange={(value) => {
            markRatiosTouched()
            updateRatio(setColorRatio, value)
          }}
          value={colorRatio}
        />
        {visibleStep === 'ratio' && (
          <GuideHint language={language} onDismiss={dismissCurrentStep} step={visibleStep} />
        )}

        <button
          aria-label={twoColor.mixedColor}
          className="paint-mix__result"
          disabled={!mix}
          onClick={() => {
            markResultTouched()
            setShowMixedColors(true)
          }}
          style={{ background: mix ? (gradient ? mix.baseGradient : mix.base) : '#ddd' }}
          type="button"
        >
          {mix && `# ${getColorName(colors[0], language)} + ${getColorName(colors[1], language)}`}
        </button>
        {visibleStep === 'result' && (
          <GuideHint language={language} onDismiss={dismissCurrentStep} step={visibleStep} />
        )}

        <RatioControl
          label={twoColor.mixWithWhite}
          onChange={(value) => updateRatio(setWhiteRatio, value)}
          value={whiteRatio}
        />

        <div
          aria-label={twoColor.mixWithWhite}
          className="paint-mix__result paint-mix__result--white"
          style={{ background: mix ? (gradient ? mix.whiteGradient : mix.withWhite) : '#ddd' }}
        />

        <a className="paint-mix__more-link" href="/more">
          {twoColor.moreColors}
        </a>

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
            aria-label={twoColor.mixedColor}
            aria-modal="true"
            className="paint-mix__dialog paint-mix__dialog--mixed"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <div className="paint-mix__dialog-header">
              <h2>{twoColor.mixedColor}</h2>
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

export default TwoColorMixerPage
