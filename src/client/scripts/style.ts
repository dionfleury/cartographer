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

