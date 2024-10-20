import { Stack, Container, Flex, Title, ActionIcon, ScrollArea, Text } from "@mantine/core"
import { IconPlus } from "@tabler/icons-react"

import { StyleRule } from "./StyleRule"


export const StylingPanel = ( { layer, onStyleChanged } ) =>
{


    const geometryType = ( layer == null ) ? null : layer.geometryType


    return (
        <Flex direction="column" align="stretch" h="100%">

            <Container w="100%" p="md">
                <Title order={3} mb="xs">Style Rules</Title>
                <Text>{geometryType}</Text>
            </Container>

            <ScrollArea className="bg-darker" p="md" w="100%" h="100%">
                <Stack align="stretch">

                    <StyleRule></StyleRule>
                    <StyleRule></StyleRule>
                    <StyleRule></StyleRule>

                    <ActionIcon color="green"><IconPlus /></ActionIcon>

                </Stack>
            </ScrollArea>

        </Flex>

    )
}