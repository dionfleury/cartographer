export async function wfsGetCapabilitiesRequest( wfsServiceURL )
{
    try
    {
        const response = await fetch( `${wfsServiceURL}?request=GetCapabilities` )
        if ( response.status !== 200 ) throw new Error( "Non-200 response" )

        const xmlResponse = await response.text()
        const parser = new DOMParser()
        const getCapabilitiesDocument = parser.parseFromString( xmlResponse, "text/xml" )
        
        const featureTypes = []

        for ( const featuretype of getCapabilitiesDocument.getElementsByTagName( "FeatureType" ) )
        {

            const typeName = featuretype.getElementsByTagName( "Name" )[ 0 ].textContent
            const workspace = typeName.split( ":" )[ 0 ]
            const title = featuretype.getElementsByTagName( "Title" )[ 0 ].textContent
            const CRS = featuretype.getElementsByTagName( "DefaultCRS" )[ 0 ].textContent.replace( /.*EPSG::(.*)/, "EPSG:$1" )
            const getFeatureURL = `${wfsServiceURL}?service=WFS&version=1.1.0&request=getFeature&typename=${typeName}&outputFormat=application/json&srsname=${CRS}`
            const describeFeatureURL = `${wfsServiceURL}?service=WFS&version=1.1.0&request=DescribeFeatureType&typename=${typeName}&outputFormat=application/json`

            featureTypes.push( { workspace, title, typeName, CRS, getFeatureURL, describeFeatureURL } )
        }

        return featureTypes

    } catch ( error ) { console.error( error ) }
}

export async function wfsDescribeFeatureRequest( wfsDescribeFeatureURL )
{
    const request = await fetch( wfsDescribeFeatureURL )
    const response = await request.json()
    const featureTypeProperties = response.featureTypes[ 0 ].properties

    return featureTypeProperties
}