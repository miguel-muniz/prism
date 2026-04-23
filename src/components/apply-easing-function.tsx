import {capitalize} from 'lodash-es'
import * as React from 'react'
import {
  customEasingPreset,
  defaultCurveEasing,
  easingPoints,
  easings,
  Easing,
  EasingCurveKey,
  getEasingPoints
} from '../easings'
import {BezierControlPoints, CurveEasing} from '../types'
import {Button} from './button'
import {Input} from './input'
import {Select} from './select'
import {SidebarPanel} from './sidebar-panel'
import {VStack} from './stack'

type ApplyEasingFunctionProps = {
  easing?: CurveEasing
  onApply: (easing: CurveEasing) => void
}

const presetKeys = Object.keys(easingPoints) as EasingCurveKey[]
const chart = {x: 22, y: 16, width: 208, height: 112}
const chartWidth = 252
const chartHeight = 152
const panelStackStyle: React.CSSProperties = {alignItems: 'stretch', width: '100%', minWidth: 0}
const fullWidthControlStyle: React.CSSProperties = {
  boxSizing: 'border-box',
  width: '100%',
  minWidth: 0,
  maxWidth: '100%'
}

export function ApplyEasingFunction({easing, onApply}: ApplyEasingFunctionProps) {
  const normalizedEasing = React.useMemo(() => normalizeEasing(easing), [easing])
  const [preset, setPreset] = React.useState(normalizedEasing.preset)
  const [variant, setVariant] = React.useState(normalizedEasing.variant ?? '')
  const [points, setPoints] = React.useState<BezierControlPoints>(normalizedEasing.points)
  const [cssValue, setCssValue] = React.useState(formatBezier(normalizedEasing.points))
  const [isCssValid, setIsCssValid] = React.useState(true)

  React.useEffect(() => {
    setPreset(normalizedEasing.preset)
    setVariant(normalizedEasing.variant ?? '')
    setPoints(normalizedEasing.points)
    setCssValue(formatBezier(normalizedEasing.points))
    setIsCssValid(true)
  }, [normalizedEasing])

  const selectedPreset = isPresetKey(preset) ? easingPoints[preset] : undefined
  const variantOptions = selectedPreset && !Array.isArray(selectedPreset) ? easings : []

  function updatePoints(nextPoints: BezierControlPoints, options: {syncCssValue?: boolean} = {}) {
    setPoints(nextPoints)
    setIsCssValid(true)

    if (options.syncCssValue ?? true) {
      setCssValue(formatBezier(nextPoints))
    }
  }

  function updateCustomPoints(nextPoints: BezierControlPoints, options: {syncCssValue?: boolean} = {}) {
    setPreset(customEasingPreset)
    setVariant('')
    updatePoints(nextPoints, options)
  }

  function changePreset(nextPreset: string) {
    if (nextPreset === customEasingPreset) {
      setPreset(customEasingPreset)
      setVariant('')
      updatePoints(points)
      return
    }

    const nextVariant = getDefaultVariant(nextPreset)
    const nextPoints = getEasingPoints(nextPreset, nextVariant)

    if (!nextPoints) return

    setPreset(nextPreset)
    setVariant(nextVariant ?? '')
    updatePoints(nextPoints)
  }

  function changeVariant(nextVariant: string) {
    const nextPoints = getEasingPoints(preset, nextVariant)

    if (!nextPoints) return

    setVariant(nextVariant)
    updatePoints(nextPoints)
  }

  function changePoint(pointIndex: 0 | 1, coordinate: 'x' | 'y', value: number) {
    if (!Number.isFinite(value)) return

    const nextPoints = [...points] as BezierControlPoints
    const pointOffset = pointIndex * 2 + (coordinate === 'x' ? 0 : 1)
    nextPoints[pointOffset] = clamp(value, 0, 1)
    updateCustomPoints(nextPoints)
  }

  function changeCssValue(value: string) {
    setCssValue(value)

    const nextPoints = parseBezier(value)
    setIsCssValid(Boolean(nextPoints))

    if (nextPoints) {
      updateCustomPoints(nextPoints, {syncCssValue: false})
    }
  }

  function applyEasingFunction() {
    if (!isCssValid) return

    onApply({
      preset,
      variant: preset === customEasingPreset || !variant ? undefined : variant,
      points
    })
  }

  return (
    <SidebarPanel title="Easing function">
      <VStack spacing={16} style={panelStackStyle}>
        <VStack spacing={4} style={panelStackStyle}>
          <label htmlFor="easing-preset" style={{fontSize: 14}}>
            Preset
          </label>

          <Select
            id="easing-preset"
            value={preset}
            style={fullWidthControlStyle}
            onChange={event => changePreset(event.target.value)}
          >
            {presetKeys.map(key => (
              <option value={key} key={key}>
                {formatPresetLabel(key)}
              </option>
            ))}
            <option value={customEasingPreset}>Custom</option>
          </Select>
        </VStack>

        <VStack spacing={4} style={panelStackStyle}>
          <label htmlFor="easing-variant" style={{fontSize: 14}}>
            Variant
          </label>

          <Select
            id="easing-variant"
            disabled={variantOptions.length === 0}
            value={variant}
            style={fullWidthControlStyle}
            onChange={event => changeVariant(event.target.value)}
          >
            {variantOptions.length === 0 ? (
              <option value="">-</option>
            ) : (
              variantOptions.map(variant => (
                <option value={variant} key={variant}>
                  {formatVariantLabel(variant)}
                </option>
              ))
            )}
          </Select>
        </VStack>

        <BezierCurveChart
          points={points}
          onChange={(pointIndex, nextPoint) => changeBezierPoint(points, pointIndex, nextPoint, updateCustomPoints)}
        />

        <VStack spacing={8} style={panelStackStyle}>
          <PointInputs pointIndex={0} points={points} onChange={changePoint} />
          <PointInputs pointIndex={1} points={points} onChange={changePoint} />
        </VStack>

        <VStack spacing={4} style={panelStackStyle}>
          <label htmlFor="css-bezier" style={{fontSize: 14}}>
            CSS cubic-bezier
          </label>
          <Input
            id="css-bezier"
            value={cssValue}
            aria-invalid={!isCssValid}
            onChange={event => changeCssValue(event.target.value)}
            style={{
              ...fullWidthControlStyle,
              ...(!isCssValid ? {borderColor: 'var(--color-danger-emphasis, #cf222e)'} : undefined)
            }}
          />
          {!isCssValid ? (
            <span style={{fontSize: 12, color: 'var(--color-danger-fg, #cf222e)'}}>
              Use cubic-bezier(x1, y1, x2, y2).
            </span>
          ) : null}
        </VStack>

        <Button onClick={applyEasingFunction} disabled={!isCssValid} style={fullWidthControlStyle}>
          Apply easing
        </Button>
      </VStack>
    </SidebarPanel>
  )
}

type BezierCurveChartProps = {
  points: BezierControlPoints
  onChange: (pointIndex: 0 | 1, point: [number, number]) => void
}

function BezierCurveChart({points, onChange}: BezierCurveChartProps) {
  const [dragging, setDragging] = React.useState<0 | 1 | null>(null)
  const start = chartPointToSvg([0, 0])
  const end = chartPointToSvg([1, 1])
  const point1 = chartPointToSvg([points[0], points[1]])
  const point2 = chartPointToSvg([points[2], points[3]])
  const path = `M ${start.x} ${start.y} C ${point1.x} ${point1.y}, ${point2.x} ${point2.y}, ${end.x} ${end.y}`

  function updatePoint(svg: SVGSVGElement, pointIndex: 0 | 1, clientX: number, clientY: number) {
    onChange(pointIndex, clientPointToBezierPoint(svg, clientX, clientY))
  }

  function beginDrag(event: React.PointerEvent<SVGCircleElement>, pointIndex: 0 | 1) {
    const svg = event.currentTarget.ownerSVGElement

    if (!svg) return

    event.preventDefault()
    svg.setPointerCapture(event.pointerId)
    setDragging(pointIndex)
    updatePoint(svg, pointIndex, event.clientX, event.clientY)
  }

  function endDrag(event: React.PointerEvent<SVGSVGElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    setDragging(null)
  }

  return (
    <svg
      viewBox={`0 0 ${chartWidth} ${chartHeight}`}
      width="100%"
      height={chartHeight}
      fill="none"
      style={{display: 'block', maxWidth: '100%', touchAction: 'none'}}
      onPointerMove={event => {
        if (dragging == null) return

        updatePoint(event.currentTarget, dragging, event.clientX, event.clientY)
      }}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <rect
        x={chart.x}
        y={chart.y}
        width={chart.width}
        height={chart.height}
        rx="4"
        fill="var(--color-background, white)"
        stroke="var(--color-border, #d8d8d8)"
        strokeWidth="1"
      />

      {[0.25, 0.5, 0.75].map(value => (
        <React.Fragment key={value}>
          <line
            x1={chart.x + value * chart.width}
            x2={chart.x + value * chart.width}
            y1={chart.y}
            y2={chart.y + chart.height}
            stroke="var(--color-border, #d8d8d8)"
            strokeDasharray="4 4"
          />
          <line
            x1={chart.x}
            x2={chart.x + chart.width}
            y1={chart.y + value * chart.height}
            y2={chart.y + value * chart.height}
            stroke="var(--color-border, #d8d8d8)"
            strokeDasharray="4 4"
          />
        </React.Fragment>
      ))}

      <line x1={start.x} y1={start.y} x2={point1.x} y2={point1.y} stroke="var(--color-border, #c8c8c8)" />
      <line x1={end.x} y1={end.y} x2={point2.x} y2={point2.y} stroke="var(--color-border, #c8c8c8)" />
      <path d={path} stroke="var(--color-text, black)" strokeWidth="3" strokeLinecap="round" />
      <circle cx={start.x} cy={start.y} r="4" fill="var(--color-text, black)" />
      <circle cx={end.x} cy={end.y} r="4" fill="var(--color-text, black)" />

      <ControlPoint
        label="Point 1"
        point={point1}
        textAnchor="middle"
        labelOffset={-12}
        onPointerDown={event => beginDrag(event, 0)}
      />
      <ControlPoint
        label="Point 2"
        point={point2}
        textAnchor="middle"
        labelOffset={-14}
        onPointerDown={event => beginDrag(event, 1)}
      />
    </svg>
  )
}

type ControlPointProps = {
  label: string
  point: {x: number; y: number}
  textAnchor: 'start' | 'middle' | 'end'
  labelOffset: number
  onPointerDown: React.PointerEventHandler<SVGCircleElement>
}

function ControlPoint({label, point, textAnchor, labelOffset, onPointerDown}: ControlPointProps) {
  return (
    <g>
      <text
        x={point.x}
        y={point.y + labelOffset}
        fill="var(--color-text, black)"
        textAnchor={textAnchor}
        style={{fontSize: 11, pointerEvents: 'none'}}
      >
        {label}
      </text>
      <circle
        cx={point.x}
        cy={point.y}
        r="8"
        fill="var(--color-background, white)"
        stroke="var(--color-text, black)"
        strokeWidth="2"
        style={{cursor: 'grab'}}
        onPointerDown={onPointerDown}
      />
    </g>
  )
}

type PointInputsProps = {
  pointIndex: 0 | 1
  points: BezierControlPoints
  onChange: (pointIndex: 0 | 1, coordinate: 'x' | 'y', value: number) => void
}

function PointInputs({pointIndex, points, onChange}: PointInputsProps) {
  const label = `Point ${pointIndex + 1}`
  const x = points[pointIndex * 2]
  const y = points[pointIndex * 2 + 1]
  const [xValue, setXValue] = React.useState(formatNumber(x))
  const [yValue, setYValue] = React.useState(formatNumber(y))
  const xInputId = `point-${pointIndex + 1}-x`
  const yInputId = `point-${pointIndex + 1}-y`

  React.useEffect(() => {
    setXValue(formatNumber(x))
  }, [x])

  React.useEffect(() => {
    setYValue(formatNumber(y))
  }, [y])

  function changeCoordinate(coordinate: 'x' | 'y', value: string) {
    if (coordinate === 'x') {
      setXValue(value)
    } else {
      setYValue(value)
    }

    const nextValue = Number(value)

    if (Number.isFinite(nextValue)) {
      onChange(pointIndex, coordinate, nextValue)
    }
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '64px 12px minmax(0, 1fr) 12px minmax(0, 1fr)',
        alignItems: 'center',
        gap: 8,
        width: '100%',
        minWidth: 0,
        boxSizing: 'border-box'
      }}
    >
      <span style={{fontSize: 14}}>{label}</span>
      <label htmlFor={xInputId} style={{fontSize: 14}}>
        x
      </label>
      <Input
        id={xInputId}
        type="number"
        min={0}
        max={1}
        step={0.001}
        value={xValue}
        style={fullWidthControlStyle}
        onBlur={() => setXValue(formatNumber(x))}
        onChange={event => changeCoordinate('x', event.target.value)}
      />
      <label htmlFor={yInputId} style={{fontSize: 14}}>
        y
      </label>
      <Input
        id={yInputId}
        type="number"
        min={0}
        max={1}
        step={0.001}
        value={yValue}
        style={fullWidthControlStyle}
        onBlur={() => setYValue(formatNumber(y))}
        onChange={event => changeCoordinate('y', event.target.value)}
      />
    </div>
  )
}

function normalizeEasing(easing?: CurveEasing): CurveEasing {
  if (!easing) {
    return copyEasing(defaultCurveEasing)
  }

  const preset =
    easing.preset === customEasingPreset || isPresetKey(easing.preset) ? easing.preset : defaultCurveEasing.preset

  if (preset === customEasingPreset) {
    return {
      preset,
      points: copyPoints(easing.points ?? defaultCurveEasing.points)
    }
  }

  const variant = getDefaultVariant(preset, easing.variant)
  const points = easing.points ?? getEasingPoints(preset, variant) ?? defaultCurveEasing.points

  return {
    preset,
    variant,
    points: copyPoints(points)
  }
}

function copyEasing(easing: CurveEasing): CurveEasing {
  return {
    ...easing,
    points: copyPoints(easing.points)
  }
}

function copyPoints(points: BezierControlPoints): BezierControlPoints {
  return [...points] as BezierControlPoints
}

function changeBezierPoint(
  currentPoints: BezierControlPoints,
  pointIndex: 0 | 1,
  [x, y]: [number, number],
  onChange: (points: BezierControlPoints) => void
) {
  const nextPoints = [...currentPoints] as BezierControlPoints
  nextPoints[pointIndex * 2] = x
  nextPoints[pointIndex * 2 + 1] = y
  onChange(nextPoints)
}

function clientPointToBezierPoint(svg: SVGSVGElement, clientX: number, clientY: number): [number, number] {
  const rect = svg.getBoundingClientRect()
  const svgX = ((clientX - rect.left) / rect.width) * chartWidth
  const svgY = ((clientY - rect.top) / rect.height) * chartHeight
  const x = clamp((svgX - chart.x) / chart.width, 0, 1)
  const y = clamp(1 - (svgY - chart.y) / chart.height, 0, 1)

  return [round(x), round(y)]
}

function chartPointToSvg([x, y]: [number, number]) {
  return {
    x: chart.x + x * chart.width,
    y: chart.y + (1 - y) * chart.height
  }
}

function parseBezier(value: string): BezierControlPoints | undefined {
  const numberPattern = String.raw`([-+]?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?)`
  const pattern = new RegExp(
    String.raw`^\s*cubic-bezier\(\s*${numberPattern}\s*,\s*${numberPattern}\s*,\s*${numberPattern}\s*,\s*${numberPattern}\s*\)\s*$`,
    'i'
  )
  const match = value.match(pattern)

  if (!match) return undefined

  const values = match.slice(1).map(value => Number(value))

  if (values.some(value => !Number.isFinite(value))) return undefined

  return values.map(value => round(clamp(value, 0, 1))) as BezierControlPoints
}

function getDefaultVariant(preset: string, preferredVariant?: string): Easing | undefined {
  if (!isPresetKey(preset)) return undefined

  const easing = easingPoints[preset]

  if (Array.isArray(easing)) return undefined
  if (preferredVariant && preferredVariant in easing) return preferredVariant as Easing

  return defaultCurveEasing.variant as Easing
}

function isPresetKey(value: string): value is EasingCurveKey {
  return value in easingPoints
}

function formatBezier(points: BezierControlPoints) {
  return `cubic-bezier(${points.map(formatNumber).join(', ')})`
}

function formatNumber(value: number) {
  return round(value).toString()
}

function formatPresetLabel(key: string) {
  return key === customEasingPreset ? 'Custom' : capitalize(key)
}

function formatVariantLabel(variant: Easing) {
  return variant === 'inOut' ? 'InOut' : capitalize(variant)
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function round(value: number) {
  return Math.round(value * 1000) / 1000
}
