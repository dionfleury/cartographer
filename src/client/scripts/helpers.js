export function getPrimitiveGeometryType( string )
{
    switch ( string )
    {
        case "Point":
        case "MultiPoint":
            return "Point"
        case "Line":
        case "LineString":
        case "MultiLineString":
            return "Line"
        case "Polygon":
        case "MultiPolygon":
            return "Polygon"
    }
}

export function toWellKnownName( shapeName )
{
    switch ( shapeName )
    {
        case "Circle": return "circle"
        case "Square": return "square"
        case "Triangle": return "triangle"
        case "Star": return "star"
        case "Plus": return "cross"
        case "X": return "x"
    }
}

export function toHEXRGB( color ) {
    
}