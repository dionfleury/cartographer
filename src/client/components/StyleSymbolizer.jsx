import { ColorInput, Group, TextInput, Accordion, NumberInput } from "@mantine/core"
import { IconSquare, IconVectorSpline, IconX, IconArrowMoveDown, IconArrowMoveUp } from "@tabler/icons-react"

import { StyleRuleMarkerIconSwitcher } from "./StyleRuleMarkerIconSwitcher"

import { swatches } from "../scripts/swatches"
import { useEffect, useRef, useState } from "react"
import { useDispatch } from "../context/MapStylingContext"
import { colorCodeToHEX, colorCodeToRGBA, opacityFromColorCode, toWellKnownName } from "../scripts/helpers"


import { ActionIcon } from "@mantine/core"

export const StyleSymbolizer = ( { ruleIndex, symbolizerIndex, lastSymbolizerIndex, symbolizerObject, } ) =>
{

    const dispatch = useDispatch()

    const type = symbolizerObject._type

    const graphic = symbolizerObject.Graphic
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
    function handleMarkSizeChange( value )
    {
        dispatch( {
            type: "setSymbolizer",
            ruleIndex,
            symbolizerIndex,
            symbolizer: { ...symbolizerObject, Graphic: { ...symbolizerObject.Graphic, Size: value } }
        } )
    }
    function handleStrokeColorChange( value )
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
    function handleStrokeWidthChange( value )
    {
        dispatch( {
            type: "setSymbolizer",
            ruleIndex,
            symbolizerIndex,
            symbolizer: type === "PointSymbolizer" ?
                { ...symbolizerObject, Graphic: { ...symbolizerObject.Graphic, Mark: { ...symbolizerObject.Graphic.Mark, Stroke: { ...graphicMark.Stroke, width: value } } } } :
                { ...symbolizerObject, Stroke: { ...symbolizerObject.Stroke, width: value } }
        } )
    }
    function handleFillColorChange( value )
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
    function handleRemoveSymbolizer() { dispatch( { type: "removeSybolizer", ruleIndex, symbolizerIndex } ) }
    function handleMoveSymbolizerUp() { dispatch( { type: "moveSymbolizerUp", ruleIndex, symbolizerIndex } ) }
    function handleMoveSymbolizerDown() { dispatch( { type: "moveSymbolizerDown", ruleIndex, symbolizerIndex } ) }


    const iconFill = colorCodeToRGBA( fill.color, fill.opacity )
    const iconStroke = colorCodeToRGBA( stroke.color, stroke.opacity )

    return (
        <Accordion.Item value={`rules[${ruleIndex}].symbolizers[${symbolizerIndex}]`} >

                <Group justify="space-between" align="stretch" w="100%">

                    {/* <Indicator position="top-start" label={type} size={16}> */}
                    <Group p="md" pr="0" justify="space-between" wrap="nowrap" w="calc(100% - 64px)">
                        <Group gap="xs">
                            {( type === "PointSymbolizer" ) ? <StyleRuleMarkerIconSwitcher stroke={iconStroke} fill={iconFill} icon={graphicMark.WellKnownName} onIconChange={handleMarkChange} /> : null}
                            {( type === "LineSymbolizer" ) ? <IconVectorSpline style={{ boxSizing: "content-box", padding: "10px" }} color={iconStroke} /> : null}
                            {( type === "PolygonSymbolizer" ) ? <IconSquare style={{ boxSizing: "content-box", padding: "10px" }} color={iconStroke} fill={iconFill} /> : null}
                            <Group>
                                <ColorInput format="hexa" w="144px" swatchesPerRow={10} swatches={swatches} value={fill.color} onChangeEnd={handleFillColorChange} label="Fill" disabled={!hasFill} />
                                <ColorInput format="hexa" w="144px" swatchesPerRow={10} swatches={swatches} value={stroke.color} onChangeEnd={handleStrokeColorChange} label="Stroke" />
                            </Group>
                        </Group>
                        <Group py="md" gap="xs">
                            <ActionIcon color="blue" onClick={handleMoveSymbolizerUp} disabled={( symbolizerIndex === 0 )}><IconArrowMoveUp /></ActionIcon>
                            <ActionIcon color="blue" onClick={handleMoveSymbolizerDown} disabled={( symbolizerIndex === lastSymbolizerIndex )}><IconArrowMoveDown /></ActionIcon>
                            <ActionIcon color="red" onClick={handleRemoveSymbolizer} disabled={( symbolizerIndex === 0 )}><IconX /></ActionIcon>
                        </Group>



                    </Group>
                    {/* </Indicator> */}

                    <Accordion.Control w="48px" style={{ flexGrow: 1 }} />

                </Group>


            <Accordion.Panel>
                <Group>
                    {type === "PointSymbolizer" ? <NumberInput allowNegative={false} allowLeadingZeros={false} decimalScale={3} defaultValue={graphic.Size} fixedDecimalScale w="98px" label="Size" onChange={handleMarkSizeChange} /> : null}
                    <NumberInput allowNegative={false} allowLeadingZeros={false} decimalScale={3} defaultValue={stroke.width} fixedDecimalScale w="98px" label="Stroke Width" onChange={handleStrokeWidthChange} />
                </Group>


            </Accordion.Panel>

        </Accordion.Item>
    )
}