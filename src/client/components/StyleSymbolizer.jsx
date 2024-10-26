import { ColorInput, Group, TextInput, Accordion, Indicator } from "@mantine/core"
import { IconSquare, IconVectorSpline, IconX } from "@tabler/icons-react"

import { StyleRuleMarkerIconSwitcher } from "./StyleRuleMarkerIconSwitcher"

import { swatches } from "../scripts/swatches"
import { useEffect, useState } from "react"
import { useDispatch } from "../context/MapStylingContext"
import { colorCodeToHEX, colorCodeToRGBA, opacityFromColorCode, toWellKnownName } from "../scripts/helpers"


import { ActionIcon } from "@mantine/core"




export const StyleSymbolizer = ( { ruleIndex, symbolizerIndex, symbolizerObject, } ) =>
{

    const dispatch = useDispatch()

    const type = symbolizerObject._type

    const graphicMark = symbolizerObject.Graphic?.Mark

    const stroke = ( type === "PointSymbolizer" ) ? graphicMark.Stroke : symbolizerObject.Stroke
    const fill = graphicMark?.Fill || symbolizerObject?.Fill || { color: '#64646440' }
    // const [hasFill, setHasFill] = useState(( symbolizerObject.Fill != null || graphicMark != null ))
    const hasFill = ( symbolizerObject.Fill != null || graphicMark != null )


    function handleMarkChange( event )
    {
        dispatch( {
            type: "setSymbolizer",
            ruleIndex,
            symbolizerIndex,
            symbolizer: { ...symbolizerObject, Graphic: { ...symbolizerObject.Graphic, Mark: { ...symbolizerObject.Graphic.Mark, WellKnownName: toWellKnownName( event.icon.replace( "Icon", "" ) ) } } }
        } )
    }
    function handleStrokeChange( value )
    {
        dispatch( {
            type: "setSymbolizer",
            ruleIndex,
            symbolizerIndex,
            symbolizer: type === "PointSymbolizer" ?
                { ...symbolizerObject, Graphic: { ...symbolizerObject.Graphic, Mark: { ...symbolizerObject.Graphic.Mark, Stroke: { ...graphicMark.Stroke, color: colorCodeToHEX( value ), opacity: opacityFromColorCode( value ) } } } } :
                { ...symbolizerObject, Stroke: { ...symbolizerObject.Stroke, color: colorCodeToHEX( value ), opacity: opacityFromColorCode( value ) } }
        } )
    }
    function handleFillChange( value )
    {
        dispatch( {
            type: "setSymbolizer",
            ruleIndex,
            symbolizerIndex,
            symbolizer: type === "PointSymbolizer" ?
                { ...symbolizerObject, Graphic: { ...symbolizerObject.Graphic, Mark: { ...symbolizerObject.Graphic.Mark, Fill: { ...graphicMark.Fill, color: colorCodeToHEX( value ), opacity: opacityFromColorCode( value ) } } } } :
                { ...symbolizerObject, Fill: { ...symbolizerObject.Fill, color: colorCodeToHEX( value ), opacity: opacityFromColorCode( value ) } }
        } )
    }
    function handleRemoveSymbolizer()
    {
        dispatch( {
            type: "removeSybolizer",
            ruleIndex, symbolizerIndex
        } )
    }

    const iconFill = colorCodeToRGBA( fill.color, fill.opacity )
    const iconStroke = colorCodeToRGBA( stroke.color, stroke.opacity )

    return (
        <Accordion.Item value={`rules[${ruleIndex}].symbolizers[${symbolizerIndex}]`} >

            <Group justify="space-between" align="stretch">

                {/* <Indicator position="top-start" label={type} size={16}> */}
                <Group p="md">
                    {( type === "PointSymbolizer" ) ? <StyleRuleMarkerIconSwitcher stroke={iconStroke} fill={iconFill} onIconChange={handleMarkChange} /> : null}
                    {( type === "LineSymbolizer" ) ? <IconVectorSpline color={iconStroke} /> : null}
                    {( type === "PolygonSymbolizer" ) ? <IconSquare color={iconStroke} fill={iconFill} /> : null}
                    <ColorInput format="hexa" swatchesPerRow={10} swatches={swatches} defaultValue={stroke.color} onChangeEnd={handleStrokeChange} label="Stroke" />
                    <ColorInput format="hexa" swatchesPerRow={10} swatches={swatches} defaultValue={fill.color} onChangeEnd={handleFillChange} label="Fill" disabled={!hasFill} />
                </Group>
                {/* </Indicator> */}

                <Accordion.Control w="unset" style={{ flexGrow: 1 }} />
                {/* <Group>
                    <ActionIcon color="red" onClick={handleRemoveSymbolizer} disabled={( symbolizerIndex === 0 )}><IconX /></ActionIcon>
                    <ActionIcon color="red" onClick={handleRemoveSymbolizer} disabled={( symbolizerIndex === 0 )}><IconX /></ActionIcon>
                </Group> */}
            </Group>


            <Accordion.Panel>
                <Group>
                    <TextInput label="Rule Name" placeholder="Legend Entry" ></TextInput>
                </Group>
            </Accordion.Panel>

        </Accordion.Item>
    )
}