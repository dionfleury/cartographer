import { rule } from "postcss"

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

    console.log( [ xmlHeader, v1_0Header ].join( "\n" ) )


}