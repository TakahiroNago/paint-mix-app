export type Language = 'en' | 'ja'

interface SharedMessages {
  title: string
  options: string
  color: (index: number) => string
  chooseColor: (index: number) => string
  colorNames: string
  palette: (index: number) => string
  customColor: string
  close: string
  loading: string
  loadError: string
  retry: string
  licenseTitle: string
  licenseDescription: string
  licenseCopyright: string
  licenseTerms: string
  dismissGuide: string
  guideColors: string
  guideRatio: string
  guideResult: string
}

interface TwoColorMessages {
  mixRatio: string
  mixWithWhite: string
  mixedColor: string
  gradient: string
  moreColors: string
}

interface MultiColorMessages {
  ratio: (index: number) => string
  fifthRatio: string
  breakDown: string
  back: string
  fourColorResult: string
  finalResult: string
  breakdown: string
}

export interface AppMessages extends SharedMessages {
  twoColor: TwoColorMessages
  multiColor: MultiColorMessages
}

export const messages: Record<Language, AppMessages> = {
  en: {
    title: 'PaintMix',
    options: 'Options',
    color: (index) => `Color ${index + 1}`,
    chooseColor: (index) => `Select Color ${index + 1}`,
    colorNames: 'Color Names',
    palette: (index) => `Palette ${index + 1}`,
    customColor: 'Custom Color',
    close: 'Close',
    loading: 'Loading color-mixing engine…',
    loadError: 'The color-mixing engine could not be loaded. Check your connection and retry.',
    retry: 'Retry',
    licenseTitle: 'License',
    licenseDescription:
      'This app uses the method provided on the Mixbox website to reproduce in RGB the colors created by mixing real paints.',
    licenseCopyright: 'Copyright (c) 2022, Secret Weapons. All rights reserved.',
    licenseTerms:
      'Mixbox is provided under the CC BY-NC 4.0 license for non-commercial use only.',
    dismissGuide: 'Dismiss guide',
    guideColors: 'Choose a paint color to get started.',
    guideRatio: 'Adjust the mix ratio to change the result.',
    guideResult: 'Tap the mixed color to choose a premixed pair.',
    twoColor: {
      mixRatio: 'Mix Ratio',
      mixWithWhite: 'Mix with White',
      mixedColor: 'Select from Mixed Colors',
      gradient: 'Gradient',
      moreColors: 'Mix More Color',
    },
    multiColor: {
      ratio: (index) => `Color ${index + 1} ratio`,
      fifthRatio: 'Fifth color ratio',
      breakDown: 'Break Down',
      back: 'Back to two-color mixer',
      fourColorResult: 'Four-color mix result',
      finalResult: 'Final five-color result',
      breakdown: 'Paint ratio breakdown',
    },
  },
  ja: {
    title: 'PaintMix',
    options: 'オプション',
    color: (index) => `色${index + 1}`,
    chooseColor: (index) => `色${index + 1}を選択`,
    colorNames: '色名',
    palette: (index) => `パレット${index + 1}`,
    customColor: 'カスタムカラー',
    close: '閉じる',
    loading: '混色エンジンを読み込んでいます…',
    loadError: '混色エンジンを読み込めませんでした。接続を確認して再試行してください。',
    retry: '再試行',
    licenseTitle: 'ライセンス',
    licenseDescription:
      '本アプリはMixboxサイトが提供する、絵具を混ぜてできる色をRGBで再現する方法を使用しています。',
    licenseCopyright: 'Copyright (c) 2022, Secret Weapons. All rights reserved.',
    licenseTerms:
      'MixboxはCC BY-NC 4.0ライセンスにより非営利目的のみで提供されています。',
    dismissGuide: '案内を閉じる',
    guideColors: '色を選んで混色を始めましょう。',
    guideRatio: '混合比を調整して色の変化を試しましょう。',
    guideResult: '混色結果をタップすると、混色候補から選べます。',
    twoColor: {
      mixRatio: '混合比',
      mixWithWhite: '白を混ぜる',
      mixedColor: '混色から選択',
      gradient: 'グラデーション',
      moreColors: 'もっと色を混ぜる',
    },
    multiColor: {
      ratio: (index) => `色${index + 1}の混合比`,
      fifthRatio: '5色目の混合比',
      breakDown: '分解表示',
      back: '2色混色に戻る',
      fourColorResult: '4色の混色結果',
      finalResult: '5色の最終結果',
      breakdown: '混合比の分解表示',
    },
  },
}
