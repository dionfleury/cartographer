import { Stack, Container, Flex, Title, ActionIcon, ScrollArea, Text } from "@mantine/core"
import { IconPlus } from "@tabler/icons-react"

import { StyleRule } from "./StyleRule"

import { useEffect, useState } from "react"

import { useMapStylingContext, useDispatch } from '../context/MapStylingContext'


export const StylingPanel = ( { layer, onStyleChanged } ) =>
{
    const geometryType = ( layer == null ) ? null : layer.geometryType

    const [ styleRules, setStyleRules ] = useState( [] )


    const dispatch = useDispatch()
    const { style, dataSource } = useMapStylingContext()

    useEffect( () =>
    {
        if ( Object.keys( dataSource ).length == 0 ) return
        console.log( style )
        // setStyleRules( generateDefaultStyleRules( layer ) )
        const elements = style.Rules.map( ( rule, index ) =>
        {
            return ( <StyleRule key={index} ruleIndex={index} ruleObject={rule} /> )
        } )

        setStyleRules( elements )



    }, [ style ] )




    // useEffect( () =>
    // {
    //     if ( layer == null ) return
    //     // console.log( layer )
    //     setStyleRules( generateDefaultStyleRules( layer ) )

    // }, [ layer ] )

    // function generateDefaultStyleRules( layer )
    // {
    //     return [
    //         {
    //             id: 0,
    //             type: layer.primitiveGeometryType,
    //             rule: { fill: { color: "#FF0000FF" }, image: null, stroke: { color: "#64646440" } },
    //             element: <StyleRule key={0} id={0} type={layer.primitiveGeometryType} onRuleChanged={handleRuleChanged} />
    //         }
    //     ]
    // }

    // function handleRuleChanged( event )
    // {
    //     const styleRule = styleRules.find( entry => entry.id === event.id )
    //     Object.assign( styleRule.rule, event.rule )
    //     onStyleChanged( styleRules )
    // }

    return (
        <Flex direction="column" align="stretch" h="100%">

            <Container w="100%" p="md">
                <Title order={3} mb="xs">Style Rules</Title>
                <Text>{dataSource.geometryType}</Text>
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