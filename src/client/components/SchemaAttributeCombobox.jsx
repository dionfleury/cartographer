import { Combobox, Group, Input, InputBase, ScrollArea, Text, useCombobox } from "@mantine/core"
import { useState } from "react"
import { assignDatatypeColor } from "../scripts/helpers"

export const SchemaAttributeComboBox = ( { schema, defaultValue, onChange } ) =>
{

    const [ attributeSearch, setAttributeSearch ] = useState( '' )


    const combobox = useCombobox( {
        onDropdownClose: () => combobox.resetSelectedOption(),
    } )
    const [ value, setValue ] = useState( defaultValue )


    const attributeOptions = schema
        .filter( attribute => !attribute.type.match( /^gml/ ) )
        .filter( attribute => attribute.name.toLowerCase().includes( attributeSearch.toLowerCase().trim() ) || attribute.localType.toLowerCase().includes( attributeSearch.toLowerCase().trim() ) )
        // .sort( ( a, b ) =>
        // {
        //     if ( a.name < b.name ) return -1
        //     if ( a.name > b.name ) return 1
        //     return 0
        // } )
        .map( attribute =>
        {
            const color = assignDatatypeColor(attribute.localType)
            return (
                <Combobox.Option value={attribute.name} key={attribute.name}>
                    <Group justify="space-between">
                        <Text>{attribute.name}</Text>
                        <Text c={color} ff="monospace">{attribute.localType}</Text>
                    </Group>
                </Combobox.Option>
            )
        } )


    return (
        <Combobox store={combobox} onOptionSubmit={( val ) =>
        {
            setValue( val )
            combobox.closeDropdown()
            onChange(val)
        }}
        >
            <Combobox.Target>
                <InputBase component="button" type="button" label="Attribute" pointer rightSection={<Combobox.Chevron />} rightSectionPointerEvents="none" onClick={() => combobox.toggleDropdown()}>
                    {value || <Input.Placeholder>Pick attribute</Input.Placeholder>}
                </InputBase>
            </Combobox.Target>

            <Combobox.Dropdown>
                <Combobox.Search value={attributeSearch} onChange={( event ) => setAttributeSearch( event.currentTarget.value )} placeholder="Search attributes by name or data type" />
                <ScrollArea.Autosize mah={256}>
                    <Combobox.Options>{attributeOptions}</Combobox.Options>
                </ScrollArea.Autosize>
            </Combobox.Dropdown>
        </Combobox>
    )
}