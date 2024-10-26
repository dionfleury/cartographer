import { Group, TextInput, Text, Fieldset, ActionIcon, Badge, Container, Input, InputBase, CheckIcon, Combobox, useCombobox, Stack } from "@mantine/core"
import { IconPlugConnected, IconX, IconCheck, IconLayersSubtract } from "@tabler/icons-react"

import { useRef, useState } from "react"

import { generateDefaultStyle, generateDefaultStyleObject } from "../scripts/defaultstyles"
import { getPrimitiveGeometryType } from "../scripts/helpers"

import { useDispatch } from "../context/MapStylingContext"

import { wfsDescribeFeatureRequest, wfsGetCapabilitiesRequest } from "../scripts/WFSClient"


export const WFSLayerSelector = ( { onLayerSelected } ) =>
{
    const wfsRef = useRef()
    const [ layers, setLayers ] = useState( [] )
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
        setWfserror( false )

        try
        {
            const featureLayers = await wfsGetCapabilitiesRequest( wfsRef.current.value )
            setLayers( featureLayers )
            setIsLoading( false )
            setIsConnected( true )

        } catch ( error )
        {
            setWfserror( "Can't connect to WFS Server: check your URL." )
            setIsLoading( false )
            console.error( error )
        }
    }

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
                            <ActionIcon loading={isLoading} color={isLoading ? "yellow" : isConnected ? "green" : "blue"} onClick={getCapabilities}>
                                {isConnected ? <IconCheck /> : <IconPlugConnected />}
                            </ActionIcon>
                        }
                    />

                    <Combobox store={combobox} onOptionSubmit={handleLayerSelection} >
                        <Combobox.Target>
                            <InputBase component="button" type="button" pointer rightSection={<Combobox.Chevron />} rightSectionPointerEvents="none" onClick={() => combobox.toggleDropdown()} disabled={!isConnected} >
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