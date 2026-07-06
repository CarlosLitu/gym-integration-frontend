export const PULSE_MARK_ELLIPSE_COLORS = {
  login: '#24893E',
  logout: '#C51A31',
  default: '#2D6CDF',
  chart: 'rgba(218, 221, 226, 1)',
} as const

export const PULSE_MARK_ELLIPSE_OPACITY = {
  login: [0.08, 1, 0.08, 0.08],
  logout: [0.08, 1, 0.08, 0.08],
  default: [0.08, 1, 0.08, 0.08],
  chart: [0.25, 0.55, 0.25, 0.25],
} as const

export const PULSE_MARK_POLYGON_OPACITY = {
  login: 1,
  logout: 1,
  default: 1,
  chart: 0.35,
} as const

export type PulseMarkVariant = keyof typeof PULSE_MARK_ELLIPSE_COLORS
