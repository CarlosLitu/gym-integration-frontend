export const PULSE_MARK_ELLIPSE_COLORS = {
  login: '#24893E',
  logout: '#C51A31',
  default: '#2D6CDF',
} as const

export type PulseMarkVariant = keyof typeof PULSE_MARK_ELLIPSE_COLORS
