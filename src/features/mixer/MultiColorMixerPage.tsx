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
import { getColorName, getTextColor, type Language } from './mixerUtils'
import { useMixerPreferences } from './useMixerPreferences'
import { useMixerGuide } from './useMixerGuide'
import './MultiColorMixerPage.css'

interface Messages {
  title: string
  options: string
  color: (index: number) => string
  chooseColor: (index: number) => string
  ratio: (index: number) => string
  fifthRatio: string
  breakDown: string
  colorNames: string
  palette: (index: number) => string
  close: string
  loading: string
  loadError: string
  retry: string
  back: string
  licenseTitle: string
  licenseDescription: string
  licenseCopyright: string
  licenseTerms: string
}

const messages: Record<Language, Messages> = {
  en: {
    title: 'PaintMix',
    options: 'Options',
    color: (index: number) => `Color ${index + 1}`,
    chooseColor: (index: number) => `Select Color ${index + 1}`,
    ratio: (index: number) => `Color ${index + 1} ratio`,
    fifthRatio: 'Fifth color ratio',
    breakDown: 'Break Down',
    colorNames: 'Color Names',
    palette: (index: number) => `Palette ${index + 1}`,
    close: 'Close',
    loading: 'Loading color-mixing engine…',
    loadError: 'The color-mixing engine could not be loaded. Check your connection and retry.',
    retry: 'Retry',
    back: 'Back to two-color mixer',
    licenseTitle: 'License',
    licenseDescription: 'This app uses the method provided on the Mixbox website to reproduce in RGB the colors created by mixing real paints.',
    licenseCopyright: 'Copyright (c) 2022, Secret Weapons. All rights reserved.',
    licenseTerms: 'Mixbox is provided under the CC BY-NC 4.0 license for non-commercial use only.',
  },
  ja: {
    title: 'PaintMix',
    options: 'オプション',
    color: (index: number) => `色${index + 1}`,
    chooseColor: (index: number) => `色${index + 1}を選択`,
    ratio: (index: number) => `色${index + 1}の混合比`,
    fifthRatio: '5色目の混合比',
    breakDown: '分解表示',
    colorNames: '色名',
    palette: (index: number) => `パレット${index + 1}`,
    close: '閉じる',
    loading: '混色エンジンを読み込んでいます…',
    loadError: '混色エンジンを読み込めませんでした。接続を確認して再試行してください。',
    retry: '再試行',
    back: '2色混色に戻る',
    licenseTitle: 'ライセンス',
    licenseDescription: '本アプリはMixboxサイトが提供する、絵具を混ぜてできる色をRGBで再現する方法を使用しています。',
    licenseCopyright: 'Copyright (c) 2022, Secret Weapons. All rights reserved.',
    licenseTerms: 'MixboxはCC BY-NC 4.0ライセンスにより非営利目的のみで提供されています。',
  },
}

function MultiColorMixerPage() {
  const { language, showNames, changeLanguage, toggleNames } = useMixerPreferences()
  const [colors, setColors] = useState<[PaintColor, PaintColor, PaintColor, PaintColor, PaintColor]>(
    MULTI_COLOR_DEFAULTS,
  )
  const [ratios, setRatios] = useState<MultiColorRatios>([10, 10, 10, 10, 10])
  const [breakDown, setBreakDown] = useState(false)
  const [paletteTarget, setPaletteTarget] = useState<number | null>(null)
  const [mixbox, setMixbox] = useState<MixboxApi | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const { visibleStep, markColorsTouched, markRatiosTouched, dismissCurrentStep } =
    useMixerGuide({ hasResultStep: false })
  const t = messages[language]

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

  const colorSlots = colors.slice(0, 4)

  return (
    <main className="paint-mix paint-mix--multi">
      <header className="paint-mix__header">
        <a aria-label={t.back} className="paint-mix__back-link" href="/">
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
          modeLabel={t.breakDown}
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
                label={t.ratio(index)}
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
            <BreakdownDisplay colors={colorSlots} ratios={ratios} />
          ) : (
            <>
              {colorSlots.map((color, index) => (
                <span className="multi-mix__equation-part" key={color.id}>
                  <span
                    aria-label={getColorName(color, language)}
                    className="multi-mix__source-dot"
                    style={{
                      backgroundColor: color.hex,
                      width: getSourceDotSize(ratios[index]),
                      height: getSourceDotSize(ratios[index]),
                    }}
                  />
                  {index < colorSlots.length - 1 && <span aria-hidden="true">+</span>}
                </span>
              ))}
              {mix && mix.baseTotal > 0 && <span aria-hidden="true">=</span>}
              <span
                aria-label={language === 'ja' ? '4色の混色結果' : 'Four-color mix result'}
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
              label={t.fifthRatio}
              onChange={(value) => {
                markRatiosTouched()
                updateRatio(4, value)
              }}
              value={ratios[4]}
            />
          </div>
          <span aria-hidden="true" className="multi-mix__operator">=</span>
          <div
            aria-label={language === 'ja' ? '5色の最終結果' : 'Final five-color result'}
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
          {t.back}
        </a>
      </section>

      {paletteTarget !== null && (
        <ColorPaletteDialog
          colors={PAINT_COLORS}
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
        />
      )}
    </main>
  )
}

interface BreakdownDisplayProps {
  colors: PaintColor[]
  ratios: MultiColorRatios
}

function BreakdownDisplay({ colors, ratios }: BreakdownDisplayProps) {
  const units = colors.flatMap((color, index) =>
    Array.from({ length: ratios[index] }, (_, unitIndex) => ({
      id: `${color.id}-${unitIndex}`,
      hex: color.hex,
    })),
  )

  return (
    <div aria-label="Paint ratio breakdown" className="multi-mix__breakdown">
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
