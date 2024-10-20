import { Alert, Container, ScrollArea, Table } from "@mantine/core"
import { IconInfoCircle } from '@tabler/icons-react'

export const SchemaView = ( { layer } ) =>
{

    if ( layer == null ) return (
        <Container p="xl">
            <Alert variant="default" title="No Layer Loaded" icon={<IconInfoCircle />}>
                Schema information will be visible after loading a WFS layer. Load a layer from the "Load data from WFS" panel to the left.
            </Alert>
        </Container>
    )


    const rows = layer.schema.map( ( element, index ) => (
        <Table.Tr key={element.name}>
            <Table.Td>{index + 1}</Table.Td>
            <Table.Td>{element.name}</Table.Td>
            <Table.Td ff="monospace">{element.localType}</Table.Td>
            <Table.Td ff="monospace">{element.type}</Table.Td>
        </Table.Tr>
    ) )


    return (
        <ScrollArea h="100%">
            <Table striped captionSide="top">
                <Table.Caption>Schema information for {layer.typename}</Table.Caption>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>#</Table.Th>
                        <Table.Th>Column Name</Table.Th>
                        <Table.Th>Type</Table.Th>
                        <Table.Th>{"Type (xsd)"}</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>
        </ScrollArea>
    )
}