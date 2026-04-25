import {Box} from '@primer/react'
import {toHsla, toRgba} from 'color2k'
import React from 'react'
import {useGlobalState} from '../global-state'
import {colorToHex, formatLab, formatOklch, getColor, roundColorValue} from '../utils'
import {Button} from './button'
import {Input} from './input'
import {SidebarPanel} from './sidebar-panel'
import {VStack} from './stack'

const colorValueStyle = {
  fontFamily: 'mono' as const,
  fontSize: 1,
  overflowWrap: 'anywhere' as const,
  whiteSpace: 'pre-wrap' as const
}

type HslNumberInputProps = {
  id: string
  value: number
  min?: number
  max?: number
  onValueChange: (value: number) => void
}

type PendingStep = {
  delta: number
  value: number
}

function HslNumberInput({id, value, min, max, onValueChange}: HslNumberInputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const isEditingRef = React.useRef(false)
  const pendingStepRef = React.useRef<PendingStep | null>(null)
  const displayValue = clamp(roundColorValue(value), min, max)

  React.useEffect(() => {
    if (!isEditingRef.current) {
      setInputValue(inputRef.current, displayValue)
    }
  }, [displayValue])

  function commitValue(nextValue: number) {
    const clampedValue = clamp(roundColorValue(nextValue), min, max)
    onValueChange(clampedValue)
    return clampedValue
  }

  function stepValue(delta: number, baseValue = parseNumberDraft(inputRef.current?.value ?? '') ?? value) {
    const nextValue = commitValue(baseValue + delta)
    setInputValue(inputRef.current, nextValue)
    return nextValue
  }

  function changeValue(event: React.ChangeEvent<HTMLInputElement>) {
    const pendingStep = pendingStepRef.current

    if (pendingStep) {
      pendingStep.value = stepValue(pendingStep.delta, pendingStep.value)
      return
    }

    const nextValue = parseNumberDraft(event.target.value)

    if (nextValue === undefined) {
      return
    }

    const committedValue = commitValue(nextValue)

    if (committedValue !== nextValue) {
      setInputValue(event.currentTarget, committedValue)
    }
  }

  function finishEditing() {
    isEditingRef.current = false
    pendingStepRef.current = null

    const nextValue = parseNumberDraft(inputRef.current?.value ?? '')

    if (nextValue === undefined) {
      setInputValue(inputRef.current, displayValue)
      return
    }

    setInputValue(inputRef.current, commitValue(nextValue))
  }

  function clearPendingStep() {
    window.setTimeout(() => {
      pendingStepRef.current = null
    }, 0)
  }

  return (
    <Input
      ref={inputRef}
      id={id}
      type="number"
      step={1}
      style={{width: '100%'}}
      defaultValue={displayValue}
      min={min}
      max={max}
      onFocus={() => (isEditingRef.current = true)}
      onBlur={finishEditing}
      onPointerDown={event => {
        const element = event.currentTarget
        const rect = element.getBoundingClientRect()
        const isStepperClick = event.clientX >= rect.right - 24

        if (isStepperClick) {
          pendingStepRef.current = {
            delta: event.clientY < rect.top + rect.height / 2 ? 1 : -1,
            value: parseNumberDraft(element.value) ?? displayValue
          }
        }
      }}
      onPointerUp={clearPendingStep}
      onPointerCancel={clearPendingStep}
      onKeyDown={event => {
        if (event.key === 'ArrowUp') {
          event.preventDefault()
          stepValue(1)
        } else if (event.key === 'ArrowDown') {
          event.preventDefault()
          stepValue(-1)
        }
      }}
      onChange={changeValue}
    />
  )
}

function parseNumberDraft(value: string) {
  if (value.trim() === '' || value === '-' || value === '+' || value === '.' || value === '-.' || value === '+.') {
    return undefined
  }

  const number = Number(value)
  return Number.isFinite(number) ? number : undefined
}

function setInputValue(input: HTMLInputElement | null, value: number) {
  if (input && input.value !== value.toString()) {
    input.value = value.toString()
  }
}

function clamp(value: number, min?: number, max?: number) {
  if (min !== undefined && value < min) return min
  if (max !== undefined && value > max) return max
  return value
}

export function Color({paletteId = '', scaleId = '', index = ''}: {paletteId: string; scaleId: string; index: string}) {
  const [state, send] = useGlobalState()
  const palette = state.context.palettes[paletteId]
  const scale = palette.scales[scaleId]
  const indexAsNumber = parseInt(index, 10)
  const color = scale.colors[indexAsNumber]

  if (!color) {
    return null
  }

  const computedColor = getColor(palette.curves, scale, indexAsNumber)
  const hex = colorToHex(computedColor)

  return (
    <SidebarPanel title={`${scale.name}.${index}`}>
      <VStack spacing={16}>
        <Box sx={{width: '100%', height: 48, background: hex, borderRadius: 1}} />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 8
          }}
        >
          <VStack spacing={4}>
            <label htmlFor="hue" style={{fontSize: 14}}>
              {scale.curves.hue ? 'H offset' : 'H'}
            </label>
            <HslNumberInput
              id="hue"
              value={color.hue}
              min={scale.curves.hue ? undefined : 0}
              max={scale.curves.hue ? undefined : 360}
              onValueChange={value => {
                send({
                  type: 'CHANGE_COLOR_VALUE',
                  paletteId,
                  scaleId,
                  index: indexAsNumber,
                  value: {
                    hue: value
                  }
                })
              }}
            />
          </VStack>
          <VStack spacing={4}>
            <label htmlFor="saturation" style={{fontSize: 14}}>
              {scale.curves.saturation ? 'S offset' : 'S'}
            </label>
            <HslNumberInput
              id="saturation"
              value={color.saturation}
              min={scale.curves.saturation ? undefined : 0}
              max={scale.curves.saturation ? undefined : 100}
              onValueChange={value => {
                send({
                  type: 'CHANGE_COLOR_VALUE',
                  paletteId,
                  scaleId,
                  index: indexAsNumber,
                  value: {
                    saturation: value
                  }
                })
              }}
            />
          </VStack>
          <VStack spacing={4}>
            <label htmlFor="lightness" style={{fontSize: 14}}>
              {scale.curves.lightness ? 'L offset' : 'L'}
            </label>
            <HslNumberInput
              id="lightness"
              value={color.lightness}
              min={scale.curves.lightness ? undefined : 0}
              max={scale.curves.lightness ? undefined : 100}
              onValueChange={value => {
                send({
                  type: 'CHANGE_COLOR_VALUE',
                  paletteId,
                  scaleId,
                  index: indexAsNumber,
                  value: {
                    lightness: value
                  }
                })
              }}
            />
          </VStack>
        </div>

        <Box as="code" sx={colorValueStyle}>
          hsluv({computedColor.hue}, {computedColor.saturation}%, {computedColor.lightness}%)
        </Box>

        <Box as="code" sx={colorValueStyle}>
          {hex}
        </Box>

        <Box as="code" sx={colorValueStyle}>
          {toRgba(hex)}
        </Box>

        <Box as="code" sx={colorValueStyle}>
          {toHsla(hex)}
        </Box>

        <Box as="code" sx={colorValueStyle}>
          {formatLab(hex)}
        </Box>

        <Box as="code" sx={colorValueStyle}>
          {formatOklch(hex)}
        </Box>

        <Button
          onClick={() =>
            send({
              type: 'DELETE_COLOR',
              paletteId,
              scaleId,
              index: parseInt(index)
            })
          }
          disabled={scale.colors.length === 1}
        >
          Delete color
        </Button>
      </VStack>
    </SidebarPanel>
  )
}
