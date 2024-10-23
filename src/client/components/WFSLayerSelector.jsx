import { Group, TextInput, Text, Autocomplete, Fieldset, ActionIcon, Badge, Container } from "@mantine/core"
import { IconPlugConnected, IconX, IconCheck, IconLayersSubtract } from "@tabler/icons-react"

import { useRef, useState } from "react"
import { notifications } from '@mantine/notifications'
import { useDisclosure } from "@mantine/hooks"

import { generateDefaultStyle } from "../scripts/defaultstyles"
import { getPrimitiveGeometryType } from "../scripts/helpers"

export const WFSLayerSelector = ( { onLayerSelected } ) =>
{
    const wfsRef = useRef()
    const [ layers, setLayers ] = useState( null )
    const [ layernames, setLayernames ] = useState( null )
    const [ wfserror, setWfserror ] = useState( false )

    const [ loading, setLoading ] = useState( false )
    const [ connected, setConnected ] = useState( false )

    async function wfsGetCapabilitiesRequest()
    {
        setConnected( false )
        setLoading( true )
        try
        {
            setLayers( null )
            setLayernames( null )
            setWfserror( false )
            const response = await fetch( `${wfsRef.current.value}?request=GetCapabilities` )
            if ( response.status !== 200 ) throw new Error( "Non-200 response" )
            const xmlresponse = await response.text()
            const parser = new DOMParser()
            const getcapabilitiesdoc = parser.parseFromString( xmlresponse, "text/xml" )

            const layernames = []
            const featurelayers = []
            for ( const featuretype of getcapabilitiesdoc.getElementsByTagName( "FeatureType" ) )
            {
                const typename = featuretype.getElementsByTagName( "Name" )[ 0 ].textContent
                const workspace = typename.split( ":" )[ 0 ]
                const title = featuretype.getElementsByTagName( "Title" )[ 0 ].textContent
                const CRS = featuretype.getElementsByTagName( "DefaultCRS" )[ 0 ].textContent.replace( /.*EPSG::(.*)/, "EPSG:$1" )
                // const abstract = featuretype.getElementsByTagName( "Abstract" )[ 0 ].textContent
                const getfeature_url = `${wfsRef.current.value}?service=WFS&version=1.1.0&request=getFeature&typename=${typename}&outputFormat=application/json&srsname=${CRS}`
                const describefeature_url = `${wfsRef.current.value}?service=WFS&version=1.1.0&request=DescribeFeatureType&typename=${typename}&outputFormat=application/json`

                featurelayers[ title ] = { workspace, title, typename, CRS, getfeature_url, describefeature_url }

                layernames.push( featuretype.getElementsByTagName( "Title" )[ 0 ].textContent )
            }

            setLayers( featurelayers )
            setLayernames( layernames )

            setLoading( false )
            setConnected( true )

            notifications.show( {
                position: 'top-right',
                withCloseButton: true,
                autoClose: 5000,
                title: "Success!",
                message: `Connected to WFS Server at: ${wfsRef.current.value}`,
                color: 'teal',
                icon: <IconCheck />
            } )
        } catch ( error )
        {
            notifications.show( {
                position: 'top-right',
                withCloseButton: true,
                autoClose: 5000,
                title: "Error!",
                message: `Can't connect to WFS Server: check your URL. Check the JS console for detailed error`,
                color: 'red',
                icon: <IconX />
            } )
            setWfserror( "Can't connect to WFS Server: check your URL." )
            setLoading( false )
            console.error( error )
        }
    }

    async function wfsDescribeFeatureRequest( url )
    {
        const request = await fetch( url )
        const response = await request.json()
        const featureTypeProperties = response.featureTypes[ 0 ].properties

        return featureTypeProperties
    }


    async function handleLayerSelection( event )
    {
        if ( layernames.indexOf( event ) === -1 ) return // Just in case...

        const selectedLayer = layers[ event ]

        const schema = await wfsDescribeFeatureRequest( selectedLayer.describefeature_url )
        // This breaks if there's ever more than one geometry on a feature, but you shouldn't be using this app if that's the case.
        const geometryType = schema.find( column => /gml:\w+/.test( column.type ) ).localType

        const defaultStyle = generateDefaultStyle( geometryType )
        const primitiveGeometryType = getPrimitiveGeometryType( geometryType )

        onLayerSelected( { ...selectedLayer, schema, geometryType, primitiveGeometryType, defaultStyle } )
    }


    const renderAutocompleteOption = ( { option } ) => (
        <Group justify="space-between" w="100%">
            <Group>
                <IconLayersSubtract />
                <Badge variant="default" color="blue" radius="xs">{layers[ option.value ].workspace}</Badge>
                <Text>{layers[ option.value ].title}</Text>
            </Group>
            <Badge>{layers[ option.value ].CRS}</Badge>
        </Group>
    )


    return (
        <Container className="bg-darker" p="md" w="100%">

            <Fieldset legend="Load data from WFS">
                <TextInput
                    ref={wfsRef}
                    label="WFS URL"
                    error={wfserror}
                    placeholder="https://example.com/geoserver/wfs"
                    rightSection={
                        <ActionIcon
                            loading={loading}
                            color={loading ? "yellow" : connected ? "green" : "blue"}
                            onClick={wfsGetCapabilitiesRequest}>
                            {connected ? <IconCheck /> : <IconPlugConnected />}
                        </ActionIcon>
                    }
                />

                <Autocomplete
                    label="Select Layer"
                    placeholder="Pick layer or enter anything"
                    data={layernames}
                    renderOption={renderAutocompleteOption}
                    disabled={layernames == null ? true : false}
                    onOptionSubmit={handleLayerSelection}

                />

            </Fieldset>

        </Container>



    )
}