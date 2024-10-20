import { DEFAULT_THEME } from "@mantine/core"

export const swatches = [
    ...DEFAULT_THEME.colors.dark,
    ...DEFAULT_THEME.colors.gray,
    ...DEFAULT_THEME.colors.red,
    ...DEFAULT_THEME.colors.pink,
    ...DEFAULT_THEME.colors.grape,
    ...DEFAULT_THEME.colors.violet,
    ...DEFAULT_THEME.colors.indigo,
    ...DEFAULT_THEME.colors.blue,
    ...DEFAULT_THEME.colors.cyan,
    ...DEFAULT_THEME.colors.teal,
    ...DEFAULT_THEME.colors.green,
    ...DEFAULT_THEME.colors.lime,
    ...DEFAULT_THEME.colors.yellow,
    ...DEFAULT_THEME.colors.orange,
]

function get_saturated_palette()
{
    const swatches = [ '#FFFFFF' ]
    for ( const group of Object.keys(DEFAULT_THEME.colors) ) swatches.push( DEFAULT_THEME.colors[group][ 9 ] )
    return swatches
}

export const saturated = get_saturated_palette()