export const CHART_COLORS = {
  revenue: '#2D6CDF',
  paid: '#00C2A8',
  pending: '#D85A30',
  novos: '#2D6CDF',
  renovacoes: '#00C2A8',
  navy: '#14213D',
  accent: '#007AFF',
  muted: '#5C6470',
  grid: '#E6E9EF',
  axis: '#5C6470',
}

export const CATEGORICAL_PALETTE = [
  '#2D6CDF',
  '#00C2A8',
  '#007AFF',
  '#14213D',
  '#D85A30',
  '#8FB3F2',
  '#5C6470',
]

export function paletteColor(index: number): string {
  return CATEGORICAL_PALETTE[index % CATEGORICAL_PALETTE.length]
}
