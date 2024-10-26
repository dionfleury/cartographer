import { Group, TextInput, Text, Fieldset, ActionIcon, Badge, Container, Input, InputBase, CheckIcon, Combobox, useCombobox, Stack } from "@mantine/core"
import { IconPlugConnected, IconX, IconCheck, IconLayersSubtract } from "@tabler/icons-react"

import { useRef, useState } from "react"
import { notifications } from '@mantine/notifications'
import { useDisclosure } from "@mantine/hooks"

import { generateDefaultStyle, generateDefaultStyleObject } from "../scripts/defaultstyles"
import { getPrimitiveGeometryType } from "../scripts/helpers"

import { useDispatch } from "../context/MapStylingContext"

import { wfsDescribeFeatureRequest, wfsGetCapabilitiesRequest } from "../scripts/WFSClient"


export const WFSLayerSelector = ( { onLayerSelected } ) =>
{
    const wfsRef = useRef()
    const [ layers, setLayers ] = useState( [] )
    // const [ layernames, setLayernames ] = useState( null )
    const [ layerSearch, setLayerSearch ] = useState( '' )
    const [ wfserror, setWfserror ] = useState( false )
    const [ currentLayer, setCurrentLayer ] = useState( null )

    const [ isLoading, setIsLoading ] = useState( false )
    const [ isConnected, setIsConnected ] = useState( false )

    const dispatch = useDispatch()



    const combobox = useCombobox( {
        onDropdownClose: () =>
        {
            combobox.resetSelectedOption()
            combobox.focusTarget()
            setLayerSearch( '' )
        },
        onDropdownOpen: () => { combobox.focusSearchInput() }
    } )


    async function getCapabilities()
    {
        setIsConnected( false )
        setIsLoading( true )
        setLayers( [] )
        // setLayernames( null )
        setWfserror( false )
        try
        {
            const featureLayers = await wfsGetCapabilitiesRequest( wfsRef.current.value )
            setLayers( featureLayers )
            // setLayernames( layernames )

            setIsLoading( false )
            setIsConnected( true )

        } catch ( error )
        {
            setWfserror( "Can't connect to WFS Server: check your URL." )
            setIsLoading( false )
            console.error( error )
        }
    }
    // async function getCapabilities()
    // {
    //     setConnected( false )
    //     setLoading( true )
    //     try
    //     {
    //         setLayers( [] )
    //         setLayernames( null )
    //         setWfserror( false )
    //         const response = await fetch( `${wfsRef.current.value}?request=GetCapabilities` )
    //         if ( response.status !== 200 ) throw new Error( "Non-200 response" )
    //         const xmlresponse = await response.text()
    //         const parser = new DOMParser()
    //         const getcapabilitiesdoc = parser.parseFromString( xmlresponse, "text/xml" )

    //         const layernames = []
    //         const featurelayers = []
    //         for ( const featuretype of getcapabilitiesdoc.getElementsByTagName( "FeatureType" ) )
    //         {
    //             const typename = featuretype.getElementsByTagName( "Name" )[ 0 ].textContent
    //             const workspace = typename.split( ":" )[ 0 ]
    //             const title = featuretype.getElementsByTagName( "Title" )[ 0 ].textContent
    //             const CRS = featuretype.getElementsByTagName( "DefaultCRS" )[ 0 ].textContent.replace( /.*EPSG::(.*)/, "EPSG:$1" )
    //             // const abstract = featuretype.getElementsByTagName( "Abstract" )[ 0 ].textContent
    //             const getFeatureURL = `${wfsRef.current.value}?service=WFS&version=1.1.0&request=getFeature&typename=${typename}&outputFormat=application/json&srsname=${CRS}`
    //             const describeFeatureURL = `${wfsRef.current.value}?service=WFS&version=1.1.0&request=DescribeFeatureType&typename=${typename}&outputFormat=application/json`

    //             featurelayers[ title ] = { workspace, title, typename, CRS, getFeatureURL, describeFeatureURL }

    //             layernames.push( featuretype.getElementsByTagName( "Title" )[ 0 ].textContent )

    //             console.log(featurelayers)
    //             console.log(layernames)
    //         }

    //         setLayers( featurelayers )
    //         setLayernames( layernames )

    //         setLoading( false )
    //         setConnected( true )

    //         notifications.show( {
    //             position: 'top-right',
    //             withCloseButton: true,
    //             autoClose: 5000,
    //             title: "Success!",
    //             message: `Connected to WFS Server at: ${wfsRef.current.value}`,
    //             color: 'teal',
    //             icon: <IconCheck />
    //         } )
    //     } catch ( error )
    //     {
    //         notifications.show( {
    //             position: 'top-right',
    //             withCloseButton: true,
    //             autoClose: 5000,
    //             title: "Error!",
    //             message: `Can't connect to WFS Server: check your URL. Check the JS console for detailed error`,
    //             color: 'red',
    //             icon: <IconX />
    //         } )
    //         setWfserror( "Can't connect to WFS Server: check your URL." )
    //         setLoading( false )
    //         console.error( error )
    //     }
    // }




    async function handleLayerSelection( event )
    {
        // if ( layernames.indexOf( event ) === -1 ) return // Just in case...

        const selectedLayer = layers.find( item => item.typeName === event )

        const schema = await wfsDescribeFeatureRequest( selectedLayer.describeFeatureURL )
        // This breaks if there's ever more than one geometry on a feature, but you shouldn't be using this app if that's the case.
        const geometryType = schema.find( column => /gml:\w+/.test( column.type ) ).localType

        const defaultStyle = generateDefaultStyle( geometryType )
        const primitiveGeometryType = getPrimitiveGeometryType( geometryType )

        onLayerSelected( { ...selectedLayer, schema, geometryType, primitiveGeometryType, defaultStyle } )

        dispatch( {
            type: 'setDataSource',
            dataSource: { ...selectedLayer, schema, geometryType, primitiveGeometryType, defaultStyle }
        } )
        dispatch( {
            type: 'setStyle',
            style: generateDefaultStyleObject( primitiveGeometryType )
        } )

        setCurrentLayer( selectedLayer )
        combobox.updateSelectedOptionIndex( 'active' )
        combobox.closeDropdown()
    }


    // const options = []
    const options = layers
        .filter( ( item ) => item.typeName.toLowerCase().includes( layerSearch.toLowerCase().trim() ) )
        .map( layer =>
        {
            return (
                <Combobox.Option value={layer.typeName} key={layer.title}>
                    <Group justify="space-between" w="100%">
                        <Group>
                            {layer.typeName === currentLayer?.typeName && <CheckIcon size={12} />}
                            <IconLayersSubtract />
                            <Badge variant="default" color="blue" radius="xs">{layer.workspace}</Badge>
                            <Text>{layer.title}</Text>
                        </Group>
                        <Badge>{layer.CRS}</Badge>
                    </Group>
                </Combobox.Option>
            )
        } )


    return (
        <Container className="bg-darker" p="md" w="100%">

            <Fieldset legend="Load data from WFS">

                <Stack>


                    <TextInput
                        ref={wfsRef}
                        label="WFS URL"
                        error={wfserror}
                        placeholder="https://example.com/geoserver/wfs"
                        rightSection={
                            <ActionIcon
                                loading={isLoading}
                                color={isLoading ? "yellow" : isConnected ? "green" : "blue"}
                                onClick={getCapabilities}>
                                {isConnected ? <IconCheck /> : <IconPlugConnected />}
                            </ActionIcon>
                        }
                    />

                    <Combobox store={combobox} onOptionSubmit={handleLayerSelection} >
                        <Combobox.Target>
                            <InputBase
                                component="button"
                                type="button"
                                pointer
                                rightSection={<Combobox.Chevron />}
                                rightSectionPointerEvents="none"
                                onClick={() => combobox.toggleDropdown()}
                                disabled={!isConnected}
                            >
                                {currentLayer?.title || <Input.Placeholder>Pick layer</Input.Placeholder>}
                            </InputBase>
                        </Combobox.Target>

                        <Combobox.Dropdown>
                            <Combobox.Search value={layerSearch} onChange={( event ) => setLayerSearch( event.currentTarget.value )} placeholder="Search layers" />
                            <Combobox.Options>
                                {options}
                            </Combobox.Options>
                        </Combobox.Dropdown>
                    </Combobox>

                </Stack>


            </Fieldset>

        </Container>



    )
}