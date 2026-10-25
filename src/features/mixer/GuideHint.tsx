import type { MixerGuideStep } from './useMixerGuide'
import { messages } from '../../i18n/messages'

interface GuideHintProps {
  step: MixerGuideStep | null
  language: 'en' | 'ja'
  onDismiss: () => void
}

export function GuideHint({ language, onDismiss, step }: GuideHintProps) {
  if (!step) {
    return null
  }

  const message = messages[language]
  const text =
    step === 'colors'
      ? message.guideColors
      : step === 'ratio'
        ? message.guideRatio
        : message.guideResult
  return (
    <aside aria-live="polite" className={`paint-mix__guide paint-mix__guide--${step}`}>
      <span aria-hidden="true" className="paint-mix__guide-icon">☝</span>
      <span>{text}</span>
      <button aria-label={message.dismissGuide} onClick={onDismiss} type="button">
        ×
      </button>
    </aside>
  )
}
