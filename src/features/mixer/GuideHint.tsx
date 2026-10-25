import type { MixerGuideStep } from './useMixerGuide'

interface GuideHintProps {
  step: MixerGuideStep | null
  language: 'en' | 'ja'
  onDismiss: () => void
}

const hintMessages = {
  en: {
    colors: 'Choose a paint color to get started.',
    ratio: 'Adjust the mix ratio to change the result.',
    result: 'Tap the mixed color to choose a premixed pair.',
    dismiss: 'Dismiss guide',
  },
  ja: {
    colors: '色を選んで混色を始めましょう。',
    ratio: '混合比を調整して色の変化を試しましょう。',
    result: '混色結果をタップすると、混色候補から選べます。',
    dismiss: '案内を閉じる',
  },
}

export function GuideHint({ language, onDismiss, step }: GuideHintProps) {
  if (!step) {
    return null
  }

  const message = hintMessages[language]
  return (
    <aside aria-live="polite" className={`paint-mix__guide paint-mix__guide--${step}`}>
      <span aria-hidden="true" className="paint-mix__guide-icon">☝</span>
      <span>{message[step]}</span>
      <button aria-label={message.dismiss} onClick={onDismiss} type="button">
        ×
      </button>
    </aside>
  )
}
