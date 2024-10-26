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

export function colorCodeToHEX( colorString, removeAlpha = true )
{
    const { isHEX, isRGB, isHSL, isHEXA, isRGBA, isHSLA } = determineColorFormats( colorString )

    if ( isHEX || isHEXA )
    {
        if ( removeAlpha ) return colorString.substring( 0, 7 )
        return colorString
    }

    const despaced = removeWhiteSpace( colorString )
    const v1 = despaced.replace( /\w+\((\d+),\d+%*,\d+%*,*\d*\.*\d*\)/, "$1" )
    const v2 = despaced.replace( /\w+\(\d+,(\d+)%*,\d+%*,*\d*\.*\d*\)/, "$1" )
    const v3 = despaced.replace( /\w+\(\d+,\d+%*,(\d+)%*,*\d*\.*\d*\)/, "$1" )
    const _alpha = ( despaced.replace( /\w+\(\d+,\d+%,\d+%,*(\d*\.*\d*)\)/, "$1" ) * 255 ).toString( 16 )

    if ( isRGB || isRGBA )
    {
        const red = v1.toString( 16 )
        const green = v2.toString( 16 )
        const blue = v3.toString( 16 )
        if ( removeAlpha ) return `#${red}${green}${blue}`
        return `#${red}${green}${blue}${_alpha}`
    }

    if ( isHSL || isHSLA )
    {
        const [ red, green, blue ] = hsl2rgb( v1, v2, v3 )
        if ( removeAlpha ) return `#${red.toString( 16 )}${green.toString( 16 )}${blue.toString( 16 )}`
        return `#${red.toString( 16 )}${green.toString( 16 )}${blue.toString( 16 )}${_alpha}`
    }
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


/**
 * 
 * Converts hue, saturation, luminosity to red, green and blue values, adapted from: https://en.wikipedia.org/wiki/HSL_and_HSV#HSL_to_RGB_alternative
 * 
 * @param {Number} h Hue in degrees [0-360]
 * @param {Number} s Saturation as fraction [0-1]
 * @param {Number} l Luminosity as fraction [0-1]
 * @returns {[r: number, g: number, b: number]}
 * Returns an array with red, green and blue values from 0-255
 * @example
 * const [red, green, blue] = hsl2rgb(37, 0.75, 0.24)
 */

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

export function radiusToTriangleBase( radius ) { return radius * ( 3 / 2 ) }

export function formatXML( xmlString )
{
    const PADDING = ' '.repeat( 2 )
    const regEx = /(>)(<)(\/*)/g
    let pad = 0

    xmlString = xmlString.replace( regEx, '$1\r\n$2$3' )

    return xmlString.split( '\r\n' ).map( ( node, index ) =>
    {
        let indent = 0

        if ( node.match( /.+<\/\w[^>]*>$/ ) ) indent = 0
        else if ( node.match( /^\s+>$/ ) ) pad -= 1
        else if ( node.match( /^\w+(?::|=).+/ ) && pad < 2 ) pad = 1
        else if ( node.match( /^<\/\w/ ) && pad > 0 ) pad -= 1
        else if ( node.match( /^<\w[^>]*[^\/]>.*$/ ) ) indent = 1
        else indent = 0

        pad += indent

        return PADDING.repeat( pad - indent ) + node
    } ).join( '\r\n' )
}


