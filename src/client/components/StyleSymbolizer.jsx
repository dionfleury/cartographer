import { ColorInput, Group, Stack, Select, TextInput, Accordion, Center } from "@mantine/core"
import { IconSquare, IconVectorSpline } from "@tabler/icons-react"

import { StyleRuleMarkerIconSwitcher } from "./StyleRuleMarkerIconSwitcher"

import { swatches } from "../scripts/swatches"
import { useState } from "react"
import { useDispatch } from "../context/MapStylingContext"
import { toWellKnownName } from "../scripts/helpers"


import { ActionIcon } from "@mantine/core"


const colourFormats = [
    { value: 'hex', label: 'HEX' },
    { value: 'hexa', label: 'HEXA' },
    { value: 'rgb', label: 'RGB' },
    { value: 'rgba', label: 'RGBA' },
    { value: 'hsl', label: 'HSL' },
    { value: 'hsla', label: 'HSLA' }
]

export const StyleSymbolizer = ( { ruleIndex, symbolizerIndex, symbolizerObject } ) =>
{

    const dispatch = useDispatch()

    const type = symbolizerObject._type

    const graphicMark = symbolizerObject.Graphic?.Mark

    const stroke = ( type === "PointSymbolizer" ) ? graphicMark.Stroke : symbolizerObject.Stroke
    const fill = graphicMark?.Fill || symbolizerObject?.Fill || { color: '#64646440' }
    // const [hasFill, setHasFill] = useState(( symbolizerObject.Fill != null || graphicMark != null ))
    const hasFill = ( symbolizerObject.Fill != null || graphicMark != null )


    const [ colourFormat, setcolourFormat ] = useState( 'hexa' )

    function handleMarkChange( event )
    {
        // setHasFill( event.hasFill )
        console.log( event )
        // onRuleChanged( { pointMarker } )
        dispatch( {
            type: "setSymbolizer",
            ruleIndex,
            symbolizerIndex,
            symbolizer: {
                ...symbolizerObject,
                Graphic: {
                    ...symbolizerObject.Graphic,
                    Mark: {
                        ...symbolizerObject.Graphic.Mark,
                        WellKnownName: toWellKnownName( event.icon.replace( "Icon", "" ) )
                    }
                }
            }
        } )
    }
    function handleStrokeChange( value )
    {
        // setStrokeColour( value )
        // onRuleChanged( { id, rule: { stroke: { color: strokeColour } } } )
    }
    function handleFillChange( value )
    {
        // setFillColour( value )
        // onRuleChanged( { id, rule: { fill: { color: fillColour } } } )
    }

    function handlecolourFormatChange( value ) { setcolourFormat( value ) }

    return (
        <Accordion.Item value={`rules[${ruleIndex}].symbolizers[${symbolizerIndex}]`} >

            <Group justify="space-between" align="stretch">

                <Group p="md">
                    {( type === "PointSymbolizer" ) ? <StyleRuleMarkerIconSwitcher stroke={stroke.color} fill={fill.color} onIconChange={handleMarkChange} /> : null}
                    {( type === "LineSymbolizer" ) ? <IconVectorSpline color={stroke.color} /> : null}
                    {( type === "PolygonSymbolizer" ) ? <IconSquare color={stroke.color} fill={fill.color} /> : null}
                    <ColorInput format={colourFormat} swatchesPerRow={10} swatches={swatches} defaultValue={stroke.color} onChangeEnd={handleStrokeChange} label="Stroke" />
                    <ColorInput format={colourFormat} swatchesPerRow={10} swatches={swatches} defaultValue={fill.color} onChangeEnd={handleFillChange} label="Fill" disabled={!hasFill} />

                    <Select data={colourFormats} defaultValue="hexa" allowDeselect={false} onChange={handlecolourFormatChange} label="Format" w="86px" />
                </Group>

                <Accordion.Control w="unset" style={{ flexGrow: 1 }}/>

            </Group>


            <Accordion.Panel>
                <Group>
                    <TextInput label="Rule Name" placeholder="Legend Entry" ></TextInput>
                </Group>
            </Accordion.Panel>

        </Accordion.Item>
    )
}