import {TriangleDownIcon} from '@primer/octicons-react'
import {ActionList, ActionMenu, Button, ButtonGroup, IconButton} from '@primer/react'
import type {ButtonProps} from '@primer/react'
import {PRESET_PALETTES} from '../preset-palettes'

const presets = Object.values(PRESET_PALETTES).sort((a, b) => a.name.localeCompare(b.name))

type AddPaletteSplitButtonProps = {
  size?: ButtonProps['size']
  onAddPalette: () => void
  onAddPresetPalette: (presetId: string) => void
}

export function AddPaletteSplitButton({size = 'medium', onAddPalette, onAddPresetPalette}: AddPaletteSplitButtonProps) {
  return (
    <ButtonGroup>
      <Button variant="primary" size={size} onClick={onAddPalette}>
        Add Palette
      </Button>
      <ActionMenu>
        <ActionMenu.Anchor>
          <IconButton aria-label="Select preset palette" icon={TriangleDownIcon} variant="primary" size={size} />
        </ActionMenu.Anchor>
        <ActionMenu.Overlay align="end" width="medium">
          <ActionList>
            <ActionList.Group title="Community Palettes">
              {presets.map(preset => (
                <ActionList.Item key={preset.id} onSelect={() => onAddPresetPalette(preset.id)}>
                  {preset.name}
                  <ActionList.Description variant="block">{preset.description}</ActionList.Description>
                </ActionList.Item>
              ))}
            </ActionList.Group>
          </ActionList>
        </ActionMenu.Overlay>
      </ActionMenu>
    </ButtonGroup>
  )
}
