import {Color, Curve, Scale} from './types'
import hsluv from 'hsluv'
import {toHex} from 'color2k'

type LabColor = {
  lightness: number
  a: number
  b: number
}

type OklchColor = {
  lightness: number
  chroma: number
  hue: number
}

export function hexToColor(hex: string): Color {
  const [hue, saturation, lightness] = hsluv.hexToHsluv(toHex(hex)).map(value => Math.round(value * 100) / 100)
  return {hue, saturation, lightness}
}

export function colorToHex(color: Color): string {
  return hsluv.hsluvToHex([color.hue, color.saturation, color.lightness])
}

export function hexToLab(hex: string): LabColor {
  const {red, green, blue} = hexToLinearSrgb(hex)
  const d65X = 0.4124564 * red + 0.3575761 * green + 0.1804375 * blue
  const d65Y = 0.2126729 * red + 0.7151522 * green + 0.072175 * blue
  const d65Z = 0.0193339 * red + 0.119192 * green + 0.9503041 * blue
  const d50X = 1.0478112 * d65X + 0.0228866 * d65Y - 0.050127 * d65Z
  const d50Y = 0.0295424 * d65X + 0.9904844 * d65Y - 0.0170491 * d65Z
  const d50Z = -0.0092345 * d65X + 0.0150436 * d65Y + 0.7521316 * d65Z
  const x = labTransform(d50X / 0.96422)
  const y = labTransform(d50Y)
  const z = labTransform(d50Z / 0.82521)

  return {
    lightness: 116 * y - 16,
    a: 500 * (x - y),
    b: 200 * (y - z)
  }
}

export function hexToOklch(hex: string): OklchColor {
  const {red, green, blue} = hexToLinearSrgb(hex)
  const l = Math.cbrt(0.4122214708 * red + 0.5363325363 * green + 0.0514459929 * blue)
  const m = Math.cbrt(0.2119034982 * red + 0.6806995451 * green + 0.1073969566 * blue)
  const s = Math.cbrt(0.0883024619 * red + 0.2817188376 * green + 0.6299787005 * blue)
  const lightness = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s
  const b = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
  const chroma = Math.sqrt(a * a + b * b)
  const hue = normalizeHue((Math.atan2(b, a) * 180) / Math.PI)

  return {lightness, chroma, hue}
}

export function formatLab(hex: string) {
  const {lightness, a, b} = hexToLab(hex)
  return `lab(${formatColorNumber(lightness)}% ${formatColorNumber(a)} ${formatColorNumber(b)})`
}

export function formatOklch(hex: string) {
  const {lightness, chroma, hue} = hexToOklch(hex)
  return `oklch(${formatColorNumber(lightness * 100)}% ${formatColorNumber(chroma)} ${formatColorNumber(hue)})`
}

export function randomIntegerInRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function getColor(curves: Record<string, Curve>, scale: Scale, index: number) {
  const color = scale.colors[index]

  const hueCurve = curves[scale.curves.hue ?? '']?.values ?? []
  const saturationCurve = curves[scale.curves.saturation ?? '']?.values ?? []
  const lightnessCurve = curves[scale.curves.lightness ?? '']?.values ?? []

  const hue = color.hue + (hueCurve[index] ?? 0)
  const saturation = color.saturation + (saturationCurve[index] ?? 0)
  const lightness = color.lightness + (lightnessCurve[index] ?? 0)

  return {hue, saturation, lightness}
}

export function getRange(type: Curve['type']) {
  const ranges = {
    hue: {min: 0, max: 360},
    saturation: {min: 0, max: 100},
    lightness: {min: 0, max: 100}
  }
  return ranges[type]
}

export function getContrastScore(contrast: number) {
  return contrast < 3 ? 'Fail' : contrast < 4.5 ? 'AA+' : contrast < 7 ? 'AA' : 'AAA'
}

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function hexToLinearSrgb(hex: string) {
  const normalizedHex = toHex(hex).slice(1)
  const red = parseInt(normalizedHex.slice(0, 2), 16) / 255
  const green = parseInt(normalizedHex.slice(2, 4), 16) / 255
  const blue = parseInt(normalizedHex.slice(4, 6), 16) / 255

  return {
    red: linearizeSrgb(red),
    green: linearizeSrgb(green),
    blue: linearizeSrgb(blue)
  }
}

function linearizeSrgb(value: number) {
  return value <= 0.04045 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4)
}

function labTransform(value: number) {
  const epsilon = 216 / 24389
  const kappa = 24389 / 27

  return value > epsilon ? Math.cbrt(value) : (kappa * value + 16) / 116
}

function normalizeHue(hue: number) {
  return (hue + 360) % 360
}

function formatColorNumber(value: number) {
  return (Math.round(value * 1000) / 1000).toString()
}
