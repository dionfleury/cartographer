import { Stack, Container, Flex, Title, ActionIcon, ScrollArea, Text, Select } from "@mantine/core"
import { IconPlus } from "@tabler/icons-react"

import { StyleRule } from "./StyleRule"

import { useEffect, useState } from "react"

import { useMapStylingContext, useDispatch } from '../context/MapStylingContext'

const colorFormats = [
    { value: 'hex', label: 'HEX' },
    { value: 'hexa', label: 'HEXA' },
    { value: 'rgb', label: 'RGB' },
    { value: 'rgba', label: 'RGBA' },
    { value: 'hsl', label: 'HSL' },
    { value: 'hsla', label: 'HSLA' }
]

export const StylingPanel = ( { layer, onStyleChanged } ) =>
{
    const geometryType = ( layer == null ) ? null : layer.geometryType

    const [ styleRules, setStyleRules ] = useState( [] )


    const dispatch = useDispatch()
    const { style, dataSource } = useMapStylingContext()

    // const [ colorFormat, setcolorFormat ] = useState( 'hexa' )
    // function handlecolorFormatChange( value ) { setcolorFormat( value ) }

    useEffect( () =>
    {
        if ( Object.keys( dataSource ).length == 0 ) return
        const elements = style.Rules.map( ( rule, index ) =>
        {
            return ( <StyleRule key={index} ruleIndex={index} ruleObject={rule} /> )
        } )

        setStyleRules( elements )

    }, [ style ] )

    return (
        <Flex direction="column" align="stretch" h="100%">

            <Container w="100%" p="md">
                <Title order={3} mb="xs">Style Rules</Title>
                <Text>{dataSource.geometryType}</Text>
                {/* <Select data={colorFormats} defaultValue="hexa" allowDeselect={false} onChange={handlecolorFormatChange} label="Format" w="86px" /> */}
            </Container>

            <ScrollArea className="bg-darker" p="md" w="100%" h="100%">
                <Stack align="stretch">

                    {styleRules}

                    <ActionIcon color="green"><IconPlus /></ActionIcon>

                </Stack>
            </ScrollArea>

        </Flex>

    )
}