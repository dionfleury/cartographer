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
    const baseStyle = {
        _type: "FeatureTypeStyle",
        // Name: "",
        // Title: "",
        // Abstract: "",
        // FeatureTypeName: "",
        Rules: [
            {
                _type: "Rule",
                Name: "",
                Title: "",
                // Abstract: "",
                Filter: null,
                // MinScaleDenominator: null,
                // MaxScaleDenominator: null,
                // FeatureTypeName: "",
                Symbolizers: []
            }
        ]
    }
    if ( geometryType == "Point" )
    {
        baseStyle.Rules[ 0 ].Symbolizers[ 0 ] = {
            _type: "PointSymbolizer",
            Graphic: {
                Mark: {
                    WellKnownName: "circle",
                    Fill: { color: "#646464", opacity: 0.25 },
                    Stroke: { color: "#FF0000", opacity: 1, width: 1.25 }
                }
            },
            Opacity: 1,
            Size: 5,
            Rotation: 0
        }
        return baseStyle
    }
    else if ( geometryType == "Line" )
    {
        baseStyle.Rules[ 0 ].Symbolizers[ 0 ] = {
            _type: "LineSymbolizer",
            Stroke: { color: "#FF0000", opacity: 1, width: 1.25 }
        }
        return baseStyle
    }
    else if ( geometryType == "Polygon" )
    {
        baseStyle.Rules[ 0 ].Symbolizers[ 0 ] = {
            _type: "PolygonSymbolizer",
            Stroke: { color: "#FF0000", opacity: 1, width: 1.25 },
            Fill: { color: "#646464", opacity: 0.25 }
        }
        return baseStyle
    }
}
