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