import { Circle, RegularShape, Fill, Stroke, Style } from 'ol/style.js'

import { FlatCircle, FlatShape, FlatFill, FlatStroke, FlatStyle, FlatStyleLike } from 'ol/style/flat'

import { colorCodeToRGBA, degreesToRadians, formatXML, opacityFromColorCode, pythagorasDiagonalFromSide, radiusToTriangleBase } from './helpers'


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
        const graphic = symbolizer.Graphic
        const mark = symbolizer.Graphic.Mark
        const fillColor = colorCodeToRGBA( mark.Fill.color, mark.Fill.opacity )
        const strokeColor = colorCodeToRGBA( mark.Stroke.color, mark.Stroke.opacity )
        const strokeWidth = mark.Stroke.width
        switch ( mark.WellKnownName )
        {
            case "circle": return { "circle-radius": graphic.Size, "circle-fill-color": fillColor, "circle-stroke-color": strokeColor, "circle-stroke-width": strokeWidth }
            case "square": return { "shape-points": 4, "shape-radius": pythagorasDiagonalFromSide( graphic.Size ), "shape-angle": degreesToRadians( graphic.Rotation + 45 ), "shape-fill-color": fillColor, "shape-stroke-color": strokeColor, "shape-stroke-width": strokeWidth }
            case "triangle": return { "shape-points": 3, "shape-radius": radiusToTriangleBase( graphic.Size ), "shape-fill-color": fillColor, "shape-stroke-color": strokeColor, "shape-stroke-width": strokeWidth }
            case "star": return { "shape-points": 5, "shape-radius": graphic.Size, "shape-radius2": graphic.Size / 2, "shape-fill-color": fillColor, "shape-stroke-color": strokeColor, "shape-stroke-width": strokeWidth }
            case "cross": return { "shape-points": 4, "shape-radius": graphic.Size, "shape-radius2": 0.1, "shape-fill-color": fillColor, "shape-stroke-color": strokeColor, "shape-stroke-width": strokeWidth }
            case "x": return { "shape-points": 4, "shape-radius": graphic.Size, "shape-radius2": 0.1, "shape-angle": degreesToRadians( graphic.Rotation + 45 ), "shape-fill-color": fillColor, "shape-stroke-color": strokeColor, "shape-stroke-width": strokeWidth }
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
        const reversed = [ ...rule.Symbolizers ].reverse() // Array is reversed to make render order more intuitive.
        return {
            // filter: undefined, //TODO: Implement filter
            style: reversed.map( generateFlatStyle )
        }
    } )
    return rules
}

export function JSLDtoSLD( JSLDStyle )
{
    // temporarily add header until better solution
    const YSLDDoc = {
        _type: "StyledLayerDescriptor",
        NamedLayers: [
            {
                _type: "NamedLayer",
                Name: "Layer Name",
                // Description: "",
                UserStyles: [
                    {
                        _type: "UserStyle",
                        Name: "Style Name",
                        Title: "Style Title",
                        Abstract: "Style Abstract",
                        // IsDefault: false,
                        FeatureTypeStyles: [ JSLDStyle ]
                    }
                ]
            }
        ]
    }

    function createNode( tagName, content: any = "" ) { return `<${tagName}>${content}</${tagName}>` }
    function buildXML( obj )
    {
        if ( typeof obj !== "object" || obj === null ) return obj
        if ( Array.isArray( obj ) ) return obj.map( item => buildXML( item ) ).join( "" )

        const nodeType = obj._type || ""
        let xml = ""

        let namespaceInfo = `\r\nversion="1.0.0" \r\nxsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.0.0/StyledLayerDescriptor.xsd"`
        namespaceInfo += `\r\nxmlns="http://www.opengis.net/sld" \r\nxmlns:ogc="http://www.opengis.net/ogc" \r\nxmlns:xlink="http://www.w3.org/1999/xlink" \r\nxmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"`

        for ( const [ key, value ] of Object.entries( obj ) )
        {
            if ( key === "_type" ) continue // Skip "_type" key as it represents the XML element name

            // Recursive handling for child objects or arrays
            if ( [ "NamedLayers", "UserStyles", "FeatureTypeStyles", "Rules", "Symbolizers" ].includes( key ) ) xml += buildXML( value )
            else if ( typeof value === "object" )
            {
                const childXML = buildXML( value )
                if ( childXML ) xml += createNode( key, childXML )
            }
            else xml += createNode( key, value )
        }

        if ( nodeType === "CssParameters" && obj._prefix === "fill" ) return [
            `<CssParameter name="fill">${obj.color}</CssParameter>`,
            `<CssParameter name="fill-opacity">${obj.opacity}</CssParameter>`,
        ].join( "" )
        if ( nodeType === "CssParameters" && obj._prefix === "stroke" ) return [
            `<CssParameter name="stroke">${obj.color}</CssParameter>`,
            `<CssParameter name="stroke-width">${obj.width}</CssParameter>`,
            `<CssParameter name="stroke-opacity">${obj.opacity}</CssParameter>`,
        ].join( "" )

        if ( nodeType === "StyledLayerDescriptor" ) return `<${nodeType} ${namespaceInfo}\>\r\n\r\n${xml}</${nodeType}>`
        return nodeType ? `<${nodeType}>${xml}</${nodeType}>` : xml
    }

    const SLDDoc = buildXML( YSLDDoc )

    return formatXML( SLDDoc )
    return SLDDoc
}
