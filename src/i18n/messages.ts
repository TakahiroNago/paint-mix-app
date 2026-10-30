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
  copy: string
  copied: string
  copyColorCode: (label: string) => string
  loading: string
  loadError: string
  retry: string
  dismissGuide: string
  guideColors: string
  guideRatio: string
  guideResult: string
  contact: string
  contactTitle: string
  contactDescription: string
  email: string
  operator: string
  backToMixer: string
  privacyPolicy: string
  privacyTitle: string
  privacyIntro: string
  privacyLocalStorageTitle: string
  privacyLocalStorageDescription: string
  privacyContactTitle: string
  privacyContactDescription: string
  privacyDisclosureTitle: string
  privacyDisclosureDescription: string
  privacyChangesTitle: string
  privacyChangesDescription: string
  privacyMixboxTitle: string
  privacyMixboxDescription: string
  mixboxLicense: string
}

interface TwoColorMessages {
  mixRatio: string
  mixWithWhite: string
  mixedColor: string
  ratioValue: (first: number, second: number) => string
  whiteValue: (white: number) => string
  mixedResult: string
  whiteResult: string
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
    copy: 'Copy',
    copied: 'Copied',
    copyColorCode: (label) => `Copy color code of ${label}`,
    loading: 'Loading color-mixing engine…',
    loadError: 'The color-mixing engine could not be loaded. Check your connection and retry.',
    retry: 'Retry',
    dismissGuide: 'Dismiss guide',
    guideColors: 'Choose a paint color to get started.',
    guideRatio: 'Adjust the mix ratio to change the result.',
    guideResult: 'Tap the mixed color to choose a premixed pair.',
    contact: 'Contact',
    contactTitle: 'Contact Paint Mix',
    contactDescription:
      'For questions, bug reports, feedback, or requests about Paint Mix, please contact us at the address below.',
    email: 'Email',
    operator: 'Operator',
    backToMixer: 'Back to Paint Mix',
    privacyPolicy: 'Privacy Policy',
    privacyTitle: 'Privacy Policy',
    privacyIntro:
      'Art Full Stack respects your privacy. This policy explains how information is handled when you use Paint Mix.',
    privacyLocalStorageTitle: 'Information stored in your browser',
    privacyLocalStorageDescription:
      'Paint Mix stores your language, color-name display preference, guide progress, and custom color in your browser storage so your preferences work as expected. This information stays in your browser and is not sent to the operator by the app.',
    privacyContactTitle: 'Information sent by email',
    privacyContactDescription:
      'If you contact us by email, we use the information in your message to respond to your inquiry. Please avoid including sensitive personal information that is not needed for your inquiry.',
    privacyDisclosureTitle: 'Sharing information',
    privacyDisclosureDescription:
      'We do not sell or share information you provide by email with third parties, except when required by law.',
    privacyChangesTitle: 'Changes to this policy',
    privacyChangesDescription:
      'This policy may be updated when the service or applicable requirements change. The latest version will be published on this page.',
    privacyMixboxTitle: 'Mixbox license and attribution',
    privacyMixboxDescription:
      'Paint Mix uses the method provided by Mixbox to reproduce in RGB the colors created by mixing real paints. Mixbox is provided under the CC BY-NC 4.0 license for non-commercial use only. Copyright (c) 2022, Secret Weapons. All rights reserved.',
    mixboxLicense: 'CC BY-NC 4.0 license',
    twoColor: {
      mixRatio: 'Mix Ratio',
      mixWithWhite: 'Mix with White',
      mixedColor: 'Select from Mixed Colors',
      ratioValue: (first, second) => `Color 1 ${first}% : Color 2 ${second}%`,
      whiteValue: (white) => `White ${white}%`,
      mixedResult: 'Mixed color',
      whiteResult: 'Mixed with white',
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
    copy: 'コピー',
    copied: 'コピーしました',
    copyColorCode: (label) => `${label}のカラーコードをコピー`,
    loading: '混色エンジンを読み込んでいます…',
    loadError: '混色エンジンを読み込めませんでした。接続を確認して再試行してください。',
    retry: '再試行',
    dismissGuide: '案内を閉じる',
    guideColors: '色を選んで混色を始めましょう。',
    guideRatio: '混合比を調整して色の変化を試しましょう。',
    guideResult: '混色結果をタップすると、混色候補から選べます。',
    contact: 'お問い合わせ',
    contactTitle: 'お問い合わせについて',
    contactDescription:
      'Paint Mixに関するご質問、不具合の報告、ご意見・ご要望などがございましたら、以下の連絡先までご連絡ください。',
    email: 'Email',
    operator: '運営者',
    backToMixer: 'Paint Mixに戻る',
    privacyPolicy: 'プライバシーポリシー',
    privacyTitle: 'プライバシーポリシー',
    privacyIntro:
      'Art Full Stackは、利用者のプライバシーを尊重します。本ポリシーでは、Paint Mixにおける情報の取り扱いについて説明します。',
    privacyLocalStorageTitle: 'ブラウザーに保存する情報',
    privacyLocalStorageDescription:
      'Paint Mixは、言語、色名の表示設定、操作ガイドの進行状況、カスタムカラーをブラウザー内に保存し、設定を維持します。これらの情報はブラウザー内に保存され、本アプリから運営者へ送信されません。',
    privacyContactTitle: 'メールでお送りいただく情報',
    privacyContactDescription:
      'メールでお問い合わせいただいた場合、いただいた内容への回答のために情報を利用します。お問い合わせに不要な機微な個人情報は記載しないでください。',
    privacyDisclosureTitle: '情報の第三者提供',
    privacyDisclosureDescription:
      'メールでお送りいただいた情報を販売または第三者へ提供することはありません。ただし、法令に基づく場合を除きます。',
    privacyChangesTitle: '本ポリシーの変更',
    privacyChangesDescription:
      'サービス内容や適用される要件の変更に応じて、本ポリシーを更新することがあります。最新の内容は本ページに掲載します。',
    privacyMixboxTitle: 'Mixboxのライセンスと著作権表示',
    privacyMixboxDescription:
      'Paint Mixは、実際の絵具を混ぜてできる色をRGBで再現するため、Mixboxが提供する方法を使用しています。MixboxはCC BY-NC 4.0ライセンスに基づき、非営利目的に限り利用できます。Copyright (c) 2022, Secret Weapons. All rights reserved.',
    mixboxLicense: 'CC BY-NC 4.0ライセンス',
    twoColor: {
      mixRatio: '混合比',
      mixWithWhite: '白を混ぜる',
      mixedColor: '混色から選択',
      ratioValue: (first, second) => `色1 ${first}% : 色2 ${second}%`,
      whiteValue: (white) => `白 ${white}%`,
      mixedResult: '混色結果',
      whiteResult: '白を混ぜた色',
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
