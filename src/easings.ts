import bezier from 'bezier-easing'
import {BezierControlPoints, CurveEasing} from './types'

export const easings = ['in', 'out', 'inOut'] as const
export type Easing = typeof easings[number]

function points(x1: number, y1: number, x2: number, y2: number): BezierControlPoints {
  return [x1, y1, x2, y2]
}

export const customEasingPreset = 'custom'

export const easingPoints = {
  linear: points(0.5, 0.5, 0.5, 0.5),
  quadratic: {
    inOut: points(0.455, 0.03, 0.515, 0.955),
    in: points(0.55, 0.085, 0.68, 0.53),
    out: points(0.25, 0.46, 0.45, 0.94)
  },
  cubic: {
    inOut: points(0.645, 0.045, 0.355, 1),
    in: points(0.55, 0.055, 0.675, 0.19),
    out: points(0.215, 0.61, 0.355, 1)
  },
  quartic: {
    inOut: points(0.77, 0, 0.175, 1),
    in: points(0.895, 0.03, 0.685, 0.22),
    out: points(0.165, 0.84, 0.44, 1)
  },
  quintic: {
    inOut: points(0.86, 0, 0.07, 1),
    in: points(0.755, 0.05, 0.855, 0.06),
    out: points(0.23, 1, 0.32, 1)
  },
  sine: {
    inOut: points(0.445, 0.05, 0.55, 0.95),
    in: points(0.47, 0, 0.745, 0.715),
    out: points(0.39, 0.575, 0.565, 1)
  },
  circular: {
    inOut: points(0.785, 0.135, 0.15, 0.86),
    in: points(0.6, 0.04, 0.98, 0.335),
    out: points(0.075, 0.82, 0.165, 1)
  },
  exponential: {
    inOut: points(1, 0, 0, 1),
    in: points(0.95, 0.05, 0.795, 0.035),
    out: points(0.19, 1, 0.22, 1)
  }
}

export type EasingCurveKey = keyof typeof easingPoints

type EasingDefinition = BezierControlPoints | {[easing in Easing]: BezierControlPoints}

export const defaultCurveEasing: CurveEasing = {
  preset: 'quadratic',
  variant: 'inOut',
  points: points(0.455, 0.03, 0.515, 0.955)
}

export function createEasingFunction([x1, y1, x2, y2]: BezierControlPoints) {
  return bezier(x1, y1, x2, y2)
}

export function getEasingPoints(preset: string, variant?: string): BezierControlPoints | undefined {
  const easing = easingPoints[preset as EasingCurveKey] as EasingDefinition | undefined

  if (!easing) return undefined
  if (Array.isArray(easing)) return [...easing]

  const easingVariant = variant && variant in easing ? variant : defaultCurveEasing.variant
  const easingVariantPoints = easing[easingVariant as Easing]

  return easingVariantPoints ? [...easingVariantPoints] : undefined
}
