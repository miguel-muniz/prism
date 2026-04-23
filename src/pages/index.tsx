import {TrashIcon} from '@primer/octicons-react'
import {Box, Heading, Text} from '@primer/react'
import {mix, readableColor} from 'color2k'
import {Link} from 'react-router-dom'
import {AddPaletteSplitButton} from '../components/add-palette-split-button'
import {IconButton} from '../components/button'
import {routePrefix} from '../constants'
import {useGlobalState} from '../global-state'
import {colorToHex, getColor} from '../utils'

export function Index() {
  const [state, send] = useGlobalState()
  return (
    <div>
      <Box
        as="header"
        sx={{
          p: 3,
          bg: 'canvas.default',
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        <Box sx={{display: 'flex', alignItems: 'center'}}>
          <Box as="h1" sx={{m: 0, fontSize: 3, fontWeight: 'bold'}}>
            Prism+
          </Box>
        </Box>
        <Box sx={{display: 'flex', alignItems: 'center'}}>
          <AddPaletteSplitButton
            onAddPalette={() => send('CREATE_PALETTE')}
            onAddPresetPalette={presetId => send({type: 'CREATE_PRESET_PALETTE', presetId})}
          />
        </Box>
      </Box>
      <Box sx={{p: 3}}>
        <Box
          as="ul"
          sx={{
            margin: 0,
            padding: 0,
            listStyle: 'none',
            display: 'grid',
            gap: 3,
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            lineClamp: 1
          }}
        >
          {Object.values(state.context.palettes).map(palette => (
            <li key={palette.id} style={{position: 'relative'}}>
              <Box
                as={Link}
                to={`${routePrefix}/local/${palette.id}`}
                p={3}
                sx={{
                  display: 'grid',
                  gap: 3,
                  textDecoration: 'none',
                  borderRadius: 2,
                  // border: "1px solid",
                  // borderColor: "border.default",
                  overflow: 'hidden',
                  color: readableColor(palette.backgroundColor),
                  backgroundColor: palette.backgroundColor,
                  height: '100%'
                }}
              >
                <Box
                  sx={{
                    borderRadius: 1,
                    overflow: 'hidden',
                    display: 'flex',
                    height: 160,
                    gap: 3
                  }}
                >
                  {Object.values(palette.scales)
                    .slice(0, 12)
                    .map(scale => (
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          color: readableColor(palette.backgroundColor),
                          backgroundColor: palette.backgroundColor,
                          height: '100%',
                          width: '100%',
                          borderRadius: 1,
                          overflow: 'hidden'
                        }}
                        key={scale.id}
                      >
                        {scale.colors.map((_, index) => {
                          const color = getColor(palette.curves, scale, index)
                          return (
                            <Box
                              key={index}
                              style={{
                                width: '100%',
                                height: '100%',
                                backgroundColor: colorToHex(color)
                              }}
                            />
                          )
                        })}
                      </Box>
                    ))}
                </Box>
                <Text
                  sx={{
                    lineHeight: '24px',
                    textOverflow: 'ellipsis',
                    width: '80%',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {palette.name}
                </Text>
              </Box>
              <IconButton
                aria-label="Delete palette"
                icon={TrashIcon}
                onClick={() => {
                  send({type: 'DELETE_PALETTE', paletteId: palette.id})
                }}
                sx={{
                  '--color-text': readableColor(palette.backgroundColor),
                  '--color-background': palette.backgroundColor,
                  '--color-background-secondary': mix(
                    readableColor(palette.backgroundColor),
                    palette.backgroundColor,
                    0.9
                  ),
                  '--color-background-secondary-hover': mix(
                    readableColor(palette.backgroundColor),
                    palette.backgroundColor,
                    0.85
                  ),
                  '--color-border': mix(readableColor(palette.backgroundColor), palette.backgroundColor, 0.75),
                  position: 'absolute',
                  right: 3,
                  bottom: '12px'
                }}
              />
            </li>
          ))}
        </Box>
      </Box>
      {/* Empty state */}
      {Object.keys(state.context.palettes).length === 0 ? (
        <Box
          sx={{
            height: '70vh',
            display: 'grid',
            placeItems: 'center'
          }}
        >
          <Box
            sx={{
              p: 3,
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              textAlign: 'center',
              maxWidth: '50ch'
            }}
          >
            <Heading as="h2" sx={{marginBottom: 1}}>
              Welcome
            </Heading>
            <Text sx={{marginBottom: 5, fontSize: 3, color: 'fg.muted'}}>
              Prism is a tool for creating cohesive, consistent, and accessible color palettes
            </Text>
            <AddPaletteSplitButton
              size="large"
              onAddPalette={() => send('CREATE_PALETTE')}
              onAddPresetPalette={presetId => send({type: 'CREATE_PRESET_PALETTE', presetId})}
            />
          </Box>
        </Box>
      ) : null}
    </div>
  )
}
