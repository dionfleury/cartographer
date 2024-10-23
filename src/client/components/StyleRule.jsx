import { ActionIcon, ColorInput, Group, Stack, Paper, Select, TextInput } from "@mantine/core"
import { useState } from "react"

import { IconSquare, IconVectorSpline } from "@tabler/icons-react"

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

export const StyleRule = ( { id, type, onRuleChanged } ) =>
{

    const [ colourFormat, setcolourFormat ] = useState( 'hexa' )
    const [ strokeColour, setStrokeColour ] = useState( '#FF0000FF' )
    const [ fillColour, setFillColour ] = useState( '#64646440' )
    const [ pointMarker, setPointMarker ] = useState( null )
    const [ hasFill, setHasFill ] = useState( true )
    function handlecolourFormatChange( value ) { setcolourFormat( value ) }

    function handleIconChange( event )
    {
        setHasFill( event.hasFill )
        setPointMarker( event.icon.replace( "Icon", "" ) )
        onRuleChanged( { pointMarker } )
    }
    function handleStrokeChange( value )
    {
        setStrokeColour( value )
        onRuleChanged( { id, rule: { stroke: { color: strokeColour } } } )
    }
    function handleFillChange( value )
    {
        setFillColour( value )
        onRuleChanged( { id, rule: { fill: { color: fillColour } } } )
    }

    return (
        <Paper shadow="md" radius="md" p="md">
            <Group>
                {( type == "Point" ) ? <StyleRuleMarkerIconSwitcher stroke={strokeColour} fill={fillColour} onIconChange={handleIconChange} /> : null}
                {( type == "Line" ) ? <IconVectorSpline color={strokeColour} /> : null}
                {( type == "Polygon" ) ? <IconSquare color={strokeColour} fill={fillColour} /> : null}
                <Stack>
                    <Group>
                        <TextInput label="Rule Name" placeholder="Legend Entry" ></TextInput>
                    </Group>
                    <Group>
                        <ColorInput format={colourFormat} swatchesPerRow={10} swatches={swatches} defaultValue={strokeColour} onChangeEnd={handleStrokeChange} label="Stroke" />
                        <ColorInput format={colourFormat} swatchesPerRow={10} swatches={swatches} defaultValue={fillColour} onChangeEnd={handleFillChange} label="Fill" disabled={!hasFill || ( type === "Line" )} />

                        <Select data={colourFormats} defaultValue="hexa" allowDeselect={false} onChange={handlecolourFormatChange} label="Format" w="86px" />
                    </Group>
                </Stack>


            </Group>


        </Paper>
    )
}