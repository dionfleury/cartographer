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

export function RGBtoHEX( stcolorStringring, removeAlpha = true )
{
    const { isHEX, isRGB, isHSL, isHEXA, isRGBA, isHSLA } = determineColorFormats( colorString )
}


export function colorToHEX( colorString, removeAlpha = true )
{

}

export function colorCodeToRGBA( colorString, alpha = 1 )
{
    const { isHEX, isRGB, isHSL, isHEXA, isRGBA, isHSLA } = determineColorFormats( colorString )

    if ( isRGBA ) return colorString
    if ( isRGB ) return colorString.replace( ")", `, ${alpha})` )

    if ( isHEX || isHEXA )
    {
        const red = Number( parseInt( colorString.substring( 1, 3 ), 16 ) )
        const green = Number( parseInt( colorString.substring( 3, 5 ), 16 ) )
        const blue = Number( parseInt( colorString.substring( 5, 7 ), 16 ) )
        if ( isHEX ) return `rgba(${red}, ${green}, ${blue}, ${alpha})`
        const _alpha = Number( ( parseInt( colorString.substring( 7, 9 ), 16 ) / 255 ).toFixed( 3 ) )
        return `rgba(${red}, ${green}, ${blue}, ${_alpha})`
    }

    if ( isHSL || isHSLA )
    {
        const despaced = removeWhiteSpace( colorString )
        const hue = despaced.replace( /\w+\((\d+),\d+%,\d+%,*\d*\.*\d*\)/, "$1" )
        const saturation = despaced.replace( /\w+\(\d+,(\d+)%,\d+%,*\d*\.*\d*\)/, "$1" ) / 100
        const luminosity = despaced.replace( /\w+\(\d+,\d+%,(\d+)%,*\d*\.*\d*\)/, "$1" ) / 100
        const [ red, green, blue ] = hsl2rgb( hue, saturation, luminosity )
        if ( isHSL ) { return `rgba(${red}, ${green}, ${blue}, ${alpha})` }
        const _alpha = despaced.replace( /\w+\(\d+,\d+%,\d+%,*(\d*\.*\d*)\)/, "$1" )
        return `rgba(${red}, ${green}, ${blue}, ${_alpha})`
    }

}

export function opacityFromColorCode( colorString )
{
    const { isHEX, isRGB, isHSL, isHEXA, isRGBA, isHSLA } = determineColorFormats( colorString )

    if ( isHEX || isRGB || isHSL ) return 1
    if ( isRGBA || isHSLA ) return Number( colorString.replace( /\s/g, "" ).replace( /\w+\(\d+,\d+%*,\d+%*,(\d+\.*\d*)\)/, "$1" ) )
    if ( isHEXA ) return Number( ( parseInt( colorString.substring( 7, 9 ), 16 ) / 255 ).toFixed( 3 ) )
}

function removeWhiteSpace( colorString ) { return colorString.replace( /\s/g, "" ) }

function isHEXFormat( colorString ) { return /^#([a-f0-9]{6}|[a-f0-9]{3})$/gi.test( colorString ) }
function isHEXAFormat( colorString ) { return /^#([a-f0-9]{8}|[a-f0-9]{4})$/gi.test( colorString ) }
function isRGBFormat( colorString ) { return /^rgba\(\d+,\d+,\d+\)/.test( colorString ) }
function isRGBAFormat( colorString ) { return /^rgba\(\d+,\d+,\d+,\d+\.*\d*\)/.test( colorString ) }
function isHSLFormat( colorString ) { return /hsl\(\d+,\d+%,\d+%\)/.test( colorString ) }
function isHSLAFormat( colorString ) { return /hsla\(\d+,\d+%,\d+%,\d+\.*\d*\)/.test( colorString ) }

function determineColorFormats( string )
{
    const despaced = removeWhiteSpace( string )
    return {
        isHEX: isHEXFormat( despaced ),
        isHEXA: isHEXAFormat( despaced ),
        isRGB: isRGBFormat( despaced ),
        isRGBA: isRGBAFormat( despaced ),
        isHSL: isHSLFormat( despaced ),
        isHSLA: isHSLAFormat( despaced )
    }

}

function hsl2rgb( h, s, l ) 
{
    let a = s * Math.min( l, 1 - l )
    let f = ( n, k = ( n + h / 30 ) % 12 ) => l - a * Math.max( Math.min( k - 3, 9 - k, 1 ), -1 )
    return [
        Number( ( f( 0 ) * 255 ).toFixed( 0 ) ),
        Number( ( f( 8 ) * 255 ).toFixed( 0 ) ),
        Number( ( f( 4 ) * 255 ).toFixed( 0 ) )
    ]
}

export function degreesToRadians( degrees ) { return degrees * ( Math.PI / 180 ) }

export function pythagorasDiagonalFromSide( side ) { return side * Math.SQRT2 }