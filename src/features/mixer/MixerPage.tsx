import { useEffect, useMemo, useState, type KeyboardEvent } from 'react'
import {
  DEFAULT_COLORS,
  FOUR_COLOR_DEFAULTS,
  PAINT_COLORS,
  TITANIUM_WHITE,
  type PaintColor,
} from '../../domain/colors'
import { loadMixbox, type MixboxApi } from '../../domain/mixbox'
import {
  calculateMix,
  createMixTrack,
  createRecipe,
  RATIO_STEPS,
  toPercent,
} from '../../domain/mixing'
import { PaintPicker } from './PaintPicker'
import { PremixDialog } from './PremixDialog'
import { ResultPanel } from './ResultPanel'
import { StepSlider } from './StepSlider'
import { getColorName, getTextColor, sortColorsByHue } from './mixerUtils'
import { useMixerPreferences } from './useMixerPreferences'
import { SiteLogo } from '../layout/SiteLogo'
import { SiteMenu } from '../layout/SiteMenu'
import { SiteNav } from '../layout/SiteNav'
import { messages } from '../../i18n/messages'
import '../layout/site.css'
import './MixerPage.css'

type MixerMode = 'two' | 'four'

const MODES: MixerMode[] = ['two', 'four']
const CUSTOM_COLOR_STORAGE_KEY = 'twoColorCustomColor'
const EMPTY_TRACK = '#e3e3e0'
const SORTED_PAINTS = sortColorsByHue(PAINT_COLORS)

function readMode(): MixerMode {
  return window.location.pathname.replace(/\/+$/, '').endsWith('/more') ? 'four' : 'two'
}

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

function replaceAt<T>(items: T[], index: number, item: T): T[] {
  const next = [...items]
  next[index] = item
  return next
}

export function MixerPage() {
  const { language, changeLanguage } = useMixerPreferences()
  const [mode, setMode] = useState<MixerMode>(readMode)
  const [twoColors, setTwoColors] = useState<PaintColor[]>(DEFAULT_COLORS)
  const [twoRatio, setTwoRatio] = useState(10)
  const [twoWhite, setTwoWhite] = useState(10)
  const [fourColors, setFourColors] = useState<PaintColor[]>(FOUR_COLOR_DEFAULTS)
  const [fourWeights, setFourWeights] = useState([5, 5, 5, 5])
  const [fourWhite, setFourWhite] = useState(10)
  const [customColorHex, setCustomColorHex] = useState(readCustomColorHex)
  const [pickerSlot, setPickerSlot] = useState<number | null>(null)
  const [showPremix, setShowPremix] = useState(false)
  const [mixbox, setMixbox] = useState<MixboxApi | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const t = messages[language]

  const isTwo = mode === 'two'
  const colors = isTwo ? twoColors : fourColors
  const whiteRatio = isTwo ? twoWhite : fourWhite
  const setWhiteRatio = isTwo ? setTwoWhite : setFourWhite
  const weights = useMemo(
    () => (isTwo ? [RATIO_STEPS - twoRatio, twoRatio] : fourWeights),
    [isTwo, twoRatio, fourWeights],
  )

  const mix = useMemo(
    () =>
      mixbox
        ? calculateMix(
            mixbox,
            colors.map((color) => color.hex),
            weights,
            TITANIUM_WHITE.hex,
            whiteRatio,
          )
        : null,
    [mixbox, colors, weights, whiteRatio],
  )
  const recipe = createRecipe(weights, whiteRatio)
  const weightTotal = fourWeights.reduce((sum, weight) => sum + weight, 0)

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

  useEffect(() => {
    function handlePopState() {
      setMode(readMode())
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  function changeMode(nextMode: MixerMode) {
    if (nextMode === mode) {
      return
    }
    setMode(nextMode)
    window.history.pushState(null, '', nextMode === 'four' ? '/more' : '/')
  }

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
      return
    }
    event.preventDefault()
    const nextMode = MODES[(MODES.indexOf(mode) + 1) % MODES.length]
    changeMode(nextMode)
    document.getElementById(`mixer-tab-${nextMode}`)?.focus()
  }

  function updateCustomColorHex(hex: string) {
    setCustomColorHex(hex)
    try {
      window.localStorage.setItem(CUSTOM_COLOR_STORAGE_KEY, hex)
    } catch (error) {
      console.error('Could not save the custom color.', error)
    }
  }

  function selectPaint(slot: number, color: PaintColor) {
    if (isTwo) {
      setTwoColors((current) => replaceAt(current, slot, color))
    } else {
      setFourColors((current) => replaceAt(current, slot, color))
    }
    setPickerSlot(null)
  }

  function retryLoad() {
    setLoadError(null)
    void loadMixbox().then(setMixbox, (error: unknown) =>
      setLoadError(error instanceof Error ? error.message : String(error)),
    )
  }

  return (
    <div className="site mixer">
      <header className="mixer__header">
        <SiteLogo heading />
        <div aria-label={t.modes} className="mixer__tabs" role="tablist">
          {MODES.map((tabMode) => (
            <button
              aria-controls="mixer-panel"
              aria-selected={mode === tabMode}
              className="mixer__tab"
              id={`mixer-tab-${tabMode}`}
              key={tabMode}
              onClick={() => changeMode(tabMode)}
              onKeyDown={handleTabKeyDown}
              role="tab"
              tabIndex={mode === tabMode ? 0 : -1}
              type="button"
            >
              {tabMode === 'two' ? t.twoColorMode : t.fourColorMode}
            </button>
          ))}
        </div>
        <SiteNav className="mixer__nav" language={language} />
        <SiteMenu language={language} onLanguageChange={changeLanguage} />
      </header>

      <main className="mixer__layout">
        <div className="mixer__result">
          <ResultPanel
            language={language}
            mix={mix}
            onOpenPremix={isTwo ? () => setShowPremix(true) : undefined}
            recipe={recipe}
            whiteRatio={whiteRatio}
          />
        </div>

        <div
          aria-labelledby={`mixer-tab-${mode}`}
          className="mixer__controls"
          id="mixer-panel"
          role="tabpanel"
        >
          {isTwo ? (
            <section className="mixer-card">
              <div className="paint-pair">
                {twoColors.map((color, index) => (
                  <button
                    aria-label={`${t.chooseColor(index)}: ${getColorName(color, language)}`}
                    className="paint-pair__button"
                    key={index}
                    onClick={() => setPickerSlot(index)}
                    style={{ backgroundColor: color.hex, color: getTextColor(color.hex) }}
                    type="button"
                  >
                    <span className="paint-pair__caption">
                      {t.color(index)} · {t.change} ▾
                    </span>
                    <span className="paint-pair__name">{getColorName(color, language)}</span>
                  </button>
                ))}
              </div>
              <div className="mixer-card__heading">
                <h2>{t.mixRatio}</h2>
                <span className="mixer-card__value">
                  {100 - toPercent(twoRatio)} : {toPercent(twoRatio)}
                </span>
              </div>
              <StepSlider
                label={t.mixRatio}
                onChange={setTwoRatio}
                thumbColor={mix?.base}
                trackBackground={
                  mixbox
                    ? createMixTrack(mixbox, twoColors[0].hex, twoColors[1].hex)
                    : EMPTY_TRACK
                }
                value={twoRatio}
                valueText={t.ratioValueText(100 - toPercent(twoRatio), toPercent(twoRatio))}
              />
            </section>
          ) : (
            <section className="mixer-card">
              <div className="distribution">
                <h2>{t.distribution}</h2>
                <div aria-hidden="true" className="distribution__bar">
                  {fourColors.map((color, index) => (
                    <span
                      key={index}
                      style={{ backgroundColor: color.hex, flexGrow: fourWeights[index] || 0.001 }}
                    />
                  ))}
                </div>
              </div>
              {fourColors.map((color, index) => {
                const share =
                  weightTotal === 0 ? 0 : Math.round((fourWeights[index] / weightTotal) * 100)
                const position = toPercent(fourWeights[index])
                return (
                  <div className="paint-row" key={index}>
                    <div className="paint-row__header">
                      <button
                        aria-label={`${t.chooseColor(index)}: ${getColorName(color, language)}`}
                        className="paint-row__paint"
                        onClick={() => setPickerSlot(index)}
                        type="button"
                      >
                        <span className="paint-row__dot" style={{ backgroundColor: color.hex }} />
                        <span className="paint-row__name">{getColorName(color, language)}</span>
                        <span className="paint-row__change">{t.change} ▾</span>
                      </button>
                      <span className="mixer-card__value">{share}%</span>
                    </div>
                    <StepSlider
                      label={t.amountOf(t.color(index))}
                      onChange={(value) =>
                        setFourWeights((current) => replaceAt(current, index, value))
                      }
                      thin
                      trackBackground={`linear-gradient(to right, ${color.hex} ${position}%, ${EMPTY_TRACK} ${position}%)`}
                      value={fourWeights[index]}
                      valueText={`${share}%`}
                    />
                  </div>
                )
              })}
            </section>
          )}

          <section className="mixer-card">
            <div className="mixer-card__heading">
              <h2>
                {t.mixWithWhite}{' '}
                <span className="mixer-card__note">{getColorName(TITANIUM_WHITE, language)}</span>
              </h2>
              <span className="mixer-card__value">{toPercent(whiteRatio)}%</span>
            </div>
            <StepSlider
              label={t.mixWithWhite}
              onChange={setWhiteRatio}
              thumbColor={mix?.final}
              trackBackground={
                mixbox && mix ? createMixTrack(mixbox, mix.base, TITANIUM_WHITE.hex) : EMPTY_TRACK
              }
              value={whiteRatio}
              valueText={`${toPercent(whiteRatio)}%`}
            />
          </section>

          {loadError && (
            <div className="mixer__error" role="alert">
              <p>{t.loadError}</p>
              <small>{loadError}</small>
              <button onClick={retryLoad} type="button">
                {t.retry}
              </button>
            </div>
          )}
        </div>
      </main>

      <footer className="mixer__footer">
        <SiteNav language={language} />
      </footer>

      {pickerSlot !== null && (
        <PaintPicker
          colors={SORTED_PAINTS}
          customColorHex={customColorHex}
          language={language}
          onClose={() => setPickerSlot(null)}
          onCustomColorHexChange={updateCustomColorHex}
          onSelect={(color) => selectPaint(pickerSlot, color)}
          selectedColor={colors[pickerSlot]}
        />
      )}

      {showPremix && mixbox && (
        <PremixDialog
          language={language}
          mixbox={mixbox}
          onClose={() => setShowPremix(false)}
          onSelect={(first, second) => {
            setTwoColors([first, second])
            setTwoRatio(10)
            setShowPremix(false)
          }}
        />
      )}
    </div>
  )
}

export default MixerPage
