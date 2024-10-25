import { Circle, RegularShape, Fill, Stroke, Style } from 'ol/style.js'

import { FlatCircle, FlatShape, FlatFill, FlatStroke, FlatStyle, FlatStyleLike } from 'ol/style/flat'

import { colorCodeToRGBA, degreesToRadians, opacityFromColorCode, pythagorasDiagonalFromSide } from './helpers'


export function generateSLDStyle( rules, version )
{
    const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>'

    const v1_0Header = [
        `<StyledLayerDescriptor`,
        `version="1.0.0"`,
        `xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.0.0/StyledLayerDescriptor.xsd"`,
        `xmlns:ogc="http://www.opengis.net/ogc"`,
        `xmlns:xlink="http://www.w3.org/1999/xlink"`,
        `xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">`
    ].join( "\n\t" )

    // const sldRules = rules.map( rule =>
    // {
    //     const name = `<Name>${rule.name}</Name>`
    //     const title = `<Name>${rule.title}</Name>`
    //     const abstract = `<Name>${rule.abstract}</Name>`
    // } )

    // console.log( [ xmlHeader, v1_0Header ].join( "\n" ) )


}

export type JSLDStyle = {
    NamedLayers: Array<NamedLayer>,
    UserLayers: Array<UserLayer>
}

export type NamedLayer = {
    Name: String,
    Description?: String,
    UserStyles: Array<UserStyle>
}

export type UserStyle = {
    Name?: String,
    Title?: String,
    Abstract?: String,
    IsDefault?: Boolean,
    FeatureTypeStyles: Array<FeatureTypeStyle>
}

export type FeatureTypeStyle = {
    Name?: String,
    Title?: String,
    Abstract?: String,
    FeatureTypeName?: String,
    Rules: Array<Rule>
}

export type Rule = {
    Name?: String,
    Title?: String,
    Abstract?: String,
    Filter?: Filter,
    MinScaleDenominator?: Number,
    MaxScaleDenominator?: Number,
    FeatureTypeName?: String,
    PointSymbolizers?: Array<PointSymbolizer>
}

export type Filter = {

}

export type PointSymbolizer = {
    Geometry?: any,
    Graphic: Graphic
}

type _GraphicBase = {
    Opacity?: Number,
    Size?: Number,
    Rotation?: Number
}

type _GraphicWithMark = _GraphicBase & {
    Mark: Mark
    ExternalGraphic?: never,
}
type _GraphicWithExternal = _GraphicBase & {
    ExternalGraphic: ExternalGraphic,
    Mark?: never
}

export type Graphic = _GraphicWithMark | _GraphicWithExternal

export type Mark = {

}

export type ExternalGraphic = {

}

export type UserLayer = {

}

function generateFlatStyle( symbolizer ): FlatStyleLike
{

    if ( symbolizer.Graphic != undefined )
    {
        const mark = symbolizer.Graphic.Mark
        const fillColor = colorCodeToRGBA( mark.Fill.color, mark.Fill.opacity )
        const strokeColor = colorCodeToRGBA( mark.Stroke.color, mark.Stroke.opacity )
        const strokeWidth = mark.Stroke.width
        switch ( mark.WellKnownName )
        {
            case "circle": return { "circle-radius": 5, "circle-fill-color": fillColor, "circle-stroke-color": strokeColor, "circle-stroke-width": strokeWidth }
            case "square": return { "shape-points": 4, "shape-radius": pythagorasDiagonalFromSide( 5 ), "shape-angle": degreesToRadians( 45 ), "shape-fill-color": fillColor, "shape-stroke-color": strokeColor, "shape-stroke-width": strokeWidth }
            case "triangle": return { "shape-points": 3, "shape-radius": 5, "shape-fill-color": fillColor, "shape-stroke-color": strokeColor, "shape-stroke-width": strokeWidth }
            case "star": return { "shape-points": 5, "shape-radius": 5, "shape-radius2": 2.5, "shape-fill-color": fillColor, "shape-stroke-color": strokeColor, "shape-stroke-width": strokeWidth }
            case "cross": return { "shape-points": 4, "shape-radius": 5, "shape-radius2": 0.1, "shape-fill-color": fillColor, "shape-stroke-color": strokeColor, "shape-stroke-width": strokeWidth }
            case "x": return { "shape-points": 4, "shape-radius": 5, "shape-radius2": 0.1, "shape-angle": degreesToRadians( 45 ), "shape-fill-color": fillColor, "shape-stroke-color": strokeColor, "shape-stroke-width": strokeWidth }
        }
    }
    const style = {}
    if ( symbolizer.Fill != undefined ) style[ "fill-color" ] = colorCodeToRGBA( symbolizer.Fill.color, symbolizer.Fill.opacity )
    if ( symbolizer.Stroke != undefined )
    {
        style[ "stroke-color" ] = colorCodeToRGBA( symbolizer.Stroke.color, symbolizer.Stroke.opacity )
        style[ "stroke-width" ] = symbolizer.Stroke.width
    }
    return style
}


export function JSLDtoOpenLayers( JSLDstyle )
{

    const rules = JSLDstyle.Rules.map( rule =>
    {
        return {
            // filter: undefined, //TODO: Implement filter
            style: rule.Symbolizers.map( generateFlatStyle )
        }
    } )
    return rules
}