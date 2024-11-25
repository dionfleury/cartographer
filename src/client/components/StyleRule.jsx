import { Paper, Accordion, ActionIcon, TextInput, Group, Indicator, Title, Popover, Select, Switch, Button } from "@mantine/core"



import { StyleSymbolizer } from "./StyleSymbolizer"
import { IconFilterFilled, IconPlus, IconX } from "@tabler/icons-react"


import { useDispatch, useMapStylingContext } from "../context/MapStylingContext"
import { SchemaAttributeComboBox } from "./SchemaAttributeCombobox"
import { useEffect, useRef, useState } from "react"
import { useDebouncedValue, useDisclosure } from "@mantine/hooks"


const filterOperators = [
    { label: "=", value: "PropertyIsEqualTo" },
    { label: "!=", value: "PropertyIsNotEqualTo" },
    { label: "<", value: "PropertyIsLessThan" },
    { label: "<=", value: "PropertyIsLessThanOrEqualTo" },
    { label: ">", value: "PropertyIsGreaterThan" },
    { label: ">=", value: "PropertyIsGreaterThanOrEqualTo" },
    { label: "LIKE", value: "PropertyIsLike" },
    { label: "NULL", value: "PropertyIsNull" }
]


export const StyleRule = ( { ruleIndex, ruleObject, colorFormat } ) =>
{

    const { dataSource } = useMapStylingContext()
    const dispatch = useDispatch()

    const [ opened, { toggle, close } ] = useDisclosure( false )

    // const [ strokeColour, setStrokeColour ] = useState( '#FF0000FF' )
    // const [ fillColour, setFillColour ] = useState( '#64646440' )

    function handleAddSymbolizer()
    {
        dispatch( {
            type: "addSymbolizer",
            ruleIndex
        } )
    }

    const [ inputValue, setInputValue ] = useState( null )
    const [ ruleName, setRuleName ] = useState( ruleObject.Name )
    const [ debouncedRuleName ] = useDebouncedValue( ruleName, 300 )
    const [ ruleTitle, setRuleTitle ] = useState( ruleObject.Title )
    const [ debouncedRuleTitle ] = useDebouncedValue( ruleTitle, 300 )
    const [ debouncedValue ] = useDebouncedValue( inputValue, 300 )
    const [ filter, setFilter ] = useState( {
        attribute: ruleObject?.Filter?.PropertyName || null,
        operator: ruleObject?.Filter?._type || "PropertyIsEqualTo",
        value: ruleObject?.Filter?.Literal || null,
        matchCase: false
    } )

    function clearFilter()
    {
        setFilter( { attribute: null, operator: "PropertyIsEqualTo", value: null, matchCase: false } )
        dispatch( { type: "filterClear", ruleIndex } )
        close()
    }

    function handleFilterChange( property, value )
    {
        if ( property === 'value' ) setInputValue( value )
        else setFilter( prevFilter => ( { ...prevFilter, [ property ]: value } ) )
    }

    useEffect( () =>
    {
        if ( debouncedValue === '' ) return
        setFilter( prevFilter => ( { ...prevFilter, value: debouncedValue } ) )
    }, [ debouncedValue ] )

    useEffect( () =>
    {
        if ( debouncedRuleName === '' && debouncedRuleTitle === '' ) return
        dispatch( { type: "ruleNameChange", ruleIndex, ruleName, ruleTitle } )
    }, [ debouncedRuleName, debouncedRuleTitle ] )

    useEffect( () =>
    {
        if ( filter.attribute == null || filter.value == null ) return
        dispatch( { type: "filterChange", ruleIndex, filter } )
    }, [ filter ] )

    useEffect( () => { clearFilter() }, [ dataSource ] )

    const symbolizers = ruleObject.Symbolizers.map( ( symbolizer, index ) => ( <StyleSymbolizer key={index} ruleIndex={ruleIndex} symbolizerIndex={index} lastSymbolizerIndex={ruleObject.Symbolizers.length - 1} symbolizerObject={symbolizer} /> ) )

    return (
        <Indicator label="Rule" position="top-start"  size={24} withBorder mt={12}>
            <Paper shadow="md" radius="md" p="md">
                <Group mb="sm" align="end">
                    <TextInput label="Name" defaultValue={ruleObject.Name} onChange={event => setRuleName( event.target.value )} />
                    <TextInput label="Title" defaultValue={ruleObject.Title} onChange={event => setRuleTitle( event.target.value )} />
                    <Popover width={300} trapFocus position="bottom" withArrow shadow="md" closeOnClickOutside={false} opened={opened}>
                        <Popover.Target>
                            <ActionIcon size="lg" onClick={toggle}><IconFilterFilled /></ActionIcon>
                        </Popover.Target>
                        <Popover.Dropdown>
                            <SchemaAttributeComboBox schema={dataSource.schema} defaultValue={filter.attribute} onChange={value => handleFilterChange( 'attribute', value )} />
                            <Group align="end">
                                <Select label="Operator" w={80} value={filter.operator} data={filterOperators} onChange={value => handleFilterChange( 'operator', value )} />
                                <Switch label="Match Case?" size="xl" defaultChecked={filter.matchCase} labelPosition="left" className="match-case-switch" onChange={event => handleFilterChange( 'matchCase', event.currentTarget.checked )} onLabel="YES" offLabel="NO" />
                            </Group>
                            <TextInput label="Value" defaultValue={filter.value} placeholder="value" onChange={event => handleFilterChange( 'value', event.currentTarget.value )} />
                            <Button size="xs" color="red" leftSection={<IconX />} mt="md" onClick={clearFilter}>Clear Filter</Button>
                        </Popover.Dropdown>
                    </Popover>
                </Group>

                <Title order={5}>Symbolizers</Title>
                {/* <Accordion variant="contained" maw={400} mx="auto"> */}
                <Accordion variant="contained" my="md" >
                    {symbolizers}
                </Accordion>

                <ActionIcon color="green" onClick={handleAddSymbolizer}><IconPlus /></ActionIcon>
            </Paper>
        </Indicator>
    )
}