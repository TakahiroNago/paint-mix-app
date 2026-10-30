import { TITANIUM_WHITE } from '../../domain/colors'
import { toPercent, type MixResult, type Recipe } from '../../domain/mixing'
import { useCopyToClipboard } from '../layout/useCopyToClipboard'
import { getTextColor, type Language } from './mixerUtils'
import { messages } from '../../i18n/messages'

interface ResultPanelProps {
  mix: MixResult | null
  recipe: Recipe
  whiteRatio: number
  language: Language
  onOpenPremix?: () => void
}

export function ResultPanel({ language, mix, onOpenPremix, recipe, whiteRatio }: ResultPanelProps) {
  const { copied, copy } = useCopyToClipboard()
  const t = messages[language]
  const paints = recipe.parts.join(' : ')
  const recipeText = recipe.white > 0 ? t.recipeWithWhite(paints, recipe.white) : paints

  return (
    <section aria-label={t.result} className="result">
      <div
        className="result__panel"
        style={{
          backgroundColor: mix?.final ?? '#ddd',
          color: mix ? getTextColor(mix.final) : '#1d1d1f',
        }}
      >
        <div className="result__top">
          <h2>{t.result}</h2>
          {onOpenPremix && (
            <button
              className="result__pill result__pill--quiet"
              disabled={!mix}
              onClick={onOpenPremix}
              type="button"
            >
              {t.premixButton}
            </button>
          )}
        </div>
        <div className="result__bottom">
          <output className="result__hex">{mix?.final ?? t.loading}</output>
          <button
            className="result__pill"
            disabled={!mix}
            onClick={() => mix && void copy(mix.final)}
            type="button"
          >
            <span aria-live="polite">{copied ? t.copied : t.copyHex}</span>
          </button>
        </div>
      </div>
      <div className="result__summary">
        <span className="result__dot" style={{ backgroundColor: mix?.base ?? '#ddd' }} />
        <span>
          {t.beforeWhite} <span className="result__base-hex">{mix?.base}</span>
        </span>
        <span aria-hidden="true" className="result__arrow">
          →
        </span>
        <span className="result__dot" style={{ backgroundColor: TITANIUM_WHITE.hex }} />
        <span>
          {t.white} {toPercent(whiteRatio)}%
        </span>
        <span className="result__recipe">
          <span className="result__recipe-label">{t.recipe}</span>
          <strong>{recipeText}</strong>
        </span>
      </div>
    </section>
  )
}
