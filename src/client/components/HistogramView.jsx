import { Alert, Container } from "@mantine/core"
import { IconInfoCircle } from "@tabler/icons-react"

export const HistogramView = () =>
{
    return (
        <Container p="xl">
            <Alert variant="default" title="Histogram Not Yet Implemented" icon={<IconInfoCircle />}>
                Histogram View will be implemented in the future.
            </Alert>
        </Container>
    )
}