import { Paper, Accordion, ActionIcon } from "@mantine/core"
import { useState } from "react"



import { StyleSymbolizer } from "./StyleSymbolizer"
import { IconPlus } from "@tabler/icons-react"



export const StyleRule = ( { ruleIndex, ruleObject } ) =>
{

    // const [ strokeColour, setStrokeColour ] = useState( '#FF0000FF' )
    // const [ fillColour, setFillColour ] = useState( '#64646440' )


    const symbolizers = ruleObject.Symbolizers.map( ( symbolizer, index ) => ( <StyleSymbolizer key={index} ruleIndex={ruleIndex} symbolizerIndex={index} symbolizerObject={symbolizer} /> ) )

    return (
        <Paper shadow="md" radius="md" p="md">


            {/* <Accordion variant="contained" maw={400} mx="auto"> */}
            <Accordion variant="contained" mb="md">
                {symbolizers}
            </Accordion>

            <ActionIcon color="green"><IconPlus /></ActionIcon>

        </Paper>
    )
}