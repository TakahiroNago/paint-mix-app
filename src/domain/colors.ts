export interface PaintColor {
  id: string
  hex: string
  name: string
  nameJa: string
}

export const PAINT_COLORS: PaintColor[] = [
  { id: 'cadmium-yellow', hex: '#feec00', name: 'Cadmium Yellow', nameJa: 'カドミウムイエロー' },
  { id: 'hansa-yellow', hex: '#fcd300', name: 'Hansa Yellow', nameJa: 'ハンザイエロー' },
  { id: 'cadmium-orange', hex: '#ff6900', name: 'Cadmium Orange', nameJa: 'カドミウムオレンジ' },
  { id: 'cadmium-red', hex: '#ff2702', name: 'Cadmium Red', nameJa: 'カドミウムレッド' },
  { id: 'quinacridone-magenta', hex: '#80022e', name: 'Quinacridone Magenta', nameJa: 'キナクリドンマゼンタ' },
  { id: 'cobalt-violet', hex: '#4e0042', name: 'Cobalt Violet', nameJa: 'コバルトバイオレット' },
  { id: 'ultramarine-blue', hex: '#190059', name: 'Ultramarine Blue', nameJa: 'ウルトラマリンブルー' },
  { id: 'cobalt-blue', hex: '#002185', name: 'Cobalt Blue', nameJa: 'コバルトブルー' },
  { id: 'phthalo-blue', hex: '#0d1b44', name: 'Phthalo Blue', nameJa: 'フタロブルー' },
  { id: 'phthalo-green', hex: '#003c32', name: 'Phthalo Green', nameJa: 'フタログリーン' },
  { id: 'permanent-green', hex: '#076d16', name: 'Permanent Green', nameJa: 'パーマネントグリーン' },
  { id: 'sap-green', hex: '#6b9404', name: 'Sap Green', nameJa: 'サップグリーン' },
  { id: 'burnt-sienna', hex: '#7b4800', name: 'Burnt Sienna', nameJa: 'バーントシェンナ' },
  { id: 'yellow-ochre', hex: '#cb9d06', name: 'Yellow Ochre', nameJa: 'イエローオーカー' },
  { id: 'mars-black', hex: '#161617', name: 'Mars Black', nameJa: 'マルスブラック' },
  { id: 'titanium-white', hex: '#f3f4f7', name: 'Titanium White', nameJa: 'チタニウムホワイト' },
]

export const DEFAULT_COLORS: [PaintColor, PaintColor] = [
  PAINT_COLORS[0],
  PAINT_COLORS[8],
]

export const TITANIUM_WHITE = PAINT_COLORS[15]
export const MIXABLE_PIGMENTS = PAINT_COLORS.slice(0, 15)
