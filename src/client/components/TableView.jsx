import { Alert, Container } from "@mantine/core"
import { IconInfoCircle } from "@tabler/icons-react"

export const TableView = () =>
{
    return (
        <Container p="xl">
            <Alert variant="default" title="Table Not Yet Implemented" icon={<IconInfoCircle />}>
                Table View will be implemented in the future.
            </Alert>
        </Container>
    )
}