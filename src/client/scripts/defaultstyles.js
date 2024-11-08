import { Circle, Fill, Stroke, Style } from 'ol/style.js'

const fill = new Fill( { color: 'rgba(100,100,100,0.25)', } )
const stroke = new Stroke( { color: 'rgba(255,0,0,1)', width: 1.25, } )

const image = new Circle( { fill: fill, stroke: stroke, radius: 5, } )


export const DefaultPointStyle = new Style( {
    image: image
} )

export const DefaultLineStyle = new Style( {
    stroke: stroke
} )

export const DefaultPolygonStyle = new Style( {
    stroke: stroke,
    fill: fill,
} )


export function generateDefaultStyle( geometryType )
{

    let style = DefaultPolygonStyle // use Polygon as default
    switch ( geometryType )
    {
        case "Point":
        case "MultiPoint":
            style = DefaultPointStyle
            break
        case "LineString":
        case "MultiLineString":
            style = DefaultLineStyle
            break
    }
    return style
}

export function generateDefaultStyleObject( geometryType )
{
    const defaultFill = { _type: "CssParameters", _prefix: "fill", color: "#646464", opacity: 0.25 }
    const defualtStroke = { _type: "CssParameters", _prefix: "stroke", color: "#FF0000", opacity: 1, width: 1.25 }

    let defaultSymbolizer
    if ( geometryType == "Point" ) defaultSymbolizer = { _type: "PointSymbolizer", Graphic: { Mark: { WellKnownName: "circle", Fill: defaultFill, Stroke: defualtStroke }, Opacity: 1, Size: 5, Rotation: 0 } }
    else if ( geometryType == "Line" ) defaultSymbolizer = { _type: "LineSymbolizer", Stroke: defualtStroke }
    else if ( geometryType == "Polygon" ) defaultSymbolizer = { _type: "PolygonSymbolizer", Stroke: defualtStroke, Fill: defaultFill }

    const baseStyle = {
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
                        FeatureTypeStyles: [ {
                            _type: "FeatureTypeStyle",
                            // Name: "",
                            // Title: "",
                            // Abstract: "",
                            // FeatureTypeName: "",
                            Rules: [
                                {
                                    _type: "Rule",
                                    Name: "Rule Name",
                                    Title: "Rule Title",
                                    // Abstract: "",
                                    Filter: null,
                                    // MinScaleDenominator: null,
                                    // MaxScaleDenominator: null,
                                    // FeatureTypeName: "",
                                    Symbolizers: [defaultSymbolizer]
                                }
                            ]
                        } ]
                    }
                ]
            }
        ]
    }

    return baseStyle
}
