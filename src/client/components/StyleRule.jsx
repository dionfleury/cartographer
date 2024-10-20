import { ActionIcon, ColorInput, Group, Stack, Paper, Select, TextInput } from "@mantine/core"
import { useState } from "react"


import { swatches } from "../scripts/swatches"
import { StyleRuleMarkerIconSwitcher } from "./StyleRuleMarkerIconSwitcher"

const colourFormats = [
    { value: 'hex', label: 'HEX' },
    { value: 'hexa', label: 'HEXA' },
    { value: 'rgb', label: 'RGB' },
    { value: 'rgba', label: 'RGBA' },
    { value: 'hsl', label: 'HSL' },
    { value: 'hsla', label: 'HSLA' }
]

export const StyleRule = ( { children } ) =>
{

    const [ colourFormat, setcolourFormat ] = useState( 'hex' )
    const [ strokeColouor, setStrokeColouor ] = useState( '#000000' )
    const [ fillColour, setFillColour ] = useState( '#c92a2a' )
    const [ hasFill, setHasFill ] = useState( true )
    function handlecolourFormatChange( value ) { setcolourFormat( value ) }
    function handleIconChange( value ) { setHasFill( value ) }


    return (
        <Paper shadow="md" radius="md" p="md">
            <Group>
                <StyleRuleMarkerIconSwitcher stroke={strokeColouor} fill={fillColour} onIconChange={handleIconChange} />
                <Stack>
                    <Group>
                        <TextInput label="Rule Name" placeholder="Legend Entry" ></TextInput>
                    </Group>
                    <Group>
                        <ColorInput format={colourFormat} swatchesPerRow={10} swatches={swatches} defaultValue="#000000" onChange={( value ) => setStrokeColouor( value )} label="Stroke" />
                        <ColorInput format={colourFormat} swatchesPerRow={10} swatches={swatches} defaultValue="#c92a2a" onChange={( value ) => setFillColour( value )} label="Fill" disabled={!hasFill}/>

                        <Select data={colourFormats} defaultValue="hex" allowDeselect={false} onChange={handlecolourFormatChange} label="Format" w="86px" />
                    </Group>
                </Stack>


            </Group>


        </Paper>
    )
}