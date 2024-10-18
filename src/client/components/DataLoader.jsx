import { Group, TextInput, Text, Autocomplete, Fieldset, ActionIcon, Badge } from "@mantine/core"
import { IconPlugConnected, IconX, IconCheck, IconLayersSubtract } from "@tabler/icons-react"

import { useRef, useState } from "react"
import { notifications } from '@mantine/notifications'

export const DataLoader = () =>
{
    const wfsRef = useRef()
    const [ layers, setLayers ] = useState( null )
    const [ layernames, setLayernames ] = useState( null )
    const [ wfserror, setWfserror ] = useState( false )

    async function wfs_request()
    {
        try
        {
            setLayers( null )
            setLayernames( null )
            setWfserror( false )
            const response = await fetch( `${wfsRef.current.value}?request=GetCapabilities` )
            const xmlresponse = await response.text()
            const parser = new DOMParser()
            const getcapabilitiesdoc = parser.parseFromString( xmlresponse, "text/xml" )

            const layernames = []
            const featurelayers = []
            for ( const featuretype of getcapabilitiesdoc.getElementsByTagName( "FeatureType" ) )
            {
                const workspace = featuretype.getElementsByTagName( "Name" )[ 0 ].textContent.split( ":" )[ 0 ]
                const title = featuretype.getElementsByTagName( "Title" )[ 0 ].textContent
                const CRS = featuretype.getElementsByTagName( "DefaultCRS" )[ 0 ].textContent.replace( /.*EPSG::(.*)/, "$1" )
                // const abstract = featuretype.getElementsByTagName( "Abstract" )[ 0 ].textContent

                featurelayers[ title ] = { workspace, title, CRS }

                layernames.push( featuretype.getElementsByTagName( "Title" )[ 0 ].textContent )
            }

            console.log( featurelayers )
            setLayers( featurelayers )
            setLayernames( layernames )

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
            setWfserror( true )
            console.error( error )
        }

    }

    const renderAutocompleteOption = ( { option } ) => (
        <Group justify="space-between" >
            <Group>
                <IconLayersSubtract />
                <Badge variant="default" color="blue" radius="xs">{layers[ option.value ].workspace}</Badge>
                <Text>{layers[ option.value ].title}</Text>
            </Group>
            <Badge>{layers[ option.value ].CRS}</Badge>
        </Group>
    )


    return (
        <Fieldset legend="Load data from WFS">
            <TextInput
                ref={wfsRef}
                label="WFS URL"
                error={wfserror}
                placeholder="https://example.com/geoserver/wfs"
                rightSection={<ActionIcon onClick={wfs_request}><IconPlugConnected /></ActionIcon>}
            />

            <Autocomplete
                label="Select Layer"
                placeholder="Pick layer or enter anything"
                data={layernames}
                renderOption={renderAutocompleteOption}
                disabled={layernames == null ? true : false}
            />

        </Fieldset>





    )
}