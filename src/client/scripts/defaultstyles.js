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