import { Stack, Container, Flex, Title, ActionIcon, ScrollArea, Text } from "@mantine/core"
import { IconPlus } from "@tabler/icons-react"

import { StyleRule } from "./StyleRule"

import { useEffect, useState } from "react"

export const StylingPanel = ( { layer, onStyleChanged } ) =>
{
    const geometryType = ( layer == null ) ? null : layer.geometryType

    const [ styleRules, setStyleRules ] = useState( [] )

    useEffect( () =>
    {
        if ( layer == null ) return
        console.log( layer )
        setStyleRules( generateDefaultStyleRules( layer ) )

    }, [ layer ] )

    function generateDefaultStyleRules( layer )
    {
        return [
            {
                id: 0,
                type: layer.primitiveGeometryType,
                rule: { fill: { color: "#FF0000FF" }, image: null, stroke: { color: "#64646440" } },
                element: <StyleRule key={0} id={0} type={layer.primitiveGeometryType} onRuleChanged={handleRuleChanged} />
            }
        ]
    }

    function handleRuleChanged( event )
    {
        const styleRule = styleRules.find( entry => entry.id === event.id )
        Object.assign( styleRule.rule, event.rule )
        onStyleChanged(styleRules)
    }

    return (
        <Flex direction="column" align="stretch" h="100%">

            <Container w="100%" p="md">
                <Title order={3} mb="xs">Style Rules</Title>
                <Text>{geometryType}</Text>
            </Container>

            <ScrollArea className="bg-darker" p="md" w="100%" h="100%">
                <Stack align="stretch">

                    {styleRules.map( entry => entry.element )}

                    {/* <StyleRule type={geometryType}></StyleRule> */}
                    {/* <StyleRule></StyleRule> */}
                    {/* <StyleRule></StyleRule> */}

                    <ActionIcon color="green"><IconPlus /></ActionIcon>

                </Stack>
            </ScrollArea>

        </Flex>

    )
}