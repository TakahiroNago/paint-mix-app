export type Language = 'en' | 'ja'

export interface AppMessages {
  title: string
  options: string
  language: string
  modes: string
  twoColorMode: string
  fourColorMode: string
  color: (index: number) => string
  change: string
  chooseColor: (index: number) => string
  amountOf: (name: string) => string
  choosePaint: string
  customColor: string
  useCustomColor: string
  close: string
  result: string
  copyHex: string
  copied: string
  mixRatio: string
  ratioValueText: (first: number, second: number) => string
  distribution: string
  mixWithWhite: string
  beforeWhite: string
  white: string
  recipe: string
  recipeWithWhite: (paints: string, white: number) => string
  premixButton: string
  premixTitle: string
  loading: string
  loadError: string
  retry: string
  contact: string
  contactTitle: string
  contactDescription: string
  email: string
  sendEmail: string
  copyAddress: string
  operator: string
  backToMixer: string
  privacyPolicy: string
  privacyTitle: string
  privacyIntro: string
  tableOfContents: string
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

export const messages: Record<Language, AppMessages> = {
  en: {
    title: 'PaintMix',
    options: 'Options',
    language: 'Language',
    modes: 'Mixing mode',
    twoColorMode: 'Mix 2 colors',
    fourColorMode: 'Mix 4 colors',
    color: (index) => `Color ${index + 1}`,
    change: 'Change',
    chooseColor: (index) => `Select Color ${index + 1}`,
    amountOf: (name) => `Amount of ${name}`,
    choosePaint: 'Choose a paint',
    customColor: 'Custom Color',
    useCustomColor: 'Use this color',
    close: 'Close',
    result: 'Mixed color',
    copyHex: 'Copy HEX',
    copied: 'Copied',
    mixRatio: 'Mix Ratio',
    ratioValueText: (first, second) => `Color 1 ${first}%, Color 2 ${second}%`,
    distribution: 'Distribution',
    mixWithWhite: 'Mix with White',
    beforeWhite: 'Before white',
    white: 'White',
    recipe: 'Recipe',
    recipeWithWhite: (paints, white) => `${paints} + White ${white}`,
    premixButton: 'Pick a pair',
    premixTitle: 'Select from Mixed Colors',
    loading: 'Loading color-mixing engine…',
    loadError: 'The color-mixing engine could not be loaded. Check your connection and retry.',
    retry: 'Retry',
    contact: 'Contact',
    contactTitle: 'Contact',
    contactDescription:
      'For questions, bug reports, feedback, or requests about PaintMix, please contact us at the address below.',
    email: 'Email address',
    sendEmail: 'Send an email',
    copyAddress: 'Copy address',
    operator: 'Operator',
    backToMixer: 'Back to the mixer',
    privacyPolicy: 'Privacy Policy',
    privacyTitle: 'Privacy Policy',
    privacyIntro:
      'Art Full Stack respects your privacy. This policy explains how information is handled when you use PaintMix.',
    tableOfContents: 'Contents',
    privacyLocalStorageTitle: 'Information stored in your browser',
    privacyLocalStorageDescription:
      'PaintMix stores your language and custom color in your browser storage so your preferences work as expected. This information stays in your browser and is not sent to the operator by the app.',
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
      'PaintMix uses the method provided by Mixbox to reproduce in RGB the colors created by mixing real paints. Mixbox is provided under the CC BY-NC 4.0 license for non-commercial use only.',
    mixboxLicense: 'CC BY-NC 4.0',
  },
  ja: {
    title: 'PaintMix',
    options: 'オプション',
    language: '言語',
    modes: '混色モード',
    twoColorMode: '2色で混ぜる',
    fourColorMode: '4色で混ぜる',
    color: (index) => `色${index + 1}`,
    change: '変更',
    chooseColor: (index) => `色${index + 1}を選択`,
    amountOf: (name) => `${name}の量`,
    choosePaint: '絵具を選ぶ',
    customColor: 'カスタムカラー',
    useCustomColor: 'このカラーを使う',
    close: '閉じる',
    result: '混色結果',
    copyHex: 'HEXをコピー',
    copied: 'コピーしました',
    mixRatio: '混合比',
    ratioValueText: (first, second) => `色1 ${first}%、色2 ${second}%`,
    distribution: '配分',
    mixWithWhite: '白を混ぜる',
    beforeWhite: '白を混ぜる前',
    white: '白',
    recipe: '配合レシピ',
    recipeWithWhite: (paints, white) => `${paints} ＋ 白 ${white}`,
    premixButton: '候補から選ぶ',
    premixTitle: '混色候補から選ぶ',
    loading: '混色エンジンを読み込んでいます…',
    loadError: '混色エンジンを読み込めませんでした。接続を確認して再試行してください。',
    retry: '再試行',
    contact: 'お問い合わせ',
    contactTitle: 'お問い合わせ',
    contactDescription:
      'PaintMixに関するご質問、不具合の報告、ご意見・ご要望などがございましたら、以下の連絡先までご連絡ください。',
    email: 'メールアドレス',
    sendEmail: 'メールを送る',
    copyAddress: 'アドレスをコピー',
    operator: '運営者',
    backToMixer: '混色画面へ戻る',
    privacyPolicy: 'プライバシーポリシー',
    privacyTitle: 'プライバシーポリシー',
    privacyIntro:
      'Art Full Stackは、利用者のプライバシーを尊重します。本ポリシーでは、PaintMixにおける情報の取り扱いについて説明します。',
    tableOfContents: '目次',
    privacyLocalStorageTitle: 'ブラウザーに保存する情報',
    privacyLocalStorageDescription:
      'PaintMixは、言語とカスタムカラーをブラウザー内に保存し、設定を維持します。これらの情報はブラウザー内に保存され、本アプリから運営者へ送信されません。',
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
      'PaintMixは、実際の絵具を混ぜてできる色をRGBで再現するため、Mixboxが提供する方法を使用しています。MixboxはCC BY-NC 4.0ライセンスに基づき、非営利目的に限り利用できます。',
    mixboxLicense: 'CC BY-NC 4.0',
  },
}
