import {isArray, keyBy} from 'lodash-es'
import React from 'react'
import {v4 as uniqueId} from 'uuid'
import {Scale} from '../types'
import {hexToColor} from '../utils'
import {Button} from './button'
import {Dialog} from './dialog'
import {HStack, VStack} from './stack'
import {Textarea} from './textarea'

const PLACEHOLDER = `{
  "gray": [
    "#eee",
    "#ddd",
    "#ccc"
  ]
}`

type ImportScalesProps = {
  onImport: (scales: Record<string, Scale>, replace: boolean) => void
}

export function ImportScales({onImport}: ImportScalesProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [code, setCode] = React.useState('')
  const [error, setError] = React.useState('')
  const [replace, setReplace] = React.useState(false)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      const parsedCode: Record<string, string | string[]> = JSON.parse(code)

      const scales: Scale[] = Object.entries(parsedCode).map(([name, scale]) => {
        const id = uniqueId()
        const scaleArray = isArray(scale) ? scale : [scale]

        if (scaleArray.length === 0) {
          throw new Error(`Please provide at least one color for ${name} scale`)
        }

        return {id, name, colors: scaleArray.map(hexToColor), curves: {}}
      })

      onImport(keyBy(scales, 'id'), replace)

      setIsOpen(false)
      setCode('')
      setError('')
      setReplace(false)
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError(String(error))
      }
    }
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Import</Button>
      {isOpen ? (
        <Dialog title="Import" onClose={() => setIsOpen(false)}>
          <form onSubmit={handleSubmit}>
            <VStack spacing={16}>
              {error ? (
                <div className="app-alert" role="alert">
                  {error}
                </div>
              ) : null}
              <VStack spacing={4}>
                <label htmlFor="code" style={{fontSize: 14}}>
                  Paste JSON
                </label>
                <Textarea
                  id="code"
                  rows={12}
                  style={{width: '100%', fontFamily: 'var(--font-mono)'}}
                  placeholder={PLACEHOLDER}
                  value={code}
                  onChange={event => setCode(event.target.value)}
                />
              </VStack>
              <HStack spacing={4}>
                <input
                  type="checkbox"
                  id="replace"
                  checked={replace}
                  onChange={event => setReplace(event.target.checked)}
                />
                <label htmlFor="replace" style={{fontSize: 14, lineHeight: 1}}>
                  Replace existing scales
                </label>
              </HStack>
              <Button type="submit">Import</Button>
            </VStack>
          </form>
        </Dialog>
      ) : null}
    </>
  )
}
